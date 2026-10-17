export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// GET /api/egg/config — public settings the egg page needs at runtime.
import { json, env, SITE_URL } from '../../../../lib/egg/util.js';

const num = (k) => { const n = Number(env(k).replace(/[^0-9.]/g, '')); return Number.isFinite(n) && n > 0 ? n : null; };

export function GET() {
  return json({
    siteUrl: SITE_URL(),
    pixelId: env('META_PIXEL_ID') || null,
    checkout: {
      // Whop product links for the cohort page at /join. Vercel variables override these defaults.
      room: env('WHOP_ROOM_URL') || 'https://whop.com/zetomate-5424/mythra-drama-method-writers-room-cohort-1/',
      studio: env('WHOP_STUDIO_URL') || 'https://whop.com/zetomate-5424/mythra-drama-method-writers-room-studio-seat/'
    },
    dragon: {
      goal: num('DRAGON_GOAL_USD') || 50000,
      // Set these in Vercel as pledges come in; the progress bar stays hidden until DRAGON_RAISED_USD is set.
      raised: num('DRAGON_RAISED_USD'),
      backers: num('DRAGON_BACKERS'),
      // Checkout link per reward tier (Whop or Stripe payment links). A tier with no link opens the reserve form.
      links: {
        ember: env('DRAGON_EMBER_URL') || null,
        keeper: env('DRAGON_KEEPER_URL') || null,
        hatchling: env('DRAGON_HATCHLING_URL') || null,
        nest: env('DRAGON_NEST_URL') || null,
        patron: env('DRAGON_PATRON_URL') || null
      }
    }
  }, 200, { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600' });
}
