
  /* ════════════════ MASTERY PROGRESSION ENGINE ════════════════ */

  function pointsForLevel(n) {
    return Math.round(Math.pow(n / 33, 2) * 100);
  }

  function calcLevel(points) {
    let level = 0;
    for (let n = 1; n <= 33; n++) {
      if (points >= pointsForLevel(n)) level = n;
      else break;
    }
    return Math.min(level, 33);
  }

  const RANKS = {
    body: [
      { from: 1,  to: 5,  name: 'Apprentice' },
      { from: 6,  to: 10, name: 'Adept' },
      { from: 11, to: 11, name: 'Ninja' },
      { from: 12, to: 15, name: 'Expert' },
      { from: 16, to: 20, name: 'Expert' },
      { from: 21, to: 21, name: 'Vagal Virtuoso' },
      { from: 22, to: 25, name: 'Master' },
      { from: 26, to: 30, name: 'Master' },
      { from: 31, to: 31, name: 'Titan' },
      { from: 32, to: 32, name: 'Grandmaster' },
      { from: 33, to: 33, name: 'Grandmaster' }
    ],
    mind: [
      { from: 1,  to: 5,  name: 'Apprentice' },
      { from: 6,  to: 10, name: 'Adept' },
      { from: 11, to: 11, name: 'Diver' },
      { from: 12, to: 15, name: 'Expert' },
      { from: 16, to: 20, name: 'Expert' },
      { from: 21, to: 21, name: 'Zen Mastermind' },
      { from: 22, to: 25, name: 'Master' },
      { from: 26, to: 30, name: 'Master' },
      { from: 31, to: 31, name: 'Illuminated' },
      { from: 32, to: 32, name: 'Grandmaster' },
      { from: 33, to: 33, name: 'Grandmaster' }
    ],
    spirit: [
      { from: 1,  to: 5,  name: 'Apprentice' },
      { from: 6,  to: 10, name: 'Adept' },
      { from: 11, to: 11, name: 'Weaver' },
      { from: 12, to: 15, name: 'Expert' },
      { from: 16, to: 20, name: 'Expert' },
      { from: 21, to: 21, name: 'The Sage' },
      { from: 22, to: 25, name: 'Master' },
      { from: 26, to: 30, name: 'Master' },
      { from: 31, to: 31, name: 'Oracle' },
      { from: 32, to: 32, name: 'Triad Luminary' },
      { from: 33, to: 33, name: 'Triad Luminary' }
    ]
  };

  function getRank(pillar, level) {
    if (level === 0) return 'Unranked';
    const ranks = RANKS[pillar];
    if (!ranks) return 'Unranked';
    for (const r of ranks) {
      if (level >= r.from && level <= r.to) return r.name;
    }
    return 'Unranked';
  }

  function calcPillarPoints(pillar) {
    const sessions = store.sessions || [];
    if (pillar === 'body')   return sessions.filter(s => s.kind === 'technique').length  * 1;
    if (pillar === 'mind')   return sessions.filter(s => s.kind === 'meditation').length * 0.5;
    if (pillar === 'spirit') return 0;
    return 0;
  }

  function calcTotalLevel() {
    const b = calcLevel(calcPillarPoints('body'));
    const m = calcLevel(calcPillarPoints('mind'));
    const s = calcLevel(calcPillarPoints('spirit'));
    return Math.min(Math.floor((b + m + s) / 3), 99);
  }

  function updateMastery() {
    if (!store.mastery) store.mastery = initStore().mastery;
    ['body', 'mind', 'spirit'].forEach(pillar => {
      const points = calcPillarPoints(pillar);
      const level  = calcLevel(points);
      const rank   = getRank(pillar, level);
      store.mastery[pillar] = { points, level, rank };
    });
    store.mastery.total = calcTotalLevel();
    saveStore(store);
  }

  function nextLevelInfo(pillar) {
    const points      = calcPillarPoints(pillar);
    const currentLevel = calcLevel(points);
    const nextLevel    = currentLevel + 1;
    if (nextLevel > 33) return null;
    const pointsNeeded = Math.max(0, pointsForLevel(nextLevel) - points);
    const pointsPerSession = pillar === 'body' ? 1 : pillar === 'mind' ? 0.5 : 0;
    const sessionsNeeded   = pointsPerSession > 0
      ? Math.ceil(pointsNeeded / pointsPerSession)
      : null;
    const nextRank = getRank(pillar, nextLevel);
    return { pointsNeeded: Math.round(pointsNeeded * 10) / 10, sessionsNeeded, nextRank, nextLevel };
  }

  /* ════════════════ END MASTERY ENGINE ════════════════ */

  let store = loadStore();
  updateMastery(); // seed mastery from any existing sessions on first load

  /* ════════════════ NAV ════════════════ */

