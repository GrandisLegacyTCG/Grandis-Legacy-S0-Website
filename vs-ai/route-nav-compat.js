/* Grandis Legacy Website-only VS AI shared header. No gameplay changes. */
(()=>{
  'use strict';
  const header=document.querySelector('.gl-lobby-head');
  if(!header)return;
  const root=new URL('./',document.baseURI), at=rel=>new URL(rel,root).href;
  header.classList.add('gl-site-app-header');
  const logo=header.querySelector('img.gl-lobby-logo');
  if(logo){logo.classList.add('gl-site-brand-img');logo.setAttribute('src',at('assets/site/web-s0/logo-transparent.webp'));}
  let home=header.querySelector('a.gl-lobby-home');
  if(!home&&logo){home=document.createElement('a');home.className='gl-lobby-home gl-site-brand';logo.replaceWith(home);home.appendChild(logo);}
  if(home){home.classList.add('gl-site-brand');home.href=at('');home.setAttribute('aria-label','Grandis Legacy Home');}
  header.querySelector('h1')?.classList.add('gl-site-app-title');
  header.querySelector('.gl-lobby-global-nav')?.remove();
  let nav=header.querySelector('.gl-site-app-nav, .gl-lobby-website-links');
  if(!nav){nav=document.createElement('nav');header.appendChild(nav);}
  nav.className='gl-site-app-nav';nav.setAttribute('aria-label','Grandis Legacy applications');
  nav.replaceChildren();
  [['GO TO DECK BUILDER','deck-builder/','outline'],['GO TO PVP','pvp/','primary']].forEach(([label,path,style])=>{
    const a=document.createElement('a');a.href=at(path);a.textContent=label;
    a.className='gl-site-nav-btn gl-site-nav-btn--'+style;nav.appendChild(a);
  });
  const html=document.documentElement;
  const sync=()=>header.classList.toggle('gl-site-app-header-logical',html.classList.contains('gl-mobile-landscape-lobby'));
  sync();new MutationObserver(sync).observe(html,{attributes:true,attributeFilter:['class']});
})();
