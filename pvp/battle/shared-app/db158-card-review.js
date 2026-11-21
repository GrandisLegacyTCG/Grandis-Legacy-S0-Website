/* Card Review UI: Deck Builder v1.66 view-model/renderer/keyword explanations.
   Read-only presentation. Printed values are copied from the 242-card Deck Builder v1.66 source registry.
   Kept isolated in an iframe to avoid changing the v6.91.9 battlefield CSS. */
(function(g){'use strict';
  var files=['pvp-review-bundle-rc40-20261116.css'];
  function escape(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  // Deck Builder v1.66 is the authoritative Review presentation data. Gameplay
  // continues to use VS AI's canonical engine card definitions independently.
  function getCard(id){return g.GL_DB166_REVIEW_CARDS?.[id]||null;}
  function documentHtml(c,progressionIds){
    var base=escape(new URL('./',g.document.baseURI).href);
    var styles=files.map(function(f){return '<link rel="stylesheet" href="assets/review-db158/css/'+f+'">';}).join('');
    var lineage=Array.isArray(progressionIds)&&c.family==='Hero'?progressionIds.map(function(id){return getCard(id);}).filter(Boolean):[];
    var serializedLineage=JSON.stringify(lineage.map(function(x){return {id:x.id,name:x.name,image:x.image};})).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
    var serialized=JSON.stringify(c).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="'+base+'">'+styles+
      '<style>html,body{color-scheme:light!important;padding:0!important;margin:0!important;width:100%;height:auto!important;min-height:0!important;overflow-x:hidden!important;overflow-y:auto!important;background:transparent!important;background-image:none!important;color:#f4f4f4;font-family:"Noto Sans",Arial,sans-serif;--gold:#e6c474}body::before{display:none!important}#cardReviewDialog{box-sizing:border-box;position:static!important;display:flex!important;align-items:center!important;justify-content:center!important;inset:auto!important;transform:none!important;padding:0!important;margin:0!important;background:transparent!important;border:0!important;box-shadow:none!important;width:100%!important;height:auto!important;min-height:0!important;max-width:none!important;max-height:none!important;overflow:visible!important}#cardReviewDialog::backdrop{display:none!important}#cardReviewDialog .review-card,#cardReviewDialog[data-review-kind="hero"] .review-card{box-sizing:border-box!important;width:100%!important;max-width:100%!important;border:0!important;border-radius:14px!important;outline:none!important;box-shadow:none!important;margin:0!important;min-height:0!important;height:auto!important;max-height:none!important;background:#242630!important}#cardReviewDialog .review-layout,#cardReviewDialog[data-review-kind="hero"] .review-layout{grid-template-columns:var(--gl-review-art-w) minmax(0,1fr)!important;gap:clamp(12px,2vw,26px)!important;align-items:start!important;flex:0 0 auto!important;height:auto!important;max-height:none!important;overflow:visible!important}#cardReviewDialog .review-art,#cardReviewDialog[data-review-kind="hero"] .review-art{box-sizing:border-box!important;width:var(--gl-review-art-w)!important;height:calc(var(--gl-review-art-w)*1.4)!important;max-width:100%!important;max-height:none!important;object-fit:contain!important}#cardReviewDialog{--gl-review-art-w:clamp(175px,22vw,310px)}#reviewProgression[hidden]{display:none!important}html{height:100%!important;min-height:100%!important;overflow-y:auto!important}body{height:auto!important;min-height:100%!important}/* RC22: allow wheel/trackpad scrolling through the Deck Builder review internals, not just programmatic scrolling of the iframe document. */#cardReviewDialog .review-card,#cardReviewDialog .review-rows{overflow:visible!important;overscroll-behavior:auto!important}#cardReviewDialog .review-layout,#cardReviewDialog .review-detail-column{overscroll-behavior:auto!important}@media(max-width:760px){#cardReviewDialog{--gl-review-art-w:clamp(125px,34vw,210px);align-items:center!important}.review-card{max-width:100vw!important}.review-layout{grid-template-columns:minmax(0,1fr)!important;overflow:auto!important}.review-art-column{justify-content:center!important}}</style>'+ 
      '</head><body><div id="cardReviewDialog" class="app-dialog review-dialog"><div class="dialog-card review-card">'+
      '<div class="review-header"><div><span id="reviewEyebrow" class="dialog-eyebrow"></span><h2 id="reviewTitle"></h2></div><button id="reviewClose" class="dialog-close review-close" type="button" aria-label="Close">×</button></div>'+
      '<div class="review-layout"><div class="review-art-column"><img id="reviewArt" class="review-art" alt="Card review"></div><div class="review-detail-column"><div id="reviewStats" class="review-stats"></div><div id="reviewRows" class="review-rows"></div></div></div>'+
      '<div id="reviewProgression" class="review-progression" hidden><span>HERO LINEAGES</span><div id="reviewProgressionCards" class="review-progression-cards"></div></div></div></div>'+
      '<script src="assets/review-db158/js/s0-review-clarity.js?v=rc40-p5-review166-mana-terms"><\/script><script src="assets/review-db158/js/review-renderer-v158.js?v=rc40-p5-review166"><\/script>'+
      '<script>(function(){const card='+serialized+';const lineage='+serializedLineage+';window.GL_S0_REVIEW_RENDER(card);parent.GL_PVP_ARTWORK?.bind?.(document.getElementById("reviewArt"),{cardId:card.id,src:card.image,priority:"review"});if(lineage.length){const panel=document.getElementById("reviewProgression"),host=document.getElementById("reviewProgressionCards");panel.hidden=false;lineage.forEach(function(x){const b=document.createElement("button");b.type="button";b.className="review-progression-card"+(x.id===card.id?" active":"");b.dataset.reviewRankId=x.id;b.setAttribute("aria-label","Review "+x.name);const img=document.createElement("img");img.src=x.image;img.alt=x.name;img.draggable=false;b.appendChild(img);b.addEventListener("click",function(){parent.postMessage({kind:"GL_S0_REVIEW_RANK",cardId:x.id},"*")});host.appendChild(b);});}function close(){parent.postMessage({kind:"GL_S0_REVIEW_CLOSE"},"*")}document.getElementById("reviewClose").addEventListener("click",close);document.addEventListener("keydown",function(e){if(e.key==="Escape"){e.preventDefault();close();}});function reportHeight(){var card=document.querySelector("#cardReviewDialog .review-card");if(!card)return;parent.postMessage({kind:"GL_S0_REVIEW_FIT",height:Math.ceil(card.getBoundingClientRect().bottom)},"*");}requestAnimationFrame(reportHeight);setTimeout(reportHeight,80);document.fonts.ready.then(reportHeight);var img=document.getElementById("reviewArt");if(img&&!img.complete)img.addEventListener("load",reportHeight,{once:true});if(window.ResizeObserver)new ResizeObserver(reportHeight).observe(document.querySelector(".review-card"));window.addEventListener("resize",reportHeight);var readySent=false;function reportReady(){if(readySent)return;readySent=true;reportHeight();parent.postMessage({kind:"GL_S0_REVIEW_READY"},"*");}function afterArt(){Promise.resolve(document.fonts.ready).then(function(){requestAnimationFrame(function(){requestAnimationFrame(reportReady);});});}if(img&&!img.complete){img.addEventListener("load",afterArt,{once:true});img.addEventListener("error",afterArt,{once:true});}else afterArt();setTimeout(reportReady,1800);})();<\/script></body></html>';
  }
  // Reuse the same iframe for all reviews. Re-creating srcdoc on every
  // double-click used to re-parse 19 stylesheet links and both JS renderers.
  // This only changes presentation; the Deck Builder review data is unchanged.
  function lineageFor(c,ids){
    if(c.family!=='Hero'||!Array.isArray(ids))return [];
    return ids.map(getCard).filter(Boolean).map(function(x){return {id:x.id,name:x.name,image:x.image};});
  }
  function applyReviewToFrame(frame,c,lineage){
    var w=frame.contentWindow,d=frame.contentDocument,body=frame.parentElement;
    if(!w||!d||typeof w.GL_S0_REVIEW_RENDER!=='function')return false;
    var request=(frame.__glReviewRequest||0)+1;
    frame.__glReviewRequest=request;
    w.GL_S0_REVIEW_RENDER(c);
    // Instant source-compatible exact-card image; full art upgrades in place.
    var reviewArt=d.getElementById('reviewArt');
    g.GL_PVP_ARTWORK?.bind?.(reviewArt,{cardId:c.id,src:c.image,priority:'review'});
    body.querySelector('.gl-review-loading-art')?.setAttribute('hidden','');
    body.classList.add('gl-review-ready');
    var panel=d.getElementById('reviewProgression'),host=d.getElementById('reviewProgressionCards');
    if(panel&&host){
      host.replaceChildren();panel.hidden=!lineage.length;
      lineage.forEach(function(x){
        var button=d.createElement('button');button.type='button';
        button.className='review-progression-card'+(x.id===c.id?' active':'');
        button.dataset.reviewRankId=x.id;
        button.setAttribute('aria-label','Review '+x.name);
        var art=d.createElement('img');art.src=x.image;art.alt=x.name;art.draggable=false;
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
      w.requestAnimationFrame(function(){
        if(!frame.isConnected||frame.__glReviewRequest!==request)return;
        var card=d.querySelector('#cardReviewDialog .review-card');
        var height=card?Math.ceil(card.getBoundingClientRect().bottom):0;
        if(height>100){
          var mobile=g.document.documentElement.classList.contains('gl-mobile-gameplay-stage')||g.document.documentElement.classList.contains('gl-pvp-mobile-gameplay');
          var fit=Math.min(height,Math.max(250,(mobile?747:g.innerHeight)-32));
          frame.style.setProperty('height',fit+'px','important');
        }
      });
    }
    // Height adjustment may happen asynchronously; visible content and CLOSE
    // must not depend on decode, font readiness, or an iframe READY message.
    w.requestAnimationFrame(function(){
      if(!frame.isConnected||frame.__glReviewRequest!==request)return;
      ready();
    });
    return true;
  }
  function mount(el,cardId,progressionIds){
    var c=getCard(cardId);if(!el||!c)return false;
    var lineage=lineageFor(c,progressionIds);
    var frame=el.querySelector('.gl-db158-review-frame');
    if(frame){
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
  g.GL_DB158_REVIEW={mount:mount,getCard:getCard,documentHtml:documentHtml,warm:warmReviewShell,
    source:'Main Deck R3.9 / Legacy Deck R3.9',view:'Deck Builder v1.67',heroFooter:'lobby-only'};
})(window);
