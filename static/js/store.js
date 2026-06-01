
  /* ════════ TRIAD LOGO SVG ════════
     Sacred geometry mark — used in header, home, intro, and mastery page.
     Gold linear gradient (#B8922A → #F5D080 → #C9A96E), viewBox 0 0 200 200.
     Element classes: tl-outer, tl-tri, tl-vc (×3), tl-inner, tl-dot
     Intro animation CSS targets these classes scoped to #intro-svg-wrap. */
  const TRIAD_LOGO_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none"><defs><linearGradient id="triad-gold-grad" x1="100" y1="8" x2="100" y2="192" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#B8922A"/><stop offset="50%" stop-color="#F5D080"/><stop offset="100%" stop-color="#C9A96E"/></linearGradient></defs><circle class="tl-outer" cx="100" cy="100" r="92" stroke="url(#triad-gold-grad)" stroke-width="3.5"/><polygon class="tl-tri" points="100,28 162,136 38,136" stroke="url(#triad-gold-grad)" stroke-width="4"/><circle class="tl-vc" cx="100" cy="28" r="22" stroke="url(#triad-gold-grad)" stroke-width="1.5" opacity="0.3"/><circle class="tl-vc" cx="162" cy="136" r="22" stroke="url(#triad-gold-grad)" stroke-width="1.5" opacity="0.3"/><circle class="tl-vc" cx="38" cy="136" r="22" stroke="url(#triad-gold-grad)" stroke-width="1.5" opacity="0.3"/><circle class="tl-inner" cx="100" cy="100" r="10" stroke="url(#triad-gold-grad)" stroke-width="2"/><circle class="tl-dot" cx="100" cy="100" r="5" fill="url(#triad-gold-grad)"/></svg>`;

  let state = {
    section: 'home',
    techDetail: null,
    meditDetail: null,
    libDetail: null,
    libTab: 'books',
    libSearch: '',
    libFilters: [],
    libPage: 1,
    libPageSize: 10,
    askContext: null,
    askHistory: [],
    askLoading: false,
    planHistory: [],
    planLoading: false,
    planStep: 'form'
  };

  function initStore() {
    return {
      sessions: [],                          // [{id, kind:'technique'|'meditation', practiceId, practiceTitle, durationMin, ts}]
      streak: { current: 0, lastDate: null, longest: 0 },
      achievements: {},                      // {achievementId: ISO timestamp earned}
      plan: null,                            // {startDate ISO, totalDays, generatedAt ISO}
      readingList: {},                       // {bookTitle: 'reading' | 'read'}
      planAdditions: [],
      plansGenerated: 0,                     // count of plans ever generated
      tier: 'free',                          // 'free' | 'pro' — gates display of pro achievements
      openedBook: 0,
      openedPerson: 0,
      openedPodcast: 0,
      visitedBreathworkHub: 0,
      visitedMeditationsHub: 0,
      hasAccount: 0,
      missions: {},
      breathwork: {},     // { [techniqueId]: { totalBreaths, totalSessions, totalDuration } }
      meditation: {},     // { [meditationId]: { totalDuration } }
      unlockedLevel: 0,   // 0 = only appLevel:0 accessible; 2 = L1+L2; 3 = all
      mastery: {
        body:   { points: 0, level: 0, rank: 'Unranked' },
        mind:   { points: 0, level: 0, rank: 'Unranked' },
        spirit: { points: 0, level: 0, rank: 'Unranked' },
        total: 0
      }
    };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return initStore();
      const parsed = JSON.parse(raw);
      // Shallow-merge so older stored shapes don't break new fields
      const merged = Object.assign(initStore(), parsed);
      // Deep-merge the nested streak object so older stores without `longest` get the default
      merged.streak = Object.assign({ current: 0, lastDate: null, longest: 0 }, merged.streak || {});
      // Backfill longest from current if missing (so existing users don't lose their streak record)
      if (!merged.streak.longest && merged.streak.current) {
        merged.streak.longest = merged.streak.current;
      }
      // Deep-merge mastery so older stores without it get the default shape
      const defaultMastery = initStore().mastery;
      merged.mastery = Object.assign({}, defaultMastery, merged.mastery || {});
      ['body', 'mind', 'spirit'].forEach(p => {
        merged.mastery[p] = Object.assign({}, defaultMastery[p], (merged.mastery[p] || {}));
      });
      return merged;
    } catch (e) { return initStore(); }
  }

  function saveStore(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
