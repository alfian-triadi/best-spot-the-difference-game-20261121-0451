// Twin Peeks — a spot-the-difference hunt in three hand-drawn scenes.
// Boots the canvas, runs the fixed-step loop, and wires input to the world.
// With ?shot=<name> in the URL it draws one frozen screenshot scene instead
// of starting the loop (see shots.js).
import { createWorld, tick } from './world.js';
import { bindInput } from './input.js';
import { draw } from './render.js';
import { stageShot } from './shots.js';
import { soundTick } from './sound.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

const world = createWorld();
bindInput(canvas, world);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot !== null) {
  // Screenshot mode: one deterministic frame, no loop, no animation.
  stageShot(shot, world, ctx);
} else {
  let last = performance.now();
  let lastWholeSecond = Math.ceil(world.timeLeft);
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    tick(world, dt);
    if (world.phase === 'play') {
      const whole = Math.ceil(world.timeLeft);
      if (whole !== lastWholeSecond) {
        lastWholeSecond = whole;
        if (whole <= 10 && whole > 0) soundTick(world.muted);
      }
    }
    draw(ctx, world);
    status.textContent = describe(world);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function describe(world) {
  return `Twin Peeks. Found ${world.found.size} differences. ${Math.ceil(world.timeLeft)} seconds left. Score ${world.score}.`;
}
