/* PvP presentation only: exact-card thumbnail first, safely decoded full art later.
 * This module never reads the opponent's concealed Hand or changes game state.
 * The caller must supply identities from viewer-safe data after the reveal gate.
 */
(()=>{
'use strict';
const THUMBS=window.GL_PVP_CARD_THUMBNAILS||Object.create(null);
const priorityOf=kind=>({hand:0,hero:0,review:0,attachment:1,public:1,background:3}[kind]??2);
const jobs=new Map(),queue=[],ready=new Set(),retryOnOnline=new Map();
const CAP=6,MAX_ATTEMPTS=3,MAX_READY=128;
let active=0,order=0;
function markReady(src){
  ready.delete(src);ready.add(src);
  while(ready.size>MAX_READY)ready.delete(ready.values().next().value);
}
function resolveUrl(src){
  try{return new URL(String(src||''),document.baseURI).href}catch{return ''}
}
function run(){
  while(active<CAP&&queue.length){
    queue.sort((a,b)=>a.priority-b.priority||a.order-b.order);
    const job=queue.shift();if(job.state!=='queued')continue;
    job.state='loading';active++;
    const image=new Image();image.decoding='async';
    try{image.fetchPriority=job.priority===0?'high':'low'}catch{}
    let settled=false;
    const finish=(ok)=>{
      if(settled)return;settled=true;clearTimeout(timer);image.onload=null;image.onerror=null;
      active--;
      if(ok){jobs.delete(job.src);markReady(job.src);retryOnOnline.delete(job.src);job.resolve(true)}
      else if(job.attempt<MAX_ATTEMPTS){
        job.attempt++;job.state='queued';job.order=++order;
        // Short bounded backoff. The card thumbnail remains visible throughout.
        setTimeout(()=>{if(job.state==='queued')queue.push(job);run()},job.attempt===2?300:850);
      }else{
        jobs.delete(job.src);retryOnOnline.set(job.src,job.priority);job.resolve(false);
      }
      run();
    };
    const timer=setTimeout(()=>finish(false),6000);
    image.onload=()=>{
      const decoded=typeof image.decode==='function'?Promise.resolve().then(()=>image.decode()):Promise.resolve();
      // A loaded response is not the same as a successfully decoded bitmap.
      // On decode rejection, leave the exact-card thumbnail visible and retry.
      decoded.then(()=>finish(image.naturalWidth>0),()=>finish(false));
    };
    image.onerror=()=>finish(false);
    // Keep the canonical resource URL so the browser's HTTP cache is shared.
    image.src=job.src;
    if(image.complete&&image.naturalWidth>0)image.onload();
  }
}
function load(src,options={}){
  src=resolveUrl(src);if(!src)return Promise.resolve(false);
  if(ready.has(src))return Promise.resolve(true);
  const priority=priorityOf(options.priority);
  let existing=jobs.get(src);
  if(existing){
    if(priority<existing.priority)existing.priority=priority;
    return existing.promise;
  }
  const job={src,priority,order:++order,attempt:1,state:'queued'};
  job.promise=new Promise(resolve=>{job.resolve=resolve});
  jobs.set(src,job);retryOnOnline.delete(src);queue.push(job);run();
  return job.promise;
}
function bind(img,{cardId,src,priority='hand',canRevealFace=true}={}){
  if(!img)return false;
  cardId=String(cardId||'');
  if(!canRevealFace){
    // This API deliberately does not choose a hidden-card visual or attempt a
    // network request. The existing Draw/Privacy renderer owns that state.
    return false;
  }
  const original=resolveUrl(src),thumbnail=THUMBS[cardId];
  if(!original||!cardId)return false;
  if(img.dataset.glPvpArtId===cardId && img.dataset.glPvpArtFull===original &&
     img.dataset.glPvpArtStage==='full')return true;
  if(img.dataset.glPvpArtId!==cardId || img.dataset.glPvpArtFull!==original){
    img._glPvpArtworkGeneration=(img._glPvpArtworkGeneration||0)+1;
    img.dataset.glPvpArtId=cardId;img.dataset.glPvpArtFull=original;
    img.dataset.glPvpArtStage=thumbnail?'thumb':'original';
    if(thumbnail)img.src=thumbnail;
    else img.src=original;
    // No waiting class or Back-of-Card overlay for an already revealed face.
    img.classList?.remove('gl-decode-pending');
  }
  const generation=img._glPvpArtworkGeneration||0;
  if(img.dataset.glPvpArtStage==='full')return true;
  if(img._glPvpArtworkRequested===generation)return !!thumbnail;
  img._glPvpArtworkRequested=generation;
  load(original,{priority}).then(ok=>{
    img._glPvpArtworkRequested=null;
    if(!ok || img._glPvpArtworkGeneration!==generation ||
       img.dataset.glPvpArtId!==cardId || img.dataset.glPvpArtFull!==original)return;
    // The full original is loaded and decoded *before* assigning its src.
    // Browsers reuse the resource cache. The thumbnail remains on failure.
    img.src=original;img.dataset.glPvpArtStage='full';
  });
  return !!thumbnail;
}
function thumb(cardId){return THUMBS[String(cardId||'')]||''}
window.addEventListener('online',()=>{
  // Bind anew so that retried originals can actually replace live thumbnails.
  document.querySelectorAll('img[data-gl-pvp-art-stage="thumb"]').forEach(img=>{
    img._glPvpArtworkRequested=null;
    bind(img,{cardId:img.dataset.glPvpArtId,src:img.dataset.glPvpArtFull,priority:'hand'});
  });
  retryOnOnline.clear();
});
window.GL_PVP_ARTWORK=Object.freeze({bind,load,thumb,hasThumbnail:id=>!!thumb(id),
  diagnostics:()=>({queued:queue.filter(x=>x.state==='queued').length,active,
    ready:ready.size,failed:retryOnOnline.size,cardCount:Object.keys(THUMBS).length})});
})();
