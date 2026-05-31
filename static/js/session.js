  /* ════════════════ SESSION ENGINE ════════════════ */

  /* ─── Audio guidance ─── */
  let _audioEnabled = localStorage.getItem('triad:audio') === '1';

  // To upgrade to ElevenLabs: replace speakPhase() body with:
  // fetch ElevenLabs /v1/text-to-speech/{voice_id} with text
  // play returned audio blob
  // All other code remains identical
  function speakPhase(text) {
    if (!_audioEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.75;
      u.pitch = 0.9;
      u.volume = 0.8;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === 'en-GB' && v.name.includes('Female'))
        || voices.find(v => v.lang === 'en-GB')
        || voices.find(v => v.lang.startsWith('en'));
      if (preferred) u.voice = preferred;
      window.speechSynthesis.speak(u);
    }
  }

  let _holdCountInterval = null;

  function _sessClearHoldCount() {
    if (_holdCountInterval !== null) { clearInterval(_holdCountInterval); _holdCountInterval = null; }
  }

  function _sessStartHoldCount(durSec) {
    _sessClearHoldCount();
    if (!_audioEnabled || durSec <= 3) return;
    let count = durSec;
    speakPhase(String(count));
    count--;
    _holdCountInterval = setInterval(() => {
      if (count <= 0) { _sessClearHoldCount(); return; }
      speakPhase(String(count));
      count--;
    }, 1000);
  }

  const RHYTHMS = {
    'box-breathing': { phases: [
      { type: 'IN',   dur: 4, label: 'Inhale' },
      { type: 'HOLD', dur: 4, label: 'Hold'   },
      { type: 'OUT',  dur: 4, label: 'Exhale' },
      { type: 'HOLD', dur: 4, label: 'Hold'   },
    ]},
    '4-7-8-breathing': { phases: [
      { type: 'IN',   dur: 4, label: 'Inhale' },
      { type: 'HOLD', dur: 7, label: 'Hold'   },
      { type: 'OUT',  dur: 8, label: 'Exhale' },
    ]},
    'physiological-sigh': { phases: [
      { type: 'IN',  dur: 1.5, label: 'Double Inhale' },
      { type: 'IN',  dur: 1.5, label: 'Double Inhale' },
      { type: 'OUT', dur: 6,   label: 'Exhale'        },
    ]},
    'wim-hof-method': { pathShape: 'circle', phases: [
      { type: 'IN',   dur: 2,   label: 'Inhale' },
      { type: 'HOLD', dur: 0.5, label: 'Hold'   },
      { type: 'OUT',  dur: 2,   label: 'Exhale' },
    ]},
    'nadi-shodhana': { phases: [
      { type: 'IN',   dur: 4, label: 'Inhale Left'  },
      { type: 'HOLD', dur: 4, label: 'Hold'         },
      { type: 'OUT',  dur: 4, label: 'Exhale Right' },
      { type: 'HOLD', dur: 4, label: 'Hold'         },
    ]},
    'kapalabhati': { phases: [
      { type: 'OUT', dur: 0.3, label: 'Exhale' },
      { type: 'IN',  dur: 0.3, label: 'Inhale' },
    ]},
    'bhramari': { phases: [
      { type: 'IN',   dur: 4, label: 'Inhale' },
      { type: 'HOLD', dur: 2, label: 'Hold'   },
      { type: 'OUT',  dur: 6, label: 'Hum'    },
    ]},
    'buteyko-method': { phases: [
      { type: 'IN',  dur: 5, label: 'Inhale (light)' },
      { type: 'OUT', dur: 5, label: 'Exhale (light)' },
    ]},
  };

  const _SESS_DEFAULT_RHYTHM = { phases: [
    { type: 'IN',  dur: 4, label: 'Inhale' },
    { type: 'OUT', dur: 4, label: 'Exhale' },
  ]};

  let _sess = {
    practiceId: null, techniqueTitle: null,
    phases: [], pathShape: null, loopCount: 5, currentLoop: 1,
    phaseIdx: 0, phaseStart: null,
    running: false, paused: false, pausedElapsed: 0,
    countdown: false,
    raf: null, sessionStart: null,
  };

  function _sessEase(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function _sessPolygonVerts(n) {
    const cx = 110, cy = 110, r = 95;
    const v = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      v.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
    return v;
  }

  function _sessOrbPos(shape, phases, phaseIdx, t) {
    const n = phases.length;
    const te = _sessEase(t);
    if (shape === 'circle') {
      const a = -Math.PI / 2 + (phaseIdx + te) * 2 * Math.PI / n;
      return { x: 110 + 95 * Math.cos(a), y: 110 + 95 * Math.sin(a) };
    }
    if (shape === 'oval') {
      const startA = phaseIdx === 0 ? -Math.PI / 2 : Math.PI / 2;
      const a = startA + te * Math.PI;
      return { x: 110 + 100 * Math.cos(a), y: 110 + 60 * Math.sin(a) };
    }
    const verts = _sessPolygonVerts(n);
    const from = verts[phaseIdx];
    const to   = verts[(phaseIdx + 1) % n];
    return { x: from.x + (to.x - from.x) * te, y: from.y + (to.y - from.y) * te };
  }

  function _sessRenderPath() {
    const svg = document.getElementById('sessionSvg');
    const orb = document.getElementById('sessOrb');
    svg.querySelectorAll('.sess-path,.sess-dot').forEach(e => e.remove());
    const ns = 'http://www.w3.org/2000/svg';
    const shape = _sess.pathShape;
    const n = _sess.phases.length;

    function mkEl(tag, attrs) {
      const el = document.createElementNS(ns, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      return el;
    }
    function insertBefore(el) { svg.insertBefore(el, orb); }

    if (shape === 'circle') {
      insertBefore(mkEl('circle', { class: 'sess-path', cx: 110, cy: 110, r: 95, stroke: '#C9A96E', 'stroke-width': '1.5', fill: 'none' }));
      return;
    }
    if (shape === 'oval') {
      insertBefore(mkEl('ellipse', { class: 'sess-path', cx: 110, cy: 110, rx: 100, ry: 60, stroke: '#C9A96E', 'stroke-width': '1.5', fill: 'none' }));
      [[110, 50], [110, 170]].forEach(([dx, dy]) => {
        insertBefore(mkEl('circle', { class: 'sess-dot', cx: dx, cy: dy, r: 3, fill: '#C9A96E', opacity: '0.55' }));
      });
      return;
    }
    const verts = _sessPolygonVerts(n);
    const pts = verts.map(v => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');
    insertBefore(mkEl('polygon', { class: 'sess-path', points: pts, stroke: '#C9A96E', 'stroke-width': '1.5', fill: 'none' }));
    verts.forEach(v => {
      insertBefore(mkEl('circle', { class: 'sess-dot', cx: v.x.toFixed(1), cy: v.y.toFixed(1), r: 3, fill: '#C9A96E', opacity: '0.55' }));
    });
  }

  function _sessPlaceOrb(t) {
    const orb = document.getElementById('sessOrb');
    if (!orb) return;
    const pos = _sessOrbPos(_sess.pathShape, _sess.phases, _sess.phaseIdx, t);
    orb.setAttribute('cx', pos.x.toFixed(2));
    orb.setAttribute('cy', pos.y.toFixed(2));
  }

  function _sessVertexPulse() {
    const orb = document.getElementById('sessOrb');
    if (!orb) return;
    orb.setAttribute('r', '8');
    setTimeout(() => { if (orb) orb.setAttribute('r', '5'); }, 180);
  }

  function _sessUpdatePhaseLabel() {
    document.querySelectorAll('#sessPhaseStack .sess-phase-item').forEach((el, i) => {
      el.classList.toggle('active', i === _sess.phaseIdx);
    });
  }

  function _sessUpdateCycleCount() {
    const el = document.getElementById('sessionCycleCount');
    if (!el) return;
    el.textContent = _sess.loopCount === null
      ? `Cycle ${_sess.currentLoop}`
      : `Cycle ${_sess.currentLoop} of ${_sess.loopCount}`;
  }

  function _sessTick(now) {
    if (!_sess.running || _sess.paused) return;
    if (_sess.phaseStart === null) _sess.phaseStart = now;

    const phaseDurMs = _sess.phases[_sess.phaseIdx].dur * 1000;
    const elapsed = now - _sess.phaseStart;
    const t = Math.min(elapsed / phaseDurMs, 1);

    _sessPlaceOrb(t);

    if (t >= 1) {
      _sessVertexPulse();
      const nextIdx = (_sess.phaseIdx + 1) % _sess.phases.length;
      const isLoopEnd = nextIdx === 0;
      if (isLoopEnd) {
        if (_sess.loopCount !== null && _sess.currentLoop >= _sess.loopCount) {
          _sessComplete(); return;
        }
        _sess.currentLoop++;
        _sessUpdateCycleCount();
      }
      _sessClearHoldCount();
      _sess.phaseIdx = nextIdx;
      _sess.phaseStart = now;
      _sessUpdatePhaseLabel();
      const _newPhase = _sess.phases[nextIdx];
      speakPhase(_newPhase.label);
      if (_newPhase.type === 'HOLD') _sessStartHoldCount(_newPhase.dur);
    }
    _sess.raf = requestAnimationFrame(_sessTick);
  }

  function _sessStop() {
    _sess.running = false;
    _sess.paused = false;
    _sess.countdown = false;
    if (_sess.raf) { cancelAnimationFrame(_sess.raf); _sess.raf = null; }
    _sessClearHoldCount();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function _sessComplete() {
    _sessStop();
    speakPhase('Session complete. Well done.');
    const totalMs = performance.now() - _sess.sessionStart;
    const totalMin = Math.round(totalMs / 60000);
    const totalSec = Math.round(totalMs / 1000);

    const kind = TECHNIQUES.find(t => t.id === _sess.practiceId) ? 'technique' : 'meditation';
    store.sessions.unshift({
      id: 's_' + Date.now().toString(36),
      kind,
      practiceId: _sess.practiceId,
      practiceTitle: _sess.techniqueTitle,
      durationMin: Math.max(1, totalMin),
      ts: new Date().toISOString(),
    });
    updateStreakOnComplete();
    saveStore(store);
    checkAchievements();
    refreshStreakBadge();

    const timeStr = totalMin >= 1 ? `${totalMin} min` : `${totalSec} sec`;
    const cycles = _sess.loopCount === null ? _sess.currentLoop - 1 : _sess.loopCount;
    const scTechName = document.getElementById('sessionCompleteTechName');
    const scDuration = document.getElementById('sessionCompleteDuration');
    const scCycles   = document.getElementById('sessionCompleteCycles');
    const scLearnBtn = document.getElementById('sessionCompleteLearnBtn');
    if (scTechName) scTechName.textContent = (_sess.techniqueTitle || '').toUpperCase();
    if (scDuration)  scDuration.textContent  = `${timeStr} session`;
    if (scCycles)    scCycles.textContent    = `${cycles} Breathing Cycle${cycles !== 1 ? 's' : ''}`;
    if (scLearnBtn)  scLearnBtn.textContent  = 'Learn about ' + (_sess.techniqueTitle || 'this technique');

    document.getElementById('sessionView').classList.remove('active');
    document.getElementById('sessionComplete').classList.add('active');
  }

  function openSession(practiceId) {
    const item = findPractice(practiceId);
    const r = RHYTHMS[practiceId] || _SESS_DEFAULT_RHYTHM;
    const n = r.phases.length;
    _sess.practiceId = practiceId;
    _sess.techniqueTitle = item ? item.title : practiceId;
    _sess.phases = r.phases;
    _sess.pathShape = r.pathShape || (n <= 2 ? 'oval' : n === 3 ? 'triangle' : n === 4 ? 'diamond' : 'circle');
    _sess.loopCount = 5;

    document.getElementById('sessionView').classList.add('active');
    document.getElementById('sessionComplete').classList.remove('active');
    document.getElementById('sessionTechName').textContent = _sess.techniqueTitle;
    const pauseBtn = document.getElementById('sessionPauseBtn');
    pauseBtn.textContent = 'Pause';
    pauseBtn.classList.remove('paused');

    const audioBtn = document.getElementById('sessAudioBtn');
    const audioIcon = document.getElementById('sessAudioIcon');
    if (audioBtn) audioBtn.classList.toggle('active', _audioEnabled);
    if (audioIcon) audioIcon.textContent = _audioEnabled ? '🔊' : '🔇';

    _sessRenderPath();
    _sessRenderPhaseStack();
    _sessUpdateCycleCount();
    _sessPlaceOrb(0);

    document.getElementById('sessionOverlay').classList.add('active');
    _sessStartCountdown();
    track('session_started', { practice_id: practiceId });
  }

  function _sessRenderPhaseStack() {
    const el = document.getElementById('sessPhaseStack');
    if (!el) return;
    el.innerHTML = _sess.phases.map((p, i) =>
      `<div class="sess-phase-item${i === 0 ? ' active' : ''}" data-idx="${i}">${p.label}</div>`
    ).join('');
  }

  function _sessStartCountdown() {
    const cd = document.getElementById('sessCountdown');
    const digitEl = document.getElementById('sessCountdownDigit');
    if (!cd || !digitEl) { _sessLaunch(); return; }
    _sess.countdown = true;
    cd.style.display = 'flex';
    cd.style.opacity = '1';
    let n = 3;
    function tick() {
      if (!_sess.countdown) return;
      digitEl.textContent = n;
      speakPhase(String(n));
      digitEl.classList.remove('animating');
      void digitEl.offsetWidth;
      digitEl.classList.add('animating');
      n--;
      if (n > 0) {
        setTimeout(tick, 1000);
      } else {
        setTimeout(() => {
          if (!_sess.countdown) return;
          speakPhase('Begin');
          cd.style.transition = 'opacity 0.35s ease';
          cd.style.opacity = '0';
          setTimeout(() => {
            cd.style.display = 'none';
            cd.style.transition = '';
            _sessLaunch();
          }, 350);
        }, 1000);
      }
    }
    tick();
  }

  function _sessLaunch() {
    _sess.countdown = false;
    _sess.phaseIdx = 0;
    _sess.currentLoop = 1;
    _sess.phaseStart = null;
    _sess.running = true;
    _sess.paused = false;
    _sess.sessionStart = performance.now();

    _sessUpdateCycleCount();
    _sessUpdatePhaseLabel();
    _sessPlaceOrb(0);

    // Announce first phase after "Begin" finishes speaking (~450ms gap)
    const _p0 = _sess.phases[0];
    setTimeout(() => {
      speakPhase(_p0.label);
      if (_p0.type === 'HOLD') _sessStartHoldCount(_p0.dur);
    }, 450);

    // Show edit button for 3s then fade out
    const editBtn = document.getElementById('sessEditBtn');
    if (editBtn) {
      editBtn.style.display = 'flex';
      editBtn.style.opacity = '1';
      editBtn.style.transition = '';
      setTimeout(() => {
        if (editBtn) {
          editBtn.style.transition = 'opacity 1s ease';
          editBtn.style.opacity = '0';
          setTimeout(() => { if (editBtn) editBtn.style.display = 'none'; }, 1000);
        }
      }, 3000);
    }

    _sess.raf = requestAnimationFrame(_sessTick);
  }

  function sessionCancel() {
    _sessStop();
    const cd = document.getElementById('sessCountdown');
    if (cd) { cd.style.display = 'none'; cd.style.opacity = '1'; cd.style.transition = ''; }
    document.getElementById('sessionOverlay').classList.remove('active');
    document.getElementById('sessionView').classList.remove('active');
    document.getElementById('sessionComplete').classList.remove('active');
    sessionCloseSheet();
  }

  function sessionConfirmClose() {
    if (_sess.running || _sess.paused || _sess.countdown) {
      openQuitModal();
      return;
    }
    sessionCancel();
  }

  function openQuitModal() {
    document.getElementById('quitSessionModal').classList.add('active');
  }

  function closeQuitModal() {
    document.getElementById('quitSessionModal').classList.remove('active');
  }

  function sessionEditCycles() {
    const slider = document.getElementById('sessSheetSlider');
    const valEl  = document.getElementById('sessSheetVal');
    const infBtn = document.getElementById('sessSheetInfinite');
    const isInf  = _sess.loopCount === null;
    if (slider) slider.value = isInf ? 5 : (_sess.loopCount || 5);
    if (valEl)  valEl.textContent  = isInf ? '∞' : (slider ? slider.value : '5');
    if (infBtn) infBtn.classList.toggle('active', isInf);
    document.getElementById('sessSheetBackdrop').classList.add('active');
    document.getElementById('sessSheet').classList.add('active');
  }

  function sessionCloseSheet() {
    const bd = document.getElementById('sessSheetBackdrop');
    const sh = document.getElementById('sessSheet');
    if (bd) bd.classList.remove('active');
    if (sh) sh.classList.remove('active');
  }

  function sessionConfirmCycles() {
    const slider = document.getElementById('sessSheetSlider');
    const infBtn = document.getElementById('sessSheetInfinite');
    _sess.loopCount = (infBtn && infBtn.classList.contains('active'))
      ? null
      : (slider ? parseInt(slider.value) : 5);
    _sessUpdateCycleCount();
    sessionCloseSheet();
  }

  function sessSliderInput(val) {
    const infBtn = document.getElementById('sessSheetInfinite');
    if (infBtn) infBtn.classList.remove('active');
    const valEl = document.getElementById('sessSheetVal');
    if (valEl) valEl.textContent = val;
  }

  function sessToggleInfinite() {
    const infBtn = document.getElementById('sessSheetInfinite');
    const valEl  = document.getElementById('sessSheetVal');
    const slider = document.getElementById('sessSheetSlider');
    const on = !infBtn.classList.contains('active');
    infBtn.classList.toggle('active', on);
    if (valEl) valEl.textContent = on ? '∞' : (slider ? slider.value : '5');
  }

  function sessionTogglePause() {
    const btn = document.getElementById('sessionPauseBtn');
    if (_sess.paused) {
      _sess.paused = false;
      _sess.phaseStart = performance.now() - _sess.pausedElapsed;
      btn.textContent = 'Pause';
      btn.classList.remove('paused');
      _sess.raf = requestAnimationFrame(_sessTick);
    } else {
      _sess.pausedElapsed = _sess.phaseStart !== null ? performance.now() - _sess.phaseStart : 0;
      _sess.paused = true;
      if (_sess.raf) { cancelAnimationFrame(_sess.raf); _sess.raf = null; }
      _sessClearHoldCount();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      btn.textContent = 'Resume';
      btn.classList.add('paused');
    }
  }

  function sessionToggleAudio() {
    _audioEnabled = !_audioEnabled;
    localStorage.setItem('triad:audio', _audioEnabled ? '1' : '0');
    const btn = document.getElementById('sessAudioBtn');
    const icon = document.getElementById('sessAudioIcon');
    if (btn) btn.classList.toggle('active', _audioEnabled);
    if (icon) icon.textContent = _audioEnabled ? '🔊' : '🔇';
    if (!_audioEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function sessionReturn() {
    const practiceId = _sess.practiceId;
    _sessStop();
    document.getElementById('sessionOverlay').classList.remove('active');
    const item = findPractice(practiceId);
    if (item) {
      const kind = TECHNIQUES.find(t => t.id === practiceId) ? 'technique' : 'meditation';
      if (kind === 'technique' && state.techniqueId === practiceId) {
        renderDetail(item, 'techniques-detail', 'technique');
      } else if (kind === 'meditation' && state.meditationId === practiceId) {
        renderDetail(item, 'meditate-detail', 'meditation');
      }
    }
  }

  /* ════════════════════════════════════════════════ */

  function addToPlan(practiceId) {
    if (!requirePro()) return;
    const item = findPractice(practiceId);
    if (!item) return;
    store.planAdditions = store.planAdditions || [];
    // Don't duplicate same-day additions
    const today = todayKey();
    const alreadyToday = store.planAdditions.some(p => p.practiceId === practiceId && tsKey(p.addedAt) === today);
    if (!alreadyToday) {
      const kind = TECHNIQUES.find(t => t.id === practiceId) ? 'technique' : 'meditation';
      store.planAdditions.unshift({
        practiceId,
        practiceTitle: item.title,
        kind,
        addedAt: new Date().toISOString()
      });
      saveStore(store);
    }
    showToast({ icon: '🙏', label: alreadyToday ? 'Already in your plan' : 'Added to your plan', autohide: 2400 });
  }

  /* ─── Slug helper + library navigation ─── */
  function slug(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Navigate into the new library tabbed/detail view. Called from related cards on technique/meditation pages.
  function openLibraryEntry(kind, slugId) {
    track('library_item_opened', { type: kind, id: slugId });
    transitionTo(() => {
      // keepDetail prevents navigate() from clearing the detail we're about to set
      navigate('library', { keepDetail: true });
      if (kind === 'person') {
        store.openedPerson = (store.openedPerson || 0) + 1;
        saveStore(store); checkAchievements();
        const item = LIBRARY.people.find(p => slug(p.name) === slugId);
        if (item) { showPersonDetail(item); return; }
        switchLibraryTab('people');
      } else if (kind === 'book') {
        store.openedBook = (store.openedBook || 0) + 1;
        saveStore(store); checkAchievements();
        const item = LIBRARY.books.find(b => slug(b.title) === slugId);
        if (item) { showBookDetail(item); return; }
        switchLibraryTab('books');
      }
    });
  }

  // Backwards-compatible alias for legacy callers
  function highlightLibraryEntry(slugId) {
    // Try book first, then person
    const book = LIBRARY.books.find(b => slug(b.title) === slugId);
    if (book) { showBookDetail(book); return; }
    const person = LIBRARY.people.find(p => slug(p.name) === slugId);
    if (person) { showPersonDetail(person); return; }
  }

  function alreadyCompletedToday(practiceId) {
    const today = todayKey();
    return store.sessions.some(s => s.practiceId === practiceId && tsKey(s.ts) === today);
  }

  function showTechniqueDetail(id) {
    const item = TECHNIQUES.find(t => t.id === id);
    if (!item) return;
    transitionTo(() => {
      _navPush(hideTechniqueDetail);
      _setBackLabel('Back to Breathwork');
      state.techniqueId = id;
      state.askContext = { kind: 'technique', id, item };
      document.getElementById('techniques-list').style.display = 'none';
      const detail = document.getElementById('techniques-detail');
      renderDetail(item, 'techniques-detail', 'technique');
      detail.classList.add('active');
      updateFab();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      track('technique_opened', { practice_id: item.id, title: item.title });
    });
  }

  function hideTechniqueDetail() {
    _navClear();
    state.techniqueId = null;
    if (state.askContext?.kind === 'technique') state.askContext = null;
    document.getElementById('techniques-list').style.display = '';
    document.getElementById('techniques-detail').classList.remove('active');
    updateFab();
  }

  function showMeditationDetail(id) {
    const item = MEDITATIONS.find(m => m.id === id);
    if (!item) return;
    transitionTo(() => {
      _navPush(hideMeditationDetail);
      _setBackLabel('Back to Meditations');
      state.meditationId = id;
      state.askContext = { kind: 'meditation', id, item };
      document.getElementById('meditate-list').style.display = 'none';
      const detail = document.getElementById('meditate-detail');
      renderDetail(item, 'meditate-detail', 'meditation');
      detail.classList.add('active');
      updateFab();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      track('meditation_opened', { practice_id: item.id, title: item.title });
    });
  }

  function hideMeditationDetail() {
    _navClear();
    state.meditationId = null;
    if (state.askContext?.kind === 'meditation') state.askContext = null;
    document.getElementById('meditate-list').style.display = '';
    document.getElementById('meditate-detail').classList.remove('active');
    updateFab();
  }

  function updateFab() { /* no-op — action bar removed */ }

  /* ─── Magazine detail helpers ─── */
  function _firstSentence(text) {
    if (!text) return '';
    const m = (text || '').match(/^[^.!?]+[.!?]/);
    return m ? m[0] : text.substring(0, 130) + (text.length > 130 ? '…' : '');
  }
  function _applyHeroImage(imgEl, imgUrl) {
    if (!imgEl || !imgUrl) return;
    imgEl.onload = () => imgEl.classList.add('loaded');
    imgEl.src = imgUrl;
  }

  /* ════════════════ LIBRARY — tabbed, searchable, filterable ════════════════ */

  // UI state for the library view
  const libUiState = {
    tab: 'books',              // 'books' | 'people' | 'podcasts' | 'breathwork' | 'meditations'
    search: '',
    activeFilters: new Set(),  // theme strings from LIBRARY_THEMES
    detail: null,              // { kind, id, sourceTab } when a detail view is open
    page: { books: 1, people: 1, podcasts: 1, breathwork: 1, meditations: 1 },
    pageSize: 10
  };

  function initialsFromName(name) {
    const parts = (name || '')
      .replace(/\b(Dr|Mr|Mrs|Ms|Sir)\.?\s+/gi, '')
      .replace(/\./g, ' ')
      .split(/\s+/).filter(Boolean);
    if (!parts.length) return '··';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

