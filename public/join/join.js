// /join: the cohort landing page. The cohort part of /egg/egg.js without the egg, dragon or share sheet.
(() => {
'use strict';
const $ = s => document.querySelector(s);

/* =========================================================
   CONFIG, TRACKING
   ========================================================= */
const params = new URLSearchParams(location.search);
const attribution = {};
['utm_source','utm_medium','utm_campaign','utm_content'].forEach(k => { const v = params.get(k); if (v) attribution[k] = v.slice(0, 80); });
let CONFIG = { siteUrl: location.origin, pixelId: null, checkout: {} };
fetch('/api/egg/config').then(r => r.ok ? r.json() : null).then(c => { if (c){ CONFIG = { ...CONFIG, ...c }; initPixel(c.pixelId); wireCheckout(); } }).catch(() => {});

function initPixel(id){
  if (!id || window.fbq) return;
  /* Meta Pixel base code */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', id); fbq('track', 'PageView');
}
function pixel(name, data, custom){ try { if (window.fbq) fbq(custom ? 'trackCustom' : 'track', name, data || {}); } catch(e){} }
async function post(url, data){
  const r = await fetch(url, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) throw new Error(j.error || 'We couldn’t reach MYTHRA. Check your connection and try again.');
  return j;
}

/* Seat buttons go to the Whop checkout once its link is configured; until then they scroll to the question form. */
function wireCheckout(){
  document.querySelectorAll('[data-checkout]').forEach(a => {
    const url = CONFIG.checkout && CONFIG.checkout[a.dataset.checkout];
    if (!url) return;
    const u = new URL(url);
    Object.entries(attribution).forEach(([k,v]) => u.searchParams.set(k, v));
    a.href = u.toString(); a.target = '_blank'; a.rel = 'noopener';
    a.addEventListener('click', () => pixel('InitiateCheckout', { content_name: a.dataset.checkout, currency:'USD', value: a.dataset.checkout === 'studio' ? 997 : 297 }));
  });
}

/* =========================================================
   COHORT
   ========================================================= */
const STAGES = [
  ['Audience Psychology','Map what makes your audience stop scrolling, feel, and come back. Emotion before format.','3 hooks posted and compared on retention'],
  ['The Drama Method','The core loop: want, wound, reversal, cliffhanger. Built for how feeds reward watch time.','A one-page drama map of your pilot'],
  ['The Story Engine','Turn the drama map into a repeatable episode structure you can run every week.','A full pilot script'],
  ['Character & World Bible','Lock faces, wardrobe, voice and rules so your AI characters stay consistent across shots and episodes.','A one-page World Bible with character sheets'],
  ['Storyboard & Shot System','Turn a deliberate screenplay into controlled visual framing, lens selections, and camera motions.','A shot list and storyboard for every scene'],
  ['AI-Native Production','Generate, direct and iterate shots with the tool stack of the moment, without losing the story.','A finished 60–90 second pilot'],
  ['Long-Form Edit & Sound Design','Pacing, score and sound that hold attention past the first minute.','A final cut with mixed sound'],
  ['Audience Testing','Ship, read the data, change one thing, ship again.','Pilot published with 2 hook or thumbnail tests'],
  ['Translation & Localization','Voice, subtitles and cultural edits that let one story travel to many markets.','The pilot in 3 languages'],
  ['Distribution Network','Pods, collabs and cross-posting that compound reach across platforms.','A week of pod collabs on 4 platforms'],
  ['Audience Feedback Loop','Turn comments and retention curves into the next script.','A feedback report on your pilot'],
  ['The Next Story','Plan the season. Pitch it on Demo Day.','An Episode 2 plan and Demo Day pitch']
];
const ol = $('#stages'), stageCard = $('#stageCard'), pad2 = n => String(n).padStart(2,'0');
STAGES.forEach((s,i) => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.type = 'button'; b.setAttribute('role','tab');
  b.innerHTML = `<span class="n">${pad2(i+1)}</span><span class="t"></span><span class="wk">WK ${Math.floor(i/2)+1}</span>`;
  b.querySelector('.t').textContent = s[0];
  b.addEventListener('click', () => pick(i)); li.append(b); ol.append(li);
});
function pick(i){
  ol.querySelectorAll('button').forEach((b,j) => b.setAttribute('aria-selected', String(i===j)));
  const s = STAGES[i];
  stageCard.innerHTML = `<span class="eyebrow">Stage ${pad2(i+1)} · Week ${Math.floor(i/2)+1}</span><div class="big">${pad2(i+1)}</div><h3></h3><p class="lede"></p><div class="ship"><b>You ship:</b> <span></span></div>`;
  stageCard.querySelector('h3').textContent = s[0]; stageCard.querySelector('.lede').textContent = s[1]; stageCard.querySelector('.ship span').textContent = s[2];
}
pick(4);
[['Hook','Find the emotion that stops the scroll. Post three hooks.'],['Story','Write the pilot. Lock your characters and world.'],['Shoot','Storyboard every shot and produce the pilot.'],['Cut','Edit, score, publish and test.'],['Scale','Three languages and a week of pod collabs.'],['Season','Read the data, plan Episode 2, pitch on Demo Day.']]
.forEach((s,i) => {
  const d = document.createElement('article'); d.className = 'sprint';
  d.innerHTML = `<span class="w">WEEK ${i+1} · STAGES ${pad2(i*2+1)}–${pad2(i*2+2)}</span><h4></h4><p></p>`;
  d.querySelector('h4').textContent = s[0]; d.querySelector('p').textContent = s[1]; $('#sprints').append(d);
});
document.querySelectorAll('[data-tier]').forEach(a => a.addEventListener('click', () => { $('#aTier').value = a.dataset.tier; }));
const openedAt = Date.now();
let cohortSeen = false;
if ('IntersectionObserver' in window){
  new IntersectionObserver((es, o) => { if (es.some(x => x.isIntersecting) && !cohortSeen){ cohortSeen = true; pixel('ViewContent', { content_name:'cohort-seats' }); o.disconnect(); } }, { threshold:.2 }).observe($('#seats'));
}
$('#appForm').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#appErr'), ok = $('#appOk'), btn = $('#appBtn');
  const data = {
    name: $('#aName').value.trim(), email: $('#aEmail').value.trim(), whatsapp: $('#aWa').value.trim(),
    link: $('#aLink').value.trim(), niche: $('#aNiche').value, tier: $('#aTier').value, goal: $('#aGoal').value.trim(),
    consent: $('#aConsent').checked, website: $('#aWebsite').value, elapsedMs: Date.now() - openedAt, ...attribution
  };
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){ err.hidden = false; err.textContent = 'Add your name and a valid email so we can reply.'; return; }
  if (!data.consent){ err.hidden = false; err.textContent = 'Tick the box so we can contact you about your application.'; return; }
  err.hidden = true; btn.disabled = true; btn.textContent = 'Sending…';
  try {
    await post('/api/join/apply', data);
    pixel('SubmitApplication', { content_name: data.tier });
    ok.hidden = false; ok.textContent = `Thanks, ${data.name.split(' ')[0]}. We got your message and will reply by email${data.whatsapp ? ' or WhatsApp' : ''}.`;
    btn.hidden = true;
  } catch(ex){
    err.hidden = false; err.textContent = ex.message;
  } finally { btn.disabled = false; btn.textContent = 'Send application'; }
});

})();
