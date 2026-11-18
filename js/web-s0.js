'use strict';
(()=>{
 const classes=[
 {name:'Warrior',key:'warrior',group:'WAR',start:1,hero:'Draxen Blacksand'},
 {name:'Cleric',key:'cleric',group:'CLE',start:1,hero:'Elara Heavens'},
 {name:'Mage',key:'mage',group:'MAG',start:1,hero:'Vaelis Stormweave'},
 {name:'Thief',key:'thief',group:'THF',start:1,hero:'Finnian Copperpot'},
 {name:'Archer',key:'archer',group:'ARC',start:1,hero:'Fenrir Ironfang'}
 ];
 const rankNames=[["Warrior", "Gladiator", "Conqueror"], ["Cleric", "Priest", "Saint"], ["Mage", "Elementalist", "Elemental Lord"], ["Thief", "Rogue", "Renegade"], ["Archer", "Marksman", "Grand Ranger"]];
 let selected=0,rank=0;
 const tabs=[...document.querySelectorAll('[role=tab]')],card=document.querySelector('#hero-card'),panel=document.querySelector('#class-panel'),emblem=document.querySelector('.class-emblem'),down=document.querySelector('#rank-down'),up=document.querySelector('#rank-up'),status=document.querySelector('#rank-status');
 function update(){
  const c=classes[selected];
  card.src=`assets/site/web-s0/S0-${c.group}-H${String(c.start+rank).padStart(3,'0')}.webp`;
  card.alt=`${c.hero} — ${rankNames[selected][rank]}, Rank ${['I','II','III'][rank]}`;
  status.textContent=card.alt;emblem.src=`assets/site/web-s0/icon-${c.key}.svg`;
  panel.setAttribute('aria-labelledby',`tab-${c.key}`);
  down.disabled=rank===0;up.disabled=rank===2;
  tabs.forEach((t,i)=>{t.setAttribute('aria-selected',String(i===selected));t.tabIndex=i===selected?0:-1;
   const label=t.querySelector('.class-label'),name=rankNames[i][rank];
   if(label.textContent!==name){label.getAnimations().forEach(a=>a.cancel());label.textContent=name;
    if(!matchMedia('(prefers-reduced-motion:reduce)').matches)label.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
   }
  });
 }
 function select(i){selected=i;update()}
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(i));t.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();select(next);tabs[next].focus()})});
 up.addEventListener('click',()=>{if(rank<2){rank++;update()}});down.addEventListener('click',()=>{if(rank>0){rank--;update()}});
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#primary-nav');
 function close(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false')}
 menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open))});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){close();menu.focus()}});
 document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close()});
 window.matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)close()});
})();

(()=>{const buttons=[...document.querySelectorAll('.section-dots button')],sections=buttons.map(b=>document.getElementById(b.dataset.section));function active(){let best=sections[0],distance=Infinity;const center=innerHeight*.45;for(const s of sections){const r=s.getBoundingClientRect();const d=r.top<=center&&r.bottom>center?0:Math.min(Math.abs(r.top-center),Math.abs(r.bottom-center));if(d<distance){best=s;distance=d}}buttons.forEach(b=>{if(b.dataset.section===best.id)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')})}buttons.forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.section).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'})));let queued=false;addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{active();queued=false})}},{passive:true});addEventListener('resize',active);active()})();

// Four feature cards. No clones, no infinite scrolling, no auto-play.
(()=>{
 const track=document.querySelector('.feature-grid');
 const cards=[...track.querySelectorAll('.feature')];
 if(!track || cards.length!==4)return;
 let activeStart=0, visibleCount=2, step=0, timer=null, drag=null, suppressDragClick=false;
 const prefersReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function sync(index){
  activeStart=clamp(index,0,cards.length-visibleCount);
  cards.forEach((card,i)=>{
   const current=i>=activeStart && i<activeStart+visibleCount;
   const link=card.querySelector('.feature-image-link');
   card.classList.toggle('is-current',current);
   if(current){card.removeAttribute('role');card.removeAttribute('tabindex');card.removeAttribute('aria-label');card.setAttribute('aria-current','true')}
   else{card.setAttribute('role','button');card.tabIndex=0;card.setAttribute('aria-label','Show '+card.querySelector('h3').textContent);card.removeAttribute('aria-current')}
   if(link){link.tabIndex=current?0:-1; if(current)link.removeAttribute('aria-hidden');else link.setAttribute('aria-hidden','true')}
  });
 }
 function go(index,instant=false){
  sync(index);
  track.scrollTo({left:activeStart*step,behavior:instant||prefersReduced()?'instant':'smooth'});
 }
 function layout(){
  visibleCount=matchMedia('(max-width: 800px)').matches?1:2;
  const view=track.clientWidth;
  const gap=parseFloat(getComputedStyle(track).gap)||24;
  const sidePeek=visibleCount===1?clamp(view*.11,43,50):clamp(view*.045,32,72);
  const idealWidth=visibleCount===1?Math.min(563,view-2*sidePeek):Math.min(563,(view-2*sidePeek-gap)/2);
  let cardWidth=Math.max(200,idealWidth);
  const setCardWidth=()=>{
   track.style.setProperty('--feature-width',cardWidth+'px');
   track.style.setProperty('--gallery-pad',Math.max(0,(view-visibleCount*cardWidth-(visibleCount-1)*gap)/2)+'px');
  };
  // On desktop/tablet, the two active cards must fit vertically when the
  // third navigation dot lands. Measure the real card, including text, rather
  // than using image width alone. Do not over-shrink a single phone card.
  if(visibleCount===2){
   const section=track.closest('.gameplay');
   const sectionCss=getComputedStyle(section);
   const rootCss=getComputedStyle(document.documentElement);
   const num=v=>parseFloat(v)||0;
   const header=document.querySelector('.site-header');
   const title=section.querySelector('.section-heading');
   const usable=innerHeight-(header?.offsetHeight||90)-num(rootCss.getPropertyValue('--dot-landing-gap'))
     -num(sectionCss.paddingTop)-title.getBoundingClientRect().height
     -num(getComputedStyle(track).marginTop)-Math.max(32,innerHeight*.045);
   for(let pass=0;pass<6;pass++){
    setCardWidth();
    const cardHeight=Math.max(...cards.map(c=>c.getBoundingClientRect().height));
    if(cardHeight<=usable+1 || cardWidth<=320)break;
    cardWidth=Math.max(320,cardWidth-Math.ceil((cardHeight-usable)*1.65));
   }
  }
  setCardWidth();
  step=cardWidth+gap;
  go(activeStart,true);
 }
 function nearest(){return clamp(Math.round(track.scrollLeft/step),0,cards.length-visibleCount)}
 function snap(){if(!step)return;go(nearest(),true)}
 // A dimmed card is a navigation control; the active image is a Rulebook link.
 cards.forEach((card,i)=>{
  card.addEventListener('click',()=>{
   if(card.classList.contains('is-current'))return;
   if(i<activeStart)go(activeStart-1);
   else if(i>=activeStart+visibleCount)go(activeStart+1);
  });
  card.addEventListener('keydown',e=>{
   if(card.classList.contains('is-current') || !['Enter',' '].includes(e.key))return;
   e.preventDefault();go(i<activeStart?activeStart-1:activeStart+1);
  });
 });

 // Pointer capture happens ONLY after a real drag begins. Normal taps on the
 // artwork still follow Rulebook links, and text can be held to drag.
 track.addEventListener('pointerdown',e=>{
  if(drag || e.button!==0)return;
  drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,startScroll:track.scrollLeft,moved:false};
 },{passive:true});
 track.addEventListener('pointermove',e=>{
  if(!drag || e.pointerId!==drag.id)return;
  drag.lastX=e.clientX;
  const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
  if(!drag.moved){
   if(Math.abs(dx)<8 || Math.abs(dx)<Math.abs(dy)*1.15)return;
   drag.moved=true;
   clearTimeout(timer);
   track.classList.add('dragging');
   try{track.setPointerCapture(e.pointerId)}catch(_){}
  }
  if(e.cancelable)e.preventDefault();
  track.scrollLeft=drag.startScroll-dx;
 });
 function endDrag(e){
  if(!drag || e.pointerId!==drag.id)return;
  const last=drag;
  drag=null;
  track.classList.remove('dragging');
  if(track.hasPointerCapture(last.id))track.releasePointerCapture(last.id);
  if(!last.moved)return;
  // Block the synthetic click after a swipe; a swipe must not open Rulebook.
  suppressDragClick=true;
  setTimeout(()=>{suppressDragClick=false},250);
  clearTimeout(timer);
  const dx=last.lastX-last.startX;
  let dest=nearest();
  if(dest===activeStart && Math.abs(dx)>Math.max(38,step*.10))dest+=dx<0?1:-1;
  go(dest);
 }
 track.addEventListener('pointerup',endDrag);
 track.addEventListener('pointercancel',endDrag);
 track.addEventListener('lostpointercapture',e=>{if(e.target===track && drag && e.pointerId===drag.id)endDrag(e)});
 // Capture phase makes the drag-click guard work even when the gesture began
 // on an active Rulebook anchor or on a card's text.
 track.addEventListener('click',e=>{
  if(!suppressDragClick)return;
  suppressDragClick=false;
  e.preventDefault();e.stopImmediatePropagation();
 },true);
 track.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight'].includes(e.key))return;
  e.preventDefault();go(activeStart+(e.key==='ArrowLeft'?-1:1));
 });
 track.addEventListener('scroll',()=>{
  if(drag?.moved)return;
  clearTimeout(timer);
  timer=setTimeout(snap,160);
 },{passive:true});
 track.addEventListener('scrollend',()=>{
  if(drag?.moved)return;
  clearTimeout(timer);
  sync(nearest());
 });
 track.addEventListener('dragstart',e=>e.preventDefault());
 let pending=false;
 addEventListener('resize',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;layout()})});
 document.fonts.ready.then(layout);
 layout();
})();

(()=>{const header=document.querySelector('.site-header');function updateHeader(){header.classList.toggle('is-scrolled',scrollY>2)}addEventListener('scroll',updateHeader,{passive:true});updateHeader()})();
