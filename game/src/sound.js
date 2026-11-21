// Tiny synthesized sounds: no audio files, everything is an oscillator.
// Sounds only start after a user gesture, so headless renders stay silent.
let audio = null;

function context() {
  if (!audio) {
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      audio = new Ctor();
    } catch {
      audio = null;
    }
  }
  return audio;
}

function tone(freq, at, dur, type = 'sine', gain = 0.12) {
  const ctx = context();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0, ctx.currentTime + at);
  amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + at + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + dur);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(ctx.currentTime + at);
  osc.stop(ctx.currentTime + at + dur + 0.05);
}

export function soundUnlock() {
  const ctx = context();
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
}

export function soundFound(muted) {
  if (muted) return;
  tone(660, 0, 0.12);
  tone(880, 0.09, 0.18);
}

export function soundMiss(muted) {
  if (muted) return;
  tone(160, 0, 0.18, 'sawtooth', 0.07);
}

export function soundHint(muted) {
  if (muted) return;
  tone(520, 0, 0.1, 'triangle');
  tone(780, 0.08, 0.14, 'triangle');
}

export function soundWin(muted) {
  if (muted) return;
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22));
}

export function soundTick(muted) {
  if (muted) return;
  tone(980, 0, 0.05, 'square', 0.04);
}
