  function initPlanForm() {
    // Wire up chip groups for single-select
    ['plan-goal-chips', 'plan-exp-chips', 'plan-time-chips'].forEach(groupId => {
      const group = document.getElementById(groupId);
      group.addEventListener('click', e => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const key = groupId === 'plan-goal-chips' ? 'goal' : groupId === 'plan-exp-chips' ? 'exp' : 'time';
        state.planSelections[key] = chip.dataset.value;
        if (key === 'goal') document.getElementById('plan-goal-other').value = '';
      });
    });

    // "Other" input clears chip selection for goal
    document.getElementById('plan-goal-other').addEventListener('input', e => {
      if (e.target.value.trim()) {
        document.getElementById('plan-goal-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        state.planSelections.goal = e.target.value.trim();
      }
    });
  }

  async function submitPlan() {
    const goalOther = document.getElementById('plan-goal-other').value.trim();
    if (goalOther) state.planSelections.goal = goalOther;

    const { goal, exp, time } = state.planSelections;
    if (!goal) return alert('Please choose or describe a goal.');
    if (!exp)  return alert('Please choose your experience level.');
    if (!time) return alert('Please choose how much time you have each day.');

    const prompt =
`Please build me a personalised 30-day breathwork and meditation plan.

**My goal:** ${goal}
**My experience level:** ${exp}
**Time I have each day:** ${time}

Structure the response with a short opening paragraph explaining your reasoning, then group the 30 days into 4 weekly phases (Week 1 — Foundation, Week 2 — Building, Week 3 — Deepening, Week 4 — Integration). For each week give a short overview and then list each day's specific practices (2–4 practices per day). Name the specific techniques and meditations directly (e.g. "4-7-8 Breathing", "Box Breathing", "Body Scan", "Yoga Nidra") so I can find them in the app's library.

Include any safety notes briefly where relevant. End with one or two sentences of encouragement about how to use the plan flexibly.`;

    // Record the plan start for the profile/home progress trackers
    const now = new Date().toISOString();
    store.plan = { startDate: now, totalDays: 30, generatedAt: now };
    store.plansGenerated = (store.plansGenerated || 0) + 1;
    saveStore(store);
    queueSync({
      type: 'plan',
      data: {
        plan_data: JSON.stringify(store.plan),
        start_date: store.plan.startDate
      }
    });
    track('plan_created', {});

    // Switch to result view
    document.getElementById('plan-form-wrap').style.display = 'none';
    document.getElementById('plan-result').classList.add('active');

    state.planHistory = [{ role: 'user', content: prompt }];
    // Render an abbreviated user message for display
    const displayMsg =
`Goal: **${goal}**
Experience: **${exp}**
Time available: **${time} per day**

Build my personalised plan.`;
    appendChatMessage('plan-messages', 'user', displayMsg);
    await runPlanRequest();
  }

  async function runPlanRequest() {
    state.planLoading = true;
    // Gate: must be logged in and Pro
    if (!requirePro()) {
      const lastIsUser = state.planHistory.length && state.planHistory[state.planHistory.length - 1].role === 'user';
      if (lastIsUser) state.planHistory.pop();
      const msgsEl = document.getElementById('plan-messages');
      if (msgsEl && msgsEl.lastElementChild && msgsEl.lastElementChild.classList.contains('user')) {
        msgsEl.lastElementChild.remove();
      }
      state.planLoading = false;
      return;
    }
    const confirmed = await confirmApiCall({
      callType: 'plan',
      messages: state.planHistory,
      context: null
    });
    if (!confirmed) {
      // User cancelled — roll back the just-pushed user turn
      const lastIsUser = state.planHistory.length && state.planHistory[state.planHistory.length - 1].role === 'user';
      if (lastIsUser) state.planHistory.pop();
      // Remove the user bubble that was rendered before the API call
      const msgsEl = document.getElementById('plan-messages');
      if (msgsEl && msgsEl.lastElementChild && msgsEl.lastElementChild.classList.contains('user')) {
        msgsEl.lastElementChild.remove();
      }
      state.planLoading = false;
      return;
    }
    showTyping('plan-messages');
    try {
      const res = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.planHistory })
      });
      const data = await res.json();
      hideTyping('plan-messages');
      if (!res.ok || data.error) {
        appendChatMessage('plan-messages', 'assistant',
          `I'm sorry — I encountered an issue: *${data.error || 'unknown error'}*\n\nPlease check that the API key is configured and try again.`);
        state.planHistory.pop();
      } else {
        const reply = data.response;
        state.planHistory.push({ role: 'assistant', content: reply });
        appendChatMessage('plan-messages', 'assistant', reply);
        if (data.usage) showUsageToast(data.usage);
      }
    } catch (err) {
      hideTyping('plan-messages');
      appendChatMessage('plan-messages', 'assistant', 'I lost the connection for a moment. Please check your network and try again.');
      state.planHistory.pop();
      console.error(err);
    }
    state.planLoading = false;
  }

  async function sendPlanMessage() {
    const input = document.getElementById('plan-input');
    const text = input.value.trim();
    if (!text || state.planLoading) return;
    input.value = '';
    input.style.height = 'auto';
    state.planHistory.push({ role: 'user', content: text });
    appendChatMessage('plan-messages', 'user', text);
    await runPlanRequest();
  }

  function restartPlan() {
    state.planSelections = { goal: '', exp: '', time: '' };
    state.planHistory = [];
    document.querySelectorAll('#plan-goal-chips .chip, #plan-exp-chips .chip, #plan-time-chips .chip')
      .forEach(c => c.classList.remove('active'));
    document.getElementById('plan-goal-other').value = '';
    document.getElementById('plan-messages').innerHTML = '';
    document.getElementById('plan-result').classList.remove('active');
    document.getElementById('plan-form-wrap').style.display = '';
  }

  /* ════════════════ ASK MODAL ════════════════ */

  function openAskModal() {
    if (!requirePro()) return;
    if (!state.askContext) return;
    const { kind, item } = state.askContext;
    document.getElementById('askModalTitle').textContent = item.title;

    const body = document.getElementById('askModalBody');
    if (state.askHistory.length === 0) {
      body.innerHTML = `
        <div class="modal-empty">
          Ask the Triad coach anything about <strong style="color: var(--teal)">${escapeHtml(item.title)}</strong> — the science, the experience, when to use it, common pitfalls, or how to adapt it.
          <div class="empty-prompts">
            <button class="empty-prompt" onclick="seedAskMessage('How does ${escapeHtml(item.title)} actually work in the body?')">How does it actually work in the body?</button>
            <button class="empty-prompt" onclick="seedAskMessage('When is the best time of day to practise ${escapeHtml(item.title)}?')">When is the best time of day to practise this?</button>
            <button class="empty-prompt" onclick="seedAskMessage('What common mistakes do beginners make with ${escapeHtml(item.title)}?')">What common mistakes do beginners make?</button>
            <button class="empty-prompt" onclick="seedAskMessage('Can you guide me through ${escapeHtml(item.title)} right now?')">Guide me through it right now</button>
          </div>
        </div>
      `;
    } else {
      renderAskHistory();
    }

    document.getElementById('askModal').classList.add('active');
    setTimeout(() => document.getElementById('ask-input').focus(), 100);
  }

  function closeAskModal() {
    document.getElementById('askModal').classList.remove('active');
  }

  function openPrivacyModal() {
    document.getElementById('privacyModal').classList.add('active');
  }

  function closePrivacyModal() {
    document.getElementById('privacyModal').classList.remove('active');
  }

  function renderAskHistory() {
    const body = document.getElementById('askModalBody');
    body.innerHTML = '';
    state.askHistory.forEach(msg => {
      appendChatMessage('askModalBody', msg.role, msg.content, { skipHistory: true });
    });
  }

  function seedAskMessage(text) {
    document.getElementById('ask-input').value = text;
    autoResize(document.getElementById('ask-input'));
    sendAskMessage();
  }

  async function sendAskMessage() {
    const input = document.getElementById('ask-input');
    const text = input.value.trim();
    if (!text || state.askLoading || !state.askContext) return;
    if (!requirePro()) return;
    input.value = '';
    input.style.height = 'auto';

    // First message — clear the empty state
    if (state.askHistory.length === 0) {
      document.getElementById('askModalBody').innerHTML = '';
    }

    const { kind, item } = state.askContext;

    // Push the clean user message — no in-message context wrapping anymore.
    state.askHistory.push({ role: 'user', content: text });
    appendChatMessage('askModalBody', 'user', text);
    state.askLoading = true;

    // Build the small per-technique context block (single doc, not the full knowledge base)
    const techContext = buildTechniqueContext(item, kind);

    const confirmed = await confirmApiCall({
      callType: 'ask',
      messages: state.askHistory,
      context: techContext,
      practiceTitle: item.title
    });
    if (!confirmed) {
      // Roll back: drop the user message + its rendered bubble
      state.askHistory.pop();
      const body = document.getElementById('askModalBody');
      if (body && body.lastElementChild && body.lastElementChild.classList.contains('user')) {
        body.lastElementChild.remove();
      }
      // If that was the first message, restore the empty-state guidance
      if (state.askHistory.length === 0) openAskModal();
      state.askLoading = false;
      return;
    }

    showTyping('askModalBody');
    try {
      const res = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.askHistory.map(m => ({ role: m.role, content: m.content })),
          context: techContext
        })
      });
      const data = await res.json();
      hideTyping('askModalBody');
      if (!res.ok || data.error) {
        appendChatMessage('askModalBody', 'assistant',
          `I'm sorry — I encountered an issue: *${data.error || 'unknown error'}*`);
        state.askHistory.pop();
      } else {
        const reply = data.response;
        state.askHistory.push({ role: 'assistant', content: reply });
        appendChatMessage('askModalBody', 'assistant', reply);
        if (data.usage) showUsageToast(data.usage);
      }
    } catch (err) {
      hideTyping('askModalBody');
      appendChatMessage('askModalBody', 'assistant', 'I lost the connection. Please check your network and try again.');
      state.askHistory.pop();
      console.error(err);
    }
    state.askLoading = false;
  }

  /* Build a compact context blob for "Ask about this technique" — single practice only,
     not the 163K knowledge base. ~600 tokens for a typical technique. */
  function buildTechniqueContext(item, kind) {
    const lines = [];
    lines.push(`# ${item.title}`);
    lines.push(`Best for: ${item.bestFor}. Difficulty: ${item.difficulty}. Typical duration: ${item.duration}.`);
    lines.push('');
    lines.push(`Short description: ${item.desc}`);
    lines.push('');

    // Pull rich detail if available (techniques have TECHNIQUE_DETAILS; meditations don't yet)
    const d = TECHNIQUE_DETAILS[item.id];
    if (d) {
      lines.push('## Overview');
      lines.push(d.overview.what);
      lines.push('Key benefits:');
      d.overview.keyBenefits.forEach(b => lines.push(`- ${b}`));
      lines.push('When to use:');
      d.overview.whenToUse.forEach(w => lines.push(`- ${w}`));
      lines.push(`Who it's for: ${d.overview.whoFor}`);
      lines.push('');

      lines.push('## History');
      lines.push(`Origins: ${d.history.origins}`);
      lines.push(`Evolution: ${d.history.evolution}`);
      lines.push('Key figures:');
      d.history.figures.forEach(f => lines.push(`- ${f.name}: ${f.credit}`));
      lines.push(`Ancient connection: ${d.history.ancient}`);
      lines.push('');

      lines.push('## How to');
      lines.push('Steps:');
      item.steps.forEach(s => lines.push(`- ${s}`));
      lines.push('Progressions:');
      d.howTo.progressions.forEach(p => lines.push(`- ${p.level}: ${p.detail}`));
      lines.push('Tips:');
      d.howTo.tips.forEach(t => lines.push(`- ${t}`));
      lines.push('');

      lines.push('## Science');
      lines.push(`Physiology: ${d.science.physiology}`);
      lines.push(`Neuroscience: ${d.science.neuroscience}`);
      lines.push(`Key mechanisms: ${d.science.tags.join(', ')}`);
      lines.push('Research:');
      d.science.research.forEach(r => lines.push(`- ${r}`));
    } else {
      // Fallback for meditations or unspecified entries
      lines.push('Steps:');
      item.steps.forEach(s => lines.push(`- ${s}`));
      lines.push('Benefits:');
      item.benefits.forEach(b => lines.push(`- ${b}`));
    }

    if (item.cautions) {
      lines.push('');
      lines.push(`## Cautions\n${item.cautions}`);
    }
    return lines.join('\n');
  }

  /* ════════════════ CHAT helpers (shared) ════════════════ */

  function appendChatMessage(containerId, role, content, opts = {}) {
    const c = document.getElementById(containerId);
    const msg = document.createElement('div');
    msg.className = `message ${role}`;
    const avatarLabel = role === 'assistant' ? 'B' : 'You';
    const avatarClass = role === 'assistant' ? 'coach' : 'user';
    const bubbleContent = role === 'assistant'
      ? linkPractices(renderMarkdown(content))
      : renderMarkdown(content);
    msg.innerHTML = `
      <div class="avatar ${avatarClass}">${avatarLabel}</div>
      <div class="bubble">${bubbleContent}</div>
    `;
    c.appendChild(msg);
    scrollChatToBottom(containerId);
  }

  function showTyping(containerId) {
    const c = document.getElementById(containerId);
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.dataset.typing = '1';
    typing.innerHTML = `
      <div class="avatar coach">B</div>
      <div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
    `;
    c.appendChild(typing);
    scrollChatToBottom(containerId);
  }

  function hideTyping(containerId) {
    const c = document.getElementById(containerId);
    const t = c.querySelector('[data-typing="1"]');
    if (t) t.remove();
  }

  function scrollChatToBottom(containerId) {
    if (containerId === 'askModalBody') {
      const el = document.getElementById(containerId);
      el.scrollTop = el.scrollHeight;
    } else {
      // Plan messages — scroll page to keep latest in view
      requestAnimationFrame(() => {
        const last = document.getElementById(containerId).lastElementChild;
        if (last) last.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }

  /* ────── Markdown ────── */
  function renderMarkdown(text) {
    return text
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^---+$/gm, '<hr>')
      .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .split(/\n{2,}/)
      .map(block => {
        block = block.trim();
        if (!block) return '';
        if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol') || block.startsWith('<hr') || block.startsWith('<li')) return block;
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  }

  /* Replace practice names in AI-generated HTML with clickable links */
  function linkPractices(html) {
    // Use a temporary container so we only touch text nodes
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const seen = new Set(); // Don't over-link — once per chunk is enough

    const walker = document.createTreeWalker(wrap, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement.closest('a, code, .practice-link')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    let n; while ((n = walker.nextNode())) textNodes.push(n);

    textNodes.forEach(node => {
      let text = node.nodeValue;
      let modified = false;
      let fragments = [text];

      getPracticeNameMap().forEach(({ name, section, id }) => {
        const key = `${section}:${id}`;
        if (seen.has(key)) return;
        const pattern = new RegExp(`\\b(${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b`, 'i');
        const newFragments = [];
        for (const frag of fragments) {
          if (typeof frag !== 'string') { newFragments.push(frag); continue; }
          const m = frag.match(pattern);
          if (m) {
            const idx = m.index;
            const before = frag.slice(0, idx);
            const matched = frag.slice(idx, idx + m[0].length);
            const after = frag.slice(idx + m[0].length);
            if (before) newFragments.push(before);
            newFragments.push({ type: 'link', text: matched, section, id });
            if (after) newFragments.push(after);
            modified = true;
            seen.add(key);
          } else {
            newFragments.push(frag);
          }
        }
        fragments = newFragments;
      });

      if (modified) {
        const parent = node.parentNode;
        fragments.forEach(frag => {
          if (typeof frag === 'string') {
            parent.insertBefore(document.createTextNode(frag), node);
          } else {
            const a = document.createElement('a');
            a.className = 'practice-link';
            a.dataset.section = frag.section;
            a.dataset.id = frag.id;
            a.textContent = frag.text;
            parent.insertBefore(a, node);
          }
        });
        parent.removeChild(node);
      }
    });

    return wrap.innerHTML;
  }

  // Click handler for practice links (delegated)
  document.addEventListener('click', e => {
    const link = e.target.closest('.practice-link');
    if (!link) return;
    e.preventDefault();
    const { section, id } = link.dataset;
    closeAskModal();
    navigate(section);
    if (section === 'techniques') showTechniqueDetail(id);
    else if (section === 'meditate') showMeditationDetail(id);
  });

  /* ────── Utilities ────── */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str ?? ''));
    return div.innerHTML;
  }

  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }

  function handleKey(e, target) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (target === 'plan') sendPlanMessage();
      else if (target === 'ask') sendAskMessage();
    } else if (e.key === 'Escape' && target === 'ask') {
      closeAskModal();
    }
  }

  /* ════════════════ GAMIFICATION ════════════════ */

  // Date helpers — local YYYY-MM-DD so streaks respect the user's timezone
  function todayKey()      { return dateKey(new Date()); }
  function yesterdayKey()  { const d = new Date(); d.setDate(d.getDate() - 1); return dateKey(d); }
  function dateKey(d)      { return d.toLocaleDateString('en-CA'); } // ISO-style YYYY-MM-DD in local time
  function tsKey(iso)      { return dateKey(new Date(iso)); }

  function durationMinutes(item) {
    // Best-effort parse from human strings like "3–8 cycles · 2–5 min" / "20–45 minutes"
    const m = (item.duration || '').match(/(\d+)\s*[-–—]\s*(\d+)/);
    if (m) return Math.round((parseInt(m[1]) + parseInt(m[2])) / 2);
    const single = (item.duration || '').match(/(\d+)/);
    return single ? parseInt(single[1]) : 5;
  }

  function completeSession(kind, practiceId) {
    const list = kind === 'technique' ? TECHNIQUES : MEDITATIONS;
    const item = list.find(x => x.id === practiceId);
    if (!item) return;

    const now = new Date().toISOString();
    store.sessions.unshift({
      id: 's_' + Date.now().toString(36),
      kind,
      practiceId,
      practiceTitle: item.title,
      durationMin: durationMinutes(item),
      ts: now
    });
    updateStreakOnComplete();
    saveStore(store);
    queueSync({
      type: 'session',
      data: {
        kind,
        practice_id: practiceId,
        practice_title: item.title,
        duration_minutes: durationMinutes(item),
        completed_at: now
      }
    });
    track('session_completed', { kind, practice_id: practiceId });
    showToast({ icon: '🙏', label: 'Session saved', autohide: 2200 });
    checkAchievements();
    const _prevRanks  = { body: store.mastery?.body?.rank || 'Unranked', mind: store.mastery?.mind?.rank || 'Unranked', spirit: store.mastery?.spirit?.rank || 'Unranked' };
    const _prevLevels = { body: store.mastery?.body?.level || 0, mind: store.mastery?.mind?.level || 0, spirit: store.mastery?.spirit?.level || 0 };
    updateMastery();
    ['body', 'mind', 'spirit'].forEach(p => {
      const newRank  = store.mastery[p].rank;
      const newLevel = store.mastery[p].level;
      if (newLevel > _prevLevels[p]) {
        if (document.getElementById('mastery-triangle-svg')) {
          renderTriadMastery();
          setTimeout(() => _masteryVertexFlash(p), 60);
        }
        if (newRank !== _prevRanks[p] && newLevel > 0) {
          showToast({ icon: '🏔️', kicker: p.charAt(0).toUpperCase() + p.slice(1), label: `Rank Up — ${newRank}`, autohide: 4000 });
        }
      }
    });

    // Re-render the detail page so the "Completed today" state appears
    if (kind === 'technique' && state.techniqueId === practiceId) {
      renderDetail(item, 'techniques-detail', 'technique');
    } else if (kind === 'meditation' && state.meditationId === practiceId) {
      renderDetail(item, 'meditate-detail', 'meditation');
    }
    refreshStreakBadge();
  }

  function updateStreakOnComplete() {
    const today = todayKey();
    const last = store.streak.lastDate;
    if (last === today) {
      // Already counted today — nothing changes
      return;
    }
    if (last === yesterdayKey()) {
      store.streak.current += 1;
    } else {
      store.streak.current = 1;
    }
    store.streak.lastDate = today;
    // Track the all-time best streak so it survives gaps
    if (store.streak.current > (store.streak.longest || 0)) {
      store.streak.longest = store.streak.current;
    }
  }

  function streakIsCurrent() {
    if (!store.streak.lastDate) return false;
    return store.streak.lastDate === todayKey() || store.streak.lastDate === yesterdayKey();
  }
  function effectiveStreak() {
    return streakIsCurrent() ? store.streak.current : 0;
  }

  /* Pick the most-completed practice and surface as the "favourite". */
  function favouritePractice() {
    const counts = {};
    (store.sessions || []).forEach(s => {
      counts[s.practiceId] = (counts[s.practiceId] || 0) + 1;
    });
    let best = null;
    Object.entries(counts).forEach(([id, n]) => {
      if (!best || n > best.count) {
        const tech = TECHNIQUES.find(t => t.id === id);
        const med  = MEDITATIONS.find(m => m.id === id);
        const item = tech || med;
        if (item) best = { id, title: item.title, kind: tech ? 'technique' : 'meditation', count: n };
      }
    });
    return best;
  }

  /* Find the achievement closest to being earned. Skips pro on Free tier and skips already-earned. */
  function nextAchievementHint() {
    const candidates = ACHIEVEMENTS
      .filter(a => !store.achievements[a.id])
      .filter(a => !(a.tier === 'pro' && store.tier !== 'pro'))
      .map(a => {
        const p = a.progress ? a.progress(store) : null;
        if (!p) return null;
        const remaining = Math.max(0, p.target - p.current);
        return { a, p, remaining };
      })
      .filter(x => x && x.remaining > 0)
      .sort((x, y) => x.remaining - y.remaining);
    if (!candidates.length) return null;
    const { a, p, remaining } = candidates[0];
    const unit = remaining === 1 && p.label.endsWith('s') ? p.label.slice(0, -1) : p.label;
    return {
      icon: a.icon,
      text: `You're ${remaining} ${unit} away from ${a.name}.`
    };
  }

  function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
      if (store.achievements[a.id]) return;       // already unlocked
      if (a.test(store)) {
        // Pro-tier achievements are gated: criteria-tested but only "unlock" on Pro.
        // The UI shows them locked with a padlock until tier flips.
        if (a.tier === 'pro' && store.tier !== 'pro') return;
        store.achievements[a.id] = new Date().toISOString();
        queueSync({
          type: 'achievement',
          data: { achievement_id: a.id, unlocked_at: store.achievements[a.id] }
        });
        track('achievement_unlocked', { achievement_id: a.id });
        showToast({
          icon: a.icon,
          kicker: 'Achievement unlocked',
          label: a.name,
          autohide: 3400
        });
      }
    });
    saveStore(store);
  }

  /* Toggle pro/free tier — demo helper. Replays achievement check so newly-eligible
     pro achievements unlock on upgrade. */
  function toggleProTier() {
    store.tier = store.tier === 'pro' ? 'free' : 'pro';
    saveStore(store);
    checkAchievements();
    renderProfile();
  }

  /* ════════════════ TOAST ════════════════ */

  function showToast({ icon, label, kicker, autohide = 2400 }) {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const t = document.createElement('div');
    t.className = 'toast' + (kicker ? ' achievement' : '');
    t.innerHTML = `
      ${icon ? `<span class="toast-icon">${icon}</span>` : ''}
      <div class="toast-text">
        ${kicker ? `<span class="toast-kicker">${escapeHtml(kicker)}</span>` : ''}
        <span class="toast-label">${escapeHtml(label)}</span>
      </div>
    `;
    region.appendChild(t);
    setTimeout(() => {
      t.classList.add('fading');
      setTimeout(() => t.remove(), 300);
    }, autohide);
  }

  /* ════════════════ SESSION PICKER ════════════════ */

  // A small curated set — beginner-friendly quick-starts
  const PICKER_ITEMS = [
    { kind: 'technique',  id: 'physiological-sigh' },
    { kind: 'technique',  id: '4-7-8-breathing' },
    { kind: 'technique',  id: 'box-breathing' },
    { kind: 'meditation', id: 'mindfulness-of-breath' },
    { kind: 'meditation', id: 'body-scan' },
    { kind: 'meditation', id: 'yoga-nidra' }
  ];

  function openSessionPicker() {
    const grid = document.getElementById('picker-grid');
    grid.innerHTML = PICKER_ITEMS.map(p => {
      const list = p.kind === 'technique' ? TECHNIQUES : MEDITATIONS;
      const item = list.find(x => x.id === p.id);
      if (!item) return '';
      return `
        <button class="picker-card ${p.kind === 'technique' ? 'tech' : 'med'}"
                onclick="pickerStart('${p.kind}', '${p.id}')">
          <span class="picker-card-kicker">${p.kind === 'technique' ? 'Breath' : 'Meditation'}</span>
          <span class="picker-card-title">${escapeHtml(item.title)}</span>
          <span class="picker-card-meta">${escapeHtml(item.duration)} · ${escapeHtml(item.bestFor)}</span>
        </button>`;
    }).join('');
    document.getElementById('sessionPickerModal').classList.add('active');
  }

  function closeSessionPicker() {
    document.getElementById('sessionPickerModal').classList.remove('active');
  }

  function pickerStart(kind, id) {
    closeSessionPicker();
    if (kind === 'technique') {
      navigate('techniques');
      showTechniqueDetail(id);
    } else {
      navigate('meditate');
      showMeditationDetail(id);
    }
  }

  /* ════════════════ HOME SUMMARY ════════════════ */

  function formatRelative(iso) {
    const then = new Date(iso);
    const diffMin = Math.floor((Date.now() - then.getTime()) / 60000);
    if (diffMin < 1)   return 'just now';
    if (diffMin < 60)  return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24)   return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'yesterday';
    if (diffDay < 7)   return `${diffDay}d ago`;
    return then.toLocaleDateString();
  }

  function planDayProgress() {
    if (!store.plan) return null;
    const total = store.plan.totalDays || 30;
    const start = new Date(store.plan.startDate);
    const daysElapsed = Math.floor((Date.now() - start.getTime()) / 86400000) + 1;
    const day = Math.max(1, Math.min(daysElapsed, total));
    const pct = Math.round((day / total) * 100);
    return { day, total, pct, done: day >= total };
  }

  function renderHomeSummary() {
    const body = document.getElementById('home-summary-body');
    if (!body) return;
    const streak = effectiveStreak();
    const plan = planDayProgress();
    const last = store.sessions[0];

    // This week: sessions and minutes in the last 7 days (rolling window)
    const cutoff = Date.now() - 7 * 86400000;
    const recent = (store.sessions || []).filter(s => new Date(s.ts).getTime() >= cutoff);
    const weekSessions = recent.length;
    const weekMinutes  = recent.reduce((sum, s) => sum + (s.durationMin || 0), 0);

    const rows = [];

    // Streak
    rows.push(`
      <div class="summary-row">
        <span class="row-icon">🔥</span>
        <span class="row-label">Streak</span>
        <span class="row-value">${
          streak > 0
            ? `<span class="streak-flame">${streak}</span>-day streak`
            : `<span class="dim">No streak yet — start today</span>`
        }</span>
      </div>`);

    // This week (NEW)
    rows.push(`
      <div class="summary-row">
        <span class="row-icon">📅</span>
        <span class="row-label">This week</span>
        <span class="row-value">${
          weekSessions > 0
            ? `<strong>${weekSessions}</strong> session${weekSessions === 1 ? '' : 's'} · <strong>${weekMinutes}</strong> min`
            : `<span class="dim">Nothing logged this week</span>`
        }</span>
      </div>`);

    // Plan today
    rows.push(`
      <div class="summary-row">
        <span class="row-icon">📋</span>
        <span class="row-label">Today's plan</span>
        <span class="row-value">${
          plan
            ? `<strong>Day ${plan.day}</strong> of ${plan.total} · ${plan.pct}%`
            : `<span class="dim">No active plan — build one in My Plan</span>`
        }</span>
      </div>`);

    // Last session
    rows.push(`
      <div class="summary-row">
        <span class="row-icon">✓</span>
        <span class="row-label">Last session</span>
        <span class="row-value">${
          last
            ? `${escapeHtml(last.practiceTitle)} <span class="dim" style="font-size:0.78rem">· ${formatRelative(last.ts)}</span>`
            : `<span class="dim">No sessions yet</span>`
        }</span>
      </div>`);

    body.innerHTML = rows.join('');
    refreshStreakBadge();
    renderHomeAuthFooter();
  }

  function renderHomeAuthFooter() {
    const authFooter = document.getElementById('home-auth-footer');
    if (!authFooter) return;
    if (auth.loggedIn) {
      const name = (typeof _triadProfile !== 'undefined' && _triadProfile && _triadProfile.triad_name)
        ? _triadProfile.triad_name
        : (auth.email || '');
      authFooter.innerHTML = `<span class="home-auth-link" onclick="navigate('profile')" role="button" tabindex="0">Welcome back, ${escapeHtml(name)} &middot; <span style="text-decoration:underline">View Profile</span></span>`;
    } else {
      authFooter.innerHTML = `<span class="home-auth-link" onclick="openAuthModal('signup')" role="button" tabindex="0">Sign Up / Log In</span>`;
    }
  }

  function updateAccountSectionTitle() {
    const el = document.getElementById('acc-account-title');
    if (!el) return;
    const name = (typeof _triadProfile !== 'undefined' && _triadProfile && _triadProfile.triad_name)
      ? _triadProfile.triad_name
      : null;
    el.textContent = name ? `${name} Stats` : 'My Stats';
  }

  function refreshStreakBadge() {
    const badge = document.getElementById('home-streak-badge');
    if (!badge) return;
    const streak = effectiveStreak();
    if (streak > 0) {
      badge.textContent = streak;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  /* ════════════════ PROFILE SECTION ════════════════ */

  function renderProfile() {
    /* ─── Stats dashboard (8 cards) ─── */
    const streak     = effectiveStreak();
    const longest    = Math.max(store.streak?.longest || 0, streak);
    const totalMin   = _totalMinutes(store);
    const sessionsN  = store.sessions.length;
    const techDone   = TECHNIQUES.filter(t => _completedPracticeIds(store).has(t.id)).length;
    const medDone    = MEDITATIONS.filter(m => _completedPracticeIds(store).has(m.id)).length;
    const booksOnList = Object.keys(store.readingList || {}).filter(k => ['read', 'reading'].includes(store.readingList[k])).length;
    const plansGen   = store.plansGenerated || 0;
    const fav        = favouritePractice();

    document.getElementById('profile-stats-grid').innerHTML = `
      <div class="stat-card sessions">
        <div class="stat-label">Sessions</div>
        <div class="stat-value">${sessionsN}</div>
        <div class="stat-sub">${sessionsN === 0 ? 'Start your first' : 'completed'}</div>
      </div>
      <div class="stat-card minutes">
        <div class="stat-label">Minutes</div>
        <div class="stat-value">${totalMin}<span class="stat-unit">min</span></div>
        <div class="stat-sub">${sessionsN ? `~${Math.round(totalMin / sessionsN)} per session` : 'practised'}</div>
      </div>
      <div class="stat-card streak">
        <div class="stat-label">Current streak</div>
        <div class="stat-value">${streak}<span class="stat-unit">day${streak === 1 ? '' : 's'}</span></div>
        <div class="stat-sub">${streak > 0 ? `Last practised ${formatRelative(store.streak.lastDate + 'T12:00:00')}` : 'Start a session today'}</div>
      </div>
      <div class="stat-card longest">
        <div class="stat-label">Longest streak</div>
        <div class="stat-value">${longest}<span class="stat-unit">day${longest === 1 ? '' : 's'}</span></div>
        <div class="stat-sub">${longest >= 30 ? 'Devoted territory' : longest >= 7 ? 'Building real depth' : 'Best run so far'}</div>
      </div>
      <div class="stat-card techniques">
        <div class="stat-label">Techniques tried</div>
        <div class="stat-value">${techDone}<span class="stat-unit">/ ${TECHNIQUES.length}</span></div>
        <div class="stat-sub">${techDone === TECHNIQUES.length ? '✓ All explored' : `${TECHNIQUES.length - techDone} to go`}</div>
      </div>
      <div class="stat-card meditations">
        <div class="stat-label">Meditations tried</div>
        <div class="stat-value">${medDone}<span class="stat-unit">/ ${MEDITATIONS.length}</span></div>
        <div class="stat-sub">${medDone === MEDITATIONS.length ? '✓ All explored' : `${MEDITATIONS.length - medDone} to go`}</div>
      </div>
      <div class="stat-card books">
        <div class="stat-label">Reading list</div>
        <div class="stat-value">${booksOnList}<span class="stat-unit">book${booksOnList === 1 ? '' : 's'}</span></div>
        <div class="stat-sub">${Object.values(store.readingList || {}).filter(v => v === 'read').length} read</div>
      </div>
      <div class="stat-card plans">
        <div class="stat-label">Plans generated</div>
        <div class="stat-value">${plansGen}</div>
        <div class="stat-sub">${plansGen === 0 ? 'Build your first' : plansGen === 1 ? 'one plan so far' : `${plansGen} plans so far`}</div>
      </div>
    `;

    /* ─── Favourite practice ─── */
    const favEl = document.getElementById('profile-favourite-block');
    if (fav) {
      favEl.innerHTML = `
        <div class="favourite-strip" onclick="${fav.kind === 'technique' ? `navigate('techniques'); showTechniqueDetail('${fav.id}')` : `navigate('meditate'); showMeditationDetail('${fav.id}')`}">
          <div class="fav-label">Favourite practice</div>
          <div class="fav-title">${escapeHtml(fav.title)}</div>
          <div class="fav-meta">${fav.count} session${fav.count === 1 ? '' : 's'} · ${fav.kind === 'technique' ? 'Breathwork' : 'Meditation'}</div>
        </div>`;
    } else {
      favEl.innerHTML = '';
    }

    /* ─── Plan progress ─── */
    const planBlock = document.getElementById('profile-plan-block');
    const plan = planDayProgress();
    if (plan) {
      planBlock.innerHTML = `
        <div class="profile-plan-head">
          <div class="profile-plan-title">Active plan</div>
          <div class="profile-plan-day">Day ${plan.day} of ${plan.total}</div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${plan.pct}%"></div></div>
        <div class="profile-plan-meta">${plan.pct}% complete · ${plan.done ? 'Plan finished — generate a new one' : `${plan.total - plan.day} day${plan.total - plan.day === 1 ? '' : 's'} remaining`}</div>
      `;
    } else {
      planBlock.innerHTML = `
        <div class="profile-plan-head">
          <div class="profile-plan-title">Active plan</div>
        </div>
        <div class="profile-plan-empty">No plan yet — <a onclick="navigate('plan')">build one in My Plan</a>.</div>
      `;
    }

    /* ─── Next achievement hint ─── */
    const next = nextAchievementHint();
    document.getElementById('profile-next-achievement').innerHTML = next ? `
      <div class="next-achievement">
        <span class="next-ach-icon">${next.icon}</span>
        <div class="next-ach-body">
          <div class="next-ach-kicker">Next achievement</div>
          <div class="next-ach-text">${escapeHtml(next.text)}</div>
        </div>
      </div>` : '';

    /* ─── Achievements (Guest + Pro tiers, padlock on locked pro) ─── */
    const trulyUnlocked = a => !!store.achievements[a.id] && (a.tier === 'guest' || store.tier === 'pro');
    const unlockedCount = ACHIEVEMENTS.filter(trulyUnlocked).length;
    document.getElementById('achievement-count').textContent =
      `${unlockedCount}/${ACHIEVEMENTS.length}`;

    const renderRow = list => `<div class="achievements-row">${list.map(a => {
      const unlocked = trulyUnlocked(a);
      if (unlocked) {
        return `
          <div class="achievement unlocked" onclick="toggleUnlockedAchievement(this)">
            <span class="achievement-icon">${a.icon}</span>
            <div class="achievement-name">${escapeHtml(a.name)}</div>
            <div class="achievement-state">Unlocked</div>
            <div class="achievement-tooltip">${escapeHtml(a.icon)} ${escapeHtml(a.name)} — ${escapeHtml(a.hint)}</div>
          </div>`;
      }
      return `
        <div class="achievement achievement--mystery" onclick="toggleMysteryAchievement(this)" title="Tap to reveal">
          <span class="achievement-icon">${a.icon}</span>
          <div class="achievement-name">${escapeHtml(a.name)}</div>
          <div class="achievement-state">${a.tier === 'pro' ? 'Pro' : 'Locked'}</div>
        </div>`;
    }).join('')}</div>`;

    const guestList = ACHIEVEMENTS.filter(a => a.tier === 'guest');
    const proList   = ACHIEVEMENTS.filter(a => a.tier === 'pro');
    document.getElementById('achievements-section').innerHTML = `
      <div class="achievement-tier">
        <div class="tier-head">
          <span class="tier-name">Guest achievements</span>
          <span class="tier-count">${guestList.filter(trulyUnlocked).length} / ${guestList.length}</span>
        </div>
        ${renderRow(guestList)}
      </div>
      <div class="achievement-tier">
        <div class="tier-head">
          <span class="tier-name">Pro tier</span>
          <span class="tier-count">${proList.filter(trulyUnlocked).length} / ${proList.length}</span>
        </div>
        ${renderRow(proList)}
      </div>
    `;

    // Populate the guest flat achievements grid (visible without accordion for guest users)
    const guestGrid = document.getElementById('guest-achievements-grid');
    if (guestGrid) guestGrid.innerHTML = renderRow(guestList);

    /* ─── Completion grids ─── */
    const completed = _completedPracticeIds(store);

    document.getElementById('tech-explore-count').textContent = `${techDone} of ${TECHNIQUES.length}`;
    document.getElementById('tech-completion-grid').innerHTML = TECHNIQUES.map(t => `
      <button class="completion-tile ${completed.has(t.id) ? 'done' : ''}"
              onclick="navigate('techniques'); showTechniqueDetail('${t.id}')"
              title="${escapeHtml(completed.has(t.id) ? 'Completed' : 'Not tried yet')}">
        <span class="ct-state">${completed.has(t.id) ? '✓' : '·'}</span>
        <span class="ct-title">${escapeHtml(t.title)}</span>
        <span class="ct-meta">${escapeHtml(t.bestFor)}</span>
      </button>`).join('');

    document.getElementById('med-explore-count').textContent = `${medDone} of ${MEDITATIONS.length}`;
    document.getElementById('med-completion-grid').innerHTML = MEDITATIONS.map(m => `
      <button class="completion-tile med ${completed.has(m.id) ? 'done' : ''}"
              onclick="navigate('meditate'); showMeditationDetail('${m.id}')"
              title="${escapeHtml(completed.has(m.id) ? 'Completed' : 'Not tried yet')}">
        <span class="ct-state">${completed.has(m.id) ? '✓' : '·'}</span>
        <span class="ct-title">${escapeHtml(m.title)}</span>
        <span class="ct-meta">${escapeHtml(m.bestFor)}</span>
      </button>`).join('');

    // Sessions list
    document.getElementById('sessions-count').textContent =
      `${store.sessions.length} session${store.sessions.length === 1 ? '' : 's'}`;
    const sessionsWrap = document.getElementById('sessions-list-wrap');
    if (store.sessions.length === 0) {
      sessionsWrap.innerHTML = `<div class="profile-empty">No sessions yet. Tap the orb on Home to begin.</div>`;
    } else {
      const recent = store.sessions.slice(0, 10);
      sessionsWrap.innerHTML = `<div class="session-list">${recent.map(s => `
        <div class="session-item ${s.kind === 'technique' ? 'tech' : 'med'}"
             onclick="${s.kind === 'technique' ? `navigate('techniques'); showTechniqueDetail('${s.practiceId}')` : `navigate('meditate'); showMeditationDetail('${s.practiceId}')`}">
          <span class="sess-kind">${s.kind === 'technique' ? 'Breath' : 'Meditation'}</span>
          <span class="sess-title">${escapeHtml(s.practiceTitle)}</span>
          <span class="sess-time">${formatRelative(s.ts)}</span>
        </div>`).join('')}</div>`;
    }

    // Reading list — show all books with mark-as-read controls
    const readCount = Object.values(store.readingList).filter(v => v === 'read').length;
    document.getElementById('reading-count').textContent =
      `${readCount} of ${LIBRARY.books.length} read`;
    document.getElementById('reading-list-wrap').innerHTML = `<div class="reading-list">${LIBRARY.books.map(b => {
      const status = store.readingList[b.title] || 'unread';
      const isRead = status === 'read';
      return `
        <div class="reading-item ${isRead ? 'read' : ''}">
          <span class="read-author">${escapeHtml(b.author)}</span>
          <span class="read-title">${escapeHtml(b.title)}</span>
          <button class="read-mark" onclick="toggleRead('${b.title.replace(/'/g, "\\'")}')">
            ${isRead ? '✓ Read' : 'Mark read'}
          </button>
        </div>`;
    }).join('')}</div>`;

    renderProBanner();
    if (auth.loggedIn) renderMissions();

    // New profile sections
    renderProfileHero();
    renderTriadMasteryBtn();
    renderSnapshotStats();
    renderAchievementPreview();
    renderActiveMissionsSection();

    // Always restore main view (hide sub-pages if open)
    const achPage = document.getElementById('profile-achievements-page');
    const masteryPage = document.getElementById('profile-triad-mastery-page');
    const mainView = document.getElementById('profile-main-view');
    if (achPage) achPage.style.display = 'none';
    if (masteryPage) masteryPage.style.display = 'none';
    if (mainView) mainView.style.display = '';
  }

  /* ════════════════ PROFILE OVERHAUL — NEW FUNCTIONS ════════════════ */

  /* ── Triad profile state ── */
  let _triadProfile = null;
  let _triadNameSuggestion = null;
  let _triadOnboardDismissed = false;

  async function loadTriadProfile() {
    if (!auth.loggedIn) return;
    try {
      const res = await fetch('/user/profile', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();
      _triadProfile = data.profile || {};
    } catch(e) {}
  }

  async function fetchTriadNameSuggestion() {
    try {
      const res = await fetch('/triad-name/generate', { credentials: 'same-origin' });
      const data = await res.json();
      _triadNameSuggestion = data.name || '';
      const el = document.getElementById('triad-suggestion-text');
      if (el) el.textContent = _triadNameSuggestion;
    } catch(e) {}
  }

  async function refreshTriadSuggestion() {
    const el = document.getElementById('triad-suggestion-text');
    if (el) el.textContent = '…';
    await fetchTriadNameSuggestion();
  }

  async function claimTriadName(name) {
    if (!name || name === '…') return;
    try {
      const res = await fetch('/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ triad_name: name })
      });
      const data = await res.json();
      if (data.error === 'name_taken') {
        showToast({ icon: '⚠️', label: 'That name is already taken', autohide: 2500 });
        _triadNameSuggestion = null;
        await fetchTriadNameSuggestion();
        return;
      }
      if (data.success) {
        _triadProfile = data.profile;
        showToast({ icon: '✨', kicker: 'Welcome', label: `You are ${escapeHtml(name)}`, autohide: 3000 });
        renderProfileHero();
      }
    } catch(e) {
      showToast({ icon: '⚠️', label: 'Failed to save name', autohide: 2500 });
    }
  }

  function claimCurrentTriadName() {
    claimTriadName(_triadNameSuggestion);
  }

  function dismissTriadOnboarding() {
    _triadOnboardDismissed = true;
    renderProfileHero();
  }

  /* ── Hero area ── */
  function renderProfileHero() {
    updateAccountSectionTitle();
    const el = document.getElementById('profile-hero');
    if (!el) return;
    if (!auth.loggedIn) { el.innerHTML = ''; return; }

    const triadName = _triadProfile && _triadProfile.triad_name;

    if (triadName) {
      el.innerHTML = `
        <div class="profile-hero-welcome">
          <div class="profile-hero-name">Welcome back, ${escapeHtml(triadName)}</div>
          <div class="profile-hero-sub">${escapeHtml(auth.email || '')}</div>
          <button class="profile-hero-continue" onclick="navigate('home')">Continue Your Daily Practice</button>
        </div>`;
    } else if (!_triadOnboardDismissed) {
      const suggestion = _triadNameSuggestion || '…';
      el.innerHTML = `
        <div class="triad-onboard-card">
          <div class="triad-onboard-title">You've arrived.</div>
          <div class="triad-onboard-sub">Give yourself a Triad Name.</div>
          <div class="triad-name-suggestion">
            <span class="triad-suggestion-text" id="triad-suggestion-text">${escapeHtml(suggestion)}</span>
            <button class="triad-refresh-btn" onclick="refreshTriadSuggestion()" title="Generate another">↻</button>
          </div>
          <div class="triad-onboard-actions">
            <button class="triad-claim-btn" onclick="claimCurrentTriadName()">Claim this name</button>
            <button class="triad-later-btn" onclick="dismissTriadOnboarding()">I'll do this later</button>
          </div>
        </div>`;
      if (!_triadNameSuggestion) fetchTriadNameSuggestion();
    } else {
      el.innerHTML = `
        <div class="profile-hero-welcome">
          <div class="profile-hero-sub">${escapeHtml(auth.email || '')}</div>
          <button class="profile-hero-continue" onclick="navigate('home')">Continue Your Daily Practice</button>
        </div>`;
    }
  }

  /* ── Snapshot stats (3 cards) ── */
  function renderSnapshotStats() {
    const el = document.getElementById('profile-snapshot');
    if (!el) return;

    const streak = effectiveStreak();
    const totalSessions = store.sessions.length;
    const breathCount   = store.sessions.filter(s => s.kind === 'technique').length;
    const meditCount    = store.sessions.filter(s => s.kind === 'meditation').length;

    const sessionsCard = `
      <div class="snap-card">
        <div class="snap-icon">✓</div>
        <div class="snap-value">${totalSessions}</div>
        <div class="snap-label">sessions complete</div>
        ${totalSessions > 0 ? `<div class="snap-split">${breathCount} breath · ${meditCount} meditation</div>` : ''}
      </div>`;

    const _MC = { body: '#C9A96E', mind: '#4ECDC4', spirit: '#9B8EC4' };
    const niBody = nextLevelInfo('body');
    const niMind = nextLevelInfo('mind');

    let milestoneCard;
    if (!niBody && !niMind) {
      milestoneCard = `
        <div class="snap-card">
          <div class="snap-icon">🏆</div>
          <div class="snap-value" style="font-size:1rem;line-height:1.4">Grandmaster</div>
          <div class="snap-label">all pillars mastered</div>
        </div>`;
    } else if (totalSessions === 0) {
      milestoneCard = `
        <div class="snap-card">
          <div class="snap-icon">🌱</div>
          <div class="snap-milestone-hint" style="margin-top:6px">Start your first session to begin your journey</div>
        </div>`;
    } else {
      let best = null;
      if (niBody && niBody.sessionsNeeded !== null) best = { pillar: 'body', ni: niBody };
      if (niMind && niMind.sessionsNeeded !== null) {
        if (!best || niMind.sessionsNeeded < best.ni.sessionsNeeded) best = { pillar: 'mind', ni: niMind };
      }
      if (!best) {
        milestoneCard = `
          <div class="snap-card">
            <div class="snap-icon">🔮</div>
            <div class="snap-milestone-hint" style="margin-top:6px">Keep practising to master the pillars</div>
          </div>`;
      } else {
        const bPillar = best.pillar;
        const bLevel  = best.ni.nextLevel - 1;
        const bPts    = calcPillarPoints(bPillar);
        const fromPts = pointsForLevel(bLevel);
        const toPts   = pointsForLevel(best.ni.nextLevel);
        const range   = toPts - fromPts;
        const pct     = range > 0 ? Math.min(100, Math.round(((bPts - fromPts) / range) * 100)) : 0;
        const colour  = _MC[bPillar];
        const curRank = getRank(bPillar, bLevel);
        const rankLabel = best.ni.nextRank !== curRank ? best.ni.nextRank : `Level ${best.ni.nextLevel}`;
        const n = best.ni.sessionsNeeded;
        const hint = n === 1 ? `1 more session to ${rankLabel}` : `${n} more sessions to ${rankLabel}`;
        milestoneCard = `
          <div class="snap-card pillar-milestone" style="border-left: 3px solid ${colour}">
            <div class="snap-milestone-kicker">Next Milestone</div>
            <div class="snap-milestone-hint">${hint}</div>
            <div class="snap-milestone-bar"><div class="snap-milestone-fill" style="width:${pct}%"></div></div>
          </div>`;
      }
    }

    el.innerHTML = `
      <div class="snap-card">
        <div class="snap-icon">🔥</div>
        <div class="snap-value">${streak}</div>
        <div class="snap-label">day streak</div>
      </div>
      ${sessionsCard}
      ${milestoneCard}`;
  }

  function renderTriadMasteryBtn() {
    const btn = document.getElementById('triad-mastery-btn');
    if (!btn) return;
    const total = store.mastery?.total || 0;
    const pill = total > 0
      ? `<span class="tm-btn-level">Lv.${total}</span>`
      : `<span class="tm-btn-level">Begin</span>`;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M12 3L2 20h20L12 3z"/>
        <path d="M12 9l-4 8h8l-4-8z"/>
      </svg>
      Triad Mastery
      ${pill}`;
  }

  /* ── Achievement preview (2 cards + View All button) ── */
  function renderAchievementPreview() {
    const el = document.getElementById('profile-achievement-preview');
    if (!el) return;

    const trulyUnlocked = a => !!store.achievements[a.id] && (a.tier === 'guest' || store.tier === 'pro');
    const unlockedList = ACHIEVEMENTS.filter(trulyUnlocked);
    const unlockedCount = unlockedList.length;

    const lastUnlocked = unlockedList
      .map(a => ({ a, ts: store.achievements[a.id] || '' }))
      .sort((x, y) => y.ts.localeCompare(x.ts))[0];

    const candidates = ACHIEVEMENTS
      .filter(a => !trulyUnlocked(a))
      .filter(a => !(a.tier === 'pro' && store.tier !== 'pro'))
      .map(a => {
        const p = a.progress ? a.progress(store) : null;
        if (!p) return null;
        const remaining = Math.max(0, p.target - p.current);
        const pct = Math.min(100, Math.round((p.current / p.target) * 100));
        return { a, p, remaining, pct };
      })
      .filter(x => x && x.remaining > 0)
      .sort((x, y) => x.remaining - y.remaining);
    const next = candidates[0];

    const lastCard = lastUnlocked ? `
      <div class="ach-preview-card">
        <div class="ach-preview-kicker">Just unlocked</div>
        <span class="ach-preview-icon">${lastUnlocked.a.icon}</span>
        <div class="ach-preview-name">${escapeHtml(lastUnlocked.a.name)}</div>
      </div>` : `
      <div class="ach-preview-card">
        <div class="ach-preview-kicker">Achievements</div>
        <span class="ach-preview-icon">✨</span>
        <div class="ach-preview-name">None yet</div>
        <div class="ach-preview-sub">Complete a session to start</div>
      </div>`;

    const nextCard = next ? `
      <div class="ach-preview-card">
        <div class="ach-preview-kicker">Next achievement</div>
        <span class="ach-preview-icon mystery">${next.a.icon}</span>
        <div class="ach-preview-name mystery">${escapeHtml(next.a.name)}</div>
        <div class="ach-preview-sub">${next.remaining} more ${next.p.label}</div>
        <div class="ach-preview-bar"><div class="ach-preview-fill" style="width:${next.pct}%"></div></div>
      </div>` : `
      <div class="ach-preview-card">
        <div class="ach-preview-kicker">Next achievement</div>
        <span class="ach-preview-icon">🏛️</span>
        <div class="ach-preview-name">All unlocked!</div>
      </div>`;

    el.innerHTML = `
      <div class="ach-preview-row">${lastCard}${nextCard}</div>
      <button class="btn-view-all-ach" onclick="showAchievementsPage()">
        <span>View All Achievements <span style="color:var(--text-muted);font-weight:400">(${unlockedCount}/${ACHIEVEMENTS.length})</span></span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
      </button>`;
  }

  /* ── Full achievements page ── */
  function showAchievementsPage() {
    const main = document.getElementById('profile-main-view');
    const page = document.getElementById('profile-achievements-page');
    if (!main || !page) return;
    main.style.display = 'none';
    page.style.display = '';
    renderAchievementsPage();
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideAchievementsPage() {
    const main = document.getElementById('profile-main-view');
    const page = document.getElementById('profile-achievements-page');
    if (main) main.style.display = '';
    if (page) page.style.display = 'none';
  }

  /* ── Triad Mastery page ── */
  function showTriadMastery() {
    const main = document.getElementById('profile-main-view');
    const page = document.getElementById('profile-triad-mastery-page');
    if (!main || !page) return;
    main.style.display = 'none';
    page.style.display = '';
    updateMastery();
    renderTriadMastery();
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideTriadMastery() {
    const main = document.getElementById('profile-main-view');
    const page = document.getElementById('profile-triad-mastery-page');
    if (main) main.style.display = '';
    if (page) page.style.display = 'none';
  }

  /* ── Mastery triangle helpers ── */

  const MT_COLOURS = { body: '#C9A96E', mind: '#4ECDC4', spirit: '#9B8EC4' };
  // Triangle vertices: Spirit(top)=150,30  Mind(bottom-left)=30,270  Body(bottom-right)=270,270
  // Centroid: 150, 190   |   Perimeter ≈ 776 (use 780 for dasharray)

  function _mtBodyPts(t)   { return `270,270 ${(270-240*t).toFixed(1)},270 ${(270-120*t).toFixed(1)},${(270-240*t).toFixed(1)}`; }
  function _mtMindPts(t)   { return `30,270 ${(30+120*t).toFixed(1)},${(270-240*t).toFixed(1)} ${(30+240*t).toFixed(1)},270`; }
  function _mtSpiritPts(t) { return `150,30 ${(150-120*t).toFixed(1)},${(30+240*t).toFixed(1)} ${(150+120*t).toFixed(1)},${(30+240*t).toFixed(1)}`; }

  function _masteryAnimateFills() {
    const m      = store.mastery;
    const tBody   = (m.body.level   || 0) / 33;
    const tMind   = (m.mind.level   || 0) / 33;
    const tSpirit = (m.spirit.level || 0) / 33;
    const start   = performance.now();
    const dur     = 1500;
    function ease(x) { return 1 - Math.pow(1 - x, 3); }
    function tick(now) {
      const el = document.getElementById('mt-fill-body');
      if (!el) return;
      const dt = now - start;
      const pS = ease(Math.min(Math.max((dt - 300)  / dur, 0), 1));
      const pM = ease(Math.min(Math.max((dt - 600)  / dur, 0), 1));
      const pB = ease(Math.min(Math.max((dt - 900)  / dur, 0), 1));
      document.getElementById('mt-fill-spirit')?.setAttribute('points', _mtSpiritPts(pS * tSpirit));
      document.getElementById('mt-fill-mind')  ?.setAttribute('points', _mtMindPts(pM   * tMind));
      document.getElementById('mt-fill-body')  ?.setAttribute('points', _mtBodyPts(pB   * tBody));
      if (pB < 1 || pM < 1 || pS < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function _masteryVertexFlash(pillar) {
    const map = { body: 'mt-vc-body', mind: 'mt-vc-mind', spirit: 'mt-vc-spirit' };
    const el = document.getElementById(map[pillar]);
    if (!el) return;
    el.classList.remove('mastery-vertex-flash');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add('mastery-vertex-flash');
    setTimeout(() => el.classList.remove('mastery-vertex-flash'), 950);
  }

  function _masteryBarHtml(pillar, level, rank, ni) {
    const col  = MT_COLOURS[pillar];
    const pct  = ((level / 33) * 100).toFixed(1);
    const name = pillar.charAt(0).toUpperCase() + pillar.slice(1);
    let nextTxt;
    if (level >= 33) {
      nextTxt = 'Maximum level reached';
    } else if (ni && ni.sessionsNeeded != null) {
      nextTxt = `${ni.sessionsNeeded} session${ni.sessionsNeeded === 1 ? '' : 's'} to Level ${ni.nextLevel}`;
    } else {
      nextTxt = 'Complete sessions to earn XP';
    }
    return `
      <div class="mt-bar-row">
        <div class="mt-bar-head">
          <span class="mt-bar-pillar" style="color:${col}">${name}</span>
          <span class="mt-bar-level">Lv ${level > 0 ? level : '—'}</span>
          <span class="mt-bar-rank">${rank}</span>
        </div>
        <div class="mt-bar-track">
          <div class="mt-bar-fill" style="width:0%;background:${col}" data-target="${pct}%"></div>
        </div>
        <div class="mt-bar-next">${nextTxt}</div>
      </div>`;
  }

  function renderTriadMastery() {
    const el = document.getElementById('profile-triad-mastery-page');
    if (!el) return;

    const m       = store.mastery;
    const bodyL   = m.body.level   || 0;
    const mindL   = m.mind.level   || 0;
    const spiritL = m.spirit.level || 0;
    const totalL  = m.total || 0;
    const bodyR   = m.body.rank   || 'Unranked';
    const mindR   = m.mind.rank   || 'Unranked';
    const spiritR = m.spirit.rank || 'Unranked';

    const niBody  = nextLevelInfo('body');
    const niMind  = nextLevelInfo('mind');
    const niSpirit = null; // Spirit sessions not yet built

    const lvTxt = n => n > 0 ? `Lv&nbsp;${n}` : '—';

    el.innerHTML = `
      <div class="triad-mastery-page">
        <button class="triad-mastery-back" onclick="hideTriadMastery()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to Profile
        </button>

        <div class="triad-mastery-header">
          <div class="triad-mastery-logo">${typeof TRIAD_LOGO_SVG !== 'undefined' ? TRIAD_LOGO_SVG : ''}</div>
          <div class="triad-mastery-title">Triad Mastery</div>
          <div class="triad-mastery-subtitle">Your journey across Mind, Body and Spirit</div>
        </div>

        <div class="mt-svg-wrap">
          <svg id="mastery-triangle-svg"
               viewBox="-5 -38 310 388"
               xmlns="http://www.w3.org/2000/svg"
               style="width:100%;max-width:320px;display:block;margin:0 auto;overflow:visible"
               aria-label="Triad Mastery triangle">

            <!-- Outer circle -->
            <circle cx="150" cy="190" r="135"
                    fill="none" stroke="var(--border)" stroke-width="1" opacity="0.7"/>

            <!-- Background triangle (stroke draws in) -->
            <polygon id="mt-bg-tri"
                     points="150,30 30,270 270,270"
                     fill="none" stroke="var(--border)" stroke-width="1.5"
                     stroke-dasharray="780" stroke-dashoffset="780"/>

            <!-- Pillar fill slices (animated from vertex) -->
            <polygon id="mt-fill-spirit" points="150,30 150,30 150,30"
                     fill="${MT_COLOURS.spirit}" opacity="0.28"/>
            <polygon id="mt-fill-mind"   points="30,270 30,270 30,270"
                     fill="${MT_COLOURS.mind}"   opacity="0.28"/>
            <polygon id="mt-fill-body"   points="270,270 270,270 270,270"
                     fill="${MT_COLOURS.body}"   opacity="0.28"/>

            <!-- Vertex accent circles -->
            <circle id="mt-vc-spirit" cx="150" cy="30"  r="8" fill="${MT_COLOURS.spirit}"/>
            <circle id="mt-vc-mind"   cx="30"  cy="270" r="8" fill="${MT_COLOURS.mind}"/>
            <circle id="mt-vc-body"   cx="270" cy="270" r="8" fill="${MT_COLOURS.body}"/>

            <!-- Central golden spark -->
            <circle id="mt-center-dot" cx="150" cy="190" r="10"
                    fill="${MT_COLOURS.body}" class="mastery-center-pulse" opacity="0"/>

            <!-- SPIRIT labels (top, middle) -->
            <text x="150" y="16"  text-anchor="middle" font-size="10" letter-spacing="1.8"
                  font-family="DM Sans,sans-serif" font-weight="600"
                  fill="var(--text-muted)">SPIRIT</text>
            <text x="150" y="3"   text-anchor="middle" font-size="15"
                  font-family="DM Sans,sans-serif" font-weight="700"
                  fill="var(--text)">${lvTxt(spiritL)}</text>
            <text x="150" y="-10" text-anchor="middle" font-size="10"
                  font-family="DM Sans,sans-serif" font-style="italic"
                  fill="${MT_COLOURS.spirit}">${spiritR}</text>

            <!-- MIND labels (bottom-left, start) -->
            <text x="14" y="288" text-anchor="start" font-size="10" letter-spacing="1.8"
                  font-family="DM Sans,sans-serif" font-weight="600"
                  fill="var(--text-muted)">MIND</text>
            <text x="14" y="303" text-anchor="start" font-size="15"
                  font-family="DM Sans,sans-serif" font-weight="700"
                  fill="var(--text)">${lvTxt(mindL)}</text>
            <text x="14" y="317" text-anchor="start" font-size="10"
                  font-family="DM Sans,sans-serif" font-style="italic"
                  fill="${MT_COLOURS.mind}">${mindR}</text>

            <!-- BODY labels (bottom-right, end) -->
            <text x="286" y="288" text-anchor="end" font-size="10" letter-spacing="1.8"
                  font-family="DM Sans,sans-serif" font-weight="600"
                  fill="var(--text-muted)">BODY</text>
            <text x="286" y="303" text-anchor="end" font-size="15"
                  font-family="DM Sans,sans-serif" font-weight="700"
                  fill="var(--text)">${lvTxt(bodyL)}</text>
            <text x="286" y="317" text-anchor="end" font-size="10"
                  font-family="DM Sans,sans-serif" font-style="italic"
                  fill="${MT_COLOURS.body}">${bodyR}</text>
          </svg>
        </div>

        <!-- Total level -->
        <div class="mt-total-wrap">
          <div class="mt-total-label">Total Level</div>
          <div class="mt-total-number">${totalL > 0 ? totalL : '—'}</div>
        </div>

        <!-- Progress bars -->
        <div class="mt-bars">
          ${_masteryBarHtml('body',   bodyL,   bodyR,   niBody)}
          ${_masteryBarHtml('mind',   mindL,   mindR,   niMind)}
          ${_masteryBarHtml('spirit', spiritL, spiritR, niSpirit)}
        </div>
      </div>`;

    // Kick off animations after DOM paint
    requestAnimationFrame(() => {
      // Outline draw-in
      const bgTri = document.getElementById('mt-bg-tri');
      if (bgTri) {
        bgTri.style.transition = 'stroke-dashoffset 0.8s ease-out 0.05s';
        bgTri.style.strokeDashoffset = '0';
      }
      // Fill slices
      _masteryAnimateFills();
      // Center dot
      const dot = document.getElementById('mt-center-dot');
      if (dot) {
        dot.style.transition = 'opacity 0.6s ease-out 1.4s';
        dot.style.opacity = '1';
      }
      // Progress bars
      el.querySelectorAll('.mt-bar-fill').forEach(b => {
        b.style.transition = 'width 1s ease-out 0.6s';
        b.style.width = b.dataset.target;
      });
    });
  }

  function renderAchievementsPage() {
    const el = document.getElementById('profile-achievements-page');
    if (!el) return;

    const trulyUnlocked = a => !!store.achievements[a.id] && (a.tier === 'guest' || store.tier === 'pro');
    const unlocked = ACHIEVEMENTS.filter(trulyUnlocked);
    const locked   = ACHIEVEMENTS.filter(a => !trulyUnlocked(a));

    const cardHtml = (a, idx) => {
      const isUnlocked = trulyUnlocked(a);
      const p = a.progress ? a.progress(store) : null;
      const pct = p ? Math.min(100, Math.round((p.current / p.target) * 100)) : 0;
      if (isUnlocked) {
        return `
          <div class="ach-full-card unlocked" style="animation-delay:${idx * 55}ms">
            <span class="ach-full-card-icon">${a.icon}</span>
            <div class="ach-full-card-name">${escapeHtml(a.name)}</div>
            <div class="ach-full-card-sub">Unlocked — ${escapeHtml(a.hint)}</div>
          </div>`;
      }
      return `
        <div class="ach-full-card" style="animation-delay:${idx * 55}ms">
          <span class="ach-full-card-icon locked">🔒</span>
          <div class="ach-full-card-name locked">${escapeHtml(a.name)}</div>
          <div class="ach-full-card-sub">${p ? `${p.current} of ${p.target} ${p.label}` : escapeHtml(a.hint)}</div>
          ${p ? `<div class="ach-full-card-bar"><div class="ach-full-card-fill" style="width:${pct}%"></div></div>` : ''}
        </div>`;
    };

    el.innerHTML = `
      <div class="ach-page-head">
        <button class="ach-page-back" onclick="hideAchievementsPage()">← Back</button>
        <div class="ach-page-title">Your Achievements</div>
      </div>
      ${unlocked.length ? `
        <div class="ach-page-section-head">Unlocked (${unlocked.length})</div>
        <div class="ach-page-grid">${unlocked.map((a, i) => cardHtml(a, i)).join('')}</div>` : ''}
      <div class="ach-page-section-head">Locked (${locked.length})</div>
      <div class="ach-page-grid">${locked.map((a, i) => cardHtml(a, i + unlocked.length)).join('')}</div>`;
  }

  /* ── Active missions section ── */
  function renderActiveMissionsSection() {
    const el = document.getElementById('profile-missions-section');
    if (!el || !auth.loggedIn) { if (el) el.innerHTML = ''; return; }

    const activeMissions = MISSIONS.filter(m => _getMissionState(m.missionId).status === 'ACTIVE');

    if (activeMissions.length === 0) {
      el.innerHTML = `
        <div class="missions-prompt-card">
          <div class="missions-prompt-title">Ready to begin your first mission?</div>
          <div class="missions-prompt-desc">21-day habit programmes that build a lasting daily practice — one session at a time.</div>
          <button class="missions-prompt-btn" onclick="openMissionsAccordion()">Explore Missions</button>
        </div>`;
      return;
    }

    el.innerHTML = `<div style="margin-bottom:8px;font-size:0.64rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);font-weight:600">Active Missions</div>` +
      activeMissions.map(mission => {
        const ms   = _getMissionState(mission.missionId);
        const day  = _missionDayNumber(mission.missionId);
        const pct  = Math.min(100, Math.round((day / mission.durationDays) * 100));
        const done = _missionActiveTodayComplete(mission.missionId);
        return `
          <div class="mission-card">
            <div class="mission-card-header">
              <div class="mission-card-titles">
                <div class="mission-title">${escapeHtml(mission.title)}</div>
                <div class="mission-subtitle">${escapeHtml(mission.subtitle)}</div>
              </div>
              <span class="mission-status-badge mission-status--active">Day ${day} of ${mission.durationDays}</span>
            </div>
            <div class="mission-progress-bar"><div class="mission-progress-fill" style="width:${pct}%"></div></div>
            <div class="mission-today">
              <span class="mission-today-label">Today's drill</span>
              <span class="mission-today-state">${done ? '✓ Done' : '○ Pending'}</span>
            </div>
            <button class="mission-cta${done ? ' mission-cta--done' : ''}"
                    onclick="runMissionDrill('${mission.missionId}')"
                    ${done ? 'disabled' : ''}>
              ${done ? 'Done for today' : "Complete Today's Session"}
            </button>
          </div>`;
      }).join('');
  }

  function openMissionsAccordion() {
    const accBody = document.getElementById('acc-account');
    if (accBody && !accBody.classList.contains('open')) toggleAccordion('acc-account');
    setTimeout(() => {
      const target = document.getElementById('acc-account-missions');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 320);
  }

  /* ── Feedback ── */
  function updateFeedbackCharCount() {
    const ta = document.getElementById('feedback-message');
    const ct = document.getElementById('feedback-char-count');
    if (!ta || !ct) return;
    const len = ta.value.length;
    ct.textContent = `${len}/500`;
    ct.style.color = len > 460 ? 'var(--c-profile)' : '';
  }

  async function submitFeedback() {
    const ta  = document.getElementById('feedback-message');
    const btn = document.getElementById('feedback-send-btn');
    if (!ta) return;
    const msg = ta.value.trim();
    if (!msg) return;
    if (msg.length > 500) {
      showToast({ icon: '⚠️', label: 'Message too long (max 500 characters)', autohide: 2500 });
      return;
    }
    if (btn) btn.disabled = true;
    try {
      const res = await fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      if (data.success) {
        ta.value = '';
        updateFeedbackCharCount();
        showToast({ icon: '🙏', kicker: 'Thank you', label: 'Feedback sent', autohide: 3000 });
      } else {
        showToast({ icon: '⚠️', label: data.error || 'Failed to send', autohide: 2500 });
      }
    } catch(e) {
      showToast({ icon: '⚠️', label: 'Failed to send', autohide: 2500 });
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  /* ── Settings drawer ── */
  function openSettingsDrawer() {
    document.getElementById('settingsDrawer')?.classList.add('open');
    document.getElementById('settingsDrawerBackdrop')?.classList.add('open');
    updateThemeToggle();
  }

  function closeSettingsDrawer() {
    document.getElementById('settingsDrawer')?.classList.remove('open');
    document.getElementById('settingsDrawerBackdrop')?.classList.remove('open');
  }

  /* ════════════════ MISSION ENGINE ════════════════ */


  /* ── Mission store helpers ── */

  function _initMissionState(missionId) {
    return {
      missionId,
      status: 'NOT_STARTED',
      startDate: null,
      baselineDiagnosticValue: null,
      endDiagnosticValue: null,
      dailyLogs: [],
      notificationsEnabled: false
    };
  }

  function _getMissionState(missionId) {
    if (!store.missions) store.missions = {};
    if (!store.missions[missionId]) store.missions[missionId] = _initMissionState(missionId);
    return store.missions[missionId];
  }

  function _missionDayNumber(missionId) {
    const ms = _getMissionState(missionId);
    if (!ms.startDate) return 0;
    const start = new Date(ms.startDate + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    return Math.max(1, Math.floor((today - start) / 86400000) + 1);
  }

  function _missionActiveTodayComplete(missionId) {
    const today = new Date().toISOString().slice(0, 10);
    const ms = _getMissionState(missionId);
    const log = ms.dailyLogs.find(l => l.date === today);
    if (log) return log.activeCompleted;
    const mission = MISSIONS.find(m => m.missionId === missionId);
    if (!mission) return false;
    return store.sessions.some(s => s.ts.startsWith(today) && s.practiceId === mission.activeSessionId);
  }

  /* ── Module A — Diagnostic Runner ── */

  let _diagState = null;
  let _diagInterval = null;
  let _diagPhase = null; // 'mission-start' | 'mission-end'
  let _diagMissionId = null;

  function openDiagnostic(missionId, phase) {
    const mission = MISSIONS.find(m => m.missionId === missionId);
    if (!mission) return;
    _diagMissionId = missionId;
    _diagPhase = phase;
    const cfg = mission.diagnosticConfig;
    const ov = document.getElementById('diagnosticOverlay');
    if (!ov) return;
    ov.querySelector('.diag-mission-title').textContent = mission.title;
    ov.querySelector('.diag-instructions').textContent = cfg.instructions;
    _diagState = { elapsed: 0, surveyCountdown: cfg.durationSeconds, surveyValue: 5, running: false, done: false };
    if (cfg.type === 'TIMED_HOLD') {
      ov.querySelector('.diag-timed').style.display = '';
      ov.querySelector('.diag-survey').style.display = 'none';
      ov.querySelector('.diag-timer-display').textContent = '0';
      ov.querySelector('.diag-result').style.display = 'none';
    } else {
      ov.querySelector('.diag-timed').style.display = 'none';
      ov.querySelector('.diag-survey').style.display = '';
      ov.querySelector('.diag-survey-countdown').textContent = cfg.durationSeconds;
      ov.querySelector('.diag-slider-wrap').style.display = 'none';
      ov.querySelector('.diag-save-survey').style.display = 'none';
      ov.querySelector('.diag-result').style.display = 'none';
      _diagStartSurveyCountdown(cfg.durationSeconds);
    }
    ov.style.display = 'flex';
  }

  function closeDiagnostic() {
    if (_diagInterval) { clearInterval(_diagInterval); _diagInterval = null; }
    const ov = document.getElementById('diagnosticOverlay');
    if (ov) ov.style.display = 'none';
    _diagState = null;
  }

  function diagStartTimer() {
    if (!_diagState || _diagState.running || _diagState.done) return;
    _diagState.running = true;
    _diagState.elapsed = 0;
    document.getElementById('diag-start-btn').style.display = 'none';
    document.getElementById('diag-stop-btn').style.display = '';
    _diagInterval = setInterval(() => {
      _diagState.elapsed++;
      document.getElementById('diagnosticOverlay').querySelector('.diag-timer-display').textContent = _diagState.elapsed;
    }, 1000);
  }

  function diagStopTimer() {
    if (!_diagState || !_diagState.running) return;
    clearInterval(_diagInterval); _diagInterval = null;
    _diagState.running = false;
    _diagState.done = true;
    const score = _diagState.elapsed;
    _saveDiagnosticScore(score);
    document.getElementById('diag-stop-btn').style.display = 'none';
    const ov = document.getElementById('diagnosticOverlay');
    const resultEl = ov.querySelector('.diag-result');
    resultEl.style.display = '';
    resultEl.textContent = _diagResultMessage(score);
  }

  function _diagStartSurveyCountdown(seconds) {
    if (_diagInterval) clearInterval(_diagInterval);
    let remaining = seconds;
    _diagInterval = setInterval(() => {
      remaining--;
      const ov = document.getElementById('diagnosticOverlay');
      if (!ov) { clearInterval(_diagInterval); return; }
      ov.querySelector('.diag-survey-countdown').textContent = remaining;
      if (remaining <= 0) {
        clearInterval(_diagInterval); _diagInterval = null;
        ov.querySelector('.diag-survey-countdown-wrap').style.display = 'none';
        ov.querySelector('.diag-slider-wrap').style.display = '';
        ov.querySelector('.diag-save-survey').style.display = '';
      }
    }, 1000);
  }

  function diagSaveSurvey() {
    const ov = document.getElementById('diagnosticOverlay');
    if (!ov) return;
    const slider = ov.querySelector('.diag-slider');
    const score = parseInt(slider.value, 10);
    _saveDiagnosticScore(score);
    ov.querySelector('.diag-slider-wrap').style.display = 'none';
    ov.querySelector('.diag-save-survey').style.display = 'none';
    const resultEl = ov.querySelector('.diag-result');
    resultEl.style.display = '';
    resultEl.textContent = _diagResultMessage(score);
  }

  function _saveDiagnosticScore(score) {
    const ms = _getMissionState(_diagMissionId);
    const mission = MISSIONS.find(m => m.missionId === _diagMissionId);
    if (_diagPhase === 'mission-start') {
      ms.baselineDiagnosticValue = score;
      ms.status = 'ACTIVE';
      ms.startDate = new Date().toISOString().slice(0, 10);
    } else {
      ms.endDiagnosticValue = score;
      ms.status = 'COMPLETED';
    }
    store.missions[_diagMissionId] = ms;
    saveStore(store);
    setTimeout(() => { closeDiagnostic(); renderMissions(); renderActiveMissionsSection(); }, 2000);
  }

  function _diagResultMessage(score) {
    const mission = MISSIONS.find(m => m.missionId === _diagMissionId);
    if (!mission) return '';
    if (mission.diagnosticConfig.type === 'TIMED_HOLD') {
      if (score < 10) return `Score: ${score}s — Baseline saved. Let\'s build from here.`;
      if (score < 25) return `Score: ${score}s — Good starting point. 21 days will transform this.`;
      return `Score: ${score}s — Strong baseline. Track your progress over 21 days.`;
    } else {
      if (score >= 7) return `Score: ${score}/10 — High tension noted. This mission is for you.`;
      if (score >= 4) return `Score: ${score}/10 — Moderate tension. Let\'s clear it.`;
      return `Score: ${score}/10 — Good baseline. 21 days to lock it in.`;
    }
  }

  /* ── Module B — Drill runner + session complete detection ── */

  let _pendingMissionDrill = null;

  function runMissionDrill(missionId) {
    _pendingMissionDrill = { missionId };
    const mission = MISSIONS.find(m => m.missionId === missionId);
    if (mission) openSession(mission.activeSessionId);
  }

  function _initMissionSessionObserver() {
    const el = document.getElementById('sessionComplete');
    if (!el) return;
    new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.attributeName === 'class' && el.classList.contains('active') && _pendingMissionDrill) {
          const { missionId } = _pendingMissionDrill;
          _pendingMissionDrill = null;
          const today = new Date().toISOString().slice(0, 10);
          const ms = _getMissionState(missionId);
          if (ms.status !== 'ACTIVE') return;
          let log = ms.dailyLogs.find(l => l.date === today);
          if (!log) {
            log = { day: _missionDayNumber(missionId), date: today, activeCompleted: false, passiveComplianceCount: 0 };
            ms.dailyLogs.push(log);
          }
          log.activeCompleted = true;
          store.missions[missionId] = ms;
          saveStore(store);
        }
      }
    }).observe(el, { attributes: true });
  }

  /* ── Module C — Notification Scheduler ── */

  const _missionNotifTimers = {};

  function toggleMissionNotifications(missionId) {
    const ms = _getMissionState(missionId);
    if (ms.notificationsEnabled) {
      _disableMissionNotifications(missionId);
    } else {
      _enableMissionNotifications(missionId);
    }
  }

  function _enableMissionNotifications(missionId) {
    if (!('Notification' in window)) {
      showToast({ icon: 'ℹ️', label: 'Notifications not supported in this browser. Try desktop Chrome or Android Chrome.', autohide: 4000 });
      return;
    }
    if (Notification.permission === 'denied') {
      showToast({ icon: '🔕', label: 'Notifications are blocked. Please allow them in your browser settings.', autohide: 4000 });
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') return;
      const ms = _getMissionState(missionId);
      ms.notificationsEnabled = true;
      store.missions[missionId] = ms;
      saveStore(store);
      _scheduleMissionNotifications(missionId);
      renderMissions(); renderActiveMissionsSection();
    });
  }

  function _disableMissionNotifications(missionId) {
    if (_missionNotifTimers[missionId]) {
      clearInterval(_missionNotifTimers[missionId]);
      delete _missionNotifTimers[missionId];
    }
    const ms = _getMissionState(missionId);
    ms.notificationsEnabled = false;
    store.missions[missionId] = ms;
    saveStore(store);
    renderMissions(); renderActiveMissionsSection();
  }

  function _scheduleMissionNotifications(missionId) {
    const mission = MISSIONS.find(m => m.missionId === missionId);
    if (!mission?.passiveTriggers?.length) return;
    const trigger = mission.passiveTriggers[0];
    const intervalMs = trigger.defaultIntervalMinutes * 60 * 1000;
    if (_missionNotifTimers[missionId]) clearInterval(_missionNotifTimers[missionId]);
    _missionNotifTimers[missionId] = setInterval(() => {
      const hour = new Date().getHours();
      if (hour < 9 || hour >= 21) return;
      const n = new Notification('Triad · ' + mission.title, {
        body: trigger.templateText,
        tag: 'triad-mission-' + missionId,
        icon: '/favicon.ico'
      });
      n.onclick = () => {
        window.focus();
        _incrementPassiveCompliance(missionId);
        n.close();
      };
    }, intervalMs);
  }

  function _incrementPassiveCompliance(missionId) {
    const today = new Date().toISOString().slice(0, 10);
    const ms = _getMissionState(missionId);
    let log = ms.dailyLogs.find(l => l.date === today);
    if (!log) {
      log = { day: _missionDayNumber(missionId), date: today, activeCompleted: false, passiveComplianceCount: 0 };
      ms.dailyLogs.push(log);
    }
    log.passiveComplianceCount++;
    store.missions[missionId] = ms;
    saveStore(store);
  }

  function _restoreMissionNotifications() {
    MISSIONS.forEach(mission => {
      const ms = _getMissionState(mission.missionId);
      if (ms.notificationsEnabled && ms.status === 'ACTIVE' && Notification.permission === 'granted') {
        _scheduleMissionNotifications(mission.missionId);
      }
    });
  }

  /* ── Mission profile render ── */

  function renderMissions() {
    const el = document.getElementById('profile-missions-block');
    if (!el) return;
    if (!auth.loggedIn) { el.innerHTML = ''; return; }

    // Update missions badge on accordion button
    const activeMissionCount = MISSIONS.filter(m => _getMissionState(m.missionId).status === 'ACTIVE').length;
    const mBadge = document.getElementById('missions-active-count');
    if (mBadge) { mBadge.textContent = activeMissionCount; mBadge.style.display = activeMissionCount > 0 ? '' : 'none'; }

    el.innerHTML = MISSIONS.map(mission => {
      const ms = _getMissionState(mission.missionId);
      const day = ms.status === 'ACTIVE' ? _missionDayNumber(mission.missionId) : 0;
      const pct = ms.status === 'ACTIVE'
        ? Math.min(100, Math.round((day / mission.durationDays) * 100))
        : ms.status === 'COMPLETED' ? 100 : 0;
      const todayDone = ms.status === 'ACTIVE' && _missionActiveTodayComplete(mission.missionId);
      const isFinalDay = ms.status === 'ACTIVE' && day >= mission.durationDays;
      const statusLabel = ms.status === 'NOT_STARTED' ? 'Not Started'
        : ms.status === 'ACTIVE' ? `Day ${day} of ${mission.durationDays}`
        : 'Completed';
      const statusClass = ms.status === 'NOT_STARTED' ? 'mission-status--new'
        : ms.status === 'ACTIVE' ? 'mission-status--active'
        : 'mission-status--done';

      let bodyHtml = '';

      if (ms.status === 'NOT_STARTED') {
        bodyHtml = `
          <p class="mission-desc">${escapeHtml(mission.description)}</p>
          <button class="mission-cta" onclick="openDiagnostic('${mission.missionId}','mission-start')">Start Mission</button>`;

      } else if (ms.status === 'ACTIVE') {
        bodyHtml = `
          <div class="mission-today">
            <span class="mission-today-label">Today's drill</span>
            <span class="mission-today-state">${todayDone ? '✓ Done' : '○ Pending'}</span>
          </div>
          ${isFinalDay
            ? `<button class="mission-cta mission-cta--assess" onclick="openDiagnostic('${mission.missionId}','mission-end')">Final Assessment</button>`
            : `<button class="mission-cta${todayDone ? ' mission-cta--done' : ''}" onclick="runMissionDrill('${mission.missionId}')" ${todayDone ? 'disabled' : ''}>Complete Today's Session</button>`
          }
          <div class="mission-notif-row">
            <span class="mission-notif-label">Reminders</span>
            <button class="mission-notif-toggle ${ms.notificationsEnabled ? 'on' : ''}" onclick="toggleMissionNotifications('${mission.missionId}')">
              ${ms.notificationsEnabled ? 'On' : 'Off'}
            </button>
          </div>
          ${!('Notification' in window) ? '<p class="mission-notif-note">Notifications work best on desktop or Android Chrome. iOS support coming soon.</p>' : ''}`;

      } else {
        const baseLabel = mission.diagnosticConfig.type === 'TIMED_HOLD' ? 'seconds' : '/10';
        const improvement = ms.endDiagnosticValue !== null && ms.baselineDiagnosticValue !== null
          ? ms.endDiagnosticValue - ms.baselineDiagnosticValue : null;
        const improvStr = improvement !== null
          ? (improvement > 0 ? `+${improvement}` : `${improvement}`) + ' ' + baseLabel : '';
        bodyHtml = `
          <div class="mission-complete-msg">🎯 Mission complete — 21 days done.</div>
          ${ms.baselineDiagnosticValue !== null ? `
          <div class="mission-scores">
            <div class="mission-score-item"><span class="mission-score-label">Baseline</span><span class="mission-score-val">${ms.baselineDiagnosticValue}${baseLabel === 'seconds' ? 's' : '/10'}</span></div>
            <div class="mission-score-item"><span class="mission-score-label">Final</span><span class="mission-score-val">${ms.endDiagnosticValue !== null ? ms.endDiagnosticValue + (baseLabel === 'seconds' ? 's' : '/10') : '—'}</span></div>
            ${improvStr ? `<div class="mission-score-item"><span class="mission-score-label">Change</span><span class="mission-score-val">${improvStr}</span></div>` : ''}
          </div>` : ''}
          <button class="mission-cta mission-cta--restart" onclick="_missionRestart('${mission.missionId}')">Restart Mission</button>`;
      }

      return `
        <div class="mission-card">
          <div class="mission-card-header">
            <div class="mission-card-titles">
              <div class="mission-title">${escapeHtml(mission.title)}</div>
              <div class="mission-subtitle">${escapeHtml(mission.subtitle)}</div>
            </div>
            <span class="mission-status-badge ${statusClass}">${statusLabel}</span>
          </div>
          <div class="mission-progress-bar"><div class="mission-progress-fill" style="width:${pct}%"></div></div>
          ${bodyHtml}
        </div>`;
    }).join('');
  }

  function _missionRestart(missionId) {
    if (_missionNotifTimers[missionId]) { clearInterval(_missionNotifTimers[missionId]); delete _missionNotifTimers[missionId]; }
    store.missions[missionId] = _initMissionState(missionId);
    saveStore(store);
    renderMissions(); renderActiveMissionsSection();
  }

  function toggleRead(title) {
    const current = store.readingList[title];
    store.readingList[title] = current === 'read' ? 'unread' : 'read';
    saveStore(store);
    queueSync({
      type: 'reading',
      data: {
        book_id: slug(title),
        marked_read: store.readingList[title] === 'read' ? 1 : 0,
        added_at: new Date().toISOString()
      }
    });
    checkAchievements();
    renderProfile();
  }

  /* ────── Breath label animation on home orb ────── */
  const breathPhases = ['Inhale', 'Hold', 'Exhale', 'Rest'];
  let breathIdx = 0;
  function cycleBreathLabel() {
    const el = document.getElementById('breathLabel');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      breathIdx = (breathIdx + 1) % breathPhases.length;
      el.textContent = breathPhases[breathIdx];
      el.style.opacity = '0.8';
    }, 350);
    setTimeout(cycleBreathLabel, 2000);
  }

  /* ════════════════ COST CONFIRMATION + USAGE TOAST ════════════════ */

  // Claude Sonnet 4.x pricing (USD per token). Update here if the rate sheet changes.
  const PRICE_INPUT_PER_TOKEN  = 0.000003;   // $3 / 1M
  const PRICE_OUTPUT_PER_TOKEN = 0.000015;   // $15 / 1M
  const PRICE_CACHE_WRITE_RATE = 1.25;       // cache-write tokens cost 25% more than base input
  const PRICE_CACHE_READ_RATE  = 0.10;       // cache-read tokens cost 10% of base input

  // System prompt size is ~constant across calls now that the knowledge base is gone.
  // Set conservatively so the estimate doesn't undershoot.
  const SYSTEM_PROMPT_TOKEN_ESTIMATE = 320;

  // Rough char-to-token estimator. Claude tokenises closer to 3.8 chars/token in English,
  // so 4 is a slight under-estimate — good for a conservative cost ceiling.
  function estimateTokens(text) {
    if (!text) return 0;
    return Math.max(1, Math.ceil(text.length / 4));
  }

  function formatCost(usd) {
    if (usd < 0.001) return '<$0.001';
    return '$' + usd.toFixed(3);
  }

  function estimateCallCost({ messages = [], context = '', maxOutput = 2048, minOutput = 200 }) {
    const msgTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content || ''), 0);
    const contextTokens = estimateTokens(context || '');
    const inputTokens = SYSTEM_PROMPT_TOKEN_ESTIMATE + contextTokens + msgTokens;
    const inputCost = inputTokens * PRICE_INPUT_PER_TOKEN;
    return {
      inputTokens, contextTokens, msgTokens,
      minCost: inputCost + (minOutput * PRICE_OUTPUT_PER_TOKEN),
      maxCost: inputCost + (maxOutput * PRICE_OUTPUT_PER_TOKEN)
    };
  }

  /* ─── Theme toggle ─── */
  function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('triad:theme', next);
    updateThemeToggle();
    queueSync({
      type: 'preferences',
      data: { theme: next, sound_enabled: _audioEnabled ? 1 : 0 }
    });
  }

  function updateThemeToggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.getElementById('theme-opt-light')?.classList.toggle('active', !isDark);
    document.getElementById('theme-opt-dark')?.classList.toggle('active',  isDark);
    document.getElementById('settings-theme-opt-light')?.classList.toggle('active', !isDark);
    document.getElementById('settings-theme-opt-dark')?.classList.toggle('active',  isDark);
  }

  function openPaywallModal()  { document.getElementById('paywallModal').classList.add('active'); }
  function closePaywallModal() { document.getElementById('paywallModal').classList.remove('active'); }

  function requirePro() {
    if (!auth.loggedIn) { openAuthModal('signup'); return false; }
    if (store.tier !== 'pro') { openPaywallModal(); return false; }
    return true;
  }

  let _costResolver = null;
  function confirmApiCall(opts) {
    // opts: { callType: 'plan' | 'ask', messages, context, practiceTitle? }
    return new Promise((resolve) => {
      _costResolver = resolve;

      const est = estimateCallCost({
        messages: opts.messages || [],
        context: opts.context || ''
      });

      const blurb = opts.callType === 'plan'
        ? 'Generates or updates your personalised plan using Claude. Your existing plan data is not re-sent — only the conversation in this chat.'
        : `Sends only the <strong style="color: var(--c-tech)">${escapeHtml(opts.practiceTitle || 'this technique')}</strong> content (not the full library) as context for the coach.`;

      document.getElementById('costModalBlurb').innerHTML = blurb;

      document.getElementById('costBreakdown').innerHTML = `
        <div class="cost-row"><span class="cost-label">Input (est.)</span>
          <span class="cost-value">${est.inputTokens.toLocaleString()} tokens</span></div>
        <div class="cost-row"><span class="cost-label">Output (cap)</span>
          <span class="cost-value">up to 2,048 tokens</span></div>
        <div class="cost-row total"><span class="cost-label">Estimated cost</span>
          <span class="cost-value">${formatCost(est.minCost)} – ${formatCost(est.maxCost)}</span></div>
      `;

      document.getElementById('costModal').classList.add('active');
      // Focus Continue so Enter accepts
      setTimeout(() => document.getElementById('costContinueBtn').focus(), 80);
    });
  }

  function costConfirmDecide(go) {
    document.getElementById('costModal').classList.remove('active');
    const r = _costResolver;
    _costResolver = null;
    if (r) r(go);
  }

  // Compute actual USD cost from server-reported usage
  function actualCostUSD(usage) {
    if (!usage) return 0;
    const base   = (usage.input_tokens || 0) * PRICE_INPUT_PER_TOKEN;
    const cWrite = (usage.cache_creation_input_tokens || 0) * PRICE_INPUT_PER_TOKEN * PRICE_CACHE_WRITE_RATE;
    const cRead  = (usage.cache_read_input_tokens     || 0) * PRICE_INPUT_PER_TOKEN * PRICE_CACHE_READ_RATE;
    const out    = (usage.output_tokens || 0) * PRICE_OUTPUT_PER_TOKEN;
    return base + cWrite + cRead + out;
  }

  function showUsageToast(usage) {
    const region = document.getElementById('usage-toast-region');
    if (!region) return;
    const cost = actualCostUSD(usage);
    const t = document.createElement('div');
    t.className = 'usage-toast';
    const inDetail = (usage.cache_read_input_tokens || 0) > 0
      ? `${usage.input_tokens || 0} in · ${usage.cache_read_input_tokens} cached`
      : `${(usage.input_tokens || 0) + (usage.cache_creation_input_tokens || 0)} in`;
    t.innerHTML = `
      <div class="ut-body">
        <span class="ut-cost">${formatCost(cost)}</span>
        <span class="ut-detail">${inDetail} · ${usage.output_tokens || 0} out</span>
      </div>
      <button class="ut-close" onclick="this.parentElement.classList.add('fading'); setTimeout(() => this.parentElement.remove(), 300)" title="Dismiss">
        <svg viewBox="0 0 24 24"><path d="M6 6 L18 18 M18 6 L6 18"/></svg>
      </button>
    `;
    region.appendChild(t);
    // Auto-dismiss after 10s, but only if user hasn't already
    setTimeout(() => {
      if (t.parentElement) { t.classList.add('fading'); setTimeout(() => t.remove(), 300); }
    }, 10000);
  }

