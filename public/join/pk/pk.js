// /join/pk: the Pakistani Urdu cohort page. Same cohort as /join, priced in PKR, paid by QR (JazzCash, Easypaisa, bank apps).
(() => {
'use strict';
const $ = s => document.querySelector(s);

/* =========================================================
   PRICES AND PAYMENT DETAILS: change these to update the page.
   qr: path to the payment QR image in public/ (replace payment-qr.svg, or point this at a .png/.jpg).
   accountTitle / accountNumber / iban / bank: shown under the QR with a copy button; leave '' to hide.
   whatsapp: number for payment screenshots in international form, e.g. '923001234567'; leave '' to hide the button.
   ========================================================= */
const PRICES = { Room: 14999, Studio: 49999 };
const PAY = {
  qr: '/join/pk/payment-qr.svg',
  accountTitle: '',
  accountNumber: '',
  iban: '',
  bank: '',
  whatsapp: ''
};
const DAYS = 42;
const SEAT_NAMES = { Room: 'روم', Studio: 'اسٹوڈیو' };

const rs = n => 'Rs ' + Number(n).toLocaleString('en-PK');
document.querySelectorAll('[data-price]').forEach(el => { el.textContent = Number(PRICES[el.dataset.price]).toLocaleString('en-PK'); });
document.querySelectorAll('[data-perday]').forEach(el => { el.textContent = rs(Math.round(PRICES[el.dataset.perday] / DAYS)); });

/* =========================================================
   TRACKING
   ========================================================= */
const params = new URLSearchParams(location.search);
const attribution = {};
['utm_source','utm_medium','utm_campaign','utm_content'].forEach(k => { const v = params.get(k); if (v) attribution[k] = v.slice(0, 80); });
fetch('/api/egg/config').then(r => r.ok ? r.json() : null).then(c => { if (c) initPixel(c.pixelId); }).catch(() => {});
function initPixel(id){
  if (!id || window.fbq) return;
  /* Meta Pixel base code */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', id); fbq('track', 'PageView');
}
function pixel(name, data, custom){ try { if (window.fbq) fbq(custom ? 'trackCustom' : 'track', name, data || {}); } catch(e){} }

/* =========================================================
   COHORT
   ========================================================= */
const STAGES = [
  ['ناظرین کی نفسیات','سمجھیں کہ آپ کے ناظرین کو کیا چیز اسکرول روکنے، کچھ محسوس کرنے اور دوبارہ آنے پر مجبور کرتی ہے۔ فارمیٹ سے پہلے جذبات۔','3 ہُک پوسٹ کر کے ان کی ریٹینشن کا موازنہ'],
  ['ڈراما میتھڈ','بنیادی لوپ: خواہش، زخم، پلٹاؤ، کلف ہینگر۔ اسی طرح بنایا گیا جیسے فیڈ واچ ٹائم کو انعام دیتی ہے۔','پائلٹ کا ایک صفحے کا ڈراما میپ'],
  ['اسٹوری انجن','ڈراما میپ کو قسط کے ایسے ڈھانچے میں بدلیں جو آپ ہر ہفتے دہرا سکیں۔','پائلٹ کا مکمل اسکرپٹ'],
  ['کردار اور دنیا کی بائبل','چہرے، لباس، آواز اور اصول طے کریں تاکہ آپ کے AI کردار ہر شاٹ اور ہر قسط میں ایک جیسے رہیں۔','کردار شیٹس کے ساتھ ایک صفحے کی ورلڈ بائبل'],
  ['اسٹوری بورڈ اور شاٹ سسٹم','اسکرین پلے کو سوچی سمجھی فریمنگ، لینز اور کیمرا موومنٹ میں بدلیں۔','ہر سین کی شاٹ لسٹ اور اسٹوری بورڈ'],
  ['AI پروڈکشن','اس وقت کے بہترین ٹولز سے شاٹس بنائیں، ڈائریکٹ کریں اور بہتر کریں، کہانی کھوئے بغیر۔','60 سے 90 سیکنڈ کا مکمل پائلٹ'],
  ['ایڈیٹنگ اور ساؤنڈ ڈیزائن','رفتار، میوزک اور آواز جو پہلے منٹ کے بعد بھی توجہ قائم رکھیں۔','مکس ساؤنڈ کے ساتھ فائنل کٹ'],
  ['ناظرین پر ٹیسٹنگ','لانچ کریں، ڈیٹا پڑھیں، ایک چیز بدلیں، پھر لانچ کریں۔','پائلٹ لانچ، 2 ہُک یا تھمب نیل ٹیسٹ کے ساتھ'],
  ['ترجمہ اور لوکلائزیشن','آواز، سب ٹائٹلز اور ثقافتی تبدیلیاں جو ایک کہانی کو کئی ملکوں تک پہنچا دیں۔','پائلٹ 3 زبانوں میں'],
  ['ڈسٹری بیوشن نیٹ ورک','پوڈز، کولیب اور کراس پوسٹنگ جو ہر پلیٹ فارم پر ریچ بڑھاتے جائیں۔','4 پلیٹ فارمز پر ایک ہفتے کے پوڈ کولیب'],
  ['ناظرین کا فیڈبیک لوپ','کمنٹس اور ریٹینشن کو اگلے اسکرپٹ میں بدلیں۔','پائلٹ پر فیڈبیک رپورٹ'],
  ['اگلی کہانی','پورا سیزن پلان کریں اور ڈیمو ڈے پر پیش کریں۔','قسط 2 کا پلان اور ڈیمو ڈے پچ']
];
const ol = $('#stages'), stageCard = $('#stageCard'), pad2 = n => String(n).padStart(2,'0');
STAGES.forEach((s,i) => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.type = 'button'; b.setAttribute('role','tab');
  b.innerHTML = `<span class="n">${pad2(i+1)}</span><span class="t"></span><span class="wk">ہفتہ ${Math.floor(i/2)+1}</span>`;
  b.querySelector('.t').textContent = s[0];
  b.addEventListener('click', () => pick(i)); li.append(b); ol.append(li);
});
function pick(i){
  ol.querySelectorAll('button').forEach((b,j) => b.setAttribute('aria-selected', String(i===j)));
  const s = STAGES[i];
  stageCard.innerHTML = `<span class="eyebrow">مرحلہ ${pad2(i+1)} · ہفتہ ${Math.floor(i/2)+1}</span><div class="big">${pad2(i+1)}</div><h3></h3><p class="lede"></p><div class="ship"><b>آپ بنائیں گے:</b> <span></span></div>`;
  stageCard.querySelector('h3').textContent = s[0]; stageCard.querySelector('.lede').textContent = s[1]; stageCard.querySelector('.ship span').textContent = s[2];
}
pick(4);
[['ہُک','وہ جذبہ ڈھونڈیں جو اسکرول روک دے۔ تین ہُک پوسٹ کریں۔'],['کہانی','پائلٹ لکھیں۔ کردار اور دنیا طے کریں۔'],['شوٹ','ہر شاٹ کا اسٹوری بورڈ بنائیں اور پائلٹ تیار کریں۔'],['ایڈٹ','ایڈٹ، میوزک، لانچ اور ٹیسٹ۔'],['اسکیل','تین زبانیں اور ایک ہفتے کے پوڈ کولیب۔'],['سیزن','ڈیٹا پڑھیں، قسط 2 پلان کریں، ڈیمو ڈے پر پیش کریں۔']]
.forEach((s,i) => {
  const d = document.createElement('article'); d.className = 'sprint';
  d.innerHTML = `<span class="w">ہفتہ ${i+1} · مراحل ${pad2(i*2+1)}–${pad2(i*2+2)}</span><h4></h4><p></p>`;
  d.querySelector('h4').textContent = s[0]; d.querySelector('p').textContent = s[1]; $('#sprints').append(d);
});

/* =========================================================
   JOIN SHEET: one form (name + WhatsApp), payment QR below it
   ========================================================= */
const sheet = $('#sheet'), form = $('#joinForm'), err = $('#joinErr'), ok = $('#joinOk'), btn = $('#joinBtn');
const tierInput = () => form.querySelector('input[name=tier]:checked');
const openedAt = Date.now();

$('#payQr').src = PAY.qr;
$('#payDownload').href = PAY.qr;
const acct = $('#payAcct');
[['اکاؤنٹ ٹائٹل', PAY.accountTitle], ['اکاؤنٹ نمبر', PAY.accountNumber], ['IBAN', PAY.iban], ['بینک / والیٹ', PAY.bank]].forEach(([label, value]) => {
  if (!value) return;
  const row = document.createElement('div');
  row.innerHTML = '<span></span><span class="v"></span>';
  row.children[0].textContent = label; row.children[1].textContent = value;
  if (label !== 'اکاؤنٹ ٹائٹل' && label !== 'بینک / والیٹ' && navigator.clipboard){
    const c = document.createElement('button'); c.type = 'button'; c.className = 'copy'; c.textContent = 'کاپی';
    c.addEventListener('click', () => navigator.clipboard.writeText(value.replace(/\s/g, '')).then(() => { c.textContent = 'کاپی ہو گیا'; }).catch(() => {}));
    row.append(c);
  }
  acct.append(row); acct.hidden = false;
});

function waLink(){
  const t = tierInput().value, name = $('#jName').value.trim();
  const msg = `السلام علیکم، میں نے MYTHRA ${SEAT_NAMES[t]} سیٹ کے لیے ${rs(PRICES[t])} ادا کر دیے ہیں۔ نام: ${name || '-'}۔ رسید کا اسکرین شاٹ ساتھ ہے۔`;
  return `https://wa.me/${PAY.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
}
function syncTier(){
  $('#payAmount').textContent = rs(PRICES[tierInput().value]);
  if (PAY.whatsapp){ const w = $('#payWa'); w.hidden = false; w.href = waLink(); }
}
form.addEventListener('change', syncTier);
$('#jName').addEventListener('input', syncTier);

function openSheet(tier){
  const r = form.querySelector(`input[name=tier][value="${tier}"]`);
  if (r) r.checked = true;
  syncTier();
  if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
  pixel('InitiateCheckout', { content_name: tier, currency: 'PKR', value: PRICES[tier] });
  setTimeout(() => { if (!$('#jName').value && form.hidden === false) $('#jName').focus(); }, 50);
}
function closeSheet(){ if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open'); }
document.querySelectorAll('[data-join]').forEach(b => b.addEventListener('click', () => openSheet(b.dataset.join)));
$('#sheetClose').addEventListener('click', closeSheet);
sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    name: $('#jName').value.trim(), whatsapp: $('#jWa').value.trim(), tier: tierInput().value,
    website: $('#jWebsite').value, elapsedMs: Date.now() - openedAt, ...attribution
  };
  const digits = data.whatsapp.replace(/\D/g, '');
  if (!data.name){ err.hidden = false; err.textContent = 'براہِ کرم اپنا نام لکھیں۔'; return; }
  if (digits.length < 10 || digits.length > 15){ err.hidden = false; err.textContent = 'براہِ کرم درست WhatsApp نمبر لکھیں، جیسے 0300 1234567'; return; }
  err.hidden = true; btn.disabled = true; btn.textContent = 'بھیجا جا رہا ہے…';
  try {
    const r = await fetch('/api/join/pk/apply', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.error || 'رابطہ نہیں ہو سکا۔ انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔');
    pixel('Lead', { content_name: data.tier, currency: 'PKR', value: PRICES[data.tier] });
    form.hidden = true;
    ok.hidden = false;
    ok.textContent = `شکریہ ${data.name.split(' ')[0]}! آپ کی ${SEAT_NAMES[data.tier]} سیٹ ریزرو ہو گئی ہے۔ نیچے دیے گئے QR سے ${rs(PRICES[data.tier])} ادا کریں، ادائیگی ملتے ہی ہماری ٹیم WhatsApp پر آپ کی سیٹ کنفرم کر دے گی۔`;
    $('#pay').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch(ex){
    err.hidden = false; err.textContent = ex.message;
  } finally { btn.disabled = false; btn.textContent = 'رجسٹر کریں'; }
});

})();
