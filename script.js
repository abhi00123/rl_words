(() => {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────────
  const searchInput = document.getElementById('searchInput');
  const resetBtn = document.getElementById('resetBtn');
  const wordListEl = document.getElementById('wordList');
  const totalCountEl = document.getElementById('totalCount');
  const selectedCountEl = document.getElementById('selectedCount');

  // ── State ─────────────────────────────────────────────────
  const STORAGE_KEY = 'selectedWords';
  let selectedWords = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  let debounceTimer = null;

  // ── Use pre-sorted, deduplicated WORDS array ────────
  // The WORDS array comes from words.js
  const ALL_WORDS = WORDS;

  // ── Helpers ───────────────────────────────────────────────

  /**
   * Find the start index where words with the given prefix begin
   * using binary search (O(log n) instead of scanning from 0).
   */
  function lowerBound(prefix) {
    let lo = 0, hi = ALL_WORDS.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (ALL_WORDS[mid] < prefix) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /**
   * Return all words starting with `prefix`, excluding selected words.
   * Uses binary search + linear scan for speed on sorted array.
   */
  function filterWords(prefix) {
    if (!prefix) return [];
    const results = [];
    const start = lowerBound(prefix);
    for (let i = start; i < ALL_WORDS.length; i++) {
      const w = ALL_WORDS[i];
      if (!w.startsWith(prefix)) break;     // past the prefix range
      if (!selectedWords.has(w)) results.push(w);
    }
    return results;
  }

  /**
   * Render the word list into the DOM.
   * Uses DocumentFragment for efficient batch DOM insert.
   */
  function render(words, prefix) {
    wordListEl.innerHTML = '';

    if (!prefix) {
      wordListEl.innerHTML = '<div class="placeholder-msg"><div class="icon-search"></div><p>Start typing to see results</p></div>';
      totalCountEl.textContent = 'Total: 0';
      return;
    }

    if (words.length === 0) {
      wordListEl.innerHTML = '<div class="no-results"><div class="icon-empty"></div><p>No words found</p></div>';
      totalCountEl.textContent = 'Total: 0';
      return;
    }

    const MAX_DISPLAY = 200;
    const isTruncated = words.length > MAX_DISPLAY;

    if (isTruncated) {
      totalCountEl.textContent = `Total: ${words.length} (Showing top ${MAX_DISPLAY})`;
    } else {
      totalCountEl.textContent = `Total: ${words.length}`;
    }

    // Render in batches to avoid blocking the main thread on large result sets
    const BATCH = 50;
    let idx = 0;
    const limit = Math.min(words.length, MAX_DISPLAY);

    function renderBatch() {
      const frag = document.createDocumentFragment();
      const end = Math.min(idx + BATCH, limit);
      for (; idx < end; idx++) {
        const w = words[idx];
        const div = document.createElement('div');
        div.className = 'word-item';
        // Highlight prefix
        div.innerHTML = `<strong>${w.slice(0, prefix.length)}</strong>${w.slice(prefix.length)}`;
        div.dataset.word = w;
        frag.appendChild(div);
      }
      wordListEl.appendChild(frag);

      if (idx < limit) {
        requestAnimationFrame(renderBatch);
      } else if (isTruncated) {
        const msg = document.createElement('div');
        msg.className = 'word-item';
        msg.style.justifyContent = 'center';
        msg.style.color = '#94a3b8';
        msg.style.fontSize = '0.9rem';
        msg.style.pointerEvents = 'none';
        msg.innerHTML = `<em>Type more letters to see remaining words...</em>`;
        wordListEl.appendChild(msg);
      }
    }

    renderBatch();
  }

  // ── Persist helpers ───────────────────────────────────────
  function saveSelected() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedWords]));
  }

  function updateSelectedCount() {
    selectedCountEl.textContent = `Selected: ${selectedWords.size}`;
  }

  // ── Event: input with debounce ────────────────────────────
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Allow only a-z
      const raw = searchInput.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
      searchInput.value = raw;
      const results = filterWords(raw);
      render(results, raw);
    }, 300);
  });

  // ── Event: click on a word (delegated) ────────────────────
  wordListEl.addEventListener('click', (e) => {
    const item = e.target.closest('.word-item');
    if (!item) return;

    const word = item.dataset.word;
    selectedWords.add(word);
    saveSelected();
    updateSelectedCount();

    // Fade-out then remove
    item.classList.add('fade-out');
    item.addEventListener('transitionend', () => {
      item.remove();
      // Update total count
      const remaining = wordListEl.querySelectorAll('.word-item').length;
      totalCountEl.textContent = `Total: ${remaining}`;
      if (remaining === 0) {
        wordListEl.innerHTML = '<div class="no-results"><div class="icon-empty"></div><p>No words found</p></div>';
      }
    }, { once: true });
  });

  // ── Event: reset ──────────────────────────────────────────
  resetBtn.addEventListener('click', () => {
    selectedWords.clear();
    localStorage.removeItem(STORAGE_KEY);
    searchInput.value = '';
    wordListEl.innerHTML = '<div class="placeholder-msg"><div class="icon-search"></div><p>Start typing to see results</p></div>';
    totalCountEl.textContent = 'Total: 0';
    updateSelectedCount();
  });

  // ── Init ──────────────────────────────────────────────────
  updateSelectedCount();
})();
