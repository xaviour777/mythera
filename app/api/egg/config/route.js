export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// GET /api/config — public settings the page needs at runtime.
import { json, env, SITE_URL } from '../../../../lib/egg/util.js';

export function GET() {
  return json({
    waNumber: env('WA_PUBLIC_NUMBER').replace(/\D/g, '') || null,
    siteUrl: SITE_URL(),
    pixelId: env('META_PIXEL_ID') || null
  }, 200, { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600' });
}
