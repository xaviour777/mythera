export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/track  { no, event }  — counts card shares and tags the contact in GHL once.
import { handle, json, readJson, HttpError, KEEPER_RE, clientIp } from '../../../../lib/egg/util.js';
import { getKeeper, cmd, underLimit, once } from '../../../../lib/egg/store.js';
import { addTags } from '../../../../lib/egg/ghl.js';

const EVENTS = new Set(['share_whatsapp', 'share_facebook', 'share_x', 'share_telegram', 'share_native', 'share_copy', 'card_saved', 'wa_optin_click', 'cohort_view']);

export const POST = handle(async (request) => {
  if (!(await underLimit(`rl:track:${clientIp(request)}`, 60, 3600))) return json({ ok: true });
  const { no, event } = await readJson(request, 2000);
  if (!KEEPER_RE.test(no || '') || !EVENTS.has(event)) throw new HttpError(400, 'Unknown event.');
  const k = await getKeeper(no);
  if (!k) return json({ ok: true });
  await cmd('HINCRBY', `keeper:${no}`, event, 1);
  if (event.startsWith('share_') || event === 'card_saved') {
    await cmd('HINCRBY', `keeper:${no}`, 'shares', 1);
    if (await once(`tagged:shared:${no}`, 365 * 86400)) await addTags(k.ghlId, ['shared-card']);
  }
  if (event === 'cohort_view' && (await once(`tagged:cohort:${no}`, 365 * 86400))) await addTags(k.ghlId, ['viewed-cohort']);
  return json({ ok: true });
});
