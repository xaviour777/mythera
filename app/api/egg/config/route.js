export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// GET /api/egg/config — public settings the egg page needs at runtime.
import { json, env, SITE_URL } from '../../../../lib/egg/util.js';

export function GET() {
  return json({
    siteUrl: SITE_URL(),
    pixelId: env('META_PIXEL_ID') || null,
    checkout: {
      // Whop product links. Vercel variables override these defaults.
      room: env('WHOP_ROOM_URL') || 'https://whop.com/zetomate-5424/mythra-drama-method-writers-room-cohort-1/',
      studio: env('WHOP_STUDIO_URL') || 'https://whop.com/zetomate-5424/mythra-drama-method-writers-room-studio-seat/'
    }
  }, 200, { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600' });
}
