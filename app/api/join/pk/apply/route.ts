export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/join/pk/apply — the /join/pk Urdu page's join form (name + WhatsApp) → GHL contact tagged join-pk.
// Payment happens off-site by QR (JazzCash, Easypaisa, bank apps), so every lead starts as payment-pending.
import { handle, json, readJson, HttpError, clean, normPhone, clientIp } from '@/lib/egg/util.js';
import { underLimit } from '@/lib/egg/store.js';
import { syncContact as syncEggContact } from '@/lib/egg/ghl.js';
import { screenLead } from '@/lib/studio/lead-guard';

// ghl.js is plain JS; its `tags = []` default makes TypeScript infer never[].
const syncContact = syncEggContact as unknown as (contact: { firstName: string; lastName: string; email: string; phone: string; source: string; tags: string[]; customFields: Record<string, string> }) => Promise<unknown>;
const TIERS: Record<string, string> = { Room: 'tier-room-pk', Studio: 'tier-studio-pk' };

export const POST = handle(async (request: Request) => {
  if (!(await underLimit(`rl:join-pk:${clientIp(request)}`, 6, 3600))) throw new HttpError(429, 'ایک گھنٹے میں بہت زیادہ کوششیں ہو گئیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔');
  const b = await readJson(request);
  if (clean(b.website)) return json({ ok: true });

  const name = clean(b.name, 60);
  const phone = normPhone(clean(b.whatsapp, 24));
  const tier = TIERS[b.tier] ? b.tier : 'Studio';
  const source = clean(b.utm_source, 60);

  if (!name) throw new HttpError(400, 'براہِ کرم اپنا نام لکھیں۔');
  if (!phone) throw new HttpError(400, 'براہِ کرم درست WhatsApp نمبر لکھیں، جیسے 0300 1234567');

  const screened = screenLead({ kind: 'cohort', name, email: '', company: '', role: '', country: '', message: '', elapsedMs: typeof b.elapsedMs === 'number' ? b.elapsedMs : undefined });
  if (screened?.bot) { console.warn('MYTHRA join-pk lead dropped as automated:', phone); return json({ ok: true }); }
  if (screened) throw new HttpError(400, 'براہِ کرم اپنا اصل نام لکھیں۔');

  const [first, ...rest] = name.split(' ');
  await syncContact({
    firstName: first, lastName: rest.join(' '), email: '', phone,
    source: source ? `mythrafilm.com/join/pk · cohort · ${source}` : 'mythrafilm.com/join/pk · cohort',
    tags: ['cohort-lead', 'join-pk', TIERS[tier], 'cohort-1', 'payment-pending'],
    customFields: { cohort_tier: tier }
  });
  return json({ ok: true }, 201);
});
