/* PvP adaptation: unified mobile popup scroll bridge. Rotated portrait stages
 * map physical horizontal drags to logical vertical scroll, without letting a
 * swipe activate a card. Landscape uses native scrolling. */
(() => {
  'use strict';
  const root=document.documentElement;
  const bound=new WeakSet();
  const portrait=()=>root.classList.contains('gl-pvp-mobile-gameplay')&&root.classList.contains('gl-stage-portrait');
  const modalSelector='.gl-vsai-choice-overlay.open,.gl-played-detail-overlay.open,.gl-card-review-overlay.open,.gl-exp-inspector-overlay.open,.gl-progression-overlay.open,.gl-result-overlay.open,.gl-coin-overlay.open,.gl-center-choice-stage.open,.sidebar.history-open .history-panel,.sidebar.battlelog-open .battlelog-panel,.gl-sound-panel:not([hidden])';
  function ownerFor(target,review){
    const overlay=review?target.closest?.('#cardReviewDialog'):target.closest?.(modalSelector);
    if(!overlay)return null;
    if(!review&&target.closest('.gl-vsai-choice-overlay.gl-choice-to-hand')){
      const grid=target.closest('.card-search-choice-grid');
      return grid&&grid.scrollHeight>grid.clientHeight+2?grid:null;
    }
    for(let el=target;el;el=el.parentElement){
      const cs=el.ownerDocument.defaultView.getComputedStyle(el);
      if(/auto|scroll/.test(cs.overflowY)&&el.scrollHeight>el.clientHeight+2)return el;
      if(el===overlay)break;
    }
    return null;
  }
  function bind(doc,review=false){
    if(!doc||bound.has(doc))return;bound.add(doc);
    let gesture=null,suppress=null;
    doc.addEventListener('touchstart',e=>{
      gesture=null;suppress=null;if(!portrait()||e.touches.length!==1)return;
      const owner=ownerFor(e.target,review);if(!owner)return;
      const t=e.touches[0];gesture={id:t.identifier,owner,x:t.clientX,y:t.clientY,top:owner.scrollTop,drag:false};
    },{capture:true,passive:true});
    doc.addEventListener('touchmove',e=>{
      const g=gesture;if(!g||!portrait())return;
      const t=[...e.touches].find(x=>x.identifier===g.id);if(!t||!g.owner.isConnected){gesture=null;return;}
      const dx=t.clientX-g.x,dy=t.clientY-g.y;
      // An iframe receives coordinates in its own logical coordinate space.
      // Parent-document events are in physical viewport coordinates.
      const primary=review?-dy:dx,other=review?dx:dy;
      if(!g.drag){if(Math.abs(primary)<7||Math.abs(primary)<Math.abs(other)*1.08)return;g.drag=true;}
      if(e.cancelable)e.preventDefault();
      const scale=review?1:parseFloat(root.style.getPropertyValue('--gl-pvp-mobile-touch-scroll-scale'))||parseFloat(root.style.getPropertyValue('--ui-scale'))||1;
      g.owner.scrollTop=Math.max(0,Math.min(g.owner.scrollHeight-g.owner.clientHeight,g.top+primary/scale));
    },{capture:true,passive:false});
    function finish(e){
      if(!gesture)return;const g=gesture;
      if(e.type!=='touchcancel'&&![...e.changedTouches].some(t=>t.identifier===g.id))return;
      gesture=null;if(g.drag){if(e.cancelable)e.preventDefault();suppress={owner:g.owner,until:Date.now()+350};}
    }
    doc.addEventListener('touchend',finish,{capture:true,passive:false});doc.addEventListener('touchcancel',finish,{capture:true,passive:false});
    doc.addEventListener('click',e=>{if(!suppress||e.detail===0)return;if(Date.now()>suppress.until){suppress=null;return;}if(suppress.owner.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();suppress=null;}},true);
  }
  bind(document);
  window.GL_MOBILE_POPUP_SCROLL={attachReview:doc=>bind(doc,true)};
  const frame=document.querySelector('.gl-db158-review-frame');if(frame?.contentDocument)bind(frame.contentDocument,true);
})();
