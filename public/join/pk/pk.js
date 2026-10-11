// /join/pk: the Pakistan cohort page. Same cohort as /join, priced in PKR, paid by QR (JazzCash, Easypaisa, bank apps).
// English by default with an Urdu toggle, plus a dark/light toggle. Both choices are remembered per browser.
(() => {
'use strict';
const $ = s => document.querySelector(s);
const root = document.documentElement;

/* =========================================================
   PRICES AND PAYMENT DETAILS: change these to update the page.
   qr: path to the payment QR image in public/ (replace payment-qr.svg, or point this at a .png/.jpg).
   accountTitle / accountNumber / iban / bank: shown under the QR with a copy button; leave '' to hide.
   whatsapp: number for payment screenshots in international form, e.g. '923001234567'; leave '' to hide the button.
   ========================================================= */
const PRICES = { Room: 14999, Studio: 49999, Silver: 100000 };
const PAY = {
  qr: '/join/pk/payment-qr.svg',
  accountTitle: '',
  accountNumber: '',
  iban: '',
  bank: '',
  whatsapp: ''
};
const DAYS = 42;

/* =========================================================
   URDU TEXT. English lives in index.html; each [data-i] element swaps to the Urdu below.
   ========================================================= */
const UR = {
  navJoin: 'ابھی جوائن کریں',
  heroEyebrow: 'پاکستان ایڈیشن · ڈراما میتھڈ رائٹرز روم',
  heroTitle: 'ٹولز بدلتے رہیں گے، <em>کہانی کا سسٹم</em> وہی رہے گا۔',
  heroLede: '«The Mother’s Monster» صرف 72 گھنٹوں میں بنی اور اس کی پہلی قسط نے 6 کروڑ سے زیادہ ویوز حاصل کیے۔ یہ اسی کامیابی کے پیچھے کا سسٹم ہے، جو زاہد اقبال چھ ہفتوں کے ایک سیزن میں سکھاتے ہیں، جہاں آپ اپنی اصل کہانی اصل ناظرین تک پہنچاتے ہیں۔',
  heroFacts: '<li><b>42 دن</b> · چھ اسپرنٹ</li><li><b>12 مراحل</b> · ایک پائلٹ لانچ</li><li><b>فاؤنڈنگ قیمت</b> · صرف پہلے بیچ کے لیے</li>',
  heroCta: 'ابھی سیٹ بک کریں',
  heroPrices: 'قیمت دیکھیں',
  payWith: 'ادائیگی پاکستانی روپے میں:',
  t1h: 'ویوز پہلی قسط پر', t1p: 'یہ سسٹم کاغذ پر نہیں، اصل ناظرین پر آزمایا گیا ہے۔',
  t2h: 'زاہد اقبال کے ساتھ', t2p: 'اسٹوڈیو سیٹ میں آپ کی کہانی، شاٹس اور ایڈٹ کا ذاتی جائزہ۔',
  t3h: 'کریڈٹ کارڈ کی ضرورت نہیں', t3p: 'JazzCash، Easypaisa یا کسی بھی بینک ایپ سے QR اسکین کر کے روپے میں ادائیگی کریں۔',
  mEyebrow: 'ڈراما میتھڈ',
  mTitle: 'کہانی بنانے کا 12 مرحلوں کا انجن۔',
  mLede: 'کہانی، کرداروں کی یکسانیت، اور دنیا بھر تک پہنچنے کا طریقہ۔ کسی مرحلے پر کلک کریں اور دیکھیں کہ اس میں کیا سیکھیں گے اور کیا بنائیں گے۔',
  sEyebrow: 'چھ اسپرنٹ · ہر ہفتے دو مراحل',
  sTitle: 'ہر جمعہ پریمیئر نائٹ۔',
  sLede: 'ہر اسپرنٹ کے آخر میں آپ کچھ نہ کچھ پوسٹ کرتے ہیں۔ ہفتے کا بہترین کام لائیو دکھایا جاتا ہے اور زاہد اس کا تجزیہ کرتے ہیں۔',
  o1t: 'ریچ', o1h: 'کولیب پوڈز', o1p: 'آپ کے شعبے کے 6 سے 8 کری ایٹرز کا گروپ۔ ہر ہفتے پوڈ YouTube، TikTok، Instagram اور Facebook پر ایک دوسرے کے ساتھ ڈوئٹ، اسٹچ اور کیمیو کرتا ہے، تاکہ سب ایک دوسرے کے ناظرین تک مفت پہنچیں۔',
  o2t: 'مقام', o2h: 'لیڈر بورڈ', o2p: 'ہر اسپرنٹ مکمل کرنے اور گروتھ فیصد پر پوائنٹس، اس لیے 500 فالوورز والا بھی 50 ہزار والے سے آگے جا سکتا ہے۔ ٹاپ تین کو Zetomate نیٹ ورک کے 1 کروڑ 20 لاکھ فالوورز پر شاؤٹ آؤٹ ملتا ہے۔',
  o3t: 'رہنمائی', o3h: 'زاہد کے ساتھ 1:1', o3p: 'اسٹوڈیو سیٹ میں زاہد اقبال کے ساتھ نجی سیشن شامل ہیں، جن میں پوسٹ کرنے سے پہلے آپ کی کہانی، شاٹس اور ایڈٹ کا جائزہ لیا جاتا ہے۔',
  pEyebrow: 'فاؤنڈنگ روم · پہلا بیچ · پاکستان',
  pTitle: 'اپنی سیٹ چنیں۔',
  pLede: '42 دن۔ یہ پاکستانی قیمتیں صرف پہلے بیچ کے لیے ہیں، سیٹیں محدود ہیں۔',
  room: 'روم', studio: 'اسٹوڈیو', studio1: 'اسٹوڈیو · 1:1', limited: 'محدود سیٹیں',
  perdayRoom: 'روزانہ صرف تقریباً <span class="num" data-perday="Room"></span>، پورے 42 دن',
  perdayStudio: 'روزانہ صرف تقریباً <span class="num" data-perday="Studio"></span>، پورے 42 دن',
  roomList: '<li>تمام 6 اسپرنٹ اور 12 مراحل</li><li>کولیب پوڈ میں جگہ</li><li>لیڈر بورڈ میں شرکت</li><li>ہفتہ وار پریمیئر نائٹس</li><li>ڈیمو ڈے</li>',
  studioList: '<li>روم کی ہر چیز</li><li><b>زاہد اقبال کے ساتھ 1:1 سیشن</b></li><li>ہر ہفتے چھوٹے گروپ میں آپ کے کام کا جائزہ</li><li>پوڈ میں ترجیحی جگہ</li><li>ڈراما میتھڈ ٹیمپلیٹس اور پرامپٹ لائبریری</li><li>کردار اور دنیا کی بائبل کا جائزہ</li>',
  joinRoom: 'روم جوائن کریں', joinStudio: 'اسٹوڈیو جوائن کریں',
  silver: 'سلور بٹن اسپرنٹ', silverShort: 'سلور بٹن', untilBadge: '1 لاکھ تک',
  perdaySilver: 'ایک ہی قیمت، پہلے دن سے سلور پلے بٹن تک',
  silverList: '<li>اسٹوڈیو کی ہر چیز</li><li><b>ڈیمو ڈے کے بعد بھی ہم آپ کے ساتھ رہیں گے، جب تک آپ کا چینل 1 لاکھ سبسکرائبرز تک نہ پہنچ جائے اور YouTube کا سلور پلے بٹن آپ کی دیوار پر نہ لگ جائے</b></li><li>زاہد اقبال کے ساتھ ہر مہینے 1:1 گروتھ کال</li><li>آپ کی اقساط، ٹائٹلز اور تھمب نیلز کا مسلسل جائزہ</li><li>MYTHRA ٹیم کے ساتھ ترجیحی WhatsApp لائن</li>',
  joinSilver: 'سلور اسپرنٹ شروع کریں',
  fine: 'شپ گارنٹی: اگر آپ چھ ہفتوں کے تمام کام جمع کروائیں اور ڈیمو ڈے تک آپ کا پائلٹ لانچ نہ ہو، تو اگلے بیچ میں آپ کی سیٹ مفت۔ MYTHRA ایک سسٹم سکھاتا ہے؛ نتیجہ آپ کی محنت پر منحصر ہے، ویوز یا کمائی کا کوئی وعدہ نہیں کیا جاتا۔ سلور بٹن اسپرنٹ: جب تک آپ کا چینل 1 لاکھ سبسکرائبرز تک نہیں پہنچتا، ہم آپ کے ساتھ کام کرتے رہیں گے، بشرطیکہ آپ طے شدہ شیڈول کے مطابق ویڈیوز لگاتے رہیں۔ پلے بٹن دینے کا فیصلہ YouTube کرتا ہے، اس لیے سبسکرائبرز کی کسی تعداد کی گارنٹی نہیں۔',
  hEyebrow: 'آسان طریقہ', hTitle: 'چار قدم میں داخلہ۔',
  steps: '<li><b>جوائن پر کلک کریں</b> اور اپنا نام اور WhatsApp نمبر لکھیں۔</li><li><b>QR اسکین کریں</b> JazzCash، Easypaisa یا اپنی بینک ایپ سے۔</li><li><b>رقم ادا کریں</b> اور رسید کا اسکرین شاٹ لے لیں۔</li><li><b>سیٹ کنفرم:</b> ہماری ٹیم WhatsApp پر رابطہ کر کے آپ کو داخل کر لے گی۔</li>',
  fEyebrow: 'سوالات', fTitle: 'اکثر پوچھے جانے والے سوال۔',
  q1: 'کیا کریڈٹ کارڈ یا ڈالر میں ادائیگی ضروری ہے؟', a1: 'نہیں۔ پاکستان کے لیے پوری فیس روپے میں ہے۔ JazzCash، Easypaisa یا کسی بھی بینک ایپ سے QR اسکین کر کے ادائیگی کریں۔',
  q2: 'ایک ہی فون پر QR کیسے اسکین کروں؟', a2: 'فارم میں «QR محفوظ کریں» دبائیں، پھر اپنی ایپ میں «Scan QR» کھول کر گیلری سے تصویر چنیں۔ چاہیں تو اکاؤنٹ نمبر کاپی کر کے براہِ راست بھی بھیج سکتے ہیں۔',
  q3: 'ادائیگی کے بعد کیا ہوگا؟', a3: 'رسید کا اسکرین شاٹ ہمیں WhatsApp پر بھیج دیں۔ ہماری ٹیم ادائیگی چیک کر کے آپ کی سیٹ کنفرم کرے گی اور کلاس کی تفصیلات بھیجے گی۔',
  q4: 'روم، اسٹوڈیو اور سلور بٹن میں کیا فرق ہے؟', a4: 'روم میں پورا کورس، پوڈ اور پریمیئر نائٹس شامل ہیں۔ اسٹوڈیو میں اس کے علاوہ زاہد اقبال کے ساتھ 1:1 سیشن اور ہر ہفتے آپ کے کام کا ذاتی جائزہ ملتا ہے۔ سلور بٹن اسپرنٹ میں اسٹوڈیو کی ہر چیز شامل ہے اور یہ 42 دن پر ختم نہیں ہوتا: جب تک آپ کا چینل 1 لاکھ سبسکرائبرز تک نہ پہنچے اور سلور پلے بٹن نہ آ جائے، ہم آپ کے ساتھ کام کرتے رہتے ہیں۔',
  endBig: 'آپ کی کہانی جاری ہے۔', endSub: 'MYTHRA Studios · AI پر مبنی کہانی اور IP اسٹوڈیو · لاہور',
  barSeat: 'اسٹوڈیو سیٹ',
  sheetTitle: 'اپنی سیٹ بک کریں', fName: 'آپ کا نام', fWa: 'WhatsApp نمبر', submit: 'رجسٹر کریں',
  consent: 'فارم بھیج کر آپ ہمیں WhatsApp پر رابطے کی اجازت دیتے ہیں۔',
  payEyebrow: 'ادائیگی کا طریقہ',
  ps1: 'JazzCash، Easypaisa یا اپنی <b>بینک ایپ</b> کھولیں۔',
  ps2: '<b>Scan QR</b> یا Raast QR پر جا کر یہ کوڈ اسکین کریں۔',
  ps3a: '', ps3b: 'ادا کریں اور رسید کا اسکرین شاٹ لیں۔',
  ps4: 'اسکرین شاٹ ہمیں WhatsApp پر بھیجیں، ٹیم آپ کی سیٹ کنفرم کر دے گی۔',
  saveQr: 'QR محفوظ کریں', waBtn: 'اسکرین شاٹ WhatsApp کریں',
  sameTip: 'ایک ہی فون پر ہیں؟ QR محفوظ کریں اور ایپ میں «Scan QR» کھول کر گیلری سے تصویر چنیں۔'
};
// Strings built in script, per language.
const T = {
  en: {
    stage: 'Stage', week: 'Week', wk: 'WK', stages: 'STAGES', ship: 'You ship:',
    seat: { Room: 'Room', Studio: 'Studio', Silver: 'Silver Button Sprint' },
    errName: 'Please enter your name.', errWa: 'Please enter a valid WhatsApp number, like 0300 1234567.',
    sending: 'Sending…', submit: 'Register', network: 'We couldn’t reach MYTHRA. Check your connection and try again.',
    ok: (n, seat, amt) => `Thanks, ${n}! Your ${seat} seat is reserved. Pay ${amt} with the QR below and our team will confirm your seat on WhatsApp as soon as the payment arrives.`,
    wa: (seat, amt, n) => `Hi, I have paid ${amt} for the MYTHRA ${seat} seat. Name: ${n || '-'}. Receipt screenshot attached.`,
    acct: ['Account title', 'Account number', 'IBAN', 'Bank / wallet'], copy: 'Copy', copied: 'Copied',
    toLight: 'Switch to light mode', toDark: 'Switch to dark mode',
    title: 'The Drama Method Writers’ Room · Pakistan · MYTHRA', qrAlt: 'Payment QR code', close: 'Close'
  },
  ur: {
    stage: 'مرحلہ', week: 'ہفتہ', wk: 'ہفتہ', stages: 'مراحل', ship: 'آپ بنائیں گے:',
    seat: { Room: 'روم', Studio: 'اسٹوڈیو', Silver: 'سلور بٹن اسپرنٹ' },
    errName: 'براہِ کرم اپنا نام لکھیں۔', errWa: 'براہِ کرم درست WhatsApp نمبر لکھیں، جیسے 0300 1234567',
    sending: 'بھیجا جا رہا ہے…', submit: 'رجسٹر کریں', network: 'رابطہ نہیں ہو سکا۔ انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔',
    ok: (n, seat, amt) => `شکریہ ${n}! آپ کی ${seat} سیٹ ریزرو ہو گئی ہے۔ نیچے دیے گئے QR سے ${amt} ادا کریں، ادائیگی ملتے ہی ہماری ٹیم WhatsApp پر آپ کی سیٹ کنفرم کر دے گی۔`,
    wa: (seat, amt, n) => `السلام علیکم، میں نے MYTHRA ${seat} سیٹ کے لیے ${amt} ادا کر دیے ہیں۔ نام: ${n || '-'}۔ رسید کا اسکرین شاٹ ساتھ ہے۔`,
    acct: ['اکاؤنٹ ٹائٹل', 'اکاؤنٹ نمبر', 'IBAN', 'بینک / والیٹ'], copy: 'کاپی', copied: 'کاپی ہو گیا',
    toLight: 'لائٹ موڈ', toDark: 'ڈارک موڈ',
    title: 'ڈراما میتھڈ رائٹرز روم · پاکستان · MYTHRA', qrAlt: 'ادائیگی کا QR کوڈ', close: 'بند کریں'
  }
};
const STAGES = {
  en: [
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
  ],
  ur: [
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
  ]
};
const SPRINTS = {
  en: [['Hook','Find the emotion that stops the scroll. Post three hooks.'],['Story','Write the pilot. Lock your characters and world.'],['Shoot','Storyboard every shot and produce the pilot.'],['Cut','Edit, score, publish and test.'],['Scale','Three languages and a week of pod collabs.'],['Season','Read the data, plan Episode 2, pitch on Demo Day.']],
  ur: [['ہُک','وہ جذبہ ڈھونڈیں جو اسکرول روک دے۔ تین ہُک پوسٹ کریں۔'],['کہانی','پائلٹ لکھیں۔ کردار اور دنیا طے کریں۔'],['شوٹ','ہر شاٹ کا اسٹوری بورڈ بنائیں اور پائلٹ تیار کریں۔'],['ایڈٹ','ایڈٹ، میوزک، لانچ اور ٹیسٹ۔'],['اسکیل','تین زبانیں اور ایک ہفتے کے پوڈ کولیب۔'],['سیزن','ڈیٹا پڑھیں، قسط 2 پلان کریں، ڈیمو ڈے پر پیش کریں۔']]
};

const store = (k, v) => { try { localStorage.setItem(k, v); } catch(e){ /* private mode */ } };
const lang = () => (root.lang === 'ur' ? 'ur' : 'en');
const t = () => T[lang()];
const rs = n => 'Rs ' + Number(n).toLocaleString('en-PK');
const pad2 = n => String(n).padStart(2,'0');

/* =========================================================
   LANGUAGE AND THEME
   ========================================================= */
const EN = {};
document.querySelectorAll('[data-i]').forEach(el => { if (!(el.dataset.i in EN)) EN[el.dataset.i] = el.innerHTML; });

function fillPrices(){
  document.querySelectorAll('[data-price]').forEach(el => { el.textContent = Number(PRICES[el.dataset.price]).toLocaleString('en-PK'); });
  document.querySelectorAll('[data-perday]').forEach(el => { el.textContent = rs(Math.round(PRICES[el.dataset.perday] / DAYS)); });
}
let stageIndex = 4;
function applyLang(l, save){
  root.lang = l; root.dir = l === 'ur' ? 'rtl' : 'ltr';
  const dict = l === 'ur' ? UR : EN;
  document.querySelectorAll('[data-i]').forEach(el => { const v = dict[el.dataset.i]; if (v !== undefined) el.innerHTML = v; });
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
  document.title = t().title;
  $('#payQr').alt = t().qrAlt; $('#sheetClose').setAttribute('aria-label', t().close);
  fillPrices(); renderStages(); renderSprints(); renderAccount(); syncTier(); syncThemeLabel();
  if (!btn.disabled) btn.textContent = t().submit;
  if (save) store('mythra-pk-lang', l);
}
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang, true)));

function syncThemeLabel(){
  const light = root.dataset.theme === 'light';
  $('#themeBtn').setAttribute('aria-label', light ? t().toDark : t().toLight);
  document.querySelector('meta[name=theme-color]').content = light ? '#f7f3ec' : '#050607';
}
$('#themeBtn').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  store('mythra-pk-theme', root.dataset.theme); syncThemeLabel();
});

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
function pixel(name, data){ try { if (window.fbq) fbq('track', name, data || {}); } catch(e){ /* ignore */ } }

/* =========================================================
   COHORT
   ========================================================= */
const ol = $('#stages'), stageCard = $('#stageCard');
function renderStages(){
  ol.textContent = '';
  STAGES[lang()].forEach((s,i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role','tab');
    b.innerHTML = `<span class="n">${pad2(i+1)}</span><span class="t"></span><span class="wk">${t().wk} ${Math.floor(i/2)+1}</span>`;
    b.querySelector('.t').textContent = s[0];
    b.addEventListener('click', () => pick(i)); li.append(b); ol.append(li);
  });
  pick(stageIndex);
}
function pick(i){
  stageIndex = i;
  ol.querySelectorAll('button').forEach((b,j) => b.setAttribute('aria-selected', String(i===j)));
  const s = STAGES[lang()][i];
  stageCard.innerHTML = `<span class="eyebrow">${t().stage} ${pad2(i+1)} · ${t().week} ${Math.floor(i/2)+1}</span><div class="big">${pad2(i+1)}</div><h3></h3><p class="lede"></p><div class="ship"><b>${t().ship}</b> <span></span></div>`;
  stageCard.querySelector('h3').textContent = s[0]; stageCard.querySelector('.lede').textContent = s[1]; stageCard.querySelector('.ship span').textContent = s[2];
}
function renderSprints(){
  const box = $('#sprints'); box.textContent = '';
  SPRINTS[lang()].forEach((s,i) => {
    const d = document.createElement('article'); d.className = 'sprint';
    d.innerHTML = `<span class="w">${t().week.toUpperCase()} ${i+1} · ${t().stages} ${pad2(i*2+1)}–${pad2(i*2+2)}</span><h4></h4><p></p>`;
    d.querySelector('h4').textContent = s[0]; d.querySelector('p').textContent = s[1]; box.append(d);
  });
}

/* =========================================================
   JOIN SHEET: one form (name + WhatsApp), payment QR below it
   ========================================================= */
const sheet = $('#sheet'), form = $('#joinForm'), err = $('#joinErr'), ok = $('#joinOk'), btn = $('#joinBtn');
const tierInput = () => form.querySelector('input[name=tier]:checked');
const openedAt = Date.now();
let lastLead = null;

$('#payQr').src = PAY.qr;
$('#payDownload').href = PAY.qr;
function renderAccount(){
  const acct = $('#payAcct'); acct.textContent = ''; acct.hidden = true;
  [PAY.accountTitle, PAY.accountNumber, PAY.iban, PAY.bank].forEach((value, k) => {
    if (!value) return;
    const row = document.createElement('div');
    row.innerHTML = '<span></span><span class="v"></span>';
    row.children[0].textContent = t().acct[k]; row.children[1].textContent = value;
    if ((k === 1 || k === 2) && navigator.clipboard){
      const c = document.createElement('button'); c.type = 'button'; c.className = 'copy'; c.textContent = t().copy;
      c.addEventListener('click', () => navigator.clipboard.writeText(value.replace(/\s/g, '')).then(() => { c.textContent = t().copied; }).catch(() => {}));
      row.append(c);
    }
    acct.append(row); acct.hidden = false;
  });
}
function syncTier(){
  const tier = tierInput().value;
  $('#payAmount').textContent = rs(PRICES[tier]);
  if (PAY.whatsapp){
    const w = $('#payWa'); w.hidden = false;
    w.href = `https://wa.me/${PAY.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(t().wa(t().seat[tier], rs(PRICES[tier]), $('#jName').value.trim()))}`;
  }
  if (lastLead) ok.textContent = t().ok(lastLead.first, t().seat[lastLead.tier], rs(PRICES[lastLead.tier]));
}
form.addEventListener('change', syncTier);
$('#jName').addEventListener('input', syncTier);

function openSheet(tier){
  const r = form.querySelector(`input[name=tier][value="${tier}"]`);
  if (r && !lastLead) r.checked = true;
  syncTier();
  if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
  pixel('InitiateCheckout', { content_name: tier, currency: 'PKR', value: PRICES[tier] });
}
function closeSheet(){ if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open'); }
document.querySelectorAll('[data-join]').forEach(b => b.addEventListener('click', () => openSheet(b.dataset.join)));
$('#sheetClose').addEventListener('click', closeSheet);
sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    name: $('#jName').value.trim(), whatsapp: $('#jWa').value.trim(), tier: tierInput().value, lang: lang(),
    website: $('#jWebsite').value, elapsedMs: Date.now() - openedAt, ...attribution
  };
  const digits = data.whatsapp.replace(/\D/g, '');
  if (!data.name){ err.hidden = false; err.textContent = t().errName; return; }
  if (digits.length < 10 || digits.length > 15){ err.hidden = false; err.textContent = t().errWa; return; }
  err.hidden = true; btn.disabled = true; btn.textContent = t().sending;
  try {
    const r = await fetch('/api/join/pk/apply', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.error || t().network);
    pixel('Lead', { content_name: data.tier, currency: 'PKR', value: PRICES[data.tier] });
    lastLead = { first: data.name.split(' ')[0], tier: data.tier };
    form.hidden = true; ok.hidden = false; syncTier();
    $('#pay').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch(ex){
    err.hidden = false; err.textContent = ex.message || t().network;
  } finally { btn.disabled = false; btn.textContent = t().submit; }
});

applyLang(lang(), false);

})();
