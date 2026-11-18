/* Grandis Legacy Website-only RC41 navigation. No gameplay modification.
   The game is mounted under /vs-ai/ with <base href="../"> for shared assets. */
(()=>{
  'use strict';
  const header=document.querySelector('.gl-lobby-head');
  if(!header)return;
  const root=new URL('./',document.baseURI);
  const at=rel=>new URL(rel,root).href;
  const logo=header.querySelector('img.gl-lobby-logo');
  if(logo){logo.classList.add('gl-site-brand-img');logo.setAttribute('src',at('assets/site/web-s0/logo-transparent.webp'));}
  let home=header.querySelector('a.gl-lobby-home');
  if(!home&&logo){home=document.createElement('a');home.className='gl-lobby-home gl-site-brand';logo.replaceWith(home);home.appendChild(logo);}
  if(home){home.classList.add('gl-site-brand');home.href=at('');home.setAttribute('aria-label','Grandis Legacy Home');}
  // Preserve RC41's own single mobile menu and button behavior.
  const mobileMenu=header.querySelector('.gl-lobby-global-menu');
  if(mobileMenu){
    const links=mobileMenu.querySelectorAll('a');
    links.forEach(a=>{
      if(/deck builder/i.test(a.textContent))a.href=at('deck-builder/');
      else if(/pvp/i.test(a.textContent))a.href=at('pvp/');
    });
    if(!mobileMenu.querySelector('[data-gl-mobile-home]')){
      const a=document.createElement('a');a.href=at('');a.dataset.glMobileHome='1';a.textContent='Go to Homepage';mobileMenu.prepend(a);
    }
  }
  // On desktop, the website provides direct app navigation outside RC41's mobile menu.
  let desktop=header.querySelector('.gl-lobby-website-links');
  if(!desktop){
    desktop=document.createElement('nav');desktop.className='gl-lobby-website-links';
    desktop.setAttribute('aria-label','Grandis Legacy applications');
    header.appendChild(desktop);
  }
  [['GO TO DECK BUILDER','deck-builder/'],['GO TO PVP','pvp/']].forEach(([label,path])=>{
    const a=document.createElement('a');a.href=at(path);a.textContent=label;desktop.appendChild(a);
  });
  // Navigation styling lives exclusively in /assets/css/gl-header-parity.css.
  // Avoid late-injected duplicate styles that caused the gold hover stroke.
})();
