// v2.2.4 — rebuilt from 15 to 9 achievements
// Old IDs in existing stores are ignored harmlessly
  const ACHIEVEMENTS = [
    {
      id: 'first-breath',
      tier: 'guest',
      name: 'First Breath',
      icon: '🌬️',
      hint: 'Complete your first breathwork session.',
      test: s => s.sessions.filter(x => x.kind === 'technique').length >= 1,
      progress: s => ({
        current: Math.min(s.sessions.filter(x => x.kind === 'technique').length, 1),
        target: 1,
        label: 'breathwork session'
      })
    },
    {
      id: 'first-meditation',
      tier: 'guest',
      name: 'First Stillness',
      icon: '🧘',
      hint: 'Complete your first meditation session.',
      test: s => s.sessions.filter(x => x.kind === 'meditation').length >= 1,
      progress: s => ({
        current: Math.min(s.sessions.filter(x => x.kind === 'meditation').length, 1),
        target: 1,
        label: 'meditation session'
      })
    },
    {
      id: 'knowledge-breath',
      tier: 'guest',
      name: 'Curious Mind',
      icon: '📖',
      hint: 'Read about a breathwork technique you have completed.',
      test: s => !!s.achievements['knowledge-breath'],
      progress: s => ({
        current: s.achievements['knowledge-breath'] ? 1 : 0,
        target: 1,
        label: 'technique explored'
      })
    },
    {
      id: 'knowledge-meditation',
      tier: 'guest',
      name: 'Deeper Understanding',
      icon: '🔍',
      hint: 'Read about a meditation you have completed.',
      test: s => !!s.achievements['knowledge-meditation'],
      progress: s => ({
        current: s.achievements['knowledge-meditation'] ? 1 : 0,
        target: 1,
        label: 'meditation explored'
      })
    },
    {
      id: 'resonant-100',
      tier: 'guest',
      name: 'Resonant',
      icon: '💛',
      hint: 'Take 100 total breaths in Resonant Breathing.',
      test: s => {
        const total = s.sessions
          .filter(x => x.kind === 'technique' && x.practiceId === 'resonant-breathing')
          .reduce((sum, x) => sum + (x.cycles || 0), 0);
        return total >= 100;
      },
      progress: s => {
        const total = s.sessions
          .filter(x => x.kind === 'technique' && x.practiceId === 'resonant-breathing')
          .reduce((sum, x) => sum + (x.cycles || 0), 0);
        return { current: Math.min(total, 100), target: 100, label: 'resonant breaths' };
      }
    },
    {
      id: 'mindful-5mins',
      tier: 'guest',
      name: 'Five Minutes Present',
      icon: '⏱️',
      hint: 'Meditate for a total of 5 minutes with Mindfulness of Breath.',
      test: s => {
        const total = s.sessions
          .filter(x => x.kind === 'meditation' && x.practiceId === 'mindfulness-of-breath')
          .reduce((sum, x) => sum + (x.durationSecs || 0), 0);
        return total >= 300;
      },
      progress: s => {
        const total = s.sessions
          .filter(x => x.kind === 'meditation' && x.practiceId === 'mindfulness-of-breath')
          .reduce((sum, x) => sum + (x.durationSecs || 0), 0);
        return {
          current: Math.min(Math.floor(total / 60), 5),
          target: 5,
          label: 'minutes meditated'
        };
      }
    },
    {
      id: 'signed-up',
      tier: 'guest',
      name: 'Part of Triad',
      icon: '△',
      hint: 'Create your Triad account.',
      test: s => typeof auth !== 'undefined' && auth.loggedIn === true,
      progress: s => ({
        current: (typeof auth !== 'undefined' && auth.loggedIn) ? 1 : 0,
        target: 1,
        label: 'account created'
      })
    },
    {
      id: 'bonsai-planted',
      tier: 'guest',
      name: 'Green Fingers',
      icon: '🌱',
      hint: 'Plant your first bonsai seed.',
      test: s => {
        try {
          return JSON.parse(localStorage.getItem('triad:bonsai') || '{}').hasPot === true;
        } catch(e) { return false; }
      },
      progress: s => ({
        current: (() => {
          try { return JSON.parse(localStorage.getItem('triad:bonsai') || '{}').hasPot ? 1 : 0; }
          catch(e) { return 0; }
        })(),
        target: 1,
        label: 'bonsai planted'
      })
    },
    {
      id: 'first-book',
      tier: 'guest',
      name: 'First Page',
      icon: '📚',
      hint: 'Open a book in the library.',
      test: s => !!s.achievements['first-book'],
      progress: s => ({
        current: s.achievements['first-book'] ? 1 : 0,
        target: 1,
        label: 'book opened'
      })
    }
  ];
