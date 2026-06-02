  /* ────── Page transition ────── */
  let _inTransition = false;
  function transitionTo(fn) {
    if (_inTransition) { fn(); return; }
    const overlay = document.getElementById('page-transition-overlay');
    _inTransition = true;
    overlay.classList.add('fading');
    setTimeout(() => {
      fn();
      setTimeout(() => {
        overlay.classList.remove('fading');
        _inTransition = false;
      }, 50);
    }, 250);
  }

  function navTo(target) {
    transitionTo(() => navigate(target));
  }

  /* ────── Header ────── */

  function renderHeader({ showUserIcon = true } = {}) {
    const avatar = document.getElementById('profileIconBtn');
    if (avatar) avatar.style.display = showUserIcon ? '' : 'none';
  }

  /* ────── Navigation stack ────── */
  let _navStack = [];

  function _navPush(backFn) {
    _navStack.push(backFn);
    _updateStickyBack();
  }

  function _navBack() {
    transitionTo(() => {
      const fn = _navStack.pop();
      _updateStickyBack();
      if (fn) fn();
    });
  }

  function _navClear() {
    _navStack = [];
    hideStickyBack();
  }

  function _updateStickyBack() {
    if (_navStack.length) showStickyBack();
    else hideStickyBack();
  }

  function showStickyBack() {
    document.getElementById('sticky-back-bar')?.classList.add('visible');
  }

  function hideStickyBack() {
    document.getElementById('sticky-back-bar')?.classList.remove('visible');
  }

  let _backLabel = 'Back';

  function _setBackLabel(label) {
    _backLabel = label;
    const el = document.getElementById('sticky-back-label');
    if (el) el.textContent = label;
  }

  let _lastHomeNav = 0;
  function homeNavigate(target) {
    const now = Date.now();
    if (now - _lastHomeNav < 400) return;
    _lastHomeNav = now;
    transitionTo(() => navigate(target));
  }

  function navigate(target, opts = {}) {
    if (!['home', 'techniques', 'meditate', 'library', 'plan', 'profile'].includes(target)) return;
    _introPlayedThisSession = true;
    if (!opts.keepDetail) _navClear();

    // Hide all sections, deactivate nav
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // Activate target
    document.getElementById(target).classList.add('active');
    const _navBtn = document.querySelector(`.nav-btn[data-section="${target}"]`);
    if (_navBtn) _navBtn.classList.add('active');
    state.section = target;

    // Reset to list view when entering a section freshly
    if (target === 'techniques' && !opts.keepDetail) hideTechniqueDetail();
    if (target === 'meditate'   && !opts.keepDetail) hideMeditationDetail();
    if (target === 'library'    && !opts.keepDetail) hideLibraryDetail();

    // Per-section render hooks
    if (target === 'home')    renderHomeSummary();
    if (target === 'profile') { renderProfile(); if (typeof bonsaiUpdateProfileCard === 'function') bonsaiUpdateProfileCard(); }
    if (target === 'plan')    { _navPush(() => navigate('profile')); _setBackLabel('Back to Profile'); }

    // Achievement triggers for Knowledge hub visits
    if (target === 'techniques') {
      store.visitedBreathworkHub = (store.visitedBreathworkHub || 0) + 1;
      saveStore(store); checkAchievements();
    }
    if (target === 'meditate') {
      store.visitedMeditationsHub = (store.visitedMeditationsHub || 0) + 1;
      saveStore(store); checkAchievements();
    }

    // Sync header avatar visibility with current auth state
    renderHeader({ showUserIcon: typeof auth !== 'undefined' && auth.loggedIn });

    // Hide FAB unless on a detail view
    updateFab();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    track('page_view', { section: target });
  }

  /* ════════════════ TECHNIQUES + MEDITATIONS ════════════════ */

  function cautionClass(text) {
    const t = (text || '').toLowerCase();
    if (/danger|serious|medical|epilep|heart condition|stop if/.test(t)) return 'risk';
    if (/consult|caution|avoid|not recommended/.test(t)) return 'caution';
    if (/safe for all|no known|generally safe|suitable for all/.test(t)) return 'safe';
    return '';
  }

  /* Mind & Body progression matrix — 3-phase, 5 Level-1 items unlocked per tab. */
  const _LEVEL_BY_ID = {
    // Breathwork — Level 1 (unlocked)
    'resonant-breathing': 1, 'box-breathing': 1, '4-7-8-breathing': 1, 'sama-vritti': 1, 'bhramari': 1,
    // Breathwork — Level 2 (locked)
    'diaphragmatic-breathing': 2, 'physiological-sigh': 2, 'nadi-shodhana': 2, 'ujjayi': 2, 'buteyko-method': 2, 'kapalabhati': 2,
    // Breathwork — Level 3 (locked)
    'extended-exhale': 3, 'wim-hof-method': 3, 'tummo': 3, 'kumbhaka': 3, 'uddiyana-bandha': 3, 'advanced-buteyko': 3, 'holotropic-breathwork': 3,
    // Meditation — Level 1 (unlocked)
    'mindfulness-of-breath': 1, 'gratitude-meditation': 1, 'yoga-nidra': 1, 'soundscape-meditation': 1, 'box-visualization': 1,
    // Meditation — Level 2 (locked)
    'body-scan': 2, 'loving-kindness': 2, 'mantra-japa': 2, 'visualization': 2, 'trataka': 2, 'chakra-visualization': 2, 'gap-watching': 2,
    // Meditation — Level 3 (locked)
    'open-awareness': 3, 'self-inquiry': 3, 'void-meditation': 3
  };
  const _CARD_ORDER = [
    // Body (Breathwork) — L1, L2, L3
    'resonant-breathing', 'box-breathing', '4-7-8-breathing', 'sama-vritti', 'bhramari',
    'diaphragmatic-breathing', 'physiological-sigh', 'nadi-shodhana', 'ujjayi', 'buteyko-method', 'kapalabhati',
    'extended-exhale', 'wim-hof-method', 'tummo', 'kumbhaka', 'uddiyana-bandha', 'advanced-buteyko', 'holotropic-breathwork',
    // Mind (Meditation) — L1, L2, L3
    'mindfulness-of-breath', 'gratitude-meditation', 'yoga-nidra', 'soundscape-meditation', 'box-visualization',
    'body-scan', 'loving-kindness', 'mantra-japa', 'visualization', 'trataka', 'chakra-visualization', 'gap-watching',
    'open-awareness', 'self-inquiry', 'void-meditation'
  ];
  const _CARD_ORDER_INDEX = new Map(_CARD_ORDER.map((id, i) => [id, i]));
  const _LOCK_ICON_SVG = '<svg class="card-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  function _practiceLevel(id) { return _LEVEL_BY_ID[id] || 1; }

  function isPracticeUnlocked(item) {
    const appLvl = item.appLevel !== undefined ? item.appLevel : 1;
    if (appLvl === 0) return true;
    const unlockedLevel = (loadStore().unlockedLevel) || 0;
    return appLvl <= unlockedLevel;
  }

  // Locked cards don't navigate — gently explain why instead.
  function lockedToast() {
    showToast({ icon: '🔒', label: 'Complete your achievements to unlock this practice', autohide: 2600 });
  }

  function renderCardGrid(items, gridId, openFn) {
    const grid = document.getElementById(gridId);
    const sorted = [...items].sort((a, b) => {
      const ai = _CARD_ORDER_INDEX.has(a.id) ? _CARD_ORDER_INDEX.get(a.id) : 999;
      const bi = _CARD_ORDER_INDEX.has(b.id) ? _CARD_ORDER_INDEX.get(b.id) : 999;
      return ai - bi;
    });
    grid.innerHTML = sorted.map(item => {
      const level  = _practiceLevel(item.id);
      const locked = !isPracticeUnlocked(item);
      const click  = locked ? ` onclick="lockedToast()"` : ` onclick="${openFn}('${item.id}')"`;
      const aria   = locked ? ' aria-disabled="true"' : '';
      const badge  = `<div class="card-level-badge lv-${level}">${locked ? _LOCK_ICON_SVG : ''}<span>Level ${level}</span></div>`;
      return `
      <button class="card${locked ? ' card--locked' : ''}"${aria}${click}>
        ${badge}
        <div class="card-title">${escapeHtml(item.title)}</div>
        <div class="card-desc">${escapeHtml(item.desc)}</div>
      </button>
    `;
    }).join('');
  }

  function collapseP(text, uid) {
    return `<p>${escapeHtml(text)}</p>`;
  }

  // Router: rich tabbed detail when we have full data for the practice; simple detail otherwise.
  function renderDetail(item, containerId, kind) {
    if (kind === 'technique' && TECHNIQUE_DETAILS[item.id]) {
      renderRichDetail(item, containerId, 'technique');
    } else if (kind === 'meditation' && MEDITATION_DETAILS[item.id]) {
      renderRichDetail(item, containerId, 'meditation');
    } else {
      renderSimpleDetail(item, containerId, kind);
    }
  }

  function renderSimpleDetail(item, containerId, kind) {
    const container = document.getElementById(containerId);
    const itemIdJs = item.id.replace(/'/g, "\\'");
    container.innerHTML = `
      <h1 class="detail-title">${escapeHtml(item.title)}</h1>
      <p class="detail-desc">${escapeHtml(item.desc)}</p>

      <div class="detail-section">
        <h3>The method, step by step</h3>
        <ol>${(item.steps || []).map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
      </div>

      <div class="howto-start-wrap">
        <button class="detail-start-btn" onclick="openStartSession('${itemIdJs}')">Start Session</button>
      </div>

      <div class="detail-meta">
        <span class="pill accent">${escapeHtml(item.bestFor)}</span>
        <span class="pill diff-${item.difficulty}">${escapeHtml(item.difficulty)}</span>
        <span class="pill">${escapeHtml(item.duration)}</span>
      </div>
    `;
  }

  function completeBtnHtml(item, kind) {
    return alreadyCompletedToday(item.id)
      ? `<button class="complete-btn done" disabled>
           <svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>
           Completed today
         </button>`
      : `<button class="complete-btn" onclick="completeSession('${kind === 'technique' ? 'technique' : 'meditation'}', '${item.id}')">
           <svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>
           Mark session complete
         </button>`;
  }

  /* ─── Detail view for practices accessed via list — method, tips, progressions only ─── */
  function renderRichDetail(item, containerId, kind) {
    const d = (kind === 'meditation' ? MEDITATION_DETAILS : TECHNIQUE_DETAILS)[item.id];
    const container = document.getElementById(containerId);
    const itemIdJs = item.id.replace(/'/g, "\\'");
    const tips = d?.howTo?.tips || [];
    const progressions = d?.howTo?.progressions || [];
    container.innerHTML = `
      <h1 class="detail-title">${escapeHtml(item.title)}</h1>
      <p class="detail-desc">${escapeHtml(item.desc)}</p>

      <div class="detail-section">
        <h3>The method, step by step</h3>
        <ol>${(item.steps || []).map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
      </div>

      <div class="howto-start-wrap">
        <button class="detail-start-btn" onclick="openStartSession('${itemIdJs}')">Start Session</button>
      </div>

      <div class="detail-meta">
        <span class="pill accent">${escapeHtml(item.bestFor)}</span>
        <span class="pill diff-${item.difficulty}">${escapeHtml(item.difficulty)}</span>
        <span class="pill">${escapeHtml(item.duration)}</span>
      </div>

      ${tips.length ? `
      <div class="detail-section">
        <h3>Tips</h3>
        <ul>${tips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
      </div>` : ''}

      ${progressions.length ? `
      <div class="detail-section">
        <h3>Beginner → advanced progression</h3>
        <div class="progressions">
          ${progressions.map(p => `
            <div class="progression">
              <div class="prog-level">${escapeHtml(p.level)}</div>
              <div class="prog-detail">${escapeHtml(p.detail)}</div>
            </div>`).join('')}
        </div>
      </div>` : ''}
    `;
  }

  /* Animation render — picks SVG/HTML markup for a given technique animation type. */
  function renderAnimation(type) {
    switch (type) {
      case 'box': return `
        <div class="anim-box">
          <span class="anim-box-label top">Inhale · 4</span>
          <span class="anim-box-label right">Hold · 4</span>
          <span class="anim-box-label bottom">Exhale · 4</span>
          <span class="anim-box-label left">Hold · 4</span>
          <div class="anim-box-dot"></div>
        </div>`;
      case '478': return `
        <div class="anim-478">
          <div class="anim-478-ratio">4 · 7 · 8</div>
          <div class="anim-478-orb"></div>
        </div>`;
      case 'sigh': return `
        <div class="anim-sigh">
          <div class="anim-sigh-orb"></div>
        </div>`;
      case 'wim': return `
        <div class="anim-wim" id="anim-wim-host">
          <div class="anim-wim-phase" id="anim-wim-phase">Breath</div>
          <div class="anim-wim-counter" id="anim-wim-counter">1</div>
          <div class="anim-wim-orb"></div>
        </div>`;
      case 'reduce': return `
        <div class="anim-reduce">
          <div class="anim-reduce-ring"></div>
          <div class="anim-reduce-orb"></div>
        </div>`;
      case 'alternate': return `
        <div class="anim-alternate" style="position: relative;">
          <div class="anim-alternate-orb left"></div>
          <div class="anim-alternate-orb right"></div>
        </div>`;
      case 'rapid': return `
        <div class="anim-rapid">
          <div class="anim-rapid-orb"></div>
        </div>`;
      case 'hum': return `
        <div class="anim-hum">
          <div class="anim-hum-orb"></div>
        </div>`;
      case 'slow-wave': return `
        <div class="anim-slow-wave">
          <svg viewBox="0 0 200 80" preserveAspectRatio="none">
            <path class="wave-path" d="M0 40 Q 25 0, 50 40 T 100 40 T 150 40 T 200 40"/>
          </svg>
        </div>`;
      case 'expand-hold': return `
        <div class="anim-expand-hold">
          <div class="anim-expand-hold-orb"></div>
        </div>`;

      /* ─── Meditation animations ─── */
      case 'mindful-breath': return `
        <div class="anim-mindful">
          <div class="anim-mindful-orb"></div>
        </div>`;
      case 'body-scan': return `
        <div class="anim-body-scan">
          <svg viewBox="0 0 80 200" width="80" height="200" preserveAspectRatio="xMidYMid meet">
            <!-- Body silhouette: head, shoulders, torso, legs (stroke-only outline) -->
            <circle cx="40" cy="20" r="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.45"/>
            <path d="M 20 42 Q 24 50, 26 70 L 26 122 Q 26 132, 28 140 L 28 188"
                  fill="none" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.45"/>
            <path d="M 60 42 Q 56 50, 54 70 L 54 122 Q 54 132, 52 140 L 52 188"
                  fill="none" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.45"/>
            <path d="M 20 42 Q 40 36, 60 42" fill="none" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.45"/>
            <path d="M 26 122 L 54 122" fill="none" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.25"/>
            <!-- Scan beam -->
            <rect class="scan-beam" x="12" y="6" width="56" height="2" rx="1" fill="currentColor"/>
          </svg>
        </div>`;
      case 'metta': return `
        <div class="anim-metta">
          <div class="anim-metta-heart"></div>
          <div class="anim-metta-ring"></div>
        </div>`;
      case 'nidra': return `
        <div class="anim-nidra">
          <div class="anim-nidra-orb"></div>
        </div>`;
      case 'trataka': return `
        <div class="anim-trataka">
          <div class="anim-trataka-flame"></div>
          <div class="anim-trataka-candle"></div>
          <div class="anim-trataka-wick"></div>
        </div>`;
      case 'spacious': return `
        <div class="anim-spacious">
          <div class="anim-spacious-dot"></div>
        </div>`;

      default: return `<div class="anim-478"><div class="anim-478-orb"></div></div>`;
    }
  }

  function animationCaption(type, item) {
    switch (type) {
      case 'box':            return 'Trace the square · 4–4–4–4';
      case '478':            return 'Inhale 4 · hold 7 · exhale 8';
      case 'sigh':           return 'Inhale · top-off sniff · long exhale';
      case 'wim':            return 'One full breath per beat · then retain';
      case 'reduce':         return 'Gentle, reduced-volume nasal breath';
      case 'alternate':      return 'Left then right · alternate';
      case 'rapid':          return 'Sharp exhales · passive inhale';
      case 'hum':             return 'Steady humming · feel the resonance';
      case 'slow-wave':      return 'Slow continuous breath · audible ocean';
      case 'expand-hold':    return 'Expand · retain · release';
      case 'mindful-breath': return 'Rest attention on the natural breath';
      case 'body-scan':      return 'Sweep awareness from head to toe';
      case 'metta':          return 'Radiate goodwill outward · in all directions';
      case 'nidra':          return 'Drift between waking and sleep';
      case 'trataka':        return 'Steady gaze · then the inner image';
      case 'spacious':       return 'Awareness without an object · the open ground';
      default:               return item.title;
    }
  }

  /* ─── Related blocks ─── */
  function renderRelatedBlock(title, items) {
    if (!items.length) return '';
    const cards = items.map(it => {
      if (it.kind === 'person') {
        const person = LIBRARY.people.find(p => p.name === it.name);
        const sub = person ? person.role : '';
        return `<button class="related-card" onclick="openLibraryEntry('person','${slug(it.name)}')">
          <span class="rc-kicker">Person</span>
          <span class="rc-title">${escapeHtml(it.name)}</span>
          ${sub ? `<span class="rc-sub">${escapeHtml(sub)}</span>` : ''}
        </button>`;
      }
      if (it.kind === 'book') {
        const book = LIBRARY.books.find(b => b.title === it.title);
        const sub = book ? book.author : '';
        return `<button class="related-card" onclick="openLibraryEntry('book','${slug(it.title)}')">
          <span class="rc-kicker">Book</span>
          <span class="rc-title">${escapeHtml(it.title)}</span>
          ${sub ? `<span class="rc-sub">${escapeHtml(sub)}</span>` : ''}
        </button>`;
      }
      if (it.kind === 'technique') {
        const t = TECHNIQUES.find(x => x.id === it.id);
        if (!t) return '';
        return `<button class="related-card" onclick="navigate('techniques'); showTechniqueDetail('${t.id}')">
          <span class="rc-kicker">Technique</span>
          <span class="rc-title">${escapeHtml(t.title)}</span>
          <span class="rc-sub">${escapeHtml(t.bestFor)} · ${escapeHtml(t.duration)}</span>
        </button>`;
      }
      return '';
    }).join('');
    return `<div class="related-block">
      <h3>${escapeHtml(title)}</h3>
      <div class="related-grid">${cards}</div>
    </div>`;
  }

  /* Tab switching */
  function switchTab(btn, panelName) {
    const root = btn.closest('.detail-view');
    if (!root) return;
    root.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    root.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = root.querySelector(`[data-panel="${panelName}"]`);
    if (panel) panel.classList.add('active');

    // Drive the Wim Hof counter only when its tab is visible
    if (panelName === 'learn' && document.getElementById('anim-wim-host')) {
      startWimCounter();
    } else {
      stopWimCounter();
    }
  }

  /* Wim Hof counter — JS-driven (one beat per ~1.6s, count 1→30, then 10s hold, repeat) */
  let wimTimer = null;
  function startWimCounter() {
    stopWimCounter();
    const counterEl = document.getElementById('anim-wim-counter');
    const phaseEl   = document.getElementById('anim-wim-phase');
    const host      = document.getElementById('anim-wim-host');
    if (!counterEl || !phaseEl || !host) return;
    let n = 0;
    function tick() {
      n += 1;
      if (n <= 30) {
        counterEl.textContent = String(n);
        phaseEl.textContent = 'Breath ' + n + ' / 30';
        host.classList.remove('hold');
        wimTimer = setTimeout(tick, 1600);
      } else if (n === 31) {
        counterEl.textContent = '—';
        phaseEl.textContent = 'Retain · empty lungs';
        host.classList.add('hold');
        wimTimer = setTimeout(tick, 10000);
      } else {
        n = 0;
        wimTimer = setTimeout(tick, 800);
      }
    }
    tick();
  }
  function stopWimCounter() {
    if (wimTimer) { clearTimeout(wimTimer); wimTimer = null; }
  }

  /* ─── Actions: Start Session / Add to Plan ─── */
  // Look up a practice in either TECHNIQUES or MEDITATIONS by id
  function findPractice(practiceId) {
    return TECHNIQUES.find(t => t.id === practiceId)
        || MEDITATIONS.find(m => m.id === practiceId)
        || null;
  }

  // Entry point: techniques with a `phases` array go to the curve pacer;
  // everything else uses the existing session engine.
  // Wired here at navigation.js (was line 603) — the "Start session" button in
  // renderRichDetail calls openStartSession(practiceId).
  function openStartSession(practiceId) {
    if (practiceId === 'mindfulness-of-breath') {
      openMobSession();
      return;
    }
    _showSessionIntro(practiceId);
  }

  function _showSessionIntro(practiceId) {
    const practice = findPractice(practiceId);
    const popup   = document.getElementById('sessionIntroPopup');
    if (!popup || !practice) { _launchSession(practiceId); return; }

    document.getElementById('siTitle').textContent = practice.title || '';
    document.getElementById('siDesc').textContent  = practice.desc  || '';
    const listEl = document.getElementById('siSteps');
    if (listEl) {
      listEl.innerHTML = (practice.steps || [])
        .map(s => `<li>${s}</li>`).join('');
    }

    popup.dataset.practiceId = practiceId;
    popup.classList.remove('hiding');
    popup.style.display = 'flex';
  }

  function _closeSessionIntro() {
    const popup = document.getElementById('sessionIntroPopup');
    if (!popup) return;
    const practiceId = popup.dataset.practiceId;
    popup.classList.add('hiding');
    setTimeout(() => {
      popup.style.display = 'none';
      popup.classList.remove('hiding');
      _launchSession(practiceId);
    }, 350);
  }

  function _launchSession(practiceId) {
    const practice = findPractice(practiceId);
    if (practice && practice.phases && practice.phases.length) {
      openPacer(practiceId);
    } else {
      openSession(practiceId);
    }
  }
  function closeStartSession() {
    sessionCancel();
  }

  /* ─── Breath Pacer — canvas scrolling sine wave ─── */

  const _PACER_BASELINE_R  = 0.5;
  const _PACER_AMPLITUDE_R = 0.42;
  const _PACER_PHASE       = 0.25;
  const _PACER_IDLE_FRAC   = 0.7;

  /* ── Wake Lock — keeps screen on during active sessions ── */
  let _wakeLock = null;

  async function requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        _wakeLock = await navigator.wakeLock.request('screen');
      } catch (e) { console.log('Wake lock failed:', e); }
    }
  }

  function releaseWakeLock() {
    if (_wakeLock) { _wakeLock.release(); _wakeLock = null; }
  }

  document.addEventListener('visibilitychange', async () => {
    if (_wakeLock !== null && document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  });

  /* ── Pacer audio ── */
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('triad:soundEnabled') !== 'false';
  let _pacerPausedAt = null;

  function _updateSoundToggle() {
    const onOpt  = document.getElementById('settings-sound-on');
    const offOpt = document.getElementById('settings-sound-off');
    if (onOpt)  onOpt.classList.toggle('active',  soundEnabled);
    if (offOpt) offOpt.classList.toggle('active', !soundEnabled);
  }

  const _SOUND_ON_SVG  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  const _SOUND_OFF_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
  let chimeFired = false;
  let dongFired  = false;
  let prevOrbY   = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  /* Soft meditation bowl tone — replaces all sci-fi/electronic sounds */
  function createBowlTone(frequency, duration) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.98, ctx.currentTime + duration);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  /* 500ms debounce guard — prevents double-fire at cycle boundaries */
  let _soundPlaying = false;
  function _playGuarded(fn) {
    if (_soundPlaying) return;
    _soundPlaying = true;
    fn();
    setTimeout(() => { _soundPlaying = false; }, 500);
  }

  function playChime() { _playGuarded(() => createBowlTone(285, 3.0)); }  // exhale start
  function playDong()  { _playGuarded(() => createBowlTone(396, 2.5)); }  // inhale start

  function pacerToggleMute() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('triad:soundEnabled', soundEnabled);
    _updateSoundToggle();
  }

  let _pacerState = {
    phases: [],
    practiceId: null,
    running: false,
    raf: null,
    breathCount: 1,
    totalMs: 0,
    cycleMs: 0,
    lastTs: null,
    completedCycles: 0,
    totalCycles: 3,
    prerollMs: 0,       // ms elapsed during countdown pre-roll
    prerollLastTs: null,
    prerollRaf: null,   // rAF handle for pre-roll animation
  };

  // Size the canvas to fill its wrapper. Call after overlay becomes visible.
  function _pacerResizeCanvas() {
    const canvas = document.getElementById('pacerCanvas');
    if (!canvas) return;
    const wrap = canvas.parentElement;
    if (!wrap) return;
    canvas.width  = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
  }

  // Core draw routine — accepts any canvas element.
  function _pacerDrawToCanvas(canvas, running, scrollOffset) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    if (!W || !H) return;

    ctx.clearRect(0, 0, W, H);

    const baseline  = H * _PACER_BASELINE_R;
    const amplitude = H * _PACER_AMPLITUDE_R;
    const centreX   = W / 2;
    // phaseOffset shifts the wave so orb (at centreX) sits at bottom when scrollOffset=0
    const phaseOff  = W * _PACER_PHASE;
    const curveY    = (x) => baseline - amplitude * Math.sin(((x + scrollOffset + phaseOff) / W) * Math.PI * 2);

    // 1. Dotted grid (static, drawn every frame)
    ctx.fillStyle = 'rgba(201,169,110,0.15)';
    const sp = 28;
    for (let gy = sp / 2; gy < H; gy += sp) {
      for (let gx = sp / 2; gx < W; gx += sp) {
        ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill();
      }
    }

    // 2a. Guide: right of orb only — dim gold ahead of the orb
    ctx.save();
    ctx.strokeStyle = 'rgba(201,169,110,0.22)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centreX, curveY(centreX));
    for (let x = centreX + 2; x <= W; x += 2) ctx.lineTo(x, curveY(x));
    ctx.stroke();
    ctx.restore();

    // 2b. Trail: left-of-centre, bright gold with glow — always drawn (idle + session)
    ctx.save();
    ctx.strokeStyle = '#C9A96E';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = 'rgba(201,169,110,0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, curveY(0));
    for (let x = 2; x <= centreX; x += 2) ctx.lineTo(x, curveY(x));
    ctx.stroke();
    ctx.restore();

    // 3. Orb — fixed at horizontal centre, tracks curve Y
    const orbY = curveY(centreX);
    const orbR = 9;

    // Outer bloom (dimmer when idle)
    const bloomAlpha = running ? 0.25 : 0.08;
    const bloom = ctx.createRadialGradient(centreX, orbY, 0, centreX, orbY, 22);
    bloom.addColorStop(0, `rgba(201,169,110,${bloomAlpha})`);
    bloom.addColorStop(1, 'rgba(201,169,110,0)');
    ctx.beginPath(); ctx.arc(centreX, orbY, 22, 0, Math.PI * 2);
    ctx.fillStyle = bloom; ctx.fill();

    // Main orb radial gradient
    const orbGrad = ctx.createRadialGradient(centreX - 2, orbY - 2, 1, centreX, orbY, orbR);
    orbGrad.addColorStop(0, '#E4C277');
    orbGrad.addColorStop(1, '#C9A96E');
    ctx.beginPath(); ctx.arc(centreX, orbY, orbR, 0, Math.PI * 2);
    ctx.fillStyle = orbGrad; ctx.fill();

    // Inner highlight
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(centreX - 3, orbY - 3, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function _pacerDraw(running, scrollOffset) {
    _pacerDrawToCanvas(document.getElementById('pacerCanvas'), running, scrollOffset);
  }

  // Resize + redraw canvas when overlay is visible and window resizes
  window.addEventListener('resize', () => {
    if (document.getElementById('pacerOverlay')?.classList.contains('active')) {
      _pacerResizeCanvas();
      if (!_pacerState.running && !_pacerState.prerollRaf) {
        const _rc = document.getElementById('pacerCanvas');
        _pacerDraw(false, _rc ? _rc.width * _PACER_IDLE_FRAC : 0);
      }
    }
    if (document.getElementById('pacerOverlayPro')?.classList.contains('active')) {
      _proResizeCanvas();
      if (!_proPacerState.running && !_proPacerState.prerollRaf) {
        const _rc = document.getElementById('proCanvas');
        _pacerDrawToCanvas(_rc, false, _rc ? _rc.width * _PACER_IDLE_FRAC : 0);
      }
    }
  });

  // Pre-roll animation: curve moves at FULL speed during the 3-2-1 countdown.
  // Starts from idle offset (0.7×W). After ~3000ms arrives exactly at bottom (1.0×W).
  // TIME and BREATH do not increment — only the visual warms up.
  function _pacerPrerollTick(now) {
    if (!_pacerState.prerollRaf) return;
    const dt = _pacerState.prerollLastTs !== null ? now - _pacerState.prerollLastTs : 0;
    _pacerState.prerollLastTs = now;
    _pacerState.prerollMs += dt;
    const canvas = document.getElementById('pacerCanvas');
    const W = canvas ? canvas.width : 390;
    _pacerDraw(false, W * _PACER_IDLE_FRAC + (_pacerState.prerollMs / 10000) * W);
    _pacerState.prerollRaf = requestAnimationFrame(_pacerPrerollTick);
  }

  function openPacer(practiceId) {
    const isOnboarded = localStorage.getItem('triad:onboarded') === 'true';
    if (!isOnboarded) {
      return _openGuestPacer(practiceId);
    }
    openProPacer(practiceId);
  }

  function _openGuestPacer(practiceId) {
    const overlay = document.getElementById('pacerOverlay');
    if (!overlay) return;

    // Halt any running session
    _pacerState.running = false;
    if (_pacerState.raf) { cancelAnimationFrame(_pacerState.raf); _pacerState.raf = null; }
    _pacerState.practiceId = practiceId || null;
    _pacerState.breathCount = 1;
    _pacerState.totalMs = 0;
    _pacerState.cycleMs = 0;
    _pacerState.lastTs  = null;
    _pacerState.completedCycles = 0;
    // Reset pre-roll
    if (_pacerState.prerollRaf) { cancelAnimationFrame(_pacerState.prerollRaf); _pacerState.prerollRaf = null; }
    _pacerState.prerollMs = 0;
    _pacerState.prerollLastTs = null;

    // Reset zone-C to idle state for a fresh session
    const _stIdle = document.getElementById('pacerStateIdle');
    const _stCd   = document.getElementById('pacerStateCountdown');
    const _stSess = document.getElementById('pacerStateSession');
    if (_stIdle) _stIdle.style.display = 'flex';
    if (_stCd)   _stCd.style.display   = 'none';
    if (_stSess) _stSess.style.display  = 'none';
    // Reset phase label opacity
    const _plReset = document.getElementById('pacerPhaseLabel');
    if (_plReset) { _plReset.style.opacity = '0'; _plReset.textContent = 'INHALE'; }

    const item = practiceId ? findPractice(practiceId) : null;
    _pacerState.phases = (item && item.phases && item.phases.length)
      ? item.phases
      : [{ type: 'inhale', sec: 5 }, { type: 'exhale', sec: 5 }];

    const nameEl = document.getElementById('pacerTechName');
    const tierEl = document.getElementById('pacerTechTier');
    if (nameEl) nameEl.textContent = item && item.title ? item.title.toUpperCase() : 'RESONANT BREATHING';
    if (tierEl) tierEl.textContent = item && item.tier  ? item.tier.toUpperCase()  : '';

    _pacerUpdateBreath(1);
    _pacerUpdateTime(0);

    // Restore button to full idle state
    const btn = document.getElementById('pacerBreatheBtn');
    if (btn) {
      btn.textContent = 'and Breathe';
      btn.style.cssText = '';
    }

    overlay.classList.add('active');

    // Size canvas after overlay is visible, then draw frozen idle state at 7s position
    requestAnimationFrame(() => {
      _pacerResizeCanvas();
      const _ic = document.getElementById('pacerCanvas');
      _pacerDraw(false, _ic ? _ic.width * _PACER_IDLE_FRAC : 0);
    });
  }

  function _pacerUpdateBreath(n) {
    const el = document.getElementById('pacerBreath');
    if (el) el.textContent = String(n !== undefined ? n : _pacerState.breathCount);
  }

  function _pacerUpdateTime(totalSec) {
    const el = document.getElementById('pacerTime');
    if (!el) return;
    const s = Math.floor(totalSec);
    el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  // Returns the current phase type and progress (0–1) within that phase.
  // Used per-frame to drive the sine-curve opacity on the phase label.
  function _pacerPhaseProgress(phases, cycleMs) {
    const totalSec = phases.reduce((s, p) => s + p.sec, 0);
    if (!totalSec) return { type: 'inhale', progress: 0 };
    let rem = (cycleMs / 1000) % totalSec;
    for (const ph of phases) {
      if (rem < ph.sec) return { type: ph.type, progress: rem / ph.sec };
      rem -= ph.sec;
    }
    return { type: phases[phases.length - 1].type, progress: 1 };
  }

  function _pacerTick(now) {
    if (!_pacerState.running) return;
    if (_pacerState.lastTs !== null) {
      const dt = now - _pacerState.lastTs;
      _pacerState.totalMs += dt;
      _pacerState.cycleMs += dt;
    }
    _pacerState.lastTs = now;

    const totalSec   = _pacerState.phases.reduce((s, p) => s + p.sec, 0);
    const cycleDurMs = totalSec * 1000;

    while (_pacerState.cycleMs >= cycleDurMs) {
      _pacerState.cycleMs -= cycleDurMs;
      _pacerState.completedCycles++;
      if (_pacerState.completedCycles >= _pacerState.totalCycles) {
        _pacerState.running = false;
        _pacerState.raf = null;
        _pacerSessionEnd();
        return;
      }
      _pacerState.breathCount++;
      _pacerUpdateBreath(_pacerState.breathCount);
      chimeFired = false;
      dongFired  = false;
      prevOrbY   = null;
    }

    // scrollOffset = idle pre-position (0.7W) + full-speed pre-roll + full-speed session.
    // idle(0.7W) + preroll(0→0.3W over 3s) + session(0→∞) → seamless from countdown end.
    const canvas = document.getElementById('pacerCanvas');
    const W = canvas ? canvas.width  : 390;
    const H = canvas ? canvas.height : 600;
    const idleOffset    = W * _PACER_IDLE_FRAC;
    const prerollScroll = (_pacerState.prerollMs / 10000) * W;
    const sessionScroll = (_pacerState.totalMs   / 10000) * W;
    const scrollOffset  = idleOffset + prerollScroll + sessionScroll;
    _pacerDraw(true, scrollOffset);

    // Audio cues: fire at actual wave peak/trough position
    if (H > 0 && W > 0) {
      const baseline  = H * _PACER_BASELINE_R;
      const amplitude = H * _PACER_AMPLITUDE_R;
      const phaseOff  = W * _PACER_PHASE;
      const centreX   = W / 2;
      const orbY = baseline - amplitude * Math.sin(((centreX + scrollOffset + phaseOff) / W) * Math.PI * 2);
      if (prevOrbY === null) prevOrbY = orbY;
      const peakY    = baseline - amplitude;
      const troughY  = baseline + amplitude;
      const threshold = amplitude * 0.05;
      if (orbY <= peakY   + threshold     && !chimeFired) { playChime(); chimeFired = true; }
      if (orbY >  peakY   + threshold * 3) chimeFired = false;
      if (orbY >= troughY - threshold     && !dongFired)  { playDong();  dongFired  = true; }
      if (orbY <  troughY - threshold * 3) dongFired = false;
      prevOrbY = orbY;
    }

    // Phase label: text + sine opacity (unchanged logic)
    const phInfo  = _pacerPhaseProgress(_pacerState.phases, _pacerState.cycleMs);
    const phNames = { inhale: 'INHALE', exhale: 'EXHALE', holdFull: 'HOLD', holdEmpty: 'HOLD' };
    const newLabel = phNames[phInfo.type] || '';
    const pl = document.getElementById('pacerPhaseLabel');
    if (pl) {
      if (pl.textContent !== newLabel) pl.textContent = newLabel;
      pl.style.opacity = Math.sin(phInfo.progress * Math.PI).toFixed(3);
    }

    _pacerUpdateTime(_pacerState.totalMs / 1000);
    _pacerState.raf = requestAnimationFrame(_pacerTick);
  }

  function closePacer() {
    _pacerState.running = false;
    if (_pacerState.raf)        { cancelAnimationFrame(_pacerState.raf);        _pacerState.raf        = null; }
    if (_pacerState.prerollRaf) { cancelAnimationFrame(_pacerState.prerollRaf); _pacerState.prerollRaf = null; }
    _pacerState.lastTs = null;
    releaseWakeLock();
    const overlay = document.getElementById('pacerOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  function togglePacer() {
    // Button is hidden during session; this only fires the initial "and Breathe" click.
    if (!_pacerState.running) {
      _pacerStartCountdown();
    }
  }

  /* ── Countdown 3→2→1 ──────────────────────────────────────────── */

  function _pacerStartCountdown() {
    // Switch zone-C: idle → countdown
    const stIdle = document.getElementById('pacerStateIdle');
    const stCd   = document.getElementById('pacerStateCountdown');
    if (stIdle) stIdle.style.display = 'none';
    if (stCd)   stCd.style.display   = 'flex';

    // Start pre-roll: curve moves at half speed during countdown (visual warmup only)
    _pacerState.prerollMs = 0;
    _pacerState.prerollLastTs = null;
    _pacerState.prerollRaf = requestAnimationFrame(_pacerPrerollTick);

    const numEl  = document.getElementById('pacerCdNum');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let n = 3;

    // Prepare number element
    if (numEl) { numEl.textContent = ''; numEl.style.opacity = '0'; }

    function showNum(num, onDone) {
      if (numEl) {
        numEl.textContent = String(num);
        numEl.style.transition = '';
        numEl.style.opacity = '0';
        if (!reduced) numEl.style.transform = 'scale(.9)';
      }
      requestAnimationFrame(() => {
        if (numEl) {
          numEl.style.transition = 'opacity .3s ease' + (reduced ? '' : ', transform .3s ease');
          numEl.style.opacity = '1';
          if (!reduced) numEl.style.transform = 'scale(1)';
        }
        setTimeout(() => {
          if (numEl) numEl.style.opacity = '0';
          setTimeout(onDone, 300);
        }, 700);
      });
    }

    function runNext() {
      if (n > 0) { showNum(n, () => { n--; runNext(); }); }
      else {
        if (stCd) stCd.style.display = 'none';
        _pacerLaunch();
      }
    }

    runNext(); // start immediately — 3 × 1000ms = 3s total, matching pre-roll duration
  }

  /* ── Live session launch ──────────────────────────────────────── */

  function _pacerLaunch() {
    // Switch zone-C: countdown → session
    const stCd   = document.getElementById('pacerStateCountdown');
    const stSess = document.getElementById('pacerStateSession');
    if (stCd)   stCd.style.display   = 'none';
    if (stSess) stSess.style.display  = 'flex';

    // Stop pre-roll — prerollMs is kept so _pacerTick can include it in scrollOffset
    if (_pacerState.prerollRaf) { cancelAnimationFrame(_pacerState.prerollRaf); _pacerState.prerollRaf = null; }

    // Reset phase label
    const pl = document.getElementById('pacerPhaseLabel');
    if (pl) { pl.textContent = 'INHALE'; pl.style.opacity = '0'; }

    chimeFired = false;
    dongFired  = false;
    prevOrbY   = null;

    _pacerState.running = true;
    _pacerState.completedCycles = 0;
    _pacerState.lastTs = null;
    _pacerState.totalMs = 0;
    _pacerState.cycleMs = 0;
    _pacerState.breathCount = 1;
    _pacerUpdateBreath(1);
    _pacerUpdateTime(0);
    requestWakeLock();

    _pacerState.raf = requestAnimationFrame(_pacerTick);
  }

  /* ── Session end → completion screen ─────────────────────────── */

  function _pacerSessionEnd() {

    // Persist the session in the store
    const item = findPractice(_pacerState.practiceId || 'resonant-breathing');
    store.sessions.unshift({
      id: 's_' + Date.now().toString(36),
      kind: 'technique',
      practiceId: _pacerState.practiceId || 'resonant-breathing',
      practiceTitle: item ? item.title : 'Resonant Breathing',
      durationMin: 1,
      ts: new Date().toISOString(),
    });

    // Accumulate breathwork stats for this technique
    const _bwId = _pacerState.practiceId || 'resonant-breathing';
    const _bwSec = Math.round(_pacerState.phases.reduce((s, p) => s + p.sec, 0) * _pacerState.totalCycles);
    if (!store.breathwork) store.breathwork = {};
    if (!store.breathwork[_bwId]) store.breathwork[_bwId] = { totalBreaths: 0, totalSessions: 0, totalDuration: 0 };
    store.breathwork[_bwId].totalBreaths  += _pacerState.totalCycles;
    store.breathwork[_bwId].totalSessions += 1;
    store.breathwork[_bwId].totalDuration += _bwSec;

    updateStreakOnComplete();
    saveStore(store);
    checkAchievements();
    refreshStreakBadge();

    createBowlTone(528, 4.0);

    // Route to the existing #sessionOverlay completion screen.
    // _sess.practiceId is set so sessionReturn() navigates back correctly.
    _sess.practiceId = _pacerState.practiceId || 'resonant-breathing';
    _sess.running = false; _sess.paused = false; _sess.countdown = false; _sess.raf = null;

    closePacer(); // removes .active from #pacerOverlay

    const pcTitle    = item ? item.title : 'Resonant Breathing';
    const pcTotalSec = Math.round(_pacerState.phases.reduce((s, p) => s + p.sec, 0) * _pacerState.totalCycles);
    const pcMM = Math.floor(pcTotalSec / 60);
    const pcSS = pcTotalSec % 60;
    const pcTimeStr = pcMM + ':' + String(pcSS).padStart(2, '0');
    const pcTotalBreaths = ((store.breathwork || {})[_bwId] || {}).totalBreaths || _pacerState.totalCycles;

    const scTechName = document.getElementById('sessionCompleteTechName');
    const scDuration = document.getElementById('sessionCompleteDuration');
    const scCycles   = document.getElementById('sessionCompleteCycles');
    const scBreaths  = document.getElementById('sessionCompleteBreaths');
    const scLearnBtn = document.getElementById('sessionCompleteLearnBtn');
    if (scTechName) scTechName.textContent = pcTitle.toUpperCase();
    if (scDuration)  scDuration.textContent = 'Session Time: ' + pcTimeStr;
    if (scCycles)    scCycles.textContent   = 'Session Breaths: ' + _pacerState.totalCycles;
    if (scBreaths)   scBreaths.textContent  = 'Total Resonant Breaths: ' + pcTotalBreaths;
    if (scLearnBtn)  scLearnBtn.textContent = 'Learn about ' + pcTitle;

    // Update completion screen mini-header avatar to reflect auth state
    const scAvatar = document.getElementById('scAvatarBtn');
    if (scAvatar && typeof auth !== 'undefined' && auth.loggedIn) {
      const initial = ((auth.email || 'U')[0] || 'U').toUpperCase();
      scAvatar.classList.add('logged-in');
      scAvatar.innerHTML = `<span>${initial}</span>`;
    }

    // Ensure global header avatar is in sync for when overlay dismisses
    renderHeader({ showUserIcon: typeof auth !== 'undefined' && auth.loggedIn });

    document.getElementById('sessionView').classList.remove('active');
    document.getElementById('sessionComplete').classList.add('active');
    const _sovA = document.getElementById('sessionOverlay');
    _sovA.classList.add('active');
    _sovA.classList.add('completion-active');

    try { localStorage.setItem('triad:onboarded', 'true'); } catch(e) {}

    if (typeof bonsaiAwardPot === 'function') bonsaiAwardPot();
  }

  // Button handler for the completion screen's three navigation pills.
  // Called from onclick in index.html — must remain a named global function.
  function _sessionCompleteGo(action) {
    const _sovB = document.getElementById('sessionOverlay');
    _sovB.classList.remove('active');
    _sovB.classList.remove('completion-active');
    if (typeof _sess !== 'undefined') {
      _sess.running = false; _sess.paused = false; _sess.countdown = false;
    }
    // Dismiss the guest gate now that the user has completed their first session
    if (typeof window._hideGuestGate === 'function') window._hideGuestGate();
    if (action === 'technique') {
      const techId = (typeof _sess !== 'undefined' && _sess.practiceId) || 'resonant-breathing';
      transitionTo(() => {
        navigate('library', { keepDetail: true });
        switchLibraryTab('breathwork');
        showKnowledgePracticeDetail('technique', techId);
      });
    } else if (action === 'meditate') {
      transitionTo(() => { navigate('meditate'); openMobSession(); });
    } else {
      transitionTo(() => navigate('home'));
    }
  }

  /* ════════════════ POST-ONBOARDING PACER ════════════════ */

  let _proPacerState = {
    phases: [],
    practiceId: null,
    running: false,
    raf: null,
    breathCount: 1,
    totalMs: 0,
    cycleMs: 0,
    lastTs: null,
    completedCycles: 0,
    selectedCycles: 6,
    isInfinite: false,
    prerollMs: 0,
    prerollLastTs: null,
    prerollRaf: null,
  };

  let _proIntroRaf = null;
  let _proIntroMs  = 0;
  let _proIntroLastTs = null;

  function _proIntroStartWave() {
    const canvas = document.getElementById('proIntroCanvas');
    if (!canvas) return;
    canvas.width  = canvas.clientWidth  || 320;
    canvas.height = canvas.clientHeight || 160;
    _proIntroMs = 0;
    _proIntroLastTs = null;
    function tick(now) {
      if (!_proIntroRaf) return;
      const dt = _proIntroLastTs !== null ? now - _proIntroLastTs : 0;
      _proIntroLastTs = now;
      _proIntroMs += dt;
      const W = canvas.width;
      _pacerDrawToCanvas(canvas, false, W * _PACER_IDLE_FRAC + (_proIntroMs / 30000) * W);
      _proIntroRaf = requestAnimationFrame(tick);
    }
    _proIntroRaf = requestAnimationFrame(tick);
  }

  function _proIntroStopWave() {
    if (_proIntroRaf) { cancelAnimationFrame(_proIntroRaf); _proIntroRaf = null; }
  }

  function _proResizeCanvas() {
    const canvas = document.getElementById('proCanvas');
    if (!canvas) return;
    const wrap = canvas.parentElement;
    if (!wrap) return;
    canvas.width  = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
  }

  function openProPacer(practiceId) {
    const overlay = document.getElementById('pacerOverlayPro');
    if (!overlay) return;

    _proPacerState.running = false;
    if (_proPacerState.raf)        { cancelAnimationFrame(_proPacerState.raf);        _proPacerState.raf        = null; }
    if (_proPacerState.prerollRaf) { cancelAnimationFrame(_proPacerState.prerollRaf); _proPacerState.prerollRaf = null; }

    _proPacerState.practiceId     = practiceId || null;
    _proPacerState.breathCount    = 1;
    _proPacerState.totalMs        = 0;
    _proPacerState.cycleMs        = 0;
    _proPacerState.lastTs         = null;
    _proPacerState.completedCycles = 0;
    _proPacerState.selectedCycles = 6;
    _proPacerState.isInfinite     = false;
    _proPacerState.prerollMs      = 0;
    _proPacerState.prerollLastTs  = null;

    const item = practiceId ? findPractice(practiceId) : null;
    _proPacerState.phases = (item && item.phases && item.phases.length)
      ? item.phases
      : [{ type: 'inhale', sec: 5 }, { type: 'exhale', sec: 5 }];

    const nameEl = document.getElementById('proTechName');
    const tierEl = document.getElementById('proTechTier');
    if (nameEl) nameEl.textContent = item && item.title ? item.title.toUpperCase() : 'RESONANT BREATHING';
    if (tierEl) tierEl.textContent = item && item.tier  ? item.tier.toUpperCase()  : '';

    const breathEl = document.getElementById('proBreathCount');
    const timerEl  = document.getElementById('proTimer');
    if (breathEl) breathEl.textContent = '1';
    if (timerEl)  timerEl.textContent  = '0:00';

    // Reset zone-C to session select state
    const selDiv = document.getElementById('proSessionSelect');
    const cdDiv  = document.getElementById('proCountdown');
    const actDiv = document.getElementById('proSessionActive');
    if (selDiv) selDiv.style.display = 'flex';
    if (cdDiv)  cdDiv.style.display  = 'none';
    if (actDiv) actDiv.style.display = 'none';

    // Reset tile selection to default (1 min)
    document.querySelectorAll('#proTilesRow .pro-tile').forEach(t => t.classList.remove('selected'));
    const firstTile = document.querySelector('#proTilesRow .pro-tile');
    if (firstTile) firstTile.classList.add('selected');
    const labelEl = document.getElementById('proTileLabel');
    if (labelEl) labelEl.textContent = '1 min';

    // Hide End Session button
    const endBtn = document.getElementById('proEndBtn');
    if (endBtn) endBtn.style.display = 'none';

    // Reset phase label
    const pl = document.getElementById('proPhaseLabel');
    if (pl) { pl.textContent = 'INHALE'; pl.style.opacity = '0'; }

    overlay.classList.add('active');

    // Show intro screen, hide session zones
    const introScreen = document.getElementById('proIntroScreen');
    const zoneA = document.getElementById('proZoneA');
    const zoneB = document.getElementById('proZoneB');
    const zoneC = document.getElementById('proZoneC');
    if (introScreen) introScreen.style.display = 'flex';
    if (zoneA) zoneA.style.display = 'none';
    if (zoneB) zoneB.style.display = 'none';
    if (zoneC) zoneC.style.display = 'none';

    // Populate intro from technique data
    const introTitle    = document.getElementById('proIntroTitle');
    const introSubtitle = document.getElementById('proIntroSubtitle');
    const introList     = document.getElementById('proIntroList');
    if (introTitle)    introTitle.textContent    = item && item.title ? item.title : 'Resonant Breathing';
    if (introSubtitle) introSubtitle.textContent = item && item.desc  ? item.desc  : '';
    const steps = (item && item.steps) ? item.steps : [];
    if (introList && steps.length) {
      introList.innerHTML = steps.map(s => `<li>${s}</li>`).join('');
    }

    // Wire begin button
    const beginBtn = document.getElementById('proIntroBeginBtn');
    if (beginBtn) {
      beginBtn.onclick = () => {
        if (introScreen) introScreen.style.display = 'none';
        if (zoneA) zoneA.style.display = '';
        if (zoneB) zoneB.style.display = '';
        if (zoneC) zoneC.style.display = '';
        _proIntroStopWave();
        requestAnimationFrame(() => {
          _proResizeCanvas();
          const c = document.getElementById('proCanvas');
          _pacerDrawToCanvas(c, false, c ? c.width * _PACER_IDLE_FRAC : 0);
        });
      };
    }

    // Start ambient wave on intro canvas
    requestAnimationFrame(() => _proIntroStartWave());
  }

  function proSelectTile(tile) {
    document.querySelectorAll('#proTilesRow .pro-tile').forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    const dur = parseInt(tile.dataset.duration, 10);
    _proPacerState.selectedCycles = parseInt(tile.dataset.cycles, 10);
    _proPacerState.isInfinite = dur === 0;
    const labelEl = document.getElementById('proTileLabel');
    if (labelEl) labelEl.textContent = dur === 0 ? 'Infinite' : dur + ' min';
  }

  function _proPrerollTick(now) {
    if (!_proPacerState.prerollRaf) return;
    const dt = _proPacerState.prerollLastTs !== null ? now - _proPacerState.prerollLastTs : 0;
    _proPacerState.prerollLastTs = now;
    _proPacerState.prerollMs += dt;
    const canvas = document.getElementById('proCanvas');
    const W = canvas ? canvas.width : 390;
    _pacerDrawToCanvas(canvas, false, W * _PACER_IDLE_FRAC + (_proPacerState.prerollMs / 10000) * W);
    _proPacerState.prerollRaf = requestAnimationFrame(_proPrerollTick);
  }

  function _proStartCountdown() {
    const selDiv = document.getElementById('proSessionSelect');
    const cdDiv  = document.getElementById('proCountdown');
    if (selDiv) selDiv.style.display = 'none';
    if (cdDiv)  cdDiv.style.display  = 'flex';

    _proPacerState.prerollMs = 0;
    _proPacerState.prerollLastTs = null;
    _proPacerState.prerollRaf = requestAnimationFrame(_proPrerollTick);

    const numEl   = document.getElementById('proCountdownNum');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let n = 3;

    if (numEl) { numEl.textContent = ''; numEl.style.opacity = '0'; }

    function showNum(num, onDone) {
      if (numEl) {
        numEl.textContent = String(num);
        numEl.style.transition = '';
        numEl.style.opacity = '0';
        if (!reduced) numEl.style.transform = 'scale(.9)';
      }
      requestAnimationFrame(() => {
        if (numEl) {
          numEl.style.transition = 'opacity .3s ease' + (reduced ? '' : ', transform .3s ease');
          numEl.style.opacity = '1';
          if (!reduced) numEl.style.transform = 'scale(1)';
        }
        setTimeout(() => {
          if (numEl) numEl.style.opacity = '0';
          setTimeout(onDone, 300);
        }, 700);
      });
    }

    function runNext() {
      if (n > 0) { showNum(n, () => { n--; runNext(); }); }
      else {
        if (cdDiv) cdDiv.style.display = 'none';
        _proLaunch();
      }
    }

    runNext();
  }

  function _proLaunch() {
    const actDiv = document.getElementById('proSessionActive');
    if (actDiv) actDiv.style.display = 'flex';

    if (_proPacerState.prerollRaf) { cancelAnimationFrame(_proPacerState.prerollRaf); _proPacerState.prerollRaf = null; }

    const pl = document.getElementById('proPhaseLabel');
    if (pl) { pl.textContent = 'INHALE'; pl.style.opacity = '0'; }

    const endBtn = document.getElementById('proEndBtn');
    if (endBtn) endBtn.style.display = _proPacerState.isInfinite ? 'block' : 'none';

    chimeFired = false;
    dongFired  = false;
    prevOrbY   = null;

    _proPacerState.running        = true;
    _proPacerState.completedCycles = 0;
    _proPacerState.lastTs         = null;
    _proPacerState.totalMs        = 0;
    _proPacerState.cycleMs        = 0;
    _proPacerState.breathCount    = 1;

    const breathEl = document.getElementById('proBreathCount');
    if (breathEl) breathEl.textContent = '1';
    const timerEl = document.getElementById('proTimer');
    if (timerEl) timerEl.textContent = '0:00';
    requestWakeLock();

    _proPacerState.raf = requestAnimationFrame(_proTick);
  }

  function _proTick(now) {
    if (!_proPacerState.running) return;
    if (_proPacerState.lastTs !== null) {
      const dt = now - _proPacerState.lastTs;
      _proPacerState.totalMs += dt;
      _proPacerState.cycleMs += dt;
    }
    _proPacerState.lastTs = now;

    const totalSec   = _proPacerState.phases.reduce((s, p) => s + p.sec, 0);
    const cycleDurMs = totalSec * 1000;

    while (_proPacerState.cycleMs >= cycleDurMs) {
      _proPacerState.cycleMs -= cycleDurMs;
      _proPacerState.completedCycles++;
      if (!_proPacerState.isInfinite && _proPacerState.completedCycles >= _proPacerState.selectedCycles) {
        _proPacerState.running = false;
        _proPacerState.raf = null;
        _proSessionEnd();
        return;
      }
      _proPacerState.breathCount++;
      const breathEl = document.getElementById('proBreathCount');
      if (breathEl) breathEl.textContent = String(_proPacerState.breathCount);
      chimeFired = false;
      dongFired  = false;
      prevOrbY   = null;
    }

    // Draw
    const canvas = document.getElementById('proCanvas');
    const W = canvas ? canvas.width  : 390;
    const H = canvas ? canvas.height : 600;
    const scrollOffset = W * _PACER_IDLE_FRAC
      + (_proPacerState.prerollMs / 10000) * W
      + (_proPacerState.totalMs   / 10000) * W;
    _pacerDrawToCanvas(canvas, true, scrollOffset);

    // Audio cues: fire at actual wave peak/trough position
    if (H > 0 && W > 0) {
      const baseline  = H * _PACER_BASELINE_R;
      const amplitude = H * _PACER_AMPLITUDE_R;
      const phaseOff  = W * _PACER_PHASE;
      const centreX   = W / 2;
      const orbY = baseline - amplitude * Math.sin(((centreX + scrollOffset + phaseOff) / W) * Math.PI * 2);
      if (prevOrbY === null) prevOrbY = orbY;
      const peakY    = baseline - amplitude;
      const troughY  = baseline + amplitude;
      const threshold = amplitude * 0.05;
      if (orbY <= peakY   + threshold     && !chimeFired) { playChime(); chimeFired = true; }
      if (orbY >  peakY   + threshold * 3) chimeFired = false;
      if (orbY >= troughY - threshold     && !dongFired)  { playDong();  dongFired  = true; }
      if (orbY <  troughY - threshold * 3) dongFired = false;
      prevOrbY = orbY;
    }

    // Phase label
    const phInfo   = _pacerPhaseProgress(_proPacerState.phases, _proPacerState.cycleMs);
    const phNames  = { inhale: 'INHALE', exhale: 'EXHALE', holdFull: 'HOLD', holdEmpty: 'HOLD' };
    const newLabel = phNames[phInfo.type] || '';
    const pl = document.getElementById('proPhaseLabel');
    if (pl) {
      if (pl.textContent !== newLabel) pl.textContent = newLabel;
      pl.style.opacity = Math.sin(phInfo.progress * Math.PI).toFixed(3);
    }

    // Timer
    const s = Math.floor(_proPacerState.totalMs / 1000);
    const timerEl = document.getElementById('proTimer');
    if (timerEl) timerEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    _proPacerState.raf = requestAnimationFrame(_proTick);
  }

  function closeProPacer() {
    _proPacerState.running = false;
    if (_proPacerState.raf)        { cancelAnimationFrame(_proPacerState.raf);        _proPacerState.raf        = null; }
    if (_proPacerState.prerollRaf) { cancelAnimationFrame(_proPacerState.prerollRaf); _proPacerState.prerollRaf = null; }
    _proIntroStopWave();
    _proPacerState.lastTs = null;
    releaseWakeLock();
    const overlay = document.getElementById('pacerOverlayPro');
    if (overlay) overlay.classList.remove('active');
  }

  function confirmCancelProSession() {
    const endBtn = document.querySelector('#quitSessionModal .action-btn.secondary');
    if (endBtn) endBtn.onclick = function() { closeQuitModal(); closeProPacer(); };
    openQuitModal();
  }

  function confirmCancelGuestSession() {
    const endBtn = document.querySelector('#quitSessionModal .action-btn.secondary');
    if (endBtn) endBtn.onclick = function() { closeQuitModal(); closePacer(); };
    openQuitModal();
  }

  function confirmCancelMob() {
    if (confirm('End meditation?')) { closeMobSession(); }
  }

  function proEndSession() {
    _proPacerState.running = false;
    if (_proPacerState.raf) { cancelAnimationFrame(_proPacerState.raf); _proPacerState.raf = null; }
    _proSessionEnd();
  }

  function _proSessionEnd() {
    const bwId       = _proPacerState.practiceId || 'resonant-breathing';
    const elapsedSec = Math.round(_proPacerState.totalMs / 1000);
    const completed  = _proPacerState.completedCycles;

    const item = findPractice(bwId);
    store.sessions.unshift({
      id: 's_' + Date.now().toString(36),
      kind: 'technique',
      practiceId: bwId,
      practiceTitle: item ? item.title : 'Resonant Breathing',
      durationMin: Math.max(1, Math.round(elapsedSec / 60)),
      ts: new Date().toISOString(),
    });

    if (!store.breathwork) store.breathwork = {};
    if (!store.breathwork[bwId]) store.breathwork[bwId] = { totalBreaths: 0, totalSessions: 0, totalDuration: 0 };
    store.breathwork[bwId].totalBreaths  += completed;
    store.breathwork[bwId].totalSessions += 1;
    store.breathwork[bwId].totalDuration += elapsedSec;

    updateStreakOnComplete();
    saveStore(store);
    checkAchievements();
    refreshStreakBadge();

    createBowlTone(528, 4.0);

    _sess.practiceId = bwId;
    _sess.running = false; _sess.paused = false; _sess.countdown = false; _sess.raf = null;

    closeProPacer();

    const pcTitle   = item ? item.title : 'Resonant Breathing';
    const pcMM      = Math.floor(elapsedSec / 60);
    const pcSS      = elapsedSec % 60;
    const pcTimeStr = pcMM + ':' + String(pcSS).padStart(2, '0');
    const pcTotalBreaths = ((store.breathwork || {})[bwId] || {}).totalBreaths || completed;

    const scTechName = document.getElementById('sessionCompleteTechName');
    const scDuration = document.getElementById('sessionCompleteDuration');
    const scCycles   = document.getElementById('sessionCompleteCycles');
    const scBreaths  = document.getElementById('sessionCompleteBreaths');
    const scLearnBtn = document.getElementById('sessionCompleteLearnBtn');
    if (scTechName) scTechName.textContent = pcTitle.toUpperCase();
    if (scDuration)  scDuration.textContent = 'Session Time: '    + pcTimeStr;
    if (scCycles)    scCycles.textContent   = 'Session Breaths: ' + completed;
    if (scBreaths)   scBreaths.textContent  = 'Total Resonant Breaths: ' + pcTotalBreaths;
    if (scLearnBtn)  scLearnBtn.textContent = 'Learn about ' + pcTitle;

    const scAvatar = document.getElementById('scAvatarBtn');
    if (scAvatar && typeof auth !== 'undefined' && auth.loggedIn) {
      const initial = ((auth.email || 'U')[0] || 'U').toUpperCase();
      scAvatar.classList.add('logged-in');
      scAvatar.innerHTML = `<span>${initial}</span>`;
    }

    renderHeader({ showUserIcon: typeof auth !== 'undefined' && auth.loggedIn });

    document.getElementById('sessionView').classList.remove('active');
    document.getElementById('sessionComplete').classList.add('active');
    const _sovC = document.getElementById('sessionOverlay');
    _sovC.classList.add('active');
    _sovC.classList.add('completion-active');

  }

  /* ── Pacer pause / resume for settings drawer ──────────────────── */

  function _pacerPause() {
    if (_pacerState.running && _pacerState.raf) {
      cancelAnimationFrame(_pacerState.raf);
      _pacerState.raf = null;
    }
    if (_proPacerState.running && _proPacerState.raf) {
      cancelAnimationFrame(_proPacerState.raf);
      _proPacerState.raf = null;
    }
    _pacerPausedAt = performance.now();
  }

  function _pacerResume() {
    if (_pacerPausedAt === null) return;
    const elapsed = performance.now() - _pacerPausedAt;
    _pacerPausedAt = null;
    if (_pacerState.running && !_pacerState.raf) {
      if (_pacerState.lastTs !== null) _pacerState.lastTs += elapsed;
      _pacerState.raf = requestAnimationFrame(_pacerTick);
    }
    if (_proPacerState.running && !_proPacerState.raf) {
      if (_proPacerState.lastTs !== null) _proPacerState.lastTs += elapsed;
      _proPacerState.raf = requestAnimationFrame(_proTick);
    }
  }

  /* ═══════════════════ MINDFULNESS OF BREATH SESSION ═══════════════════ */

  const _MOB_SESSION_SECS = 30;
  const _MOB_SESSION_MS   = 30000;
  const _MOB_PROMPTS = [
    'Settle in…',
    'Notice your breath…',
    'Feel the rise and fall…',
    'Let thoughts pass like clouds…',
    'Stay with the breath…'
  ];

  let _mobBreaths       = [];
  let _mobHoldTs        = null;
  let _mobTimerInterval = null;
  let _mobTimerElapsed  = 0;
  let _mobTimerStart    = null;
  let _mobTimerRunning  = false;
  let _mobPromptIdx     = 0;
  let _mobPromptTimer   = null;
  let _mobLineRaf       = null;
  let _mobTracePoints   = [];
  let _mobCurrentY      = 0;
  let _mobOrbVelocity   = 0;
  let _mobIsHolding     = false;
  let _mobCanvasW       = 0;
  let _mobCanvasH       = 0;

  function openMobSession() {
    _mobBreaths      = [];
    _mobHoldTs       = null;
    _mobTimerElapsed = 0;
    _mobTimerStart   = null;
    _mobTimerRunning = false;
    _mobPromptIdx    = 0;
    _mobTracePoints  = [];
    _mobCurrentY     = 0;
    _mobOrbVelocity  = 0;
    _mobIsHolding    = false;
    _mobCanvasW      = 0;
    _mobCanvasH      = 0;

    _mobClearTimers();

    // Reset page-2 dynamic elements
    const timerEl = document.getElementById('mobTimer');
    if (timerEl) timerEl.textContent = '00:00';
    const promptEl = document.getElementById('mobPrompt');
    if (promptEl) { promptEl.style.opacity = '1'; promptEl.textContent = _MOB_PROMPTS[0]; }
    const holdBtn = document.getElementById('mobHoldBtn');
    if (holdBtn) holdBtn.classList.remove('pressed');
    const holdLbl = document.getElementById('mobHoldLabel');
    if (holdLbl) holdLbl.textContent = 'Hold';
    const bcEl = document.getElementById('mobBreathCount');
    if (bcEl) bcEl.textContent = 'Breaths: 0';
    const cdEl = document.getElementById('mobCountdown');
    if (cdEl) cdEl.style.display = 'none';

    _mobShowPage(1);
    document.getElementById('mobOverlay').classList.add('active');

    // Static ambient draw on page-1 canvas
    requestAnimationFrame(() => {
      const c1 = document.getElementById('mobWaveCanvas1');
      if (!c1) return;
      const W = c1.clientWidth; const H = c1.clientHeight;
      if (!W || !H) return;
      c1.width = W; c1.height = H;
      _pacerDrawToCanvas(c1, false, W * 0.3);
    });
  }

  function closeMobSession() {
    _mobClearTimers();
    releaseWakeLock();
    const cdEl = document.getElementById('mobCountdown');
    if (cdEl) cdEl.style.display = 'none';
    document.getElementById('mobOverlay')?.classList.remove('active');
  }

  function _mobShowPage(n) {
    const p1 = document.getElementById('mobPage1');
    const p2 = document.getElementById('mobPage2');
    const p3 = document.getElementById('mobPage3');
    if (p1) p1.style.display = n === 1 ? 'flex' : 'none';
    if (p2) p2.style.display = n === 2 ? 'flex' : 'none';
    if (p3) p3.style.display = n === 3 ? 'flex' : 'none';
  }

  function _mobClearTimers() {
    if (_mobTimerInterval) { clearInterval(_mobTimerInterval);  _mobTimerInterval = null; }
    if (_mobPromptTimer)   { clearInterval(_mobPromptTimer);    _mobPromptTimer   = null; }
    if (_mobLineRaf)       { cancelAnimationFrame(_mobLineRaf); _mobLineRaf       = null; }
    _mobTimerRunning = false;
  }

  /* "Begin Meditation" → 3-2-1 countdown → session */
  function _mobGoToPage2() {
    const cdEl  = document.getElementById('mobCountdown');
    const numEl = document.getElementById('mobCdNum');
    if (!cdEl || !numEl) { _mobStartSession(); return; }

    cdEl.style.display = 'flex';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function showNum(n, onDone) {
      numEl.style.transition = 'none';
      numEl.style.opacity = '0';
      numEl.textContent = String(n);
      // Double rAF ensures reset is committed before animating
      requestAnimationFrame(() => requestAnimationFrame(() => {
        numEl.style.transition = 'opacity 0.3s ease';
        numEl.style.opacity = '1';
        setTimeout(() => {
          numEl.style.opacity = '0';
          setTimeout(onDone, 300);
        }, reduced ? 400 : 700);
      }));
    }

    function tick(n) {
      if (n < 1) { cdEl.style.display = 'none'; _mobStartSession(); return; }
      showNum(n, () => tick(n - 1));
    }
    tick(3);
  }

  /* Called after countdown — shows page 2 and starts everything */
  function _mobStartSession() {
    _mobTracePoints = [];
    _mobCurrentY    = 0;
    _mobOrbVelocity = 0;
    _mobIsHolding   = false;
    _mobCanvasW     = 0;
    _mobCanvasH     = 0;
    requestWakeLock();

    _mobShowPage(2);

    _mobTimerRunning = true;
    _mobTimerStart   = performance.now();
    _mobTimerInterval = setInterval(_mobTimerTick, 100);

    _mobShowPromptNow(_MOB_PROMPTS[0]);
    _mobPromptTimer = setInterval(() => {
      _mobPromptIdx = (_mobPromptIdx + 1) % _MOB_PROMPTS.length;
      _mobCrossfadePrompt(_MOB_PROMPTS[_mobPromptIdx]);
    }, 12000);

    _mobStartTrace();
  }

  /* Breath-trace rAF loop — draws continuous record on mobWaveCanvas2 */
  /* Physics constants for orb movement */
  const _MOB_RISE_FORCE    = -0.28;
  const _MOB_FALL_FORCE    =  0.18;
  const _MOB_MAX_RISE_SPD  = -2.5;
  const _MOB_MAX_FALL_SPD  =  1.8;
  const _MOB_DAMPING       =  0.92;

  function _mobStartTrace() {
    if (_mobLineRaf) { cancelAnimationFrame(_mobLineRaf); _mobLineRaf = null; }

    function frame() {
      _mobLineRaf = requestAnimationFrame(frame);
      const canvas = document.getElementById('mobWaveCanvas2');
      if (!canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) return;

      // Sync canvas pixel buffer to rendered size
      if (canvas.width !== W || canvas.height !== H) {
        if (_mobCanvasW && _mobCanvasH) _mobTracePoints = [];
        canvas.width = W; canvas.height = H;
        _mobCanvasW = W; _mobCanvasH = H;
        _mobCurrentY = H * 0.78;
        _mobOrbVelocity = 0;
      }

      const BASELINE_Y = H * 0.78;
      const TOP_Y      = H * 0.12;

      // First-frame init
      if (_mobCurrentY <= 0) { _mobCurrentY = BASELINE_Y; _mobCanvasW = W; _mobCanvasH = H; }

      // Velocity-based physics
      if (_mobIsHolding) {
        _mobOrbVelocity += _MOB_RISE_FORCE;
        _mobOrbVelocity  = Math.max(_mobOrbVelocity, _MOB_MAX_RISE_SPD);
        // Soft ceiling — resistance increases exponentially near TOP_Y
        const ceilingProximity  = 1 - ((_mobCurrentY - TOP_Y) / (BASELINE_Y - TOP_Y));
        const ceilingResistance = Math.pow(Math.max(0, ceilingProximity), 2.5);
        _mobOrbVelocity *= (1 - ceilingResistance * 0.7);
      } else {
        _mobOrbVelocity += _MOB_FALL_FORCE;
        _mobOrbVelocity  = Math.min(_mobOrbVelocity, _MOB_MAX_FALL_SPD);
        // Soft floor — extra damping as orb approaches baseline
        const floorProximity = (_mobCurrentY - TOP_Y) / (BASELINE_Y - TOP_Y);
        if (floorProximity > 0.85) _mobOrbVelocity *= 0.85;
      }
      _mobOrbVelocity *= _MOB_DAMPING;
      _mobCurrentY    += _mobOrbVelocity;
      _mobCurrentY     = Math.max(TOP_Y, Math.min(BASELINE_Y, _mobCurrentY));
      if (_mobCurrentY >= BASELINE_Y && !_mobIsHolding) {
        _mobCurrentY = BASELINE_Y;
        _mobOrbVelocity = 0;
      }

      // Compute current elapsed session time
      const now       = performance.now();
      const elapsedMs = (_mobTimerRunning && _mobTimerStart !== null)
        ? _mobTimerElapsed * 1000 + (now - _mobTimerStart)
        : _mobTimerElapsed * 1000;

      // Append point with session-elapsed timestamp
      if (_mobTimerRunning && _mobTimerStart !== null) {
        _mobTracePoints.push({ t: elapsedMs, y: _mobCurrentY });
        if (_mobTracePoints.length > 2000) _mobTracePoints.shift();
      }

      // Prune points that have scrolled off the left edge
      const orbX      = W * 0.5;
      const scrollSpd = W / _MOB_SESSION_MS;
      while (_mobTracePoints.length > 1 &&
             (orbX - (elapsedMs - _mobTracePoints[0].t) * scrollSpd) < -20) {
        _mobTracePoints.shift();
      }

      _mobDrawTrace(canvas.getContext('2d'), W, H, elapsedMs);
    }

    _mobLineRaf = requestAnimationFrame(frame);
  }

  function _mobDrawTrace(ctx, W, H, elapsedMs) {
    ctx.clearRect(0, 0, W, H);

    const BASELINE_Y = H * 0.78;
    const TOP_Y      = H * 0.12;
    const orbX       = W * 0.5;
    const orbY       = _mobCurrentY;
    const range      = BASELINE_Y - TOP_Y;
    const progress   = range > 0 ? Math.max(0, Math.min(1, (BASELINE_Y - orbY) / range)) : 0;

    // Dotted grid (static)
    ctx.fillStyle = 'rgba(201,169,110,0.15)';
    const sp = 28;
    for (let gy = sp / 2; gy < H; gy += sp)
      for (let gx = sp / 2; gx < W; gx += sp) {
        ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill();
      }

    // Baseline guide (static)
    ctx.beginPath();
    ctx.moveTo(0, BASELINE_Y);
    ctx.lineTo(W, BASELINE_Y);
    ctx.strokeStyle = 'rgba(201,169,110,0.12)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Scrolling breath trace
    const scrollSpd = W / _MOB_SESSION_MS;
    const pts = _mobTracePoints.map(p => ({
      x: orbX - (elapsedMs - p.t) * scrollSpd,
      y: p.y
    })).filter(p => p.x >= -10);

    if (pts.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const midX = (pts[i].x + pts[i + 1].x) / 2;
        const midY = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = `rgba(201,169,110,${(0.35 + progress * 0.55).toFixed(2)})`;
      ctx.lineWidth   = 2 + progress * 2;
      ctx.shadowColor = 'rgba(201,169,110,0.5)';
      ctx.shadowBlur  = 8;
      ctx.lineJoin = 'round';
      ctx.lineCap  = 'round';
      ctx.stroke();
      ctx.restore();
    }

    // Left-edge fade
    const isDark   = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgSolid  = isDark ? 'rgba(10,15,30,1)'  : 'rgba(244,236,221,1)';
    const bgClear  = isDark ? 'rgba(10,15,30,0)'  : 'rgba(244,236,221,0)';
    const fadeGrad = ctx.createLinearGradient(0, 0, 40, 0);
    fadeGrad.addColorStop(0, bgSolid);
    fadeGrad.addColorStop(1, bgClear);
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, 0, 40, H);

    // Bloom
    const bloomR = 16 + progress * 14;
    const bloom  = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, bloomR);
    bloom.addColorStop(0, `rgba(228,194,119,${(0.2 + progress * 0.5).toFixed(2)})`);
    bloom.addColorStop(1, 'rgba(228,194,119,0)');
    ctx.beginPath();
    ctx.arc(orbX, orbY, bloomR, 0, Math.PI * 2);
    ctx.fillStyle = bloom;
    ctx.fill();

    // Core orb
    ctx.beginPath();
    ctx.arc(orbX, orbY, 7 + progress * 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${(0.6 + progress * 0.4).toFixed(2)})`;
    ctx.fill();

    // Vertical dashed guide: orb → baseline
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(orbX, orbY);
    ctx.lineTo(orbX, BASELINE_Y);
    ctx.strokeStyle = `rgba(201,169,110,${(0.15 + progress * 0.2).toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function _mobTimerTick() {
    if (!_mobTimerRunning || _mobTimerStart === null) return;
    const elapsed = _mobTimerElapsed + (performance.now() - _mobTimerStart) / 1000;
    const secs    = Math.min(Math.floor(elapsed), _MOB_SESSION_SECS);
    const mm      = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss      = String(secs % 60).padStart(2, '0');
    const el      = document.getElementById('mobTimer');
    if (el) el.textContent = mm + ':' + ss;
    if (elapsed >= _MOB_SESSION_SECS) {
      _mobTimerRunning = false;
      clearInterval(_mobTimerInterval); _mobTimerInterval = null;
      if (el) el.textContent = '00:30';
      _mobGoToPage3();
    }
  }

  function _mobShowPromptNow(text) {
    const el = document.getElementById('mobPrompt');
    if (!el) return;
    el.textContent = text; el.style.opacity = '1';
  }

  function _mobCrossfadePrompt(text) {
    const el = document.getElementById('mobPrompt');
    if (!el) return;
    el.style.transition = 'opacity 0.6s ease';
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = text; el.style.opacity = '1'; }, 600);
  }

  /* Hold button handlers */
  function _mobHoldDown(e) {
    if (e) e.preventDefault();
    document.getElementById('mobHoldBtn')?.classList.add('pressed');
    const lbl = document.getElementById('mobHoldLabel');
    if (lbl) lbl.textContent = '…';
    _mobIsHolding = true;
    _mobHoldTs = performance.now();
  }

  function _mobHoldUp(e) {
    if (e) e.preventDefault();
    document.getElementById('mobHoldBtn')?.classList.remove('pressed');
    const lbl = document.getElementById('mobHoldLabel');
    if (lbl) lbl.textContent = 'Hold';
    _mobIsHolding = false;
    if (_mobHoldTs !== null) {
      const dur = (performance.now() - _mobHoldTs) / 1000;
      if (dur >= 0.3) {
        _mobBreaths.push(dur);
        const bcEl = document.getElementById('mobBreathCount');
        if (bcEl) bcEl.textContent = 'Breaths: ' + _mobBreaths.length;
      }
      _mobHoldTs = null;
    }
  }

  function _mobHoldCancel() {
    document.getElementById('mobHoldBtn')?.classList.remove('pressed');
    const lbl = document.getElementById('mobHoldLabel');
    if (lbl) lbl.textContent = 'Hold';
    _mobIsHolding = false;
    _mobHoldTs = null;
  }

  /* Timer complete → page 3 */
  function _mobGoToPage3() {
    if (_mobPromptTimer) { clearInterval(_mobPromptTimer);    _mobPromptTimer = null; }
    if (_mobLineRaf)     { cancelAnimationFrame(_mobLineRaf); _mobLineRaf     = null; }
    _mobIsHolding = false;
    _mobHoldTs    = null;
    _mobBuildPage3();
    _mobShowPage(3);
    _mobSaveSession();
    if (typeof bonsaiAwardSeeds === 'function') bonsaiAwardSeeds();
  }

  function _mobBuildPage3() {
    const b    = _mobBreaths;
    const n    = b.length;
    const f    = (v) => v.toFixed(1) + 's';
    const dash = '—';
    const avg  = n ? f(b.reduce((a, x) => a + x, 0) / n) : dash;
    const hi   = n ? Math.max(...b) : null;
    const lo   = n ? Math.min(...b) : null;
    const rows = [
      ['Session Time',       '0:30'],
      ['Breaths Recorded',   String(n)],
      ['Average Breath',     avg],
      ['Longest Breath',     n ? f(hi)          : dash],
      ['Shortest Breath',    n ? f(lo)          : dash],
      ['Breath Variability', n > 1 ? f(hi - lo) : dash]
    ];
    const rowsHTML = rows.map(([l, v]) =>
      `<div class="mob3-stat-row"><span class="mob3-stat-label">${l}</span><span class="mob3-stat-value">${v}</span></div>`
    ).join('');
    document.getElementById('mobPage3').innerHTML =
      `<div class="mob3-title">Mindfulness of Breath</div>` +
      `<div class="mob3-congrats">Congratulations</div>` +
      `<p class="mob3-reflection">How do you feel? Stay present. Would you like to explore more?</p>` +
      `<div class="mob3-stats">${rowsHTML}</div>` +
      `<div class="mob3-actions">` +
        `<button class="mob3-btn" onclick="closeMobSession();transitionTo(()=>{navigate('meditate');showMeditationDetail('mindfulness-of-breath')})">Learn about Mindfulness</button>` +
        `<button class="mob3-btn" onclick="openBonsaiRewardsPopup()">Get Rewards</button>` +
        `<button class="mob3-btn" onclick="closeMobSession();transitionTo(()=>navigate('home'))">Explore the App</button>` +
      `</div>`;
  }

  function _mobSaveSession() {
    if (typeof loadStore !== 'function' || typeof saveStore !== 'function') return;
    const s = loadStore();
    if (!s.meditation) s.meditation = {};
    const m = s.meditation['mindfulness-of-breath'] || {};
    m.totalDuration = (m.totalDuration || 0) + 30;
    m.totalSessions = (m.totalSessions || 0) + 1;
    m.totalBreaths  = (m.totalBreaths  || 0) + _mobBreaths.length;
    s.meditation['mindfulness-of-breath'] = m;
    saveStore(s);
  }

  /* Pause / resume for settings drawer */
  function _mobPause() {
    if (_mobTimerRunning && _mobTimerStart !== null) {
      _mobTimerElapsed += (performance.now() - _mobTimerStart) / 1000;
      _mobTimerStart    = null;
      _mobTimerRunning  = false;
    }
    _mobIsHolding   = false;
    _mobOrbVelocity = 0;
    if (_mobLineRaf) { cancelAnimationFrame(_mobLineRaf); _mobLineRaf = null; }
  }

  function _mobResume() {
    const overlay = document.getElementById('mobOverlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const p2 = document.getElementById('mobPage2');
    if (p2 && p2.style.display !== 'none') {
      if (!_mobTimerRunning && _mobTimerElapsed < _MOB_SESSION_SECS) {
        _mobTimerRunning = true;
        _mobTimerStart   = performance.now();
      }
      _mobStartTrace();
    }
  }

window.addEventListener('load', function() {
  if (typeof bonsaiUpdateProfileCard === 'function') bonsaiUpdateProfileCard();
});

