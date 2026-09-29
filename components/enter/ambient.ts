// Tiny synthesized ambience for /enter — no audio files to download.
// Off by default; only started from an explicit user gesture.

export interface Ambient {
  setNear(near: number): void;
  pulse(): void;
  stop(): void;
}

export function startAmbient(): Ambient | null {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
  master.connect(ctx.destination);

  // Air moving through stone: filtered brown noise.
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.05;
  noise.connect(filter).connect(noiseGain).connect(master);
  noise.start();

  // A low presence that swells as you come closer.
  const hum = ctx.createOscillator();
  hum.type = 'sine';
  hum.frequency.value = 55;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.0;
  hum.connect(humGain).connect(master);
  hum.start();

  return {
    setNear(near) {
      const t = ctx.currentTime;
      filter.frequency.setTargetAtTime(300 + near * 520, t, 0.4);
      humGain.gain.setTargetAtTime(near * 0.035, t, 0.5);
    },
    pulse() {
      const t = ctx.currentTime;
      [196, 293.66].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(i === 0 ? 0.06 : 0.025, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 3.3);
      });
    },
    stop() {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setTargetAtTime(0, t, 0.3);
      setTimeout(() => ctx.close(), 1200);
    },
  };
}
