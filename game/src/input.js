// Mouse and keyboard input: maps screen points to logical canvas points,
// routes clicks to buttons or to a difference, and moves the keyboard cursor.
import { FIELD, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';
import {
  PHASE_COMPLETE, PHASE_OVER, PHASE_PLAY, PHASE_TITLE, PHASE_WIN,
  backToTitle, claimAt, nextLevel, startGame, startLevel, useHint,
} from './world.js';
import { actionAt } from './render.js';
import {
  soundFound, soundHint, soundMiss, soundUnlock, soundWin,
} from './sound.js';

function toLogical(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * FIELD.width,
    y: ((clientY - rect.top) / rect.height) * FIELD.height,
  };
}

/** Which panel, if any, a logical point is on, with scene-local coords. */
function panelAt(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL.width) {
    return { side: 'left', x: x - PANEL_LEFT_X, y: y - PANEL.y };
  }
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL.width) {
    return { side: 'right', x: x - PANEL_RIGHT_X, y: y - PANEL.y };
  }
  return null;
}

function doAction(world, action) {
  if (action === 'hint') {
    if (useHint(world)) soundHint(world.muted);
    return true;
  }
  if (action === 'mute') {
    world.muted = !world.muted;
    return true;
  }
  if (action === 'play') {
    soundUnlock();
    startGame(world);
    return true;
  }
  if (action === 'next') {
    nextLevel(world);
    return true;
  }
  if (action === 'retry') {
    startLevel(world, world.level);
    return true;
  }
  if (action === 'again') {
    startGame(world);
    return true;
  }
  return false;
}

function clickAt(world, x, y) {
  const action = actionAt(world, x, y);
  if (action) return doAction(world, action);
  if (world.phase === PHASE_TITLE) {
    soundUnlock();
    startGame(world);
    return;
  }
  if (world.phase !== PHASE_PLAY) return;
  const hit = panelAt(x, y);
  if (!hit) return;
  soundUnlock();
  const before = world.found.size;
  const result = claimAt(world, hit.x, hit.y);
  if (result === 'found') {
    soundFound(world.muted);
    if (world.phase === PHASE_WIN) soundWin(world.muted);
  } else if (result === 'miss') {
    if (world.wrongFlash) world.wrongFlash.panel = hit.side;
    soundMiss(world.muted);
  }
  void before;
}

export function bindInput(canvas, world) {
  canvas.addEventListener('pointerdown', (event) => {
    const p = toLogical(canvas, event.clientX, event.clientY);
    clickAt(world, p.x, p.y);
  });
  canvas.addEventListener('pointermove', (event) => {
    const p = toLogical(canvas, event.clientX, event.clientY);
    world.mouse = p;
  });
  canvas.addEventListener('pointerleave', () => {
    world.mouse = null;
  });
  window.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 24 : 8;
    if (event.key === 'ArrowLeft' || event.key === 'a') {
      world.cursor.x = Math.max(0, world.cursor.x - step);
      world.cursorVisible = true;
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      world.cursor.x = Math.min(FIELD.width, world.cursor.x + step);
      world.cursorVisible = true;
    } else if (event.key === 'ArrowUp' || event.key === 'w') {
      world.cursor.y = Math.max(0, world.cursor.y - step);
      world.cursorVisible = true;
    } else if (event.key === 'ArrowDown' || event.key === 's') {
      world.cursor.y = Math.min(FIELD.height, world.cursor.y + step);
      world.cursorVisible = true;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (world.phase === PHASE_TITLE) {
        soundUnlock();
        startGame(world);
      } else if (world.phase === PHASE_COMPLETE) nextLevel(world);
      else if (world.phase === PHASE_OVER) startLevel(world, world.level);
      else if (world.phase === PHASE_WIN) startGame(world);
      else clickAt(world, world.cursor.x, world.cursor.y);
    } else if (event.key === 'h' || event.key === 'H') {
      if (useHint(world)) soundHint(world.muted);
    } else if (event.key === 'm' || event.key === 'M') {
      world.muted = !world.muted;
    } else if (event.key === 'n' || event.key === 'N') {
      if (world.phase === PHASE_COMPLETE) nextLevel(world);
    } else if (event.key === 'r' || event.key === 'R') {
      if (world.phase === PHASE_OVER || world.phase === PHASE_WIN) startGame(world);
      else if (world.phase === PHASE_PLAY) startLevel(world, world.level);
    } else if (event.key === 'Escape') {
      backToTitle(world);
    }
  });
}
