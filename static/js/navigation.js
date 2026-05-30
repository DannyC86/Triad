  /* ────── Navigation stack ────── */
  let _navStack = [];

  function _navPush(backFn) {
    _navStack.push(backFn);
    _updateStickyBack();
  }

  function _navBack() {
    const fn = _navStack.pop();
    _updateStickyBack();
    if (fn) fn();
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

  // Locked cards don't navigate — gently explain why instead.
  function lockedToast() {
    showToast({ icon: '🔒', label: 'This practice unlocks as you progress through Triad', autohide: 2600 });
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
      // Per-item `locked` flag (set on the card data) wins; otherwise fall back to level gating.
      const locked = (item.locked !== undefined) ? item.locked : level > 1;
      const click  = locked ? ` onclick="lockedToast()"` : ` onclick="${openFn}('${item.id}')"`;
      const aria   = locked ? ' aria-disabled="true"' : '';
      const dim    = locked ? ' style="opacity:0.5"' : '';
      const badge  = `<div class="card-level-badge lv-${level}">${locked ? _LOCK_ICON_SVG : ''}<span>Level ${level}</span></div>`;
      return `
      <button class="card${locked ? ' locked' : ''}"${aria}${click}${dim}>
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

        ${d.overview?.tldr ? `<p class="learn-tldr" style="border-left:3px solid var(--gold,#c9a24b);padding:10px 14px;margin:0 0 14px;background:rgba(201,162,75,0.08);border-radius:8px;font-weight:600;"><span style="opacity:0.7;font-size:0.72em;letter-spacing:0.08em;text-transform:uppercase;display:block;margin-bottom:2px;">TL;DR</span>${escapeHtml(d.overview.tldr)}</p>` : ''}

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

        ${d.science?.keyMechanisms?.length ? `
          <h3>Key mechanisms</h3>
          <ul class="learn-list">${d.science.keyMechanisms.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
        ` : ''}

        ${d.science?.research?.length ? `
          <h3>Research findings</h3>
          <ul class="learn-list">${d.science.research.map(r => typeof r === 'string'
            ? `<li>${escapeHtml(r)}</li>`
            : `<li>${r.url ? `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a>` : `<strong>${escapeHtml(r.title)}</strong>`}${r.finding ? ` — ${escapeHtml(r.finding)}` : ''}</li>`).join('')}</ul>
        ` : ''}

        ${d.quiz ? `
          <button type="button" class="level-quiz-btn" onclick="showToast({ icon: '🙏', label: 'Quiz coming soon — this will unlock in the next update', autohide: 3200 })" style="display:block;width:100%;margin-top:22px;padding:13px 16px;background:transparent;border:1.5px solid var(--gold,#c9a24b);color:var(--gold,#c9a24b);border-radius:12px;font-weight:600;font-size:0.95rem;letter-spacing:0.02em;cursor:pointer;">Level 1 Quiz</button>
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

  // Entry point: techniques with a `phases` array go to the curve pacer;
  // everything else uses the existing session engine.
  // Wired here at navigation.js (was line 603) — the "Start session" button in
  // renderRichDetail calls openStartSession(practiceId).
  function openStartSession(practiceId) {
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

  /* ─── Breath Pacer — curve-based ─── */

  // SVG coordinate space (viewBox="0 0 500 200")
  const _PACER_SVG_W = 500;
  const _PACER_YTOP  = 20;   // y when lungs full (top of curve)
  const _PACER_YBOT  = 180;  // y when lungs empty (bottom of curve)

  let _pacerState = {
    phases: [],
    running: false,
    raf: null,
    breathCount: 1,
    totalMs: 0,   // accumulated ms played (pauses excluded)
    cycleMs: 0,   // accumulated ms in current breath cycle
    lastTs: null, // rAF timestamp of last frame; null when paused
    pathLen: 0,   // total SVG path length (set after first paint)
  };

  // Generates an SVG polyline path from a phases array.
  // Cosine ease on inhale/exhale produces the smooth S-curve shape.
  // Phase widths are proportional to their `sec` value — so a 9s exhale
  // is physically much wider than a 2s inhale: the visual matches the timing.
  function _pacerBuildPath(phases) {
    const totalSec = phases.reduce((s, p) => s + p.sec, 0);
    if (!totalSec) return `M 0 ${_PACER_YBOT}`;
    const W = _PACER_SVG_W, YTOP = _PACER_YTOP, YBOT = _PACER_YBOT;
    const SAMPLES = 32; // points per phase — enough for a visually smooth curve
    const pts = [];
    let xOff = 0;
    phases.forEach((phase) => {
      const phaseW = (phase.sec / totalSec) * W;
      let yS, yE;
      if      (phase.type === 'inhale')    { yS = YBOT; yE = YTOP; }
      else if (phase.type === 'exhale')    { yS = YTOP; yE = YBOT; }
      else if (phase.type === 'holdFull')  { yS = YTOP; yE = YTOP; }
      else /* holdEmpty */                 { yS = YBOT; yE = YBOT; }
      // Skip i=0 for subsequent phases to avoid duplicate junction points
      const iStart = pts.length === 0 ? 0 : 1;
      for (let i = iStart; i <= SAMPLES; i++) {
        const t    = i / SAMPLES;
        const ease = 0.5 - 0.5 * Math.cos(t * Math.PI); // cosine ease 0→1
        pts.push({ x: xOff + t * phaseW, y: yS + (yE - yS) * ease });
      }
      xOff += phaseW;
    });
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
    return d;
  }

  function openPacer(practiceId) {
    const overlay = document.getElementById('pacerOverlay');
    if (!overlay) return;

    // Reset all playback state
    _pacerState.running = false;
    if (_pacerState.raf) { cancelAnimationFrame(_pacerState.raf); _pacerState.raf = null; }
    _pacerState.breathCount = 1;
    _pacerState.totalMs = 0;
    _pacerState.cycleMs = 0;
    _pacerState.lastTs  = null;
    _pacerState.pathLen = 0;

    const item = practiceId ? findPractice(practiceId) : null;
    _pacerState.phases = (item && item.phases && item.phases.length)
      ? item.phases
      : [{ type: 'inhale', sec: 5 }, { type: 'exhale', sec: 5 }];

    // Build curve path and apply to both guide (dim, always visible) and trail
    const d = _pacerBuildPath(_pacerState.phases);
    const guide = document.getElementById('pacerGuide');
    const trail = document.getElementById('pacerTrail');
    if (guide) guide.setAttribute('d', d);
    if (trail) trail.setAttribute('d', d);

    // Technique labels below the panel
    const nameEl = document.getElementById('pacerTechName');
    const tierEl = document.getElementById('pacerTechTier');
    if (nameEl) nameEl.textContent = item && item.title ? item.title.toUpperCase() : 'RESONANT BREATHING';
    if (tierEl) tierEl.textContent = item && item.tier  ? item.tier.toUpperCase()  : '';

    // Reset stats and button
    _pacerUpdateBreath(1);
    _pacerUpdateTime(0);
    const btn = document.getElementById('pacerBreatheBtn');
    if (btn) btn.textContent = 'and Breathe';

    overlay.classList.add('active');

    // Measure path length after first paint so getTotalLength() sees the live DOM,
    // then hide the trail and rest the orb at the path start.
    requestAnimationFrame(() => {
      if (trail && trail.getTotalLength) {
        _pacerState.pathLen = trail.getTotalLength();
        trail.setAttribute('stroke-dasharray',  `${_pacerState.pathLen} ${_pacerState.pathLen}`);
        trail.setAttribute('stroke-dashoffset', String(_pacerState.pathLen)); // fully hidden
      }
      _pacerMoveOrb(0); // orb sits at start (bottom-left)
    });
  }

  // Moves the orb to `progress` ∈ [0,1] along the path and reveals the trail.
  function _pacerMoveOrb(progress) {
    const trail = document.getElementById('pacerTrail');
    const orb   = document.getElementById('pacerOrb');
    if (!trail || !orb || !_pacerState.pathLen) return;
    const dist = progress * _pacerState.pathLen;
    // Reveal: dashoffset = L*(1-p) so at p=0 → L (hidden), at p=1 → 0 (full)
    trail.setAttribute('stroke-dashoffset', String(_pacerState.pathLen - dist));
    const pt = trail.getPointAtLength(dist);
    orb.setAttribute('cx', pt.x.toFixed(2));
    orb.setAttribute('cy', pt.y.toFixed(2));
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

  function _pacerTick(now) {
    if (!_pacerState.running) return;
    if (_pacerState.lastTs !== null) {
      const dt = now - _pacerState.lastTs;
      _pacerState.totalMs += dt;
      _pacerState.cycleMs += dt;
    }
    _pacerState.lastTs = now;

    const totalSec    = _pacerState.phases.reduce((s, p) => s + p.sec, 0);
    const cycleDurMs  = totalSec * 1000;

    // Carry any overshoot into the next cycle and increment BREATH
    while (_pacerState.cycleMs >= cycleDurMs) {
      _pacerState.cycleMs -= cycleDurMs;
      _pacerState.breathCount++;
      _pacerUpdateBreath(_pacerState.breathCount);
    }

    const progress = cycleDurMs > 0 ? _pacerState.cycleMs / cycleDurMs : 0;
    _pacerMoveOrb(progress);
    _pacerUpdateTime(_pacerState.totalMs / 1000);
    _pacerState.raf = requestAnimationFrame(_pacerTick);
  }

  function closePacer() {
    _pacerState.running = false;
    if (_pacerState.raf) { cancelAnimationFrame(_pacerState.raf); _pacerState.raf = null; }
    _pacerState.lastTs = null;
    const overlay = document.getElementById('pacerOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  function togglePacer() {
    if (_pacerState.running) {
      // Pause — freeze orb and timer by stopping the rAF loop
      _pacerState.running = false;
      if (_pacerState.raf) { cancelAnimationFrame(_pacerState.raf); _pacerState.raf = null; }
      _pacerState.lastTs = null; // reset so next play frame has dt=0
      const btn = document.getElementById('pacerBreatheBtn');
      if (btn) btn.textContent = 'and Breathe';
    } else {
      // Play
      _pacerState.running = true;
      const btn = document.getElementById('pacerBreatheBtn');
      if (btn) btn.textContent = 'Pause';
      _pacerState.raf = requestAnimationFrame(_pacerTick);
    }
  }

