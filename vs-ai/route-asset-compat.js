/* Grandis Legacy Website-only VS AI RC41 asset URL adapter.
   Standalone engine is shared at Website root; game state and rules untouched.
   Artwork query gets a NEW cache key because R3.9 replaced 32 printed WebPs. */
(()=>{
  'use strict';
  const bridge=window.GL_GAME_ENGINE;
  if(!bridge)return;
  const root=new URL('../',window.location.href);
  const nestedPath=new URL('vs-ai/',root).pathname;
  const cardPath=new URL('card-art/',root).pathname;
  const artworkRevision='gl-vs-ai-rc42-r398-r40-20261124';
  const fix=value=>{
    if(typeof value!=='string'||!value)return value;
    let original;
    try{original=new URL(value,window.location.href)}catch(_){return value}
    if(original.origin!==root.origin)return value;
    let target=original;
    if(original.pathname.startsWith(nestedPath)){
      const rest=original.pathname.slice(nestedPath.length);
      if(!/^(?:card-art|assets|engine)\//.test(rest))return value;
      target=new URL(rest+original.search+original.hash,root);
    }else if(!original.pathname.startsWith(cardPath))return value;
    if(target.pathname.startsWith(cardPath))target.searchParams.set('v',artworkRevision);
    return target.href;
  };
  if(typeof bridge.cardView==='function'){
    const original=bridge.cardView;
    bridge.cardView=function(...args){
      const item=original.apply(this,args);
      if(item&&typeof item==='object'){
        if(item.thumb)item.thumb=fix(item.thumb);
        if(item.full)item.full=fix(item.full);
      }
      return item;
    };
  }
  if(typeof bridge.manaAsset==='function'){
    const original=bridge.manaAsset;
    bridge.manaAsset=function(...args){return fix(original.apply(this,args))};
  }
})();
