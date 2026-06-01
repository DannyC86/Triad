/* ═══════════════════════════════════════════════════════
   bonsai-draw.js — Mosaic/impasto painterly bonsai
   ═══════════════════════════════════════════════════════ */

// Seeded random for consistent look per bonsai
function _seededRand(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Draw a single mosaic block — slightly rotated rectangle with painterly edge
function _mosaicBlock(ctx, x, y, w, h, colour, rotation, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha || 0.92;
  ctx.translate(x, y);
  ctx.rotate(rotation || 0);
  ctx.fillStyle = colour;
  // Slightly irregular shape — offset corners for painterly feel
  ctx.beginPath();
  ctx.moveTo(-w/2 + 1, -h/2);
  ctx.lineTo(w/2, -h/2 + 1);
  ctx.lineTo(w/2 - 1, h/2);
  ctx.lineTo(-w/2, h/2 - 1);
  ctx.closePath();
  ctx.fill();
  // Subtle highlight edge
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.restore();
}

// Draw a cluster of mosaic blocks forming a shape
function _mosaicCluster(ctx, cx, cy, radius, colours, density, rand) {
  const count = Math.floor(density * radius * 0.8);
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = rand() * radius;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist * 0.75;
    const w = 8 + rand() * 14;
    const h = 6 + rand() * 10;
    const rot = (rand() - 0.5) * 0.6;
    const col = colours[Math.floor(rand() * colours.length)];
    _mosaicBlock(ctx, x, y, w, h, col, rot, 0.85 + rand() * 0.15);
  }
}

// Trunk segment as mosaic blocks
function _mosaicTrunk(ctx, points, width, rand) {
  const trunkColours = [
    '#8B8FA8', '#7A7E96', '#9B9FB8', '#6B7080',
    '#A8ACBF', '#5C6070', '#B0B4C8'
  ];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    const steps = Math.ceil(len / 6);
    const segWidth = width * (1 - i / (points.length * 1.2));
    for (let j = 0; j < steps; j++) {
      const t = j / steps;
      const x = p1.x + dx * t + (rand() - 0.5) * segWidth * 0.4;
      const y = p1.y + dy * t + (rand() - 0.5) * 4;
      const w = segWidth * (0.7 + rand() * 0.6);
      const h = 5 + rand() * 8;
      const rot = Math.atan2(dy, dx) + (rand() - 0.5) * 0.4;
      const col = trunkColours[Math.floor(rand() * trunkColours.length)];
      _mosaicBlock(ctx, x, y, w, h, col, rot, 0.88 + rand() * 0.12);
    }
  }
}

// THE MAIN DRAW FUNCTION
function drawBonsai(canvas, cycle, watersInCycle, animated) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = canvas.offsetWidth || 300;
  const H = canvas.offsetHeight || 280;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const rand = _seededRand(canvas.id ? canvas.id.charCodeAt(0) * 137 : 42);

  // ── BACKGROUND ──
  // Soft warm gradient like the reference
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#F2C4B8');   // soft pink top
  bg.addColorStop(0.45, '#F5DDD8');
  bg.addColorStop(0.6, '#F0EBE0'); // cream bottom
  bg.addColorStop(1, '#E8E2D8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ground shadow line
  const groundY = H * 0.88;
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, groundY + 12);
  groundGrad.addColorStop(0, 'rgba(180,160,140,0.4)');
  groundGrad.addColorStop(1, 'rgba(180,160,140,0)');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, W, 12);

  if (cycle === 0) {
    // ── CYCLE 0: Just the pot with soil ──
    _drawPotMosaic(ctx, W/2, groundY, W, rand);
    _drawSoil(ctx, W/2, groundY - 18, rand);
    return;
  }

  // ── POT (always drawn) ──
  _drawPotMosaic(ctx, W/2, groundY, W, rand);

  // Trunk base x
  const trunkBaseX = W / 2 - W * 0.04;
  const trunkBaseY = groundY - 18;

  // ── GROWTH STAGES ──

  // Trunk height grows with cycle
  const maxTrunkH = H * 0.62;
  const trunkHeight = maxTrunkH * Math.min(1, cycle / 8);

  // S-curve trunk control points (matching reference image)
  const trunkPoints = [];
  const segments = 12;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // S-curve: start center, curve right, then left, then right at top
    const sway = Math.sin(t * Math.PI * 1.8) * W * 0.12
                 + Math.sin(t * Math.PI * 0.9 + 1) * W * 0.08;
    trunkPoints.push({
      x: trunkBaseX + sway,
      y: trunkBaseY - trunkHeight * t
    });
  }

  // Trunk width tapers
  const trunkWidth = (16 + W * 0.04) * Math.min(1, cycle / 5);

  if (cycle >= 1) {
    _mosaicTrunk(ctx, trunkPoints, trunkWidth, rand);
  }

  // ── FOLIAGE COLOURS ──
  const foliageColours = [
    '#6B8F71', '#5C7A62', '#7FA882', '#4A6B52', // sage greens
    '#8FB89A', '#3D5C44', '#9BC4A0',             // lighter greens
    '#7A9E8A', '#527A5C',                         // teal greens
    '#C4784A', '#D4895A', '#B86840',             // orange accents
    '#8FA878', '#6B8C7A'                         // olive
  ];

  const orangeColours = ['#C4784A','#D4895A','#B86840','#E09060','#C86030'];
  const topGreenColours = ['#6B8F71','#5C7A62','#7FA882','#8FB89A','#4A6B52','#9BC4A0'];
  const tealColours = ['#7A9E8A','#527A5C','#6B8C7A','#8FB0A0'];

  // ── FOLIAGE CLUSTERS — grow with cycle ──
  const topX = trunkPoints[trunkPoints.length - 1].x;
  const topY = trunkPoints[trunkPoints.length - 1].y;

  if (cycle >= 2) {
    // Main top canopy — grows from small to large
    const canopySize = 20 + (cycle - 2) * 9;
    const canopyDensity = 1.5 + (cycle - 2) * 0.4;

    // Top right cluster (largest in reference)
    _mosaicCluster(ctx, topX + W*0.06, topY - canopySize*0.3,
      canopySize, topGreenColours, canopyDensity, rand);

    if (cycle >= 4) {
      // Top left cluster
      _mosaicCluster(ctx, topX - W*0.1, topY - canopySize*0.1,
        canopySize * 0.8, tealColours, canopyDensity * 0.9, rand);
    }

    if (cycle >= 6) {
      // Upper right secondary
      _mosaicCluster(ctx, topX + W*0.15, topY + canopySize*0.2,
        canopySize * 0.7, topGreenColours, canopyDensity * 0.8, rand);
    }
  }

  // Mid trunk branch clusters (left side orange — matches reference)
  if (cycle >= 3) {
    const midIdx = Math.floor(trunkPoints.length * 0.45);
    const midPt = trunkPoints[midIdx];
    const leftBranchSize = 14 + (cycle - 3) * 7;

    // Orange left cluster (distinctive feature from reference)
    _mosaicCluster(ctx, midPt.x - W*0.14, midPt.y + 8,
      leftBranchSize, orangeColours, 1.2 + (cycle-3)*0.3, rand);

    if (cycle >= 5) {
      // Green above the orange
      _mosaicCluster(ctx, midPt.x - W*0.1, midPt.y - leftBranchSize*0.5,
        leftBranchSize * 0.7, tealColours, 1.0, rand);
    }
  }

  // Lower branch clusters (cycle 5+)
  if (cycle >= 5) {
    const lowIdx = Math.floor(trunkPoints.length * 0.3);
    const lowPt = trunkPoints[lowIdx];
    const lowSize = 12 + (cycle - 5) * 8;

    // Right side lower orange/warm cluster
    _mosaicCluster(ctx, lowPt.x + W*0.1, lowPt.y + 4,
      lowSize, orangeColours, 1.0 + (cycle-5)*0.3, rand);
  }

  // Full canopy at cycle 8+ — additional density
  if (cycle >= 8) {
    // Extra top density
    _mosaicCluster(ctx, topX, topY - 30, 35, topGreenColours, 2.5, rand);
    // Fill gaps
    _mosaicCluster(ctx, topX - W*0.05, topY - 15, 25, tealColours, 1.8, rand);
  }

  // Cycle 10: COMPLETE — add blossom accent blocks
  if (cycle >= 10) {
    const blossomColours = ['#FFB7C5','#FFCCD5','#FF9BAD','#FFA8B8'];
    const topPt = trunkPoints[trunkPoints.length - 1];
    // Scatter a few pink blossom blocks at top
    for (let b = 0; b < 12; b++) {
      const bx = topPt.x + (rand()-0.5) * 60;
      const by = topPt.y - rand() * 40;
      _mosaicBlock(ctx, bx, by, 8+rand()*8, 6+rand()*6,
        blossomColours[Math.floor(rand()*blossomColours.length)],
        (rand()-0.5)*0.8, 0.9);
    }
  }

  // Waters-in-cycle adds a few extra blocks as subtle feedback
  if (watersInCycle > 0 && cycle < 10) {
    const topPt = trunkPoints[trunkPoints.length - 1];
    for (let w = 0; w < watersInCycle * 3; w++) {
      const wx = topPt.x + (rand()-0.5) * 30;
      const wy = topPt.y - rand() * 20;
      _mosaicBlock(ctx, wx, wy, 6+rand()*8, 5+rand()*6,
        topGreenColours[Math.floor(rand()*topGreenColours.length)],
        (rand()-0.5)*0.5, 0.7);
    }
  }
}

// ── POT ──
function _drawPotMosaic(ctx, cx, groundY, W, rand) {
  const potW = W * 0.32;
  const potH = W * 0.09;
  const potY = groundY - potH * 0.5;

  // Pot colours — red/terracotta mosaic matching reference
  const potColours = ['#C0392B','#E74C3C','#A93226','#D44233','#8B1A1A'];
  const rimColours = ['#C84B3A','#D45548','#B03428'];

  // Pot body — mosaic blocks
  const cols = Math.ceil(potW / 10);
  const rows = Math.ceil(potH / 8);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bx = cx - potW/2 + c * (potW/cols) + (rand()-0.5)*3;
      const by = potY + r * (potH/rows) + (rand()-0.5)*2;
      const bw = potW/cols * (0.85 + rand()*0.3);
      const bh = potH/rows * (0.85 + rand()*0.3);
      const col = potColours[Math.floor(rand()*potColours.length)];
      _mosaicBlock(ctx, bx + bw/2, by + bh/2, bw, bh, col,
        (rand()-0.5)*0.15, 0.92);
    }
  }

  // Pot rim — slightly lighter strip at top
  for (let c = 0; c < cols + 2; c++) {
    const bx = cx - potW/2 - 4 + c * ((potW+8)/(cols+1));
    const col = rimColours[Math.floor(rand()*rimColours.length)];
    _mosaicBlock(ctx, bx, potY - 2, (potW+8)/(cols+1)*0.9, 5, col,
      (rand()-0.5)*0.1, 0.95);
  }
}

// ── SOIL ──
function _drawSoil(ctx, cx, y, rand) {
  const soilColours = ['#6B4423','#7A5030','#5C3818','#8B5E3C'];
  for (let i = 0; i < 8; i++) {
    const sx = cx + (rand()-0.5)*30;
    const sy = y + (rand()-0.5)*6;
    _mosaicBlock(ctx, sx, sy, 10+rand()*12, 5+rand()*5,
      soilColours[Math.floor(rand()*soilColours.length)],
      (rand()-0.5)*0.3, 0.8);
  }
}

// ── POT PREVIEW (plant screen) ──
function drawPot(ctx, cx, cy, type) {
  const rand = _seededRand(99);
  const W = ctx.canvas.width;
  _drawPotMosaic(ctx, cx, cy + 20, W, rand);
}
