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

    /* ── Pro tier (10) ── */
    {
      id: 'deep-diver', tier: 'pro', name: 'Deep Diver', icon: '🧘',
      hint: 'Complete every breathing technique.',
      test:     s => { const c = _completedPracticeIds(s); return TECHNIQUES.every(t => c.has(t.id)); },
      progress: s => { const c = _completedPracticeIds(s); const done = TECHNIQUES.filter(t => c.has(t.id)).length;
                       return { current: done, target: TECHNIQUES.length, label: 'techniques' }; }
    },
    {
      id: 'flow-state', tier: 'pro', name: 'Flow State', icon: '🌊',
      hint: 'Complete 10 sessions in 30 days.',
      test:     s => _sessionsInLastDays(s, 30) >= 10,
      progress: s => ({ current: _sessionsInLastDays(s, 30), target: 10, label: 'sessions this month' })
    },
    {
      id: 'summit', tier: 'pro', name: 'Summit', icon: '🏔️',
      hint: 'Complete a 30-day plan.',
      test:     s => _planFinished(s, 30),
      progress: s => {
        if (!s.plan) return { current: 0, target: 30, label: 'days into a plan' };
        const elapsed = Math.floor((Date.now() - new Date(s.plan.startDate).getTime()) / 86400000);
        return { current: Math.min(elapsed, 30), target: 30, label: 'days into a plan' };
      }
    },
    {
      id: 'ancient', tier: 'pro', name: 'Ancient', icon: '🌿',
      hint: 'Complete every pranayama practice.',
      test:     s => { const c = _completedPracticeIds(s); return PRANAYAMA_IDS.every(id => c.has(id)); },
      progress: s => { const c = _completedPracticeIds(s); const done = PRANAYAMA_IDS.filter(id => c.has(id)).length;
                       return { current: done, target: PRANAYAMA_IDS.length, label: 'pranayama practices' }; }
    },
    {
      id: 'modern', tier: 'pro', name: 'Modern', icon: '⚡',
      hint: 'Complete every Huberman-popularised practice.',
      test:     s => { const c = _completedPracticeIds(s); return MODERN_IDS.every(id => c.has(id)); },
      progress: s => { const c = _completedPracticeIds(s); const done = MODERN_IDS.filter(id => c.has(id)).length;
                       return { current: done, target: MODERN_IDS.length, label: 'modern practices' }; }
    },
    {
      id: 'ice-fire', tier: 'pro', name: 'Ice & Fire', icon: '❄️',
      hint: 'Complete a Wim Hof Method session.',
      test:     s => (s.sessions || []).some(x => x.practiceId === 'wim-hof-method'),
      progress: s => ({ current: (s.sessions || []).some(x => x.practiceId === 'wim-hof-method') ? 1 : 0,
                        target: 1, label: 'Wim Hof session' })
    },
    {
      id: 'night-owl', tier: 'pro', name: 'Night Owl', icon: '🌙',
      hint: 'Complete 5 evening sessions (after 6pm).',
      test:     s => (s.sessions || []).filter(_isEvening).length >= 5,
      progress: s => ({ current: (s.sessions || []).filter(_isEvening).length, target: 5, label: 'evening sessions' })
    },
    {
      id: 'early-bird', tier: 'pro', name: 'Early Bird', icon: '🌅',
      hint: 'Complete 5 morning sessions (before 11am).',
      test:     s => (s.sessions || []).filter(_isMorning).length >= 5,
      progress: s => ({ current: (s.sessions || []).filter(_isMorning).length, target: 5, label: 'morning sessions' })
    },
    {
      id: 'century', tier: 'pro', name: 'Century', icon: '💫',
      hint: 'Reach 100 total minutes practised.',
      test:     s => _totalMinutes(s) >= 100,
      progress: s => ({ current: _totalMinutes(s), target: 100, label: 'minutes practised' })
    },
    {
      id: 'devoted', tier: 'pro', name: 'Devoted', icon: '🙏',
      hint: 'Maintain a 30-day streak.',
      test:     s => _bestStreak(s) >= 30,
      progress: s => ({ current: _bestStreak(s), target: 30, label: 'day streak' })
    }
  ];
