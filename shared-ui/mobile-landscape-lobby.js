/* Grandis Legacy VS AI - RC34.2 mobile landscape lobby presentation.
   Keeps the existing desktop Lobby DOM, art and controls. Never locks or
   changes the physical device orientation. Portrait gets a CSS-rotated stage.
   Changes only the open Lobby and its card-review overlay. */
(() => {
  'use strict';
  const W = 1180;
  const H = 545;
  const root = document.documentElement;
  let lobby = null;
  let lobbyObserver = null;
  let coin = null;
  let coinObserver = null;
  let scheduled = false;

  const isHandset = () => window.GL_PLATFORM?.isMobile()===true;

  function position() {
    const eligible = isHandset();
    const lobbyOpen = !!(eligible && lobby && lobby.classList.contains('open'));
    const coinOpen = !!(eligible && coin && coin.classList.contains('open') && !lobbyOpen);
    const active = lobbyOpen || coinOpen;
    root.classList.toggle('gl-mobile-landscape-lobby', lobbyOpen);
    root.classList.toggle('gl-mobile-landscape-coin', coinOpen);
    root.classList.toggle('gl-mobile-landscape-stage', active);
    if (!active) {
      root.classList.remove('gl-mobile-landscape-lobby-portrait');
      root.style.removeProperty('--gl-mobile-lobby-transform');
      root.style.removeProperty('--gl-mobile-lobby-scale');
      root.style.removeProperty('--gl-mobile-lobby-w');
      root.style.removeProperty('--gl-mobile-lobby-h');
      return;
    }
    const vp=window.GL_VIEWPORT?.read()||{width:Math.max(1,window.innerWidth),height:Math.max(1,window.innerHeight),x:0,y:0};
    const width=vp.width,height=vp.height;
    const portrait = height > width;
    const stageWidth = portrait ? height : width;
    const stageHeight = portrait ? width : height;
    // Lobby/Coin share an edge-to-edge landscape stage with gameplay. Keep
    // the original logical sizes but eliminate previously hard-coded 4px gutters.
    // Uniform aspect-preserving scale; grow the logical panel to cover the
    // remaining viewport instead of stretching Hero Cards or buttons.
    const scale=Math.min(stageWidth/W,stageHeight/H);
    const logicalW=stageWidth/scale;
    const logicalH=stageHeight/scale;
    root.classList.toggle('gl-mobile-landscape-lobby-portrait', portrait);
    const transform=portrait
      ? `translate(${vp.x+width}px,${vp.y}px) rotate(90deg) scale(${scale})`
      : `translate(${vp.x}px,${vp.y}px) scale(${scale})`;
    root.style.setProperty('--gl-mobile-lobby-transform', transform);
    root.style.setProperty('--gl-mobile-lobby-scale', String(scale));
    root.style.setProperty('--gl-mobile-lobby-w',logicalW+'px');
    root.style.setProperty('--gl-mobile-lobby-h',logicalH+'px');
    root.dataset.glInternalRevision = 'RC43-TOUCHSCREEN-UNIFORM';
  }
  function requestPosition() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; position(); });
  }
  function attach() {
    const current = document.querySelector('.gl-lobby-overlay');
    if (current !== lobby) {
      if (lobbyObserver) lobbyObserver.disconnect();
      lobby = current;
      if (lobby) {
        lobbyObserver = new MutationObserver(requestPosition);
        lobbyObserver.observe(lobby, {attributes: true, attributeFilter: ['class']});
      }
    }
    const nextCoin = document.querySelector('.gl-coin-overlay');
    if (nextCoin !== coin) {
      if (coinObserver) coinObserver.disconnect();
      coin = nextCoin;
      if (coin) {
        coinObserver = new MutationObserver(requestPosition);
        coinObserver.observe(coin, {attributes: true, attributeFilter: ['class']});
      }
    }
    requestPosition();
  }
  const bodyObserver = new MutationObserver(attach);
  bodyObserver.observe(document.body, {childList: true});
  window.addEventListener('resize', requestPosition, {passive: true});
  window.addEventListener('orientationchange', requestPosition, {passive: true});
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', requestPosition, {passive: true});
    window.visualViewport.addEventListener('scroll', requestPosition, {passive: true});
  }
  attach();
})();
