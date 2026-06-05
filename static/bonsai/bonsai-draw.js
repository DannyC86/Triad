/* ═══════════════════════════════════════════════════════
   bonsai-draw.js — Image stages 1-8, SVG-style 9-10, canvas 11-29
   ═══════════════════════════════════════════════════════ */

function _seededRand(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── MAIN DRAW FUNCTION ──
function drawBonsai(canvas, cycle, watersInCycle, animated) {
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 300;
  const H = canvas.offsetHeight || 300;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, W, H);

  if (cycle >= 1 && cycle <= 11) {
    _drawBonsaiImage(canvas, ctx, cycle, W, H);
  } else if (cycle === 0) {
    _drawEmptyPot(ctx, W, H);
  } else {
    _drawBonsaiCanvas(ctx, cycle, watersInCycle, W, H, animated);
  }
}

// ── IMAGE RENDERER (cycles 1-8) ──
function _drawBonsaiImage(canvas, ctx, cycle, W, H) {
  const img = new Image();
  img.onload = function() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#F5F0E8';
    ctx.fillRect(0, 0, W, H);
    const scale = Math.min(W / img.width, H / img.height) * 0.92;
    const iw = img.width * scale;
    const ih = img.height * scale;
    const ix = (W - iw) / 2;
    const iy = (H - ih) / 2;
    ctx.drawImage(img, ix, iy, iw, ih);
  };
  img.onerror = function() {
    _drawBonsaiCanvas(ctx, cycle, 0, W, H, false);
  };
  img.src = `/static/bonsai/images/stage-${cycle}.png`;
}

// ── EMPTY POT (cycle 0) ──
function _drawEmptyPot(ctx, W, H) {
  const cx = W / 2;
  const potY = H * 0.72;
  const potW = W * 0.7;
  const potH = H * 0.22;

  // Wooden stand
  ctx.fillStyle = '#C47D3A';
  ctx.beginPath();
  ctx.ellipse(cx, potY + potH * 0.6, potW * 0.45, potH * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pot body
  ctx.fillStyle = '#C8C4BE';
  ctx.beginPath();
  ctx.ellipse(cx, potY, potW * 0.5, potH * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Soil
  ctx.fillStyle = '#3D2B1A';
  ctx.beginPath();
  ctx.ellipse(cx, potY - potH * 0.05, potW * 0.44, potH * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ── CANVAS DRAWING (cycles 11-29) — extends the organic style of 9-10 ──
function _drawBonsaiCanvas(ctx, cycle, watersInCycle, W, H, animated) {
  const cx = W / 2;
  const potY = H * 0.78;
  const potW = W * 0.72;
  const potH = H * 0.2;

  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, W, H);

  // Wooden stand
  ctx.fillStyle = '#C47D3A';
  _roundRect(ctx, cx - potW*0.38, potY + potH*0.52, potW*0.76, potH*0.28, 6);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const lx = cx - potW*0.28 + i * potW*0.185;
    ctx.fillStyle = '#A86830';
    ctx.fillRect(lx, potY + potH*0.72, 8, potH*0.22);
  }

  // Pot shadow
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.ellipse(cx, potY + potH*0.55, potW*0.42, potH*0.12, 0, 0, Math.PI*2);
  ctx.fill();

  // Pot body
  const potGrad = ctx.createLinearGradient(cx - potW/2, potY, cx + potW/2, potY);
  potGrad.addColorStop(0, '#D8D4CE');
  potGrad.addColorStop(0.4, '#E8E4DE');
  potGrad.addColorStop(1, '#C0BCB6');
  ctx.fillStyle = potGrad;
  ctx.beginPath();
  ctx.ellipse(cx, potY, potW*0.48, potH*0.48, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, potY - potH*0.1, potW*0.46, potH*0.32, 0, Math.PI*1.1, Math.PI*1.9);
  ctx.stroke();

  // Soil
  ctx.fillStyle = '#3D2B1A';
  ctx.beginPath();
  ctx.ellipse(cx, potY - potH*0.04, potW*0.42, potH*0.32, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#6B4423';
  for (let p = 0; p < 20; p++) {
    const px = cx + (Math.sin(p*137.5)*potW*0.35);
    const py = potY - potH*0.04 + (Math.cos(p*137.5)*potH*0.22);
    ctx.beginPath();
    ctx.arc(px, py, 2 + Math.sin(p)*1.5, 0, Math.PI*2);
    ctx.fill();
  }

  // Scale parameters
  const progress = Math.min(1, (cycle - 10) / 19);
  const trunkWidth = 18 + (cycle - 10) * 0.5;
  const canopySpread = 1 + progress * 0.5;
  const topHeight = 0.22 - progress * 0.08; // canopy rises slightly as tree matures

  const trunkBase = { x: cx - W*0.02, y: potY - potH*0.35 };
  const trunkTop  = { x: cx + W*0.05, y: H * Math.max(0.14, topHeight) };

  // Trunk
  const trunkGrad = ctx.createLinearGradient(trunkBase.x, trunkBase.y, trunkTop.x, trunkTop.y);
  trunkGrad.addColorStop(0,   '#8B6914');
  trunkGrad.addColorStop(0.4, '#7A6020');
  trunkGrad.addColorStop(0.7, '#6B7838');
  trunkGrad.addColorStop(1,   '#5A6830');
  ctx.strokeStyle = trunkGrad;
  ctx.lineWidth = trunkWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(trunkBase.x, trunkBase.y);
  ctx.bezierCurveTo(
    trunkBase.x - W*0.08, trunkBase.y - H*0.12,
    trunkBase.x + W*0.12, trunkBase.y - H*0.24,
    trunkTop.x, trunkTop.y
  );
  ctx.stroke();

  // Trunk texture
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  const textureLines = 5 + Math.floor(progress * 5);
  for (let t = 0; t < textureLines; t++) {
    const tt = 0.1 + t * (0.8 / textureLines);
    const tx = trunkBase.x + (trunkTop.x - trunkBase.x) * tt + (t%2===0?3:-3);
    const ty = trunkBase.y + (trunkTop.y - trunkBase.y) * tt;
    ctx.beginPath();
    ctx.moveTo(tx - 5, ty - 10);
    ctx.lineTo(tx + 5, ty + 10);
    ctx.stroke();
  }

  // Exposed roots — more prominent as tree matures
  const rootCount = 4 + Math.floor(progress * 4);
  ctx.lineWidth = 3 + progress * 2;
  for (let r = 0; r < rootCount; r++) {
    ctx.strokeStyle = r % 2 === 0 ? '#8B6914' : '#7A5C10';
    const rx = trunkBase.x + (r - rootCount/2 + 0.5) * 10;
    ctx.beginPath();
    ctx.moveTo(rx, trunkBase.y + 4);
    ctx.quadraticCurveTo(rx + (r - rootCount/2)*8, trunkBase.y + 22, rx + (r - rootCount/2)*22, trunkBase.y + 40);
    ctx.stroke();
  }

  // Branches — more branches as cycle increases
  const baseBranches = [
    { sx: 0.25, ex: -0.22, ey: -0.08, w: 6 },
    { sx: 0.40, ex:  0.20, ey: -0.10, w: 6 },
    { sx: 0.60, ex: -0.15, ey: -0.06, w: 5 },
    { sx: 0.75, ex:  0.18, ey: -0.07, w: 4 },
  ];
  const extraBranches = [
    { sx: 0.15, ex: -0.16, ey: -0.05, w: 4 },
    { sx: 0.50, ex:  0.24, ey: -0.12, w: 5 },
    { sx: 0.70, ex: -0.20, ey: -0.09, w: 4 },
    { sx: 0.85, ex:  0.14, ey: -0.06, w: 3 },
  ];
  const branchCount = 4 + Math.floor(progress * 4);
  const allBranches = [...baseBranches, ...extraBranches].slice(0, branchCount);

  allBranches.forEach(b => {
    const bx = trunkBase.x + (trunkTop.x - trunkBase.x) * b.sx;
    const by = trunkBase.y + (trunkTop.y - trunkBase.y) * b.sx;
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = b.w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(
      bx + b.ex*W*0.5*canopySpread, by + b.ey*H*0.5,
      bx + b.ex*W*canopySpread,     by + b.ey*H
    );
    ctx.stroke();
  });

  // Foliage — density grows with cycle
  const foliageCount = 9 + Math.floor((cycle - 10) * 1.5);
  const spread = canopySpread;

  // Generate foliage positions using golden angle distribution
  const foliagePositions = [];
  const basePositions = [
    { x: cx + W*0.10, y: H*0.14, r: W*0.20 },
    { x: cx - W*0.14, y: H*0.18, r: W*0.18 },
    { x: cx + W*0.22, y: H*0.22, r: W*0.16 },
    { x: cx - W*0.04, y: H*0.10, r: W*0.17 },
    { x: cx + W*0.04, y: H*0.26, r: W*0.15 },
    { x: cx - W*0.20, y: H*0.26, r: W*0.14 },
    { x: cx + W*0.18, y: H*0.32, r: W*0.13 },
    { x: cx - W*0.10, y: H*0.32, r: W*0.12 },
    { x: cx + W*0.06, y: H*0.20, r: W*0.14 },
  ];

  for (let i = 0; i < foliageCount; i++) {
    if (i < basePositions.length) {
      // Scale base positions outward as tree grows
      const bp = basePositions[i];
      const dx = bp.x - cx;
      const dy = bp.y - H*0.5;
      foliagePositions.push({
        x: cx + dx * spread,
        y: H*0.5 + dy * spread,
        r: bp.r * (1 + progress * 0.4),
      });
    } else {
      // Extra clusters fill in gaps using golden angle
      const angle = i * 2.399963; // golden angle
      const dist = W * 0.12 * Math.sqrt(i - basePositions.length + 1);
      foliagePositions.push({
        x: cx + Math.cos(angle) * dist * spread,
        y: H*0.2 + Math.sin(angle) * dist * 0.6,
        r: W * (0.10 + progress * 0.03),
      });
    }
  }

  const greens = ['#5A8A3C','#6B9E4A','#4A7830','#7AB050','#3D6B28'];
  foliagePositions.forEach((fp) => {
    for (let l = 0; l < 5; l++) {
      const angle = (l / 5) * Math.PI * 2;
      const lx = fp.x + Math.cos(angle) * fp.r * 0.3;
      const ly = fp.y + Math.sin(angle) * fp.r * 0.21;
      const leafGrad = ctx.createRadialGradient(lx-2, ly-2, 0, lx, ly, fp.r*0.7);
      leafGrad.addColorStop(0, greens[l % greens.length]);
      leafGrad.addColorStop(1, '#2D5018');
      ctx.fillStyle = leafGrad;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(lx, ly, fp.r * (0.6 + l*0.08), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  });

  // Near-mature trees (cycle 20+) get a few blossom accents
  if (cycle >= 20) {
    const blossomAlpha = Math.min(1, (cycle - 20) / 9);
    const rand = _seededRand(cycle * 31 + 7);
    const blossomColours = ['#FFB7C5','#FFCCD5','#FF9BAD','#FFA8B8'];
    for (let b = 0; b < Math.floor(blossomAlpha * 18); b++) {
      const bx = foliagePositions[b % foliagePositions.length].x + (rand()-0.5)*40;
      const by = foliagePositions[b % foliagePositions.length].y - rand()*20;
      ctx.globalAlpha = 0.75 + rand()*0.25;
      ctx.fillStyle = blossomColours[Math.floor(rand()*blossomColours.length)];
      ctx.beginPath();
      ctx.arc(bx, by, 3 + rand()*4, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}

// ── ROUNDED RECT HELPER ──
function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

// ── POT PREVIEW (plant screen) ──
function drawPot(ctx, cx, cy, type) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  _drawEmptyPot(ctx, W, H);
}
