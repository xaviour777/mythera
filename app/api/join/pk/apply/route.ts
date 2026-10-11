export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/join/pk/apply — the /join/pk Pakistan page's join form (name + WhatsApp) → GHL contact tagged join-pk.
// Payment happens off-site by QR (JazzCash, Easypaisa, bank apps), so every lead starts as payment-pending.
import { handle, json, readJson, HttpError, clean, normPhone, clientIp } from '@/lib/egg/util.js';
import { underLimit } from '@/lib/egg/store.js';
import { syncContact as syncEggContact } from '@/lib/egg/ghl.js';
import { screenLead } from '@/lib/studio/lead-guard';

// ghl.js is plain JS; its `tags = []` default makes TypeScript infer never[].
const syncContact = syncEggContact as unknown as (contact: { firstName: string; lastName: string; email: string; phone: string; source: string; tags: string[]; customFields: Record<string, string> }) => Promise<unknown>;
const TIERS: Record<string, string> = { Room: 'tier-room-pk', Studio: 'tier-studio-pk' };
// The page is English by default with an Urdu toggle; errors come back in the visitor's language.
const MSG = {
  en: { rate: 'Too many tries from this connection. Please try again in an hour.', name: 'Please enter your name.', wa: 'Please enter a valid WhatsApp number, like 0300 1234567.', real: 'Please enter your real name.' },
  ur: { rate: 'ایک گھنٹے میں بہت زیادہ کوششیں ہو گئیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔', name: 'براہِ کرم اپنا نام لکھیں۔', wa: 'براہِ کرم درست WhatsApp نمبر لکھیں، جیسے 0300 1234567', real: 'براہِ کرم اپنا اصل نام لکھیں۔' }
};

export const POST = handle(async (request: Request) => {
  const b = await readJson(request);
  const msg = b.lang === 'ur' ? MSG.ur : MSG.en;
  if (!(await underLimit(`rl:join-pk:${clientIp(request)}`, 6, 3600))) throw new HttpError(429, msg.rate);
  if (clean(b.website)) return json({ ok: true });

  const name = clean(b.name, 60);
  const phone = normPhone(clean(b.whatsapp, 24));
  const tier = TIERS[b.tier] ? b.tier : 'Studio';
  const source = clean(b.utm_source, 60);

  if (!name) throw new HttpError(400, msg.name);
  if (!phone) throw new HttpError(400, msg.wa);

  const screened = screenLead({ kind: 'cohort', name, email: '', company: '', role: '', country: '', message: '', elapsedMs: typeof b.elapsedMs === 'number' ? b.elapsedMs : undefined });
  if (screened?.bot) { console.warn('MYTHRA join-pk lead dropped as automated:', phone); return json({ ok: true }); }
  if (screened) throw new HttpError(400, msg.real);

  const [first, ...rest] = name.split(' ');
  await syncContact({
    firstName: first, lastName: rest.join(' '), email: '', phone,
    source: source ? `mythrafilm.com/join/pk · cohort · ${source}` : 'mythrafilm.com/join/pk · cohort',
    tags: ['cohort-lead', 'join-pk', TIERS[tier], 'cohort-1', 'payment-pending', b.lang === 'ur' ? 'lang-ur' : 'lang-en'],
    customFields: { cohort_tier: tier }
  });
  return json({ ok: true }, 201);
});
