// WhatsApp Cloud API (Meta) — budget-guarded sender.
//
// Cost rules this module is built around (Meta pricing, from 1 Oct 2026):
//  • Messages the USER sends are always free.
//  • Our replies (non-template "service" messages) are free for the first 1,000 per number per month,
//    then billed per delivered message at the recipient country's utility rate.
//  • A user who arrives from a Click-to-WhatsApp ad or a Facebook Page CTA opens a 72-hour
//    Free Entry Point window: every reply in it is free and does not use the 1,000.
//  • We never send template messages, so we never message anyone outside a window they opened.
//
// Guards: WA_MONTHLY_CAP (default 950, stays under the 1,000) and WA_DAILY_PER_USER (default 3).
// When a guard blocks a reply, the contact is tagged in GHL for a human to answer from the inbox.
import { env, monthKey, dayKey } from './util.js';
import { cmd, pipe } from './store.js';

export const waConfigured = () => Boolean(env('WA_TOKEN') && env('WA_PHONE_NUMBER_ID'));
const GRAPH = () => `https://graph.facebook.com/${env('WA_GRAPH_VERSION', 'v23.0')}/${env('WA_PHONE_NUMBER_ID')}/messages`;

export async function verifySignature(raw, header) {
  const secret = env('WA_APP_SECRET');
  if (!secret) return env('NODE_ENV') !== 'production' && env('VERCEL_ENV') !== 'production';
  if (!header || !header.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)));
  const hex = Array.from(sig, (b) => b.toString(16).padStart(2, '0')).join('');
  const given = header.slice(7);
  if (given.length !== hex.length) return false;
  let diff = 0; for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

export async function markFreeEntry(waId) { await cmd('SET', `wa:fep:${waId}`, '1', 'EX', 72 * 3600); }
export async function inFreeEntry(waId) { return (await cmd('GET', `wa:fep:${waId}`)) === '1'; }

// Decide whether a reply may be sent without leaving the free allowance.
export async function canReply(waId) {
  const daily = Number(env('WA_DAILY_PER_USER', '3'));
  const [userCount] = await pipe([['INCR', `wa:u:${waId}:${dayKey()}`], ['EXPIRE', `wa:u:${waId}:${dayKey()}`, 172800, 'NX']]);
  if (Number(userCount) > daily) return { ok: false, reason: 'daily-user-cap' };
  if (await inFreeEntry(waId)) return { ok: true, free: 'fep' };
  const cap = Number(env('WA_MONTHLY_CAP', '950'));
  const used = Number((await cmd('GET', `wa:sent:${monthKey()}`)) || 0);
  if (used >= cap) return { ok: false, reason: 'monthly-cap' };
  return { ok: true, free: 'allowance' };
}

async function post(payload, countAgainstAllowance) {
  if (!waConfigured()) return { skipped: true };
  const r = await fetch(GRAPH(), {
    method: 'POST',
    headers: { authorization: `Bearer ${env('WA_TOKEN')}`, 'content-type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', ...payload })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('[wa] send', r.status, JSON.stringify(data).slice(0, 400)); return { ok: false, status: r.status }; }
  if (countAgainstAllowance) await pipe([['INCR', `wa:sent:${monthKey()}`], ['EXPIRE', `wa:sent:${monthKey()}`, 40 * 86400, 'NX']]);
  return { ok: true, id: data?.messages?.[0]?.id };
}

export const sendText = (to, body, gate) =>
  post({ to, type: 'text', text: { preview_url: true, body: body.slice(0, 4000) } }, gate?.free !== 'fep');

export const sendImage = (to, link, caption, gate) =>
  post({ to, type: 'image', image: { link, caption: caption.slice(0, 1024) } }, gate?.free !== 'fep');

export async function markRead(messageId) {
  if (!waConfigured() || !messageId) return;
  // Read receipts are not billed.
  await fetch(GRAPH(), {
    method: 'POST',
    headers: { authorization: `Bearer ${env('WA_TOKEN')}`, 'content-type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', status: 'read', message_id: messageId })
  }).catch(() => {});
}
