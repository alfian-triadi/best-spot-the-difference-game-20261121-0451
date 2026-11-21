// The game's state: levels, found differences, timer, score, hints and
// phases. Pure logic, no drawing; render.js draws what this holds.
import {
  BEST_KEY, HINTS_PER_LEVEL, HINT_SECONDS, POP_SECONDS, SCORE, WRONG_SECONDS,
} from './config.js';
import { SCENES, allDiffIds } from './scenes.js';

export const PHASE_TITLE = 'title';
export const PHASE_PLAY = 'play';
export const PHASE_COMPLETE = 'complete';
export const PHASE_WIN = 'win';
export const PHASE_OVER = 'over';

export function createWorld() {
  return {
    phase: PHASE_TITLE,
    level: 0,
    found: new Set(),
    foundOrder: [],
    timeLeft: SCENES[0].time,
    score: 0,
    levelScore: 0,
    hints: HINTS_PER_LEVEL,
    muted: false,
    best: Number(localStorage.getItem(BEST_KEY) || 0),
    cursor: { x: 640, y: 400 },
    cursorVisible: false,
    hintPulse: null,
    wrongFlash: null,
    pop: null,
    time: 0,
    message: '',
    messageUntil: 0,
  };
}

export function sceneOf(world) {
  return SCENES[world.level];
}

export function foundCount(world) {
  return world.found.size;
}

export function diffsLeft(world) {
  return sceneOf(world).diffs.length - world.found.size;
}

export function startLevel(world, level) {
  world.level = level;
  world.phase = PHASE_PLAY;
  world.found = new Set();
  world.foundOrder = [];
  world.timeLeft = SCENES[level].time;
  world.levelScore = 0;
  world.hints = HINTS_PER_LEVEL;
  world.hintPulse = null;
  world.wrongFlash = null;
  world.pop = null;
  world.message = '';
}

export function startGame(world) {
  world.score = 0;
  startLevel(world, 0);
}

export function backToTitle(world) {
  world.phase = PHASE_TITLE;
  world.level = 0;
  world.found = new Set();
  world.foundOrder = [];
  world.timeLeft = SCENES[0].time;
  world.hints = HINTS_PER_LEVEL;
  world.hintPulse = null;
  world.wrongFlash = null;
  world.pop = null;
}

/** The difference under a scene-local point, or null. */
export function diffAt(world, x, y) {
  for (const diff of sceneOf(world).diffs) {
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

/**
 * Try to claim the difference under a scene-local point. Returns 'found',
 * 'already' or 'miss'.
 */
export function claimAt(world, x, y) {
  const diff = diffAt(world, x, y);
  if (!diff) {
    world.timeLeft = Math.max(0, world.timeLeft - SCORE.wrongSeconds);
    world.wrongFlash = { x, y, until: world.time + WRONG_SECONDS };
    world.message = `Not there! -${SCORE.wrongSeconds}s`;
    world.messageUntil = world.time + 1.4;
    return 'miss';
  }
  if (world.found.has(diff.id)) return 'already';
  world.found.add(diff.id);
  world.foundOrder.push(diff.id);
  world.score += SCORE.find;
  world.levelScore += SCORE.find;
  world.pop = { id: diff.id, until: world.time + POP_SECONDS };
  if (world.found.size === sceneOf(world).diffs.length) {
    const bonus = Math.round(world.timeLeft) * SCORE.timeBonusPerSecond;
    world.score += bonus;
    world.levelScore += bonus;
    world.phase = world.level === SCENES.length - 1 ? PHASE_WIN : PHASE_COMPLETE;
    if (world.score > world.best) {
      world.best = world.score;
      try {
        localStorage.setItem(BEST_KEY, String(world.best));
      } catch {
        // Private mode or no storage: the best score just does not persist.
      }
    }
  }
  return 'found';
}

/** Spend a hint: pulse a ring around one still-unfound difference. */
export function useHint(world) {
  if (world.phase !== PHASE_PLAY || world.hints <= 0) return null;
  const remaining = sceneOf(world).diffs.filter((d) => !world.found.has(d.id));
  if (remaining.length === 0) return null;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  world.hints -= 1;
  world.score = Math.max(0, world.score - SCORE.hintCost);
  world.levelScore = Math.max(0, world.levelScore - SCORE.hintCost);
  world.hintPulse = { id: diff.id, until: world.time + HINT_SECONDS };
  world.message = `Hint: look near the ${diff.label.toLowerCase()}… -${SCORE.hintCost} pts`;
  world.messageUntil = world.time + 2.2;
  return diff;
}

export function nextLevel(world) {
  if (world.level + 1 < SCENES.length) startLevel(world, world.level + 1);
}

export function tick(world, dt) {
  world.time += dt;
  if (world.phase !== PHASE_PLAY) return;
  world.timeLeft -= dt;
  if (world.timeLeft <= 0) {
    world.timeLeft = 0;
    world.phase = PHASE_OVER;
  }
}

/** For screenshots: put the world in a fixed, deterministic state. */
export function stageForShot(world, name) {
  if (name === 'play') {
    startLevel(world, 0);
    world.timeLeft = 96;
    world.score = 300;
    world.levelScore = 300;
    for (const id of ['sun-rays', 'flower-color', 'apple-missing']) {
      world.found.add(id);
      world.foundOrder.push(id);
    }
  } else if (name === 'play2') {
    startLevel(world, 1);
    world.timeLeft = 141;
    world.score = 740;
    world.levelScore = 200;
    for (const id of ['moon-crater', 'buoy-color']) {
      world.found.add(id);
      world.foundOrder.push(id);
    }
  } else if (name === 'play3') {
    startLevel(world, 2);
    world.timeLeft = 168;
    world.score = 1240;
    world.levelScore = 300;
    for (const id of ['clock-hands', 'cup-color', 'rug-stripe']) {
      world.found.add(id);
      world.foundOrder.push(id);
    }
  } else if (name === 'end') {
    startLevel(world, 0);
    world.timeLeft = 58;
    world.score = 816;
    world.levelScore = 816;
    for (const diff of SCENES[0].diffs) {
      world.found.add(diff.id);
      world.foundOrder.push(diff.id);
    }
    world.phase = PHASE_COMPLETE;
  } else {
    backToTitle(world);
  }
  world.time = 0;
}

export { allDiffIds };
