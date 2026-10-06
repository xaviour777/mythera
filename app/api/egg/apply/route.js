export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/egg/apply — cohort question form → GHL contact with tags.
import { handle, json, readJson, HttpError, clean, validEmail, normPhone, clientIp } from '../../../../lib/egg/util.js';
import { underLimit } from '../../../../lib/egg/store.js';
import { syncContact } from '../../../../lib/egg/ghl.js';

const TIERS = { Room: 'tier-room-297', Studio: 'tier-studio-997' };

export const POST = handle(async (request) => {
  if (!(await underLimit(`rl:apply:${clientIp(request)}`, 6, 3600))) throw new HttpError(429, 'Too many messages from this connection. Try again in an hour.');
  const b = await readJson(request);
  if (clean(b.website)) return json({ ok: true });

  const name = clean(b.name, 60);
  const email = clean(b.email, 254).toLowerCase();
  const phone = normPhone(clean(b.whatsapp, 24));
  const tier = TIERS[b.tier] ? b.tier : 'Studio';
  const niche = clean(b.niche, 60);
  const link = clean(b.link, 200);
  const goal = clean(b.goal, 600);
  const source = clean(b.utm_source, 60);

  if (!name) throw new HttpError(400, 'Add your name.');
  if (!validEmail(email)) throw new HttpError(400, 'Add a valid email so we can reply.');
  if (b.whatsapp && !phone) throw new HttpError(400, 'Add your WhatsApp number with the country code.');
  if (b.consent !== true) throw new HttpError(400, 'Tick the box so we can reply to you.');

  const [first, ...rest] = name.split(' ');
  await syncContact({
    firstName: first, lastName: rest.join(' '), email, phone,
    source: source ? `mythrafilm.com/egg · cohort · ${source}` : 'mythrafilm.com/egg · cohort',
    tags: ['cohort-lead', TIERS[tier], 'cohort-1'],
    customFields: { cohort_tier: tier, cohort_niche: niche, cohort_channel_link: link, cohort_goal: goal }
  });
  return json({ ok: true }, 201);
});
