// The screenshot scenes behind ?shot=start|play|play2|end. Each one puts the
// world in a fixed state and draws a single frozen frame, so the same URL
// always gives the same picture: what a real game looks like at that moment.
import { stageForShot } from './world.js';
import { draw } from './render.js';

/**
 * Stage the named scene and draw one frame. Returns the scene name used
 * ('start' for anything unknown).
 */
export function stageShot(name, world, ctx) {
  const known = name === 'play' || name === 'play2' || name === 'play3' || name === 'end' ? name : 'start';
  stageForShot(world, known);
  world.time = 0;
  draw(ctx, world);
  return known;
}
