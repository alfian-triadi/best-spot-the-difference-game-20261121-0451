// Every tuning number, colour and level definition in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to
// the window, so no rule below depends on the screen size.
export const FIELD = { width: 1280, height: 720 };

// The two picture panels, in logical coordinates.
export const PANEL = { width: 606, height: 620, y: 80 };
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 654;
export const HEADER_H = 64;

export const STEP = 1 / 60;

/** Points for one found difference, and the cost of a hint. */
export const SCORE = { find: 100, hintCost: 25, wrongSeconds: 5, timeBonusPerSecond: 2 };

/** Hints available per level. */
export const HINTS_PER_LEVEL = 3;

/** How long a hint ring pulses around an unfound difference, in seconds. */
export const HINT_SECONDS = 2.5;

/** How long a wrong-click cross stays on screen, in seconds. */
export const WRONG_SECONDS = 0.7;

/** How long a found marker pops in, in seconds. */
export const POP_SECONDS = 0.35;

/** The three scenes, easiest first. time is the level's countdown in seconds. */
export const LEVELS = [
  { id: 'garden', name: 'Sunny Garden', sub: 'A quiet morning in the garden', time: 150, diffs: 7 },
  { id: 'harbor', name: 'Harbor at Dusk', sub: 'Lanterns over a sleepy harbor', time: 180, diffs: 8 },
  { id: 'kitchen', name: 'Cozy Kitchen', sub: 'Tea is on, the cat is asleep', time: 210, diffs: 9 },
];

export const PALETTE = {
  backdrop: '#141821',
  header: '#1d2330',
  headerLine: '#2c3547',
  panelEdge: '#3a4356',
  panelEdgeFound: '#3fae6a',
  text: '#f2f4f8',
  muted: '#9aa3b5',
  accent: '#ffd166',
  accentDark: '#e8a93d',
  good: '#4ade80',
  bad: '#f87171',
  timerLow: '#f87171',
  button: '#2a3346',
  buttonHover: '#37415a',
  overlay: 'rgba(10, 13, 20, 0.72)',
  cursor: '#ffffff',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'twin-peeks.best';
