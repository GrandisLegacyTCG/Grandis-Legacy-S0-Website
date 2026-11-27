/* RC42 universal face-up artwork loader, adapted from Deck Builder v1.68.
 * Embedded, exact-card miniatures -> bounded offscreen load/decode -> full face.
 * UI only: never reads a deck, opponent hand, game state or AI decision data.
 * Works offline (file://) and HTTP. The only inputs are explicit image sources.
 */
(function(root){
  'use strict';
  const thumbs=root.GL_RC42_CARD_THUMBNAILS||{}, versions=root.GL_RC42_CARD_ART_VERSIONS||{};
  const ids=Object.keys(thumbs), reverse=new Map(ids.map(id=>[thumbs[id],id]));
  const pattern=/(?:^|\/)card-art\/(S0-[A-Z0-9-]+)\.webp(?:[?#]|$)/i;
  const states=new WeakMap(), jobs=new Map(), thumbsReady=new Map(), attached=new WeakSet();
  const queue=[], readyCache=new Map(), sourceCache=new Map(), blobIds=new Map(), MAX_ACTIVE=4, MAX_READY=32, MAX_TRIES=3;
  const stats={thumbnailCount:ids.length,thumbDecoded:0,fullDecoded:0,fullRequests:0,retries:0,failures:0,active:0,maxActive:0};
  let preloadPromise=null;
  function idOf(value){
    const v=String(value||'');
    if(reverse.has(v))return reverse.get(v);
    if(blobIds.has(v))return blobIds.get(v);
    if(Object.prototype.hasOwnProperty.call(thumbs,v.toUpperCase()))return v.toUpperCase();
    const m=pattern.exec(v);const id=m?.[1]?.toUpperCase();return id&&thumbs[id]?id:null;
  }
  function first(value){const id=idOf(value);return id?thumbs[id]:String(value||'');}
  function url(id){return 'card-art/'+id+'.webp?v='+versions[id];}
  function original(img){
    const raw=img?.getAttribute('src')||'', state=states.get(img);
    return state&&raw===state.display?url(state.id):(idOf(raw)?url(idOf(raw)):raw);
  }
  function decode(img){return typeof img.decode==='function'?img.decode():Promise.resolve();}
  function warm(value){
    const id=idOf(value);if(!id)return Promise.resolve(false);
    if(thumbsReady.has(id))return thumbsReady.get(id).promise;
    const image=new root.Image(), entry={image,promise:null};
    entry.promise=new Promise(resolve=>{
      let done=false;
      const finish=ok=>{if(done)return;done=true;image.onload=null;image.onerror=null;if(ok)stats.thumbDecoded++;resolve(ok);};
      image.onload=()=>decode(image).then(()=>finish(!!image.naturalWidth),()=>finish(false));
      image.onerror=()=>finish(false);image.src=thumbs[id];
      if(image.complete&&image.naturalWidth)image.onload();
    });
    thumbsReady.set(id,entry);return entry.promise;
  }
  function preloadAll(){
    if(!preloadPromise){
      let cursor=0;const worker=async()=>{while(cursor<ids.length){const id=ids[cursor++];await warm(id);}};
      preloadPromise=Promise.all(Array.from({length:4},worker));
    }
    return preloadPromise;
  }
  function detach(img){const state=states.get(img);if(state){jobs.get(state.id)?.users.delete(img);state.observer?.unobserve(img);}}
  function write(img,state,src,full){
    state.display=src;state.full=full;
    if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    img.dataset.glArtId=state.id;img.dataset.glArtQuality=full?'full':'thumbnail';
  }
  function reset(img){detach(img);states.delete(img);delete img.dataset.glArtId;delete img.dataset.glArtQuality;}
  function set(img,source){
    if(!img)return;
    const raw=String(source||''),id=idOf(raw),old=states.get(img);
    if(!id){
      if(old)reset(img);
      if(raw){if(img.getAttribute('src')!==raw)img.setAttribute('src',raw);}
      else if(img.hasAttribute('src'))img.removeAttribute('src');
      return;
    }
    if(old&&old.id===id&&img.getAttribute('src')===old.display){if(img.isConnected&&!old.full)observe(img,old);return;}
    if(old)reset(img);
    const state={id,display:'',full:false,observer:null};states.set(img,state);
    const cached=readyCache.get(id);
    if(cached&&cached.src.startsWith('blob:')){touchReady(id,cached);write(img,state,cached.src,true);}
    else write(img,state,thumbs[id],false);
    // Bundled thumbnail always available, including failed original downloads.
    // Upgrades for DOM cards are requested only once they are on/near screen.
    if(img.isConnected&&!state.full)observe(img,state);
  }
  const docObservers=new WeakMap();
  function observe(img,state){
    const observer=docObservers.get(img.ownerDocument);
    if(observer){state.observer=observer;observer.observe(img);}
    else request(img);
  }
  function priority(img){return img.closest('[class*="hover-preview"],.gl-card-review-body,.review-art-column,.gl-center-choice-stage,.hand,.hero-lane,.gl-lobby-hero,.active-card-visual')?2:1;}
  function jobFor(id){if(!jobs.has(id))jobs.set(id,{id,users:new Set(),status:'idle',attempt:0,priority:1});return jobs.get(id);}
  function promote(img,job,cached){
    const state=states.get(img);if(!state||!img.isConnected||state.id!==job.id||img.getAttribute('src')!==state.display)return;
    if(cached.src.startsWith('blob:')){write(img,state,cached.src,true);state.observer?.unobserve(img);return;}
    // Offline/file fallback: ensure the thumbnail was decoded on this DOM node
    // before swapping to the already decoded local file.
    if(state.promoting)return;state.promoting=true;
    decode(img).catch(()=>{}).then(()=>root.requestAnimationFrame(()=>{
      if(states.get(img)!==state||!img.isConnected||img.getAttribute('src')!==state.display)return;
      state.promoting=false;write(img,state,cached.src,true);state.observer?.unobserve(img);
    }));
  }
  function touchReady(id,entry){
    readyCache.delete(id);readyCache.set(id,entry);
    while(readyCache.size>MAX_READY){const evict=readyCache.keys().next().value;readyCache.delete(evict);const job=jobs.get(evict);if(job?.status==='ready'){job.status='idle';job.attempt=0;}}
  }
  function request(img){
    const state=states.get(img);if(!state||state.full||!img.isConnected)return;
    const cached=readyCache.get(state.id), job=jobFor(state.id);
    if(cached){touchReady(state.id,cached);promote(img,job,cached);return;}
    if(job.status==='failed')return;
    job.users.add(img);job.priority=Math.max(job.priority,priority(img));
    if(job.status==='idle'){job.status='queued';queue.push(job);pump();}
  }
  function pump(){
    while(stats.active<MAX_ACTIVE&&queue.length){
      queue.sort((a,b)=>b.priority-a.priority);const job=queue.shift();
      if(job.status!=='queued')continue;
      for(const img of job.users){if(!img.isConnected||states.get(img)?.id!==job.id)job.users.delete(img);}
      if(!job.users.size){job.status='idle';continue;}
      job.status='loading';stats.active++;stats.maxActive=Math.max(stats.maxActive,stats.active);stats.fullRequests++;
      if(job.attempt)stats.retries++;
      const originalSrc=url(job.id)+(job.attempt?'&glArtRetry='+job.attempt:'');
      const image=new root.Image();image.decoding='async';image.fetchPriority=job.priority===2?'high':'auto';
      let done=false,src=sourceCache.get(job.id)||originalSrc,createdBlob=null;
      const controller=typeof root.AbortController==='function'?new root.AbortController():null;
      const timer=root.setTimeout(()=>{controller?.abort();finish(false);},15000);
      function finish(ok){
        if(done)return;done=true;root.clearTimeout(timer);image.onload=null;image.onerror=null;stats.active--;
        if(ok){
          if(createdBlob){sourceCache.set(job.id,createdBlob);blobIds.set(createdBlob,job.id);}
          job.status='ready';job.attempt=0;stats.fullDecoded++;
          const cached={image,src};touchReady(job.id,cached);
          for(const img of job.users)promote(img,job,cached);job.users.clear();
        }else{
          if(createdBlob)root.URL.revokeObjectURL(createdBlob);
          job.attempt++;
          if(job.attempt<MAX_TRIES){job.status='retry';root.setTimeout(()=>{if(job.status==='retry'){job.status='queued';queue.push(job);pump();}},job.attempt===1?300:1200);}
          else{job.status='failed';job.users.clear();stats.failures++;}
        }
        pump();
      }
      image.onload=()=>decode(image).then(()=>finish(!!image.naturalWidth),()=>finish(false));image.onerror=()=>finish(false);
      const loadImage=()=>{if(done)return;image.src=src;if(image.complete&&image.naturalWidth)image.onload();};
      // Under HTTP, keep the exact fully downloaded WebP bytes in a local blob.
      // This avoids a second HTTP request on every new DOM image (including
      // Cache-Control: no-store), and prevents cached lobby art going blank
      // in the Battlefield if the connection slows down. The compressed blob
      // cache is bounded by the 250 immutable local catalog faces; decoded
      // bitmaps have a separate 32-entry LRU. file:// uses the image loader.
      let http=false;try{http=/^https?:$/.test(new URL(originalSrc,document.baseURI).protocol);}catch(_){}
      if(!sourceCache.has(job.id)&&http&&typeof root.fetch==='function'&&root.URL?.createObjectURL){
        root.fetch(originalSrc,{signal:controller?.signal}).then(response=>{
          if(!response.ok)throw new Error('Artwork HTTP '+response.status);
          return response.blob();
        }).then(blob=>{
          if(done)return;
          createdBlob=root.URL.createObjectURL(blob);src=createdBlob;loadImage();
        }).catch(()=>finish(false));
      }else loadImage();
    }
  }
  function prepare(img){
    if(img.tagName!=='IMG')return;
    const raw=img.getAttribute('src')||'',state=states.get(img);
    if(state&&raw===state.display){if(!state.full&&img.isConnected)observe(img,state);return;}
    if(idOf(raw))set(img,raw);else if(state)reset(img);
  }
  function scan(node,fn){if(node.nodeType!==1&&node.nodeType!==9&&node.nodeType!==11)return;if(node.tagName==='IMG')fn(node);node.querySelectorAll?.('img').forEach(fn);}
  function attach(doc){
    if(!doc||attached.has(doc))return;attached.add(doc);
    const w=doc.defaultView;
    if(w?.IntersectionObserver){const observer=new w.IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)request(e.target);},{rootMargin:'120px'});docObservers.set(doc,observer);}
    doc.addEventListener('error',event=>{
      const img=event.target,state=states.get(img);
      if(!state||!state.full||img.getAttribute('src')!==state.display)return;
      // An unexpected display failure must leave the real miniature, not a card back.
      const job=jobFor(state.id);readyCache.delete(state.id);job.status='failed';job.attempt=MAX_TRIES;stats.failures++;
      write(img,state,thumbs[state.id],false);
    },true);
    const observer=new root.MutationObserver(records=>{
      for(const r of records){
        if(r.type==='attributes')prepare(r.target);
        else{for(const node of r.removedNodes)scan(node,img=>{if(!img.isConnected)detach(img);});for(const node of r.addedNodes)scan(node,prepare);}
      }
    });
    observer.observe(doc,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});scan(doc,prepare);
  }
  root.addEventListener('online',()=>{for(const job of jobs.values())if(job.status==='failed'){job.status='idle';job.attempt=0;}document.querySelectorAll('img[data-gl-art-quality="thumbnail"]').forEach(request);});
  root.GL_CARD_ART={id:idOf,first,original,set,warm,preloadAll,attach,diagnostics:stats};
  // Thumbnail sources are inline: render them on demand. Avoid decoding all 250
  // card faces during startup; full art loads only for visible cards.
  attach(document);
})(window);
