/* Grandis Legacy Season 0 - route-only compatibility adapter.
   The canonical game engine stays at Website root. Only absolute artwork URLs
   made from location.href are corrected when VS AI is opened at /vs-ai/.
   This file does not modify game state, rules, damage, or effects. */
(()=>{
  'use strict';
  const bridge=window.GL_GAME_ENGINE;
  if(!bridge)return;
  const root=new URL('../',window.location.href);
  const nested=new URL('vs-ai/',root).pathname;
  const fix=(value)=>{
    if(typeof value!=='string'||!value)return value;
    let url;try{url=new URL(value,window.location.href)}catch(_){return value}
    if(url.origin!==window.location.origin||!url.pathname.startsWith(nested))return value;
    const rest=url.pathname.slice(nested.length);
    if(!/^(?:card-art|assets|engine)\//.test(rest))return value;
    return new URL(rest+url.search+url.hash,root).href;
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
