  /* ════════════════ TRACKING ════════════════ */

  const _appSessionId = Math.random().toString(36).slice(2);

  function track(eventType, eventData = {}) {
    if (!auth.loggedIn) return;
    fetch('/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ event_type: eventType, event_data: eventData, session_id: _appSessionId })
    }).catch(() => {});
  }
