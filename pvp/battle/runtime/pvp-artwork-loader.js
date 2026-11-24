/* PvP presentation only: instant latest VS AI RC42 thumbnail -> decoded full art.
 * Unlike an on-demand URL, the exact-card thumbnail is embedded: a revealed
 * face can paint while offline, while /card-art/ is slow, or if full art 404s.
 * Only IMG sources explicitly emitted after viewer-safe reveal are eligible.
 * Never traverse engine game state, opponent Hand, concealed decks or sockets.
 */
(()=>{
'use strict';
const THUMBS=window.GL_PVP_CARD_THUMBNAILS||Object.create(null);
const PUBLIC_FACE=/(?:^|\/)card-art\/(S0-[A-Z0-9-]+)\.webp(?:[?#]|$)/i;
const attachedDocuments=new WeakSet(),docObservers=new WeakMap();
function idFromVisibleSrc(src){
  const id=PUBLIC_FACE.exec(String(src||''))?.[1]?.toUpperCase()||'';
  return Object.prototype.hasOwnProperty.call(THUMBS,id)?id:'';
}
const priorityOf=kind=>({hand:0,hero:0,review:0,attachment:1,public:1,background:3}[kind]??2);
const jobs=new Map(),queue=[],ready=new Set(),retryOnOnline=new Map();
const MAX_ATTEMPTS=3,MAX_READY=128;
function decodeCap(){
  const nav=globalThis.navigator||{};
  const mem=Number(nav.deviceMemory||0);
  if(nav.connection?.saveData||(mem>0&&mem<=2))return 2;
  if(Number(nav.maxTouchPoints||0)>0||globalThis.matchMedia?.('(pointer: coarse)')?.matches)return 3;
  return 6;
}
let active=0,order=0;
function markReady(src){
  ready.delete(src);ready.add(src);
  while(ready.size>MAX_READY)ready.delete(ready.values().next().value);
}
function resolveUrl(src){
  try{return new URL(String(src||''),document.baseURI).href}catch{return ''}
}
function run(){
  while(active<decodeCap()&&queue.length){
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
function bind(img,{cardId,src,priority='hand',canRevealFace=true,deferOriginal=false}={}){
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
     img.dataset.glPvpArtStage==='full' && resolveUrl(img.getAttribute?.('src'))===original)return true;
  if(img.dataset.glPvpArtId!==cardId || img.dataset.glPvpArtFull!==original){
    img._glPvpArtworkGeneration=(img._glPvpArtworkGeneration||0)+1;
    img.dataset.glPvpArtId=cardId;img.dataset.glPvpArtFull=original;
    img.dataset.glPvpArtStage=thumbnail?'thumb':'original';
    if(thumbnail)img.src=thumbnail;
    else img.src=original;
    // No waiting class or Back-of-Card overlay for an already revealed face.
    img.classList?.remove('gl-decode-pending');
  } else if(thumbnail && img.dataset.glPvpArtStage==='thumb' &&
            img.getAttribute?.('src')!==thumbnail){
    // A renderer can write the original repeatedly while a server snapshot
    // re-renders. Keep the bundled miniature until full decode succeeds.
    img.src=thumbnail;
  }
  const generation=img._glPvpArtworkGeneration||0;
  if(img.dataset.glPvpArtStage==='full')return true;
  if(deferOriginal && thumbnail)return true;
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

// Universal face-up adapter: cover Mana, Hero, Hand, attachment, center choice,
// Card Played, public notices, and Lobby without modifying any gameplay code.
// We only act on already-rendered public /card-art/<id>.webp IMG sources;
// face-down Back-of-Card src values deliberately never match this allowlist.
function inspect(img){
  if(!img||img.tagName!=='IMG'||!img.getAttribute)return;
  const raw=img.getAttribute('src')||'';
  const id=idFromVisibleSrc(raw);
  if(!id)return;
  const canonical=resolveUrl(raw);
  if(img.dataset.glPvpArtId===id && img.dataset.glPvpArtFull===canonical &&
     img.dataset.glPvpArtStage==='full')return;
  if(img.dataset.glPvpArtId===id && img.dataset.glPvpArtFull===canonical &&
     img.dataset.glPvpArtStage==='thumb' && img._glPvpArtworkRequested){
    // A transient re-render must not displace the thumbnail with an
    // undecoded original while a full-resolution request is in flight.
    const miniature=THUMBS[id];
    if(img.getAttribute('src')!==miniature)img.src=miniature;
    return;
  }
  const observer=docObservers.get(img.ownerDocument||document);
  if(observer){
    // Full-resolution work is lazy for cards outside the visible viewport.
    // The inline miniature is painted immediately, before the IO callback.
    bind(img,{cardId:id,src:canonical,priority:'public',deferOriginal:true});
    observer.observe(img);
  }else bind(img,{cardId:id,src:canonical,priority:'public'});
}
function scan(node,fn){
  if(!node||![1,9,11].includes(node.nodeType))return;
  if(node.tagName==='IMG')fn(node);
  node.querySelectorAll?.('img').forEach(fn);
}
function attach(doc){
  if(!doc||attachedDocuments.has(doc)||!doc.addEventListener||!doc.querySelectorAll)return;
  attachedDocuments.add(doc);
  const view=doc.defaultView||window;
  if(typeof view.IntersectionObserver==='function'){
    const io=new view.IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        io.unobserve(entry.target);
        const img=entry.target,id=img.dataset.glPvpArtId,original=img.dataset.glPvpArtFull;
        if(id&&original&&img.dataset.glPvpArtStage==='thumb')
          bind(img,{cardId:id,src:original,priority:'public'});
      }
    },{rootMargin:'120px'});
    docObservers.set(doc,io);
  }
  // Browser error after an offscreen full decode is not allowed to replace a
  // revealed face with an unrelated card back or an empty broken <img>.
  doc.addEventListener('error',event=>{
    const img=event.target;
    if(img?.tagName!=='IMG'||img.dataset?.glPvpArtStage!=='full')return;
    const id=img.dataset.glPvpArtId;
    if(!THUMBS[id])return;
    // A legacy renderer's own onerror handler can substitute the Main Deck
    // back, which is incorrect for a revealed face. Exact miniatures win.
    event.stopImmediatePropagation?.();
    img.dataset.glPvpArtStage='thumb';
    img.src=THUMBS[id];
  },true);
  if(typeof view.MutationObserver==='function'){
    const mutation=new view.MutationObserver(records=>{
      for(const rec of records){
        if(rec.type==='attributes')inspect(rec.target);
        else{
          for(const node of rec.removedNodes)scan(node,img=>docObservers.get(doc)?.unobserve(img));
          for(const node of rec.addedNodes)scan(node,inspect);
        }
      }
    });
    mutation.observe(doc,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  }
  scan(doc,inspect);
}
window.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')run()});
window.addEventListener('online',()=>{
  // Bind anew so that retried originals can actually replace live thumbnails.
  // Do not strongly retain obsolete Card Review iframe documents.
  const docs=[document];
  document.querySelectorAll('iframe').forEach(frame=>{
    try{if(frame.contentDocument)docs.push(frame.contentDocument)}catch{}
  });
  for(const doc of docs){
    if(!attachedDocuments.has(doc))continue;
    doc.querySelectorAll('img[data-gl-pvp-art-stage="thumb"]').forEach(img=>{
      img._glPvpArtworkRequested=null;
      bind(img,{cardId:img.dataset.glPvpArtId,src:img.dataset.glPvpArtFull,priority:'hand'});
    });
  }
  retryOnOnline.clear();
});
window.GL_PVP_ARTWORK=Object.freeze({bind,load,thumb,attach,idFromVisibleSrc,hasThumbnail:id=>!!thumb(id),
  diagnostics:()=>({queued:queue.filter(x=>x.state==='queued').length,active,capacity:decodeCap(),
    ready:ready.size,failed:retryOnOnline.size,cardCount:Object.keys(THUMBS).length,
    embedded:Object.keys(THUMBS).every(id=>THUMBS[id].startsWith('data:image/webp;base64,'))})});
attach(document);
})();
