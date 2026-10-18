/* The dragon's Kickstarter launch list under the hatch: language picker, planned goal and rewards, use of funds, signup form.
   No money is taken here. Planned tier prices live below; the Kickstarter pre-launch link and the signup count
   come from /api/egg/config (Vercel variables). */
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

let CFG = { goal: 50000, signups: null, kickstarter: null };
window.MYTHRA_CFG = fetch('/api/egg/config').then(r => r.ok ? r.json() : null).catch(() => null);
window.MYTHRA_CFG.then(c => { if (c && c.dragon){ CFG = { ...CFG, ...c.dragon }; paint(); } });

const pixel = (name, data, custom) => { try { if (window.fbq) fbq(custom ? 'trackCustom' : 'track', name, data || {}); } catch(e){} };
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const fmt = n => Number(n).toLocaleString(MI.lang === 'ar' ? 'ar-EG' : MI.lang === 'hi' ? 'hi-IN' : 'en-US');

/* language picker: a small menu in the header, each language written in its own script */
const langBtn = $('#langBtn'), langMenu = $('#langMenu'), langCur = $('#langCur');
const CODES = { en:'EN', ur:'UR', hi:'HI', ar:'AR', es:'ES', id:'ID' };
MI.langs.forEach(([code, name]) => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.type = 'button'; b.setAttribute('role', 'option'); b.dataset.lang = code;
  const n = document.createElement('span'); n.lang = code; n.textContent = name;
  const c = document.createElement('small'); c.textContent = CODES[code];
  b.append(n, c); li.append(b); langMenu.append(li);
  b.addEventListener('click', () => { closeLang(); MI.set(code); pixel('LanguageChanged', { lang: code }, true); langBtn.focus(); });
});
function openLang(){ langMenu.hidden = false; langBtn.setAttribute('aria-expanded', 'true'); (langMenu.querySelector('[aria-selected="true"]') || langMenu.querySelector('button')).focus(); }
function closeLang(){ langMenu.hidden = true; langBtn.setAttribute('aria-expanded', 'false'); }
langBtn.addEventListener('click', e => { e.stopPropagation(); langMenu.hidden ? openLang() : closeLang(); });
document.addEventListener('click', e => { if (!langMenu.hidden && !e.target.closest('#lang')) closeLang(); });
langMenu.addEventListener('keydown', e => {
  const items = [...langMenu.querySelectorAll('button')], i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown'){ e.preventDefault(); items.at((i + 1) % items.length).focus(); }
  if (e.key === 'ArrowUp'){ e.preventDefault(); items.at((i - 1 + items.length) % items.length).focus(); }
  if (e.key === 'Escape'){ closeLang(); langBtn.focus(); }
  if (e.key === 'Tab') closeLang();
});
function paintLang(){
  langCur.textContent = (MI.langs.find(([c]) => c === MI.lang) || MI.langs[0])[1];
  langMenu.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.lang === MI.lang)));
}

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
  wireJoin(btn, tr.id);
  a.append(name, price, blurb, ul, btn);
  return a;
}

function paint(){
  paintLang();
  const box = $('#tiers'); box.replaceChildren(...TIERS.map(tierCard));

  // planned goal; the signup count shows once DRAGON_SIGNUPS is set
  const big = $('#goalBig'), sub = $('#goalSub');
  big.dir = 'ltr'; big.textContent = money(CFG.goal);
  sub.textContent = CFG.signups ? t('signups', { n: fmt(CFG.signups) }) : t('goalSub');
  document.querySelectorAll('[data-join]').forEach(a => { wireJoin(a); a.textContent = t(CFG.kickstarter ? 'ksNotify' : 'hCta'); });

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

/* every join button: the Kickstarter pre-launch page once its link is set, until then the free signup form */
function wireJoin(btn, tier){
  btn.textContent = t(CFG.kickstarter ? 'ksNotify' : 'notify');
  if (CFG.kickstarter){
    const u = new URL(CFG.kickstarter); Object.entries(attribution).forEach(([k,v]) => u.searchParams.set(k, v));
    btn.href = u.toString(); btn.target = '_blank'; btn.rel = 'noopener';
    btn.onclick = () => pixel('KickstarterClick', { content_name: tier || 'cta' }, true);
  } else {
    btn.href = '#reserve'; btn.removeAttribute('target');
    btn.onclick = e => { e.preventDefault(); openReserve(tier || 'hatchling'); };
  }
}
/* signup form: name, email and the reward they want go to GHL; no payment */
const cofounderNo = () => { try { return Number(JSON.parse(localStorage.getItem('mythra-cofounder-no'))) || null; } catch(e){ return null; } };
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
    consent: $('#rvConsent').checked, website: $('#rvWebsite').value, cofounder: cofounderNo(), ...attribution
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
