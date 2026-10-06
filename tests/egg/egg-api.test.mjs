// Egg API tests with GHL mocked. Run: node --test tests/egg/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.EGG_SITE_URL = 'https://mythrafilm.com';
process.env.GHL_API_KEY = 'pit-test';
process.env.GHL_LOCATION_ID = 'loc123';
process.env.WHOP_ROOM_URL = 'https://whop.com/checkout/room-test';

const calls = [];
globalThis.fetch = async (url, opts = {}) => {
  const body = opts.body ? JSON.parse(opts.body) : null;
  calls.push({ url: String(url), body });
  if (String(url).includes('/contacts/upsert')) return Response.json({ new: true, contact: { id: 'ghl_1' } });
  if (String(url).includes('/tags')) return Response.json({ tags: body.tags });
  throw new Error('unexpected fetch ' + url);
};

const apply = await import('../../app/api/egg/apply/route.js');
const config = await import('../../app/api/egg/config/route.js');
const req = (body) => new Request('https://mythrafilm.com/api/egg/apply', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '9.9.9.' + Math.floor(Math.random() * 200) }, body: JSON.stringify(body)
});

test('config exposes Whop checkout links', async () => {
  const j = await config.GET().json();
  assert.equal(j.checkout.room, 'https://whop.com/checkout/room-test');
  assert.equal(j.checkout.studio, 'https://whop.com/zetomate-5424/mythra-drama-method-writers-room-studio-seat/');
});

test('question form creates a GHL contact with seat tags', async () => {
  const r = await apply.POST(req({ name: 'Sara Ahmed', email: 'Sara@x.com', whatsapp: '0300 1234567', tier: 'Studio', consent: true, utm_source: 'tiktok' }));
  assert.equal(r.status, 201);
  const up = calls.find((c) => c.url.endsWith('/contacts/upsert'));
  assert.equal(up.body.email, 'sara@x.com');
  assert.equal(up.body.phone, '+923001234567');
  assert.equal(up.body.source, 'mythrafilm.com/egg · cohort · tiktok');
  assert.deepEqual(calls.find((c) => c.url.includes('/tags')).body.tags, ['cohort-lead', 'tier-studio-997', 'cohort-1']);
});

test('validation and spam protection', async () => {
  assert.equal((await apply.POST(req({ name: 'A', email: 'bad', consent: true }))).status, 400);
  assert.equal((await apply.POST(req({ name: 'A', email: 'a@b.co' }))).status, 400);
  const before = calls.length;
  assert.equal((await apply.POST(req({ name: 'Bot', email: 'b@b.co', consent: true, website: 'spam' }))).status, 200);
  assert.equal(calls.length, before, 'honeypot submissions never reach GHL');
});
