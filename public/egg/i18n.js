/* Words for the egg page in six languages. English is the fallback for any missing key.
   Pick order: ?lang= → the visitor's last choice → browser language → English. */
(() => {
'use strict';
const T = {};

T.en = {
  tagline: 'The Mother’s Monster · Your story continues',
  langLabel: 'Language',
  s0e: 'Your dragon egg from the film', s0t: 'Your dragon is waiting.', s0h: 'Touch the egg', s0s: 'Begin your story.',
  s1e: 'The first connection', s1t: 'It knows you’re here.', s1h: 'Touch again', s1s: 'Something stirs inside the shell.',
  s2e: 'The bond', s2t: 'Every dragon needs a Keeper.', s2h: 'Meet your dragon', s2s: 'One last touch. Yours is waiting.',
  awake: 'Awakening', welcome: 'Welcome to the world.',
  aftE: 'Born from a film', aftT: 'Now help it come home.', aftL: 'We are turning this dragon into a real smart pet that grows up with your child.',
  ctaBack: 'Bring the dragon home', ctaShare: 'Share your Co-Founder card', skip: 'See the dragon campaign',
  soundOn: 'Sound on', soundOff: 'Sound off', motionOn: 'Motion on', motionOff: 'Motion off',

  hEye: 'MYTHRA Hatchling · Coming to Kickstarter',
  hTitle: 'The first pet born from a film.',
  hLead: 'Millions met this dragon in The Mother’s Monster. Now we are building it as a real smart pet that talks, remembers, and grows up with your child.',
  goalOnly: 'Planned Kickstarter goal', goalSub: 'to build the first working dragons',
  hCta: 'Join the Kickstarter launch list', signups: '{n} Keepers already on the launch list', ksNotify: 'Notify me on Kickstarter', notify: 'Notify me at launch', hNote: 'Free to join. No payment today. You hear first when the campaign opens, with the early-bird price.',
  st1: 'YouTube views in 7 days', st2: 'Facebook views', st3: 'views worldwide',
  stNote: 'Studio-reported views across official and shared posts. Views are not unique viewers.',

  wEye: 'Meet the Hatchling', wTitle: 'A dragon that grows up with your child.',
  wLead: 'It hatches from an egg and grows through five stages over ten years. As your child grows, it gets a new body, new abilities and new stories.',
  f1t: 'Talks and listens', f1d: 'It knows its name, your child’s voice, and the voice of everyone in the family.',
  f2t: 'Remembers', f2d: 'Their first story, their lost tooth, their best day. At 13 it all becomes a printed Memory Book.',
  f3t: 'Grows with them', f3d: 'New shells, wings and skills arrive at each stage, so it is never outgrown.',
  f4t: 'Stories from the film', f4d: 'Bedtime stories and quests set in the MYTHRA world, with your child as the hero.',
  f5t: 'Safe by design', f5d: 'No camera. A real mute switch. Speech is understood on the toy. Parents control everything.',
  f6t: 'Works offline', f6d: 'Talking, games, stories and growing all work without the internet. No subscription needed.',
  sgEye: 'Five life stages', sgTitle: 'One dragon. Ten years.',
  g1: 'Egg', g1a: 'Hatch day', g2: 'Hatchling', g2a: 'Age 4–6', g3: 'Fledgling', g3a: 'Age 7–9', g4: 'Young dragon', g4a: 'Age 10–12', g5: 'Elder companion', g5a: 'Age 13+',

  oEye: 'Why this matters', oTitle: 'Every child wants a pet that is truly theirs.',
  o1: 'spent on toys worldwide in 2024', o2: 'Tamagotchi digital pets sold', o3: 'views of the film this dragon comes from',
  oLead: 'Digital pets proved that children will care for a pet that lives inside a toy. None of them grew up with the child. The Hatchling does, and it arrives with a story millions already love.',
  oSrc: 'Sources',

  rEye: 'Planned Kickstarter rewards', rTitle: 'Choose your place in the dragon’s story.',
  rLead: 'These are the rewards we plan to offer when the campaign opens. Everyone on the launch list is written into the Hatch Book, the record of the first Keepers. Prices are in US dollars.',
  rShip: 'Planned rewards. Final prices, limits and delivery dates are set on the Kickstarter page at launch.',
  loved: 'Most loved', first200: 'First 200 only', only20: 'Only 20',
  t_ember: 'Ember', t_ember_b: 'For everyone who watched the film.',
  t_ember_1: 'Your name in the Hatch Book of founding Keepers', t_ember_2: 'Backer-only updates from the dragon workshop', t_ember_3: 'Dragon phone wallpaper set',
  t_keeper: 'Egg Keeper', t_keeper_b: 'Your dragon’s name, reserved.',
  t_keeper_1: 'Everything in Ember', t_keeper_2: 'Reserve your dragon’s name before launch', t_keeper_3: 'Numbered founding Keeper certificate', t_keeper_4: 'The first five bedtime stories in audio',
  t_hatchling: 'First Clutch', t_hatchling_b: 'The smart dragon at the founding price.',
  t_hatchling_1: 'Everything in Egg Keeper', t_hatchling_2: 'The Hatchling smart dragon starter set', t_hatchling_3: 'Founder-numbered egg shell', t_hatchling_4: 'Founding price: $129 instead of $179',
  t_nest: 'Family Nest', t_nest_b: 'For the whole family.',
  t_nest_1: 'Everything in First Clutch', t_nest_2: 'The first growth kit when your child is ready', t_nest_3: 'One year of new stories and quests', t_nest_4: 'Your family’s name in the credits of the next MYTHRA chapter',
  t_patron: 'Dragon Patron', t_patron_b: 'Put your dragon in the film.',
  t_patron_1: 'Everything in Family Nest', t_patron_2: 'A dragon you name appears in a future MYTHRA chapter', t_patron_3: 'A video call with director Zahid Iqbal', t_patron_4: 'Gold edition dragon, numbered 1 to 20',

  uEye: 'Where your pledge goes', uTitle: 'Every dollar builds the dragon.',
  u1: 'Working prototype and voice AI', u2: 'Toy design and child-safety testing', u3: 'Stories, voice and character from the film', u4: 'Factory tooling deposit',
  tlEye: 'The road to hatch day',
  tl1d: 'Nov 2026 – Mar 2027', tl1: 'Prototype tested with families',
  tl2d: 'Spring 2027', tl2: 'Kickstarter opens: the launch list hears first',
  tl3d: 'Summer 2027', tl3: 'Safety certification and privacy audit',
  tl4d: 'December 2027 (target)', tl4: 'First dragons ship to backers',

  qEye: 'Questions',
  q1: 'Do I pay anything now?', a1: 'No. Joining the launch list is free. You only pay if you choose to back the campaign on Kickstarter.',
  q2: 'Is this an investment?', a2: 'No. Kickstarter backers receive rewards, not shares or any financial return.',
  q3: 'Do you ship to my country?', a3: 'We plan to ship worldwide. Shipping costs are shown on the Kickstarter page when the campaign opens.',
  q4: 'Is it safe for my child?', a4: 'There is no camera. The microphones have a hardware mute switch, everyday speech is understood on the toy itself, and nothing is shared without a parent’s permission.',
  q5: 'Which languages will the dragon speak?', a5: 'English at launch. More languages follow, starting with the ones on this page.',
  eTitle: 'Every dragon needs a Keeper.', eLead: 'Be one of the first.',
  foot: 'MYTHRA Studios · Lahore',

  rvTitle: 'Join the launch list', rvLead: 'Free. We will tell you the moment the Kickstarter opens, so you can get the early-bird price.',
  rvName: 'Your name', rvEmail: 'Email', rvWa: 'WhatsApp number', rvOpt: '(optional)', rvCountry: 'Country', rvTier: 'Reward you want',
  rvConsent: 'Email or WhatsApp me when the Kickstarter opens.', rvSend: 'Join the list', rvSending: 'Sending…',
  rvOk: 'You are on the list, {name}. We will tell you the moment the Kickstarter opens, with your {tier} reward ready.',
  rvErrFields: 'Add your name and a valid email.', rvErrConsent: 'Tick the box so we can contact you.', rvErrNet: 'We couldn’t reach MYTHRA. Check your connection and try again.',
  close: 'Close',

  shEye: 'Your dragon', shTitle: 'Your Co-Founder card. Share it.', shName: 'Your dragon’s name', shNative: 'Share to Instagram, TikTok and more',
  shNote: 'Post it to your story on Instagram, TikTok or Facebook. Every friend who opens your link hatches their own egg and gets their own number.',
  shCopy: 'Copy link', shSave: 'Save image', copied: 'Link copied', saved: 'Card saved. Post it to your story.', saveErr: 'Couldn’t make the image. Try again.',
  myDragon: 'My dragon', cardHatched: 'just hatched from the egg', cardFrom: 'from the world of The Mother’s Monster', cardCta: 'Hatch your egg · mythrafilm.com/egg', cardNoName: 'My dragon hatched',
  shareName: 'My dragon {name} just hatched 🐉 from the world of The Mother’s Monster. Your egg is waiting:',
  shareAnon: 'My dragon just hatched 🐉 from the world of The Mother’s Monster. Your egg is waiting:',
  cfEye: 'Dragon Co-Founder · No. {n}',
  cfLabel: 'Dragon Co-Founder',
  cfNo: 'No. {n}',
  cardLine: 'Helping bring the first dragon from a film to life',
  cardDragon: 'Dragon: {name}',
  shareCf: 'I just became Dragon Co-Founder No. {n} 🐉 I’m helping bring the dragon from The Mother’s Monster to life as the world’s first smart pet born from a film. Hatch your egg and get your own number:',
  shareCfName: 'My dragon {name} just hatched and I became Dragon Co-Founder No. {n} 🐉 I’m helping bring the dragon from The Mother’s Monster to life. Hatch your egg and get your own number:'
};

T.ur = {
  tagline: 'دی مدرز مونسٹر · آپ کی کہانی جاری ہے',
  langLabel: 'زبان',
  s0e: 'فلم سے آپ کا ڈریگن انڈا', s0t: 'آپ کا ڈریگن انتظار کر رہا ہے۔', s0h: 'انڈے کو چھوئیں', s0s: 'اپنی کہانی شروع کریں۔',
  s1e: 'پہلا رشتہ', s1t: 'اسے پتا ہے آپ یہاں ہیں۔', s1h: 'دوبارہ چھوئیں', s1s: 'خول کے اندر کچھ ہل رہا ہے۔',
  s2e: 'بندھن', s2t: 'ہر ڈریگن کو ایک محافظ چاہیے۔', s2h: 'اپنے ڈریگن سے ملیں', s2s: 'بس ایک بار اور۔ آپ کا ڈریگن انتظار میں ہے۔',
  awake: 'جاگ رہا ہے', welcome: 'دنیا میں خوش آمدید۔',
  aftE: 'ایک فلم سے پیدا ہوا', aftT: 'اب اسے گھر لانے میں مدد کریں۔', aftL: 'ہم اس ڈریگن کو ایک اصلی اسمارٹ پالتو بنا رہے ہیں جو آپ کے بچے کے ساتھ بڑا ہوگا۔',
  ctaBack: 'ڈریگن کو گھر لائیں', ctaShare: 'اپنا کو-فاؤنڈر کارڈ شیئر کریں', skip: 'ڈریگن مہم دیکھیں',
  soundOn: 'آواز آن', soundOff: 'آواز بند', motionOn: 'حرکت آن', motionOff: 'حرکت بند',

  hEye: 'MYTHRA ہیچلنگ · جلد کِک اسٹارٹر پر',
  hTitle: 'فلم سے پیدا ہونے والا پہلا پالتو۔',
  hLead: 'کروڑوں لوگ دی مدرز مونسٹر میں اس ڈریگن سے ملے۔ اب ہم اسے ایک اصلی اسمارٹ پالتو بنا رہے ہیں جو بات کرتا ہے، یاد رکھتا ہے، اور آپ کے بچے کے ساتھ بڑا ہوتا ہے۔',
  goalOnly: 'کِک اسٹارٹر کا مجوزہ ہدف', goalSub: 'پہلے چلتے پھرتے ڈریگن بنانے کے لیے',
  hCta: 'کِک اسٹارٹر لانچ لسٹ میں شامل ہوں', signups: '{n} محافظ پہلے ہی لانچ لسٹ میں', ksNotify: 'کِک اسٹارٹر پر مجھے اطلاع دیں', notify: 'لانچ پر مجھے بتائیں', hNote: 'شامل ہونا مفت ہے۔ آج کوئی ادائیگی نہیں۔ مہم کھلتے ہی سب سے پہلے آپ کو خبر ملے گی، ابتدائی قیمت کے ساتھ۔',
  st1: 'یوٹیوب ویوز صرف 7 دن میں', st2: 'فیس بک ویوز', st3: 'دنیا بھر میں ویوز',
  stNote: 'اسٹوڈیو کے بتائے گئے ویوز، آفیشل اور شیئر کی گئی پوسٹس سمیت۔ ویوز منفرد ناظرین نہیں ہیں۔',

  wEye: 'ہیچلنگ سے ملیں', wTitle: 'ایک ڈریگن جو آپ کے بچے کے ساتھ بڑا ہوتا ہے۔',
  wLead: 'یہ انڈے سے نکلتا ہے اور دس سال میں پانچ مرحلوں سے گزرتا ہے۔ جیسے جیسے آپ کا بچہ بڑا ہوتا ہے، اسے نیا جسم، نئی صلاحیتیں اور نئی کہانیاں ملتی ہیں۔',
  f1t: 'بات کرتا اور سنتا ہے', f1d: 'یہ اپنا نام، آپ کے بچے کی آواز اور گھر کے ہر فرد کی آواز پہچانتا ہے۔',
  f2t: 'یاد رکھتا ہے', f2d: 'پہلی کہانی، پہلا ٹوٹا دانت، سب سے اچھا دن۔ 13 سال کی عمر میں یہ سب ایک چھپی ہوئی یادوں کی کتاب بن جاتا ہے۔',
  f3t: 'ساتھ بڑا ہوتا ہے', f3d: 'ہر مرحلے پر نیا خول، پر اور مہارتیں آتی ہیں، اس لیے بچہ اس سے کبھی بڑا نہیں ہوتا۔',
  f4t: 'فلم کی کہانیاں', f4d: 'MYTHRA کی دنیا میں سونے کے وقت کی کہانیاں اور مہمات، جن کا ہیرو آپ کا بچہ ہے۔',
  f5t: 'حفاظت کے ساتھ بنا', f5d: 'کوئی کیمرہ نہیں۔ اصلی میوٹ بٹن۔ بات کھلونے کے اندر ہی سمجھی جاتی ہے۔ سب کچھ والدین کے کنٹرول میں۔',
  f6t: 'انٹرنیٹ کے بغیر چلتا ہے', f6d: 'باتیں، کھیل، کہانیاں اور بڑا ہونا سب انٹرنیٹ کے بغیر۔ کوئی سبسکرپشن ضروری نہیں۔',
  sgEye: 'زندگی کے پانچ مرحلے', sgTitle: 'ایک ڈریگن۔ دس سال۔',
  g1: 'انڈا', g1a: 'پیدائش کا دن', g2: 'ہیچلنگ', g2a: 'عمر 4–6', g3: 'فلیجلنگ', g3a: 'عمر 7–9', g4: 'نوجوان ڈریگن', g4a: 'عمر 10–12', g5: 'بزرگ ساتھی', g5a: 'عمر 13+',

  oEye: 'یہ کیوں اہم ہے', oTitle: 'ہر بچہ ایک ایسا پالتو چاہتا ہے جو صرف اس کا ہو۔',
  o1: '2024 میں دنیا بھر میں کھلونوں پر خرچ', o2: 'تماگوچی ڈیجیٹل پالتو فروخت ہوئے', o3: 'اس فلم کے ویوز جس سے یہ ڈریگن آیا',
  oLead: 'ڈیجیٹل پالتو جانوروں نے ثابت کیا کہ بچے کھلونے میں رہنے والے پالتو کا خیال رکھتے ہیں۔ مگر ان میں سے کوئی بچے کے ساتھ بڑا نہیں ہوا۔ ہیچلنگ ہوتا ہے، اور یہ ایک ایسی کہانی کے ساتھ آتا ہے جسے کروڑوں لوگ پہلے ہی پسند کرتے ہیں۔',
  oSrc: 'ذرائع',

  rEye: 'کِک اسٹارٹر کے مجوزہ انعامات', rTitle: 'ڈریگن کی کہانی میں اپنی جگہ چنیں۔',
  rLead: 'یہ وہ انعامات ہیں جو ہم مہم کھلنے پر دینے کا ارادہ رکھتے ہیں۔ لانچ لسٹ میں شامل ہر شخص کا نام ہیچ بُک میں لکھا جائے گا، جو پہلے محافظوں کا ریکارڈ ہے۔ قیمتیں امریکی ڈالر میں ہیں۔',
  rShip: 'مجوزہ انعامات۔ آخری قیمتیں، تعداد اور ترسیل کی تاریخیں لانچ کے وقت کِک اسٹارٹر صفحے پر طے ہوں گی۔',
  loved: 'سب سے پسندیدہ', first200: 'صرف پہلے 200', only20: 'صرف 20',
  t_ember: 'ایمبر', t_ember_b: 'ہر اس شخص کے لیے جس نے فلم دیکھی۔',
  t_ember_1: 'بانی محافظوں کی ہیچ بُک میں آپ کا نام', t_ember_2: 'ڈریگن ورکشاپ سے صرف حمایتیوں کے لیے اپڈیٹس', t_ember_3: 'ڈریگن فون وال پیپر سیٹ',
  t_keeper: 'انڈے کا محافظ', t_keeper_b: 'آپ کے ڈریگن کا نام محفوظ۔',
  t_keeper_1: 'ایمبر کی ہر چیز', t_keeper_2: 'لانچ سے پہلے اپنے ڈریگن کا نام محفوظ کریں', t_keeper_3: 'نمبر والا بانی محافظ سرٹیفکیٹ', t_keeper_4: 'سونے کے وقت کی پہلی پانچ کہانیاں آڈیو میں',
  t_hatchling: 'پہلا بیچ', t_hatchling_b: 'اسمارٹ ڈریگن، بانی قیمت پر۔',
  t_hatchling_1: 'انڈے کے محافظ کی ہر چیز', t_hatchling_2: 'ہیچلنگ اسمارٹ ڈریگن اسٹارٹر سیٹ', t_hatchling_3: 'بانی نمبر والا انڈے کا خول', t_hatchling_4: 'بانی قیمت: $179 کی بجائے $129',
  t_nest: 'فیملی گھونسلا', t_nest_b: 'پورے گھر کے لیے۔',
  t_nest_1: 'پہلے بیچ کی ہر چیز', t_nest_2: 'بچہ تیار ہو تو پہلی گروتھ کٹ', t_nest_3: 'ایک سال کی نئی کہانیاں اور مہمات', t_nest_4: 'MYTHRA کے اگلے باب کے کریڈٹس میں آپ کے خاندان کا نام',
  t_patron: 'ڈریگن سرپرست', t_patron_b: 'اپنا ڈریگن فلم میں لائیں۔',
  t_patron_1: 'فیملی گھونسلے کی ہر چیز', t_patron_2: 'آپ کا نام رکھا ہوا ڈریگن MYTHRA کے کسی اگلے باب میں', t_patron_3: 'ڈائریکٹر ظاہد اقبال کے ساتھ ویڈیو کال', t_patron_4: 'گولڈ ایڈیشن ڈریگن، نمبر 1 سے 20',

  uEye: 'آپ کی رقم کہاں جاتی ہے', uTitle: 'ہر ڈالر ڈریگن بناتا ہے۔',
  u1: 'چلتا پھرتا پروٹوٹائپ اور وائس AI', u2: 'کھلونے کا ڈیزائن اور بچوں کی حفاظت کی جانچ', u3: 'فلم سے کہانیاں، آواز اور کردار', u4: 'فیکٹری ٹولنگ ڈپازٹ',
  tlEye: 'پیدائش کے دن تک کا سفر',
  tl1d: 'نومبر 2026 – مارچ 2027', tl1: 'خاندانوں کے ساتھ پروٹوٹائپ کی جانچ',
  tl2d: 'بہار 2027', tl2: 'کِک اسٹارٹر کھلتا ہے: لانچ لسٹ کو سب سے پہلے خبر',
  tl3d: 'گرمیاں 2027', tl3: 'حفاظتی سرٹیفکیشن اور پرائیویسی آڈٹ',
  tl4d: 'دسمبر 2027 (ہدف)', tl4: 'پہلے ڈریگن حمایتیوں کو روانہ',

  qEye: 'سوالات',
  q1: 'کیا ابھی کچھ ادا کرنا ہے؟', a1: 'نہیں۔ لانچ لسٹ میں شامل ہونا مفت ہے۔ آپ صرف تب ادائیگی کرتے ہیں جب آپ کِک اسٹارٹر پر مہم کی حمایت کرنا چاہیں۔',
  q2: 'کیا یہ سرمایہ کاری ہے؟', a2: 'نہیں۔ کِک اسٹارٹر کے حمایتیوں کو انعامات ملتے ہیں، کوئی حصہ یا مالی منافع نہیں۔',
  q3: 'کیا آپ میرے ملک میں بھیجتے ہیں؟', a3: 'ہمارا ارادہ دنیا بھر میں بھیجنے کا ہے۔ شپنگ کی لاگت مہم کھلنے پر کِک اسٹارٹر صفحے پر دکھائی جائے گی۔',
  q4: 'کیا یہ میرے بچے کے لیے محفوظ ہے؟', a4: 'اس میں کوئی کیمرہ نہیں۔ مائیکروفون کا اصلی میوٹ بٹن ہے، روزمرہ بات کھلونے کے اندر ہی سمجھی جاتی ہے، اور والدین کی اجازت کے بغیر کچھ بھی شیئر نہیں ہوتا۔',
  q5: 'ڈریگن کون سی زبانیں بولے گا؟', a5: 'لانچ پر انگریزی۔ پھر مزید زبانیں، اس صفحے کی زبانوں سے شروع کر کے۔',
  eTitle: 'ہر ڈریگن کو ایک محافظ چاہیے۔', eLead: 'پہلے محافظوں میں شامل ہوں۔',
  foot: 'MYTHRA اسٹوڈیوز · لاہور',

  rvTitle: 'لانچ لسٹ میں شامل ہوں', rvLead: 'مفت۔ کِک اسٹارٹر کھلتے ہی ہم آپ کو بتائیں گے تاکہ آپ ابتدائی قیمت حاصل کر سکیں۔',
  rvName: 'آپ کا نام', rvEmail: 'ای میل', rvWa: 'واٹس ایپ نمبر', rvOpt: '(اختیاری)', rvCountry: 'ملک', rvTier: 'آپ کون سا انعام چاہتے ہیں',
  rvConsent: 'کِک اسٹارٹر کھلنے پر مجھے ای میل یا واٹس ایپ کریں۔', rvSend: 'لسٹ میں شامل ہوں', rvSending: 'بھیجا جا رہا ہے…',
  rvOk: 'آپ لسٹ میں شامل ہو گئے، {name}۔ کِک اسٹارٹر کھلتے ہی ہم آپ کو بتائیں گے، آپ کا {tier} انعام تیار ہوگا۔',
  rvErrFields: 'اپنا نام اور درست ای میل لکھیں۔', rvErrConsent: 'باکس پر نشان لگائیں تاکہ ہم آپ سے رابطہ کر سکیں۔', rvErrNet: 'MYTHRA سے رابطہ نہیں ہو سکا۔ انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔',
  close: 'بند کریں',

  shEye: 'آپ کا ڈریگن', shTitle: 'آپ کا کو-فاؤنڈر کارڈ۔ شیئر کریں۔', shName: 'آپ کے ڈریگن کا نام', shNative: 'انسٹاگرام، ٹک ٹاک وغیرہ پر شیئر کریں',
  shNote: 'اسے انسٹاگرام، ٹک ٹاک یا فیس بک اسٹوری پر لگائیں۔ جو دوست آپ کا لنک کھولے گا، اسے اپنا انڈا اور اپنا نمبر ملے گا۔',
  shCopy: 'لنک کاپی کریں', shSave: 'تصویر محفوظ کریں', copied: 'لنک کاپی ہو گیا', saved: 'کارڈ محفوظ ہو گیا۔ اپنی اسٹوری پر لگائیں۔', saveErr: 'تصویر نہیں بن سکی۔ دوبارہ کوشش کریں۔',
  myDragon: 'میرا ڈریگن', cardHatched: 'ابھی انڈے سے نکلا', cardFrom: 'دی مدرز مونسٹر کی دنیا سے', cardCta: 'اپنا انڈا نکالیں · mythrafilm.com/egg', cardNoName: 'میرا ڈریگن نکل آیا',
  shareName: 'میرا ڈریگن {name} ابھی دی مدرز مونسٹر کی دنیا سے انڈے سے نکلا ہے 🐉 آپ کا انڈا انتظار میں ہے:',
  shareAnon: 'میرا ڈریگن ابھی دی مدرز مونسٹر کی دنیا سے انڈے سے نکلا ہے 🐉 آپ کا انڈا انتظار میں ہے:',
  cfEye: 'ڈریگن کو-فاؤنڈر · نمبر {n}',
  cfLabel: 'ڈریگن کو-فاؤنڈر',
  cfNo: 'نمبر {n}',
  cardLine: 'فلم سے پیدا ہونے والے پہلے ڈریگن کو حقیقت بنانے میں شامل',
  cardDragon: 'ڈریگن: {name}',
  shareCf: 'میں ڈریگن کو-فاؤنڈر نمبر {n} ہوں 🐉 دی مدرز مونسٹر کے ڈریگن کو دنیا کا پہلا فلم سے پیدا ہونے والا اسمارٹ پالتو بنانے میں میرا بھی حصہ ہے۔ اپنا انڈا نکالیں اور اپنا نمبر لیں:',
  shareCfName: 'میرا ڈریگن {name} انڈے سے نکل آیا اور میں ڈریگن کو-فاؤنڈر نمبر {n} ہوں 🐉 دی مدرز مونسٹر کے ڈریگن کو حقیقت بنانے میں میرا بھی حصہ ہے۔ اپنا انڈا نکالیں اور اپنا نمبر لیں:'
};

T.hi = {
  tagline: 'द मदर्स मॉन्स्टर · आपकी कहानी जारी है',
  langLabel: 'भाषा',
  s0e: 'फ़िल्म से आपका ड्रैगन अंडा', s0t: 'आपका ड्रैगन इंतज़ार कर रहा है।', s0h: 'अंडे को छुएँ', s0s: 'अपनी कहानी शुरू करें।',
  s1e: 'पहला रिश्ता', s1t: 'उसे पता है कि आप यहाँ हैं।', s1h: 'फिर से छुएँ', s1s: 'खोल के अंदर कुछ हिल रहा है।',
  s2e: 'बंधन', s2t: 'हर ड्रैगन को एक रखवाला चाहिए।', s2h: 'अपने ड्रैगन से मिलें', s2s: 'बस एक बार और। आपका ड्रैगन इंतज़ार में है।',
  awake: 'जाग रहा है', welcome: 'दुनिया में स्वागत है।',
  aftE: 'एक फ़िल्म से जन्मा', aftT: 'अब इसे घर लाने में मदद करें।', aftL: 'हम इस ड्रैगन को एक असली स्मार्ट पालतू बना रहे हैं जो आपके बच्चे के साथ बड़ा होगा।',
  ctaBack: 'ड्रैगन को घर लाएँ', ctaShare: 'अपना को-फ़ाउंडर कार्ड शेयर करें', skip: 'ड्रैगन अभियान देखें',
  soundOn: 'आवाज़ चालू', soundOff: 'आवाज़ बंद', motionOn: 'हलचल चालू', motionOff: 'हलचल बंद',

  hEye: 'MYTHRA हैचलिंग · जल्द Kickstarter पर',
  hTitle: 'फ़िल्म से जन्मा पहला पालतू।',
  hLead: 'करोड़ों लोग द मदर्स मॉन्स्टर में इस ड्रैगन से मिले। अब हम इसे एक असली स्मार्ट पालतू बना रहे हैं जो बात करता है, याद रखता है और आपके बच्चे के साथ बड़ा होता है।',
  goalOnly: 'Kickstarter का प्रस्तावित लक्ष्य', goalSub: 'पहले चलते-फिरते ड्रैगन बनाने के लिए',
  hCta: 'Kickstarter लॉन्च लिस्ट से जुड़ें', signups: '{n} रखवाले पहले से लॉन्च लिस्ट में', ksNotify: 'Kickstarter पर मुझे सूचना दें', notify: 'लॉन्च पर मुझे बताएँ', hNote: 'जुड़ना मुफ़्त है। आज कोई भुगतान नहीं। अभियान खुलते ही सबसे पहले आपको ख़बर मिलेगी, शुरुआती कीमत के साथ।',
  st1: 'सिर्फ़ 7 दिन में YouTube व्यूज़', st2: 'Facebook व्यूज़', st3: 'दुनिया भर में व्यूज़',
  stNote: 'स्टूडियो द्वारा बताए गए व्यूज़, आधिकारिक और शेयर की गई पोस्ट मिलाकर। व्यूज़ अलग-अलग दर्शक नहीं हैं।',

  wEye: 'हैचलिंग से मिलें', wTitle: 'एक ड्रैगन जो आपके बच्चे के साथ बड़ा होता है।',
  wLead: 'यह अंडे से निकलता है और दस साल में पाँच चरणों से गुज़रता है। जैसे-जैसे आपका बच्चा बड़ा होता है, इसे नया शरीर, नई क्षमताएँ और नई कहानियाँ मिलती हैं।',
  f1t: 'बात करता और सुनता है', f1d: 'यह अपना नाम, आपके बच्चे की आवाज़ और परिवार के हर सदस्य की आवाज़ पहचानता है।',
  f2t: 'याद रखता है', f2d: 'पहली कहानी, पहला टूटा दाँत, सबसे अच्छा दिन। 13 साल की उम्र में यह सब एक छपी हुई यादों की किताब बन जाता है।',
  f3t: 'साथ बड़ा होता है', f3d: 'हर चरण में नया खोल, पंख और हुनर आते हैं, इसलिए बच्चा इससे कभी बड़ा नहीं होता।',
  f4t: 'फ़िल्म की कहानियाँ', f4d: 'MYTHRA की दुनिया में सोने के समय की कहानियाँ और खोज, जिनका हीरो आपका बच्चा है।',
  f5t: 'सुरक्षा के साथ बना', f5d: 'कोई कैमरा नहीं। असली म्यूट बटन। बात खिलौने के अंदर ही समझी जाती है। सब कुछ माता-पिता के नियंत्रण में।',
  f6t: 'इंटरनेट के बिना चलता है', f6d: 'बातें, खेल, कहानियाँ और बड़ा होना सब इंटरनेट के बिना। कोई सब्सक्रिप्शन ज़रूरी नहीं।',
  sgEye: 'जीवन के पाँच चरण', sgTitle: 'एक ड्रैगन। दस साल।',
  g1: 'अंडा', g1a: 'जन्म का दिन', g2: 'हैचलिंग', g2a: 'उम्र 4–6', g3: 'फ़्लेजलिंग', g3a: 'उम्र 7–9', g4: 'युवा ड्रैगन', g4a: 'उम्र 10–12', g5: 'बुज़ुर्ग साथी', g5a: 'उम्र 13+',

  oEye: 'यह क्यों ज़रूरी है', oTitle: 'हर बच्चा ऐसा पालतू चाहता है जो सिर्फ़ उसका हो।',
  o1: '2024 में दुनिया भर में खिलौनों पर खर्च', o2: 'तामागोची डिजिटल पालतू बिके', o3: 'उस फ़िल्म के व्यूज़ जिससे यह ड्रैगन आया',
  oLead: 'डिजिटल पालतुओं ने साबित किया कि बच्चे खिलौने में रहने वाले पालतू का ख़याल रखते हैं। पर उनमें से कोई भी बच्चे के साथ बड़ा नहीं हुआ। हैचलिंग होता है, और यह एक ऐसी कहानी के साथ आता है जिसे करोड़ों लोग पहले से पसंद करते हैं।',
  oSrc: 'स्रोत',

  rEye: 'Kickstarter के प्रस्तावित इनाम', rTitle: 'ड्रैगन की कहानी में अपनी जगह चुनें।',
  rLead: 'ये वे इनाम हैं जो हम अभियान खुलने पर देने की योजना बना रहे हैं। लॉन्च लिस्ट में शामिल हर व्यक्ति का नाम हैच बुक में लिखा जाएगा, जो पहले रखवालों का रिकॉर्ड है। कीमतें अमेरिकी डॉलर में हैं।',
  rShip: 'प्रस्तावित इनाम। अंतिम कीमतें, संख्या और डिलीवरी की तारीख़ें लॉन्च के समय Kickstarter पेज पर तय होंगी।',
  loved: 'सबसे पसंदीदा', first200: 'सिर्फ़ पहले 200', only20: 'सिर्फ़ 20',
  t_ember: 'एम्बर', t_ember_b: 'हर उस व्यक्ति के लिए जिसने फ़िल्म देखी।',
  t_ember_1: 'संस्थापक रखवालों की हैच बुक में आपका नाम', t_ember_2: 'ड्रैगन वर्कशॉप से सिर्फ़ समर्थकों के लिए अपडेट', t_ember_3: 'ड्रैगन फ़ोन वॉलपेपर सेट',
  t_keeper: 'अंडे का रखवाला', t_keeper_b: 'आपके ड्रैगन का नाम सुरक्षित।',
  t_keeper_1: 'एम्बर की हर चीज़', t_keeper_2: 'लॉन्च से पहले अपने ड्रैगन का नाम सुरक्षित करें', t_keeper_3: 'नंबर वाला संस्थापक रखवाला प्रमाणपत्र', t_keeper_4: 'सोने के समय की पहली पाँच कहानियाँ ऑडियो में',
  t_hatchling: 'पहला बैच', t_hatchling_b: 'स्मार्ट ड्रैगन, संस्थापक कीमत पर।',
  t_hatchling_1: 'अंडे के रखवाले की हर चीज़', t_hatchling_2: 'हैचलिंग स्मार्ट ड्रैगन स्टार्टर सेट', t_hatchling_3: 'संस्थापक नंबर वाला अंडे का खोल', t_hatchling_4: 'संस्थापक कीमत: $179 की जगह $129',
  t_nest: 'फ़ैमिली घोंसला', t_nest_b: 'पूरे परिवार के लिए।',
  t_nest_1: 'पहले बैच की हर चीज़', t_nest_2: 'बच्चा तैयार हो तो पहली ग्रोथ किट', t_nest_3: 'एक साल की नई कहानियाँ और खोज', t_nest_4: 'MYTHRA के अगले अध्याय के क्रेडिट्स में आपके परिवार का नाम',
  t_patron: 'ड्रैगन संरक्षक', t_patron_b: 'अपना ड्रैगन फ़िल्म में लाएँ।',
  t_patron_1: 'फ़ैमिली घोंसले की हर चीज़', t_patron_2: 'आपका नाम दिया ड्रैगन MYTHRA के किसी अगले अध्याय में', t_patron_3: 'निर्देशक ज़ाहिद इक़बाल के साथ वीडियो कॉल', t_patron_4: 'गोल्ड एडिशन ड्रैगन, नंबर 1 से 20',

  uEye: 'आपका पैसा कहाँ जाता है', uTitle: 'हर डॉलर ड्रैगन बनाता है।',
  u1: 'चलता-फिरता प्रोटोटाइप और वॉइस AI', u2: 'खिलौने का डिज़ाइन और बाल-सुरक्षा जाँच', u3: 'फ़िल्म से कहानियाँ, आवाज़ और किरदार', u4: 'फ़ैक्टरी टूलिंग डिपॉज़िट',
  tlEye: 'जन्म के दिन तक का सफ़र',
  tl1d: 'नवंबर 2026 – मार्च 2027', tl1: 'परिवारों के साथ प्रोटोटाइप की जाँच',
  tl2d: 'वसंत 2027', tl2: 'Kickstarter खुलता है: लॉन्च लिस्ट को सबसे पहले ख़बर',
  tl3d: 'गर्मी 2027', tl3: 'सुरक्षा प्रमाणन और प्राइवेसी ऑडिट',
  tl4d: 'दिसंबर 2027 (लक्ष्य)', tl4: 'पहले ड्रैगन समर्थकों को रवाना',

  qEye: 'सवाल',
  q1: 'क्या अभी कुछ देना है?', a1: 'नहीं। लॉन्च लिस्ट से जुड़ना मुफ़्त है। आप तभी भुगतान करते हैं जब आप Kickstarter पर अभियान का समर्थन करना चुनें।',
  q2: 'क्या यह निवेश है?', a2: 'नहीं। Kickstarter समर्थकों को इनाम मिलते हैं, कोई हिस्सेदारी या आर्थिक मुनाफ़ा नहीं।',
  q3: 'क्या आप मेरे देश में भेजते हैं?', a3: 'हमारी योजना दुनिया भर में भेजने की है। शिपिंग की लागत अभियान खुलने पर Kickstarter पेज पर दिखाई जाएगी।',
  q4: 'क्या यह मेरे बच्चे के लिए सुरक्षित है?', a4: 'इसमें कोई कैमरा नहीं है। माइक्रोफ़ोन का असली म्यूट बटन है, रोज़ की बात खिलौने के अंदर ही समझी जाती है, और माता-पिता की अनुमति के बिना कुछ भी शेयर नहीं होता।',
  q5: 'ड्रैगन कौन-सी भाषाएँ बोलेगा?', a5: 'लॉन्च पर अंग्रेज़ी। फिर और भाषाएँ, इस पेज की भाषाओं से शुरू करके।',
  eTitle: 'हर ड्रैगन को एक रखवाला चाहिए।', eLead: 'पहले रखवालों में शामिल हों।',
  foot: 'MYTHRA स्टूडियोज़ · लाहौर',

  rvTitle: 'लॉन्च लिस्ट से जुड़ें', rvLead: 'मुफ़्त। Kickstarter खुलते ही हम आपको बताएँगे ताकि आप शुरुआती कीमत पा सकें।',
  rvName: 'आपका नाम', rvEmail: 'ईमेल', rvWa: 'WhatsApp नंबर', rvOpt: '(वैकल्पिक)', rvCountry: 'देश', rvTier: 'आपको कौन-सा इनाम चाहिए',
  rvConsent: 'Kickstarter खुलने पर मुझे ईमेल या WhatsApp करें।', rvSend: 'लिस्ट से जुड़ें', rvSending: 'भेजा जा रहा है…',
  rvOk: 'आप लिस्ट में शामिल हो गए, {name}। Kickstarter खुलते ही हम आपको बताएँगे, आपका {tier} इनाम तैयार रहेगा।',
  rvErrFields: 'अपना नाम और सही ईमेल लिखें।', rvErrConsent: 'बॉक्स पर निशान लगाएँ ताकि हम आपसे संपर्क कर सकें।', rvErrNet: 'MYTHRA से संपर्क नहीं हो सका। इंटरनेट जाँचें और फिर कोशिश करें।',
  close: 'बंद करें',

  shEye: 'आपका ड्रैगन', shTitle: 'आपका को-फ़ाउंडर कार्ड। शेयर करें।', shName: 'आपके ड्रैगन का नाम', shNative: 'Instagram, TikTok वगैरह पर शेयर करें',
  shNote: 'इसे इंस्टाग्राम, टिकटॉक या फ़ेसबुक स्टोरी पर लगाएँ। जो दोस्त आपका लिंक खोलेगा, उसे अपना अंडा और अपना नंबर मिलेगा।',
  shCopy: 'लिंक कॉपी करें', shSave: 'तस्वीर सेव करें', copied: 'लिंक कॉपी हो गया', saved: 'कार्ड सेव हो गया। अपनी स्टोरी पर लगाएँ।', saveErr: 'तस्वीर नहीं बन सकी। फिर कोशिश करें।',
  myDragon: 'मेरा ड्रैगन', cardHatched: 'अभी अंडे से निकला', cardFrom: 'द मदर्स मॉन्स्टर की दुनिया से', cardCta: 'अपना अंडा फोड़ें · mythrafilm.com/egg', cardNoName: 'मेरा ड्रैगन निकल आया',
  shareName: 'मेरा ड्रैगन {name} अभी द मदर्स मॉन्स्टर की दुनिया से अंडे से निकला 🐉 आपका अंडा इंतज़ार में है:',
  shareAnon: 'मेरा ड्रैगन अभी द मदर्स मॉन्स्टर की दुनिया से अंडे से निकला 🐉 आपका अंडा इंतज़ार में है:',
  cfEye: 'ड्रैगन को-फ़ाउंडर · नंबर {n}',
  cfLabel: 'ड्रैगन को-फ़ाउंडर',
  cfNo: 'नंबर {n}',
  cardLine: 'फ़िल्म से जन्मे पहले ड्रैगन को असली बनाने में साथ',
  cardDragon: 'ड्रैगन: {name}',
  shareCf: 'मैं ड्रैगन को-फ़ाउंडर नंबर {n} हूँ 🐉 द मदर्स मॉन्स्टर के ड्रैगन को दुनिया का पहला फ़िल्म से जन्मा स्मार्ट पालतू बनाने में मेरा भी हिस्सा है। अपना अंडा फोड़ें और अपना नंबर पाएँ:',
  shareCfName: 'मेरा ड्रैगन {name} अंडे से निकल आया और मैं ड्रैगन को-फ़ाउंडर नंबर {n} हूँ 🐉 द मदर्स मॉन्स्टर के ड्रैगन को असली बनाने में मेरा भी हिस्सा है। अपना अंडा फोड़ें और अपना नंबर पाएँ:'
};

T.ar = {
  tagline: 'وحش الأم · قصتك مستمرة',
  langLabel: 'اللغة',
  s0e: 'بيضة التنين من الفيلم', s0t: 'تنينك في انتظارك.', s0h: 'المس البيضة', s0s: 'ابدأ قصتك.',
  s1e: 'الاتصال الأول', s1t: 'إنه يعرف أنك هنا.', s1h: 'المسها مرة أخرى', s1s: 'شيء ما يتحرك داخل القشرة.',
  s2e: 'الرابطة', s2t: 'كل تنين يحتاج إلى حارس.', s2h: 'قابل تنينك', s2s: 'لمسة أخيرة. تنينك ينتظر.',
  awake: 'يستيقظ', welcome: 'مرحبًا بك في العالم.',
  aftE: 'وُلد من فيلم', aftT: 'ساعدنا الآن لنحضره إلى البيت.', aftL: 'نحوّل هذا التنين إلى حيوان أليف ذكي حقيقي يكبر مع طفلك.',
  ctaBack: 'أحضر التنين إلى البيت', ctaShare: 'شارك بطاقة الشريك المؤسس', skip: 'شاهد حملة التنين',
  soundOn: 'الصوت يعمل', soundOff: 'الصوت مغلق', motionOn: 'الحركة تعمل', motionOff: 'الحركة متوقفة',

  hEye: 'MYTHRA هاتشلينغ · قريبًا على كيكستارتر',
  hTitle: 'أول حيوان أليف وُلد من فيلم.',
  hLead: 'التقى الملايين بهذا التنين في فيلم وحش الأم. والآن نصنعه حيوانًا أليفًا ذكيًا حقيقيًا يتكلم ويتذكر ويكبر مع طفلك.',
  goalOnly: 'هدف كيكستارتر المخطط', goalSub: 'لصنع أول تنانين تعمل',
  hCta: 'انضم إلى قائمة إطلاق كيكستارتر', signups: '{n} حارسًا في قائمة الإطلاق بالفعل', ksNotify: 'نبّهني على كيكستارتر', notify: 'أخبرني عند الإطلاق', hNote: 'الانضمام مجاني. لا دفع اليوم. ستعرف أولًا عند فتح الحملة، مع السعر المبكر.',
  st1: 'مشاهدة على يوتيوب في 7 أيام', st2: 'مشاهدة على فيسبوك', st3: 'مشاهدة حول العالم',
  stNote: 'مشاهدات يعلنها الاستوديو عبر المنشورات الرسمية والمشاركة. المشاهدات ليست أشخاصًا فريدين.',

  wEye: 'تعرّف على هاتشلينغ', wTitle: 'تنين يكبر مع طفلك.',
  wLead: 'يفقس من بيضة ويمر بخمس مراحل خلال عشر سنوات. كلما كبر طفلك، يحصل على جسم جديد وقدرات جديدة وقصص جديدة.',
  f1t: 'يتكلم ويستمع', f1d: 'يعرف اسمه وصوت طفلك وصوت كل فرد في العائلة.',
  f2t: 'يتذكر', f2d: 'أول قصة، أول سن سقطت، أجمل يوم. وفي سن 13 يتحول كل ذلك إلى كتاب ذكريات مطبوع.',
  f3t: 'يكبر معهم', f3d: 'قشرة وأجنحة ومهارات جديدة في كل مرحلة، فلا يكبر الطفل عليه أبدًا.',
  f4t: 'قصص من الفيلم', f4d: 'قصص قبل النوم ومغامرات في عالم MYTHRA، وطفلك هو البطل.',
  f5t: 'آمن منذ التصميم', f5d: 'بلا كاميرا. زر كتم حقيقي. يُفهم الكلام داخل اللعبة نفسها. والتحكم الكامل للوالدين.',
  f6t: 'يعمل بلا إنترنت', f6d: 'الكلام والألعاب والقصص والنمو كلها تعمل بلا إنترنت. لا حاجة إلى اشتراك.',
  sgEye: 'خمس مراحل للحياة', sgTitle: 'تنين واحد. عشر سنوات.',
  g1: 'البيضة', g1a: 'يوم الفقس', g2: 'الفقيس', g2a: 'العمر 4–6', g3: 'الفرخ', g3a: 'العمر 7–9', g4: 'التنين الشاب', g4a: 'العمر 10–12', g5: 'الرفيق الحكيم', g5a: 'العمر 13+',

  oEye: 'لماذا يهم هذا', oTitle: 'كل طفل يريد حيوانًا أليفًا يخصه وحده.',
  o1: 'أُنفقت على الألعاب حول العالم في 2024', o2: 'حيوان تاماغوتشي رقمي بيع', o3: 'مشاهدة للفيلم الذي جاء منه هذا التنين',
  oLead: 'أثبتت الحيوانات الأليفة الرقمية أن الأطفال يعتنون بحيوان يعيش داخل لعبة. لكن لم يكبر أي منها مع الطفل. هاتشلينغ يفعل ذلك، ويأتي مع قصة يحبها الملايين بالفعل.',
  oSrc: 'المصادر',

  rEye: 'مكافآت كيكستارتر المخططة', rTitle: 'اختر مكانك في قصة التنين.',
  rLead: 'هذه هي المكافآت التي نخطط لتقديمها عند فتح الحملة. يُكتب اسم كل من في قائمة الإطلاق في كتاب الفقس، سجل الحراس الأوائل. الأسعار بالدولار الأمريكي.',
  rShip: 'مكافآت مخططة. تُحدد الأسعار النهائية والكميات ومواعيد التسليم على صفحة كيكستارتر عند الإطلاق.',
  loved: 'الأكثر حبًا', first200: 'لأول 200 فقط', only20: '20 فقط',
  t_ember: 'جمرة', t_ember_b: 'لكل من شاهد الفيلم.',
  t_ember_1: 'اسمك في كتاب الفقس للحراس المؤسسين', t_ember_2: 'تحديثات خاصة بالداعمين من ورشة التنين', t_ember_3: 'مجموعة خلفيات تنين للهاتف',
  t_keeper: 'حارس البيضة', t_keeper_b: 'اسم تنينك محجوز.',
  t_keeper_1: 'كل ما في جمرة', t_keeper_2: 'احجز اسم تنينك قبل الإطلاق', t_keeper_3: 'شهادة حارس مؤسس مرقمة', t_keeper_4: 'أول خمس قصص قبل النوم بالصوت',
  t_hatchling: 'الدفعة الأولى', t_hatchling_b: 'التنين الذكي بسعر المؤسسين.',
  t_hatchling_1: 'كل ما في حارس البيضة', t_hatchling_2: 'طقم بداية تنين هاتشلينغ الذكي', t_hatchling_3: 'قشرة بيضة مرقمة للمؤسسين', t_hatchling_4: 'سعر المؤسسين: 129$ بدلًا من 179$',
  t_nest: 'عش العائلة', t_nest_b: 'للعائلة كلها.',
  t_nest_1: 'كل ما في الدفعة الأولى', t_nest_2: 'أول طقم نمو عندما يكون طفلك جاهزًا', t_nest_3: 'سنة من القصص والمغامرات الجديدة', t_nest_4: 'اسم عائلتك في شارة الفصل القادم من MYTHRA',
  t_patron: 'راعي التنين', t_patron_b: 'ضع تنينك في الفيلم.',
  t_patron_1: 'كل ما في عش العائلة', t_patron_2: 'تنين تسميه أنت يظهر في فصل قادم من MYTHRA', t_patron_3: 'مكالمة فيديو مع المخرج زاهد إقبال', t_patron_4: 'تنين الإصدار الذهبي، مرقم من 1 إلى 20',

  uEye: 'أين يذهب دعمك', uTitle: 'كل دولار يبني التنين.',
  u1: 'نموذج أولي يعمل وذكاء صوتي', u2: 'تصميم اللعبة واختبارات سلامة الأطفال', u3: 'قصص وأصوات وشخصيات من الفيلم', u4: 'عربون قوالب المصنع',
  tlEye: 'الطريق إلى يوم الفقس',
  tl1d: 'نوفمبر 2026 – مارس 2027', tl1: 'اختبار النموذج الأولي مع العائلات',
  tl2d: 'ربيع 2027', tl2: 'تُفتح حملة كيكستارتر: قائمة الإطلاق تعرف أولًا',
  tl3d: 'صيف 2027', tl3: 'شهادات السلامة وتدقيق الخصوصية',
  tl4d: 'ديسمبر 2027 (مستهدف)', tl4: 'شحن أول التنانين إلى الداعمين',

  qEye: 'أسئلة',
  q1: 'هل أدفع شيئًا الآن؟', a1: 'لا. الانضمام إلى قائمة الإطلاق مجاني. تدفع فقط إذا اخترت دعم الحملة على كيكستارتر.',
  q2: 'هل هذا استثمار؟', a2: 'لا. يحصل داعمو كيكستارتر على مكافآت، لا على أسهم أو أي عائد مالي.',
  q3: 'هل تشحنون إلى بلدي؟', a3: 'نخطط للشحن إلى كل العالم. تظهر تكلفة الشحن على صفحة كيكستارتر عند فتح الحملة.',
  q4: 'هل هو آمن لطفلي؟', a4: 'لا توجد كاميرا. للميكروفونات زر كتم حقيقي، ويُفهم الكلام اليومي داخل اللعبة نفسها، ولا يُشارك أي شيء دون إذن الوالدين.',
  q5: 'ما اللغات التي سيتحدثها التنين؟', a5: 'الإنجليزية عند الإطلاق. ثم لغات أخرى، بدءًا باللغات الموجودة في هذه الصفحة.',
  eTitle: 'كل تنين يحتاج إلى حارس.', eLead: 'كن من الأوائل.',
  foot: 'استوديوهات MYTHRA · لاهور',

  rvTitle: 'انضم إلى قائمة الإطلاق', rvLead: 'مجانًا. سنخبرك لحظة فتح كيكستارتر لتحصل على السعر المبكر.',
  rvName: 'اسمك', rvEmail: 'البريد الإلكتروني', rvWa: 'رقم واتساب', rvOpt: '(اختياري)', rvCountry: 'البلد', rvTier: 'المكافأة التي تريدها',
  rvConsent: 'راسلوني بالبريد أو واتساب عند فتح كيكستارتر.', rvSend: 'انضم إلى القائمة', rvSending: 'جارٍ الإرسال…',
  rvOk: 'أنت في القائمة يا {name}. سنخبرك لحظة فتح كيكستارتر، ومكافأة {tier} بانتظارك.',
  rvErrFields: 'أضف اسمك وبريدًا إلكترونيًا صحيحًا.', rvErrConsent: 'ضع علامة في المربع حتى نتمكن من التواصل معك.', rvErrNet: 'تعذر الوصول إلى MYTHRA. تحقق من اتصالك وحاول مرة أخرى.',
  close: 'إغلاق',

  shEye: 'تنينك', shTitle: 'بطاقتك كشريك مؤسس. شاركها.', shName: 'اسم تنينك', shNative: 'شارك على إنستغرام وتيك توك وغيرها',
  shNote: 'انشرها في قصتك على إنستغرام أو تيك توك أو فيسبوك. كل صديق يفتح رابطك يفقس بيضته ويحصل على رقمه.',
  shCopy: 'نسخ الرابط', shSave: 'حفظ الصورة', copied: 'تم نسخ الرابط', saved: 'تم حفظ البطاقة. انشرها في قصتك.', saveErr: 'تعذر إنشاء الصورة. حاول مرة أخرى.',
  myDragon: 'تنيني', cardHatched: 'فقس للتو من البيضة', cardFrom: 'من عالم وحش الأم', cardCta: 'افقس بيضتك · mythrafilm.com/egg', cardNoName: 'فقس تنيني',
  shareName: 'تنيني {name} فقس للتو 🐉 من عالم وحش الأم. بيضتك تنتظرك:',
  shareAnon: 'تنيني فقس للتو 🐉 من عالم وحش الأم. بيضتك تنتظرك:',
  cfEye: 'شريك مؤسس للتنين · رقم {n}',
  cfLabel: 'شريك مؤسس للتنين',
  cfNo: 'رقم {n}',
  cardLine: 'يساعد في إحياء أول تنين وُلد من فيلم',
  cardDragon: 'التنين: {name}',
  shareCf: 'أصبحتُ الشريك المؤسس للتنين رقم {n} 🐉 أساعد في تحويل تنين فيلم وحش الأم إلى أول حيوان أليف ذكي وُلد من فيلم. افقس بيضتك واحصل على رقمك:',
  shareCfName: 'فقس تنيني {name} وأصبحتُ الشريك المؤسس للتنين رقم {n} 🐉 أساعد في إحياء تنين فيلم وحش الأم. افقس بيضتك واحصل على رقمك:'
};

T.es = {
  tagline: 'The Mother’s Monster · Tu historia continúa',
  langLabel: 'Idioma',
  s0e: 'Tu huevo de dragón de la película', s0t: 'Tu dragón te está esperando.', s0h: 'Toca el huevo', s0s: 'Empieza tu historia.',
  s1e: 'La primera conexión', s1t: 'Sabe que estás aquí.', s1h: 'Toca otra vez', s1s: 'Algo se mueve dentro de la cáscara.',
  s2e: 'El vínculo', s2t: 'Todo dragón necesita un Guardián.', s2h: 'Conoce a tu dragón', s2s: 'Un último toque. El tuyo te espera.',
  awake: 'Despertando', welcome: 'Bienvenido al mundo.',
  aftE: 'Nacido de una película', aftT: 'Ahora ayúdalo a llegar a casa.', aftL: 'Estamos convirtiendo este dragón en una mascota inteligente de verdad que crece con tu hijo.',
  ctaBack: 'Lleva el dragón a casa', ctaShare: 'Comparte tu tarjeta de Cofundador', skip: 'Ver la campaña del dragón',
  soundOn: 'Sonido sí', soundOff: 'Sonido no', motionOn: 'Movimiento sí', motionOff: 'Movimiento no',

  hEye: 'MYTHRA Hatchling · Muy pronto en Kickstarter',
  hTitle: 'La primera mascota nacida de una película.',
  hLead: 'Millones conocieron a este dragón en The Mother’s Monster. Ahora lo estamos creando como una mascota inteligente de verdad que habla, recuerda y crece con tu hijo.',
  goalOnly: 'Meta prevista en Kickstarter', goalSub: 'para construir los primeros dragones que funcionan',
  hCta: 'Únete a la lista de lanzamiento de Kickstarter', signups: '{n} Guardianes ya en la lista de lanzamiento', ksNotify: 'Avísame en Kickstarter', notify: 'Avísame en el lanzamiento', hNote: 'Unirte es gratis. Hoy no pagas nada. Te enterarás primero cuando abra la campaña, con el precio de lanzamiento.',
  st1: 'vistas en YouTube en 7 días', st2: 'vistas en Facebook', st3: 'vistas en todo el mundo',
  stNote: 'Vistas informadas por el estudio en publicaciones oficiales y compartidas. Las vistas no son espectadores únicos.',

  wEye: 'Conoce a Hatchling', wTitle: 'Un dragón que crece con tu hijo.',
  wLead: 'Sale de un huevo y pasa por cinco etapas en diez años. A medida que tu hijo crece, recibe un cuerpo nuevo, nuevas habilidades y nuevas historias.',
  f1t: 'Habla y escucha', f1d: 'Conoce su nombre, la voz de tu hijo y la de cada persona de la familia.',
  f2t: 'Recuerda', f2d: 'Su primera historia, su primer diente caído, su mejor día. A los 13 años todo se convierte en un Libro de Recuerdos impreso.',
  f3t: 'Crece con ellos', f3d: 'Nuevas cáscaras, alas y habilidades en cada etapa, así que nunca se queda pequeño.',
  f4t: 'Historias de la película', f4d: 'Cuentos para dormir y misiones en el mundo de MYTHRA, con tu hijo como héroe.',
  f5t: 'Seguro desde el diseño', f5d: 'Sin cámara. Un interruptor de silencio real. La voz se entiende dentro del juguete. Los padres lo controlan todo.',
  f6t: 'Funciona sin internet', f6d: 'Hablar, jugar, los cuentos y crecer funcionan sin internet. No hace falta suscripción.',
  sgEye: 'Cinco etapas de vida', sgTitle: 'Un dragón. Diez años.',
  g1: 'Huevo', g1a: 'Día de la eclosión', g2: 'Cría', g2a: '4–6 años', g3: 'Volantón', g3a: '7–9 años', g4: 'Dragón joven', g4a: '10–12 años', g5: 'Compañero sabio', g5a: '13+ años',

  oEye: 'Por qué importa', oTitle: 'Todo niño quiere una mascota que sea solo suya.',
  o1: 'gastados en juguetes en el mundo en 2024', o2: 'mascotas digitales Tamagotchi vendidas', o3: 'vistas de la película de la que viene este dragón',
  oLead: 'Las mascotas digitales demostraron que los niños cuidan de una mascota que vive dentro de un juguete. Ninguna creció con el niño. Hatchling sí, y llega con una historia que millones ya aman.',
  oSrc: 'Fuentes',

  rEye: 'Recompensas previstas en Kickstarter', rTitle: 'Elige tu lugar en la historia del dragón.',
  rLead: 'Estas son las recompensas que planeamos ofrecer cuando abra la campaña. Todos los de la lista de lanzamiento quedan escritos en el Libro de la Eclosión, el registro de los primeros Guardianes. Precios en dólares estadounidenses.',
  rShip: 'Recompensas previstas. Los precios finales, los límites y las fechas de entrega se fijan en la página de Kickstarter al lanzar.',
  loved: 'El favorito', first200: 'Solo los primeros 200', only20: 'Solo 20',
  t_ember: 'Brasa', t_ember_b: 'Para todos los que vieron la película.',
  t_ember_1: 'Tu nombre en el Libro de la Eclosión de Guardianes fundadores', t_ember_2: 'Novedades exclusivas del taller del dragón', t_ember_3: 'Fondos de pantalla del dragón para el móvil',
  t_keeper: 'Guardián del Huevo', t_keeper_b: 'El nombre de tu dragón, reservado.',
  t_keeper_1: 'Todo lo de Brasa', t_keeper_2: 'Reserva el nombre de tu dragón antes del lanzamiento', t_keeper_3: 'Certificado numerado de Guardián fundador', t_keeper_4: 'Los primeros cinco cuentos para dormir en audio',
  t_hatchling: 'Primera Nidada', t_hatchling_b: 'El dragón inteligente al precio fundador.',
  t_hatchling_1: 'Todo lo de Guardián del Huevo', t_hatchling_2: 'El set inicial del dragón inteligente Hatchling', t_hatchling_3: 'Cáscara de huevo numerada de fundador', t_hatchling_4: 'Precio fundador: $129 en lugar de $179',
  t_nest: 'Nido Familiar', t_nest_b: 'Para toda la familia.',
  t_nest_1: 'Todo lo de Primera Nidada', t_nest_2: 'El primer kit de crecimiento cuando tu hijo esté listo', t_nest_3: 'Un año de nuevas historias y misiones', t_nest_4: 'El nombre de tu familia en los créditos del próximo capítulo de MYTHRA',
  t_patron: 'Mecenas del Dragón', t_patron_b: 'Pon a tu dragón en la película.',
  t_patron_1: 'Todo lo de Nido Familiar', t_patron_2: 'Un dragón con el nombre que elijas aparece en un próximo capítulo de MYTHRA', t_patron_3: 'Una videollamada con el director Zahid Iqbal', t_patron_4: 'Dragón edición oro, numerado del 1 al 20',

  uEye: 'A dónde va tu aporte', uTitle: 'Cada dólar construye el dragón.',
  u1: 'Prototipo funcional e IA de voz', u2: 'Diseño del juguete y pruebas de seguridad infantil', u3: 'Historias, voz y personaje de la película', u4: 'Depósito de moldes de fábrica',
  tlEye: 'El camino al día de la eclosión',
  tl1d: 'Nov 2026 – Mar 2027', tl1: 'Prototipo probado con familias',
  tl2d: 'Primavera 2027', tl2: 'Abre Kickstarter: la lista de lanzamiento se entera primero',
  tl3d: 'Verano 2027', tl3: 'Certificación de seguridad y auditoría de privacidad',
  tl4d: 'Diciembre 2027 (objetivo)', tl4: 'Los primeros dragones llegan a los mecenas',

  qEye: 'Preguntas',
  q1: '¿Tengo que pagar algo ahora?', a1: 'No. Unirte a la lista de lanzamiento es gratis. Solo pagas si decides apoyar la campaña en Kickstarter.',
  q2: '¿Es una inversión?', a2: 'No. Los mecenas de Kickstarter reciben recompensas, no acciones ni ningún rendimiento financiero.',
  q3: '¿Envían a mi país?', a3: 'Planeamos enviar a todo el mundo. El costo de envío aparecerá en la página de Kickstarter cuando abra la campaña.',
  q4: '¿Es seguro para mi hijo?', a4: 'No tiene cámara. Los micrófonos tienen un interruptor de silencio físico, la voz se entiende dentro del juguete y nada se comparte sin permiso de los padres.',
  q5: '¿Qué idiomas hablará el dragón?', a5: 'Inglés en el lanzamiento. Después más idiomas, empezando por los de esta página.',
  eTitle: 'Todo dragón necesita un Guardián.', eLead: 'Sé uno de los primeros.',
  foot: 'MYTHRA Studios · Lahore',

  rvTitle: 'Únete a la lista de lanzamiento', rvLead: 'Gratis. Te avisaremos en cuanto abra Kickstarter para que consigas el precio de lanzamiento.',
  rvName: 'Tu nombre', rvEmail: 'Correo electrónico', rvWa: 'Número de WhatsApp', rvOpt: '(opcional)', rvCountry: 'País', rvTier: 'La recompensa que quieres',
  rvConsent: 'Escríbanme por correo o WhatsApp cuando abra Kickstarter.', rvSend: 'Unirme a la lista', rvSending: 'Enviando…',
  rvOk: 'Ya estás en la lista, {name}. Te avisaremos en cuanto abra Kickstarter, con tu recompensa {tier} lista.',
  rvErrFields: 'Escribe tu nombre y un correo válido.', rvErrConsent: 'Marca la casilla para que podamos contactarte.', rvErrNet: 'No pudimos conectar con MYTHRA. Revisa tu conexión e inténtalo de nuevo.',
  close: 'Cerrar',

  shEye: 'Tu dragón', shTitle: 'Tu tarjeta de Cofundador. Compártela.', shName: 'El nombre de tu dragón', shNative: 'Compartir en Instagram, TikTok y más',
  shNote: 'Publícala en tu historia de Instagram, TikTok o Facebook. Cada amigo que abra tu enlace eclosiona su propio huevo y recibe su número.',
  shCopy: 'Copiar enlace', shSave: 'Guardar imagen', copied: 'Enlace copiado', saved: 'Tarjeta guardada. Publícala en tu historia.', saveErr: 'No se pudo crear la imagen. Inténtalo de nuevo.',
  myDragon: 'Mi dragón', cardHatched: 'acaba de salir del huevo', cardFrom: 'del mundo de The Mother’s Monster', cardCta: 'Eclosiona tu huevo · mythrafilm.com/egg', cardNoName: 'Nació mi dragón',
  shareName: 'Mi dragón {name} acaba de nacer 🐉 del mundo de The Mother’s Monster. Tu huevo te espera:',
  shareAnon: 'Mi dragón acaba de nacer 🐉 del mundo de The Mother’s Monster. Tu huevo te espera:',
  cfEye: 'Cofundador del Dragón · N.º {n}',
  cfLabel: 'Cofundador del Dragón',
  cfNo: 'N.º {n}',
  cardLine: 'Ayudando a dar vida al primer dragón nacido de una película',
  cardDragon: 'Dragón: {name}',
  shareCf: 'Ahora soy Cofundador del Dragón N.º {n} 🐉 Estoy ayudando a dar vida al dragón de The Mother’s Monster como la primera mascota inteligente nacida de una película. Eclosiona tu huevo y consigue tu número:',
  shareCfName: 'Mi dragón {name} acaba de nacer y soy Cofundador del Dragón N.º {n} 🐉 Estoy ayudando a dar vida al dragón de The Mother’s Monster. Eclosiona tu huevo y consigue tu número:'
};

T.id = {
  tagline: 'The Mother’s Monster · Ceritamu berlanjut',
  langLabel: 'Bahasa',
  s0e: 'Telur nagamu dari film', s0t: 'Nagamu sedang menunggu.', s0h: 'Sentuh telurnya', s0s: 'Mulai ceritamu.',
  s1e: 'Ikatan pertama', s1t: 'Ia tahu kamu di sini.', s1h: 'Sentuh lagi', s1s: 'Ada yang bergerak di dalam cangkang.',
  s2e: 'Ikatan', s2t: 'Setiap naga butuh seorang Penjaga.', s2h: 'Temui nagamu', s2s: 'Satu sentuhan lagi. Nagamu menunggu.',
  awake: 'Terbangun', welcome: 'Selamat datang di dunia.',
  aftE: 'Lahir dari sebuah film', aftT: 'Sekarang bantu ia pulang.', aftL: 'Kami menjadikan naga ini hewan peliharaan pintar sungguhan yang tumbuh bersama anakmu.',
  ctaBack: 'Bawa naga pulang', ctaShare: 'Bagikan kartu Co-Founder-mu', skip: 'Lihat kampanye naga',
  soundOn: 'Suara nyala', soundOff: 'Suara mati', motionOn: 'Gerak nyala', motionOff: 'Gerak mati',

  hEye: 'MYTHRA Hatchling · Segera di Kickstarter',
  hTitle: 'Hewan peliharaan pertama yang lahir dari film.',
  hLead: 'Jutaan orang bertemu naga ini di The Mother’s Monster. Kini kami membuatnya menjadi hewan peliharaan pintar sungguhan yang bisa bicara, mengingat, dan tumbuh bersama anakmu.',
  goalOnly: 'Target Kickstarter yang direncanakan', goalSub: 'untuk membuat naga pertama yang berfungsi',
  hCta: 'Gabung daftar peluncuran Kickstarter', signups: '{n} Penjaga sudah ada di daftar peluncuran', ksNotify: 'Beri tahu saya di Kickstarter', notify: 'Kabari saya saat peluncuran', hNote: 'Gratis. Tidak ada pembayaran hari ini. Kamu yang pertama tahu saat kampanye dibuka, dengan harga awal.',
  st1: 'tayangan YouTube dalam 7 hari', st2: 'tayangan Facebook', st3: 'tayangan di seluruh dunia',
  stNote: 'Tayangan menurut studio dari unggahan resmi dan yang dibagikan. Tayangan bukan jumlah penonton unik.',

  wEye: 'Kenalan dengan Hatchling', wTitle: 'Naga yang tumbuh bersama anakmu.',
  wLead: 'Ia menetas dari telur dan melewati lima tahap selama sepuluh tahun. Seiring anakmu tumbuh, ia mendapat tubuh baru, kemampuan baru, dan cerita baru.',
  f1t: 'Bicara dan mendengar', f1d: 'Ia tahu namanya, suara anakmu, dan suara setiap anggota keluarga.',
  f2t: 'Mengingat', f2d: 'Cerita pertama, gigi pertama yang copot, hari terbaik. Di usia 13 semuanya menjadi Buku Kenangan cetak.',
  f3t: 'Tumbuh bersama', f3d: 'Cangkang, sayap, dan kemampuan baru di setiap tahap, jadi tidak pernah ketinggalan.',
  f4t: 'Cerita dari film', f4d: 'Dongeng sebelum tidur dan petualangan di dunia MYTHRA, dengan anakmu sebagai pahlawannya.',
  f5t: 'Aman sejak dirancang', f5d: 'Tanpa kamera. Tombol bisu sungguhan. Suara dipahami di dalam mainan. Orang tua mengendalikan semuanya.',
  f6t: 'Bisa tanpa internet', f6d: 'Bicara, bermain, cerita, dan tumbuh semuanya bisa tanpa internet. Tidak perlu langganan.',
  sgEye: 'Lima tahap kehidupan', sgTitle: 'Satu naga. Sepuluh tahun.',
  g1: 'Telur', g1a: 'Hari menetas', g2: 'Bayi naga', g2a: 'Usia 4–6', g3: 'Naga kecil', g3a: 'Usia 7–9', g4: 'Naga muda', g4a: 'Usia 10–12', g5: 'Sahabat bijak', g5a: 'Usia 13+',

  oEye: 'Mengapa ini penting', oTitle: 'Setiap anak ingin hewan peliharaan yang benar-benar miliknya.',
  o1: 'dibelanjakan untuk mainan di seluruh dunia pada 2024', o2: 'hewan peliharaan digital Tamagotchi terjual', o3: 'tayangan film asal naga ini',
  oLead: 'Hewan peliharaan digital membuktikan anak-anak mau merawat hewan yang hidup di dalam mainan. Tak satu pun tumbuh bersama anak. Hatchling tumbuh bersama mereka, dan datang dengan cerita yang sudah dicintai jutaan orang.',
  oSrc: 'Sumber',

  rEye: 'Rencana hadiah Kickstarter', rTitle: 'Pilih tempatmu dalam kisah sang naga.',
  rLead: 'Ini hadiah yang kami rencanakan saat kampanye dibuka. Semua yang ada di daftar peluncuran dicatat di Buku Penetasan, catatan para Penjaga pertama. Harga dalam dolar AS.',
  rShip: 'Rencana hadiah. Harga akhir, batas jumlah, dan tanggal pengiriman ditetapkan di halaman Kickstarter saat peluncuran.',
  loved: 'Paling disukai', first200: 'Hanya 200 pertama', only20: 'Hanya 20',
  t_ember: 'Bara', t_ember_b: 'Untuk semua yang menonton filmnya.',
  t_ember_1: 'Namamu di Buku Penetasan para Penjaga pendiri', t_ember_2: 'Kabar khusus pendukung dari bengkel naga', t_ember_3: 'Set wallpaper ponsel naga',
  t_keeper: 'Penjaga Telur', t_keeper_b: 'Nama nagamu, dipesan.',
  t_keeper_1: 'Semua isi Bara', t_keeper_2: 'Pesan nama nagamu sebelum peluncuran', t_keeper_3: 'Sertifikat Penjaga pendiri bernomor', t_keeper_4: 'Lima dongeng sebelum tidur pertama dalam audio',
  t_hatchling: 'Tetasan Pertama', t_hatchling_b: 'Naga pintar dengan harga pendiri.',
  t_hatchling_1: 'Semua isi Penjaga Telur', t_hatchling_2: 'Set awal naga pintar Hatchling', t_hatchling_3: 'Cangkang telur bernomor pendiri', t_hatchling_4: 'Harga pendiri: $129, bukan $179',
  t_nest: 'Sarang Keluarga', t_nest_b: 'Untuk seluruh keluarga.',
  t_nest_1: 'Semua isi Tetasan Pertama', t_nest_2: 'Kit tumbuh pertama saat anakmu siap', t_nest_3: 'Satu tahun cerita dan petualangan baru', t_nest_4: 'Nama keluargamu di kredit bab MYTHRA berikutnya',
  t_patron: 'Pelindung Naga', t_patron_b: 'Masukkan nagamu ke dalam film.',
  t_patron_1: 'Semua isi Sarang Keluarga', t_patron_2: 'Naga yang kamu beri nama muncul di bab MYTHRA mendatang', t_patron_3: 'Panggilan video dengan sutradara Zahid Iqbal', t_patron_4: 'Naga edisi emas, bernomor 1 sampai 20',

  uEye: 'Ke mana dukunganmu pergi', uTitle: 'Setiap dolar membangun sang naga.',
  u1: 'Prototipe yang berfungsi dan AI suara', u2: 'Desain mainan dan uji keamanan anak', u3: 'Cerita, suara, dan karakter dari film', u4: 'Uang muka cetakan pabrik',
  tlEye: 'Jalan menuju hari menetas',
  tl1d: 'Nov 2026 – Mar 2027', tl1: 'Prototipe diuji bersama keluarga',
  tl2d: 'Musim semi 2027', tl2: 'Kickstarter dibuka: daftar peluncuran tahu lebih dulu',
  tl3d: 'Pertengahan 2027', tl3: 'Sertifikasi keamanan dan audit privasi',
  tl4d: 'Desember 2027 (target)', tl4: 'Naga pertama dikirim ke pendukung',

  qEye: 'Pertanyaan',
  q1: 'Apakah saya bayar sesuatu sekarang?', a1: 'Tidak. Gabung daftar peluncuran itu gratis. Kamu hanya membayar jika memilih mendukung kampanye di Kickstarter.',
  q2: 'Apakah ini investasi?', a2: 'Bukan. Pendukung Kickstarter menerima hadiah, bukan saham atau keuntungan finansial apa pun.',
  q3: 'Apakah dikirim ke negaraku?', a3: 'Kami berencana mengirim ke seluruh dunia. Ongkos kirim ditampilkan di halaman Kickstarter saat kampanye dibuka.',
  q4: 'Apakah aman untuk anakku?', a4: 'Tidak ada kamera. Mikrofonnya punya tombol bisu fisik, ucapan sehari-hari dipahami di dalam mainan, dan tidak ada yang dibagikan tanpa izin orang tua.',
  q5: 'Bahasa apa yang akan digunakan naga?', a5: 'Bahasa Inggris saat peluncuran. Lalu bahasa lain menyusul, dimulai dari bahasa di halaman ini.',
  eTitle: 'Setiap naga butuh seorang Penjaga.', eLead: 'Jadilah salah satu yang pertama.',
  foot: 'MYTHRA Studios · Lahore',

  rvTitle: 'Gabung daftar peluncuran', rvLead: 'Gratis. Kami akan mengabarimu begitu Kickstarter dibuka agar kamu dapat harga awal.',
  rvName: 'Namamu', rvEmail: 'Email', rvWa: 'Nomor WhatsApp', rvOpt: '(opsional)', rvCountry: 'Negara', rvTier: 'Hadiah yang kamu inginkan',
  rvConsent: 'Hubungi saya lewat email atau WhatsApp saat Kickstarter dibuka.', rvSend: 'Gabung daftar', rvSending: 'Mengirim…',
  rvOk: 'Kamu sudah ada di daftar, {name}. Kami akan mengabarimu begitu Kickstarter dibuka, dengan hadiah {tier} siap untukmu.',
  rvErrFields: 'Isi namamu dan email yang valid.', rvErrConsent: 'Centang kotaknya agar kami bisa menghubungimu.', rvErrNet: 'Tidak bisa terhubung ke MYTHRA. Periksa koneksimu dan coba lagi.',
  close: 'Tutup',

  shEye: 'Nagamu', shTitle: 'Kartu Co-Founder-mu. Bagikan.', shName: 'Nama nagamu', shNative: 'Bagikan ke Instagram, TikTok, dan lainnya',
  shNote: 'Pasang di story Instagram, TikTok, atau Facebook. Setiap teman yang membuka tautanmu menetaskan telurnya sendiri dan dapat nomornya.',
  shCopy: 'Salin tautan', shSave: 'Simpan gambar', copied: 'Tautan disalin', saved: 'Kartu disimpan. Unggah ke story-mu.', saveErr: 'Gambar gagal dibuat. Coba lagi.',
  myDragon: 'Nagaku', cardHatched: 'baru saja menetas', cardFrom: 'dari dunia The Mother’s Monster', cardCta: 'Tetaskan telurmu · mythrafilm.com/egg', cardNoName: 'Nagaku menetas',
  shareName: 'Nagaku {name} baru saja menetas 🐉 dari dunia The Mother’s Monster. Telurmu menunggu:',
  shareAnon: 'Nagaku baru saja menetas 🐉 dari dunia The Mother’s Monster. Telurmu menunggu:',
  cfEye: 'Co-Founder Naga · No. {n}',
  cfLabel: 'Co-Founder Naga',
  cfNo: 'No. {n}',
  cardLine: 'Ikut menghidupkan naga pertama yang lahir dari film',
  cardDragon: 'Naga: {name}',
  shareCf: 'Aku sekarang Co-Founder Naga No. {n} 🐉 Aku ikut menghidupkan naga dari The Mother’s Monster sebagai hewan peliharaan pintar pertama yang lahir dari film. Tetaskan telurmu dan dapatkan nomormu:',
  shareCfName: 'Nagaku {name} baru menetas dan aku jadi Co-Founder Naga No. {n} 🐉 Aku ikut menghidupkan naga dari The Mother’s Monster. Tetaskan telurmu dan dapatkan nomormu:'
};

const LANGS = [['en','English'],['ur','اردو'],['hi','हिन्दी'],['ar','العربية'],['es','Español'],['id','Bahasa Indonesia']];
const RTL = { ur: 1, ar: 1 };
const FONTS = {
  ur: 'Noto+Nastaliq+Urdu:wght@400;600',
  ar: 'Noto+Naskh+Arabic:wght@400;500;600',
  hi: 'Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Serif+Devanagari:wght@500'
};

function pickLang(){
  const ok = l => l && T[l] ? l : null;
  const q = new URLSearchParams(location.search).get('lang');
  if (ok(q)) return q;
  let saved = null; try { saved = localStorage.getItem('mythra-lang'); } catch(e){}
  if (ok(saved)) return saved;
  for (const n of (navigator.languages || [navigator.language || 'en'])){
    const base = String(n).toLowerCase().split('-')[0];
    if (base === 'in' || base === 'ms') return 'id';
    if (ok(base)) return base;
  }
  return 'en';
}

let lang = pickLang();
const listeners = [];
const t = (k, vars) => {
  let s = (T[lang] && T[lang][k]) || T.en[k] || k;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, v) => (v in vars ? vars[v] : m));
  return s;
};
function loadFont(l){
  if (!FONTS[l] || document.getElementById('font-' + l)) return;
  const link = document.createElement('link'); link.id = 'font-' + l; link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${FONTS[l]}&display=swap`;
  document.head.append(link);
}
function apply(){
  const root = document.documentElement;
  root.lang = lang; root.dir = RTL[lang] ? 'rtl' : 'ltr';
  loadFont(lang);
  document.querySelectorAll('[data-i]').forEach(el => { el.textContent = t(el.dataset.i); });
  document.querySelectorAll('[data-i-label]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.iLabel)); });
  listeners.forEach(f => { try { f(lang); } catch(e){} });
}
function set(l){
  if (!T[l] || l === lang) return;
  lang = l; try { localStorage.setItem('mythra-lang', l); } catch(e){}
  apply();
}

window.MI = { t, set, apply, get lang(){ return lang; }, langs: LANGS, onChange(f){ listeners.push(f); } };
})();
