/* Grandis Legacy Deck Builder - tablet landscape presentation gate.
 * Desktop / phone behaviour remains unchanged. This runs before the card
 * catalog, art, or app code loads so a tablet portrait visit does not
 * initialise two galleries.
 * The outer landscape frame is an unsandboxed, same-origin page: the full
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

  // IMPORTANT: classify the physical display using Screen dimensions, not
  // only innerWidth/innerHeight. Browser chrome, tab bars, and system UI can
  // reduce a tablet's landscape innerHeight below 600 CSS px (for example,
  // a 1024x600 tablet may expose only ~448px to the web page). Using the
  // viewport for the size test incorrectly skipped tablet scroll CSS.
  const screenWidth = Number(window.screen && window.screen.width) || width;
  const screenHeight = Number(window.screen && window.screen.height) || height;
  const screenShortEdge = Math.min(screenWidth, screenHeight);
  const screenLongEdge = Math.max(screenWidth, screenHeight);

  // Tablet is a device mode, not a universal viewport CSS breakpoint.
  // Coarse-pointer touch devices in tablet dimensions qualify; iPadOS may
  // identify as Mac with a fine pointer when a trackpad is connected.
  // Ordinary desktop / touchscreen Windows laptop windows must NOT rotate.
  const touch = (navigator.maxTouchPoints || 0) > 0;
  let coarse = false;
  try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (_) {}
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const uaDataMobile = navigator.userAgentData && navigator.userAgentData.mobile;
  const nativeTablet = /iPad|Tablet/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    (uaDataMobile === false && (touch || coarse)) ||
    (platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
  const isWindowsDesktop = /Windows NT/i.test(ua) && !/Tablet/i.test(ua);
  const tabletInput = nativeTablet || ((touch || coarse) && coarse && !isWindowsDesktop);

  // A native tablet may report a compact CSS screen size; other coarse-touch
  // devices need a larger short edge so ordinary phones remain mobile.
  const minTabletEdge = nativeTablet ? 480 : 540;
  const inTabletRange = screenShortEdge >= minTabletEdge &&
    screenShortEdge <= 1200 && screenLongEdge <= 2400;

  // Mark physical tablet landscape so all required scroll containers become
  // touch-scrollable. The check is independent of the browser's reduced
  // content viewport height.
  if (tabletInput && inTabletRange && !portrait) {
    document.documentElement.dataset.glTabletLandscape = 'true';
  }

  // Tablet portrait uses the existing complete, rotated browsing context,
  // including its native dialogs and working portrait swipe behaviour.
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
