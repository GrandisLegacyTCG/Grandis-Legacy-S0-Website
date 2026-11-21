/* Grandis Legacy S0 v1.68 instant-art hotfix.
 * Art is visible immediately from bundled real-card thumbnails. Larger original
 * WebP files are promoted only once decoded, with a small, prioritized queue.
 * No network service, external image host, fetch(), or Service Worker required.
 * Works under file:// as well as HTTP(S).
 */
(function (root) {
  'use strict';
  const thumbMap = root.GL_S0_CARD_THUMBNAILS || {};
  const CARD_SRC = /(?:^|\/)(?:assets\/season0\/cards\/|card-art\/)(S0-[A-Z0-9-]+)\.webp(?:[?#]|$)/i;
  const MAX_CONCURRENT = 4; // Bound image decode/network work while navigating.
  const MAX_ATTEMPTS = 3;
  const RETRY_MS = [300, 1200];
  const states = new WeakMap();
  const jobs = new Map();
  const pending = [];
  const diagnostics = { thumbnails: 0, loaded: 0, errors: 0, retried: 0, failed: 0, active: 0 };
  let active = 0;

  const intersect = 'IntersectionObserver' in root ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) requestHighRes(entry.target);
    }
  }, { rootMargin: '160px 110px' }) : null;

  function priorityFor(img) {
    if (img.id === 'reviewArt' || img.closest('.review-dialog, .review-card, .formation-slot, .hero-slot, .legacy-slot, .deck-card-visual')) return 2;
    return 1;
  }
  function isNear(img) {
    if (!img.isConnected) return false;
    const r = img.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top < root.innerHeight + 380 && r.bottom > -380 && r.left < root.innerWidth + 300 && r.right > -300;
  }
  function removeObserver(img) {
    if (intersect) intersect.unobserve(img);
    const previous = states.get(img);
    if (previous) jobs.get(previous.original)?.users.delete(img);
  }
  function prepare(img) {
    if (!(img instanceof HTMLImageElement)) return;
    const src = img.getAttribute('src') || '';
    const directOriginal = img.getAttribute('data-gl-original-src') || '';
    const original = directOriginal || src;
    const previous = states.get(img);
    if (previous && (src === previous.thumb || src === previous.loadedSrc || src === previous.original && previous.upgraded)) return;
    const parsed = CARD_SRC.exec(original);
    if (!parsed) {
      if (previous && src !== previous.thumb) { removeObserver(img); states.delete(img); }
      return;
    }
    const artId = parsed[1].toUpperCase();
    const thumb = thumbMap[artId];
    if (!thumb) return; // Non-catalog images retain their normal browser behavior.
    if (previous && previous.original === original) return;
    if (previous) removeObserver(img);

    const state = { original, thumb, upgraded: false, loadedSrc: '' };
    states.set(img, state);
    img.dataset.glCardOriginalSrc = original;
    img.classList.add('gl-s0-card-image');
    img.classList.remove('gl-s0-card-image-error');
    // Preserve native lazy-loading on off-screen gallery cards. Synchronous image
    // decoding and eager loading of all 189 cards can stall the UI during tab changes.
    img.decoding = 'async';

    // A warm-cache original may already have loaded before our observer runs.
    if (!directOriginal && img.complete && img.naturalWidth > 0) {
      state.upgraded = true;
      state.loadedSrc = original;
      img.classList.add('gl-s0-card-image-ready');
      return;
    }

    // Replace before the first paint. Never display a broken icon or text label.
    if (src !== thumb) img.src = thumb;
    diagnostics.thumbnails++;
    img.classList.add('gl-s0-card-image-thumb');
    img.classList.remove('gl-s0-card-image-ready');
    if (intersect) intersect.observe(img);
    // IntersectionObserver gives near-screen upgrades after layout/paint. Avoid
    // forcing getBoundingClientRect() once per card in a large gallery render.
    if (!intersect) root.setTimeout(() => requestHighRes(img), 0);
  }
  function createJob(original) {
    let job = jobs.get(original);
    if (!job) {
      job = { original, users: new Set(), attempts: 0, priority: 1, status: 'idle', loadedSrc: '', preloaded: null };
      jobs.set(original, job);
    }
    return job;
  }
  function requestHighRes(img) {
    const state = states.get(img);
    if (!state || !img.isConnected || state.upgraded) return;
    const job = createJob(state.original);
    job.users.add(img);
    job.priority = Math.max(job.priority, priorityFor(img));
    if (job.status === 'ready') { showFull(img, job); return; }
    if (job.status === 'idle') {
      job.status = 'queued';
      pending.push(job);
      pump();
    }
  }
  function showFull(img, job) {
    const state = states.get(img);
    if (!state || !img.isConnected || state.original !== job.original || job.status !== 'ready') return;
    if (state.upgraded && state.loadedSrc === job.loadedSrc) return;
    state.upgraded = true;
    state.loadedSrc = job.loadedSrc;
    img.decoding = 'async';
    img.src = job.loadedSrc; // Already downloaded and decoded in shared Image cache.
    img.classList.remove('gl-s0-card-image-thumb');
    img.classList.add('gl-s0-card-image-ready');
    diagnostics.loaded++;
    if (intersect) intersect.unobserve(img);
  }
  function withRetry(src, attempt) {
    if (attempt === 0) return src;
    const parts = src.split('#');
    const base = parts[0];
    // A plain canonical URL resolves old/stale image query cache inconsistencies.
    if (attempt === 1) return base.split('?')[0] + (parts.length > 1 ? '#' + parts.slice(1).join('#') : '');
    const sep = base.includes('?') ? '&' : '?';
    return base + sep + 'glArtRetry=' + attempt + '-' + Date.now() + (parts.length > 1 ? '#' + parts.slice(1).join('#') : '');
  }
  function pump() {
    while (active < MAX_CONCURRENT && pending.length) {
      pending.sort((a, b) => b.priority - a.priority);
      const job = pending.shift();
      if (!job || job.status !== 'queued') continue;
      job.status = 'loading';
      active++;
      diagnostics.active = active;
      if (job.attempts) diagnostics.retried++;
      const url = withRetry(job.original, job.attempts);
      const preloader = new Image();
      preloader.decoding = 'async';
      preloader.fetchPriority = job.priority === 2 ? 'high' : 'auto';
      job.preloaded = preloader;
      let finished = false;
      function release() {
        if (finished) return false;
        finished = true;
        active--;
        diagnostics.active = active;
        return true;
      }
      preloader.onload = () => {
        if (!preloader.naturalWidth) { fail(); return; }
        // Decode off-screen, so upgrading the visible thumbnail won't flash blank.
        Promise.resolve(typeof preloader.decode === 'function' ? preloader.decode().catch(() => {}) : undefined).then(() => {
          if (!release()) return;
          job.status = 'ready';
          job.loadedSrc = url;
          for (const img of job.users) showFull(img, job);
          job.users.clear();
          // Keep original bytes in the browser cache, not an extra pinned bitmap.
          job.preloaded = null;
          pump();
        });
      };
      function fail() {
        if (!release()) return;
        diagnostics.errors++;
        job.preloaded = null;
        job.attempts++;
        if (job.attempts < MAX_ATTEMPTS) {
          job.status = 'retry-wait';
          root.setTimeout(() => {
            if (job.status !== 'retry-wait') return;
            job.status = 'queued';
            pending.push(job);
            pump();
          }, RETRY_MS[job.attempts - 1] || 1800);
        } else {
          job.status = 'failed';
          diagnostics.failed++;
          // Keep the real-card miniature visible; never insert a text fallback.
        }
        pump();
      }
      preloader.onerror = fail;
      preloader.src = url;
    }
  }
  document.addEventListener('error', event => {
    const img = event.target;
    const state = states.get(img);
    if (!state || img.getAttribute('src') === state.thumb) return;
    // Unexpected full-res display failure: immediately keep the card visible.
    diagnostics.errors++;
    state.upgraded = false;
    state.loadedSrc = '';
    img.src = state.thumb;
    img.classList.remove('gl-s0-card-image-ready');
    img.classList.add('gl-s0-card-image-thumb');
    if (intersect) intersect.observe(img);
    const job = jobs.get(state.original);
    if (job && job.status === 'ready') {
      job.status = 'failed';
      job.attempts = MAX_ATTEMPTS;
      diagnostics.failed++;
    }
  }, true);

  function scan(node) {
    if (node.nodeType !== 1) return;
    if (node.tagName === 'IMG') prepare(node);
    node.querySelectorAll?.('img[src]').forEach(prepare);
  }
  function cleanup(node) {
    if (node.nodeType !== 1) return;
    if (node.tagName === 'IMG') removeObserver(node);
    node.querySelectorAll?.('img').forEach(removeObserver);
  }
  function init() {
    scan(document.body);
    const mutations = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'attributes') prepare(record.target);
        else {
          for (const node of record.removedNodes) cleanup(node);
          for (const node of record.addedNodes) scan(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    root.addEventListener('pageshow', () => scan(document.body));
    root.addEventListener('online', () => {
      for (const job of jobs.values()) {
        if (job.status === 'failed') { job.status = 'idle'; job.attempts = 0; }
      }
      document.querySelectorAll('img.gl-s0-card-image-thumb').forEach(img => {
        if (isNear(img)) requestHighRes(img);
      });
    });
  }
  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init, { once: true });
  root.GL_S0_CARD_IMAGE_LOADER = { diagnostics, scan: () => scan(document.body) };
})(window);
