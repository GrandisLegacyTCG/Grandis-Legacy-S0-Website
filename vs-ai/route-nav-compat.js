/* Website-only navigation: Home is distinct from VS AI.
   Uses the existing lobby header without touching the match engine. */
(()=>{
 'use strict';
 const header=document.querySelector('.gl-lobby-head');
 if(!header)return;
 const logo=header.querySelector('img.gl-lobby-logo');
 let home=header.querySelector('a.gl-lobby-home');
 if(!home && logo){
   home=document.createElement('a');home.className='gl-lobby-home';
   logo.replaceWith(home);home.appendChild(logo);
 }
 if(home){home.href=new URL('./',document.baseURI).href;home.setAttribute('aria-label','Grandis Legacy Home')}
 let nav=header.querySelector('.gl-lobby-app-actions');
 if(!nav){nav=document.createElement('nav');nav.className='gl-lobby-app-actions';nav.setAttribute('aria-label','Grandis Legacy applications');header.append(nav)}
 const links=[...nav.querySelectorAll('a')];
 const ensure=(text,path,modifier)=>{
   let anchor=links.find(a=>a.textContent.trim().toUpperCase().includes(text));
   if(!anchor){anchor=document.createElement('a');anchor.textContent=text==='PVP'?'GO TO PVP':'GO TO DECK BUILDER';anchor.className='gl-lobby-app-link';nav.append(anchor)}
   anchor.href=new URL(path,document.baseURI).href;
   anchor.classList.add('gl-lobby-app-link');if(modifier)anchor.classList.add(modifier);
 };
 ensure('DECK BUILDER','deck-builder/');
 ensure('PVP','pvp/','gl-lobby-app-link--pvp');
 const oldHome=document.querySelector('#aiLobbyHomeButton');if(oldHome)oldHome.href=new URL('./',document.baseURI).href;
 const oldDb=document.querySelector('#aiLobbyDeckBuilderButton');if(oldDb)oldDb.href=new URL('deck-builder/',document.baseURI).href;
 const oldPvp=document.querySelector('#aiLobbyPvpButton');if(oldPvp)oldPvp.href=new URL('pvp/',document.baseURI).href;
})();
