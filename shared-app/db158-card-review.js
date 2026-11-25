/* Card Review UI: Deck Builder v1.66 view-model/renderer/keyword explanations.
   Read-only presentation. Printed values are copied from the 242-card Deck Builder v1.66 source registry.
   Kept isolated in an iframe to avoid changing the v6.91.9 battlefield CSS. */
(function(g){'use strict';
  var files=['app.css', 's0-enhancements-v1.32.2.css', 's0-shared-header-review.css', 's0-part7-revision-v1.36.css', 's0-part7-revision-v1.38.css', 's0-part7-revision-v1.39.css', 's0-review-v1.41.css', 's0-review-v1.42.css', 's0-review-v1.43.css', 's0-review-v1.44.css', 's0-ui-v1.49.css', 's0-hotfix-v1.49.1.css', 's0-layout-v1.50.css', 's0-modal-parity-v1.52.css', 's0-review-v1.54.css', 's0-review-v1.56.css', 's0-review-v1.57.css', 's0-launch-v1.58.css', 's0-rulebook-v2.9-review-v1.58.css', 's0-mobile-header-v1.63.css', 's0-filter-layout-v1.64.css', 's0-validation-tooltip-v1.64.css', 's0-filter-parity-v1.64.css', 's0-filter-responsive-fix-v1.65.css', 's0-card-image-loader-v1.68.css', 's0-ui-polish-v1.66.css', 's0-toast-feedback.css'];
  function escape(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  // Deck Builder v1.66 is the authoritative Review presentation data. Gameplay
  // continues to use VS AI's canonical engine card definitions independently.
  function getCard(id){return g.GL_DB166_REVIEW_CARDS?.[id]||null;}
  function documentHtml(c,progressionIds){
    var base=escape(new URL('./',g.document.baseURI).href);
    // Website: reuse the additional canonical Deck Builder styles instead of duplicating files.
    var sharedStyles=['s0-mobile-header-v1.63.css', 's0-filter-layout-v1.64.css', 's0-validation-tooltip-v1.64.css', 's0-filter-parity-v1.64.css', 's0-filter-responsive-fix-v1.65.css', 's0-card-image-loader-v1.68.css', 's0-ui-polish-v1.66.css', 's0-toast-feedback.css'];
    var styles=files.map(function(f){var folder=sharedStyles.indexOf(f)>=0?'deck-builder/css/':'assets/review-db158/css/';return '<link rel="stylesheet" href="'+folder+f+'">';}).join('');
    var lineage=Array.isArray(progressionIds)&&c.family==='Hero'?progressionIds.map(function(id){return getCard(id);}).filter(Boolean):[];
    var serializedLineage=JSON.stringify(lineage.map(function(x){return {id:x.id,name:x.name,image:x.image};})).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
    var serialized=JSON.stringify(c).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="'+base+'">'+styles+
      '<style>@font-face{font-family:"Noto Sans";src:url("assets/fonts/NotoSans-Variable.woff2") format("woff2");font-weight:100 900;font-display:swap}html,body{margin:0!important;width:100%;height:100%;background:transparent!important;overflow:hidden!important}body::before{display:none!important}#cardReviewDialog::backdrop{background:transparent!important;backdrop-filter:none!important}</style>'+
      '</head><body><dialog id="cardReviewDialog" class="app-dialog review-dialog"><div class="dialog-card review-card">'+
      '<div class="review-header"><div><span id="reviewEyebrow" class="dialog-eyebrow"></span><h2 id="reviewTitle"></h2></div><button id="reviewClose" class="dialog-close review-close" type="button" aria-label="Close">×</button></div>'+
      '<div class="review-layout"><div class="review-art-column"><img id="reviewArt" class="review-art" alt="Card review"></div><div class="review-detail-column"><div id="reviewStats" class="review-stats"></div><div id="reviewRows" class="review-rows"></div></div></div>'+
      '<div id="reviewProgression" class="review-progression" hidden><span>HERO LINEAGES</span><div id="reviewProgressionCards" class="review-progression-cards"></div></div></div></dialog>'+
      '<script>if(parent.GL_CARD_ART)parent.GL_CARD_ART.attach(document);<\/script>'+
      '<script src="assets/review-db158/js/s0-review-clarity.js?v=rc40-p5-review166-mana-terms"><\/script><script src="assets/review-db158/js/review-renderer-v158.js?v=rc40-p5-review166"><\/script><script src="deck-builder/js/s0-ui-v1.49.js"><\/script>'+
      '<script>(function(){const card='+serialized+';const lineage='+serializedLineage+';window.GL_S0_REVIEW_RENDER(card);document.getElementById("cardReviewDialog").showModal();if(lineage.length){const panel=document.getElementById("reviewProgression"),host=document.getElementById("reviewProgressionCards");panel.hidden=false;lineage.forEach(function(x){const b=document.createElement("button");b.type="button";b.className="review-progression-card"+(x.id===card.id?" active":"");b.dataset.reviewRankId=x.id;b.setAttribute("aria-label","Review "+x.name);const img=document.createElement("img");if(parent.GL_CARD_ART)parent.GL_CARD_ART.set(img,x.image);else img.src=x.image;img.alt=x.name;img.draggable=false;b.appendChild(img);b.addEventListener("click",function(){parent.postMessage({kind:"GL_S0_REVIEW_RANK",cardId:x.id},"*")});host.appendChild(b);});}function close(){parent.postMessage({kind:"GL_S0_REVIEW_CLOSE"},"*")}document.getElementById("reviewClose").addEventListener("click",close);document.addEventListener("keydown",function(e){if(e.key==="Escape"){e.preventDefault();close();}});function reportHeight(){var card=document.querySelector("#cardReviewDialog .review-card");if(!card)return;parent.postMessage({kind:"GL_S0_REVIEW_FIT",height:Math.ceil(card.getBoundingClientRect().bottom)},"*");}requestAnimationFrame(reportHeight);setTimeout(reportHeight,80);document.fonts.ready.then(reportHeight);var img=document.getElementById("reviewArt");if(img&&!img.complete)img.addEventListener("load",reportHeight,{once:true});if(window.ResizeObserver)new ResizeObserver(reportHeight).observe(document.querySelector(".review-card"));window.addEventListener("resize",reportHeight);var readySent=false;function reportReady(){if(readySent)return;readySent=true;reportHeight();parent.postMessage({kind:"GL_S0_REVIEW_READY"},"*");}function afterArt(){Promise.resolve(document.fonts.ready).then(function(){requestAnimationFrame(function(){requestAnimationFrame(reportReady);});});}if(img&&!img.complete){img.addEventListener("load",afterArt,{once:true});img.addEventListener("error",afterArt,{once:true});}else afterArt();setTimeout(reportReady,1800);})();<\/script></body></html>';
  }
  // Reuse the same iframe for all reviews. Re-creating srcdoc on every
  // double-click used to re-parse 19 stylesheet links and both JS renderers.
  // This only changes presentation; the Deck Builder review data is unchanged.
  function lineageFor(c,ids){
    if(c.family!=='Hero'||!Array.isArray(ids))return [];
    return ids.map(getCard).filter(Boolean).map(function(x){return {id:x.id,name:x.name,image:x.image};});
  }
  // The same responsive review viewport is used in lobby and battlefield.
  // Mobile scroll is owned by the iframe document; the header sticks to it.
  function syncMobileReview(frame){
    if(!frame)return;
    var d=frame.contentDocument;if(!d?.head)return;
    frame.style.removeProperty('height');
    var mobile=g.document.documentElement.dataset.glPlatform==='mobile';
    d.documentElement.classList.toggle('gl-review-rotated',mobile&&g.document.documentElement.classList.contains('gl-stage-portrait'));
    if(!d.getElementById('gl-review-touch-style')){
      var st=d.createElement('style');st.id='gl-review-touch-style';
      st.textContent='html.gl-review-rotated #cardReviewDialog :is(.review-card,.review-layout,.review-detail-column){touch-action:none!important;}';d.head.appendChild(st);
    }
    if(mobile)g.GL_MOBILE_POPUP_SCROLL?.attachReview?.(d);
  }
  function applyReviewToFrame(frame,c,lineage){
    var w=frame.contentWindow,d=frame.contentDocument,body=frame.parentElement;
    if(!w||!d||typeof w.GL_S0_REVIEW_RENDER!=='function')return false;
    syncMobileReview(frame);
    var request=(frame.__glReviewRequest||0)+1;
    frame.__glReviewRequest=request;
    body.classList.remove('gl-review-ready');
    w.GL_S0_REVIEW_RENDER(c);
    d.querySelectorAll('#cardReviewDialog .review-card,#cardReviewDialog .review-layout,#cardReviewDialog .review-detail-column').forEach(sc=>{sc.scrollTop=0;});
    var panel=d.getElementById('reviewProgression'),host=d.getElementById('reviewProgressionCards');
    if(panel&&host){
      host.replaceChildren();panel.hidden=!lineage.length;
      lineage.forEach(function(x){
        var button=d.createElement('button');button.type='button';
        button.className='review-progression-card'+(x.id===c.id?' active':'');
        button.dataset.reviewRankId=x.id;
        button.setAttribute('aria-label','Review '+x.name);
        var art=d.createElement('img');if(g.GL_CARD_ART)g.GL_CARD_ART.set(art,x.image);else art.src=x.image;art.alt=x.name;art.draggable=false;
        button.appendChild(art);
        // The handler belongs to the iframe realm so the existing parent
        // message security check (e.source === frame.contentWindow) still works.
        button.addEventListener('click',w.Function('parent.postMessage({kind:"GL_S0_REVIEW_RANK",cardId:this.dataset.reviewRankId},"*")'));
        host.appendChild(button);
      });
    }
    var img=d.getElementById('reviewArt');
    function ready(){
      if(!frame.isConnected||frame.__glReviewRequest!==request)return;
      body.classList.add('gl-review-ready');

    }
    // Show the review once the artwork is decoded; don't wait for a new iframe
    // document, stylesheet downloads or unrelated battlefield rendering.
    var imageReady=img&&img.complete&&img.naturalWidth>0;
    var decoded=imageReady?Promise.resolve():img&&typeof img.decode==='function'
      ?img.decode().catch(function(){})
      :new Promise(function(resolve){if(!img)return resolve();img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});});
    Promise.race([Promise.all([decoded,d.fonts?.ready||Promise.resolve()]),
      new Promise(function(resolve){g.setTimeout(resolve,1600);})]).then(function(){
      if(!frame.isConnected||frame.__glReviewRequest!==request)return;
      w.requestAnimationFrame(function(){w.requestAnimationFrame(ready);});
    });
    return true;
  }
  function mount(el,cardId,progressionIds){
    var c=getCard(cardId);if(!el||!c)return false;
    var lineage=lineageFor(c,progressionIds);
    var frame=el.querySelector('.gl-db158-review-frame');
    if(frame){
      syncMobileReview(frame);
      frame.__glPendingReview={card:c,lineage:lineage};
      if(frame.contentWindow?.GL_S0_REVIEW_RENDER){
        applyReviewToFrame(frame,c,lineage);
      }
      return true;
    }
    frame=g.document.createElement('iframe');frame.className='gl-db158-review-frame';
    frame.style.colorScheme='light';frame.setAttribute('title','Card review');
    frame.setAttribute('loading','eager');frame.setAttribute('scrolling','auto');
    frame.setAttribute('aria-label','Card review');
    frame.__glPendingReview={card:c,lineage:lineage};
    frame.addEventListener('load',function(){
      var latest=frame.__glPendingReview;
      if(latest)applyReviewToFrame(frame,latest.card,latest.lineage);
    });
    frame.srcdoc=documentHtml(c,progressionIds);
    el.appendChild(frame);
    return true;
  }
  function warmReviewShell(){
    var body=g.document.querySelector('.gl-card-review-body');
    if(!body||body.querySelector('.gl-db158-review-frame'))return;
    var id=Object.keys(g.GL_DB166_REVIEW_CARDS||{})[0];
    if(id)mount(body,id,[]);
  }
  // One low-priority idle mount makes the first real double-click responsive,
  // while subsequent cards always reuse the already-initialized iframe.
  function scheduleWarmReview(){
    var run=function(){g.setTimeout(warmReviewShell,450);};
    if(typeof g.requestIdleCallback==='function')g.requestIdleCallback(run,{timeout:1800});
    else g.setTimeout(run,800);
  }
  if(g.document.readyState==='loading')g.document.addEventListener('DOMContentLoaded',scheduleWarmReview,{once:true});
  else scheduleWarmReview();
  g.addEventListener('resize',function(){g.requestAnimationFrame(function(){syncMobileReview(g.document.querySelector('.gl-db158-review-frame'));});},{passive:true});
  g.GL_DB158_REVIEW={syncMobileReview:syncMobileReview,mount:mount,getCard:getCard,documentHtml:documentHtml,warm:warmReviewShell,
    source:'Main Deck R3.9 / Legacy Deck R3.9',view:'Deck Builder v1.67',heroFooter:'lobby-only'};
})(window);
