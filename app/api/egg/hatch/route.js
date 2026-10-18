export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// POST /api/egg/hatch — the visitor's egg hatched: hand out the next Dragon Co-Founder number.
// The browser keeps its number, so a returning visitor keeps theirs.
import { handle, json, clientIp } from '../../../../lib/egg/util.js';
import { cmd, storeConfigured, underLimit } from '../../../../lib/egg/store.js';

// Numbers start here so the first card doesn't read No. 1 of an empty room.
const FIRST = 101;

export const POST = handle(async (request) => {
  let n = null;
  // A connection that hatches over and over gets a number but doesn't use up the sequence.
  if (storeConfigured()) {
    try {
      if (await underLimit(`rl:hatch:${clientIp(request)}`, 20, 3600)) n = FIRST - 1 + Number(await cmd('INCR', 'egg:cofounders'));
    } catch (e) { console.error('[egg] cofounder number', e.message); }
  }
  // Without Redis the number still rises over time (one step every three minutes since the funding page opened), so cards stay believable.
  if (!n) n = FIRST + Math.floor((Date.now() - Date.UTC(2026, 9, 17)) / 180000) % 90000;
  return json({ ok: true, n });
});
