/* Grandis Legacy PvP - adapted RC42 mobile card-list swipe bridge, 24 Nov 2026.
 * PvP rotates the entire BODY +90deg on portrait phones. Browser native
 * scrolling of a nested, rotated overflow-y element may not respond to the
 * corresponding physical horizontal finger swipe. This bridge maps physical
 * pointer movement into the logical vertical scroll coordinate, without
 * changing desktop or normal landscape behavior. It never changes game state.
 */
(() => {
  'use strict';
  let gesture = null;
  let suppressClick = null;
  const root = document.documentElement;
  const portraitStage = () => root.classList.contains('gl-adaptive-stage') &&
    root.classList.contains('gl-pvp-mobile-gameplay') &&
    root.classList.contains('gl-stage-portrait') &&
    true;

  function scrollOwner(target) {
    const overlay = target?.closest?.('.gl-vsai-choice-overlay.open');
    if (!overlay) return null;
    const body = target.closest('.gl-choice-body');
    if (!body || !overlay.contains(body)) return null;
    // Preserve the approved F16 single-scroll-owner model: when a search
    // returns a card to Hand, only its candidate grid may scroll.
    const owner = overlay.classList.contains('gl-choice-to-hand')
      ? target.closest('.card-search-choice-grid') : body;
    if (!owner || !body.contains(owner) && owner !== body) return null;
    if (owner.scrollHeight <= owner.clientHeight + 2) return null;
    return owner;
  }

  document.addEventListener('touchstart', (event) => {
    gesture = null;
    if (!portraitStage() || event.touches.length !== 1) return;
    const owner = scrollOwner(event.target);
    if (!owner) return;
    const touch = event.touches[0];
    gesture = {
      id: touch.identifier, owner, x: touch.clientX, y: touch.clientY,
      scrollTop: owner.scrollTop, dragging: false,
    };
  }, {capture: true, passive: true});

  document.addEventListener('touchmove', (event) => {
    const g = gesture;
    if (!g || !portraitStage()) return;
    const touch = Array.from(event.touches).find(t => t.identifier === g.id);
    if (!touch || !g.owner.isConnected) { gesture = null; return; }
    const dx = touch.clientX - g.x;
    const dy = touch.clientY - g.y;
    // A physical horizontal gesture = vertical movement in the rotated game.
    // Keep near-vertical physical gestures available to the browser normally.
    if (!g.dragging) {
      if (Math.abs(dx) < 7 || Math.abs(dx) < Math.abs(dy) * 1.08) return;
      g.dragging = true;
    }
    if (event.cancelable) event.preventDefault();
    const scale = parseFloat(root.style.getPropertyValue('--gl-pvp-mobile-touch-scroll-scale')) ||
      parseFloat(root.style.getPropertyValue('--ui-scale')) || 1;
    const max = Math.max(0, g.owner.scrollHeight - g.owner.clientHeight);
    // Rotate +90deg: physical +X means logical -Y, so scrollTop increases.
    g.owner.scrollTop = Math.min(max, Math.max(0, g.scrollTop + dx / scale));
  }, {capture: true, passive: false});

  function finish(event) {
    if (!gesture) return;
    const g = gesture;
    if (event.type === 'touchcancel' || !Array.from(event.changedTouches).some(t => t.identifier === g.id)) return;
    gesture = null;
    if (g.dragging) {
      // A swipe must never accidentally select the card beneath the finger.
      if (event.cancelable) event.preventDefault();
      suppressClick = {owner: g.owner, until: Date.now() + 350};
    }
  }
  document.addEventListener('touchend', finish, {capture: true, passive: false});
  document.addEventListener('touchcancel', finish, {capture: true, passive: false});
  document.addEventListener('click', (event) => {
    if (!suppressClick) return;
    if (Date.now() > suppressClick.until) { suppressClick = null; return; }
    if (suppressClick.owner.contains(event.target)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = null;
    }
  }, true);
})();
