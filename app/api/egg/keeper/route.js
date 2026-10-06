export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/keeper  — hatch: create a Keeper profile, sync to GHL, return the share links.
// GET  /api/keeper?no=K-XXXXXX — public view of a Keeper (no email/phone).
import { handle, json, readJson, HttpError, clean, validEmail, normPhone, newKeeperNo, KEEPER_RE, ELEMENTS, clientIp, firstName, SITE_URL, env } from '../../../../lib/egg/util.js';
import { getKeeper, saveKeeper, claimKeeperNo, linkEmail, linkPhone, underLimit, cmd } from '../../../../lib/egg/store.js';
import { syncContact } from '../../../../lib/egg/ghl.js';

export const POST = handle(async (request) => {
  if (!(await underLimit(`rl:keeper:${clientIp(request)}`, 12, 3600))) throw new HttpError(429, 'Too many eggs from this connection. Try again in an hour.');
  const b = await readJson(request);
  if (clean(b.website)) return json({ ok: true }); // honeypot field: bots fill it, people never see it

  const dragonName = clean(b.dragonName, 20);
  const keeperName = clean(b.keeperName, 40);
  const email = clean(b.email, 254).toLowerCase();
  const phone = normPhone(clean(b.whatsapp, 24));
  const consent = b.consent === true;
  const element = ELEMENTS.includes(b.element) ? b.element : ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  const ref = KEEPER_RE.test(b.ref || '') ? b.ref : '';

  if (!dragonName) throw new HttpError(400, 'Give your dragon a name.');
  if (!keeperName) throw new HttpError(400, 'Tell us your name, Keeper.');
  if (email && !validEmail(email)) throw new HttpError(400, 'That email doesn’t look right. Check it and try again.');
  if (b.whatsapp && !phone) throw new HttpError(400, 'Add your WhatsApp number with the country code, like +92 300 1234567.');
  if ((email || phone) && !consent) throw new HttpError(400, 'Tick the box so we can send your dragon’s updates.');

  let no = '';
  for (let i = 0; i < 5 && !no; i++) { const c = newKeeperNo(); if (await claimKeeperNo(c)) no = c; }
  if (!no) throw new HttpError(500, 'Could not reserve a Keeper number. Try again.');

  const utm = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map((k) => [k, clean(b[k], 80)]).filter(([, v]) => v));
  const shareUrl = `${SITE_URL()}/egg/k/${no}`;
  const profile = {
    no, dragonName, keeperName, element, email, phone, ref,
    consent: consent ? 1 : 0, waOptIn: 0, refCount: 0, shares: 0,
    createdAt: new Date().toISOString(), ...utm
  };
  await saveKeeper(no, profile);
  if (email) await linkEmail(email, no);
  if (phone) await linkPhone(phone, no);

  if (ref && ref !== no && (await getKeeper(ref))) {
    await cmd('HINCRBY', `keeper:${ref}`, 'refCount', 1);
    await cmd('ZINCRBY', 'board:referrals', 1, ref);
  }

  const crm = await syncContact({
    firstName: firstName(keeperName), email, phone,
    source: utm.utm_source ? `egg · ${utm.utm_source}` : 'mythrafilm.com/egg',
    tags: ['mythra-keeper', 'egg-hatched', `element-${element.toLowerCase()}`, ...(ref ? ['referred'] : [])],
    customFields: { dragon_name: dragonName, keeper_number: no, keeper_card_url: shareUrl, dragon_element: element, referred_by: ref }
  });
  if (crm.id) await saveKeeper(no, { ghlId: crm.id });

  const waNumber = env('WA_PUBLIC_NUMBER').replace(/\D/g, '');
  return json({
    ok: true,
    keeper: { no, dragonName, keeperName, element, createdAt: profile.createdAt },
    shareUrl,
    waLink: waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`🐉 HATCH ${no}`)}` : null
  }, 201);
});

export const GET = handle(async (request) => {
  const no = new URL(request.url).searchParams.get('no') || '';
  if (!KEEPER_RE.test(no)) throw new HttpError(400, 'Unknown Keeper number.');
  const k = await getKeeper(no);
  if (!k) throw new HttpError(404, 'No Keeper with that number.');
  return json({ ok: true, keeper: { no: k.no, dragonName: k.dragonName, keeperName: firstName(k.keeperName), element: k.element, createdAt: k.createdAt, refCount: Number(k.refCount || 0) } },
    200, { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=600' });
});
