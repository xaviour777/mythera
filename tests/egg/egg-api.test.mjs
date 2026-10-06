// Runs the functions end to end with GHL and Meta mocked. No network, no Redis needed.
//   node --test tests/egg/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

process.env.EGG_SITE_URL = 'https://mythrafilm.com';
process.env.GHL_API_KEY = 'pit-test';
process.env.GHL_LOCATION_ID = 'loc123';
process.env.WA_TOKEN = 'wa-test';
process.env.WA_PHONE_NUMBER_ID = '111';
process.env.WA_PUBLIC_NUMBER = '+92 300 0000000';
process.env.WA_VERIFY_TOKEN = 'verify-me';
process.env.WA_APP_SECRET = 'app-secret';
process.env.WA_MONTHLY_CAP = '3';

const calls = [];
globalThis.fetch = async (url, opts = {}) => {
  const body = opts.body ? JSON.parse(opts.body) : null;
  calls.push({ url: String(url), body, headers: opts.headers });
  if (String(url).includes('/contacts/upsert')) return Response.json({ new: true, contact: { id: 'ghl_' + calls.length } });
  if (String(url).includes('/tags')) return Response.json({ tags: body.tags });
  if (String(url).includes('graph.facebook.com')) return Response.json({ messages: [{ id: 'wamid.' + calls.length }] });
  throw new Error('unexpected fetch ' + url);
};

const keeperApi = await import('../../app/api/egg/keeper/route.js');
const applyApi = await import('../../app/api/egg/apply/route.js');
const webhook = await import('../../app/api/egg/wa-webhook/route.js');
const card = await import('../../lib/egg/card.js');
const trackApi = await import('../../app/api/egg/track/route.js');

const req = (url, body, headers = {}) => new Request('https://mythrafilm.com' + url, {
  method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.' + Math.floor(Math.random() * 200), ...headers },
  body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined
});
const signed = (payload) => {
  const raw = JSON.stringify(payload);
  const sig = 'sha256=' + crypto.createHmac('sha256', 'app-secret').update(raw).digest('hex');
  return req('/api/egg/wa-webhook', raw, { 'x-hub-signature-256': sig });
};
const inbound = (from, text, extra = {}) => ({ entry: [{ changes: [{ value: { contacts: [{ wa_id: from, profile: { name: 'Ali' } }], messages: [{ id: 'm' + Math.random(), from, type: 'text', text: { body: text }, ...extra }] } }] }] });
const waSends = () => calls.filter((c) => c.url.includes('graph.facebook.com') && c.body?.type);

let keeper;

test('hatch creates a Keeper, syncs GHL with tags and custom fields', async () => {
  const r = await keeperApi.POST(req('/api/egg/keeper', { dragonName: 'Noor', keeperName: 'Zara Khan', whatsapp: '0300 1234567', email: 'Zara@Example.com', consent: true, utm_source: 'tiktok' }));
  assert.equal(r.status, 201);
  const j = await r.json();
  keeper = j.keeper;
  assert.match(keeper.no, /^K-[A-Z2-9]{6}$/);
  assert.equal(j.shareUrl, `https://mythrafilm.com/egg/k/${keeper.no}`);
  assert.equal(j.waLink, `https://wa.me/923000000000?text=${encodeURIComponent('🐉 HATCH ' + keeper.no)}`);
  const up = calls.find((c) => c.url.endsWith('/contacts/upsert'));
  assert.equal(up.body.phone, '+923001234567');
  assert.equal(up.body.email, 'zara@example.com');
  assert.equal(up.body.firstName, 'Zara');
  assert.ok(up.body.customFields.some((f) => f.key === 'dragon_name' && f.field_value === 'Noor'));
  const tags = calls.find((c) => c.url.includes('/tags'));
  assert.ok(tags.body.tags.includes('mythra-keeper'));
});

test('validation: consent is required when contact details are given', async () => {
  const r = await keeperApi.POST(req('/api/egg/keeper', { dragonName: 'Ash', keeperName: 'Omar', email: 'o@x.com' }));
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /Tick the box/);
});

test('a hatch without contact details works and skips GHL', async () => {
  const before = calls.length;
  const r = await keeperApi.POST(req('/api/egg/keeper', { dragonName: 'Ash', keeperName: 'Omar', ref: keeper.no }));
  assert.equal(r.status, 201);
  assert.equal(calls.slice(before).filter((c) => c.url.includes('leadconnector')).length, 0);
  const pub = await (await keeperApi.GET(req(`/api/egg/keeper?no=${keeper.no}`))).json();
  assert.equal(pub.keeper.refCount, 1, 'referral credited to the inviter');
  assert.equal(pub.keeper.keeperName, 'Zara');
  assert.equal(pub.keeper.email, undefined, 'no private fields in the public view');
});

test('share page has rich preview tags and escapes names', async () => {
  const r = await keeperApi.POST(req('/api/egg/keeper', { dragonName: '<b>X"', keeperName: 'Q' }));
  const { keeper: k } = await r.json();
  const html = await (await card.cardResponse(k.no)).text();
  assert.match(html, /og:image" content="https:\/\/mythrafilm.com\/egg\/og.jpg"/);
  assert.ok(!html.includes('<b>X'), 'html in names is stripped or escaped');
  const html2 = await (await card.cardResponse(keeper.no)).text();
  assert.match(html2, /Noor has hatched/);
  assert.match(html2, new RegExp(`ref=${keeper.no}`));
});

test('webhook verification handshake', async () => {
  const ok = await webhook.GET(req('/api/wa-webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=42'));
  assert.equal(await ok.text(), '42');
  const bad = await webhook.GET(req('/api/wa-webhook?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=42'));
  assert.equal(bad.status, 403);
});

test('webhook rejects unsigned posts', async () => {
  const r = await webhook.POST(req('/api/egg/wa-webhook', inbound('923001234567', 'hi')));
  assert.equal(r.status, 401);
});

test('HATCH code links WhatsApp, tags GHL, replies once with the card', async () => {
  const before = waSends().length;
  const payload = inbound('923001234567', `🐉 HATCH ${keeper.no}`);
  await webhook.POST(signed(payload));
  await webhook.POST(signed(payload)); // Meta retry of the same message id
  const sent = waSends().slice(before);
  assert.equal(sent.length, 1, 'exactly one reply despite the retry');
  assert.equal(sent[0].body.type, 'image');
  assert.match(sent[0].body.image.caption, /Noor is safe with you, Keeper Zara/);
  const tag = calls.filter((c) => c.url.includes('/tags')).at(-1);
  assert.ok(tag.body.tags.includes('wa-optin'));
});

test('never sends templates; replies stop at the monthly cap; ad leads stay free', async () => {
  // cap is 3 in this test; 1 used above
  await webhook.POST(signed(inbound('923001234567', 'COHORT')));
  await webhook.POST(signed(inbound('923331112222', 'hello')));          // new lead → invite
  const atCap = waSends().length;
  await webhook.POST(signed(inbound('923449998888', 'hello')));          // over cap → held
  assert.equal(waSends().length, atCap, 'no reply once the free allowance cap is reached');
  await webhook.POST(signed(inbound('923556667777', 'hi', { referral: { source_type: 'ad', source_id: '1' } })));
  assert.equal(waSends().length, atCap + 1, 'ad (free entry point) leads still get a reply');
  assert.ok(waSends().every((c) => c.body.type !== 'template'));
});

test('per-user daily limit', async () => {
  process.env.WA_MONTHLY_CAP = '1000';
  const u = '923771234567';
  const before = waSends().length;
  for (let i = 0; i < 5; i++) await webhook.POST(signed(inbound(u, 'hello ' + i)));
  assert.equal(waSends().length - before, 3);
});

test('cohort application syncs with tier tag', async () => {
  const r = await applyApi.POST(req('/api/egg/apply', { name: 'Sara Ahmed', email: 'sara@x.com', tier: 'Studio', consent: true, keeperNo: keeper.no }));
  assert.equal(r.status, 201);
  const tags = calls.filter((c) => c.url.includes('/tags')).at(-1);
  assert.deepEqual(tags.body.tags, ['cohort-applicant', 'tier-studio-997', 'cohort-1']);
});

test('share tracking tags the contact once', async () => {
  const before = calls.filter((c) => c.url.includes('/tags')).length;
  await trackApi.POST(req('/api/egg/track', { no: keeper.no, event: 'share_whatsapp' }));
  await trackApi.POST(req('/api/egg/track', { no: keeper.no, event: 'share_facebook' }));
  const after = calls.filter((c) => c.url.includes('/tags')).slice(before);
  assert.equal(after.length, 1);
  assert.deepEqual(after[0].body.tags, ['shared-card']);
});
