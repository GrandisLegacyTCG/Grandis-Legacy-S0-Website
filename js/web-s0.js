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

// Three identical sets let the native scroller wrap in either direction.
(()=>{
 const track=document.querySelector('.feature-grid'),section=document.querySelector('#gameplay'),header=document.querySelector('.site-header'),heading=section.querySelector('.section-heading');
 const originals=[...track.querySelectorAll('.feature')],count=originals.length;
 for(const side of ['before','after']){const fragment=document.createDocumentFragment();originals.forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute('aria-hidden','true');fragment.append(clone)});side==='before'?track.prepend(fragment):track.append(fragment)}
 const cards=[...track.querySelectorAll('.feature')];let step=0,cycle=0,start=0,ready=false,queued=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 function position(i){return cards[i].getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft-(track.clientWidth-(cards[i].offsetWidth*2+parseFloat(getComputedStyle(track).gap)))/2}
 function layout(){
  const oldIndex=ready&&step?Math.round((track.scrollLeft-start)/step):0;
  ready=false;const style=getComputedStyle(section),gap=parseFloat(getComputedStyle(track).marginTop);
  const space=innerHeight-header.offsetHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-heading.offsetHeight-gap-4;
  let width=Math.min((track.parentElement.clientWidth*.78-parseFloat(getComputedStyle(track).gap))/2,1100);
  for(let i=0;i<6;i++){track.style.setProperty('--feature-width',width+'px');const textHeight=Math.max(...originals.map(c=>c.querySelector('div').getBoundingClientRect().height));const next=Math.min(width,Math.max(120,(space-textHeight-2)*16/9));if(Math.abs(width-next)<1)break;width=next}
  track.style.setProperty('--feature-width',width+'px');
  step=cards[count+1].getBoundingClientRect().left-cards[count].getBoundingClientRect().left;cycle=step*count;start=position(count);
  track.scrollTo({left:start+((oldIndex%count+count)%count)*step,behavior:'instant'});ready=true;highlight();
 }
 function wrap(){if(!ready||!cycle)return;let delta=0;if(track.scrollLeft<start-step)delta=cycle;else if(track.scrollLeft>=start+cycle)delta=-cycle;if(delta){track.scrollTo({left:track.scrollLeft+delta,behavior:'instant'})}}
 let timer=null,hover=false,touching=false,visible=false;
 function highlight(){if(!ready||!step)return;const index=((Math.round((track.scrollLeft-start)/step)%count)+count)%count;cards.forEach((c,i)=>c.classList.toggle('is-current',i%count===index||i%count===(index+1)%count))}
 function schedule(){clearTimeout(timer);if(!ready||!visible||document.hidden||hover||touching||track.contains(document.activeElement)||reduced())return;timer=setTimeout(()=>{track.scrollTo({left:start+(Math.round((track.scrollLeft-start)/step)+1)*step,behavior:'smooth'});schedule()},5000)}
 track.addEventListener('scroll',()=>{wrap();highlight();schedule()},{passive:true});
 track.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;schedule()}});
 track.addEventListener('pointerleave',()=>{hover=false;schedule()});
 track.addEventListener('pointerdown',()=>{touching=true;schedule()},{passive:true});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])track.addEventListener(event,()=>{touching=false;schedule()},{passive:true});
 track.addEventListener('focusin',schedule);track.addEventListener('focusout',()=>requestAnimationFrame(schedule));
 track.addEventListener('wheel',schedule,{passive:true});document.addEventListener('visibilitychange',schedule);
 matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',schedule);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.5}).observe(track);

 let press=null;
 track.addEventListener('pointerdown',e=>{press={x:e.clientX,y:e.clientY,scroll:track.scrollLeft}},{passive:true});
 function activate(card){if(!ready||card.classList.contains('is-current'))return;const rect=card.getBoundingClientRect(),center=track.getBoundingClientRect().left+track.clientWidth/2;const direction=rect.left+rect.width/2<center?-1:1;track.scrollTo({left:start+(Math.round((track.scrollLeft-start)/step)+direction)*step,behavior:reduced()?'instant':'smooth'});schedule()}
 cards.forEach((card,i)=>{card.setAttribute('role','button');card.tabIndex=i>=count&&i<count*2?0:-1;card.setAttribute('aria-label','Show '+card.querySelector('h3').textContent);card.addEventListener('click',e=>{if(press&&(Math.abs(e.clientX-press.x)>8||Math.abs(e.clientY-press.y)>8||Math.abs(track.scrollLeft-press.scroll)>8)){press=null;return}press=null;activate(card)});card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(card)}})});
 track.addEventListener('dragstart',e=>e.preventDefault());
 track.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();track.scrollTo({left:start+(Math.round((track.scrollLeft-start)/step)+(e.key==='ArrowRight'?1:-1))*step,behavior:reduced()?'instant':'smooth'})});
 function resize(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;layout()})}
 addEventListener('resize',resize);document.fonts.ready.then(resize);layout();
})();

(()=>{const header=document.querySelector('.site-header');function updateHeader(){header.classList.toggle('is-scrolled',scrollY>2)}addEventListener('scroll',updateHeader,{passive:true});updateHeader()})();
