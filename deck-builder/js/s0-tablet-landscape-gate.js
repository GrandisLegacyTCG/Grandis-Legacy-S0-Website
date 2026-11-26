/* Grandis Legacy Deck Builder - tablet landscape presentation gate.
 * Desktop / phone behaviour remains unchanged. This runs before the card
 * catalog, art, or app code loads so a tablet portrait visit does not
 * initialise two galleries.
 * The outer landscape frame is an *unsandboxed, same-origin* page: the full
 * Deck Builder, including native <dialog> top-layer Review and pickers,
 * is composited into a single rotated surface (not merely the workspace).
 */
(function () {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  if (params.has('gl_tablet_frame')) {
    // All ordinary links (other style / home / VS AI) must navigate the main
    // tab, rather than trapping a whole website inside the rotated iframe.
    const base = document.createElement('base');
    base.setAttribute('target', '_top');
    document.head.appendChild(base);
    document.documentElement.dataset.glTabletFrame = 'true';
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const portrait = height > width;
  const tabletWidth = Math.min(width, height);
  const longEdge = Math.max(width, height);
  // Tablet is a device mode, not a universal viewport CSS breakpoint.
  // Coarse-pointer touch devices in tablet dimensions qualify; iPadOS may
  // identify as Mac with a fine pointer when a trackpad is connected.
  // Ordinary desktop / touchscreen Windows laptop windows must NOT rotate.
  const touch = (navigator.maxTouchPoints || 0) > 0;
  let coarse = false;
  try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (_) {}
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const nativeTablet = /iPad|Tablet/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    (platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
  const isWindowsDesktop = /Windows NT/i.test(ua) && !/Tablet/i.test(ua);
  const tabletInput = nativeTablet || ((touch || coarse) && coarse && !isWindowsDesktop);
  // Mobile and desktop preserve their existing scroll and responsive rules.
  // Mark physical tablet landscape so its content can scroll via touch; never
  // style arbitrary desktop browser windows or the portrait rotated iframe.
  const inTabletRange = tabletWidth >= 600 && tabletWidth <= 1100 && longEdge <= 2200;
  if (tabletInput && inTabletRange && !portrait) {
    document.documentElement.dataset.glTabletLandscape = 'true';
  }
  // Tablet portrait uses the existing complete, rotated browsing context,
  // including its native dialogs and working portrait swipe behavior.
  if (!tabletInput || !portrait || !inTabletRange) return;

  const script = document.currentScript;
  if (!script || !script.src) return;
  const appRoot = new URL('../', script.src);
  const wrapper = new URL('tablet/index.html', appRoot);
  const style2 = /(?:^|\/)style-2(?:\/|$)/.test(window.location.pathname);
  wrapper.searchParams.set('style', style2 ? '2' : '1');
  if (window.location.search) wrapper.searchParams.set('query', window.location.search.substring(1));
  if (window.location.hash) wrapper.searchParams.set('fragment', window.location.hash.substring(1));
  window.location.replace(wrapper.href);
})();
