/* Grandis Legacy Website-only RC41 navigation. No gameplay modification.
   The game is mounted under /vs-ai/ with <base href="../"> for shared assets. */
(()=>{
  'use strict';
  const header=document.querySelector('.gl-lobby-head');
  if(!header)return;
  const root=new URL('./',document.baseURI);
  const at=rel=>new URL(rel,root).href;
  const logo=header.querySelector('img.gl-lobby-logo');
  let home=header.querySelector('a.gl-lobby-home');
  if(!home&&logo){home=document.createElement('a');home.className='gl-lobby-home';logo.replaceWith(home);home.appendChild(logo);}
  if(home){home.href=at('');home.setAttribute('aria-label','Grandis Legacy Home');}
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
  const s=document.createElement('style');
  s.textContent=`
    .gl-lobby-website-links{display:flex;align-items:center;gap:10px;margin-left:auto;flex:0 0 auto}
    .gl-lobby-website-links a{padding:9px 13px;border:1px solid #c6a14f;border-radius:9px;background:rgba(10,28,43,.92);color:#ffe4a2;text-decoration:none;font:800 12px/1.3 Noto,Arial,sans-serif;white-space:nowrap}
    .gl-lobby-website-links a:hover,.gl-lobby-website-links a:focus-visible{background:#263e50;outline:2px solid #efd47f;outline-offset:1px}
    html.gl-mobile-landscape-lobby .gl-lobby-website-links{display:none!important}
    @media (max-width:800px){.gl-lobby-website-links{display:none!important}}
  `;
  document.head.appendChild(s);
})();
