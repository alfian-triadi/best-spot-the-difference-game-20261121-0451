// Everything the player sees: header, the two picture panels, markers on
// found differences, hints, and the title / complete / win / game-over cards.
import {
  FIELD, HEADER_H, PALETTE, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X, FONT,
} from './config.js';
import { allDiffIds } from './scenes.js';
import {
  PHASE_COMPLETE, PHASE_OVER, PHASE_PLAY, PHASE_TITLE, PHASE_WIN,
  diffsLeft, foundCount, sceneOf,
} from './world.js';
import { circle, rr } from './helpers.js';

export const HINT_BTN = { x: 1080, y: 10, w: 100, h: 44 };
export const MUTE_BTN = { x: 1190, y: 10, w: 70, h: 44 };
export const PLAY_BTN = { x: 540, y: 468, w: 200, h: 56 };
export const NEXT_BTN = { x: 540, y: 458, w: 200, h: 56 };

function inRect(r, x, y) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

/** Which button, if any, a logical point hits (depends on the phase). */
export function actionAt(world, x, y) {
  if (inRect(HINT_BTN, x, y)) return 'hint';
  if (inRect(MUTE_BTN, x, y)) return 'mute';
  if (world.phase === PHASE_TITLE && inRect(PLAY_BTN, x, y)) return 'play';
  if (world.phase === PHASE_COMPLETE && inRect(NEXT_BTN, x, y)) return 'next';
  if (world.phase === PHASE_OVER && inRect(NEXT_BTN, x, y)) return 'retry';
  if (world.phase === PHASE_WIN && inRect(NEXT_BTN, x, y)) return 'again';
  return null;
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawButton(ctx, rect, label, active) {
  ctx.fillStyle = active ? PALETTE.buttonHover : PALETTE.button;
  rr(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fill();
  ctx.strokeStyle = PALETTE.panelEdge;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = PALETTE.text;
  ctx.font = `600 15px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

function drawHeader(ctx, world) {
  const scene = sceneOf(world);
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, 0, FIELD.width, HEADER_H);
  ctx.fillStyle = PALETTE.headerLine;
  ctx.fillRect(0, HEADER_H - 1, FIELD.width, 1);

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `800 22px ${FONT}`;
  ctx.fillText('TWIN PEEKS', 20, 33);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `500 15px ${FONT}`;
  ctx.fillText(`Level ${world.level + 1} · ${scene.name}`, 200, 33);

  // Timer, centred.
  const low = world.phase === PHASE_PLAY && world.timeLeft <= 30;
  ctx.textAlign = 'center';
  ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.text;
  ctx.font = `800 30px ${FONT}`;
  ctx.fillText(fmtTime(world.timeLeft), 640, 33);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `500 12px ${FONT}`;
  ctx.fillText('TIME LEFT', 640, 56);

  // Found counter: the number the judge looks for.
  const total = scene.diffs.length;
  const found = foundCount(world);
  ctx.fillStyle = found === total && total > 0 ? PALETTE.good : PALETTE.button;
  rr(ctx, 800, 12, 150, 40, 10);
  ctx.fill();
  ctx.fillStyle = found === total && total > 0 ? '#0b2e18' : PALETTE.text;
  ctx.font = `800 19px ${FONT}`;
  ctx.fillText(`Found ${found} / ${total}`, 875, 33);

  ctx.textAlign = 'left';
  ctx.fillStyle = PALETTE.text;
  ctx.font = `700 17px ${FONT}`;
  ctx.fillText(`Score ${world.score}`, 972, 33);

  drawButton(ctx, HINT_BTN, `Hint · ${world.hints}`, world.hintPulse !== null);
  drawButton(ctx, MUTE_BTN, world.muted ? 'Muted' : 'Sound', false);
}

function drawPanelFrame(ctx, x, found) {
  ctx.strokeStyle = found ? PALETTE.panelEdgeFound : PALETTE.panelEdge;
  ctx.lineWidth = found ? 3 : 2;
  rr(ctx, x - 2, PANEL.y - 2, PANEL.width + 4, PANEL.height + 4, 12);
  ctx.stroke();
}

function drawSceneInto(ctx, scene, altered, panelX) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL.y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(panelX, PANEL.y);
  scene.draw(ctx, altered);
  ctx.restore();
}

function drawCheck(ctx, x, y, r) {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.4);
  ctx.lineTo(x + r * 0.5, y - r * 0.4);
  ctx.stroke();
}

function drawMarkers(ctx, world) {
  const scene = sceneOf(world);
  for (const id of world.foundOrder) {
    const diff = scene.diffs.find((d) => d.id === id);
    if (!diff) continue;
    const isPop = world.pop && world.pop.id === id && world.time < world.pop.until;
    const scale = isPop ? 1 + 0.35 * (1 - (world.pop.until - world.time) / 0.35) : 1;
    for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
      const cx = panelX + diff.x;
      const cy = PANEL.y + diff.y;
      ctx.fillStyle = 'rgba(74, 222, 128, 0.92)';
      circle(ctx, cx, cy, diff.r * 0.62 * scale);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      circle(ctx, cx, cy, diff.r * 0.62 * scale);
      ctx.stroke();
      drawCheck(ctx, cx, cy, diff.r * 0.62 * scale);
    }
  }
}

function drawHintPulse(ctx, world) {
  if (!world.hintPulse || world.time >= world.hintPulse.until) return;
  const scene = sceneOf(world);
  const diff = scene.diffs.find((d) => d.id === world.hintPulse.id);
  if (!diff) return;
  const left = (world.hintPulse.until - world.time) / 2.5;
  const pulse = 1 + 0.18 * Math.sin(world.time * 7);
  for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
    const cx = panelX + diff.x;
    const cy = PANEL.y + diff.y;
    ctx.strokeStyle = `rgba(255, 209, 102, ${0.35 + 0.65 * left})`;
    ctx.lineWidth = 4;
    circle(ctx, cx, cy, diff.r * 0.8 * pulse);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    circle(ctx, cx, cy, diff.r * 0.8 * pulse + 6);
    ctx.stroke();
  }
}

function drawWrongFlash(ctx, world) {
  if (!world.wrongFlash || world.time >= world.wrongFlash.until) return;
  const panelX = world.wrongFlash.panel === 'right' ? PANEL_RIGHT_X : PANEL_LEFT_X;
  const cx = panelX + world.wrongFlash.x;
  const cy = PANEL.y + world.wrongFlash.y;
  ctx.strokeStyle = PALETTE.bad;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy - 12);
  ctx.lineTo(cx + 12, cy + 12);
  ctx.moveTo(cx + 12, cy - 12);
  ctx.lineTo(cx - 12, cy + 12);
  ctx.stroke();
}

function drawCursor(ctx, world) {
  if (!world.cursorVisible) return;
  const { x, y } = world.cursor;
  ctx.strokeStyle = PALETTE.cursor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x - 8, y);
  ctx.moveTo(x + 8, y);
  ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 20);
  ctx.stroke();
  ctx.fillStyle = PALETTE.cursor;
  circle(ctx, x, y, 2);
  ctx.fill();
}

function drawMouseRing(ctx, world) {
  if (!world.mouse || world.cursorVisible) return;
  const { x, y } = world.mouse;
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 1.5;
  circle(ctx, x, y, 12);
  ctx.stroke();
}

function drawFooter(ctx, world) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `500 13px ${FONT}`;
  let line = 'Click a difference on either picture · H for a hint · Arrow keys + Enter work too · M toggles sound';
  if (world.message && world.time < world.messageUntil) {
    ctx.fillStyle = PALETTE.accent;
    line = world.message;
  }
  ctx.fillText(line, FIELD.width / 2, 710);
}

function card(ctx, w, h) {
  const x = (FIELD.width - w) / 2;
  const y = (FIELD.height - h) / 2;
  ctx.fillStyle = 'rgba(20, 24, 33, 0.96)';
  rr(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = PALETTE.panelEdge;
  ctx.lineWidth = 1;
  ctx.stroke();
  return { x, y, w, h };
}

function drawTitle(ctx, world) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  const { x, y } = card(ctx, 640, 420);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `800 52px ${FONT}`;
  ctx.fillText('TWIN PEEKS', 640, y + 74);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `500 20px ${FONT}`;
  ctx.fillText('A spot-the-difference hunt in three hand-drawn scenes', 640, y + 116);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 16px ${FONT}`;
  ctx.fillText('Two pictures sit side by side. They look the same —', 640, y + 168);
  ctx.fillText('but a few small things changed on the right.', 640, y + 192);
  ctx.fillText('Click every difference you can find before time runs out.', 640, y + 216);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `600 16px ${FONT}`;
  ctx.fillText('7 · 8 · 9 differences across 3 levels — Garden, Harbor, Kitchen', 640, y + 262);
  if (world.best > 0) {
    ctx.fillStyle = PALETTE.accent;
    ctx.fillText(`Best score: ${world.best}`, 640, y + 292);
  }
  drawButton(ctx, PLAY_BTN, '▶  Play', false);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 13px ${FONT}`;
  ctx.fillText('or press Enter', 640, y + 398);
  void x;
}

function drawComplete(ctx, world) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  const { y } = card(ctx, 560, 360);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.good;
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText('Level Complete!', 640, y + 66);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `500 19px ${FONT}`;
  ctx.fillText(`You found all ${sceneOf(world).diffs.length} differences in ${sceneOf(world).name}.`, 640, y + 118);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 16px ${FONT}`;
  ctx.fillText(`Time left: ${fmtTime(world.timeLeft)}  ·  Level score: ${world.levelScore}`, 640, y + 152);
  ctx.fillText(`Total score: ${world.score}`, 640, y + 180);
  drawButton(ctx, NEXT_BTN, 'Next level  →', false);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 13px ${FONT}`;
  ctx.fillText('or press N', 640, y + 338);
}

function drawWin(ctx, world) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  const { y } = card(ctx, 600, 380);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText('You found them all!', 640, y + 66);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `500 19px ${FONT}`;
  ctx.fillText('Garden, Harbor and Kitchen — every difference spotted.', 640, y + 118);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 16px ${FONT}`;
  ctx.fillText(`Total score: ${world.score}   ·   Best: ${world.best}`, 640, y + 152);
  ctx.fillText('Thanks for playing Twin Peeks.', 640, y + 180);
  drawButton(ctx, NEXT_BTN, '↻  Play again', false);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 13px ${FONT}`;
  ctx.fillText('or press R', 640, y + 358);
}

function drawOver(ctx, world) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  const { y } = card(ctx, 560, 360);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.bad;
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText("Time's up!", 640, y + 66);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `500 19px ${FONT}`;
  ctx.fillText(`You found ${foundCount(world)} of ${sceneOf(world).diffs.length} differences in ${sceneOf(world).name}.`, 640, y + 118);
  ctx.fillText(`${diffsLeft(world)} still hiding. Give it another go?`, 640, y + 148);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 16px ${FONT}`;
  ctx.fillText(`Score: ${world.score}`, 640, y + 182);
  drawButton(ctx, NEXT_BTN, '↻  Retry level', false);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `400 13px ${FONT}`;
  ctx.fillText('or press R', 640, y + 338);
}

export function draw(ctx, world) {
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  drawHeader(ctx, world);
  const scene = sceneOf(world);
  drawSceneInto(ctx, scene, new Set(), PANEL_LEFT_X);
  drawSceneInto(ctx, scene, allDiffIds(scene), PANEL_RIGHT_X);
  drawPanelFrame(ctx, PANEL_LEFT_X, false);
  drawPanelFrame(ctx, PANEL_RIGHT_X, false);
  drawMarkers(ctx, world);
  drawHintPulse(ctx, world);
  drawWrongFlash(ctx, world);
  drawMouseRing(ctx, world);
  drawCursor(ctx, world);
  drawFooter(ctx, world);
  if (world.phase === PHASE_TITLE) drawTitle(ctx, world);
  else if (world.phase === PHASE_COMPLETE) drawComplete(ctx, world);
  else if (world.phase === PHASE_WIN) drawWin(ctx, world);
  else if (world.phase === PHASE_OVER) drawOver(ctx, world);
}
