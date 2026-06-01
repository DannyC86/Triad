  const ACHIEVEMENTS = [
    /* ── Guest tier (11) ── */
    {
      id: 'first-breath', tier: 'guest', name: 'First Breath', icon: '🌬️',
      hint: 'Complete your first breathwork session.',
      test:     s => s.sessions.filter(x => x.kind === 'technique').length >= 1,
      progress: s => ({ current: s.sessions.filter(x => x.kind === 'technique').length, target: 1, label: 'breathwork session' })
    },
    {
      id: 'first-stillness', tier: 'guest', name: 'First Stillness', icon: '🧘',
      hint: 'Complete your first meditation session.',
      test:     s => s.sessions.filter(x => x.kind === 'meditation').length >= 1,
      progress: s => ({ current: s.sessions.filter(x => x.kind === 'meditation').length, target: 1, label: 'meditation session' })
    },
    {
      id: 'first-page', tier: 'guest', name: 'First Page', icon: '📖',
      hint: 'Open a book in the Knowledge hub.',
      test:     s => (s.openedBook || 0) >= 1,
      progress: s => ({ current: Math.min(s.openedBook || 0, 1), target: 1, label: 'book opened' })
    },
    {
      id: 'first-teacher', tier: 'guest', name: 'First Teacher', icon: '👤',
      hint: 'Open a person profile in Knowledge.',
      test:     s => (s.openedPerson || 0) >= 1,
      progress: s => ({ current: Math.min(s.openedPerson || 0, 1), target: 1, label: 'teacher opened' })
    },
    {
      id: 'first-listen', tier: 'guest', name: 'First Listen', icon: '🎙️',
      hint: 'Open a podcast in Knowledge.',
      test:     s => (s.openedPodcast || 0) >= 1,
      progress: s => ({ current: Math.min(s.openedPodcast || 0, 1), target: 1, label: 'podcast opened' })
    },
    {
      id: 'going-deeper', tier: 'guest', name: 'Going Deeper', icon: '🔬',
      hint: 'Explore breathwork in the Knowledge hub.',
      test:     s => (s.visitedBreathworkHub || 0) >= 1,
      progress: s => ({ current: Math.min(s.visitedBreathworkHub || 0, 1), target: 1, label: 'breathwork hub visit' })
    },
    {
      id: 'into-stillness', tier: 'guest', name: 'Into Stillness', icon: '🌊',
      hint: 'Explore meditations in the Knowledge hub.',
      test:     s => (s.visitedMeditationsHub || 0) >= 1,
      progress: s => ({ current: Math.min(s.visitedMeditationsHub || 0, 1), target: 1, label: 'meditations hub visit' })
    },
    {
      id: 'joined-triad', tier: 'guest', name: 'Joined Triad', icon: '✨',
      hint: 'Create a Triad account.',
      test:     s => (s.hasAccount || 0) >= 1,
      progress: s => ({ current: Math.min(s.hasAccount || 0, 1), target: 1, label: 'account created' })
    },
    {
      id: 'committed-breather', tier: 'guest', name: 'Committed Breather', icon: '💨',
      hint: 'Complete 5 breathwork sessions.',
      test:     s => s.sessions.filter(x => x.kind === 'technique').length >= 5,
      progress: s => ({ current: s.sessions.filter(x => x.kind === 'technique').length, target: 5, label: 'breathwork sessions' })
    },
    {
      id: 'committed-stillness', tier: 'guest', name: 'Committed to Stillness', icon: '🌿',
      hint: 'Complete 5 meditation sessions.',
      test:     s => s.sessions.filter(x => x.kind === 'meditation').length >= 5,
      progress: s => ({ current: s.sessions.filter(x => x.kind === 'meditation').length, target: 5, label: 'meditation sessions' })
    },
    {
      id: 'collector', tier: 'guest', name: 'Collector', icon: '🏛️',
      hint: 'Unlock all other guest achievements.',
      test:     s => ['first-breath','first-stillness','first-page','first-teacher','first-listen','going-deeper','into-stillness','joined-triad','committed-breather','committed-stillness'].every(id => !!s.achievements[id]),
      progress: s => {
        const ids = ['first-breath','first-stillness','first-page','first-teacher','first-listen','going-deeper','into-stillness','joined-triad','committed-breather','committed-stillness'];
        return { current: ids.filter(id => !!s.achievements[id]).length, target: 10, label: 'guest achievements' };
      }
    },

    /* ── Bonsai achievements ── */
    {
      id: 'bonsai-pot', tier: 'guest', name: 'First Pot', icon: '🪴',
      hint: 'Claim your bonsai pot after completing your first breath session.',
      test:     s => JSON.parse(localStorage.getItem('triad:bonsai') || '{}').hasPot === true,
      progress: s => ({
        current: JSON.parse(localStorage.getItem('triad:bonsai') || '{}').hasPot ? 1 : 0,
        target: 1, label: 'pot claimed'
      })
    },
    {
      id: 'bonsai-seeds', tier: 'guest', name: 'Starter Seeds', icon: '🌱',
      hint: 'Claim your starter seeds after completing your first meditation.',
      test:     s => JSON.parse(localStorage.getItem('triad:bonsai') || '{}').hasSeeds === true,
      progress: s => ({
        current: JSON.parse(localStorage.getItem('triad:bonsai') || '{}').hasSeeds ? 1 : 0,
        target: 1, label: 'seeds claimed'
      })
    },

    /* ── Practice achievement ── */
    {
      id: 'resonant-breather', tier: 'guest', name: 'Resonant Breather', icon: '〰️',
      hint: 'Complete 25 total Resonant Breathing breaths.',
      test:     s => (((s.breathwork || {})['resonant-breathing'] || {}).totalBreaths || 0) >= 25,
      progress: s => ({
        current: (((s.breathwork || {})['resonant-breathing'] || {}).totalBreaths || 0),
        target: 25, label: 'Resonant breaths'
      })
    },
    {
      id: 'exploring-breathwork', tier: 'guest', name: 'Exploring Breathwork & Meditation', icon: '📜',
      hint: 'View the history behind a practice in the Knowledge hub.',
      test:     s => (s.viewedKnowledgeHistory || 0) >= 1,
      progress: s => ({ current: Math.min(s.viewedKnowledgeHistory || 0, 1), target: 1, label: 'history viewed' })
    },
  ];
