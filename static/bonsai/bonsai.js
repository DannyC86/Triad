// bonsai.js — Bonsai Garden feature logic

// ─── Storage ──────────────────────────────────────────────────────────────────

function _bonsaiLoad() {
  try {
    return JSON.parse(localStorage.getItem('triad:bonsai') || 'null') || _bonsaiDefaults();
  } catch(e) {
    return _bonsaiDefaults();
  }
}

function _bonsaiDefaults() {
  return {
    unlocked: false,
    hasPot: false,
    hasSeeds: false,
    active: null,
    album: [],
    seeds: [],
    pots: [],
  };
}

function _bonsaiSave(data) {
  try { localStorage.setItem('triad:bonsai', JSON.stringify(data)); } catch(e) {}
}

function _todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ─── Unlock (wired from navigation.js on breath completion) ──────────────────

// ─── Auto-award (called on session completion) ────────────────────────────────

function bonsaiAwardPot() {
  const data = _bonsaiLoad();
  if (data.hasPot) return;
  data.hasPot   = true;
  data.pots     = ['standard'];
  data.unlocked = true;
  _bonsaiSave(data);
  _bonsaiShowToast('🪴 You earned a Bonsai Pot! Visit your garden to begin.');
  bonsaiUpdateProfileCard();
}

function bonsaiAwardSeeds() {
  const data = _bonsaiLoad();
  if (data.hasSeeds) return;
  if (!data.hasPot) return;
  data.hasSeeds = true;
  data.seeds    = ['standard'];
  _bonsaiSave(data);
  _bonsaiShowToast('🌱 You earned Starter Seeds! Time to plant your bonsai.');
  setTimeout(() => _bonsaiPlantingCeremony(), 1500);
  bonsaiUpdateProfileCard();
}

function _bonsaiPlantingCeremony() {
  const screen = document.createElement('div');
  screen.className = 'bonsai-ceremony-screen';
  screen.innerHTML =
    `<div class="bonsai-ceremony-particles" id="ceremonyParticles"></div>` +
    `<div class="bonsai-ceremony-content">` +
      `<div class="bonsai-ceremony-icon">` +
        `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="80" height="80">` +
          `<polygon points="75,100 125,100 100,143.301" fill="rgba(201,169,110,0.15)"/>` +
          `<circle cx="75" cy="100" r="50" fill="none" stroke="#C9A96E" stroke-width="1.5"/>` +
          `<circle cx="125" cy="100" r="50" fill="none" stroke="#C9A96E" stroke-width="1.5"/>` +
          `<circle cx="100" cy="100" r="90" fill="none" stroke="#C9A96E" stroke-width="2"/>` +
          `<polygon points="75,100 125,100 100,143.301" fill="none" stroke="#E4C277" stroke-width="1.5"/>` +
        `</svg>` +
      `</div>` +
      `<h2 class="bonsai-ceremony-title">Your garden awaits</h2>` +
      `<p class="bonsai-ceremony-sub">You have a pot. You have seeds.<br>It's time to begin.</p>` +
      `<button class="bonsai-ceremony-btn" onclick="this.closest('.bonsai-ceremony-screen').remove();openBonsaiScreen();">` +
        `Begin Growing` +
      `</button>` +
      `<button class="bonsai-ceremony-skip" onclick="this.closest('.bonsai-ceremony-screen').remove();">` +
        `Later` +
      `</button>` +
    `</div>`;
  document.body.appendChild(screen);

  // Spawn particles
  const container = screen.querySelector('.bonsai-ceremony-particles');
  const colours   = ['#C9A96E', '#E4C277', '#7A9E5E', '#F4ECDD', '#5C8A3C'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    const size     = 4 + Math.random() * 8;
    const x        = Math.random() * 100;
    const delay    = Math.random() * 1.5;
    const duration = 2 + Math.random() * 2;
    const dx       = (Math.random() - 0.5) * 200;
    const dy       = -(50 + Math.random() * 200);
    p.style.cssText =
      `position:absolute;` +
      `width:${size}px;height:${size}px;` +
      `border-radius:50%;` +
      `background:${colours[Math.floor(Math.random() * colours.length)]};` +
      `left:${x}%;bottom:40%;` +
      `opacity:0;` +
      `animation:ceremonyParticle ${duration}s ${delay}s forwards ease-out;` +
      `--dx:${dx}px;--dy:${dy}px;`;
    container.appendChild(p);
  }

  requestAnimationFrame(() => { screen.style.opacity = '1'; });
}

// ─── Profile card ─────────────────────────────────────────────────────────────

function bonsaiUpdateProfileCard() {
  const data = _bonsaiLoad();
  const card = document.getElementById('bonsaiProfileCard');
  if (card) card.style.display = 'block';
  const homeIcon = document.getElementById('bonsaiHomeIcon');
  if (homeIcon) homeIcon.style.display = 'flex';
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

function stopBonsaiAnimation() {
  if (window._bonsaiRaf) {
    cancelAnimationFrame(window._bonsaiRaf);
    window._bonsaiRaf = null;
  }
}

function openBonsaiScreen() {
  stopBonsaiAnimation();
  document.getElementById('bonsaiOverlay').classList.add('active');
  const data = _bonsaiLoad();

  ['bonsaiPlantView', 'bonsaiActiveView', 'bonsaiCompleteView', 'bonsaiAlbumView']
    .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });

  const albumBtn = document.getElementById('bonsaiAlbumBtn');
  if (albumBtn) albumBtn.style.display = data.album.length > 0 ? '' : 'none';

  if (!data.active) {
    _bonsaiShowPlantView(data);
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

function _bonsaiShowPlantView(data) {
  if (!data) data = _bonsaiLoad();
  const view = document.getElementById('bonsaiPlantView');
  if (!view) return;
  view.style.display = 'flex';

  const nameInput = document.getElementById('bonsaiNameInput');
  if (nameInput) nameInput.value = '';

  // State-aware content
  const titleEl   = view.querySelector('.bonsai-plant-title');
  const subEl     = view.querySelector('.bonsai-plant-sub');
  const btnEl     = view.querySelector('.bonsai-action-btn');
  const nameWrap  = view.querySelector('.bonsai-name-wrap');
  const hasBoth   = data.hasPot && data.hasSeeds;

  if (!data.hasPot) {
    if (titleEl)  titleEl.textContent   = 'Your garden is empty';
    if (subEl)    subEl.textContent     = 'Complete your first breath session to earn a pot, then your first meditation to earn seeds.';
    if (btnEl)    btnEl.style.display   = 'none';
    if (nameWrap) nameWrap.style.display = 'none';
  } else if (!data.hasSeeds) {
    if (titleEl)  titleEl.textContent   = 'You have your pot!';
    if (subEl)    subEl.textContent     = 'Complete your first meditation to earn your starter seeds.';
    if (btnEl)    btnEl.style.display   = 'none';
    if (nameWrap) nameWrap.style.display = 'none';
  } else {
    if (titleEl)  titleEl.textContent   = 'Plant your seed';
    if (subEl)    subEl.textContent     = 'Your standard bonsai seed is ready. Water it daily and watch it grow over 30 days.';
    if (btnEl)    btnEl.style.display   = 'block';
    if (nameWrap) nameWrap.style.display = 'block';
  }

  if (hasBoth) {
    requestAnimationFrame(() => {
      const previewEl = document.getElementById('bonsaiPotPreview');
      if (!previewEl) return;
      previewEl.innerHTML = '';
      const c = document.createElement('canvas');
      c.width = 120; c.height = 100;
      previewEl.appendChild(c);
      drawPot(c.getContext('2d'), 60, 78, 'standard');
    });
  }
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

  _bonsaiShowPlantView(_bonsaiLoad());
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
  _bonsaiShowPlantView(_bonsaiLoad());
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

// ─── Rewards popup ───────────────────────────────────────────────────────────

function openBonsaiRewardsPopup() {
  const existing = document.getElementById('bonsaiRewardsPopup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'bonsaiRewardsPopup';
  popup.className = 'bonsai-rewards-popup';
  popup.innerHTML = `
    <div class="bonsai-rewards-card">
      <div class="bonsai-rewards-title">Your Rewards</div>
      <div class="bonsai-rewards-subtitle">Collected from your practice</div>

      <div class="bonsai-rewards-items">
        <div class="bonsai-rewards-item">
          <div class="bonsai-rewards-item-icon">🪴</div>
          <div>
            <div class="bonsai-rewards-item-name">Bonsai Pot</div>
            <div class="bonsai-rewards-item-sub">Earned from first breath</div>
          </div>
        </div>
        <div class="bonsai-rewards-divider"></div>
        <div class="bonsai-rewards-item">
          <div class="bonsai-rewards-item-icon">🌱</div>
          <div>
            <div class="bonsai-rewards-item-name">Starter Seeds</div>
            <div class="bonsai-rewards-item-sub">Earned from first meditation</div>
          </div>
        </div>
      </div>

      <p class="bonsai-rewards-hint">
        Visit your <strong>Bonsai Garden</strong> in Profile to begin growing.
      </p>

      <button class="bonsai-action-btn" onclick="
        document.getElementById('bonsaiRewardsPopup').remove();
        closeMobSession();
        transitionTo(() => navigate('profile'));
      ">Go to Garden</button>

      <button class="bonsai-rewards-dismiss" onclick="
        document.getElementById('bonsaiRewardsPopup').remove();
      ">Maybe later</button>
    </div>
  `;

  document.body.appendChild(popup);
  requestAnimationFrame(() => { popup.style.opacity = '1'; });
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

// Triple tap easter egg on homepage logo
let _logoTapCount = 0;
let _logoTapTimer = null;

function _bonsaiInitLogoEgg() {
  const logo = document.getElementById('homeLogo');
  if (!logo) return;
  logo.addEventListener('click', () => {
    _logoTapCount++;
    clearTimeout(_logoTapTimer);
    if (_logoTapCount >= 3) {
      _logoTapCount = 0;
      _bonsaiShowGardenEgg();
    } else {
      _logoTapTimer = setTimeout(() => {
        _logoTapCount = 0;
      }, 600);
    }
  });
}

function _bonsaiShowGardenEgg() {
  const existing = document.getElementById('bonsaiEggPopup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'bonsaiEggPopup';
  popup.className = 'bonsai-egg-popup';
  popup.innerHTML = `
    <div class="bonsai-egg-card">
      <div class="bonsai-egg-icon">🌳</div>
      <div class="bonsai-egg-title">Go to Garden</div>
      <div class="bonsai-egg-sub">Your bonsai awaits.</div>
      <button class="bonsai-action-btn" onclick="
        document.getElementById('bonsaiEggPopup').remove();
        openBonsaiScreen();
      ">OK</button>
      <button class="bonsai-rewards-dismiss" onclick="
        document.getElementById('bonsaiEggPopup').remove();
      ">Dismiss</button>
    </div>
  `;
  document.body.appendChild(popup);
  requestAnimationFrame(() => { popup.style.opacity = '1'; });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _bonsaiInitLogoEgg);
} else {
  _bonsaiInitLogoEgg();
}
