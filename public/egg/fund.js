/* The dragon funding campaign under the hatch: language picker, goal, reward tiers, use of funds, reserve form.
   Tier prices and limits live here; checkout links and the raised total come from /api/egg/config (Vercel variables). */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const MI = window.MI, t = MI.t;

const TIERS = [
  { id:'ember', price:5, items:3 },
  { id:'keeper', price:25, items:4 },
  { id:'hatchling', price:129, items:4, feature:true, badge:'first200' },
  { id:'nest', price:249, items:4 },
  { id:'patron', price:999, items:4, badge:'only20' }
];
const USE = [['u1', 40], ['u2', 25], ['u3', 20], ['u4', 15]];

const params = new URLSearchParams(location.search);
const attribution = {};
['utm_source','utm_medium','utm_campaign','utm_content'].forEach(k => { const v = params.get(k); if (v) attribution[k] = v.slice(0, 80); });

let CFG = { goal: 50000, raised: null, backers: null, links: {} };
window.MYTHRA_CFG = fetch('/api/egg/config').then(r => r.ok ? r.json() : null).catch(() => null);
window.MYTHRA_CFG.then(c => { if (c && c.dragon){ CFG = { ...CFG, ...c.dragon, links: c.dragon.links || {} }; paint(); } });

const pixel = (name, data, custom) => { try { if (window.fbq) fbq(custom ? 'trackCustom' : 'track', name, data || {}); } catch(e){} };
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const fmt = n => Number(n).toLocaleString(MI.lang === 'ar' ? 'ar-EG' : MI.lang === 'hi' ? 'hi-IN' : 'en-US');

/* language picker */
const sel = $('#lang');
MI.langs.forEach(([code, name]) => { const o = document.createElement('option'); o.value = code; o.textContent = name; sel.append(o); });
sel.addEventListener('change', () => { MI.set(sel.value); pixel('LanguageChanged', { lang: sel.value }, true); });

/* reward tiers */
function tierCard(tr){
  const a = document.createElement('article');
  a.className = 'tier' + (tr.feature ? ' feature' : '');
  const name = document.createElement('div'); name.className = 'name';
  const h = document.createElement('h3'); h.textContent = t(`t_${tr.id}`); name.append(h);
  if (tr.badge){ const b = document.createElement('span'); b.className = 'badge'; b.textContent = t(tr.badge); name.append(b); }
  const price = document.createElement('div'); price.className = 'price'; price.textContent = money(tr.price); price.dir = 'ltr';
  const blurb = document.createElement('p'); blurb.className = 'blurb'; blurb.textContent = t(`t_${tr.id}_b`);
  const ul = document.createElement('ul');
  for (let i = 1; i <= tr.items; i++){ const li = document.createElement('li'); li.textContent = t(`t_${tr.id}_${i}`); ul.append(li); }
  const btn = document.createElement('a'); btn.className = 'btn' + (tr.feature ? '' : ' ghost');
  btn.textContent = t('back', { price: '\u2066' + money(tr.price) + '\u2069' });
  const link = CFG.links[tr.id];
  if (link){
    const u = new URL(link); Object.entries(attribution).forEach(([k,v]) => u.searchParams.set(k, v));
    btn.href = u.toString(); btn.target = '_blank'; btn.rel = 'noopener';
    btn.addEventListener('click', () => pixel('InitiateCheckout', { content_name: tr.id, currency:'USD', value: tr.price }));
  } else {
    btn.href = '#reserve';
    btn.addEventListener('click', e => { e.preventDefault(); openReserve(tr.id); });
  }
  a.append(name, price, blurb, ul, btn);
  return a;
}

function paint(){
  sel.value = MI.lang;
  const box = $('#tiers'); box.replaceChildren(...TIERS.map(tierCard));

  // goal: progress shows only once a raised total is configured
  const top = $('#goalTop'), big = $('#goalBig'), bar = $('#goalBar'), sub = $('#goalSub');
  big.dir = 'ltr';
  if (CFG.raised){
    top.textContent = CFG.backers ? t('backers', { n: fmt(CFG.backers) }) : t('goalOnly');
    big.textContent = money(CFG.raised);
    sub.textContent = t('raisedOf', { raised: money(CFG.raised), goal: money(CFG.goal) });
    bar.hidden = false;
    requestAnimationFrame(() => { bar.firstElementChild.style.width = Math.min(100, CFG.raised / CFG.goal * 100) + '%'; });
  } else {
    top.textContent = t('goalOnly'); big.textContent = money(CFG.goal); sub.textContent = t('goalSub'); bar.hidden = true;
  }

  const use = $('#use'); use.replaceChildren(...USE.map(([k, pct]) => {
    const row = document.createElement('div'); row.className = 'use-row';
    const name = document.createElement('span'); name.textContent = t(k);
    const val = document.createElement('b'); val.textContent = money(CFG.goal * pct / 100); val.dir = 'ltr';
    const b = document.createElement('div'); b.className = 'bar'; const i = document.createElement('i'); i.style.width = pct + '%'; b.append(i);
    row.append(name, val, b); return row;
  }));

  const rt = $('#rvTier'), keep = rt.value;
  rt.replaceChildren(...TIERS.map(tr => { const o = document.createElement('option'); o.value = tr.id; o.textContent = `${t('t_' + tr.id)} · ${money(tr.price)}`; return o; }));
  if (keep) rt.value = keep;
}
MI.onChange(paint);

/* reserve form: used while a tier has no checkout link */
const sheet = $('#reserve');
function openReserve(id){
  $('#rvTier').value = id; sheet.hidden = false;
  setTimeout(() => $('#rvName').focus(), 60);
  pixel('ReserveOpened', { content_name: id }, true);
}
$('#reserveClose').addEventListener('click', () => sheet.hidden = true);
sheet.addEventListener('click', e => { if (e.target === sheet) sheet.hidden = true; });
addEventListener('keydown', e => { if (e.key === 'Escape') sheet.hidden = true; });

$('#rvForm').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#rvErr'), ok = $('#rvOk'), btn = $('#rvBtn');
  const data = {
    name: $('#rvName').value.trim(), email: $('#rvEmail').value.trim(), whatsapp: $('#rvWa').value.trim(),
    country: $('#rvCountry').value.trim(), tier: $('#rvTier').value, lang: MI.lang,
    consent: $('#rvConsent').checked, website: $('#rvWebsite').value, ...attribution
  };
  const fail = m => { err.hidden = false; err.textContent = m; };
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return fail(t('rvErrFields'));
  if (!data.consent) return fail(t('rvErrConsent'));
  err.hidden = true; btn.disabled = true; btn.textContent = t('rvSending');
  try {
    const r = await fetch('/api/egg/reserve', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.error || t('rvErrNet'));
    const tier = TIERS.find(x => x.id === data.tier);
    pixel('Lead', { content_name: data.tier, currency:'USD', value: tier ? tier.price : 0 });
    ok.hidden = false; ok.textContent = t('rvOk', { name: data.name.split(' ')[0], tier: t('t_' + data.tier) });
    btn.hidden = true;
  } catch(ex){ fail(ex.message || t('rvErrNet')); }
  finally { btn.disabled = false; btn.textContent = t('rvSend'); }
});

let seen = false;
if ('IntersectionObserver' in window){
  new IntersectionObserver((es, o) => { if (es.some(x => x.isIntersecting) && !seen){ seen = true; pixel('ViewContent', { content_name:'dragon-rewards' }); o.disconnect(); } }, { threshold:.2 }).observe($('#rewards'));
}

/* once the visitor scrolls into the campaign: solid header, sound and motion toggles out of the way */
const top = $('.top'), toggles = $('#toggles');
const onScroll = () => {
  const past = scrollY > innerHeight * .6;
  top.classList.toggle('solid', past); toggles.classList.toggle('away', past);
};
addEventListener('scroll', onScroll, { passive:true }); onScroll();

MI.apply();
})();
