export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/join/apply — the /join cohort landing page's question form → GHL contact with tags.
// Same fields and tags as the /egg form, plus the studio junk-lead screening for ad traffic.
import { handle, json, readJson, HttpError, clean, validEmail, normPhone, clientIp } from '@/lib/egg/util.js';
import { underLimit } from '@/lib/egg/store.js';
import { syncContact as syncEggContact } from '@/lib/egg/ghl.js';
import { screenLead, emailDomainAccepts } from '@/lib/studio/lead-guard';

// ghl.js is plain JS; its `tags = []` default makes TypeScript infer never[].
const syncContact = syncEggContact as unknown as (contact: { firstName: string; lastName: string; email: string; phone: string; source: string; tags: string[]; customFields: Record<string, string> }) => Promise<unknown>;
const TIERS: Record<string, string> = { Room: 'tier-room-297', Studio: 'tier-studio-997' };

export const POST = handle(async (request: Request) => {
  if (!(await underLimit(`rl:join:${clientIp(request)}`, 6, 3600))) throw new HttpError(429, 'Too many messages from this connection. Try again in an hour.');
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

  const screened = screenLead({ kind: 'cohort', name, email, company: '', role: '', country: '', message: goal, elapsedMs: typeof b.elapsedMs === 'number' ? b.elapsedMs : undefined });
  if (screened?.bot) { console.warn('MYTHRA cohort lead dropped as automated:', email); return json({ ok: true }); }
  if (screened) throw new HttpError(400, screened.error);
  if (!(await emailDomainAccepts(email))) throw new HttpError(400, 'That email address cannot receive mail. Please check it.');

  const [first, ...rest] = name.split(' ');
  await syncContact({
    firstName: first, lastName: rest.join(' '), email, phone,
    source: source ? `mythrafilm.com/join · cohort · ${source}` : 'mythrafilm.com/join · cohort',
    tags: ['cohort-lead', TIERS[tier], 'cohort-1', 'join-landing'],
    customFields: { cohort_tier: tier, cohort_niche: niche, cohort_channel_link: link, cohort_goal: goal }
  });
  return json({ ok: true }, 201);
});
