// bonsai.js — Bonsai Garden feature logic

// ─── Storage ──────────────────────────────────────────────────────────────────

function _bonsaiLoad() {
  try {
    return JSON.parse(localStorage.getItem('triad:bonsai') || 'null') ||
      { unlocked: false, active: null, album: [], seeds: ['standard'], pots: ['standard'] };
  } catch(e) {
    return { unlocked: false, active: null, album: [], seeds: ['standard'], pots: ['standard'] };
  }
}

function _bonsaiSave(data) {
  try { localStorage.setItem('triad:bonsai', JSON.stringify(data)); } catch(e) {}
}

function _todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ─── Unlock (wired from navigation.js on breath completion) ──────────────────

function bonsaiUnlockOnFirstBreath() {
  const data = _bonsaiLoad();
  if (!data.unlocked) {
    data.unlocked = true;
    _bonsaiSave(data);
    _bonsaiShowUnlockToast();
  }
}

function _bonsaiShowUnlockToast() {
  const toast = document.createElement('div');
  toast.className = 'bonsai-toast';
  toast.innerHTML = '🌱 Bonsai Garden unlocked! Visit your Profile to begin.';
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ─── Profile card ─────────────────────────────────────────────────────────────

function bonsaiUpdateProfileCard() {
  const data = _bonsaiLoad();
  const card = document.getElementById('bonsaiProfileCard');
  if (!card) return;
  card.style.display = data.unlocked ? 'block' : 'none';
  const sub = document.getElementById('bonsaiProfileSub');
  if (!sub) return;
  if (data.active) {
    sub.textContent = `Cycle ${data.active.cycle}/10 · ${data.active.watersInCycle}/3 waters`;
  } else if (data.album.length > 0) {
    sub.textContent = `${data.album.length} tree${data.album.length > 1 ? 's' : ''} grown · Plant a new seed`;
  } else {
    sub.textContent = 'Tap to tend your tree';
  }
}

// ─── Open / close overlay ─────────────────────────────────────────────────────

function openBonsaiScreen() {
  stopBonsaiAnimation();
  document.getElementById('bonsaiOverlay').classList.add('active');
  const data = _bonsaiLoad();

  ['bonsaiPlantView', 'bonsaiActiveView', 'bonsaiCompleteView', 'bonsaiAlbumView']
    .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });

  const albumBtn = document.getElementById('bonsaiAlbumBtn');
  if (albumBtn) albumBtn.style.display = data.album.length > 0 ? '' : 'none';

  if (!data.active) {
    _bonsaiShowPlantView();
  } else if (data.active.cycle >= 10) {
    _bonsaiShowCompleteView(data);
  } else {
    _bonsaiShowActiveView(data);
  }
}

function closeBonsaiScreen() {
  stopBonsaiAnimation();
  document.getElementById('bonsaiOverlay').classList.remove('active');
  bonsaiUpdateProfileCard();
}

// ─── Plant view ───────────────────────────────────────────────────────────────

function _bonsaiShowPlantView() {
  const view = document.getElementById('bonsaiPlantView');
  if (!view) return;
  view.style.display = 'flex';

  const nameInput = document.getElementById('bonsaiNameInput');
  if (nameInput) nameInput.value = '';

  requestAnimationFrame(() => {
    const previewEl = document.getElementById('bonsaiPotPreview');
    if (!previewEl) return;
    previewEl.innerHTML = '';
    const c = document.createElement('canvas');
    c.width  = 120;
    c.height = 100;
    previewEl.appendChild(c);
    drawPot(c.getContext('2d'), 60, 78, 'standard');
  });
}

function bonsaiPlant() {
  const data = _bonsaiLoad();
  const nameInput = document.getElementById('bonsaiNameInput');
  const name = (nameInput ? nameInput.value.trim() : '') || 'My Bonsai';
  data.active = {
    id: 'bonsai_' + Date.now(),
    seedType: 'standard',
    potType: 'standard',
    name,
    cycle: 0,
    watersInCycle: 0,
    totalWaters: 0,
    lastWateredDate: null,
    plantedAt: new Date().toISOString(),
    completedAt: null,
  };
  _bonsaiSave(data);

  ['bonsaiPlantView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  _bonsaiShowActiveView(data);
}

// ─── Active view ──────────────────────────────────────────────────────────────

function _bonsaiShowActiveView(data) {
  stopBonsaiAnimation();
  const view = document.getElementById('bonsaiActiveView');
  if (!view) return;
  view.style.display = 'flex';

  const b = data.active;
  const nameEl   = document.getElementById('bonsaiNameDisplay');
  const cycleEl  = document.getElementById('bonsaiCycleDisplay');
  if (nameEl)  nameEl.textContent  = b.name;
  if (cycleEl) cycleEl.textContent = `Cycle ${b.cycle}/10`;

  // Water dots
  const dotsEl = document.getElementById('bonsaiWaterDots');
  if (dotsEl) {
    dotsEl.innerHTML = [0, 1, 2].map(i =>
      `<div class="bonsai-water-dot${i < b.watersInCycle ? ' filled' : ''}"></div>`
    ).join('');
  }

  // Cycle bar
  const fillEl = document.getElementById('bonsaiCycleFill');
  if (fillEl) fillEl.style.width = `${b.cycle * 10}%`;

  // Progress label
  const labelEl = document.getElementById('bonsaiProgressLabel');
  if (labelEl) {
    const watersLeft = 3 - b.watersInCycle;
    const cyclesLeft = 10 - b.cycle;
    labelEl.textContent = b.cycle === 0
      ? `${watersLeft} water${watersLeft !== 1 ? 's' : ''} to first growth`
      : `${watersLeft} water${watersLeft !== 1 ? 's' : ''} · ${cyclesLeft} cycle${cyclesLeft !== 1 ? 's' : ''} to complete`;
  }

  // Water button state
  const today = _todayStr();
  const alreadyWatered = b.lastWateredDate === today;
  const waterBtn = document.getElementById('bonsaiWaterBtn');
  if (waterBtn) {
    waterBtn.disabled     = alreadyWatered;
    waterBtn.style.opacity = alreadyWatered ? '0.45' : '1';
  }
  const statusEl = document.getElementById('bonsaiWaterStatus');
  if (statusEl) {
    statusEl.textContent = alreadyWatered ? 'Watered today ✓ Come back tomorrow' : '';
  }

  // Draw bonsai
  requestAnimationFrame(() => {
    const canvas = document.getElementById('bonsaiCanvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = (canvas.offsetWidth  || 300) * dpr;
    canvas.height = (canvas.offsetHeight || 260) * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawBonsai(canvas, b.cycle, b.watersInCycle, true);
  });
}

// ─── Water ────────────────────────────────────────────────────────────────────

function bonsaiWater() {
  const data = _bonsaiLoad();
  const b = data.active;
  if (!b) return;
  const today = _todayStr();

  if (b.lastWateredDate === today) {
    const statusEl = document.getElementById('bonsaiWaterStatus');
    if (statusEl) statusEl.textContent = 'Already watered today. Come back tomorrow 🌊';
    return;
  }

  b.lastWateredDate = today;
  b.watersInCycle++;
  b.totalWaters++;

  const cycleAdvanced = b.watersInCycle >= 3;
  if (cycleAdvanced) {
    b.cycle++;
    b.watersInCycle = 0;
    if (b.cycle >= 10) {
      b.completedAt = new Date().toISOString();
    }
  }

  _bonsaiSave(data);
  _bonsaiWaterAnimation();

  if (b.cycle >= 10) {
    stopBonsaiAnimation();
    ['bonsaiActiveView'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    _bonsaiShowCompleteView(data);
  } else {
    _bonsaiShowActiveView(data);
    const statusEl = document.getElementById('bonsaiWaterStatus');
    if (statusEl) {
      statusEl.textContent = cycleAdvanced
        ? `✨ Your bonsai grew! Cycle ${b.cycle}/10`
        : `Watered! ${3 - b.watersInCycle} more until next growth.`;
    }
  }
}

function _bonsaiWaterAnimation() {
  const btn = document.getElementById('bonsaiWaterBtn');
  if (!btn) return;
  btn.classList.add('watering');
  setTimeout(() => btn.classList.remove('watering'), 600);
}

// ─── Complete view ────────────────────────────────────────────────────────────

function _bonsaiShowCompleteView(data) {
  const view = document.getElementById('bonsaiCompleteView');
  if (!view) return;
  view.style.display = 'flex';

  const b = data.active;
  const nameEl = document.getElementById('bonsaiCompleteName');
  if (nameEl) nameEl.textContent = b.name;

  requestAnimationFrame(() => {
    const canvas = document.getElementById('bonsaiCompleteCanvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = (canvas.offsetWidth  || 280) * dpr;
    canvas.height = (canvas.offsetHeight || 280) * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawBonsai(canvas, 10, 3, true);
  });
}

function bonsaiSaveToAlbum() {
  stopBonsaiAnimation();
  const data = _bonsaiLoad();
  const b = data.active;
  if (!b || b.cycle < 10) return;

  const canvas = document.getElementById('bonsaiCompleteCanvas');
  const imageData = canvas ? canvas.toDataURL('image/png') : '';

  data.album.push({
    id: b.id,
    name: b.name,
    completedAt: b.completedAt,
    imageData,
  });
  data.active = null;
  _bonsaiSave(data);

  const completeView = document.getElementById('bonsaiCompleteView');
  if (completeView) completeView.style.display = 'none';

  _bonsaiShowToast('🌳 Saved to your Garden Album!');

  const albumBtn = document.getElementById('bonsaiAlbumBtn');
  if (albumBtn) albumBtn.style.display = '';

  _bonsaiShowPlantView();
}

function bonsaiStartNew() {
  const data = _bonsaiLoad();
  data.active = null;
  _bonsaiSave(data);
  stopBonsaiAnimation();

  ['bonsaiActiveView', 'bonsaiCompleteView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  _bonsaiShowPlantView();
}

// ─── Album ────────────────────────────────────────────────────────────────────

function openBonsaiAlbum() {
  stopBonsaiAnimation();
  ['bonsaiPlantView', 'bonsaiActiveView', 'bonsaiCompleteView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const albumView = document.getElementById('bonsaiAlbumView');
  if (!albumView) return;
  albumView.style.display = 'flex';

  const data = _bonsaiLoad();
  const grid = document.getElementById('bonsaiAlbumGrid');
  if (!grid) return;

  if (data.album.length === 0) {
    grid.innerHTML = '<p class="bonsai-album-empty">No completed bonsai yet.<br>Keep watering! 🌱</p>';
    return;
  }

  grid.innerHTML = data.album.map(item => {
    const dateStr = item.completedAt
      ? new Date(item.completedAt).toLocaleDateString()
      : '';
    const img = item.imageData
      ? `<img src="${item.imageData}" alt="${_escapeAttr(item.name)}" class="bonsai-album-img">`
      : `<div class="bonsai-album-img bonsai-album-img--placeholder">🌳</div>`;
    return `
      <div class="bonsai-album-item">
        ${img}
        <div class="bonsai-album-item-name">${_escapeHtml(item.name)}</div>
        <div class="bonsai-album-item-date">${dateStr}</div>
      </div>`;
  }).join('');
}

function closeBonsaiAlbum() {
  const albumView = document.getElementById('bonsaiAlbumView');
  if (albumView) albumView.style.display = 'none';
  openBonsaiScreen();
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function _bonsaiShowToast(msg) {
  const t = document.createElement('div');
  t.className   = 'bonsai-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 50);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

// ─── Dev / test helpers ───────────────────────────────────────────────────────

function bonsaiDevWater() {
  const data = _bonsaiLoad();
  const b = data.active;
  if (!b) return;

  b.watersInCycle++;
  b.totalWaters++;
  b.lastWateredDate = _todayStr();

  if (b.watersInCycle >= 3) {
    b.cycle++;
    b.watersInCycle = 0;
    if (b.cycle >= 10) {
      b.completedAt = new Date().toISOString();
    }
  }

  _bonsaiSave(data);

  if (b.cycle >= 10) {
    stopBonsaiAnimation();
    const activeView = document.getElementById('bonsaiActiveView');
    if (activeView) activeView.style.display = 'none';
    _bonsaiShowCompleteView(data);
  } else {
    _bonsaiShowActiveView(data);
    const statusEl = document.getElementById('bonsaiWaterStatus');
    if (statusEl) statusEl.textContent = `[DEV] Cycle ${b.cycle}/10 · Water ${b.watersInCycle}/3`;
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function _escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str ?? ''));
  return d.innerHTML;
}

function _escapeAttr(str) {
  return String(str ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
