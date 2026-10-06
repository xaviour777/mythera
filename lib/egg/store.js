// Small Redis helper on Upstash (REST API, no SDK) — used for rate limiting the question form.
// Works with Vercel's Upstash integration (KV_REST_API_*) or plain UPSTASH_REDIS_REST_*.
// Without credentials it falls back to memory so local tests run; data is lost on restart.
import { env } from './util.js';

const URL_ = () => env('UPSTASH_REDIS_REST_URL') || env('KV_REST_API_URL');
const TOKEN = () => env('UPSTASH_REDIS_REST_TOKEN') || env('KV_REST_API_TOKEN');
export const storeConfigured = () => Boolean(URL_() && TOKEN());

async function rest(path, body) {
  const r = await fetch(URL_() + path, {
    method: 'POST',
    headers: { authorization: `Bearer ${TOKEN()}`, 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Redis ${r.status}: ${await r.text()}`);
  return r.json();
}

/* ---------- memory fallback (tests / local only) ---------- */
const mem = globalThis.__mythraMem || (globalThis.__mythraMem = { kv: new Map(), exp: new Map() });
function alive(k) { const e = mem.exp.get(k); if (e && e < Date.now()) { mem.kv.delete(k); mem.exp.delete(k); } return mem.kv.has(k); }
function memCmd([c, ...a]) {
  c = c.toUpperCase();
  const k = a[0];
  switch (c) {
    case 'GET': return alive(k) ? mem.kv.get(k) : null;
    case 'SET': {
      const nx = a.includes('NX'); const exi = a.indexOf('EX');
      if (nx && alive(k)) return null;
      mem.kv.set(k, String(a[1])); if (exi > -1) mem.exp.set(k, Date.now() + Number(a[exi + 1]) * 1000);
      return 'OK';
    }
    case 'DEL': return mem.kv.delete(k) ? 1 : 0;
    case 'INCR': { const v = (alive(k) ? Number(mem.kv.get(k)) : 0) + 1; mem.kv.set(k, String(v)); return v; }
    case 'EXPIRE':
      if (!alive(k) || (a[2] === 'NX' && mem.exp.has(k))) return 0;
      mem.exp.set(k, Date.now() + Number(a[1]) * 1000); return 1;
    case 'HSET': { const h = alive(k) ? mem.kv.get(k) : {}; for (let i = 1; i < a.length; i += 2) h[a[i]] = String(a[i + 1]); mem.kv.set(k, h); return 1; }
    case 'HGETALL': { const h = alive(k) ? mem.kv.get(k) : {}; return Object.entries(h).flat(); }
    case 'HINCRBY': { const h = alive(k) ? mem.kv.get(k) : {}; h[a[1]] = String((Number(h[a[1]]) || 0) + Number(a[2])); mem.kv.set(k, h); return Number(h[a[1]]); }
    case 'ZINCRBY': { const z = alive(k) ? mem.kv.get(k) : {}; z[a[2]] = (z[a[2]] || 0) + Number(a[1]); mem.kv.set(k, z); return z[a[2]]; }
    case 'ZREVRANGE': { const z = alive(k) ? mem.kv.get(k) : {}; const s = Object.entries(z).sort((x, y) => y[1] - x[1]).slice(Number(a[1]), Number(a[2]) + 1); return a.includes('WITHSCORES') ? s.flat().map(String) : s.map((x) => x[0]); }
    default: throw new Error('memory store: unsupported ' + c);
  }
}

export async function cmd(...args) {
  if (!storeConfigured()) return memCmd(args.map(String));
  const { result, error } = await rest('', args.map(String));
  if (error) throw new Error(error);
  return result;
}

export async function pipe(cmds) {
  if (!cmds.length) return [];
  if (!storeConfigured()) return cmds.map((c) => memCmd(c.map(String)));
  const out = await rest('/pipeline', cmds.map((c) => c.map(String)));
  return out.map((x) => { if (x.error) throw new Error(x.error); return x.result; });
}

const toObj = (arr) => { const o = {}; for (let i = 0; i < (arr || []).length; i += 2) o[arr[i]] = arr[i + 1]; return o; };

/* ---------- helpers ---------- */
// Fixed-window counter. Returns true while under the limit.
export async function underLimit(key, limit, windowSec) {
  const [n] = await pipe([['INCR', key], ['EXPIRE', key, windowSec, 'NX']]);
  return Number(n) <= limit;
}
// One-time flag. Returns true the first time it is set.
export async function once(key, ttlSec = 86400) {
  return (await cmd('SET', key, '1', 'NX', 'EX', ttlSec)) === 'OK';
}
export const toObject = toObj;
