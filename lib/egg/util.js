// Shared helpers for MYTHRA egg functions. No dependencies.

export const env = (k, d = '') => (process.env[k] ?? d).toString().trim();

export const SITE_URL = () => (env('EGG_SITE_URL') || 'https://mythrafilm.com').replace(/\/+$/, '');

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra }
  });
}

export async function readJson(request, max = 16_000) {
  const text = await request.text();
  if (text.length > max) throw new HttpError(413, 'Request too large.');
  try { return JSON.parse(text || '{}'); } catch { throw new HttpError(400, 'Send valid JSON.'); }
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function handle(fn) {
  return async (request) => {
    try { return await fn(request); }
    catch (e) {
      if (e instanceof HttpError) return json({ ok: false, error: e.message }, e.status);
      console.error('[mythra]', e);
      return json({ ok: false, error: 'Something went wrong on our side. Please try again.' }, 500);
    }
  };
}

// Trim, strip control characters and angle brackets, cap length.
export function clean(v, max = 80) {
  if (v == null) return '';
  return String(v).replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export const validEmail = (e) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(e);

// Normalise a phone number to E.164 ("+923001234567"). Returns '' when unusable.
export function normPhone(input, defaultCC = env('DEFAULT_COUNTRY_CODE', '92')) {
  if (!input) return '';
  let d = String(input).replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  else if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = defaultCC + d.slice(1);
  d = d.replace(/\D/g, '');
  return d.length >= 8 && d.length <= 15 ? '+' + d : '';
}


export function clientIp(request) {
  return (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

