// Renders /egg/k/:id — see app/egg/k/[id]/route.js
// The page a shared link opens: rich preview for WhatsApp/Facebook/X, and a "hatch yours" invite.
import { SITE_URL, KEEPER_RE, escapeHtml, firstName } from './util.js';
import { getKeeper } from './store.js';

export async function cardResponse(rawId) {
  const id = String(rawId || '').toUpperCase();
  const k = KEEPER_RE.test(id) ? await getKeeper(id).catch(() => null) : null;
  const site = SITE_URL();
  if (!k) return Response.redirect(`${site}/egg`, 302);

  const dragon = escapeHtml(k.dragonName);
  const keeper = escapeHtml(firstName(k.keeperName) || 'A Keeper');
  const url = `${site}/egg/k/${k.no}`;
  const invite = `${site}/egg?ref=${k.no}&utm_source=card&utm_medium=share&utm_campaign=keeper`;
  const title = `${dragon} has hatched · MYTHRA`;
  const desc = `${keeper} is now the Keeper of ${dragon}, a dragon from The Mother’s Monster. Your egg is waiting. Hatch it free.`;
  const date = new Date(k.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="MYTHRA">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${site}/egg/og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${site}/egg/og.jpg">
<meta name="theme-color" content="#050607">
<link rel="preload" as="image" href="/egg/dragon.webp" type="image/webp">
<style>
:root{--void:#050607;--bone:#efe6d6;--dim:#a9a194;--gold:#c9a15b;--hot:#f2c57c;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;min-height:100svh;background:radial-gradient(ellipse at 50% 60%,#3a2412 0,#0b0d10 55%,var(--void) 100%);color:var(--bone);font:16px/1.55 "Helvetica Neue",Arial,sans-serif;display:grid;place-items:center;padding:24px 16px}
main{width:min(100%,440px);display:grid;gap:18px;text-align:center}
.eb{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}
h1{margin:0;font:500 clamp(34px,8vw,48px)/1.05 Georgia,"Times New Roman",serif}
img{width:100%;height:auto;filter:drop-shadow(0 28px 34px rgba(0,0,0,.6)) drop-shadow(0 0 40px rgba(255,170,90,.18))}
dl{margin:0;display:grid;grid-template-columns:auto auto;justify-content:center;gap:4px 16px;font-size:14px}dt{color:var(--gold);font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding-top:2px}dd{margin:0;text-align:left}
a.btn{display:block;padding:16px;background:var(--gold);color:var(--void);font-weight:600;text-decoration:none}a.btn:hover{background:var(--hot)}
p{margin:0;color:var(--dim);font-size:14px}
</style></head><body><main>
<span class="eb">MYTHRA · Keeper ${escapeHtml(k.no)}</span>
<h1>${dragon} has hatched.</h1>
<img src="/egg/dragon.webp" width="720" height="571" alt="${dragon}, a newborn pink dragon climbing out of its shell">
<dl><dt>Keeper</dt><dd>${keeper}</dd><dt>Element</dt><dd>${escapeHtml(k.element || 'Ember')}</dd><dt>Hatched</dt><dd>${escapeHtml(date)}</dd></dl>
<a class="btn" href="${invite}">Hatch your own dragon</a>
<p>Free. From the world of The Mother’s Monster.</p>
</main></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, s-maxage=300, stale-while-revalidate=86400' } });
}
