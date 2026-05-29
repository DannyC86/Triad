  /* ════════════════ AUTH (frontend layer) ════════════════ */

  // Single source of truth for auth state. Rehydrated from /auth/me on init.
  const auth = {
    loggedIn: false,
    email:    null,
    tier:     'free',
    ready:    false     // becomes true once /auth/me has resolved
  };

  // Track which tab the auth modal is on so submitAuth knows which endpoint to hit
  let _authTab = 'login';

  /* ─── Fetch current session from server ─── */
  async function fetchAuthState() {
    try {
      const res = await fetch('/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      if (data && data.user) {
        auth.loggedIn = true;
        auth.email    = data.user.email;
        auth.tier     = data.user.tier || 'free';
      } else {
        auth.loggedIn = false;
        auth.email    = null;
        auth.tier     = 'free';
      }
    } catch (e) {
      // Network error — fall back to guest. App still browses fine offline.
      auth.loggedIn = false;
      auth.email    = null;
      auth.tier     = 'free';
    }
    auth.ready = true;
    updateAuthUi();
    if (auth.loggedIn) {
      syncFromServer().then(() => flushSyncQueue());
      loadTriadProfile().then(() => {
        if (document.getElementById('profile')?.classList.contains('active')) {
          renderProfileHero();
        }
        renderHomeAuthFooter();
        updateAccountSectionTitle();
      });
    }
  }

  /* ─── Profile-icon click router ─── */
  function handleProfileIconClick() {
    if (auth.loggedIn) {
      navigate('profile');
    } else {
      openAuthModal();
    }
  }

  /* ─── Modal open/close + tab switching ─── */
  function openAuthModal(reason) {
    const reasonEl = document.getElementById('auth-reason');
    if (reasonEl) {
      if (reason) {
        reasonEl.textContent = reason;
        reasonEl.hidden = false;
      } else {
        reasonEl.hidden = true;
        reasonEl.textContent = '';
      }
    }
    // Default to login tab when opening fresh
    switchAuthTab(_authTab || 'login');
    const errEl = document.getElementById('auth-error');
    if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
    document.getElementById('authModal').classList.add('active');
    // Focus email field
    setTimeout(() => {
      const email = document.getElementById('auth-email');
      if (email) email.focus();
    }, 90);
  }

  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
    const errEl  = document.getElementById('auth-error');
    if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
    const submitBtn = document.getElementById('auth-submit');
    if (submitBtn) submitBtn.disabled = false;
    // Don't clear the email — many users will reopen and retry; do clear password for safety.
    const pw = document.getElementById('auth-password');
    if (pw) pw.value = '';
  }

  function switchAuthTab(tab) {
    _authTab = (tab === 'signup') ? 'signup' : 'login';
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === _authTab);
    });
    const submitBtn = document.getElementById('auth-submit');
    if (submitBtn) submitBtn.textContent = _authTab === 'signup' ? 'Create account' : 'Log in';
    const titleEl = document.getElementById('authModalTitle');
    if (titleEl) titleEl.textContent = _authTab === 'signup' ? 'Create your account' : 'Welcome back';
    const pw = document.getElementById('auth-password');
    if (pw) pw.autocomplete = _authTab === 'signup' ? 'new-password' : 'current-password';
    const errEl = document.getElementById('auth-error');
    if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
    // Show the "Free forever · Pro coming soon" tagline only on the Sign up tab
    const tagline = document.getElementById('auth-signup-tagline');
    if (tagline) tagline.hidden = _authTab !== 'signup';
    // Show "Forgot password?" only on login tab
    const forgotWrap = document.getElementById('auth-forgot-wrap');
    if (forgotWrap) forgotWrap.hidden = _authTab !== 'login';
  }

  /* ════════════════ FORGOT / RESET PASSWORD ════════════════ */

  function showForgotForm() {
    document.getElementById('auth-forgot-view').hidden = false;
    document.querySelector('.auth-form').hidden = true;
    document.querySelector('.auth-tabs').hidden = true;
    const wrap = document.getElementById('auth-forgot-wrap');
    if (wrap) wrap.hidden = true;
    const titleEl = document.getElementById('authModalTitle');
    if (titleEl) titleEl.textContent = 'Reset password';
    // Pre-fill email from login field
    setTimeout(() => {
      const inp = document.getElementById('forgot-email');
      if (inp) { inp.value = document.getElementById('auth-email')?.value || ''; inp.focus(); }
    }, 50);
  }

  function hideForgotForm() {
    document.getElementById('auth-forgot-view').hidden = true;
    const errEl = document.getElementById('forgot-error');
    if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
    const successEl = document.getElementById('forgot-success');
    if (successEl) { successEl.hidden = true; successEl.innerHTML = ''; }
    const btn = document.getElementById('forgot-submit');
    if (btn) { btn.hidden = false; btn.disabled = false; btn.textContent = 'Send reset link'; }
    document.querySelector('.auth-form').hidden = false;
    document.querySelector('.auth-tabs').hidden = false;
    switchAuthTab('login');
  }

  async function submitForgotPassword() {
    const email = (document.getElementById('forgot-email')?.value || '').trim();
    const errEl = document.getElementById('forgot-error');
    const successEl = document.getElementById('forgot-success');
    const btn = document.getElementById('forgot-submit');
    errEl.hidden = true; errEl.textContent = '';
    successEl.hidden = true; successEl.innerHTML = '';
    if (!email) { errEl.textContent = 'Please enter your email address.'; errEl.hidden = false; return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        if (data.reset_url) {
          successEl.innerHTML = 'Reset link ready: <a href="' + escapeHtml(data.reset_url) + '" style="color:var(--accent)">Click here to set a new password</a>';
        } else {
          successEl.textContent = 'If that email is registered, check your inbox for instructions.';
        }
        successEl.hidden = false;
        btn.hidden = true;
      } else {
        errEl.textContent = data.error || 'Something went wrong.';
        errEl.hidden = false;
        btn.disabled = false; btn.textContent = 'Send reset link';
      }
    } catch (e) {
      errEl.textContent = 'Network error — please try again.';
      errEl.hidden = false;
      btn.disabled = false; btn.textContent = 'Send reset link';
    }
  }

  async function submitResetPassword() {
    const newPw = document.getElementById('reset-new-password')?.value || '';
    const confirmPw = document.getElementById('reset-confirm-password')?.value || '';
    const errEl = document.getElementById('reset-error');
    const successEl = document.getElementById('reset-success');
    const btn = document.getElementById('reset-submit');
    errEl.hidden = true; errEl.textContent = '';
    successEl.hidden = true; successEl.textContent = '';
    if (newPw.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; errEl.hidden = false; return; }
    if (newPw !== confirmPw) { errEl.textContent = 'Passwords do not match.'; errEl.hidden = false; return; }
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { errEl.textContent = 'Invalid reset link.'; errEl.hidden = false; return; }
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPw })
      });
      const data = await res.json();
      if (data.success) {
        successEl.textContent = 'Password updated. You can now log in with your new password.';
        successEl.hidden = false;
        btn.hidden = true;
        document.getElementById('reset-new-password').value = '';
        document.getElementById('reset-confirm-password').value = '';
        history.replaceState({}, '', window.location.pathname);
        setTimeout(() => {
          document.getElementById('auth-reset-view').hidden = true;
          document.querySelector('.auth-form').hidden = false;
          document.querySelector('.auth-tabs').hidden = false;
          switchAuthTab('login');
        }, 2500);
      } else {
        errEl.textContent = data.error || 'Something went wrong.';
        errEl.hidden = false;
        btn.disabled = false; btn.textContent = 'Set new password';
      }
    } catch (e) {
      errEl.textContent = 'Network error — please try again.';
      errEl.hidden = false;
      btn.disabled = false; btn.textContent = 'Set new password';
    }
  }

  /* ════════════════ WAITLIST (Pro upgrade placeholder) ════════════════ */

  const WAITLIST_KEY = 'triad:waitlist';

  function openWaitlistModal() {
    // Reset state in case it was previously shown
    const body = document.getElementById('waitlistModalBody');
    const stored = _loadWaitlist();
    if (stored && stored.email) {
      _renderWaitlistAlreadyJoined(stored);
    } else {
      _renderWaitlistForm();
    }
    document.getElementById('waitlistModal').classList.add('active');
    setTimeout(() => {
      const inp = document.getElementById('waitlist-email');
      if (inp) inp.focus();
    }, 90);
  }

  function closeWaitlistModal() {
    document.getElementById('waitlistModal').classList.remove('active');
  }

  function _renderWaitlistForm() {
    const body = document.getElementById('waitlistModalBody');
    if (!body) return;
    body.innerHTML = `
      <div class="waitlist-icon">✨</div>
      <p class="waitlist-blurb">
        Pro is on the way — guided sessions, advanced AI plans, and unlocked achievements.
        Drop your email and we'll let you know first.
      </p>
      <form class="auth-form" onsubmit="submitWaitlistEmail(event)" novalidate>
        <label class="auth-field">
          <span class="auth-field-label">Email</span>
          <input type="email" id="waitlist-email" autocomplete="email" placeholder="you@example.com" required />
        </label>
        <div class="auth-error" id="waitlist-error" hidden></div>
        <button type="submit" class="auth-submit" id="waitlist-submit">Notify me</button>
      </form>
      <p class="waitlist-foot">£4.99/month · cancel anytime · no charge until launch.</p>
    `;
    // Pre-fill with the user's account email if they're logged in
    if (auth.loggedIn && auth.email) {
      const inp = document.getElementById('waitlist-email');
      if (inp) inp.value = auth.email;
    }
  }

  function _renderWaitlistAlreadyJoined(stored) {
    const body = document.getElementById('waitlistModalBody');
    if (!body) return;
    const when = stored.joinedAt ? formatRelative(stored.joinedAt) : 'recently';
    body.innerHTML = `
      <div class="waitlist-success">
        <div class="waitlist-success-icon">🙏</div>
        <h3>You're on the list</h3>
        <p>
          We've got <strong style="color: var(--gold)">${escapeHtml(stored.email)}</strong>.
          We'll be in touch when Pro launches — added ${escapeHtml(when)}.
        </p>
      </div>
      <p class="waitlist-foot" style="margin-top: 22px;">
        <a class="auth-skip" onclick="_resetWaitlist()">Use a different email</a>
      </p>
    `;
  }

  function _resetWaitlist() {
    try { localStorage.removeItem(WAITLIST_KEY); } catch (e) {}
    _renderWaitlistForm();
  }

  function _loadWaitlist() {
    try {
      const raw = localStorage.getItem(WAITLIST_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function submitWaitlistEmail(event) {
    if (event && event.preventDefault) event.preventDefault();
    const inp = document.getElementById('waitlist-email');
    const errEl = document.getElementById('waitlist-error');
    const submitBtn = document.getElementById('waitlist-submit');
    const email = (inp.value || '').trim();

    if (!email.includes('@') || !email.includes('.')) {
      errEl.textContent = 'Please enter a valid email.';
      errEl.hidden = false;
      return;
    }
    errEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';

    try {
      const record = { email, joinedAt: new Date().toISOString() };
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(record));
      _renderWaitlistAlreadyJoined(record);
      showToast({ icon: '✨', label: 'Added to the Pro waitlist', autohide: 2400 });
    } catch (e) {
      errEl.textContent = 'Could not save — check that localStorage is available.';
      errEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Notify me';
    }
  }

  /* ─── Submit login or signup ─── */
  async function submitAuth(event) {
    if (event && event.preventDefault) event.preventDefault();
    const emailEl    = document.getElementById('auth-email');
    const passwordEl = document.getElementById('auth-password');
    const errEl      = document.getElementById('auth-error');
    const submitBtn  = document.getElementById('auth-submit');

    const email    = (emailEl.value || '').trim();
    const password = passwordEl.value || '';

    // Light client-side validation (server validates again)
    if (!email.includes('@') || !email.includes('.')) {
      errEl.textContent = 'Please enter a valid email.';
      errEl.hidden = false;
      return;
    }
    if (password.length < 8) {
      errEl.textContent = 'Password must be at least 8 characters.';
      errEl.hidden = false;
      return;
    }

    errEl.hidden = true;
    errEl.textContent = '';
    submitBtn.disabled = true;
    const origLabel = submitBtn.textContent;
    submitBtn.textContent = _authTab === 'signup' ? 'Creating…' : 'Logging in…';

    try {
      const endpoint = _authTab === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        errEl.textContent = data.error || 'Something went wrong. Please try again.';
        errEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = origLabel;
        return;
      }
      // Success
      auth.loggedIn = true;
      auth.email    = data.user.email;
      auth.tier     = data.user.tier || 'free';
      store.hasAccount = 1;
      saveStore(store); checkAchievements();
      track(_authTab === 'signup' ? 'account_created' : 'login', {});
      closeAuthModal();
      updateAuthUi();
      loadTriadProfile().then(() => {
        if (state && state.section === 'profile') renderProfile();
      });
      // Refresh profile if user is currently viewing it (immediate, before profile loads)
      if (state && state.section === 'profile') renderProfile();
      showToast({
        icon: _authTab === 'signup' ? '🌱' : '👋',
        label: _authTab === 'signup' ? 'Welcome to Triad' : 'Welcome back',
        autohide: 2200
      });
    } catch (e) {
      errEl.textContent = 'Network error. Please check your connection and try again.';
      errEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = origLabel;
    }
  }

  /* ─── Logout ─── */
  async function handleLogout() {
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch (e) { /* Ignore — we'll reset client state regardless */ }
    auth.loggedIn = false;
    auth.email    = null;
    auth.tier     = 'free';
    updateAuthUi();
    if (state && state.section === 'profile') renderProfile();
    showToast({ icon: '👋', label: 'Logged out', autohide: 1800 });
  }

  /* ─── Update the profile icon button to reflect auth state ─── */
  function updateAuthUi() {
    const btn = document.getElementById('profileIconBtn');
    if (!btn) return;
    if (auth.loggedIn) {
      const initial = ((auth.email || 'U')[0] || 'U').toUpperCase();
      btn.classList.add('logged-in');
      btn.classList.remove('guest');
      btn.title = auth.email || 'Account';
      btn.setAttribute('aria-label', 'Open profile (' + (auth.email || '') + ')');
      btn.innerHTML = `<span>${escapeHtml(initial)}</span>`;
    } else {
      btn.classList.add('guest');
      btn.classList.remove('logged-in');
      btn.title = 'Log in or sign up';
      btn.setAttribute('aria-label', 'Log in or sign up');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>`;
    }
    // Keep profile section in sync with auth state regardless of navigation
    document.getElementById('profile')?.classList.toggle('profile--guest', !auth.loggedIn);
    renderProfileAccountHeader();
    // Show gear icon only when logged in
    document.getElementById('gearBtn')?.classList.toggle('hidden', !auth.loggedIn);
    // Hide delete row in drawer for guests
    document.getElementById('settings-drawer-delete-wrap')?.style.setProperty('display', auth.loggedIn ? '' : 'none');
    // Explicitly enforce guest-only CTA visibility (FIX 3)
    document.querySelectorAll('.profile-guest-cta').forEach(el => {
      el.style.display = auth.loggedIn ? 'none' : '';
    });
    // Update homepage auth footer + account-section title with latest auth/triad state
    renderHomeAuthFooter();
    updateAccountSectionTitle();
  }

  /* ─── Guard helper used by the AI call sites ─── */
  function requireAuth(reason) {
    if (auth.loggedIn) return true;
    openAuthModal(reason || 'Log in or sign up to use the AI coach.');
    return false;
  }

  /* ─── Render account header at the top of Profile ─── */
  function renderProfileAccountHeader() {
    const el = document.getElementById('profile-account-header');
    if (!el) return;
    if (auth.loggedIn) {
      const initial = ((auth.email || 'U')[0] || 'U').toUpperCase();
      const tierLabel = auth.tier === 'pro' ? 'Pro' : 'Free account';
      el.innerHTML = `
        <div class="profile-account">
          <div class="account-info">
            <div class="account-avatar">${escapeHtml(initial)}</div>
            <div>
              <div class="account-email">${escapeHtml(auth.email || '')}</div>
              <div class="account-tier">${escapeHtml(tierLabel)} · signed in</div>
            </div>
          </div>
          <button class="account-logout" onclick="handleLogout()">Log out</button>
        </div>`;
    } else {
      el.innerHTML = `
        <div class="profile-account">
          <div class="account-info">
            <div class="account-avatar guest">G</div>
            <div>
              <div class="account-email">Browsing as guest</div>
              <div class="account-tier">Progress is saved on this device only</div>
            </div>
          </div>
          <button class="account-login" onclick="openAuthModal()">Log in / Sign up</button>
        </div>`;
    }
  }

  /* ─── Patch renderProfile to always render the account header first ─── */
  // Wrapping keeps the (already large) renderProfile body untouched.
  const _origRenderProfile = renderProfile;
  renderProfile = function() {
    renderProfileAccountHeader();
    document.getElementById('profile')?.classList.toggle('profile--guest', !auth.loggedIn);
    return _origRenderProfile.apply(this, arguments);
  };

  /* ─── Wrap AI-call sites with requirePro gating ─── */
  // Plan generation (submit button on first plan)
  const _origSubmitPlan = submitPlan;
  submitPlan = async function() {
    if (!requirePro()) return;
    return _origSubmitPlan.apply(this, arguments);
  };

  // Plan chat follow-ups
  const _origSendPlanMessage = sendPlanMessage;
  sendPlanMessage = async function() {
    if (!requirePro()) return;
    return _origSendPlanMessage.apply(this, arguments);
  };

  // "Ask about this technique" modal
  const _origSendAskMessage = sendAskMessage;
  sendAskMessage = async function() {
    if (!requirePro()) return;
    return _origSendAskMessage.apply(this, arguments);
  };

  /* ─── 401 detection — wrap window.fetch so an expired session triggers the modal ─── */
  // Lightweight: only acts on /ask, /auth/* are not intercepted (they handle their own UX).
  const _origFetch = window.fetch.bind(window);
  window.fetch = async function(resource, init) {
    const res = await _origFetch(resource, init);
    try {
      const url = (typeof resource === 'string') ? resource : (resource && resource.url) || '';
      if (res.status === 401 && url.includes('/ask')) {
        // Read body once to detect login_required; clone so caller can still .json()
        const cloned = res.clone();
        const data = await cloned.json().catch(() => ({}));
        if (data && data.error === 'login_required') {
          auth.loggedIn = false;
          auth.email = null;
          auth.tier = 'free';
          updateAuthUi();
          if (state && state.section === 'profile') renderProfile();
          openAuthModal('Your session expired. Please log in again to continue.');
        }
      }
    } catch (e) { /* ignore — pass response through unchanged */ }
    return res;
  };
