export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// /api/wa-webhook — Meta WhatsApp Cloud API webhook.
// GET  : Meta's verification handshake.
// POST : inbound messages. One short reply per user message, only inside a window the user opened,
//        and only while the free allowance lasts (see _lib/wa.js). Never sends templates.
import { env, json, SITE_URL, normPhone, firstName } from '../../../../lib/egg/util.js';
import { getKeeper, saveKeeper, keeperByPhone, linkPhone, once } from '../../../../lib/egg/store.js';
import { syncContact, addTags } from '../../../../lib/egg/ghl.js';
import { verifySignature, canReply, sendText, sendImage, markFreeEntry, markRead } from '../../../../lib/egg/wa.js';

export function GET(request) {
  const p = new URL(request.url).searchParams;
  if (p.get('hub.mode') === 'subscribe' && p.get('hub.verify_token') && p.get('hub.verify_token') === env('WA_VERIFY_TOKEN')) {
    return new Response(p.get('hub.challenge') || '', { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(request) {
  const raw = await request.text();
  if (!(await verifySignature(raw, request.headers.get('x-hub-signature-256')))) return new Response('Bad signature', { status: 401 });
  let body; try { body = JSON.parse(raw); } catch { return new Response('ok'); }

  const jobs = [];
  for (const entry of body.entry || []) for (const ch of entry.changes || []) {
    const v = ch.value || {};
    const names = Object.fromEntries((v.contacts || []).map((c) => [c.wa_id, c.profile?.name || '']));
    for (const m of v.messages || []) jobs.push(onMessage(m, names[m.from] || ''));
  }
  // Statuses (sent/delivered/read) need no action.
  await Promise.allSettled(jobs);
  return json({ ok: true });
}

const site = () => SITE_URL();

async function onMessage(m, profileName) {
  if (!(await once(`wa:msg:${m.id}`, 3 * 86400))) return; // Meta retries; handle each message once
  const waId = m.from;                      // digits, e.g. 923001234567
  const phone = normPhone('+' + waId);
  const text = (m.text?.body || m.button?.text || m.interactive?.button_reply?.title || '').trim();
  const fromAd = Boolean(m.referral);       // Click-to-WhatsApp ad or Page CTA → 72h free window
  if (fromAd) await markFreeEntry(waId);
  await markRead(m.id);

  const code = (text.match(/K-[A-HJ-NP-Z2-9]{6}/i) || [])[0]?.toUpperCase();
  const word = text.toUpperCase().replace(/[^A-Z]/g, ' ').trim().split(/\s+/)[0] || '';

  // 1) Keeper linking their dragon: "🐉 HATCH K-XXXXXX"
  if (code) {
    const k = await getKeeper(code);
    if (k) {
      await saveKeeper(code, { phone: k.phone || phone, waOptIn: 1, waName: profileName });
      await linkPhone(phone, code);
      const crm = await syncContact({
        firstName: firstName(k.keeperName) || firstName(profileName), email: k.email, phone,
        source: 'whatsapp', tags: ['wa-optin', 'mythra-keeper'],
        customFields: { dragon_name: k.dragonName, keeper_number: code, keeper_card_url: `${site()}/egg/k/${code}` }
      });
      if (crm.id && !k.ghlId) await saveKeeper(code, { ghlId: crm.id });
      return reply(waId, k, 'card', {
        image: `${site()}/egg/wa-card.jpg`,
        caption: `🐉 ${k.dragonName} is safe with you, Keeper ${firstName(k.keeperName)}.\n\nYour Keeper card: ${site()}/egg/k/${code}\nShare it — every friend who hatches through your link moves you up the Keeper board.\n\nReply EPISODE for Episode 2 news, or COHORT to learn AI filmmaking with Zahid Iqbal.`
      });
    }
  }

  const known = await keeperByPhone(phone);
  const k = known ? await getKeeper(known) : null;

  if (word === 'STOP') {
    if (k) await saveKeeper(k.no, { waOptIn: 0 });
    await addTags(k?.ghlId, ['wa-optout']);
    return reply(waId, k, 'stop', { text: 'Done. MYTHRA won’t message you on WhatsApp. Send START anytime to come back.' });
  }
  if (word === 'START' && k) await saveKeeper(k.no, { waOptIn: 1 });
  if (word === 'EPISODE') {
    return reply(waId, k, 'episode', { text: `🎬 Episode 2 of The Mother’s Monster is coming. On release day, send EPISODE here and you’ll get the link before anyone else.\n\nWatch Episode 1: ${env('EPISODE1_URL', site())}` });
  }
  if (word === 'COHORT') {
    if (k) await addTags(k.ghlId, ['asked-cohort']);
    return reply(waId, k, 'cohort', { text: `🎥 The Drama Method Writers’ Room: 6 weekly sprints with Zahid Iqbal. You ship a real AI film by week 6.\n\nSeats and application: ${site()}/egg#cohort` });
  }
  if (k) {
    return reply(waId, k, 'menu', { text: `Hi Keeper ${firstName(k.keeperName)} 🐉 ${k.dragonName} is doing well.\n\nYour card: ${site()}/egg/k/${k.no}\nReply EPISODE or COHORT.` });
  }
  // Someone new (often from an ad): invite them to hatch.
  await syncContact({ firstName: firstName(profileName), phone, source: fromAd ? 'whatsapp · ad' : 'whatsapp', tags: ['wa-lead'] });
  return reply(waId, null, 'invite', { text: `Welcome to MYTHRA 🐉 Your dragon egg is waiting.\n\nHatch it here (free, 30 seconds): ${site()}/egg?utm_source=whatsapp&utm_medium=chat\n\nThen tap “Send my dragon to WhatsApp” and it will live here with you.` });
}

async function reply(waId, k, kind, { text, image, caption }) {
  const gate = await canReply(waId);
  if (!gate.ok) {
    // Out of the free allowance: leave it for a human in the inbox instead of paying per message.
    console.warn('[wa] reply held', kind, gate.reason);
    if (k?.ghlId) await addTags(k.ghlId, ['wa-needs-human']);
    return;
  }
  return image ? sendImage(waId, image, caption, gate) : sendText(waId, text, gate);
}
