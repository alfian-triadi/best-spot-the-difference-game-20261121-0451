// Small canvas drawing helpers shared by every scene painter.
export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

export function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
}

/** A five-point star centred at (x, y). */
export function star(ctx, x, y, rOuter, rInner, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** A simple puffy cloud made of overlapping circles. */
export function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, 18 * s);
  ctx.fill();
  circle(ctx, x + 20 * s, y + 4 * s, 14 * s);
  ctx.fill();
  circle(ctx, x - 20 * s, y + 5 * s, 13 * s);
  ctx.fill();
  ctx.fillRect(x - 34 * s, y, 68 * s, 14 * s);
}

/** A tulip: stem, leaves and a cup-shaped head in `color`. */
export function tulip(ctx, x, y, color, headR = 9) {
  ctx.strokeStyle = '#2f7d4f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 26);
  ctx.stroke();
  ctx.fillStyle = '#3a9e63';
  ellipse(ctx, x - 7, y - 12, 7, 3.5);
  ctx.fill();
  ctx.fillStyle = color;
  circle(ctx, x, y - 32, headR);
  ctx.fill();
  ctx.fillRect(x - headR, y - 40, headR * 2, 10);
  poly(ctx, [[x - headR, y - 40], [x - headR + 4, y - 48], [x - headR / 2, y - 40]]);
  ctx.fill();
  poly(ctx, [[x + headR / 2, y - 40], [x + headR - 4, y - 48], [x + headR, y - 40]]);
  ctx.fill();
}

/** A butterfly with two wing pairs, flapping by `flap` (0..1). */
export function butterfly(ctx, x, y, s, color, flap) {
  const spread = 0.5 + 0.5 * flap;
  ctx.fillStyle = color;
  ellipse(ctx, x - 9 * s * spread, y, 9 * s, 6 * s);
  ctx.fill();
  ellipse(ctx, x + 9 * s * spread, y, 9 * s, 6 * s);
  ctx.fill();
  ellipse(ctx, x - 7 * s * spread, y + 7 * s, 6 * s, 4 * s);
  ctx.fill();
  ellipse(ctx, x + 7 * s * spread, y + 7 * s, 6 * s, 4 * s);
  ctx.fill();
  ctx.fillStyle = '#2b2b33';
  ellipse(ctx, x, y + 2, 2.2 * s, 7 * s);
  ctx.fill();
}
