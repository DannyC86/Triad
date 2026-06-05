  /* ════════════════ SYNC ENGINE ════════════════ */

  let _isOnline = navigator.onLine;
  window.addEventListener('online',  () => { _isOnline = true;  _setOfflinePill(false); flushSyncQueue(); });
  window.addEventListener('offline', () => { _isOnline = false; _setOfflinePill(true); });

  function _setOfflinePill(show) {
    document.getElementById('offline-pill')?.classList.toggle('visible', show);
  }

  let _syncQueue = JSON.parse(localStorage.getItem('triad:syncQueue') || '[]');

  function queueSync(action) {
    _syncQueue.push({ ...action, queuedAt: new Date().toISOString() });
    localStorage.setItem('triad:syncQueue', JSON.stringify(_syncQueue));
    if (_isOnline) flushSyncQueue();
  }

  async function flushSyncQueue() {
    if (!_syncQueue.length || !auth.loggedIn) return;
    const queue = [..._syncQueue];
    _syncQueue = [];
    localStorage.setItem('triad:syncQueue', '[]');
    for (const action of queue) {
      try {
        await sendToServer(action);
      } catch {
        _syncQueue.push(action);
      }
    }
    localStorage.setItem('triad:syncQueue', JSON.stringify(_syncQueue));
  }

  async function sendToServer(action) {
    const endpoints = {
      session:     '/user/session',
      achievement: '/user/achievement',
      reading:     '/user/reading',
      plan:        '/user/plan',
      preferences: '/user/preferences'
    };
    const url = endpoints[action.type];
    if (!url) return;
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(action.data)
    });
    if (!res.ok) throw new Error('Server error ' + res.status);
  }

  async function syncFromServer() {
    if (!auth.loggedIn || !_isOnline) return;
    try {
      const res = await fetch('/user/data', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();
      mergeServerData(data);
    } catch { /* silent fail — continue with local data */ }
  }

  function mergeServerData(serverData) {
    // Sessions — merge, deduplicate by ts + practiceId
    if (serverData.sessions && serverData.sessions.length) {
      const existing = new Set(
        (store.sessions || []).map(s => s.ts + '|' + s.practiceId)
      );
      const newSessions = serverData.sessions
        .filter(s => !existing.has(s.completed_at + '|' + s.practice_id))
        .map(s => ({
          id: 's_' + Math.random().toString(36).substr(2, 9),
          kind: s.kind,
          practiceId: s.practice_id,
          practiceTitle: s.practice_title,
          durationMin: s.duration_minutes,
          ts: s.completed_at
        }));
      store.sessions = [...(store.sessions || []), ...newSessions];
    }

    // Achievements — store.achievements is {id: timestamp}
    if (serverData.achievements && serverData.achievements.length) {
      store.achievements = store.achievements || {};
      serverData.achievements.forEach(a => {
        if (!store.achievements[a.achievement_id]) {
          store.achievements[a.achievement_id] = a.unlocked_at;
        }
      });
    }

    // Streaks — take the higher values
    if (serverData.streaks && serverData.streaks.user_id) {
      store.streak = store.streak || {};
      store.streak.current = Math.max(
        store.streak.current || 0, serverData.streaks.current_streak || 0
      );
      store.streak.longest = Math.max(
        store.streak.longest || 0, serverData.streaks.longest_streak || 0
      );
      if (serverData.streaks.last_session_date) {
        store.streak.lastDate = serverData.streaks.last_session_date;
      }
    }

    // Reading list — store.readingList is {bookTitle: 'read'|'unread'}
    if (serverData.reading_list && serverData.reading_list.length) {
      store.readingList = store.readingList || {};
      serverData.reading_list.forEach(r => {
        const book = LIBRARY.books.find(b => slug(b.title) === r.book_id);
        if (book && !store.readingList[book.title]) {
          store.readingList[book.title] = r.marked_read ? 'read' : 'unread';
        }
      });
    }

    // Plan — server wins if local is absent or server is newer
    if (serverData.plan && serverData.plan.plan_data) {
      try {
        const serverPlan = JSON.parse(serverData.plan.plan_data);
        if (!store.plan || serverData.plan.updated_at > (store.planUpdatedAt || '')) {
          store.plan = serverPlan;
          store.planUpdatedAt = serverData.plan.updated_at;
        }
      } catch { /* ignore malformed */ }
    }

    // Preferences — server wins
    if (serverData.preferences && serverData.preferences.updated_at) {
      if (serverData.preferences.theme) {
        const theme = serverData.preferences.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('triad:theme', theme);
        updateThemeToggle();
      }
      if (serverData.preferences.sound_enabled !== undefined) {
        _audioEnabled = !!serverData.preferences.sound_enabled;
      }
    }

    saveStore(store);
  }

  /* ─── Delete account ─── */
  function openDeleteAccountModal()  { document.getElementById('deleteAccountModal').classList.add('active'); }
  function closeDeleteAccountModal() { document.getElementById('deleteAccountModal').classList.remove('active'); }

  async function confirmDeleteAccount() {
    closeDeleteAccountModal();
    try {
      await fetch('/user/data', { method: 'DELETE', credentials: 'same-origin' });
      await fetch('/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch { /* continue regardless */ }
    // Wipe all local state
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem('triad:syncQueue');
    localStorage.removeItem('triad:theme');
    localStorage.removeItem('triad:audio');
    auth.loggedIn = false;
    auth.email = null;
    store = initStore();
    saveStore(store);
    updateAuthUi();
    navigate('home');
    showToast({ icon: '👋', label: 'Account deleted', autohide: 3000 });
  }

