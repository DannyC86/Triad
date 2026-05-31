  /* ─── Top-level render ─── */
  function renderLibrary() {
    renderLibFeatured();
    renderLibraryFilters();
    renderLibraryAllPanels();
    updateLibrarySearchUi();
  }

  function renderLibraryFilters() {
    const topicSel = document.getElementById('lib-filter-select');
    if (topicSel) topicSel.value = libUiState.activeFilters.size === 1 ? [...libUiState.activeFilters][0] : '';
    const typeSel = document.getElementById('lib-type-select');
    if (typeSel) typeSel.value = libUiState.tab;
    _syncLibPills();
  }

  function _syncLibPills() {
    const tab = libUiState.tab;
    document.querySelectorAll('#lib-pills-row .lib-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
  }

  function onLibPillClick(tab) {
    track('filter_used', { filter: tab });
    onLibTypeChange(tab);
  }

  function renderLibFeatured() {
    const scroll = document.getElementById('lib-featured-scroll');
    if (!scroll) return;
    const items = [
      {
        type: 'Meditation', title: 'Mindfulness of Breath', sub: 'Beginner · 10–60 min',
        thumbClass: 'cover-violet', icon: '🧘',
        onclick: `showKnowledgePracticeDetail('meditation','mindfulness-of-breath')`
      },
      {
        type: 'Breathwork', title: 'Box Breathing', sub: 'Beginner · 5–10 min',
        thumbClass: 'cover-sky', icon: '⬡',
        onclick: `showKnowledgePracticeDetail('technique','box-breathing')`
      },
      {
        type: 'Book', title: 'Breath', sub: 'James Nestor · 2020',
        thumbClass: 'cover-teal', icon: '🌬️',
        onclick: `openLibraryEntry('book','breath-the-new-science-of-a-lost-art')`
      }
    ];
    scroll.innerHTML = items.map(item => `
      <button class="lib-feat-card" onclick="${item.onclick}">
        <div class="lib-feat-thumb ${item.thumbClass}">${item.icon}</div>
        <div class="lib-feat-type">${item.type}</div>
        <div class="lib-feat-title">${escapeHtml(item.title)}</div>
        <div class="lib-feat-sub">${escapeHtml(item.sub)}</div>
      </button>`).join('');
  }

  function onLibFilterChange(val) {
    libUiState.activeFilters.clear();
    if (val) libUiState.activeFilters.add(val);
    _resetLibPages();
    renderLibraryAllPanels();
  }

  const _LIB_TYPE_TOPICS = {
    all:         ['Anxiety & Stress', 'Sleep', 'Focus & Performance', 'Spirituality & Consciousness', 'Science & Research', 'Ancient Traditions', 'Cold Exposure', 'Beginners'],
    books:       ['Anxiety & Stress', 'Focus & Performance', 'Spirituality & Consciousness', 'Science & Research', 'Ancient Traditions', 'Cold Exposure', 'Beginners'],
    people:      ['Anxiety & Stress', 'Sleep', 'Focus & Performance', 'Spirituality & Consciousness', 'Science & Research', 'Ancient Traditions', 'Cold Exposure', 'Beginners'],
    podcasts:    ['Anxiety & Stress', 'Sleep', 'Focus & Performance', 'Spirituality & Consciousness', 'Science & Research', 'Ancient Traditions', 'Cold Exposure', 'Beginners'],
    breathwork:  ['Anxiety & Stress', 'Sleep', 'Focus & Performance', 'Spirituality & Consciousness', 'Science & Research', 'Ancient Traditions', 'Cold Exposure', 'Beginners'],
    meditations: ['Anxiety & Stress', 'Sleep', 'Focus & Performance', 'Spirituality & Consciousness', 'Science & Research', 'Beginners'],
  };

  function onLibTypeChange(val) {
    const type = val || 'all';
    // Repopulate topic dropdown for this content type
    const topicSel = document.getElementById('lib-filter-select');
    if (topicSel) {
      const topics = _LIB_TYPE_TOPICS[type] || _LIB_TYPE_TOPICS.all;
      topicSel.innerHTML = `<option value="">All topics</option>` +
        topics.map(t => `<option value="${t}">${t}</option>`).join('');
      topicSel.value = '';
    }
    // Reset active topic filter then switch type
    libUiState.activeFilters.clear();
    switchLibraryTab(type);
  }

  function renderLibraryAllPanels() {
    const books    = filterItems(LIBRARY.books,    'book');
    const people   = filterItems(LIBRARY.people,   'person');
    const podcasts = filterItems(LIBRARY.podcasts, 'podcast');

    const tab = libUiState.tab;
    const allMode = tab === 'all';
    const panels = ['books', 'people', 'podcasts', 'breathwork', 'meditations'];

    // Render content into each panel
    document.getElementById('lib-panel-books').innerHTML      = renderBooksPanel(books);
    applyBookCovers(books);
    document.getElementById('lib-panel-people').innerHTML     = renderPeoplePanel(people);
    document.getElementById('lib-panel-podcasts').innerHTML   = renderPodcastsPanel(podcasts);
    applyPodcastArtwork(podcasts);
    document.getElementById('lib-panel-breathwork').innerHTML = renderBreathworkPanel();
    document.getElementById('lib-panel-meditations').innerHTML= renderMeditationsPanel();

    // Show/hide panels based on selected type
    panels.forEach(p => {
      const el = document.getElementById('lib-panel-' + p);
      if (el) el.classList.toggle('active', allMode || p === tab);
    });

    // Empty state: only for specific filterable type with no results
    const filterableTabs = ['books', 'people', 'podcasts'];
    const counts = { books: books.length, people: people.length, podcasts: podcasts.length };
    const showEmpty = !allMode && filterableTabs.includes(tab) && counts[tab] === 0;
    const emptyEl = document.getElementById('lib-empty-state');
    if (emptyEl) emptyEl.hidden = !showEmpty;
  }

  /* ─── Google Books cover image fetching ─── */
  const _bookCoverCache = {};

  async function fetchBookCover(title, author) {
    const key = title + '||' + author;
    if (key in _bookCoverCache) return _bookCoverCache[key];
    try {
      const url = '/book-cover?title=' + encodeURIComponent(title) + '&author=' + encodeURIComponent(author);
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const imgUrl = data.coverUrl || null;
      _bookCoverCache[key] = imgUrl;
      return imgUrl;
    } catch (_) {
      _bookCoverCache[key] = null;
      return null;
    }
  }

  function _applyCoverToEl(el, imgUrl) {
    if (!el || !imgUrl) return;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = 'url(' + imgUrl + ')';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center top';
      el.classList.add('has-cover-img');
    };
    img.src = imgUrl;
  }

  function applyBookCovers(books) {
    books.forEach(async (b) => {
      const imgUrl = await fetchBookCover(b.title, b.author);
      _applyCoverToEl(document.getElementById('bcover-' + slug(b.title)), imgUrl);
    });
  }

  async function applyDetailBookCover(book) {
    const imgUrl = await fetchBookCover(book.title, book.author);
    _applyCoverToEl(document.getElementById('bcover-detail'), imgUrl);
  }

  /* ─── Wikipedia person photos ─── */
  const _personPhotoCache = {};

  async function fetchPersonPhoto(name) {
    if (name in _personPhotoCache) return _personPhotoCache[name];
    try {
      const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name);
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const imgUrl = data?.thumbnail?.source ?? null;
      _personPhotoCache[name] = imgUrl;
      return imgUrl;
    } catch (_) { _personPhotoCache[name] = null; return null; }
  }

  function _applyPhotoToAvatar(el, imgUrl) {
    if (!el || !imgUrl) return;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = 'url(' + imgUrl + ')';
      el.classList.add('has-photo');
    };
    img.src = imgUrl;
  }

  function applyPersonPhotos(people) {
    people.forEach(async (p) => {
      const imgUrl = await fetchPersonPhoto(p.name);
      _applyPhotoToAvatar(document.getElementById('pavatar-' + slug(p.name)), imgUrl);
    });
  }

  async function applyDetailPersonPhoto(person) {
    const imgUrl = await fetchPersonPhoto(person.name);
    _applyPhotoToAvatar(document.getElementById('pavatar-detail'), imgUrl);
  }

  /* ─── iTunes podcast artwork ─── */
  const _podcastArtCache = {};

  async function fetchPodcastArtwork(name) {
    if (name in _podcastArtCache) return _podcastArtCache[name];
    try {
      const url = 'https://itunes.apple.com/search?term=' + encodeURIComponent(name) + '&media=podcast&limit=1';
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const imgUrl = data?.results?.[0]?.artworkUrl600 ?? null;
      _podcastArtCache[name] = imgUrl;
      return imgUrl;
    } catch (_) { _podcastArtCache[name] = null; return null; }
  }

  function _applyArtworkToCard(cardEl, imgEl, imgUrl) {
    if (!cardEl || !imgEl || !imgUrl) return;
    imgEl.onload = () => { cardEl.classList.add('has-artwork'); };
    imgEl.onerror = () => {};
    imgEl.src = imgUrl;
  }

  function applyPodcastArtwork(podcasts) {
    podcasts.forEach(async (p) => {
      const imgUrl = await fetchPodcastArtwork(p.name);
      const cardEl = document.getElementById('pcast-' + slug(p.name));
      const imgEl  = document.getElementById('part-' + slug(p.name));
      _applyArtworkToCard(cardEl, imgEl, imgUrl);
    });
  }

  const _TECH_HUES  = ['teal','sky','indigo','violet','gold','emerald','rose','amber','teal','sky','indigo','violet'];
  const _MEDIT_HUES = ['violet','indigo','sky','teal','violet','indigo','sky','teal'];

  /* ─── Pagination helpers ─── */
  function _resetLibPages() {
    Object.keys(libUiState.page).forEach(k => libUiState.page[k] = 1);
  }

  function _getPageNumbers(current, total) {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, '…', total];
    if (current >= total - 2) return [1, '…', total - 2, total - 1, total];
    return [1, '…', current, '…', total];
  }

  function _renderPagination(panel, currentPage, totalItems) {
    const { pageSize } = libUiState;
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return '';
    const pages = _getPageNumbers(currentPage, totalPages);
    const prevDis = currentPage === 1;
    const nextDis = currentPage === totalPages;
    const pageHtml = pages.map(p => {
      if (p === '…') return '<span class="lib-page-ellipsis">···</span>';
      const act = p === currentPage;
      return `<button class="lib-page-num${act ? ' active' : ''}" onclick="setLibPage('${panel}',${p})">${p}</button>`;
    }).join('');
    return `<div class="lib-pagination">
      <button class="lib-page-nav${prevDis ? ' disabled' : ''}"${prevDis ? ' disabled' : ''} onclick="setLibPage('${panel}',${currentPage - 1})"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M15 18l-6-6 6-6"/></svg></button>
      ${pageHtml}
      <button class="lib-page-nav${nextDis ? ' disabled' : ''}"${nextDis ? ' disabled' : ''} onclick="setLibPage('${panel}',${currentPage + 1})"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg></button>
    </div>
    <div class="lib-page-size-row">
      <span class="lib-page-size-label">Show per page:</span>
      <button class="lib-page-size-btn${pageSize === 10 ? ' active' : ''}" onclick="setLibPageSize(10)">10</button>
      <button class="lib-page-size-btn${pageSize === 25 ? ' active' : ''}" onclick="setLibPageSize(25)">25</button>
    </div>`;
  }

  function setLibPage(panel, page) {
    const pg = parseInt(page, 10);
    if (!pg || pg < 1) return;
    libUiState.page[panel] = pg;
    renderLibraryAllPanels();
    const el = document.getElementById('lib-panel-' + panel);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setLibPageSize(size) {
    libUiState.pageSize = size;
    _resetLibPages();
    renderLibraryAllPanels();
  }

  function renderBooksPanel(books) {
    if (!books.length) return '';
    const { pageSize, page } = libUiState;
    const start = (page.books - 1) * pageSize;
    const visible = books.slice(start, start + pageSize);
    return `<div class="lib-cards-list">${visible.map(b => {
      const hue  = (b.cover && b.cover.hue) ? b.cover.hue : 'teal';
      const icon = (b.cover && b.cover.icon) ? b.cover.icon : '📖';
      const pills = (b.themes || []).slice(0, 2).map(t => `<span class="lib-card-pill">${escapeHtml(t)}</span>`).join('');
      return `<button class="lib-card" onclick="openLibraryEntry('book','${slug(b.title)}')">
        <div class="lib-card-thumb cover-${hue}" id="bcover-${slug(b.title)}">${icon}</div>
        <div class="lib-card-body">
          <div class="lib-card-type">Book</div>
          <div class="lib-card-title">${escapeHtml(b.title)}</div>
          <div class="lib-card-sub">${escapeHtml(b.author)} · ${b.year}</div>
          <div class="lib-card-pills">${pills}</div>
        </div>
        <svg class="lib-card-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;
    }).join('')}</div>` + _renderPagination('books', page.books, books.length);
  }

  function renderPeoplePanel(people) {
    if (!people.length) return '';
    const { pageSize, page } = libUiState;
    const start = (page.people - 1) * pageSize;
    const visible = people.slice(start, start + pageSize);
    return `<div class="lib-cards-list">${visible.map(p => {
      const hue   = (p.photo && p.photo.hue) ? p.photo.hue : 'teal';
      const pills = (p.themes || []).slice(0, 2).map(t => `<span class="lib-card-pill">${escapeHtml(t)}</span>`).join('');
      return `<button class="lib-card" onclick="openLibraryEntry('person','${slug(p.name)}')">
        <div class="lib-card-thumb lib-card-thumb--circle cover-${hue}" id="pavatar-${slug(p.name)}">
          <span class="lib-card-initials">${initialsFromName(p.name)}</span>
        </div>
        <div class="lib-card-body">
          <div class="lib-card-type">Person</div>
          <div class="lib-card-title">${escapeHtml(p.name)}</div>
          <div class="lib-card-sub">${escapeHtml(p.role)}</div>
          <div class="lib-card-pills">${pills}</div>
        </div>
        <svg class="lib-card-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;
    }).join('')}</div>` + _renderPagination('people', page.people, people.length);
  }

  function renderPodcastsPanel(podcasts) {
    if (!podcasts.length) return '';
    const { pageSize, page } = libUiState;
    const start = (page.podcasts - 1) * pageSize;
    const visible = podcasts.slice(start, start + pageSize);
    return `<div class="lib-cards-list">${visible.map((p, i) => {
      const hue  = _TECH_HUES[(start + i) % _TECH_HUES.length];
      const pills = (p.themes || []).slice(0, 2).map(t => `<span class="lib-card-pill">${escapeHtml(t)}</span>`).join('');
      return `<button class="lib-card" id="pcast-${slug(p.name)}" onclick="showPodcastDetail('${slug(p.name)}')">
        <div class="lib-card-thumb cover-${hue}">
          <img class="lib-card-thumb-img" id="part-${slug(p.name)}" src="" alt="">
        </div>
        <div class="lib-card-body">
          <div class="lib-card-type">Podcast</div>
          <div class="lib-card-title">${escapeHtml(p.name)}</div>
          <div class="lib-card-sub">${escapeHtml(p.host)}</div>
          <div class="lib-card-pills">${pills}</div>
        </div>
        <svg class="lib-card-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;
    }).join('')}</div>` + _renderPagination('podcasts', page.podcasts, podcasts.length);
  }

  function renderBreathworkPanel() {
    const { pageSize, page } = libUiState;
    const start = (page.breathwork - 1) * pageSize;
    const visible = TECHNIQUES.slice(start, start + pageSize);
    return `<div class="lib-cards-list">${visible.map((t, i) => {
      const hue  = _TECH_HUES[(start + i) % _TECH_HUES.length];
      return `<button class="lib-card" onclick="showKnowledgePracticeDetail('technique','${escapeJs(t.id)}')">
        <div class="lib-card-thumb cover-${hue}"></div>
        <div class="lib-card-body">
          <div class="lib-card-type">Breathwork</div>
          <div class="lib-card-title">${escapeHtml(t.title)}</div>
          <div class="lib-card-sub">${escapeHtml(t.bestFor)}</div>
          <div class="lib-card-pills">
            <span class="lib-card-pill">${escapeHtml(t.difficulty)}</span>
            <span class="lib-card-pill">${escapeHtml(t.duration)}</span>
          </div>
        </div>
        <svg class="lib-card-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;
    }).join('')}</div>` + _renderPagination('breathwork', page.breathwork, TECHNIQUES.length);
  }

  function renderMeditationsPanel() {
    const { pageSize, page } = libUiState;
    const start = (page.meditations - 1) * pageSize;
    const visible = MEDITATIONS.slice(start, start + pageSize);
    return `<div class="lib-cards-list">${visible.map((m, i) => {
      const hue  = _MEDIT_HUES[(start + i) % _MEDIT_HUES.length];
      return `<button class="lib-card" onclick="showKnowledgePracticeDetail('meditation','${escapeJs(m.id)}')">
        <div class="lib-card-thumb cover-${hue}"></div>
        <div class="lib-card-body">
          <div class="lib-card-type">Meditation</div>
          <div class="lib-card-title">${escapeHtml(m.title)}</div>
          <div class="lib-card-sub">${escapeHtml(m.bestFor)}</div>
          <div class="lib-card-pills">
            <span class="lib-card-pill">${escapeHtml(m.difficulty)}</span>
            <span class="lib-card-pill">${escapeHtml(m.duration)}</span>
          </div>
        </div>
        <svg class="lib-card-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;
    }).join('')}</div>` + _renderPagination('meditations', page.meditations, MEDITATIONS.length);
  }

  /* ─── Filter + search engine ─── */
  function filterItems(items, kind) {
    const q = libUiState.search.trim().toLowerCase();
    const filters = libUiState.activeFilters;
    return items.filter(it => {
      // Theme filter (must match ALL active filters; an item with multiple themes is fine)
      if (filters.size > 0) {
        const itemThemes = it.themes || [];
        for (const f of filters) {
          if (!itemThemes.includes(f)) return false;
        }
      }
      if (!q) return true;
      return itemMatchesQuery(it, kind, q);
    });
  }

  function itemMatchesQuery(it, kind, q) {
    const haystack = [];
    if (kind === 'book') {
      haystack.push(it.title, it.author, it.summary, it.whyMatters || '');
      (it.keyThemes || []).forEach(t => haystack.push(t));
      (it.chapters || []).forEach(c => haystack.push(c));
      (it.themes || []).forEach(t => haystack.push(t));
    } else if (kind === 'person') {
      haystack.push(it.name, it.role, it.bio, it.whyMatters || '');
      (it.contributions || []).forEach(c => haystack.push(c));
      (it.themes || []).forEach(t => haystack.push(t));
    } else if (kind === 'podcast') {
      haystack.push(it.name, it.host, it.focus);
      (it.themes || []).forEach(t => haystack.push(t));
    }
    const blob = haystack.join(' ').toLowerCase();
    return blob.includes(q);
  }

  /* ─── Filter / search handlers ─── */
  function toggleLibFilter(theme) {
    if (libUiState.activeFilters.has(theme)) libUiState.activeFilters.delete(theme);
    else libUiState.activeFilters.add(theme);
    _resetLibPages();
    renderLibrary();
  }
  function clearLibFilters() {
    libUiState.activeFilters.clear();
    _resetLibPages();
    renderLibrary();
  }
  let _libSearchDebounce;
  function onLibSearch() {
    const input = document.getElementById('lib-search-input');
    libUiState.search = input.value;
    updateLibrarySearchUi();
    _resetLibPages();
    renderLibraryAllPanels();
    clearTimeout(_libSearchDebounce);
    _libSearchDebounce = setTimeout(() => {
      if (libUiState.search.trim()) track('search_performed', { query: libUiState.search.trim() });
    }, 500);
  }
  function clearLibSearch() {
    const input = document.getElementById('lib-search-input');
    input.value = '';
    libUiState.search = '';
    input.focus();
    updateLibrarySearchUi();
    _resetLibPages();
    renderLibraryAllPanels();
  }
  function updateLibrarySearchUi() {
    const wrap = document.querySelector('.lib-search');
    if (!wrap) return;
    if (libUiState.search.trim()) wrap.classList.add('has-query');
    else wrap.classList.remove('has-query');
  }
  function resetLibrary() {
    clearLibFilters();
    clearLibSearch();
  }

  /* ─── Tab switching ─── */
  function switchLibraryTab(tab) {
    if (!['all','books','people','podcasts','breathwork','meditations'].includes(tab)) return;
    libUiState.tab = tab;
    const typeSel = document.getElementById('lib-type-select');
    if (typeSel) typeSel.value = tab;
    _syncLibPills();
    _resetLibPages();
    renderLibraryAllPanels();
    track('knowledge_tab_viewed', { tab });
  }

  /* ─── Book detail ─── */
  /* ─── Buy options renderer ─── */
  function renderBuyOptions(book) {
    const bookId = slug(book.title);
    if (book.buyOptions && book.buyOptions.length) {
      const opts = book.buyOptions.map((opt, i) => {
        const isBundle = !!opt.includes;
        const bundleId = `bundle-covers-${slug(book.title)}-${i}`;
        const linkType = i === 0 ? 'primary' : 'bundle_' + i;
        return `<div class="buy-option">
          ${isBundle ? `<div class="bundle-covers" id="${escapeHtml(bundleId)}">
            ${opt.includes.split(', ').map(() => `<div class="bundle-cover-slot"></div>`).join('')}
          </div>` : ''}
          <a class="buy-btn ${i === 0 ? 'buy-btn-primary' : 'buy-btn-outline'}" href="${escapeHtml(opt.url)}" target="_blank" rel="noopener noreferrer" onclick="track('affiliate_click',{book_id:'${bookId}',link_type:'${linkType}'})">${escapeHtml(opt.label)}</a>
          ${opt.includes ? `<div class="buy-includes">Includes: ${escapeHtml(opt.includes)}</div>` : ''}
        </div>`;
      }).join('');
      return `<div class="book-buy-section"><h3 class="detail-section-heading">Get This Book</h3><div class="buy-options">${opts}</div></div>`;
    }
    if (book.amazonUrl) {
      return `<div class="book-buy-section"><h3 class="detail-section-heading">Get This Book</h3><div class="buy-options"><div class="buy-option"><a class="buy-btn buy-btn-primary" href="${escapeHtml(book.amazonUrl)}" target="_blank" rel="noopener noreferrer" onclick="track('affiliate_click',{book_id:'${bookId}',link_type:'primary'})">Buy on Amazon</a></div></div></div>`;
    }
    return '';
  }

  async function populateBundleCovers(book) {
    if (!book.buyOptions) return;
    book.buyOptions.forEach((opt, i) => {
      if (!opt.includes) return;
      const el = document.getElementById(`bundle-covers-${slug(book.title)}-${i}`);
      if (!el) return;
      const titles = opt.includes.split(', ');
      titles.forEach(async (title, j) => {
        const b = LIBRARY.books.find(x => x.title === title);
        if (!b) return;
        const url = await fetchBookCover(title, b.author);
        const slots = el.querySelectorAll('.bundle-cover-slot');
        if (slots[j] && url) {
          slots[j].style.backgroundImage = `url(${url})`;
          slots[j].style.backgroundSize = 'cover';
          slots[j].style.backgroundPosition = 'center top';
          slots[j].classList.add('has-cover');
        }
      });
    });
  }

  /* ─── Singing bowl section (appended to meditation detail pages) ─── */
  function renderSingingBowlSection() {
    return `<div class="singing-bowl-section">
      <div class="singing-bowl-kicker">Enhance Your Practice</div>
      <div class="singing-bowl-card">
        <div class="singing-bowl-name">Silent Mind Tibetan Singing Bowl Set</div>
        <div class="singing-bowl-price-row">
          <span class="singing-bowl-price">£28.00</span>
          <span class="special-buy-badge">Special Buy</span>
        </div>
        <div class="singing-bowl-desc">A beginner-friendly meditation bowl with cushion, mallet and case. Used for centuries to deepen meditation practice.</div>
        <a class="buy-btn buy-btn-primary" href="https://amzn.to/430VnM6" target="_blank" rel="noopener noreferrer" onclick="track('affiliate_click',{book_id:'singing-bowl',link_type:'primary'})">Buy on Amazon</a>
      </div>
    </div>`;
  }

  function showBookDetail(book) {
    if (!book) return;
    transitionTo(() => {
    _navPush(hideLibraryDetail);
    _setBackLabel('Back to Books');
    libUiState.detail = { kind: 'book', id: slug(book.title) };
    document.getElementById('library-list').style.display = 'none';
    const detail = document.getElementById('library-detail');
    const inReading = store.readingList && store.readingList[book.title] === 'read';
    const hue = (book.cover && book.cover.hue) ? book.cover.hue : 'teal';
    let si = 0;
    const secQ = (heading, quote, bodyHtml) => {
      si++;
      const flip = si % 2 === 0 ? ' detail-section-grid--flip' : '';
      return `<div class="book-section">
        <h3 class="detail-section-heading">${heading}</h3>
        <div class="detail-section-grid${flip}">
          <blockquote class="detail-pull-quote">${escapeHtml(quote)}</blockquote>
          <div>${bodyHtml}</div>
        </div>
      </div>`;
    };
    detail.innerHTML = `
      <div class="detail-hero cover-${hue}">
        <img class="detail-hero-full" id="detail-hero-full" alt="${escapeHtml(book.title)}" loading="lazy">
        <div class="detail-hero-overlay">
          <h2 class="detail-hero-title">${escapeHtml(book.title.split(':')[0])}</h2>
          <p class="detail-hero-sub">${escapeHtml(book.author)} · ${book.year}</p>
        </div>
      </div>

      <div class="detail-content">
        <h1 class="detail-content-title">${escapeHtml(book.title)}</h1>
        <div class="detail-content-byline">${escapeHtml(book.author)}</div>
        <div class="detail-content-year">First published ${book.year}</div>
        <p class="detail-body-text">${escapeHtml(book.summary)}</p>

        ${book.whyMatters ? secQ('Why it matters', _firstSentence(book.whyMatters),
          `<p class="detail-body-text">${escapeHtml(book.whyMatters)}</p>`) : ''}

        ${book.keyThemes && book.keyThemes.length ? `
          <div class="book-section">
            <h3 class="detail-section-heading">Key themes</h3>
            <div class="book-themes">
              ${book.keyThemes.map(t => `<span class="book-theme">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>` : ''}

        ${book.chapters && book.chapters.length ? `
          <div class="book-section">
            <h3 class="detail-section-heading">Chapter overview</h3>
            <ol class="book-chapters">
              ${book.chapters.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
            </ol>
          </div>` : ''}

        ${book.themes && book.themes.length ? `
          <div class="book-section">
            <h3 class="detail-section-heading">Best for</h3>
            <div class="book-themes">
              ${book.themes.map(t => `<span class="book-theme">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>` : ''}

        ${renderBuyOptions(book)}
      </div>
    `;
    detail.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchBookCover(book.title, book.author).then(url => _applyHeroImage(document.getElementById('detail-hero-full'), url));
    populateBundleCovers(book);
    }); // end transitionTo
  }

  /* ─── Person detail ─── */
  function showPersonDetail(person) {
    if (!person) return;
    transitionTo(() => {
    _navPush(hideLibraryDetail);
    _setBackLabel('Back to People');
    libUiState.detail = { kind: 'person', id: slug(person.name) };
    document.getElementById('library-list').style.display = 'none';
    const detail = document.getElementById('library-detail');
    const hue = (person.photo && person.photo.hue) ? person.photo.hue : 'teal';
    const wikiUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(person.name.replace(/ /g, '_'));
    let si = 0;
    const secQ = (heading, quote, bodyHtml) => {
      si++;
      const flip = si % 2 === 0 ? ' detail-section-grid--flip' : '';
      return `<div class="book-section">
        <h3 class="detail-section-heading">${heading}</h3>
        <div class="detail-section-grid${flip}">
          <blockquote class="detail-pull-quote">${escapeHtml(quote)}</blockquote>
          <div>${bodyHtml}</div>
        </div>
      </div>`;
    };

    const techCards = (person.relatedTechniqueIds || []).map(id => {
      const t = TECHNIQUES.find(x => x.id === id);
      if (!t) return '';
      return `<button class="related-card" onclick="navigate('techniques'); showTechniqueDetail('${t.id}')">
        <span class="rc-kicker">Technique</span>
        <span class="rc-title">${escapeHtml(t.title)}</span>
        <span class="rc-sub">${escapeHtml(t.bestFor)} · ${escapeHtml(t.duration)}</span>
      </button>`;
    }).join('');

    const bookCards = (person.relatedBookTitles || []).map(title => {
      const b = LIBRARY.books.find(x => x.title === title);
      if (!b) return '';
      return `<button class="related-card" onclick="openLibraryEntry('book', '${slug(b.title)}')">
        <span class="rc-kicker">Book</span>
        <span class="rc-title">${escapeHtml(b.title)}</span>
        <span class="rc-sub">${escapeHtml(b.author)}</span>
      </button>`;
    }).join('');

    const contribList = (person.contributions || []).map(c => `
      <li style="position:relative;padding:8px 0 8px 22px;color:var(--text);font-size:0.95rem;line-height:1.65;border-bottom:1px solid var(--border-soft);">
        <span style="position:absolute;left:6px;top:18px;width:6px;height:6px;border-radius:50%;background:var(--gold);opacity:0.7;"></span>
        ${escapeHtml(c)}
      </li>`).join('');

    detail.innerHTML = `
      <div class="detail-hero cover-${hue}">
        <img class="detail-hero-full" id="detail-hero-full" alt="${escapeHtml(person.name)}" loading="lazy">
        <div class="detail-hero-overlay">
          <h2 class="detail-hero-title">${escapeHtml(person.name)}</h2>
          <p class="detail-hero-sub">${escapeHtml(person.role)}</p>
        </div>
      </div>

      <div class="detail-content">
        <h1 class="detail-content-title">${escapeHtml(person.name)}</h1>
        <div class="detail-content-byline">${escapeHtml(person.role)}</div>
        <p class="detail-body-text" style="margin-top:14px">${escapeHtml(person.bio)}</p>

        ${person.whyMatters ? secQ('Why they matter', _firstSentence(person.whyMatters),
          `<p class="detail-body-text">${escapeHtml(person.whyMatters)}</p>`) : ''}

        ${person.contributions && person.contributions.length ? secQ('Key contributions', person.contributions[0],
          `<ul style="list-style:none;padding:0;margin:0;">${contribList}</ul>`) : ''}

        ${person.themes && person.themes.length ? `
          <div class="book-section">
            <h3 class="detail-section-heading">Themes</h3>
            <div class="book-themes">
              ${person.themes.map(t => `<span class="book-theme">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>` : ''}

        ${techCards ? `
          <div class="related-block" style="--accent: var(--c-tech);">
            <h3>Related techniques</h3>
            <div class="related-grid">${techCards}</div>
          </div>` : ''}

        ${bookCards ? `
          <div class="related-block" style="--accent: var(--gold);">
            <h3>Related books</h3>
            <div class="related-grid">${bookCards}</div>
          </div>` : ''}

        <div class="detail-cta-footer">
          <hr class="detail-hr">
          <div class="detail-cta-label">External Resource</div>
          <a class="detail-cta-btn" href="${wikiUrl}" target="_blank" rel="noopener noreferrer">Explore Their Work →</a>
        </div>
      </div>
    `;
    detail.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchPersonPhoto(person.name).then(url => _applyHeroImage(document.getElementById('detail-hero-full'), url));
    }); // end transitionTo
  }

  function hideLibraryDetail() {
    _navClear();
    const prevTab = (libUiState.detail && libUiState.detail.sourceTab) || libUiState.tab;
    libUiState.detail = null;
    document.getElementById('library-list').style.display = '';
    document.getElementById('library-detail').classList.remove('active');
    switchLibraryTab(prevTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ─── Podcast detail ─── */
  function showPodcastDetail(slugId) {
    const podcast = LIBRARY.podcasts.find(p => slug(p.name) === slugId);
    if (!podcast) return;
    transitionTo(() => {
    _navPush(hideLibraryDetail);
    _setBackLabel('Back to Podcasts');
    store.openedPodcast = (store.openedPodcast || 0) + 1;
    saveStore(store); checkAchievements();
    track('podcast_opened', { podcast_id: slugId, title: podcast.name });
    libUiState.detail = { kind: 'podcast', id: slugId, sourceTab: 'podcasts' };
    document.getElementById('library-list').style.display = 'none';
    const det = document.getElementById('library-detail');
    const episodes = _PODCAST_EPISODES[slugId] || [];
    det.innerHTML = `
      <div class="detail-hero cover-teal">
        <img class="detail-hero-full" id="detail-hero-full" alt="${escapeHtml(podcast.name)}" loading="lazy">
        <div class="detail-hero-overlay">
          <h2 class="detail-hero-title">${escapeHtml(podcast.name)}</h2>
          <p class="detail-hero-sub">${escapeHtml(podcast.host)}</p>
        </div>
      </div>

      <div class="detail-content">
        <h1 class="detail-content-title">${escapeHtml(podcast.name)}</h1>
        <div class="detail-content-byline">${escapeHtml(podcast.host)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 18px">
          ${(podcast.themes || []).map(t => `<span class="book-theme">${escapeHtml(t)}</span>`).join('')}
        </div>
        <p class="detail-body-text">${escapeHtml(podcast.focus)}</p>

        ${episodes.length ? `
          <div class="book-section">
            <h3 class="detail-section-heading">Notable Episodes</h3>
            <div class="podcast-episode-list">
              ${episodes.map(ep => `
                <div class="podcast-episode">
                  <div class="podcast-episode-title">${escapeHtml(ep.title)}</div>
                  <div class="podcast-episode-desc">${escapeHtml(ep.desc)}</div>
                  <div class="podcast-episode-meta">${escapeHtml(ep.ep)}${ep.duration ? ' · ' + escapeHtml(ep.duration) : ''}</div>
                </div>`).join('')}
            </div>
          </div>` : ''}

        ${podcast.url ? `
          <div class="detail-cta-footer">
            <hr class="detail-hr">
            <div class="detail-cta-label">External Resource</div>
            <a class="detail-cta-btn" href="${escapeHtml(podcast.url)}" target="_blank" rel="noopener noreferrer">Listen Now →</a>
          </div>` : ''}
      </div>
    `;
    det.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchPodcastArtwork(podcast.name).then(url => _applyHeroImage(document.getElementById('detail-hero-full'), url));
    }); // end transitionTo
  }

  /* ─── Knowledge practice detail (Overview / History / Science) ─── */
  function showKnowledgePracticeDetail(kind, id) {
    const item    = kind === 'meditation' ? MEDITATIONS.find(m => m.id === id) : TECHNIQUES.find(t => t.id === id);
    const details = kind === 'meditation' ? MEDITATION_DETAILS[id] : TECHNIQUE_DETAILS[id];
    if (!item || !details) return;
    transitionTo(() => {
      _navPush(hideLibraryDetail);
      _setBackLabel(kind === 'meditation' ? 'Back to Meditations' : 'Back to Breathwork');
      const sourceTab = kind === 'meditation' ? 'meditations' : 'breathwork';
      libUiState.detail = { kind: 'practice', id, sourceTab };
      document.getElementById('library-list').style.display = 'none';
      const det = document.getElementById('library-detail');
      det.innerHTML = renderKnowledgePracticeDetail(item, details);
      det.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (details?.history?.origins || details?.history?.evolution) {
        store.viewedKnowledgeHistory = (store.viewedKnowledgeHistory || 0) + 1;
        saveStore(store);
        checkAchievements();
      }
    });
  }

  function renderKnowledgePracticeDetail(item, d) {
    try {
      const ov = d?.overview, hi = d?.history, sc = d?.science;
      const learn = d?.learn;

      const ovBenefits  = (ov?.keyBenefits  || []).map(b => `<li>${escapeHtml(b)}</li>`).join('');
      const ovWhenToUse = (ov?.whenToUse    || []).map(w => `<li>${escapeHtml(w)}</li>`).join('');
      const ovSection = (ov?.what || ovBenefits || ovWhenToUse || ov?.whoFor) ? `
        <div class="know-section">
          <div class="know-section-heading">Overview</div>
          ${ov?.what        ? `<h4>What it is</h4>${collapseP(ov.what, item.id + '-kw-what')}` : ''}
          ${ovBenefits      ? `<h4>Key benefits</h4><ul>${ovBenefits}</ul>` : ''}
          ${ovWhenToUse     ? `<h4>When to use it</h4><ul>${ovWhenToUse}</ul>` : ''}
          ${ov?.whoFor      ? `<h4>Who it's for</h4><p>${escapeHtml(ov.whoFor)}</p>` : ''}
        </div>` : '';

      const howItWorksSection = (sc?.physiology || sc?.neuroscience) ? `
        <div class="know-section">
          <div class="know-section-heading">How It Works</div>
          ${sc?.physiology   ? `<h4>What's happening in the body</h4>${collapseP(sc.physiology, item.id + '-kw-phys')}` : ''}
          ${sc?.neuroscience ? `<h4>Neuroscience</h4>${collapseP(sc.neuroscience, item.id + '-kw-neuro')}` : ''}
        </div>` : '';

      const howItEvolvedSection = (hi?.origins || hi?.evolution) ? `
        <div class="know-section">
          <div class="know-section-heading">How It Evolved</div>
          ${hi?.origins   ? `<h4>Origins &amp; tradition</h4>${collapseP(hi.origins, item.id + '-kw-origins')}` : ''}
          ${hi?.evolution ? `<h4>How it evolved</h4>${collapseP(hi.evolution, item.id + '-kw-evolution')}` : ''}
        </div>` : '';

      const figureItems = (hi?.figures || []).map(f => `
        <div class="know-figure">
          <div class="know-figure-name">${escapeHtml(f?.name || '')}</div>
          <div class="know-figure-credit">${escapeHtml(f?.credit || '')}</div>
        </div>`).join('');
      const keyFiguresSection = figureItems ? `
        <div class="know-section">
          <div class="know-section-heading">Key Figures</div>
          <div class="know-figures">${figureItems}</div>
        </div>` : '';

      const ancientSection = hi?.ancient ? `
        <div class="know-section">
          <div class="know-section-heading">Ancient Connection</div>
          <p>${escapeHtml(hi.ancient)}</p>
        </div>` : '';

      const mechItems = (sc?.keyMechanisms || []).map(m => `<li>${escapeHtml(m)}</li>`).join('');
      const keyMechSection = mechItems ? `
        <div class="know-section">
          <div class="know-section-heading">Key Mechanisms</div>
          <ul>${mechItems}</ul>
        </div>` : '';

      const tagItems = (sc?.tags || []).map(t => `<span class="know-sci-tag">${escapeHtml(t)}</span>`).join('');
      const sciTagsSection = tagItems ? `
        <div class="know-section">
          <div class="know-section-heading">Key Mechanisms</div>
          <div class="know-sci-tags">${tagItems}</div>
        </div>` : '';

      const researchItems = (sc?.research || []).map(r => {
        if (typeof r === 'string') return `<li>${escapeHtml(r)}</li>`;
        return `<li><strong>${escapeHtml(r?.title || '')}</strong> — ${escapeHtml(r?.finding || '')}</li>`;
      }).join('');
      const researchSection = researchItems ? `
        <div class="know-section">
          <div class="know-section-heading">Research</div>
          <ul>${researchItems}</ul>
        </div>` : '';

      const animId = learn?.animation;
      const animSection = animId ? `
        <div class="know-section">
          ${renderAnimation(animId)}
        </div>` : '';

      const videoSection = learn?.video ? `
        <div class="know-section">
          <div class="know-section-heading">Video</div>
          <p>${escapeHtml(learn.video.title || '')}${learn.video.teacher ? ' — ' + escapeHtml(learn.video.teacher) : ''}</p>
        </div>` : '';

      return `
        <div class="know-detail-head">
          <div class="know-detail-title">${escapeHtml(item.title)}</div>
          <div class="know-detail-desc">${escapeHtml(item.desc)}</div>
        </div>
        ${ovSection}
        ${howItWorksSection}
        ${howItEvolvedSection}
        ${keyFiguresSection}
        ${ancientSection}
        ${keyMechSection || sciTagsSection}
        ${researchSection}
        ${animSection}
        ${videoSection}
      `;
    } catch (e) {
      console.error('[Triad] knowledge detail error:', e);
      return '<p style="padding:20px">Content unavailable</p>';
    }
  }

  /* Navigate to Knowledge and open a specific practice entry directly */
  function openKnowledgeEntry(kind, id) {
    const tab = kind === 'meditation' ? 'meditations' : 'breathwork';
    transitionTo(() => {
      navigate('library', { keepDetail: true });
      switchLibraryTab(tab);
      showKnowledgePracticeDetail(kind, id);
    });
  }

  /* Wraps toggleRead() so the book detail re-renders to reflect the new state */
  function toggleReadFromDetail(title) {
    toggleRead(title);
    const book = LIBRARY.books.find(b => b.title === title);
    if (book && libUiState.detail && libUiState.detail.kind === 'book') showBookDetail(book);
  }

  // Small helper for safely embedding strings inside single-quoted JS in template literals
  function escapeJs(s) {
    return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  /* ════════════════ MY PLAN ════════════════ */

