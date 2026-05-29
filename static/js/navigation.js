  let _lastHomeNav = 0;
  function homeNavigate(target) {
    const now = Date.now();
    if (now - _lastHomeNav < 400) return;
    _lastHomeNav = now;
    navigate(target);
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
    if (target === 'profile') renderProfile();
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
  function _practiceLocked(id) { return _practiceLevel(id) > 1; }

  function renderCardGrid(items, gridId, openFn) {
    const grid = document.getElementById(gridId);
    const sorted = [...items].sort((a, b) => {
      const ai = _CARD_ORDER_INDEX.has(a.id) ? _CARD_ORDER_INDEX.get(a.id) : 999;
      const bi = _CARD_ORDER_INDEX.has(b.id) ? _CARD_ORDER_INDEX.get(b.id) : 999;
      return ai - bi;
    });
    grid.innerHTML = sorted.map(item => {
      const level  = _practiceLevel(item.id);
      const locked = level > 1;
      const click  = locked ? '' : ` onclick="${openFn}('${item.id}')"`;
      const aria   = locked ? ' aria-disabled="true" tabindex="-1"' : '';
      const badge  = `<div class="card-level-badge lv-${level}">${locked ? _LOCK_ICON_SVG : ''}<span>Level ${level}</span></div>`;
      return `
      <button class="card${locked ? ' locked' : ''}"${aria}${click}>
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
    container.innerHTML = `
      <h1 class="detail-title">${escapeHtml(item.title)}</h1>
      <p class="detail-desc">${escapeHtml(item.desc)}</p>
      <div class="detail-meta">
        <span class="pill accent">${escapeHtml(item.bestFor)}</span>
        <span class="pill diff-${item.difficulty}">${item.difficulty}</span>
        <span class="pill">${escapeHtml(item.duration)}</span>
      </div>

      <div class="detail-section">
        <h3>How to practise</h3>
        <ol>${item.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
      </div>

      <div class="howto-start-wrap">
        <button class="action-btn primary" onclick="openStartSession('${item.id.replace(/'/g, "\\'")}')">
          <svg viewBox="0 0 24 24"><path d="M5 4l14 8-14 8z"/></svg>
          Start session
        </button>
      </div>

      <div class="detail-section">
        <h3>Why it works</h3>
        <ul>${item.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
      </div>

      ${item.cautions ? `
      <div class="detail-section">
        <h3>Cautions</h3>
        <div class="caution-box ${cautionClass(item.cautions)}">
          <strong>Practice safely</strong>
          ${escapeHtml(item.cautions)}
        </div>
      </div>` : ''}
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

  /* ─── Tabbed detail (used for both techniques and meditations) ─── */
  function renderRichDetail(item, containerId, kind) {
    const d = (kind === 'meditation' ? MEDITATION_DETAILS : TECHNIQUE_DETAILS)[item.id];
    const container = document.getElementById(containerId);
    const itemIdJs = item.id.replace(/'/g, "\\'");
    container.innerHTML = `
      <h1 class="detail-title">${escapeHtml(item.title)}</h1>
      <p class="detail-desc">${escapeHtml(item.desc)}</p>
      <div class="detail-meta">
        <span class="pill accent">${escapeHtml(item.bestFor)}</span>
        <span class="pill diff-${item.difficulty}">${item.difficulty}</span>
        <span class="pill">${escapeHtml(item.duration)}</span>
      </div>

      <!-- Tabs -->
      <div class="tabs" role="tablist">
        <button class="tab active" data-tab="howto"   onclick="switchTab(this, 'howto')">How To</button>
        <button class="tab"        data-tab="learn"   onclick="switchTab(this, 'learn')">Learn</button>
        <button class="tab"        data-tab="explore" onclick="switchTab(this, 'explore')">Explore</button>
      </div>

      <!-- Tab 1: HOW TO -->
      <div class="tab-panel active" data-panel="howto">
        <h3>The method, step by step</h3>
        <ul>${item.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>

        <div class="howto-start-wrap">
          <button class="action-btn primary" onclick="openStartSession('${itemIdJs}')">
            <svg viewBox="0 0 24 24"><path d="M5 4l14 8-14 8z"/></svg>
            Start session
          </button>
        </div>

        <h3>Tips</h3>
        <ul>${d.howTo.tips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>

        <h3>Beginner → advanced progression</h3>
        <div class="progressions">
          ${d.howTo.progressions.map(p => `
            <div class="progression">
              <div class="prog-level">${escapeHtml(p.level)}</div>
              <div class="prog-detail">${escapeHtml(p.detail)}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Tab 2: LEARN -->
      <div class="tab-panel" data-panel="learn">
        <h3>${kind === 'meditation' ? 'Meditation animation' : 'Breathing animation'}</h3>
        <div class="learn-animation">
          ${renderAnimation(d.learn?.animation || 'default')}
          <div class="learn-anim-caption">${escapeHtml(animationCaption(d.learn?.animation || 'default', item))}</div>
        </div>

        ${d.learn?.video ? `
          <h3>Verified demonstration</h3>
          <div class="yt-demo-card">
            <div class="yt-demo-top">
              <div class="yt-demo-icon">
                <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
              <div class="yt-demo-body">
                <span class="yt-demo-label">Verified demonstration</span>
                <span class="yt-demo-title">${escapeHtml(d.learn.video.title)}</span>
                <span class="yt-demo-teacher">${escapeHtml(d.learn.video.teacher)}</span>
              </div>
            </div>
            <a class="yt-demo-btn" href="https://www.youtube.com/watch?v=${encodeURIComponent(d.learn.video.youtubeId)}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Watch on YouTube
            </a>
          </div>
        ` : ''}

        ${d.overview?.what ? `<h3>Overview</h3><p class="learn-prose">${escapeHtml(d.overview.what)}</p>` : ''}

        ${d.overview?.keyBenefits?.length ? `
          <h3>Key benefits</h3>
          <ul class="learn-list">${d.overview.keyBenefits.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
        ` : ''}

        ${d.overview?.whenToUse?.length ? `
          <h3>When to use it</h3>
          <ul class="learn-list">${d.overview.whenToUse.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>
        ` : ''}

        ${d.overview?.whoFor ? `<h3>Who it's for</h3><p class="learn-prose">${escapeHtml(d.overview.whoFor)}</p>` : ''}

        ${d.history?.evolution ? `<h3>How it evolved</h3><p class="learn-prose">${escapeHtml(d.history.evolution)}</p>` : ''}

        ${d.history?.figures?.length ? `
          <h3>Key figures</h3>
          <ul class="learn-figures">${d.history.figures.map(f => `<li><span class="learn-figure-name">${escapeHtml(f.name)}</span> — ${escapeHtml(f.credit)}</li>`).join('')}</ul>
        ` : ''}

        ${d.history?.ancient ? `<h3>Connection to ancient practice</h3><p class="learn-prose">${escapeHtml(d.history.ancient)}</p>` : ''}

        ${(d.science?.physiology || d.science?.neuroscience) ? `
          <h3>What's happening in the body</h3>
          ${d.science.physiology ? `<p class="learn-prose">${escapeHtml(d.science.physiology)}</p>` : ''}
          ${d.science.neuroscience ? `<p class="learn-prose">${escapeHtml(d.science.neuroscience)}</p>` : ''}
        ` : ''}

        ${d.science?.tags?.length ? `
          <h3>Key mechanisms</h3>
          <div class="learn-tags">${d.science.tags.map(t => `<span class="learn-tag">${escapeHtml(t)}</span>`).join('')}</div>
        ` : ''}

        ${d.science?.research?.length ? `
          <h3>Research findings</h3>
          <ul class="learn-list">${d.science.research.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
        ` : ''}
      </div>

      <!-- Tab 3: EXPLORE -->
      <div class="tab-panel" data-panel="explore">
        <div class="explore-cta">
          <p class="explore-cta-heading">Go deeper</p>
          <button class="explore-cta-btn explore-btn-knowledge" onclick="openKnowledgeEntry('${kind}', '${itemIdJs}')">
            Explore the Knowledge
          </button>
          <button class="explore-cta-btn explore-btn-ask" onclick="openAskModal()">
            Ask an Expert
          </button>
        </div>

        ${d.product ? `
          <div class="practice-product">
            <p class="practice-product-kicker">Enhance your practice</p>
            <div class="practice-product-card">
              ${d.product.badge ? `<span class="practice-product-badge">${escapeHtml(d.product.badge)}</span>` : ''}
              <h4 class="practice-product-title">${escapeHtml(d.product.title)}</h4>
              <p class="practice-product-price">${escapeHtml(d.product.price)}</p>
              <p class="practice-product-desc">${escapeHtml(d.product.desc)}</p>
              <a class="practice-product-btn" href="${escapeHtml(d.product.url)}" target="_blank" rel="noopener noreferrer" onclick="track('practice_product_click',{practice_id:'${itemIdJs}',product:'${escapeJs(d.product.title)}'})">
                ${escapeHtml(d.product.ctaLabel || 'Buy on Amazon')}
              </a>
            </div>
          </div>
        ` : ''}
      </div>
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

  function openStartSession(practiceId) {
    openSession(practiceId);
  }
  function closeStartSession() {
    sessionCancel();
  }

  /* ─── Breath Pacer ─── */
  const _PACER_VERTS = [
    { x: 50, y: 14 },  // 0 = top = INHALE
    { x: 81, y: 68 },  // 1 = BR  = HOLD
    { x: 19, y: 68 },  // 2 = BL  = EXHALE
  ];
  const _PACER_PRESETS = {
    sigh: { phases: [
      { from: 2, to: 0, move: 2500, dwell: 800  },
      { from: 0, to: 1, move: 800,  dwell: 400  },
      { from: 1, to: 2, move: 7500, dwell: 0    },
    ]},
    '478': { phases: [
      { from: 2, to: 0, move: 4000, dwell: 7000 },
      { from: 0, to: 1, move: 500,  dwell: 0    },
      { from: 1, to: 2, move: 8000, dwell: 0    },
    ]},
    free: { phases: [
      { from: 2, to: 0, move: 4000, dwell: 0 },
      { from: 0, to: 2, move: 4000, dwell: 0 },
    ]}
  };
  let _pacerRunning  = false;
  let _pacerRaf      = null;
  let _pacerStart    = null;
  let _pacerPhaseIdx = 0;
  let _pacerPhaseStart = null;
  let _pacerPreset   = 'sigh';

  function openPacer(practiceId) {
    const overlay = document.getElementById('pacerOverlay');
    if (!overlay) return;
    _pacerStop();

    const item = practiceId ? findPractice(practiceId) : null;

    // Title
    const titleEl = document.getElementById('pacerTitle');
    if (titleEl) titleEl.textContent = item ? item.title : 'Breath Pacer';

    // Auto-select preset
    let preset = 'free';
    if (practiceId === 'physiological-sigh') preset = 'sigh';
    else if (practiceId === '4-7-8-breathing') preset = '478';
    _pacerSetPreset(preset, false);

    // Steps
    const stepsEl = document.getElementById('pacerStepsWrap');
    if (stepsEl && item && item.steps && item.steps.length) {
      stepsEl.innerHTML = item.steps.map((s, i) =>
        `<div style="margin-bottom:4px"><strong>${i + 1}.</strong> ${escapeHtml(s)}</div>`
      ).join('');
    } else if (stepsEl) {
      stepsEl.innerHTML = '';
    }

    overlay.classList.add('active');
  }

