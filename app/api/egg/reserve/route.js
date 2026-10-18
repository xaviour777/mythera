export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/egg/reserve — someone joins the dragon's Kickstarter launch list (with the reward they want) → GHL contact with tags.
import { handle, json, readJson, HttpError, clean, validEmail, normPhone, clientIp } from '../../../../lib/egg/util.js';
import { underLimit } from '../../../../lib/egg/store.js';
import { syncContact } from '../../../../lib/egg/ghl.js';

const TIERS = ['ember', 'keeper', 'hatchling', 'nest', 'patron'];
const LANGS = ['en', 'ur', 'hi', 'ar', 'es', 'id'];

export const POST = handle(async (request) => {
  if (!(await underLimit(`rl:reserve:${clientIp(request)}`, 6, 3600))) throw new HttpError(429, 'Too many requests from this connection. Try again in an hour.');
  const b = await readJson(request);
  if (clean(b.website)) return json({ ok: true });

  const name = clean(b.name, 60);
  const email = clean(b.email, 254).toLowerCase();
  const phone = normPhone(clean(b.whatsapp, 24));
  const tier = TIERS.includes(b.tier) ? b.tier : 'keeper';
  const lang = LANGS.includes(b.lang) ? b.lang : 'en';
  const country = clean(b.country, 60);
  const source = clean(b.utm_source, 60);
  const cofounder = Number.isInteger(b.cofounder) && b.cofounder > 0 ? b.cofounder : '';

  if (!name) throw new HttpError(400, 'Add your name.');
  if (!validEmail(email)) throw new HttpError(400, 'Add a valid email.');
  if (b.whatsapp && !phone) throw new HttpError(400, 'Add your WhatsApp number with the country code.');
  if (b.consent !== true) throw new HttpError(400, 'Tick the box so we can contact you.');

  const [first, ...rest] = name.split(' ');
  const lead = {
    firstName: first, lastName: rest.join(' '), email, phone,
    source: source ? `mythrafilm.com/egg · dragon · ${source}` : 'mythrafilm.com/egg · dragon',
    tags: ['dragon-backer-interest', 'kickstarter-launch-list', `dragon-tier-${tier}`, `lang-${lang}`],
    customFields: { dragon_tier: tier, dragon_country: country, dragon_lang: lang, dragon_cofounder_no: cofounder }
  };
  const synced = await syncContact(lead);
  // If GHL didn't take it, keep the lead in the server log (Vercel → Logs) so it can be added by hand.
  if (!synced.ok) console.error('[egg] launch-list lead not in GHL', JSON.stringify({ ...lead, result: synced }));
  return json({ ok: true }, 201);
});
