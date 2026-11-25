/* Grandis Legacy RC42 - Mobile-only long-press card inspection.
   Tap remains selection; 400ms touch hold reveals a persistent enlarged preview.
   Capture-phase click suppression prevents a long press from playing/selecting a card.
   Horizontal/vertical swipes cancel the pending hold. Desktop has no behavior change. */
(() => {
  const HOLD_MS = 400;
  const MOVE_TOLERANCE = 12; // CSS viewport pixels, regardless of stage rotation.
  const registrations = new WeakMap();
  let held = null;
  let suppressClick = null;
  let touchUntil=0;
  // Gesture eligibility follows the actual pointer, not the viewport/orientation.
  const mobile = () => !document.querySelector('.gl-lobby-overlay.open');
  const isTouch = e => e.pointerType === 'touch' || e.pointerType === 'pen';
  const marker = 'data-gl-mobile-preview-hold';
  const getTarget = e => e.target?.closest?.('['+marker+']') || null;
  function cancelPending() {
    if (held?.timer) clearTimeout(held.timer);
    held = null;
  }
  document.addEventListener('pointerdown', e => {
    cancelPending();
    if(isTouch(e))touchUntil=Date.now()+800;else if(e.pointerType==='mouse')touchUntil=0;
    if (!mobile() || !isTouch(e) || e.button !== 0) return;
    const element = getTarget(e);
    if (!element || !registrations.has(element)) return;
    const item = { element, pointerId:e.pointerId, x:e.clientX, y:e.clientY, timer:null, triggered:false };
    held = item;
    item.timer = setTimeout(() => {
      if (held !== item || !element.isConnected || !mobile()) return;
      item.triggered = true;
      suppressClick = {element, until:Date.now() + 1000};
      registrations.get(element)?.();
    }, HOLD_MS);
  }, true);
  document.addEventListener('pointermove', e => {
    if (!held || held.pointerId !== e.pointerId) return;
    const distance = Math.hypot(e.clientX-held.x, e.clientY-held.y);
    if (distance > MOVE_TOLERANCE && !held.triggered) cancelPending();
  }, true);
  ['pointerup','pointercancel','lostpointercapture'].forEach(type =>
    document.addEventListener(type, e => {
      if (!held || held.pointerId !== e.pointerId) return;
      cancelPending();
    }, true)
  );
  document.addEventListener('click', e => {
    const item = suppressClick;
    if (!item || Date.now() > item.until) {suppressClick=null;return;}
    const clicked = e.target;
    if (clicked && (item.element===clicked || item.element.contains(clicked) || clicked.contains?.(item.element))) {
      e.preventDefault();e.stopImmediatePropagation();
      suppressClick = null;
    }
  }, true);
  document.addEventListener('contextmenu', e => {
    if (mobile() && getTarget(e)) e.preventDefault();
  }, true);
  document.addEventListener('visibilitychange', () => {if (document.hidden) cancelPending();});
  window.GL_MOBILE_PREVIEW_HOLD = {
    bind(element,show) {
      if (!element || typeof show!=='function') return;
      element.setAttribute(marker, '');
      registrations.set(element,show);
    },
    recentTouch:()=>Date.now()<touchUntil,
    holdMs:HOLD_MS
  };
})();
