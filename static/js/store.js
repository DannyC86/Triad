
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
