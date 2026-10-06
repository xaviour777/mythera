
(() => {
'use strict';
const $ = s => document.querySelector(s);
const store = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};
const rnd = (a,b) => a + Math.random()*(b-a);
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
let motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   AUDIO — ambient hall, heartbeat, cracks, hatch, fire
   ========================================================= */
const A = {
  ctx:null, master:null, verb:null, pad:[], on:false, wanted:true, hbTimer:null, hbRate:0, crackleTimer:null,
  start(){
    if (this.ctx){ this.unmute(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.0001; this.master.connect(c.destination);
    // reverb
    const len = c.sampleRate * 4.5, ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch=0; ch<2; ch++){ const d = ir.getChannelData(ch); for (let i=0;i<len;i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 2.6); }
    this.verb = c.createConvolver(); this.verb.buffer = ir;
    const vg = c.createGain(); vg.gain.value = 0.9; this.verb.connect(vg); vg.connect(this.master);
    // pad: D minor add9, slow breathing filter
    const lp = c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value = 520; lp.Q.value = 0.6;
    const lfo = c.createOscillator(), lfoG = c.createGain(); lfo.frequency.value = 0.06; lfoG.gain.value = 260; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start();
    const padG = c.createGain(); padG.gain.value = 0.05; lp.connect(padG); padG.connect(this.master); padG.connect(this.verb);
    [73.42, 110.0, 174.61, 220.0, 329.63].forEach((f,i) => {
      [-7, 7].forEach(det => {
        const o = c.createOscillator(); o.type = i < 2 ? 'sawtooth' : 'triangle';
        o.frequency.value = f; o.detune.value = det; const g = c.createGain(); g.gain.value = i < 2 ? .5 : .35;
        o.connect(g); g.connect(lp); o.start(); this.pad.push({o, base:f, idx:i});
      });
    });
    // wind
    const nb = c.createBuffer(1, c.sampleRate*3, c.sampleRate), nd = nb.getChannelData(0);
    let last = 0; for (let i=0;i<nd.length;i++){ last = (last + (Math.random()*2-1)*0.06) * 0.985; nd[i] = last*3; }
    const wind = c.createBufferSource(); wind.buffer = nb; wind.loop = true;
    const bp = c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value = 380; bp.Q.value = 0.5;
    const wl = c.createOscillator(), wlg = c.createGain(); wl.frequency.value = 0.09; wlg.gain.value = 220; wl.connect(wlg); wlg.connect(bp.frequency); wl.start();
    const wg = c.createGain(); wg.gain.value = 0.35; wind.connect(bp); bp.connect(wg); wg.connect(this.master); wg.connect(this.verb); wind.start();
    // torch crackle
    const crackle = () => {
      if (this.on && Math.random() < .7) this.noise({dur: rnd(.01,.04), freq: rnd(2500,6000), q: 1.5, gain: rnd(.03,.09), pan: rnd(-.8,.8), type:'highpass', verb:.2});
      this.crackleTimer = setTimeout(crackle, rnd(60, 380));
    };
    crackle();
    this.unmute();
  },
  unmute(){ if(!this.ctx) return; this.ctx.resume(); this.on = true; const t=this.ctx.currentTime; this.master.gain.cancelScheduledValues(t); this.master.gain.setValueAtTime(Math.max(.0001,this.master.gain.value),t); this.master.gain.exponentialRampToValueAtTime(0.9, t+2.5); },
  mute(){ if(!this.ctx) return; this.on = false; const t=this.ctx.currentTime; this.master.gain.cancelScheduledValues(t); this.master.gain.setValueAtTime(Math.max(.0001,this.master.gain.value),t); this.master.gain.exponentialRampToValueAtTime(0.0001, t+.6); },
  noise({dur=.2, freq=1200, q=1, gain=.3, pan=0, type='bandpass', verb=.4, sweepTo=null}){
    const c = this.ctx; if (!c || !this.on) return;
    const n = Math.max(1, Math.floor(c.sampleRate*dur)), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i=0;i<n;i++) d[i] = (Math.random()*2-1);
    const s = c.createBufferSource(); s.buffer = b;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const t = c.currentTime;
    if (sweepTo){ f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(sweepTo[0], t+dur*.35); f.frequency.exponentialRampToValueAtTime(sweepTo[1], t+dur); }
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + Math.min(.02, dur*.2)); g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    s.connect(f); f.connect(g);
    if (p){ p.pan.value = pan; g.connect(p); p.connect(this.master); } else g.connect(this.master);
    if (verb){ const vs = c.createGain(); vs.gain.value = verb; g.connect(vs); vs.connect(this.verb); }
    s.start(t); s.stop(t+dur+.05);
  },
  tone(freq, dur, {type='sine', gain=.2, glide=null, verb=.6, attack=.01}={}){
    const c = this.ctx; if (!c || !this.on) return;
    const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glide) glide.forEach(([f,dt]) => o.frequency.exponentialRampToValueAtTime(f, t+dt));
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t+attack); g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
    o.connect(g); g.connect(this.master);
    if (verb){ const vs = c.createGain(); vs.gain.value = verb; g.connect(vs); vs.connect(this.verb); }
    o.start(t); o.stop(t+dur+.05);
  },
  heartbeat(rate){
    this.hbRate = rate; if (this.hbTimer) return;
    const beat = () => {
      if (!this.hbRate){ this.hbTimer = null; return; }
      this.tone(58, .32, {gain:.32, glide:[[38,.28]], verb:.25});
      setTimeout(() => this.tone(52, .28, {gain:.22, glide:[[36,.24]], verb:.25}), 190);
      this.hbTimer = setTimeout(beat, this.hbRate);
    };
    beat();
  },
  crack(level){
    this.noise({dur:.09, freq:3200, q:.8, gain:.5, type:'highpass', verb:.35});
    setTimeout(()=>this.noise({dur:.22, freq:900+level*500, q:2.5, gain:.35, verb:.5}), 40);
    this.tone(90 - level*8, .5, {type:'triangle', gain:.18, verb:.4});
  },
  hatch(){
    this.hbRate = 0;
    this.noise({dur:.6, freq:500, q:.6, gain:.55, type:'lowpass', verb:.7});
    this.noise({dur:.18, freq:4000, q:.7, gain:.4, type:'highpass', verb:.6});
    // pad turns from minor to major
    const t = this.ctx ? this.ctx.currentTime : 0;
    this.pad.forEach(p => { if (p.base === 174.61) p.o.frequency.setTargetAtTime(185.0, t, 1.2); });
    [587.33, 739.99, 880, 1174.66, 1479.98].forEach((f,i) => setTimeout(() => this.tone(f, 3.2, {gain:.07, verb:1.2, attack:.02}), 120 + i*140));
  },
  chirp(){ this.tone(900, .28, {type:'sine', gain:.12, glide:[[1700,.1],[1250,.26]], verb:.5}); setTimeout(()=>this.tone(1100,.22,{gain:.08, glide:[[1900,.08],[1500,.2]], verb:.5}),170); },
  fire(dur){ this.noise({dur, freq:280, q:.7, gain:.42, type:'lowpass', verb:.5, sweepTo:[2400, 420]}); this.noise({dur:dur*.8, freq:1800, q:.4, gain:.08, type:'highpass', verb:.3}); }
};

const soundTog = $('#soundTog'), motionTog = $('#motionTog');
function paintToggles(){
  soundTog.setAttribute('aria-pressed', String(A.on)); soundTog.textContent = A.on ? 'Sound on' : 'Sound off';
  motionTog.setAttribute('aria-pressed', String(motion)); motionTog.textContent = motion ? 'Motion on' : 'Motion off';
}
paintToggles();
soundTog.addEventListener('click', e => {
  e.stopPropagation();
  if (A.on){ A.wanted = false; A.mute(); } else { A.wanted = true; A.start(); }
  paintToggles();
});
motionTog.addEventListener('click', e => { e.stopPropagation(); motion = !motion; paintToggles(); });
// the first touch anywhere opens the hall's sound
addEventListener('pointerdown', () => { if (A.wanted && !A.on){ A.start(); paintToggles(); } }, {once:false, passive:true});
addEventListener('keydown', e => { if ((e.key==='Enter'||e.key===' ') && A.wanted && !A.on){ A.start(); paintToggles(); } });

/* =========================================================
   CANVASES
   ========================================================= */
const bg = $('#bg'), bctx = bg.getContext('2d');
const fx = $('#fx'), fctx = fx.getContext('2d');
const slot = $('#slot'), dragon = $('#dragon'), figure = $('#figure'), tilt = $('#tilt');
function loadDragon(){ if (dragon.dataset.src){ dragon.src = dragon.dataset.src; delete dragon.dataset.src; } }
('requestIdleCallback' in window ? requestIdleCallback : (f)=>setTimeout(f,1200))(loadDragon);
let W=0, H=0, DPR=1;
let hall = null;          // static hall render
let braziers = [];        // positions for live flames
let eggImg = null;        // static egg render
let eggW = 0, eggH = 0;
let mouse = {x:0, y:0, tx:0, ty:0};

function slotBox(){
  const r = slot.getBoundingClientRect();
  let eh = clamp(r.height * .86, 170, 400); eh = Math.min(eh, r.width*.58/.74); const ew = eh * .74;
  return { cx: r.left + r.width/2, bottom: r.bottom - r.height*.04, ew, eh, rect:r };
}

function resize(){
  DPR = Math.min(2, devicePixelRatio || 1);
  W = innerWidth; H = innerHeight;
  for (const c of [bg, fx]){ c.width = Math.round(W*DPR); c.height = Math.round(H*DPR); }
  bctx.setTransform(DPR,0,0,DPR,0,0); fctx.setTransform(DPR,0,0,DPR,0,0);
  buildHall();
  const sb = slotBox();
  if (Math.abs(sb.ew - eggW) > 2 || !eggImg) buildEgg(sb.ew, sb.eh);
}

/* ---------- the hall ---------- */
function buildHall(){
  const c = document.createElement('canvas'); const pad = 40;
  c.width = Math.round((W+pad*2)*DPR); c.height = Math.round((H+pad*2)*DPR);
  const g = c.getContext('2d'); g.setTransform(DPR,0,0,DPR,0,0); g.translate(pad,pad);
  const cx = W/2;
  const sb = slotBox();
  const floorY = clamp(sb.bottom - 8 + scrollY, H*.55, H*.92);
  const horizon = floorY - Math.min(H*.2, 170);

  // base
  let gr = g.createLinearGradient(0,-pad,0,H+pad);
  gr.addColorStop(0,'#06080a'); gr.addColorStop(.45,'#0d1114'); gr.addColorStop(.75,'#0a0c0e'); gr.addColorStop(1,'#040505');
  g.fillStyle = gr; g.fillRect(-pad,-pad,W+pad*2,H+pad*2);

  // far gate: tall arch with cold light
  const gw = Math.min(W*.2, 260), gTop = H*.06;
  g.save();
  g.beginPath(); g.moveTo(cx-gw/2, horizon); g.lineTo(cx-gw/2, gTop+gw/2); g.arc(cx, gTop+gw/2, gw/2, Math.PI, 0); g.lineTo(cx+gw/2, horizon); g.closePath();
  gr = g.createLinearGradient(0,gTop,0,horizon); gr.addColorStop(0,'#2b3640'); gr.addColorStop(.6,'#1a2128'); gr.addColorStop(1,'#11161a');
  g.fillStyle = gr; g.fill();
  g.clip();
  // inner pillars of the far gate
  for (let i=-2;i<=2;i++){ const x = cx + i*gw*.22; g.fillStyle='rgba(8,10,12,.55)'; g.fillRect(x-gw*.05, gTop+gw*.4, gw*.1, horizon); }
  g.restore();
  // cold shaft
  gr = g.createLinearGradient(cx,0,cx,floorY);
  gr.addColorStop(0,'rgba(170,190,210,.10)'); gr.addColorStop(1,'rgba(170,190,210,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(cx-gw*.25,0); g.lineTo(cx+gw*.25,0); g.lineTo(cx+gw*1.1,floorY); g.lineTo(cx-gw*1.1,floorY); g.closePath(); g.fill();

  // stairs from the gate down toward the altar
  const steps = 9;
  for (let i=0;i<steps;i++){
    const t = i/steps, y = horizon + t*(floorY - horizon)*.55, h = (floorY-horizon)*.55/steps;
    const w = gw*(1 + t*1.9);
    g.fillStyle = `rgb(${18+i*1.5|0},${21+i*1.6|0},${25+i*1.7|0})`; g.fillRect(cx-w/2, y, w, h);
    g.fillStyle = 'rgba(210,190,150,.07)'; g.fillRect(cx-w/2, y, w, 1);
  }

  // colonnade: far to near, both sides
  braziers = [];
  const rows = 6;
  for (let i=0;i<rows;i++){
    const d = i/(rows-1);
    const off = W*(.13 + Math.pow(d,1.5)*.37);
    const pw = W*(.022 + d*.075) + 6;
    const bottom = horizon + (floorY-horizon)*(.05 + d*.55);
    const fog = 1 - d;
    for (const side of [-1,1]){
      const x = cx + side*off - pw/2;
      // shaft
      gr = g.createLinearGradient(x,0,x+pw,0);
      const base = [14+fog*22, 17+fog*24, 20+fog*26];
      const lit = side<0 ? [1.0,.55] : [.55,1.0];
      gr.addColorStop(0, `rgb(${base[0]*lit[0]+ (side>0?0:18*d)|0},${base[1]*lit[0]+(side>0?0:12*d)|0},${base[2]*lit[0]|0})`);
      gr.addColorStop(.5, `rgb(${base[0]*.7|0},${base[1]*.7|0},${base[2]*.75|0})`);
      gr.addColorStop(1, `rgb(${base[0]*lit[1]+(side<0?0:18*d)|0},${base[1]*lit[1]+(side<0?0:12*d)|0},${base[2]*lit[1]|0})`);
      g.fillStyle = gr; g.fillRect(x, -pad, pw, bottom+pad);
      // fluting
      g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1;
      const fl = Math.max(3, Math.round(pw/9));
      for (let k=1;k<fl;k++){ const fxp = x + k*pw/fl; g.beginPath(); g.moveTo(fxp, H*.08); g.lineTo(fxp, bottom - pw*.5); g.stroke(); }
      // carved bands
      for (const by of [H*.08, H*.22]){ g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x-pw*.08, by, pw*1.16, pw*.18 + 3); g.fillStyle='rgba(200,170,120,.06)'; g.fillRect(x-pw*.08, by, pw*1.16, 1); }
      // base plinth
      g.fillStyle = `rgb(${10+fog*16|0},${12+fog*17|0},${14+fog*19|0})`;
      g.fillRect(x - pw*.18, bottom - pw*.55, pw*1.36, pw*.55);
      g.fillStyle = 'rgba(210,180,130,.08)'; g.fillRect(x - pw*.18, bottom - pw*.55, pw*1.36, 1);
      // fog over far columns
      g.fillStyle = `rgba(20,26,31,${fog*.45})`; g.fillRect(x, -pad, pw, bottom+pad);
      if (i >= 2) braziers.push({ x: side<0 ? x + pw + pw*.15 : x - pw*.15, y: bottom - pw*.2 - pw*.55, s: (.4 + d*.9)*clamp(W/1300,.45,1), side });
    }
  }
  // arches across the top
  g.fillStyle = 'rgba(3,4,5,.85)';
  g.beginPath(); g.moveTo(-pad,-pad); g.lineTo(W+pad,-pad); g.lineTo(W+pad, H*.04); g.quadraticCurveTo(cx, H*.2, -pad, H*.04); g.closePath(); g.fill();

  // floor
  gr = g.createLinearGradient(0, horizon, 0, H+pad);
  gr.addColorStop(0,'rgba(12,15,18,0)'); gr.addColorStop(.35,'rgba(9,11,13,.9)'); gr.addColorStop(1,'#030404');
  g.fillStyle = gr; g.fillRect(-pad, horizon, W+pad*2, H-horizon+pad);
  // brazier light pools on the floor
  for (const b of braziers){
    const r = 140*b.s;
    const p = g.createRadialGradient(b.x, b.y+r*.25, 0, b.x, b.y+r*.25, r*1.6);
    p.addColorStop(0,'rgba(255,140,50,.10)'); p.addColorStop(1,'rgba(255,150,60,0)');
    g.fillStyle = p; g.fillRect(b.x-r*2, b.y-r, r*4, r*3);
    // bowl
    g.fillStyle = '#0b0b0b'; g.beginPath(); g.ellipse(b.x, b.y, 16*b.s, 6*b.s, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = '#0b0b0b'; g.fillRect(b.x-3*b.s, b.y, 6*b.s, 30*b.s);
  }

  // the altar platform under the egg
  const prx = Math.min(W*.44, 560), pry = prx*.17, py = floorY;
  g.fillStyle = '#060707'; g.beginPath(); g.ellipse(cx, py + pry*.35, prx, pry, 0, 0, Math.PI*2); g.fill();
  gr = g.createRadialGradient(cx, py - pry*.2, 0, cx, py, prx);
  gr.addColorStop(0,'#2a2621'); gr.addColorStop(.5,'#16161a'); gr.addColorStop(1,'#0b0c0e');
  g.fillStyle = gr; g.beginPath(); g.ellipse(cx, py, prx, pry, 0, 0, Math.PI*2); g.fill();
  g.lineWidth = 1;
  for (let k=1;k<=4;k++){ g.strokeStyle = `rgba(214,182,128,${.05 + k*.025})`; g.beginPath(); g.ellipse(cx, py, prx*(1-k*.17), pry*(1-k*.17), 0, 0, Math.PI*2); g.stroke(); }
  // engraved ticks around the outer ring
  g.strokeStyle = 'rgba(214,182,128,.14)';
  for (let a=0;a<Math.PI*2;a+=Math.PI/36){
    const x1 = cx + Math.cos(a)*prx*.86, y1 = py + Math.sin(a)*pry*.86, x2 = cx + Math.cos(a)*prx*.95, y2 = py + Math.sin(a)*pry*.95;
    g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
  }
  // vignette
  gr = g.createRadialGradient(cx, H*.5, Math.min(W,H)*.25, cx, H*.5, Math.max(W,H)*.8);
  gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.75)');
  g.fillStyle = gr; g.fillRect(-pad,-pad,W+pad*2,H+pad*2);

  hall = {c, pad, floorY, prx, pry, scroll: scrollY, slotAbs: sb.bottom + scrollY};
}

/* ---------- the egg ---------- */
function eggHalfWidth(v, rx){ return rx * Math.sqrt(Math.max(0, 1 - v*v)) * (0.9 + 0.1*v); }
function eggPath(g, cx, cy, rx, ry){
  g.beginPath();
  const N = 90;
  for (let i=0;i<=N;i++){ const v = -1 + 2*i/N; const x = cx + eggHalfWidth(v, rx), y = cy + v*ry; i ? g.lineTo(x,y) : g.moveTo(x,y); }
  for (let i=N;i>=0;i--){ const v = -1 + 2*i/N; g.lineTo(cx - eggHalfWidth(v, rx), cy + v*ry); }
  g.closePath();
}
let crackPaths = [];
function buildEgg(ew, eh){
  eggW = ew; eggH = eh;
  const S = 2, c = document.createElement('canvas');
  c.width = Math.round(ew*S*1.3); c.height = Math.round(eh*S*1.12);
  const g = c.getContext('2d'); g.scale(S,S);
  const cx = ew*.65, cy = eh*.56, rx = ew*.5, ry = eh*.5;
  g.save(); eggPath(g, cx, cy, rx, ry); g.clip();
  let gr = g.createLinearGradient(cx-rx,0,cx+rx,0);
  gr.addColorStop(0,'#18222c'); gr.addColorStop(.45,'#2b3a47'); gr.addColorStop(.75,'#7a5c34'); gr.addColorStop(1,'#d39a45');
  g.fillStyle = gr; g.fillRect(0,0,ew*1.3,eh*1.12);
  // scales, bottom rows first so upper rows overlap them
  const R = 15, rowH = 2*ry/R;
  for (let j=R+1;j>=-1;j--){
    const v = -1 + (j+0.5)*2/R; if (v <= -1 || v >= 1.02) continue;
    const y = cy + v*ry, hw = eggHalfWidth(clamp(v,-.999,.999), rx);
    const s = rowH*1.5;
    const n = Math.max(4, Math.round((Math.PI*hw)/(s*.62)));
    for (let k=0;k<=n;k++){
      const u = -1 + (k + (j%2)*.5)*2/n; if (u < -1.05 || u > 1.05) continue;
      const ang = clamp(u,-1,1)*Math.PI/2;
      const x = cx + hw*Math.sin(ang);
      const fore = Math.cos(ang);
      const sw = s*(0.25 + 0.75*fore)*1.05, sh = s*(.62 + .1*fore);
      const light = clamp((u + 1)/2, 0, 1);       // lit from the right
      const L = Math.pow(light, 1.7);
      const vert = 1 - Math.abs(v)*.35;
      const col = [ (38 + (214-38)*L)*vert, (56 + (150-56)*L)*vert, (72 + (66-72)*L)*vert ];
      const sg = g.createLinearGradient(x, y - sh*.5, x, y + sh*.6);
      sg.addColorStop(0, `rgb(${col[0]*1.25|0},${col[1]*1.25|0},${col[2]*1.3|0})`);
      sg.addColorStop(1, `rgb(${col[0]*.55|0},${col[1]*.55|0},${col[2]*.6|0})`);
      g.beginPath();
      g.moveTo(x - sw/2, y - sh*.45);
      g.quadraticCurveTo(x - sw/2, y + sh*.3, x, y + sh*.6);
      g.quadraticCurveTo(x + sw/2, y + sh*.3, x + sw/2, y - sh*.45);
      g.closePath();
      g.fillStyle = sg; g.fill();
      g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = .7; g.stroke();
      // lit lower rim on each scale
      g.beginPath(); g.moveTo(x - sw*.42, y + sh*.12); g.quadraticCurveTo(x - sw*.4, y + sh*.38, x, y + sh*.52);
      g.strokeStyle = `rgba(255,214,150,${.05 + .3*L})`; g.lineWidth = .8; g.stroke();
    }
  }
  // spherical shading
  gr = g.createRadialGradient(cx + rx*.25, cy - ry*.3, rx*.1, cx, cy, ry*1.05);
  gr.addColorStop(0,'rgba(255,230,190,.10)'); gr.addColorStop(.55,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.6)');
  g.fillStyle = gr; g.fillRect(0,0,ew*1.3,eh*1.12);
  // left cold side
  gr = g.createLinearGradient(cx-rx,0,cx,0); gr.addColorStop(0,'rgba(0,0,0,.55)'); gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0,0,ew*1.3,eh*1.12);
  g.restore();
  // warm rim
  g.save(); eggPath(g, cx, cy, rx, ry); g.clip();
  g.shadowColor = 'rgba(255,170,70,.9)'; g.shadowBlur = 18; g.lineWidth = 3; g.strokeStyle = 'rgba(255,190,100,.55)';
  g.beginPath(); for (let i=0;i<=40;i++){ const v = -.85 + 1.7*i/40; const x = cx + eggHalfWidth(v, rx)-1, y = cy + v*ry; i? g.lineTo(x,y):g.moveTo(x,y); } g.stroke();
  g.restore();
  eggImg = {c, S, cx, cy, rx, ry, ox: ew*.65, oy: eh*.56};

  // crack geometry in egg units (u: -1..1 across, v: -1..1 down)
  const main = []; let u = .06;
  for (let i=0;i<=22;i++){ const v = -.97 + i*1.94/22; u += (i%2 ? 1 : -1) * rnd(.05,.11); u = clamp(u, -.14, .2); main.push([u, v]); }
  const branch = (from, len, dir) => { const pts = [main[from]]; let [bu,bv] = main[from]; for (let i=0;i<len;i++){ bu += dir*rnd(.06,.12); bv += rnd(.03,.08)*(i%2?1:-.4); pts.push([bu,bv]); } return pts; };
  crackPaths = [ {pts: main.slice(0,14), at:1}, {pts: main.slice(13), at:2}, {pts: branch(7,5,-1), at:2}, {pts: branch(16,5,1), at:2}, {pts: branch(4,4,1), at:3}, {pts: branch(19,4,-1), at:3} ];
}

/* ---------- state machine ---------- */
const SCENES = [
  { eyebrow:'Your free digital dragon egg', title:'Your dragon is waiting.', hint:'Touch the egg', sub:'Begin your story.' },
  { eyebrow:'The first connection', title:'It knows you’re here.', hint:'Touch again', sub:'Something stirs inside the shell.' },
  { eyebrow:'The bond', title:'Every dragon needs a Keeper.', hint:'Meet your dragon', sub:'One last touch. Yours is waiting.' }
];
const S = { taps:0, crackT:[0,0,0,0], shake:0, glow:0, phase:'egg', hatchAt:0, shards:[], flash:0, fire:[], embers:[], mist:[], flames:[], fireUntil:0, fireRate:0 };
const copy = $('#copy'), eyebrow = $('#eyebrow'), title = $('#title'), lead = $('#lead');
const prompt = $('#prompt'), hint = $('#hint'), sub = $('#sub'), dots = [...document.querySelectorAll('.dots i')], ctas = $('#ctas');
const choose = $('#choose');

function swapCopy(fn, el = copy, ms = 480){ el.classList.add('out'); setTimeout(() => { fn(); el.classList.remove('out'); }, ms); }
function setScene(i){
  const sc = SCENES[i];
  swapCopy(() => { eyebrow.textContent = sc.eyebrow; title.textContent = sc.title; });
  swapCopy(() => { hint.textContent = sc.hint; sub.textContent = sc.sub; dots.forEach((d,k)=>d.classList.toggle('on', k < i)); }, prompt, 380);
}

function touchEgg(){
  if (S.phase !== 'egg') return;
  S.taps++; S.shake = 1; S.glow = 1; S.crackT[S.taps] = performance.now();
  A.crack(S.taps);
  if (S.taps === 1){ A.heartbeat(1250); ctas.style.visibility = 'hidden'; }
  if (S.taps === 2) A.heartbeat(820);
  if (S.taps < 3){ setScene(S.taps); return; }
  // third touch: hatch
  dots.forEach(d=>d.classList.add('on'));
  A.heartbeat(420);
  S.phase = 'trembling';
  swapCopy(() => { eyebrow.textContent = 'Awakening'; title.textContent = 'Welcome to the world.'; });
  prompt.classList.add('out');
  slot.classList.add('done'); slot.setAttribute('aria-label','Your dragon');
  setTimeout(hatch, 1300);
}
slot.addEventListener('click', touchEgg);
slot.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' '){ e.preventDefault(); touchEgg(); } });

function hatch(){
  S.phase = 'hatched'; S.hatchAt = performance.now(); S.flash = 1;
  A.hatch();
  makeShards();
  loadDragon();
  setTimeout(() => { figure.classList.add('in'); A.chirp(); }, 250);
  // a small sneeze of fire, then a real breath
  setTimeout(() => breathe(.28, 50), 2300);
  setTimeout(() => breathe(1.0, 150), 3300);
  setTimeout(showChoice, 4900);
}
function breathe(sec, rate){
  S.fireUntil = performance.now() + sec*1000; S.fireRate = rate;
  dragon.classList.remove('recoil'); void dragon.offsetWidth; dragon.classList.add('recoil');
  setTimeout(()=>dragon.classList.remove('recoil'), 950);
  track('hatch_fire');
  A.fire(sec + .35);
}
function showChoice(){
  swapCopy(() => { eyebrow.textContent = 'Your next chapter'; title.textContent = 'You found each other.'; lead.hidden = false; lead.textContent = 'Choose your place in MYTHRA.'; });
  prompt.hidden = true;
  choose.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => choose.classList.remove('out')));
  $('#toggles').classList.add('hide');
}

function makeShards(){
  const sb = slotBox(), e = eggImg; if (!e) return;
  const x0 = sb.cx - e.ox, y0 = sb.bottom - eggH*1.06;
  const cols = 4, rows = 5, pts = [];
  for (let r=0;r<=rows;r++){ pts[r] = []; for (let c=0;c<=cols;c++){
    const edge = r===0||r===rows||c===0||c===cols;
    pts[r][c] = [ (c/cols)*eggW*1.3 + (edge?0:rnd(-.08,.08)*eggW), (r/rows)*eggH*1.12 + (edge?0:rnd(-.07,.07)*eggH) ];
  } }
  S.shards = [];
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
    const poly = [pts[r][c], pts[r][c+1], pts[r+1][c+1], pts[r+1][c]];
    const mx = poly.reduce((a,p)=>a+p[0],0)/4, my = poly.reduce((a,p)=>a+p[1],0)/4;
    const dx = mx - e.ox, dy = my - e.oy;
    const d = Math.hypot(dx,dy) || 1;
    S.shards.push({ poly, mx, my, x:x0, y:y0, vx: dx/d*rnd(160,420), vy: dy/d*rnd(120,300) - rnd(260,480), rot:0, vr:rnd(-5,5), life:1 });
  }
}

/* ---------- ambient particles ---------- */
function seedAmbient(){
  S.mist = Array.from({length:9}, () => ({ x: rnd(0,W), y: rnd(H*.55, H*1.02), r: rnd(160, 380), v: rnd(6,18)*(Math.random()<.5?-1:1), a: rnd(.04,.09) }));
  S.embers = Array.from({length: 46}, () => newEmber(true));
}
function newEmber(init){ return { x: rnd(0,W), y: init ? rnd(0,H) : H + 10, vy: rnd(-26,-8), vx: rnd(-6,6), r: rnd(.6,1.8), a: rnd(.25,.8), tw: rnd(0,6) }; }

/* ---------- frame ---------- */
let last = performance.now();
let hallPending = false;
function frame(now){
  const dt = Math.min(.05, (now - last)/1000); last = now;
  mouse.x += (mouse.tx - mouse.x)*.05; mouse.y += (mouse.ty - mouse.y)*.05;
  const px = motion ? mouse.x : 0, py = motion ? mouse.y : 0;
  const t = now/1000;

  // --- background: hall, mist, braziers
  bctx.clearRect(0,0,W,H);
  if (hall){
    const sy = scrollY - hall.scroll;
    bctx.drawImage(hall.c, -hall.pad - px*14, -hall.pad - py*8 - sy*.35, W + hall.pad*2, H + hall.pad*2);
  }
  // braziers
  for (const b of braziers){
    const fl = motion ? .75 + Math.sin(t*9 + b.x)*.12 + Math.sin(t*23 + b.y)*.08 : .85;
    const bx = b.x - px*14*(.4+b.s*.6), by = b.y - py*8 - (scrollY - (hall?hall.scroll:0))*.35;
    const r = 70*b.s*fl;
    const gl = bctx.createRadialGradient(bx, by-10*b.s, 0, bx, by-10*b.s, r*2.2);
    gl.addColorStop(0, `rgba(255,150,60,${.2*fl})`); gl.addColorStop(1,'rgba(255,120,40,0)');
    bctx.fillStyle = gl; bctx.fillRect(bx-r*2.2, by-r*2.4, r*4.4, r*4.4);
    if (motion && Math.random() < .55) S.flames.push({ x: bx + rnd(-5,5)*b.s, y: by - 2, vx: rnd(-6,6), vy: rnd(-60,-34)*b.s, life: rnd(.3,.6), max: 0, s: b.s*rnd(2.5,5) });
    if (!motion){ bctx.fillStyle = 'rgba(255,190,100,.8)'; bctx.beginPath(); bctx.ellipse(bx, by-8*b.s, 6*b.s, 12*b.s, 0, 0, Math.PI*2); bctx.fill(); }
  }
  bctx.globalCompositeOperation = 'lighter';
  for (let i=S.flames.length-1;i>=0;i--){
    const p = S.flames[i]; p.max += dt; if (p.max > p.life){ S.flames.splice(i,1); continue; }
    p.x += p.vx*dt; p.y += p.vy*dt; const k = p.max/p.life;
    const rr = p.s*(1-k*.6);
    const col = k < .25 ? [255,200,110] : k < .6 ? [255,130,40] : [180,60,20];
    bctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${(1-k)*.4})`;
    bctx.beginPath(); bctx.arc(p.x, p.y, rr, 0, Math.PI*2); bctx.fill();
  }
  bctx.globalCompositeOperation = 'source-over';
  // mist
  for (const m of S.mist){
    if (motion){ m.x += m.v*dt; if (m.x < -m.r) m.x = W + m.r; if (m.x > W + m.r) m.x = -m.r; }
    const gm = bctx.createRadialGradient(m.x - px*20, m.y, 0, m.x - px*20, m.y, m.r);
    gm.addColorStop(0, `rgba(150,160,170,${m.a})`); gm.addColorStop(1,'rgba(150,160,170,0)');
    bctx.fillStyle = gm; bctx.fillRect(m.x - m.r - px*20, m.y - m.r, m.r*2, m.r*2);
  }

  // --- fx: egg, shards, fire, flash, embers
  fctx.clearRect(0,0,W,H);
  const sb = slotBox();
  if (hall && !hallPending && Math.abs(sb.bottom + scrollY - hall.slotAbs) > 24){ hallPending = true; setTimeout(() => { buildHall(); hallPending = false; }, 250); }
  const dw = Math.round(Math.min(540, W*.92, sb.rect.height*1.3));
  if (figure._w !== dw){ figure.style.setProperty('--fw', dw + 'px'); figure._w = dw; }
  if (S.phase === 'hatched'){
    tilt.style.setProperty('--ry', (px*14).toFixed(2)+'deg');
    tilt.style.setProperty('--rx', (-py*7).toFixed(2)+'deg');
    tilt.style.setProperty('--fy', (motion ? Math.sin(t*1.4)*5 : 0).toFixed(1)+'px');
  }
  const e = eggImg;
  if (e && (S.phase === 'egg' || S.phase === 'trembling')){
    S.shake *= .9; S.glow *= .97;
    let wob = S.shake * Math.sin(t*38) * .05;
    if (S.phase === 'trembling') wob = Math.sin(t*46) * .045 * (motion ? 1 : .3);
    const float = motion ? Math.sin(t*1.2)*3 : 0;
    const x0 = sb.cx - e.ox - px*6, y0 = sb.bottom - eggH*1.06 + float;
    const base = { x: sb.cx - px*6, y: sb.bottom };
    // aura behind the egg
    const heat = S.taps/3;
    const ag = fctx.createRadialGradient(sb.cx, y0 + e.oy, eggW*.2, sb.cx, y0 + e.oy, eggW*1.4);
    ag.addColorStop(0, `rgba(255,170,80,${.10 + heat*.16 + S.glow*.15 + (motion? Math.sin(t*1.8)*.03:0)})`); ag.addColorStop(1,'rgba(255,170,80,0)');
    fctx.fillStyle = ag; fctx.fillRect(sb.cx - eggW*1.5, y0 - eggH*.4, eggW*3, eggH*1.8);
    // contact shadow
    fctx.fillStyle = 'rgba(0,0,0,.55)'; fctx.beginPath(); fctx.ellipse(base.x, base.y - 2, eggW*.42, eggW*.07, 0, 0, Math.PI*2); fctx.fill();
    fctx.save();
    fctx.translate(base.x, base.y); fctx.rotate(wob); fctx.translate(-base.x, -base.y);
    fctx.drawImage(e.c, x0, y0, eggW*1.3, eggH*1.12);
    // cracks
    const ex = x0 + e.ox, ey = y0 + e.oy;
    fctx.save(); eggPath(fctx, ex, ey, e.rx, e.ry); fctx.clip();
    for (const cp of crackPaths){
      if (S.taps < cp.at) continue;
      const born = S.crackT[cp.at] || 0, grow = clamp((now - born)/650, 0, 1);
      const n = Math.max(2, Math.ceil(cp.pts.length*grow));
      const path = () => { fctx.beginPath(); cp.pts.slice(0,n).forEach(([u,v],i)=>{ const X = ex + u*eggHalfWidth(clamp(v,-.99,.99), e.rx), Y = ey + v*e.ry; i?fctx.lineTo(X,Y):fctx.moveTo(X,Y); }); };
      const pulse = .75 + (motion ? Math.sin(t*3 + cp.at)*.25 : .1) + (S.phase==='trembling'? .3:0);
      path(); fctx.strokeStyle = `rgba(255,150,50,${.35*pulse})`; fctx.lineWidth = 7; fctx.shadowColor = 'rgba(255,150,60,1)'; fctx.shadowBlur = 18; fctx.stroke();
      path(); fctx.shadowBlur = 0; fctx.strokeStyle = `rgba(255,226,160,${.95*Math.min(1,pulse)})`; fctx.lineWidth = 1.6; fctx.stroke();
    }
    fctx.restore();
    fctx.restore();
  }
  // shards
  if (S.shards.length && e){
    for (const s of S.shards){
      s.vy += 900*dt; s.x += s.vx*dt; s.y += s.vy*dt; s.rot += s.vr*dt; s.life -= dt*.75;
    }
    S.shards = S.shards.filter(s => s.life > 0);
    for (const s of S.shards){
      fctx.save(); fctx.globalAlpha = clamp(s.life,0,1);
      fctx.translate(s.x + s.mx, s.y + s.my); fctx.rotate(s.rot); fctx.translate(-s.mx, -s.my);
      fctx.beginPath(); s.poly.forEach(([x,y],i)=> i?fctx.lineTo(x,y):fctx.moveTo(x,y)); fctx.closePath(); fctx.clip();
      fctx.drawImage(e.c, 0, 0, eggW*1.3, eggH*1.12);
      fctx.restore();
    }
  }
  // flash
  if (S.flash > 0.01){
    const fg = fctx.createRadialGradient(sb.cx, sb.bottom - eggH*.5, 0, sb.cx, sb.bottom - eggH*.5, Math.max(W,H)*.8);
    fg.addColorStop(0, `rgba(255,236,200,${S.flash})`); fg.addColorStop(.35, `rgba(255,170,80,${S.flash*.5})`); fg.addColorStop(1,'rgba(255,140,60,0)');
    fctx.fillStyle = fg; fctx.fillRect(0,0,W,H); S.flash *= .955;
  }
  // a warm pool of light on the nest once hatched
  if (S.phase === 'hatched'){
    const k = clamp((now - S.hatchAt)/1500, 0, 1);
    const lg = fctx.createRadialGradient(sb.cx, sb.bottom - 20, 0, sb.cx, sb.bottom - 20, Math.min(W*.5, 520));
    lg.addColorStop(0, `rgba(255,180,110,${.12*k})`); lg.addColorStop(1,'rgba(255,180,110,0)');
    fctx.fillStyle = lg; fctx.fillRect(0,0,W,H);
  }
  // fire from the dragon's mouth
  if (now < S.fireUntil){
    const r = dragon.getBoundingClientRect();
    const mx = r.left + r.width*.155, my = r.top + r.height*.37;
    const nEmit = S.fireRate*dt*(motion?1.6:.6);
    for (let i=0;i<nEmit;i++){
      const a = 3.3 + rnd(-.17,.17), sp = rnd(240,430)*(r.width/560);
      S.fire.push({ x: mx, y: my, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, life: rnd(.5,.95), age:0, s: rnd(5,9)*(r.width/560) });
    }
  }
  if (S.fire.length){
    fctx.globalCompositeOperation = 'lighter';
    for (let i=S.fire.length-1;i>=0;i--){
      const p = S.fire[i]; p.age += dt; if (p.age > p.life){ S.fire.splice(i,1); continue; }
      const k = p.age/p.life;
      p.vx *= .985; p.vy = p.vy*.985 - 120*dt; p.x += p.vx*dt; p.y += p.vy*dt;
      const rr = p.s*(1 + k*5);
      const col = k < .15 ? [255,250,220] : k < .4 ? [255,200,90] : k < .7 ? [255,120,40] : [170,50,20];
      const fg = fctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr);
      fg.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${(1-k)*.85})`); fg.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
      fctx.fillStyle = fg; fctx.beginPath(); fctx.arc(p.x,p.y,rr,0,Math.PI*2); fctx.fill();
    }
    fctx.globalCompositeOperation = 'source-over';
  }
  // drifting embers
  if (motion){
    for (const m of S.embers){
      m.y += m.vy*dt; m.x += (m.vx + Math.sin(t + m.tw)*4)*dt;
      if (m.y < -10) Object.assign(m, newEmber(false));
    }
  }
  for (const m of S.embers){
    fctx.fillStyle = `rgba(255,190,110,${m.a*(.6 + .4*Math.sin(t*2 + m.tw))})`;
    fctx.beginPath(); fctx.arc(m.x - px*24, m.y, m.r, 0, Math.PI*2); fctx.fill();
  }
  requestAnimationFrame(frame);
}

addEventListener('pointermove', e => { mouse.tx = (e.clientX/W - .5)*2; mouse.ty = (e.clientY/H - .5)*2; }, {passive:true});
let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { resize(); seedAmbient(); }, 120); });
resize(); seedAmbient(); requestAnimationFrame(frame);
document.fonts && document.fonts.ready.then(() => { resize(); });


/* =========================================================
   CONFIG, ATTRIBUTION, TRACKING
   ========================================================= */
const params = new URLSearchParams(location.search);
const REF_RE = /^K-[A-HJ-NP-Z2-9]{6}$/;
const attribution = {};
['utm_source','utm_medium','utm_campaign','utm_content'].forEach(k => { const v = params.get(k); if (v) attribution[k] = v.slice(0, 80); });
const refParam = (params.get('ref') || '').toUpperCase();
if (REF_RE.test(refParam)) store.set('mythra-ref', refParam);
let CONFIG = { waNumber: null, siteUrl: location.origin, pixelId: null };
fetch('/api/egg/config').then(r => r.ok ? r.json() : null).then(c => { if (c){ CONFIG = c; initPixel(c.pixelId); } }).catch(() => {});

function initPixel(id){
  if (!id || window.fbq) return;
  /* Meta Pixel base code */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', id); fbq('track', 'PageView');
}
function pixel(name, data, custom){ try { if (window.fbq) fbq(custom ? 'trackCustom' : 'track', name, data || {}); } catch(e){} }
function track(event){
  if (event === 'hatch_fire') { pixel('EggHatched', {}, true); return; }
  const k = store.get('mythra-keeper');
  if (!k || !REF_RE.test(k.no)) return;
  const body = JSON.stringify({ no: k.no, event });
  if (navigator.sendBeacon) navigator.sendBeacon('/api/egg/track', new Blob([body], { type:'application/json' }));
  else fetch('/api/egg/track', { method:'POST', headers:{'content-type':'application/json'}, body, keepalive:true }).catch(()=>{});
}
async function post(url, data){
  const r = await fetch(url, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) throw new Error(j.error || 'We couldn’t reach MYTHRA. Check your connection and try again.');
  return j;
}
function toast(msg){
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role','status'); t.textContent = msg;
  document.body.append(t); setTimeout(() => t.remove(), 2600);
}

/* =========================================================
   KEEPER: name → profile → card → share
   ========================================================= */
const sheet = $('#sheet'), nameStep = $('#nameStep'), cardStep = $('#cardStep'), nameErr = $('#nameErr'), makeBtn = $('#makeCard');
let current = store.get('mythra-keeper'); // { no, dragonName, keeperName, element, createdAt, shareUrl, waLink }

function openSheet(){
  sheet.hidden = false;
  if (current && current.no){ showCard(current); }
  else { nameStep.hidden = false; cardStep.hidden = true; setTimeout(() => $('#dragonName').focus(), 60); }
}
document.querySelectorAll('[data-open="keeper"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openSheet(); }));
$('#sheetClose').addEventListener('click', () => sheet.hidden = true);
sheet.addEventListener('click', e => { if (e.target === sheet) sheet.hidden = true; });
addEventListener('keydown', e => { if (e.key === 'Escape') sheet.hidden = true; });

nameStep.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    dragonName: $('#dragonName').value.trim(),
    keeperName: $('#keeperName').value.trim(),
    whatsapp: $('#whatsapp').value.trim(),
    email: $('#email').value.trim(),
    consent: $('#consent').checked,
    website: $('#website').value,
    element: S.el ? S.el.name : undefined,
    ref: store.get('mythra-ref') || undefined,
    ...attribution
  };
  const fail = (m, el) => { nameErr.hidden = false; nameErr.textContent = m; if (el) el.focus(); };
  if (!data.dragonName) return fail('Your dragon needs a name first.', $('#dragonName'));
  if (!data.keeperName) return fail('Tell us your name, Keeper.', $('#keeperName'));
  if ((data.whatsapp || data.email) && !data.consent) return fail('Tick the box so we can send your dragon’s updates.', $('#consent'));
  nameErr.hidden = true; makeBtn.disabled = true; makeBtn.textContent = 'Binding the name…';
  try {
    const res = await post('/api/egg/keeper', data);
    current = { ...res.keeper, shareUrl: res.shareUrl, waLink: res.waLink };
    store.set('mythra-keeper', current);
    pixel('Lead', { content_name: 'keeper', value: 0, currency: 'USD' });
    A.chirp();
    showCard(current);
  } catch (err) {
    fail(err.message);
  } finally {
    makeBtn.disabled = false; makeBtn.textContent = 'Make my Keeper card';
  }
});

const ELEMENT_LABEL = { Ember:'Ember', Tide:'Tide', Storm:'Storm', Jade:'Jade' };
function fmtDate(iso){ try { return new Date(iso).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' }); } catch(e){ return ''; } }
function showCard(k){
  nameStep.hidden = true; cardStep.hidden = false;
  $('#kName').textContent = k.dragonName;
  $('#kKeeper').textContent = k.keeperName;
  $('#kNo').textContent = k.no;
  $('#kEl').textContent = ELEMENT_LABEL[k.element] || k.element || '';
  $('#kDate').textContent = fmtDate(k.createdAt);
  const wa = $('#waKeep');
  const waLink = k.waLink || (CONFIG.waNumber ? `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent('🐉 HATCH ' + k.no)}` : null);
  wa.hidden = $('#waNote').hidden = !waLink;
  if (waLink) wa.href = waLink;
  $('#nativeShare').hidden = !navigator.share;
}
$('#waKeep').addEventListener('click', () => { track('wa_optin_click'); pixel('Contact', { method:'whatsapp' }); });

function shareText(k){ return `I just hatched ${k.dragonName} 🐉 I’m Keeper ${k.no} in the world of The Mother’s Monster. Your egg is waiting:`; }
function shareUrl(k){ return k.shareUrl || `${CONFIG.siteUrl || location.origin}/egg/k/${k.no}`; }
function openOut(url){ const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.append(a); a.click(); a.remove(); }

$('#shareRow').addEventListener('click', async e => {
  const b = e.target.closest('[data-share]'); if (!b || !current) return;
  const k = current, url = shareUrl(k), text = shareText(k);
  const kind = b.dataset.share;
  if (kind === 'whatsapp') openOut(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
  if (kind === 'facebook') openOut(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  if (kind === 'x') openOut(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
  if (kind === 'telegram') openOut(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  if (kind === 'copy'){
    try { await navigator.clipboard.writeText(url); toast('Link copied'); }
    catch(err){ prompt('Copy your link', url); }
  }
  if (kind === 'image'){ await saveCardImage(k); track('card_saved'); return; }
  track(kind === 'copy' ? 'share_copy' : 'share_' + kind);
});

$('#nativeShare').addEventListener('click', async () => {
  if (!current) return;
  const k = current;
  try {
    const blob = await renderCardImage(k);
    const file = new File([blob], `${k.dragonName}-mythra-keeper.png`, { type:'image/png' });
    const data = { title: `${k.dragonName} has hatched`, text: shareText(k), url: shareUrl(k) };
    if (navigator.canShare && navigator.canShare({ files:[file] })) data.files = [file];
    await navigator.share(data);
    track('share_native');
  } catch(err) { /* the person closed the share sheet */ }
});

/* the shareable card image: 1080 × 1350, made in the browser */
let dragonBitmap = null;
function loadImage(src){ return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
async function renderCardImage(k){
  if (!dragonBitmap) dragonBitmap = await loadImage('/egg/dragon.webp');
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
  const g = c.getContext('2d');
  let gr = g.createRadialGradient(560, 640, 40, 540, 640, 900);
  gr.addColorStop(0, '#4a2c14'); gr.addColorStop(.45, '#14110f'); gr.addColorStop(1, '#050607');
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1350);
  g.strokeStyle = 'rgba(201,161,91,.7)'; g.lineWidth = 2; g.strokeRect(36, 36, 1008, 1278);
  const serif = '"EB Garamond", Georgia, serif', sans = 'Figtree, "Helvetica Neue", Arial, sans-serif';
  g.textAlign = 'center';
  g.fillStyle = '#c9a15b'; g.font = `500 26px ${sans}`;
  if ('letterSpacing' in g) g.letterSpacing = '8px';
  g.fillText('MYTHRA · KEEPER CARD', 540, 120);
  if ('letterSpacing' in g) g.letterSpacing = '0px';
  const dw = 860, dh = dw * dragonBitmap.height / dragonBitmap.width;
  g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 50; g.shadowOffsetY = 30;
  g.drawImage(dragonBitmap, 540 - dw/2, 170, dw, dh); g.restore();
  g.fillStyle = '#efe6d6'; g.font = `500 112px ${serif}`;
  g.fillText(k.dragonName, 540, 170 + dh + 120);
  g.fillStyle = '#a9a194'; g.font = `400 34px ${sans}`;
  g.fillText(`Keeper ${k.keeperName} · ${k.no}`, 540, 170 + dh + 180);
  g.fillStyle = '#f2c57c'; g.font = `500 34px ${sans}`;
  g.fillText('Hatch yours free · mythrafilm.com/egg', 540, 1250);
  return new Promise(res => c.toBlob(res, 'image/png'));
}
async function saveCardImage(k){
  try {
    const blob = await renderCardImage(k);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${k.dragonName}-mythra-keeper.png`;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast('Card saved. Post it to your story.');
  } catch(e){ toast('Couldn’t make the image. Try again.'); }
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
let cohortSeen = false;
if ('IntersectionObserver' in window){
  new IntersectionObserver((es, o) => { if (es.some(x => x.isIntersecting) && !cohortSeen){ cohortSeen = true; track('cohort_view'); pixel('ViewContent', { content_name:'cohort' }); o.disconnect(); } }, { threshold:.2 }).observe($('#cohort section:nth-child(2)'));
}
$('#appForm').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#appErr'), ok = $('#appOk'), btn = $('#appBtn');
  const data = {
    name: $('#aName').value.trim(), email: $('#aEmail').value.trim(), whatsapp: $('#aWa').value.trim(),
    link: $('#aLink').value.trim(), niche: $('#aNiche').value, tier: $('#aTier').value, goal: $('#aGoal').value.trim(),
    consent: $('#aConsent').checked, website: $('#aWebsite').value, keeperNo: current && current.no
  };
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){ err.hidden = false; err.textContent = 'Add your name and a valid email so we can reply.'; return; }
  if (!data.consent){ err.hidden = false; err.textContent = 'Tick the box so we can contact you about your application.'; return; }
  err.hidden = true; btn.disabled = true; btn.textContent = 'Sending…';
  try {
    await post('/api/egg/apply', data);
    pixel('SubmitApplication', { content_name: data.tier });
    ok.hidden = false; ok.textContent = `Thanks, ${data.name.split(' ')[0]}. Your ${data.tier} application is in. The MYTHRA team will reply by email${data.whatsapp ? ' or WhatsApp' : ''}.`;
    btn.hidden = true;
  } catch(ex){
    err.hidden = false; err.textContent = ex.message;
  } finally { btn.disabled = false; btn.textContent = 'Send application'; }
});

// A returning Keeper skips straight to their card when they open the Keeper door.
if (current && current.no) {
  const keep = document.querySelector('.card.fans .go');
  if (keep) keep.firstChild.textContent = 'See my Keeper card ';
}
})();
