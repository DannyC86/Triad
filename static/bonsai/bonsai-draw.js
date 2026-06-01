// bonsai-draw.js — procedural bonsai drawing (canvas 2D)

let _bonsaiDrawRaf = null;

// Public: stop any running bonsai animation
function stopBonsaiAnimation() {
  if (_bonsaiDrawRaf) { cancelAnimationFrame(_bonsaiDrawRaf); _bonsaiDrawRaf = null; }
}

// Public: draw/animate bonsai on canvas
function drawBonsai(canvas, cycle, watersInCycle, animated) {
  stopBonsaiAnimation();
  if (animated && cycle > 0) {
    let t0 = null;
    function loop(ts) {
      if (!_bonsaiDrawRaf) return;
      if (!t0) t0 = ts;
      _bonsaiRender(canvas, cycle, watersInCycle, ts - t0);
      _bonsaiDrawRaf = requestAnimationFrame(loop);
    }
    _bonsaiDrawRaf = requestAnimationFrame(loop);
  } else {
    _bonsaiRender(canvas, cycle, watersInCycle, 0);
  }
}

// Public: draw just the pot — used for plant-seed preview
function drawPot(ctx, cx, cy, type) {
  _drawPotShape(ctx, cx, cy, cx * 0.62);
}

// ─── Internal render ────────────────────────────────────────────────────────

function _bonsaiRender(canvas, cycle, watersInCycle, elapsed) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.width  / dpr;
  const H   = canvas.height / dpr;
  if (!W || !H) return;

  // Background
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  ctx.fillStyle = isDark
    ? '#111827'
    : (getComputedStyle(document.documentElement).getPropertyValue('--bg-section').trim() || '#F0EBE0');
  ctx.fillRect(0, 0, W, H);

  // Subtle gold vignette
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H / 4, W / 2, H / 2, H / 1.4);
  vignette.addColorStop(0, 'rgba(201,169,110,0)');
  vignette.addColorStop(1, 'rgba(201,169,110,0.08)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  const cx     = W / 2;
  const soilY  = H * 0.74;
  const potHW  = Math.min(W * 0.19, 52);

  _drawPotShape(ctx, cx, H * 0.97, potHW);
  if (cycle === 0) return;

  // Gentle sway via rotate around trunk base
  const sway = Math.sin(elapsed * 0.0005) * 2 * (Math.PI / 180);
  ctx.save();
  ctx.translate(cx, soilY);
  ctx.rotate(sway);
  ctx.translate(-cx, -soilY);

  _drawTree(ctx, cycle, watersInCycle, W, H, cx, soilY, elapsed);

  ctx.restore();
}

// ─── Pot ────────────────────────────────────────────────────────────────────

function _drawPotShape(ctx, cx, bottom, halfW) {
  const potH   = halfW * 1.05;
  const rimH   = halfW * 0.16;
  const baseHW = halfW * 0.66;

  ctx.save();

  // Body fill
  ctx.fillStyle   = '#F0E0C8';
  ctx.strokeStyle = '#B89060';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - halfW,  bottom - potH + rimH);
  ctx.lineTo(cx + halfW,  bottom - potH + rimH);
  ctx.lineTo(cx + baseHW, bottom);
  ctx.lineTo(cx - baseHW, bottom);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Rim
  ctx.fillStyle   = '#E8D0B0';
  ctx.strokeStyle = '#B89060';
  const rimX = cx - halfW - rimH * 0.4;
  const rimW = (halfW + rimH * 0.4) * 2;
  ctx.beginPath();
  ctx.roundRect(rimX, bottom - potH, rimW, rimH, 2);
  ctx.fill();
  ctx.stroke();

  // Soil surface line
  ctx.strokeStyle = 'rgba(100,70,20,0.25)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(cx - halfW + 3, bottom - potH + rimH * 0.55);
  ctx.lineTo(cx + halfW - 3, bottom - potH + rimH * 0.55);
  ctx.stroke();

  ctx.restore();
}

// ─── Tree ───────────────────────────────────────────────────────────────────

function _drawTree(ctx, cycle, watersInCycle, W, H, cx, soilY, elapsed) {
  const maxH   = H * 0.56;
  const frac   = Math.min(cycle, 10) / 10;
  const trunkH = maxH * (0.10 + 0.90 * frac * frac);

  const lean   = W * 0.055;
  const tipX   = cx - W * 0.035;
  const tipY   = soilY - trunkH;
  const cp1x   = cx + lean,        cp1y = soilY - trunkH * 0.33;
  const cp2x   = cx - lean * 0.4,  cp2y = soilY - trunkH * 0.70;

  if (cycle >= 6) _drawRoots(ctx, cx, soilY, W);

  const baseW  = Math.max(3, 2.2 + cycle * 0.88);
  const tipWid = Math.max(1, baseW * 0.15);
  _drawTrunkSegments(ctx, cx, soilY, cp1x, cp1y, cp2x, cp2y, tipX, tipY, baseW, tipWid);

  if (cycle >= 3) {
    const p = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.44);
    _drawBranch(ctx, p[0], p[1], -W * 0.24, -H * 0.12, baseW * 0.40, 'left');
  }
  if (cycle >= 5) {
    const p = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.61);
    _drawBranch(ctx, p[0], p[1],  W * 0.20, -H * 0.10, baseW * 0.30, 'right');
  }
  if (cycle >= 7) {
    const p1 = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.77);
    _drawBranch(ctx, p1[0], p1[1], -W * 0.14, -H * 0.09, baseW * 0.21, 'left');
    const p2 = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.86);
    _drawBranch(ctx, p2[0], p2[1],  W * 0.11, -H * 0.07, baseW * 0.17, 'right');
  }

  if (cycle >= 2) {
    _drawAllLeaves(ctx, cycle, watersInCycle, W, H, cx, soilY,
                   tipX, tipY, cp1x, cp2x, cp1y, cp2y, elapsed);
  }

  if (cycle >= 10) {
    _drawBlossoms(ctx, tipX, tipY, elapsed);
    _drawPetalFall(ctx, W, H, elapsed);
  }
}

function _drawTrunkSegments(ctx, bx, by, c1x, c1y, c2x, c2y, ex, ey, bw, tw) {
  const segs = 18;
  ctx.save();
  ctx.strokeStyle = '#7A5C1E';
  ctx.lineCap     = 'round';
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs, t1 = (i + 1) / segs, tm = (t0 + t1) / 2;
    ctx.lineWidth = bw - (bw - tw) * tm;
    ctx.beginPath();
    ctx.moveTo(_bz(bx, c1x, c2x, ex, t0), _bz(by, c1y, c2y, ey, t0));
    ctx.lineTo(_bz(bx, c1x, c2x, ex, t1), _bz(by, c1y, c2y, ey, t1));
    ctx.stroke();
  }
  ctx.restore();
}

function _drawBranch(ctx, ox, oy, dx, dy, lw, side) {
  const ex  = ox + dx;
  const ey  = oy + dy;
  const cpx = ox + dx * 0.55 + dy * (side === 'left' ? 0.15 : -0.15);
  const cpy = oy + dy * 0.55 - Math.abs(dx) * 0.08;
  ctx.save();
  ctx.strokeStyle = '#7A5C1E';
  ctx.lineWidth   = Math.max(0.8, lw);
  ctx.lineCap     = 'round';
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.quadraticCurveTo(cpx, cpy, ex, ey);
  ctx.stroke();
  ctx.restore();
}

function _drawRoots(ctx, cx, soilY, W) {
  const offsets = [-W * 0.10, -W * 0.06, W * 0.06, W * 0.09, W * 0.04];
  ctx.save();
  ctx.strokeStyle = '#7A5C1E';
  ctx.lineWidth   = 1.1;
  ctx.lineCap     = 'round';
  offsets.forEach(dx => {
    ctx.beginPath();
    ctx.moveTo(cx + dx * 0.25, soilY - 1);
    ctx.quadraticCurveTo(cx + dx * 0.65, soilY + 4, cx + dx, soilY - 3);
    ctx.stroke();
  });
  ctx.restore();
}

// ─── Leaves ─────────────────────────────────────────────────────────────────

function _drawAllLeaves(ctx, cycle, watersInCycle, W, H, cx, soilY,
                        tipX, tipY, cp1x, cp2x, cp1y, cp2y, elapsed) {
  const clusters = [
    { x: tipX,            y: tipY,            s: 1.0 },
    { x: tipX - W * 0.05, y: tipY + H * 0.05, s: 0.65 },
  ];

  if (cycle >= 3) {
    const p = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.44);
    clusters.push({ x: p[0] - W * 0.20, y: p[1] - H * 0.09, s: 0.72 });
  }
  if (cycle >= 5) {
    const p = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.61);
    clusters.push({ x: p[0] + W * 0.18, y: p[1] - H * 0.08, s: 0.62 });
  }
  if (cycle >= 7) {
    const p1 = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.77);
    clusters.push({ x: p1[0] - W * 0.12, y: p1[1] - H * 0.07, s: 0.52 });
    const p2 = _bezPt(cx, cp1x, cp2x, tipX, soilY, cp1y, cp2y, tipY, 0.86);
    clusters.push({ x: p2[0] + W * 0.09, y: p2[1] - H * 0.06, s: 0.48 });
  }

  const density = Math.min(8 + cycle * 5 + watersInCycle, 64);
  const spread  = W * (0.055 + 0.035 * (cycle / 10));
  const col     = cycle <= 4 ? '#7A9E5E' : cycle <= 7 ? '#5C8A3C' : '#3D6B22';

  clusters.forEach((cl, ci) => {
    const n   = Math.max(3, Math.floor(density * cl.s / clusters.length * 1.6));
    const rng = _seedRng(ci * 97 + cycle * 13);
    for (let i = 0; i < n; i++) {
      const ang  = rng() * Math.PI * 2;
      const r    = rng() * spread * cl.s;
      const lx   = cl.x + Math.cos(ang) * r;
      const ly   = cl.y + Math.sin(ang) * r * 0.72;
      const rw   = (3.5 + rng() * 4.5) * (0.55 + cycle * 0.045);
      const rh   = rw * 0.58;
      const rot  = rng() * Math.PI;
      const pulse = elapsed > 0
        ? 0.78 + 0.22 * Math.sin(elapsed * 0.0008 + i * 0.85 + ci * 1.3)
        : 1.0;
      const isGold = cycle >= 8 && rng() < 0.06;

      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle   = isGold ? '#C9A96E' : col;
      ctx.translate(lx, ly);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
}

// ─── Blossoms (cycle 10) ─────────────────────────────────────────────────────

function _drawBlossoms(ctx, tipX, tipY, elapsed) {
  const pts = [
    [tipX,      tipY     ],
    [tipX - 13, tipY +  7],
    [tipX + 11, tipY +  5],
    [tipX -  4, tipY - 10],
    [tipX +  7, tipY -  7],
  ];
  pts.forEach(([bx, by], i) => {
    const pulse = 0.8 + 0.2 * Math.sin(elapsed * 0.0018 + i * 1.2);
    ctx.save();
    ctx.globalAlpha = pulse;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      ctx.fillStyle = '#FFB7C5';
      ctx.beginPath();
      ctx.ellipse(bx + Math.cos(a) * 5, by + Math.sin(a) * 4.5, 4, 2.5, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#C9A96E';
    ctx.beginPath();
    ctx.arc(bx, by, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function _drawPetalFall(ctx, W, H, elapsed) {
  for (let i = 0; i < 8; i++) {
    const rng    = _seedRng(i * 37 + 91);
    const period = 5500 + rng() * 4500;
    const t      = ((elapsed + i * (period / 8)) % period) / period;
    const ox     = W * (0.18 + rng() * 0.64);
    const y      = H * 0.06 + t * H * 0.78;
    const wobble = Math.sin(t * Math.PI * 5 + i * 1.5) * W * 0.038;

    ctx.save();
    ctx.globalAlpha = 0.75 * (1 - t * 0.45);
    ctx.fillStyle   = '#FFB7C5';
    ctx.translate(ox + wobble, y);
    ctx.rotate(t * Math.PI * 3.5 + i);
    ctx.beginPath();
    ctx.ellipse(0, 0, 3.8, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─── Math helpers ────────────────────────────────────────────────────────────

function _bz(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
}

function _bezPt(bx, c1x, c2x, ex, by, c1y, c2y, ey, t) {
  return [_bz(bx, c1x, c2x, ex, t), _bz(by, c1y, c2y, ey, t)];
}

function _seedRng(seed) {
  let s = seed | 0;
  return function() {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}
