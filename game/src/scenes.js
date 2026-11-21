// The three scenes. Each scene paints its base picture into a 606x620 local
// space, then, on the right panel only, applies its differences: draw(ctx,
// altered) receives the set of difference ids to apply, so a difference is
// drawn as part of the picture itself, never painted over afterwards.
// Every difference also carries its centre and radius for hit testing.
import { circle, cloud, ellipse, poly, rr, star, tulip, butterfly } from './helpers.js';

function skyGradient(ctx, stops, h = 380) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 606, h);
}

/* ------------------------------------------------------------------ */
/* Scene 1: Sunny Garden                                              */
/* ------------------------------------------------------------------ */
function drawGarden(ctx, altered) {
  skyGradient(ctx, [[0, '#8ed0f2'], [1, '#dff3fb']]);
  // Sun with rays (5 on the altered panel, 8 on the original).
  const rays = altered.has('sun-rays') ? 5 : 8;
  ctx.strokeStyle = '#f7b731';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < rays; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(88 + Math.cos(a) * 44, 78 + Math.sin(a) * 44);
    ctx.lineTo(88 + Math.cos(a) * 58, 78 + Math.sin(a) * 58);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffd93b';
  circle(ctx, 88, 78, 34);
  ctx.fill();
  ctx.fillStyle = '#f7b731';
  circle(ctx, 78, 72, 4);
  ctx.fill();
  circle(ctx, 98, 86, 4);
  ctx.fill();
  // Clouds (the middle one is missing on the altered panel).
  cloud(ctx, 300, 64, 1, '#ffffff');
  if (!altered.has('cloud-missing')) cloud(ctx, 470, 112, 0.8, '#ffffff');
  cloud(ctx, 180, 150, 0.7, '#f4f9ff');
  // Rolling hills.
  ctx.fillStyle = '#7ec850';
  ellipse(ctx, 120, 420, 260, 90);
  ctx.fill();
  ctx.fillStyle = '#6ab844';
  ellipse(ctx, 500, 430, 280, 100);
  ctx.fill();
  // Ground.
  ctx.fillStyle = '#5da53f';
  ctx.fillRect(0, 380, 606, 240);
  ctx.fillStyle = '#54a038';
  for (let x = 10; x < 606; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, 620);
    ctx.lineTo(x + 8, 596);
    ctx.lineTo(x + 16, 620);
    ctx.fill();
  }
  // Tree with three apples (one missing on the altered panel).
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(92, 300, 22, 130);
  ctx.fillStyle = '#3f9142';
  circle(ctx, 103, 250, 62);
  ctx.fill();
  circle(ctx, 62, 285, 40);
  ctx.fill();
  circle(ctx, 148, 288, 42);
  ctx.fill();
  ctx.fillStyle = '#e63946';
  circle(ctx, 70, 252, 8);
  ctx.fill();
  if (!altered.has('apple-missing')) {
    circle(ctx, 122, 236, 8);
    ctx.fill();
  }
  circle(ctx, 142, 286, 8);
  ctx.fill();
  // House.
  ctx.fillStyle = '#f6e7c8';
  ctx.fillRect(380, 260, 180, 160);
  ctx.fillStyle = '#c65b4e';
  poly(ctx, [[366, 262], [470, 190], [574, 262]]);
  ctx.fill();
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(452, 340, 36, 80);
  ctx.fillStyle = '#ffd166';
  circle(ctx, 484, 380, 4);
  ctx.fill();
  // Windows: the right one is dark on the altered panel.
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(396, 292, 34, 34);
  ctx.fillStyle = altered.has('window-dark') ? '#3a4356' : '#ffd166';
  ctx.fillRect(508, 292, 34, 34);
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 3;
  ctx.strokeRect(396, 292, 34, 34);
  ctx.strokeRect(508, 292, 34, 34);
  ctx.beginPath();
  ctx.moveTo(413, 292);
  ctx.lineTo(413, 326);
  ctx.moveTo(396, 309);
  ctx.lineTo(430, 309);
  ctx.moveTo(525, 292);
  ctx.lineTo(525, 326);
  ctx.moveTo(508, 309);
  ctx.lineTo(542, 309);
  ctx.stroke();
  // Chimney and smoke (no smoke on the altered panel).
  ctx.fillStyle = '#9c6b4f';
  ctx.fillRect(520, 196, 26, 56);
  if (!altered.has('smoke-missing')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, 538, 182, 10);
    ctx.fill();
    circle(ctx, 548, 164, 13);
    ctx.fill();
    circle(ctx, 534, 146, 9);
    ctx.fill();
  }
  // Fence.
  ctx.fillStyle = '#d9b380';
  ctx.fillRect(0, 440, 606, 10);
  ctx.fillRect(0, 472, 606, 10);
  for (let x = 30; x < 606; x += 52) ctx.fillRect(x, 428, 12, 66);
  // Path from the door.
  ctx.fillStyle = '#e8d5a8';
  poly(ctx, [[452, 420], [488, 420], [520, 620], [420, 620]]);
  ctx.fill();
  // Flower bed (one tulip changes colour on the altered panel).
  const tulipColors = ['#e63946', '#f2c14e', '#ef476f', '#e63946', '#f2c14e', '#ef476f', '#e63946', '#f2c14e', '#ef476f'];
  for (let i = 0; i < 9; i += 1) {
    const x = 52 + i * 58;
    let color = tulipColors[i];
    if (i === 3 && altered.has('flower-color')) color = '#9b5de5';
    tulip(ctx, x, 566, color);
  }
  // Butterflies (a second one appears on the altered panel).
  butterfly(ctx, 330, 300, 1, '#ff8c42', 0.7);
  if (altered.has('extra-butterfly')) butterfly(ctx, 430, 320, 0.9, '#7fb3ff', 0.3);
}

const GARDEN_DIFFS = [
  { id: 'sun-rays', x: 88, y: 78, r: 34, label: 'Sun rays' },
  { id: 'cloud-missing', x: 470, y: 112, r: 30, label: 'Missing cloud' },
  { id: 'flower-color', x: 284, y: 534, r: 24, label: 'Tulip colour' },
  { id: 'extra-butterfly', x: 430, y: 320, r: 26, label: 'Extra butterfly' },
  { id: 'window-dark', x: 525, y: 309, r: 26, label: 'Dark window' },
  { id: 'smoke-missing', x: 540, y: 164, r: 26, label: 'Missing smoke' },
  { id: 'apple-missing', x: 122, y: 236, r: 22, label: 'Missing apple' },
];

/* ------------------------------------------------------------------ */
/* Scene 2: Harbor at Dusk                                            */
/* ------------------------------------------------------------------ */
const HARBOR_STARS = [
  [40, 40], [150, 60], [230, 36], [330, 70], [420, 44], [560, 52],
  [90, 130], [200, 160], [380, 130], [470, 170], [540, 120], [30, 200],
  [280, 200], [580, 200],
];

function drawHarbor(ctx, altered) {
  skyGradient(ctx, [[0, '#2b2350'], [0.6, '#7a4a7d'], [1, '#e8825a']]);
  // Stars (one missing on the altered panel).
  ctx.fillStyle = '#ffffff';
  for (const [x, y] of HARBOR_STARS) {
    if (altered.has('star-missing') && x === 150 && y === 60) continue;
    star(ctx, x, y, 5, 2);
    ctx.fill();
  }
  // Moon (an extra crater on the altered panel).
  ctx.fillStyle = '#f5edd6';
  circle(ctx, 500, 80, 30);
  ctx.fill();
  ctx.fillStyle = '#d8cdb2';
  circle(ctx, 490, 72, 6);
  ctx.fill();
  circle(ctx, 510, 92, 4);
  ctx.fill();
  if (altered.has('moon-crater')) {
    circle(ctx, 506, 66, 5);
    ctx.fill();
  }
  // Sea.
  const sea = ctx.createLinearGradient(0, 360, 0, 620);
  sea.addColorStop(0, '#2c5a80');
  sea.addColorStop(1, '#16324f');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 360, 606, 260);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (const [y, x0, w] of [[400, 60, 120], [440, 300, 160], [480, 120, 100], [540, 380, 180], [580, 80, 140]]) {
    ctx.beginPath();
    ctx.arc(x0, y, w / 2, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Gulls (one missing on the altered panel).
  ctx.strokeStyle = '#2b2350';
  ctx.lineWidth = 2.5;
  const gulls = [[200, 120], [260, 90], [350, 140]];
  for (const [x, y] of gulls) {
    if (altered.has('gull-missing') && x === 260) continue;
    ctx.beginPath();
    ctx.arc(x - 8, y, 8, Math.PI * 1.2, Math.PI * 1.9);
    ctx.arc(x + 8, y, 8, Math.PI * 1.1, Math.PI * 1.8);
    ctx.stroke();
  }
  // Lighthouse with a beam and a flag.
  ctx.fillStyle = '#e8e0d0';
  ctx.fillRect(62, 190, 56, 230);
  ctx.fillStyle = '#c65b4e';
  ctx.fillRect(62, 230, 56, 34);
  ctx.fillRect(62, 310, 56, 34);
  ctx.fillRect(62, 390, 56, 30);
  ctx.fillStyle = '#2b2b33';
  ctx.fillRect(56, 168, 68, 26);
  ctx.fillStyle = altered.has('light-window') ? '#ffd166' : '#3a4356';
  ctx.fillRect(76, 174, 28, 14);
  // Beam.
  ctx.fillStyle = 'rgba(255, 209, 102, 0.20)';
  poly(ctx, [[124, 176], [124, 192], [420, 260], [420, 120]]);
  ctx.fill();
  // Flag (points the other way on the altered panel).
  ctx.strokeStyle = '#2b2b33';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 168);
  ctx.lineTo(90, 138);
  ctx.stroke();
  ctx.fillStyle = '#e63946';
  if (altered.has('flag-flip')) poly(ctx, [[90, 138], [62, 146], [90, 154]]);
  else poly(ctx, [[90, 138], [118, 146], [90, 154]]);
  ctx.fill();
  // Sailboat A (its sail stripe changes colour on the altered panel).
  ctx.fillStyle = '#5a3a21';
  poly(ctx, [[272, 478], [348, 478], [336, 494], [284, 494]]);
  ctx.fill();
  ctx.strokeStyle = '#2b2b33';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(310, 478);
  ctx.lineTo(310, 410);
  ctx.stroke();
  ctx.fillStyle = '#f5f0e6';
  poly(ctx, [[310, 412], [310, 474], [344, 474]]);
  ctx.fill();
  ctx.fillStyle = altered.has('sail-stripe') ? '#3a86ff' : '#e63946';
  poly(ctx, [[310, 430], [310, 448], [330, 448]]);
  ctx.fill();
  // Sailboat B, smaller and further away.
  ctx.fillStyle = '#4a3220';
  poly(ctx, [[430, 520], [486, 520], [478, 532], [438, 532]]);
  ctx.fill();
  ctx.strokeStyle = '#2b2b33';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(458, 520);
  ctx.lineTo(458, 468);
  ctx.stroke();
  ctx.fillStyle = '#f5f0e6';
  poly(ctx, [[458, 470], [458, 518], [482, 518]]);
  ctx.fill();
  // Buoy (green instead of red on the altered panel).
  ctx.fillStyle = altered.has('buoy-color') ? '#2f9e44' : '#e63946';
  circle(ctx, 180, 540, 14);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(166, 534, 28, 6);
  ctx.fillStyle = '#2b2b33';
  ctx.beginPath();
  ctx.moveTo(180, 526);
  ctx.lineTo(180, 516);
  ctx.stroke();
  // Dock with crates (a third crate appears on the altered panel).
  ctx.fillStyle = '#6b4a2b';
  ctx.fillRect(380, 540, 226, 80);
  ctx.fillStyle = '#7d5a35';
  for (let y = 556; y < 620; y += 16) ctx.fillRect(380, y, 226, 3);
  ctx.fillStyle = '#b98a4e';
  ctx.fillRect(420, 496, 44, 44);
  ctx.fill();
  ctx.strokeStyle = '#6b4a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(420, 496, 44, 44);
  ctx.beginPath();
  ctx.moveTo(420, 496);
  ctx.lineTo(464, 540);
  ctx.moveTo(464, 496);
  ctx.lineTo(420, 540);
  ctx.stroke();
  ctx.fillStyle = '#b98a4e';
  ctx.fillRect(468, 508, 32, 32);
  ctx.fill();
  ctx.strokeRect(468, 508, 32, 32);
  if (altered.has('crate-extra')) {
    ctx.fillStyle = '#b98a4e';
    ctx.fillRect(512, 500, 40, 40);
    ctx.fill();
    ctx.strokeRect(512, 500, 40, 40);
    ctx.beginPath();
    ctx.moveTo(512, 500);
    ctx.lineTo(552, 540);
    ctx.moveTo(552, 500);
    ctx.lineTo(512, 540);
    ctx.stroke();
  }
}

const HARBOR_DIFFS = [
  { id: 'moon-crater', x: 500, y: 80, r: 32, label: 'Moon crater' },
  { id: 'star-missing', x: 150, y: 60, r: 22, label: 'Missing star' },
  { id: 'sail-stripe', x: 320, y: 439, r: 26, label: 'Sail stripe' },
  { id: 'gull-missing', x: 260, y: 90, r: 24, label: 'Missing gull' },
  { id: 'crate-extra', x: 532, y: 520, r: 28, label: 'Extra crate' },
  { id: 'light-window', x: 90, y: 181, r: 22, label: 'Lighthouse lamp' },
  { id: 'buoy-color', x: 180, y: 540, r: 24, label: 'Buoy colour' },
  { id: 'flag-flip', x: 90, y: 146, r: 24, label: 'Flag direction' },
];

/* ------------------------------------------------------------------ */
/* Scene 3: Cozy Kitchen                                              */
/* ------------------------------------------------------------------ */
function drawKitchen(ctx, altered) {
  // Wall and wainscot.
  ctx.fillStyle = '#f3e2c7';
  ctx.fillRect(0, 0, 606, 620);
  ctx.fillStyle = '#c98f5f';
  ctx.fillRect(0, 480, 606, 140);
  ctx.fillStyle = '#b57e50';
  for (let x = 0; x < 606; x += 76) ctx.fillRect(x, 480, 4, 140);
  ctx.fillStyle = '#a86f45';
  ctx.fillRect(0, 474, 606, 8);
  // Window with night sky, moon and curtains.
  ctx.fillStyle = '#2b3a5e';
  ctx.fillRect(60, 80, 160, 200);
  ctx.fillStyle = '#f5edd6';
  circle(ctx, 180, 120, 18);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  star(ctx, 96, 110, 5, 2);
  ctx.fill();
  star(ctx, 130, 170, 4, 2);
  ctx.fill();
  star(ctx, 200, 200, 5, 2);
  ctx.fill();
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(56, 76, 168, 10);
  ctx.fillRect(56, 276, 168, 10);
  ctx.fillRect(56, 76, 10, 210);
  ctx.fillRect(214, 76, 10, 210);
  ctx.fillRect(136, 86, 6, 194);
  ctx.fillRect(66, 176, 148, 6);
  // Curtains: the right one hangs untied on the altered panel.
  ctx.fillStyle = '#c65b4e';
  poly(ctx, [[40, 70], [78, 70], [70, 290], [40, 290]]);
  ctx.fill();
  if (altered.has('curtain-tie')) {
    poly(ctx, [[238, 70], [200, 70], [208, 290], [238, 290]]);
    ctx.fill();
  } else {
    poly(ctx, [[238, 70], [200, 70], [196, 190], [210, 210], [224, 190], [238, 290]]);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(200, 186, 26, 8);
  }
  // Framed picture (a sailboat instead of mountains on the altered panel).
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(420, 90, 120, 120);
  ctx.fillStyle = '#bfe3f2';
  ctx.fillRect(430, 100, 100, 100);
  if (altered.has('picture-change')) {
    ctx.fillStyle = '#2c5a80';
    ctx.fillRect(430, 160, 100, 40);
    ctx.fillStyle = '#5a3a21';
    poly(ctx, [[462, 168], [498, 168], [492, 176], [468, 176]]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    poly(ctx, [[480, 168], [480, 132], [498, 168]]);
    ctx.fill();
  } else {
    ctx.fillStyle = '#7ec850';
    poly(ctx, [[430, 200], [470, 130], [510, 200]]);
    ctx.fill();
    ctx.fillStyle = '#5da53f';
    poly(ctx, [[470, 200], [505, 140], [530, 200]]);
    ctx.fill();
    ctx.fillStyle = '#ffd93b';
    circle(ctx, 505, 120, 10);
    ctx.fill();
  }
  // Wall clock (its hands point elsewhere on the altered panel).
  ctx.fillStyle = '#ffffff';
  circle(ctx, 330, 140, 34);
  ctx.fill();
  ctx.strokeStyle = '#2b2b33';
  ctx.lineWidth = 3;
  circle(ctx, 330, 140, 34);
  ctx.stroke();
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(330 + Math.cos(a) * 28, 140 + Math.sin(a) * 28);
    ctx.lineTo(330 + Math.cos(a) * 31, 140 + Math.sin(a) * 31);
    ctx.stroke();
  }
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(330, 140);
  if (altered.has('clock-hands')) {
    ctx.lineTo(330 + 16, 140 + 12);
    ctx.moveTo(330, 140);
    ctx.lineTo(330 - 6, 140 + 20);
  } else {
    ctx.lineTo(330 + 18, 140);
    ctx.moveTo(330, 140);
    ctx.lineTo(330, 140 - 22);
  }
  ctx.stroke();
  // Hanging plant on a shelf (an extra leaf on the altered panel).
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(496, 330, 70, 10);
  ctx.fillStyle = '#c65b4e';
  rr(ctx, 512, 296, 38, 34, 6);
  ctx.fill();
  ctx.fillStyle = '#3f9142';
  ellipse(ctx, 524, 288, 7, 16);
  ctx.fill();
  ellipse(ctx, 540, 292, 6, 12);
  ctx.fill();
  ellipse(ctx, 512, 290, 6, 12);
  ctx.fill();
  if (altered.has('plant-leaf')) {
    ellipse(ctx, 552, 282, 6, 13);
    ctx.fill();
  }
  // Table: a broad top with legs, and everything served sits on it.
  ctx.fillStyle = '#a86f45';
  rr(ctx, 40, 520, 526, 24, 8);
  ctx.fill();
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(70, 544, 18, 76);
  ctx.fillRect(518, 544, 18, 76);
  // Rug under the table (its middle stripe changes on the altered panel).
  ctx.fillStyle = '#e8a93d';
  rr(ctx, 150, 576, 310, 40, 10);
  ctx.fill();
  ctx.fillStyle = altered.has('rug-stripe') ? '#3a86ff' : '#c65b4e';
  ctx.fillRect(150, 590, 310, 10);
  ctx.fillStyle = '#f3e2c7';
  ctx.fillRect(150, 576, 310, 4);
  ctx.fillRect(150, 612, 310, 4);
  // Teapot with steam (no steam on the altered panel).
  ctx.fillStyle = '#4a7fb5';
  ellipse(ctx, 300, 492, 42, 30);
  ctx.fill();
  ctx.fillRect(292, 456, 16, 14);
  poly(ctx, [[340, 476], [366, 468], [360, 486], [340, 492]]);
  ctx.fill();
  ctx.strokeStyle = '#4a7fb5';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(258, 488, 14, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  if (!altered.has('steam-missing')) {
    ctx.strokeStyle = 'rgba(180, 190, 200, 0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(292, 452);
    ctx.quadraticCurveTo(284, 432, 292, 416);
    ctx.moveTo(306, 452);
    ctx.quadraticCurveTo(314, 430, 306, 412);
    ctx.stroke();
  }
  // Cups (the left one is green instead of blue on the altered panel).
  for (const [x, color] of [[200, '#4a7fb5'], [390, '#e63946']]) {
    const c = x === 200 && altered.has('cup-color') ? '#2f9e44' : color;
    ctx.fillStyle = c;
    rr(ctx, x - 22, 490, 44, 30, 6);
    ctx.fill();
    ctx.strokeStyle = c;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x + 26, 504, 9, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = '#f3e2c7';
    ellipse(ctx, x, 490, 20, 4);
    ctx.fill();
  }
  // Fruit bowl (one orange missing on the altered panel).
  ctx.fillStyle = '#8a5a2b';
  ellipse(ctx, 480, 514, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#e63946';
  circle(ctx, 458, 504, 11);
  ctx.fill();
  circle(ctx, 482, 500, 11);
  ctx.fill();
  ctx.fillStyle = '#f28c28';
  circle(ctx, 502, 506, 11);
  ctx.fill();
  if (!altered.has('fruit-count')) {
    circle(ctx, 470, 510, 10);
    ctx.fill();
  }
  // Cat asleep on a chair (its tail curls the other way on the altered panel).
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(540, 500, 10, 120);
  ctx.fillRect(500, 500, 10, 120);
  ctx.fillStyle = '#e8a93d';
  ellipse(ctx, 522, 512, 46, 18);
  ctx.fill();
  ctx.fillStyle = '#f2c14e';
  ellipse(ctx, 522, 500, 34, 14);
  ctx.fill();
  ctx.fillStyle = '#e8a93d';
  circle(ctx, 492, 496, 12);
  ctx.fill();
  poly(ctx, [[484, 490], [482, 478], [490, 486]]);
  ctx.fill();
  poly(ctx, [[496, 488], [500, 478], [502, 488]]);
  ctx.fill();
  ctx.strokeStyle = '#e8a93d';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (altered.has('cat-tail')) {
    ctx.moveTo(556, 512);
    ctx.quadraticCurveTo(572, 500, 566, 484);
  } else {
    ctx.moveTo(488, 514);
    ctx.quadraticCurveTo(472, 504, 478, 488);
  }
  ctx.stroke();
}

const KITCHEN_DIFFS = [
  { id: 'clock-hands', x: 330, y: 140, r: 34, label: 'Clock hands' },
  { id: 'steam-missing', x: 300, y: 430, r: 26, label: 'Missing steam' },
  { id: 'fruit-count', x: 470, y: 508, r: 26, label: 'Missing orange' },
  { id: 'picture-change', x: 480, y: 150, r: 34, label: 'Framed picture' },
  { id: 'cat-tail', x: 522, y: 500, r: 30, label: 'Cat tail' },
  { id: 'curtain-tie', x: 212, y: 190, r: 26, label: 'Curtain tie' },
  { id: 'cup-color', x: 200, y: 505, r: 26, label: 'Cup colour' },
  { id: 'plant-leaf', x: 531, y: 288, r: 24, label: 'Extra leaf' },
  { id: 'rug-stripe', x: 305, y: 595, r: 24, label: 'Rug stripe' },
];

/* ------------------------------------------------------------------ */
export const SCENES = [
  { id: 'garden', name: 'Sunny Garden', sub: 'A quiet morning in the garden', time: 150, diffs: GARDEN_DIFFS, draw: drawGarden },
  { id: 'harbor', name: 'Harbor at Dusk', sub: 'Lanterns over a sleepy harbor', time: 180, diffs: HARBOR_DIFFS, draw: drawHarbor },
  { id: 'kitchen', name: 'Cozy Kitchen', sub: 'Tea is on, the cat is asleep', time: 210, diffs: KITCHEN_DIFFS, draw: drawKitchen },
];

/** The ids of every difference in a scene, as a Set. */
export function allDiffIds(scene) {
  return new Set(scene.diffs.map((d) => d.id));
}
