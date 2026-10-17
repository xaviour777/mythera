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
      // Planned Kickstarter goal shown on /egg. No money is taken on the page.
      goal: num('DRAGON_GOAL_USD') || 50000,
      // People on the launch list; shown once set.
      signups: num('DRAGON_SIGNUPS'),
      // The Kickstarter pre-launch page. Once set, every join button on /egg goes there instead of the signup form.
      kickstarter: /^https:\/\//.test(env('DRAGON_KICKSTARTER_URL')) ? env('DRAGON_KICKSTARTER_URL') : null
    }
  }, 200, { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600' });
}
