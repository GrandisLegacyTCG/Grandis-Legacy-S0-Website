(()=>{
'use strict';
const authority=()=>window.GL_AUTHORITY_ADAPTER?.getActive?.()||null;
const E=()=>authority()?.engine?.()||null;
const B=()=>authority()?.bridge?.()||null;
const BF=document.querySelector('.battlefield');
const sidebar=document.querySelector('.sidebar');
const primary=document.getElementById('phasePrimaryAction');
const nextBtn=document.querySelector('.phase-action.next');
const playerHandTrack=document.querySelector('.hand.bottom .hand-track');
const oppHandTrack=document.querySelector('.hand.top .hand-track');
const playerManaHost=document.getElementById('manaCards');
const playerManaCount=document.getElementById('manaCount');
const aiManaHost=document.getElementById('opponentManaCards');
const aiManaCount=document.getElementById('opponentManaCount');
const sharedBox=document.getElementById('sharedPreviewBox');
const preview=document.getElementById('hoverPreviewCard');
const playedGrid=document.querySelector('.played');
const historyGrid=document.querySelector('.history-grid');
const activeStage=document.querySelector('.active-card-stage');
const turnBox=document.querySelector('.sidebar > .sidebox:first-child');
const battleLogPanel=document.getElementById('battleLogPanel');
const appRoot=document.querySelector('.app');
const soundBtn=document.getElementById('glSoundButton');
const soundControl=document.getElementById('glSoundControl');
const soundPanel=document.getElementById('glSoundPanel');
const musicSwitch=document.getElementById('glMusicSwitch');
const musicVolumeSlider=document.getElementById('glMusicVolume');
const musicVolumeValue=document.getElementById('glMusicVolumeValue');
const sfxSwitch=document.getElementById('glSfxSwitch');
const matchActionBtn=document.getElementById('matchActionButton');
const payBtn=document.createElement('button');payBtn.className='gl-pay-button';payBtn.type='button';payBtn.textContent='PAY';BF.appendChild(payBtn);
const focusDimmer=document.createElement('div');focusDimmer.className='gl-focus-dimmer';focusDimmer.setAttribute('aria-hidden','true');appRoot.appendChild(focusDimmer);
const responseRouteGuide=document.createElement('div');responseRouteGuide.className='gl-response-route-guide';responseRouteGuide.setAttribute('aria-live','polite');responseRouteGuide.setAttribute('aria-hidden','true');BF.appendChild(responseRouteGuide);
const centerFocusBackdrop=document.createElement('div');centerFocusBackdrop.className='gl-center-focus-backdrop';centerFocusBackdrop.setAttribute('aria-hidden','true');document.body.appendChild(centerFocusBackdrop);
const centerChoiceStage=document.createElement('div');centerChoiceStage.className='gl-center-choice-stage';centerChoiceStage.setAttribute('aria-hidden','true');centerChoiceStage.innerHTML='<div class="gl-center-choice-copy"><h2 class="gl-center-choice-title"></h2><p class="gl-center-choice-helper"></p><strong class="gl-center-choice-status"></strong></div><div class="gl-center-choice-cards"></div><div class="gl-center-choice-actions"></div>';document.body.appendChild(centerChoiceStage);
const battlefieldHoverPreview=document.createElement('div');battlefieldHoverPreview.className='gl-battlefield-hover-preview';battlefieldHoverPreview.setAttribute('aria-hidden','true');const battlefieldHoverImg=document.createElement('img');battlefieldHoverPreview.appendChild(battlefieldHoverImg);document.body.appendChild(battlefieldHoverPreview);
const matchTimer=document.getElementById('matchTimer');
const swapLayer=document.createElement('div');swapLayer.className='gl-swap-layer';BF.appendChild(swapLayer);
const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='glVsaiAttackDirectionLayer';svg.classList.add('gl-pending-attack-direction-layer','gl-vsai-attack-direction-layer');svg.setAttribute('aria-hidden','true');
{
  const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
  const marker=document.createElementNS('http://www.w3.org/2000/svg','marker');marker.id='glVsaiAttackArrow';marker.setAttribute('markerWidth','13');marker.setAttribute('markerHeight','13');marker.setAttribute('viewBox','0 0 12 12');marker.setAttribute('refX','10.5');marker.setAttribute('refY','6');marker.setAttribute('orient','auto');marker.setAttribute('markerUnits','userSpaceOnUse');
  const arrow=document.createElementNS('http://www.w3.org/2000/svg','path');arrow.setAttribute('d','M 1 1 L 11 6 L 1 11 Z');arrow.setAttribute('class','gl-target-arrow');
  marker.appendChild(arrow);defs.appendChild(marker);svg.appendChild(defs);
}
document.body.appendChild(svg);
const feedback=document.createElement('div');feedback.className='gl-feedback';BF.appendChild(feedback);
const choiceOverlay=document.createElement('div');choiceOverlay.className='overlay choice-overlay gl-vsai-choice-overlay';choiceOverlay.innerHTML='<section class="choice-panel"><header class="choice-head"><h2 class="gl-choice-title">Choice</h2></header><div class="choice-body gl-choice-body"></div><footer class="choice-foot"><button type="button" class="gl-choice-cancel" hidden>CANCEL</button><button type="button" class="gl-choice-confirm">CONFIRM</button></footer></section>';document.body.appendChild(choiceOverlay);
// RC41 F15: only card pickups into Hand get a transparent Hand window; the
// three shield strips keep unrelated battlefield buttons non-interactive.
const choiceHandWindow=document.createElement('div');choiceHandWindow.className='gl-choice-hand-window';choiceHandWindow.setAttribute('aria-hidden','true');choiceOverlay.prepend(choiceHandWindow);
for(const edge of ['top','left','right']){const shield=document.createElement('div');shield.className='gl-choice-hand-shield gl-choice-hand-shield-'+edge;shield.setAttribute('aria-hidden','true');choiceOverlay.insertBefore(shield,choiceOverlay.querySelector('.choice-panel'));}
const playedDetailOverlay=document.createElement('div');playedDetailOverlay.className='gl-played-detail-overlay';playedDetailOverlay.innerHTML='<section class="gl-played-detail-panel" role="dialog" aria-modal="true" aria-labelledby="glPlayedDetailTitle"><header class="gl-played-detail-head"><h2 id="glPlayedDetailTitle">Card Played</h2><button type="button" class="gl-played-detail-close" aria-label="Close Card Played detail">CLOSE</button></header><div class="gl-played-detail-body"></div></section>';document.body.appendChild(playedDetailOverlay);
const cardReviewOverlay=document.createElement('div');cardReviewOverlay.className='gl-card-review-overlay';cardReviewOverlay.innerHTML='<section class="gl-card-review-panel" role="dialog" aria-modal="true" aria-label="Card Review"><div class="gl-card-review-body"></div></section>';document.body.appendChild(cardReviewOverlay);
const expInspectorOverlay=document.createElement('div');expInspectorOverlay.className='gl-exp-inspector-overlay';expInspectorOverlay.innerHTML='<section class="gl-exp-inspector-panel" id="glExpInspectorDialog" role="dialog" aria-modal="true" aria-labelledby="glExpInspectorTitle"><header class="gl-exp-inspector-head"><div><span class="gl-exp-inspector-eyebrow">HERO EXP CARDS</span><h2 id="glExpInspectorTitle">EXP Cards</h2></div><button type="button" class="gl-exp-inspector-close">CLOSE</button></header><div class="gl-exp-inspector-summary"></div><div class="gl-exp-inspector-list"></div><p class="gl-exp-inspector-foot">Hover to enlarge (as in Legacy Deck); click for full Card Review. Ultimate EXP cannot return to Hand.</p></section>';document.body.appendChild(expInspectorOverlay);
const animationLayer=document.createElement('div');animationLayer.className='gl-animation-layer';animationLayer.setAttribute('aria-hidden','true');document.body.appendChild(animationLayer);
const modalHoverPreview=document.createElement('div');modalHoverPreview.className='gl-modal-hover-preview';modalHoverPreview.setAttribute('aria-hidden','true');const modalHoverImg=document.createElement('img');modalHoverPreview.appendChild(modalHoverImg);document.body.appendChild(modalHoverPreview);
const sidebarHoverPreview=document.createElement('div');sidebarHoverPreview.className='gl-sidebar-hover-preview';sidebarHoverPreview.setAttribute('aria-hidden','true');const sidebarHoverImg=document.createElement('img');sidebarHoverPreview.appendChild(sidebarHoverImg);document.body.appendChild(sidebarHoverPreview);
const turnBanner=document.createElement('div');turnBanner.className='gl-turn-banner';turnBanner.setAttribute('aria-live','polite');document.body.appendChild(turnBanner);
const counterBanner=document.createElement('div');counterBanner.className='gl-counter-banner';counterBanner.setAttribute('aria-live','polite');counterBanner.setAttribute('aria-atomic','true');document.body.appendChild(counterBanner);
// Response Counter chains get a separate, persistent horizontal live notification.
// This is NOT Card Played / Full Card History; it is battlefield feedback only.
const counterChainBanner=document.createElement('div');counterChainBanner.className='gl-counter-chain-banner';counterChainBanner.setAttribute('role','status');counterChainBanner.setAttribute('aria-live','polite');counterChainBanner.setAttribute('aria-atomic','true');document.body.appendChild(counterChainBanner);
const shownCompletedCounterChains=new Set();let currentCounterChainId='',counterChainRenderedSig='',counterChainHoldTimer=null;
const seenCounterMessages=new Set(),seenRacialMessages=new Set(),seenManaLossMessages=new Set(),seenDiscardMessages=new Set(),presentationNoticeQueue=[];let counterBannerTimer=null,presentationNoticeActive=false;
const lobbyOverlay=document.createElement('div');lobbyOverlay.className='gl-lobby-overlay';lobbyOverlay.innerHTML='<section class="gl-lobby-panel" role="dialog" aria-modal="true" aria-labelledby="glLobbyTitle"><header class="gl-lobby-head gl-site-app-header"><a class="gl-lobby-home gl-site-brand" href="/" aria-label="Grandis Legacy Home"><img class="gl-lobby-logo gl-site-brand-img" src="/assets/site/web-s0/logo-transparent.webp" alt="Grandis Legacy"></a><h1 id="glLobbyTitle">VS AI LOBBY</h1></header><div class="gl-lobby-error" id="glLobbyError"></div><div class="gl-lobby-decks" id="glLobbyDecks"></div><footer class="gl-lobby-foot"><div class="gl-lobby-difficulties" role="group" aria-label="Opponent level"><button type="button" class="gl-lobby-difficulty" data-gl-ai-diff="beginner">Beginner</button><button type="button" class="gl-lobby-difficulty" data-gl-ai-diff="intermediate">Intermediate</button></div><button type="button" class="gl-lobby-start" id="glLobbyStart">Start Match</button></footer></section>';document.body.appendChild(lobbyOverlay);
const coinOverlay=document.createElement('div');coinOverlay.className='gl-coin-overlay';coinOverlay.innerHTML='<section class="gl-coin-card" role="dialog" aria-modal="true" aria-label="Coin flip"><div class="gl-coin-body"></div></section>';document.body.appendChild(coinOverlay);
const progressionOverlay=document.createElement('div');progressionOverlay.className='gl-progression-overlay';progressionOverlay.innerHTML='<section class="gl-progression-card" role="dialog" aria-modal="true" aria-labelledby="glProgressionTitle"><header><div><span>HERO PROGRESSION</span><h2 id="glProgressionTitle">Hero Progression</h2></div><button type="button" class="gl-progression-close">Close</button></header><div class="gl-progression-row"></div><p>Select a Rank card to open Card Review.</p></section>';document.body.appendChild(progressionOverlay);
const resultOverlay=document.createElement('div');resultOverlay.className='gl-result-overlay';resultOverlay.innerHTML='<section class="gl-result-card" role="dialog" aria-modal="true" aria-labelledby="glResultTitle"><header><span>GAME RESULT</span><h2 id="glResultTitle">Match Complete</h2></header><div class="gl-result-body"></div></section>';document.body.appendChild(resultOverlay);
let lastSignature='',manaRenderKey='',lastChainKey='',lastFeedbackKey='',resolvedHistory=[],historyKnown=new Set(),playerHandShift=0,opponentHandShift=0;
let activeModalType='',heldCombatCards=[],handRenderKey='',opponentHandRenderKey='',modalRenderKey='',swapRenderKey='';
let uiResponseSourceChoice=null,responseRollbackSnapshot=null;
let activeCardHold=null,activeCardPhaseStamp='';
let inspectState=null,lobbyIsOpen=true,lobbyErrorText='';
let openingFirstSide='PLAYER',openingChoice='HEADS',openingOutcome='HEADS',openingCoinWinner=null,openingChosenOrder=null,openingPresentationActive=false,openingAiDecisionTimer=null;
let glOpeningHiddenShardUids=new Set(),resultShown=false;
let transientConnectorKey='',transientConnectorUntil=0,transientDefenseConnector=null;
let presentationPrimed=false,previousVisualState=null,lastTurnBannerKey='';
// Rank Up visuals stay on the old Hero until the mandatory EXP choice is committed.
let glDeferredTrialRankTransitions=[];
// A manual Rank Up keeps each returned Hand slot hidden until its own flight
// arrives. Keys include the side and final 0-based Hand index.
const glTrialHandFlightKeys=new Set();
// EXP returns are immutable presentation events. Manual popup flights own their
// event IDs for the entire match, even after their temporary Hand locks clear.
// Automatic Rank Up flights likewise claim an event at most once.
const glManualTrialReturnEventIds=new Set();
const glPresentedTrialReturnEventIds=new Set();
// Every Rank Up EXP return uses one atomic visual transaction. Epoch prevents
// callbacks from a previous match revealing slots in a new match.
let glPresentationEpoch=0;
const glTrialReturnBatches=new Set();
let lastPhaseIndicatorKey='',lastInteractionFocusMode='',matchStartedAt=0,matchStoppedElapsed=0;
let responsePassWindowKey='',responsePassWindowStartedAt=0;
let centerChoiceKey='',centerChoiceRenderSig='',centerChoiceBusy=false,centerChoiceMagicRevealed=false;
let glPresentationActive=0,glPresentationBusyUntil=0,glRankPresentationRunning=0;
let glAttachmentLastPress={key:'',at:0};
const seenPresentationEvents=new Set();
// External draw presentation state. This mirrors the current VS AI model:
// reserved Draw Phase cards occupy an invisible destination slot until arrival,
// while already-committed multi-draw cards remain hidden in their own slots
// until each animation finishes. Stage 1.4 Hand fan/hover behavior is untouched.
const glPendingDrawReservations={PLAYER:[],AI:[]};
const glHiddenCommittedDrawSlots={PLAYER:new Map(),AI:new Map()};
let glExternalDrawSequence=Promise.resolve();
let glExternalManaDrawSequence=Promise.resolve();
const glExternallyPresentedShardUids=new Set();
const laneOrder=['LEFT','CENTER','RIGHT'];
function st(){const snap=E()?.getSnapshot?.();return snap?.appState||snap?.state||snap||null;}
function cv(id){return id?E().cardView(id):null;}
function art(id){return id?'card-art/'+encodeURIComponent(id)+'.webp':'';}
// All face-up cards use the shared thumbnail-first loader. Only the already
// authorized, visible draw identity is warmed; opponent hands remain face-down.
const cardArtwork=window.GL_CARD_ART;
function warmCardArtwork(id){return cardArtwork.warm(id);}
function setCardArtwork(img,src){cardArtwork.set(img,src);}

function shardArt(sh){const faces={Generic:'S0-MAN-001',Warrior:'S0-MAN-002',Mage:'S0-MAN-003',Cleric:'S0-MAN-004',Thief:'S0-MAN-005',Archer:'S0-MAN-006'};const name=sh&&sh.kind==='CLASS'?String(sh.class_name||'').trim():'Generic';return 'card-art/'+(faces[name]||faces.Generic)+'.webp';}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function cloneLite(v){try{return JSON.parse(JSON.stringify(v))}catch{return null}}
function intent(name,args=[]){const r=E().intent(name,args);setTimeout(renderNow,0);return r;}
function flash(msg){feedback.textContent=msg;feedback.classList.add('show');clearTimeout(flash.t);flash.t=setTimeout(()=>feedback.classList.remove('show'),700);}
function sideHeroes(s,side){return side==='AI'?s.aiHeroes:s.playerHeroes;}
function sideHand(s,side){return side==='AI'?s.aiHand:s.playerHand;}
function sideDiscard(s,side){return side==='AI'?s.aiDiscard:s.playerDiscard;}
function uiLaneElement(side,lane){
  const lanes=[...document.querySelectorAll((side==='AI'?'.opponent-field':'.player-field')+' .hero-grid .hero-lane')];
  // Gameplay lane binding follows the proven VS AI runtime exactly on both sides:
  // visual slot 0/1/2 = logical LEFT/CENTER/RIGHT. the previous mirrored lane labels
  // are intentionally hidden, so the runtime remains the sole targeting authority.
  const map={LEFT:0,CENTER:1,RIGHT:2};
  return lanes[map[lane]]||null;
}
function heroCardEl(side,lane){return uiLaneElement(side,lane)?.querySelector('.hero-card')||null;}
function heroImageId(h){return h?.legacy_mode?(h.active_legacy_card_id||h.card_id):h?.card_id;}
let glRawCardIndex=null;
function rawCardDef(id){
  if(!id)return null;
  if(!glRawCardIndex){glRawCardIndex=new Map();const defs=window.GL_CARD_DEFINITIONS||{},cards=Array.isArray(defs.cards)?defs.cards:[];cards.forEach(c=>{if(c?.card_id)glRawCardIndex.set(String(c.card_id),c)})}
  return glRawCardIndex.get(String(id))||null;
}
function heroClassAbilityName(h){const c=rawCardDef(h?.card_id||heroImageId(h));return String(c?.class_ability?.name||'').trim();}
function heroRacialAbilityName(h){const c=rawCardDef(h?.card_id||heroImageId(h));return String(c?.racial_ability?.name||'').trim();}
function heroHasDrawReplacementCounter(h){const id=String(h?.card_id||heroImageId(h)||'');return !h?.legacy_mode&&['S0-ARC-H008','S0-ARC-H009'].includes(id);}
// Stage 1.5.10: availability glow is deliberately limited to the five approved contextual Heroes.
// It is never inferred merely because a Hero owns an active Class Ability or Racial Trait.
const GL_CONTEXT_GLOW_IDS={
  ALDEN:new Set(['S0-ARC-H007','S0-ARC-H008','S0-ARC-H009']),
  LUCIEN:new Set(['S0-THF-H007','S0-THF-H008','S0-THF-H009']),
  AUREX:new Set(['S0-WAR-H007','S0-WAR-H008','S0-WAR-H009']),
  FINNIAN:new Set(['S0-THF-H001','S0-THF-H002','S0-THF-H003']),
  THRAIN:new Set(['S0-CLE-H004','S0-CLE-H005','S0-CLE-H006'])
};
function heroContextGlowKey(h){const id=String(h?.card_id||heroImageId(h)||'');for(const [key,set] of Object.entries(GL_CONTEXT_GLOW_IDS))if(set.has(id))return key;return '';}
function castingForAttachment(s,h,id,side,lane,slot){return (s?.pendingCastings||[]).find(x=>x&&x.card_id===id&&x.side===side&&Number(x.attachmentSlot)===Number(slot)&&((x.original_source_lane||x.source_lane)===lane||x.source_hero_card_id===h?.card_id||x.source_instance_id===h?.instance_id))||null;}
// RC20: visual-only Casting palette. Keep the same hue while a Casting remains
// pending; no damage, timer, target, or status mechanics are modified.
const glCastingVisualPalette=['violet','teal','amber'];
const glCastingVisualIds=new Map();
function castingVisualKey(c,occurrence){
  return [c.side||'',c.source_instance_id||c.source_hero_card_id||c.original_source_lane||c.source_lane||'',
    c.card_id||'',c.attachmentSlot??'',c.target_side||'',c.locked_target_lane||c.target_lane||'',occurrence||0].join('|');
}
function activeCastingColors(s){
  const entries=(s?.pendingCastings||[]).filter(Boolean),seen=new Map(),activeKeys=new Set(),used=new Set();
  const ordered=entries.map(c=>{
    const base=castingVisualKey(c,0),n=seen.get(base)||0;seen.set(base,n+1);
    const key=castingVisualKey(c,n);activeKeys.add(key);return {c,key};
  });
  for(const key of glCastingVisualIds.keys())if(!activeKeys.has(key))glCastingVisualIds.delete(key);
  for(const color of glCastingVisualIds.values())used.add(color);
  ordered.forEach(({key})=>{if(glCastingVisualIds.has(key))return;
    const free=glCastingVisualPalette.find(color=>!used.has(color));
    const color=free||glCastingVisualPalette[glCastingVisualIds.size%glCastingVisualPalette.length];
    glCastingVisualIds.set(key,color);used.add(color);
  });
  return ordered.map(({c,key})=>({casting:c,color:glCastingVisualIds.get(key)}));
}
function castingTargetColors(s,side,lane){
  const colors=activeCastingColors(s).filter(x=>x.casting.target_side===side&&String(x.casting.locked_target_lane||x.casting.target_lane||'')===String(lane)).map(x=>x.color);
  return [...new Set(colors)];
}
function castingAttachmentColor(s,casting){
  if(!casting)return '';
  const pair=activeCastingColors(s).find(x=>x.casting===casting);return pair?.color||'violet';
}
function castingTargetsPosition(s,side,lane){return castingTargetColors(s,side,lane).length>0;}
// Persistent self-hosted effects are visually different from Casting: Casting
// highlights its LOCKED OPPOSING POSITION, while a self effect highlights its
// owning Hero's current lane. Only verified self-targeting effects belong here;
// teamwide and ally-targeted Attachments must not be shown as self-only.
const GL_SELF_HOST_FOCUS_CARD_IDS=new Set(['S0-WAR-005']); // Taunt
function activeSelfHostAttachment(s,h,side,lane){
  if(!h||h.legacy_mode||Number(h.hp||0)<=0)return null;
  const slots=Array.isArray(h.attachments)?h.attachments:[];
  // Use the same active Attachment record as the engine, but match physical
  // placement by card identity rather than assuming a stale slot index is
  // authoritative. Do not light expired/orphaned physical cards.
  return(s?.activeAttachments||[]).find(a=>{
    if(!a||a.side!==side||a.lane!==lane||!GL_SELF_HOST_FOCUS_CARD_IDS.has(a.card_id))return false;
    if(a.remaining_count!=null&&Number(a.remaining_count)<=0)return false;
    return slots.some(entry=>(typeof entry==='string'?entry:entry?.card_id)===a.card_id);
  })||null;
}

function currentLaneForSourceCard(s,side,sourceCardId,fallbackLane){
  if(!sourceCardId||!side)return fallbackLane||null;
  const heroes=sideHeroes(s,side)||{};
  for(const lane of laneOrder){
    const h=heroes[lane];
    if(!h)continue;
    if(h.card_id===sourceCardId||h.active_legacy_card_id===sourceCardId||heroImageId(h)===sourceCardId)return lane;
  }
  return fallbackLane||null;
}
function resolveActionSourceLane(s,a){
  if(!a)return a;
  const lane=currentLaneForSourceCard(s,a.side,a.source_card_id,a.lane);
  return lane===a.lane?a:{...a,lane};
}
function statusIcon(name){return 'engine/assets/status-icons/Icon-'+String(name||'').replace(/[^A-Za-z]/g,'')+'.png';}
function purifyStatusArt(name){
  const valid=['Bleed','Burn','Freeze','Poison','Stun'];
  if(valid.includes(name))return statusIcon(name);
  const glyph=name==='Sleep'?'Zz':String(name||'?').slice(0,2).toUpperCase();
  const xml='<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect x="6" y="6" width="148" height="148" rx="30" fill="#193244" stroke="#eac874" stroke-width="5"/><text x="80" y="100" fill="#ffe1a5" font-size="58" font-family="sans-serif" text-anchor="middle" font-weight="bold">'+glyph+'</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml);
}
function getStatusName(x){try{return E().getStatusLabel(x)||x?.name||x?.status||''}catch{return x?.name||x?.status||''}}
function isPrecommitCancelable(s){const p=s?.pending;if(!p||s?.responseWindow)return false;return ['warp_scroll_selection','source_selection','target_selection','scouting_target_selection','exact_two_target_selection','double_casting_target_selection','mana_spend_choice','mana_shard_payment_choice','optional_magical_surge','status_removal_choice','tribute_target','racial_target_selection','hero_ability_target_selection','legacy_cost_selection','legacy_hero_target_selection','manual_reposition'].includes(p.type);}
function pendingOwner(p){return p&&(p.decision_side||p.response_owner||p.side||p.source_side||(p.type==='hand_limit_discard'?'PLAYER':null));}
function isDirectHandCardSearch(p){return !!(p&&p.type==='card_search_choice'&&p.zone==='hand'&&['source_exp','discard_then_draw_three'].includes(p.resolve_to));}
function selectedChoiceIndex(p){if(p?.selected_index==null)return null;const n=Number(p.selected_index);return Number.isInteger(n)&&n>=0?n:null;}
function discardSelectionState(p,handIndex){
  if(!p)return{selected:false,index:-1};
  if(p.type==='hand_limit_discard')return{selected:(p.selected||[]).map(Number).includes(Number(handIndex)),index:Number(handIndex)};
  if(p.type==='response_payment_choice'){
    const ci=(p.candidates||[]).findIndex(x=>Number(x.hand_index)===Number(handIndex));
    return{selected:ci>=0&&(p.selected_indices||[]).map(Number).includes(ci),index:ci};
  }
  if(p.type==='legacy_cost_selection'){
    const ci=(p.cost_candidates||[]).findIndex(x=>Number(x.hand_index??x.index)===Number(handIndex));
    return{selected:ci>=0&&(p.selected_cost_indices||[]).map(Number).includes(ci),index:ci};
  }
  return{selected:false,index:-1};
}
function directTributeHeroReady(p,side,lane){return !!(isDirectHandCardSearch(p)&&p.resolve_to==='source_exp'&&selectedChoiceIndex(p)!=null&&side===(p.source_side||p.host_side||p.side||'PLAYER')&&lane===(p.source_lane||p.host_lane));}
function phaseName(p){return String(p||'').replace(/\s*Phase$/i,'');}
function fitPlayedCards(){const grid=playedGrid;if(!grid)return;const cs=getComputedStyle(grid),gap=parseFloat(cs.columnGap)||0,cell=Math.max(0,(grid.clientWidth-gap*2)/3),w=Math.floor(Math.min(72,cell)),h=Math.floor(w*7/5);grid.querySelectorAll(':scope > .played-card').forEach(x=>{x.style.width=w+'px';x.style.height=h+'px'});}
function backgroundPreviewSuppressed(anchor){return document.body.classList.contains('gl-center-choice-active')&&!anchor?.closest?.('.gl-center-choice-stage')}
function bindPreview(img){
  if(!img||img.dataset.glPreviewBound==='1')return;
  img.dataset.glPreviewBound='1';
  img.addEventListener('mouseenter',()=>{if(backgroundPreviewSuppressed(img))return;setCardArtwork(preview,cardArtwork.original(img));sharedBox.classList.add('previewing')});
  img.addEventListener('mouseleave',()=>{sharedBox.classList.remove('previewing');preview.removeAttribute('src')});
}
/* Hover cards are temporary read-only previews: only the currently hovered
   card may be visible, and its portal must sit above all battlefield, sidebar,
   Active Card, status, and inspection layers. No gameplay state is changed. */
function promoteTemporaryCardPreview(active){
  [battlefieldHoverPreview,sidebarHoverPreview,modalHoverPreview].forEach(layer=>{
    if(layer===active)return;
    layer.classList.remove('open','is-hero','is-context-hero');
    layer.setAttribute('aria-hidden','true');
    if(layer===battlefieldHoverPreview)battlefieldHoverSource=null;
    if(layer===sidebarHoverPreview)sidebarHoverSource=null;
    if(layer===modalHoverPreview)modalHoverSource=null;
  });
  if(active&&active.parentElement===document.body)document.body.appendChild(active);
}
let battlefieldHoverSource=null,sidebarHoverSource=null,modalHoverSource=null;
function hideBattlefieldHoverPreview(){battlefieldHoverSource=null;battlefieldHoverPreview.classList.remove('open','is-hero');battlefieldHoverPreview.style.removeProperty('width');battlefieldHoverPreview.style.removeProperty('height');battlefieldHoverPreview.setAttribute('aria-hidden','true');battlefieldHoverImg.removeAttribute('src')}
function hasUnifiedMobilePreviewStage(){
  const c=document.documentElement.classList;
  return c.contains('gl-mobile-gameplay-stage')&&!c.contains('gl-mobile-landscape-stage');
}
// A single touch gesture is shared by Battlefield, Hand, Mana, and card choices.
// Desktop mouse hover and double-click behavior is deliberately untouched.
function registerMobileCardHold(el,show){window.GL_MOBILE_PREVIEW_HOLD?.bind(el,show)}
function isRotatedMobileGameplay(){
  return hasUnifiedMobilePreviewStage()&&document.documentElement.classList.contains('gl-stage-portrait');
}
function normalizeRotatedMobilePreview(layer){
  if(!hasUnifiedMobilePreviewStage()||!layer)return false;
  for(const prop of ['width','height','left','top','right','bottom'])layer.style.removeProperty(prop);
  return true;
}
// Popup cards do not share the battlefield's bottom-right dock. Their preview
// lives in the rotated 1600x747 portal but follows the LEFT/RIGHT outside edge
// of the active popup, just as on desktop. Convert physical screen bounds back
// into logical canvas pixels before positioning the preview image.
function mobilePopupLogicalRect(el){
  const r=uiRect(el);if(!r)return null;
  const app=document.querySelector('.app'),tr=app&&getComputedStyle(app).transform;
  if(!tr||tr==='none'||typeof DOMMatrixReadOnly==='undefined')return r;
  try{
    const inv=new DOMMatrixReadOnly(tr).inverse();
    const pts=[[r.left,r.top],[r.right,r.top],[r.left,r.bottom],[r.right,r.bottom]]
      .map(([x,y])=>new DOMPoint(x,y).matrixTransform(inv));
    const xs=pts.map(q=>q.x),ys=pts.map(q=>q.y);
    const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
    return {left,right,top,bottom,width:right-left,height:bottom-top};
  }catch(_){return r;}
}
// Unified Mobile Batch 2: 120% inspection previews for action prompts; card
// selection from a Deck/Discard keeps the prior compact footprint.
function mobilePreviewIsCollectionChoice(anchor){
  const center=anchor.closest?.('.gl-center-choice-stage');
  if(center){
    // Return EXP / Scouting EXP are direct action selections even though the
    // existing renderer shares the generic 'discard' stage implementation.
    if(center.dataset.glActionPopup==='1')return false;
    return /(?:^|\s)gl-center-mode-(?:discard|legacy)(?:\s|$)/.test(center.className);
  }
  // The generic choice overlay hosts both collection searches and several
  // direct action choices (e.g. Return EXP). Distinguish by pending choice type,
  // not by reusing the overlay's generic CSS class for every action.
  if(anchor.closest?.('.gl-vsai-choice-overlay')){
    return !['trial_rankup_return_exp','scouting_exp_selection',
      'optional_swap','optional_target_swap'].includes(activeModalType);
  }
  return !!anchor.closest?.('.gl-progression-card');
}
function mobilePreviewMetrics(large){
  const rootStyle=getComputedStyle(document.documentElement);
  const w=Number.parseFloat(rootStyle.getPropertyValue('--gl-stage-logical-w'))||1600;
  const h=Number.parseFloat(rootStyle.getPropertyValue('--gl-stage-logical-h'))||747;
  const width=Math.max(90,Math.min(large?298:248,((h-24)*5/7),(w-24)));
  return {logicalW:w,logicalH:h,width,height:width*7/5,gap:12};
}
function mobilePreviewGroupBounds(anchor){
  const list=anchor.closest?.('.gl-center-choice-cards') ||
    (!mobilePreviewIsCollectionChoice(anchor) ? anchor.closest?.('.choice-grid') : null);
  if(!list)return mobilePopupLogicalRect(anchor.closest?.('.choice-panel,.gl-exp-inspector-panel,.gl-progression-card')||anchor);
  const boxes=[...list.querySelectorAll('.gl-center-choice-card,.card-search-choice,.discard-choice,.gl-inspect-card')].map(mobilePopupLogicalRect)
    .filter(q=>q&&q.width>0&&q.height>0);
  if(!boxes.length)return mobilePopupLogicalRect(list);
  const left=Math.min(...boxes.map(q=>q.left)),right=Math.max(...boxes.map(q=>q.right));
  const top=Math.min(...boxes.map(q=>q.top)),bottom=Math.max(...boxes.map(q=>q.bottom));
  return {left,right,top,bottom,width:right-left,height:bottom-top};
}
function mobilePreviewOverlap(a,b){
  if(!a||!b)return 0;
  return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*
    Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
}
function mobilePreviewPlacement(x,y,met){
  const px=Math.min(met.logicalW-met.width-met.gap,Math.max(met.gap,x));
  const py=Math.min(met.logicalH-met.height-met.gap,Math.max(met.gap,y));
  return {x:px,y:py,left:px,top:py,right:px+met.width,bottom:py+met.height};
}
function placeMobilePopupPreview(anchor){
  if(!hasUnifiedMobilePreviewStage()||!anchor)return false;
  normalizeRotatedMobilePreview(modalHoverPreview);
  const compact=mobilePreviewIsCollectionChoice(anchor);
  const met=mobilePreviewMetrics(!compact);
  const ar=mobilePopupLogicalRect(anchor),group=mobilePreviewGroupBounds(anchor);
  if(!ar||!group)return false;
  const y=ar.top+(ar.height-met.height)/2,g=met.gap;
  const candidates=[
    mobilePreviewPlacement(group.right+g,y,met),
    mobilePreviewPlacement(group.left-met.width-g,y,met),
    mobilePreviewPlacement(ar.left+(ar.width-met.width)/2,group.top-met.height-g,met),
    mobilePreviewPlacement(ar.left+(ar.width-met.width)/2,group.bottom+g,met)
  ];
  // Never choose a side purely from the full-width invisible selection frame.
  // Score against actual visible cards and footer actions to keep the enlarged
  // image outside the choice whenever its available space permits it.
  const choiceGroup=anchor.closest?.('.gl-center-choice-cards,.choice-grid');
  const choices=[...choiceGroup?.querySelectorAll('.gl-center-choice-card,.card-search-choice,.discard-choice,.gl-inspect-card')||[]]
    .map(mobilePopupLogicalRect).filter(Boolean);
  const actions=mobilePopupLogicalRect(anchor.closest?.('.gl-center-choice-stage')?.querySelector('.gl-center-choice-actions'));
  const best=candidates.map((p,i)=>{
    const overlap=choices.reduce((sum,c)=>sum+mobilePreviewOverlap(p,c),0);
    const actionOverlap=actions?mobilePreviewOverlap(p,actions):0;
    const dist=Math.hypot((p.x+met.width/2)-(ar.left+ar.width/2),(p.y+met.height/2)-(ar.top+ar.height/2));
    return {p,score:overlap*8+actionOverlap*8+dist*.06+i*.01};
  }).sort((a,b)=>a.score-b.score)[0].p;
  modalHoverPreview.classList.toggle('gl-mobile-preview-large',!compact);
  modalHoverPreview.style.setProperty('--gl-popup-preview-width',Math.round(met.width)+'px');
  modalHoverPreview.style.setProperty('--gl-popup-preview-height',Math.round(met.height)+'px');
  modalHoverPreview.style.setProperty('--gl-popup-preview-x',Math.round(best.x)+'px');
  modalHoverPreview.style.setProperty('--gl-popup-preview-y',Math.round(best.y)+'px');
  return true;
}
// Desktop uses the existing hand/hero/mana geometry. On mobile the same
// three source categories are docked independently in logical stage space.
function placeMobileBattlefieldPreview(kind,anchor,layer){
  if(!hasUnifiedMobilePreviewStage()||!anchor)return false;
  normalizeRotatedMobilePreview(layer);
  const met=mobilePreviewMetrics(true),ar=mobilePopupLogicalRect(anchor);
  if(!ar)return false;
  const dock=mobilePreviewPlacement(met.logicalW-met.width-met.gap,
    (met.logicalH-met.height)/2,met);
  const hero=kind==='hero',mana=kind==='shard'||kind==='opponentShard',hand=kind==='hand';
  let candidates=[];
  if(hero){
    const y=ar.top+(ar.height-met.height)/2;
    candidates=[mobilePreviewPlacement(ar.right+met.gap,y,met),mobilePreviewPlacement(ar.left-met.width-met.gap,y,met),
      mobilePreviewPlacement(dock.x,y,met)];
  }else if(mana){
    const pool=mobilePopupLogicalRect(anchor.closest?.('.mana-pool')||anchor),pr=pool||ar;
    const x=pr.left+(pr.width-met.width)/2;
    candidates=[mobilePreviewPlacement(x,kind==='opponentShard'?pr.bottom+met.gap:pr.top-met.height-met.gap,met),
      mobilePreviewPlacement(dock.x,kind==='opponentShard'?met.gap:met.logicalH-met.height-met.gap,met)];
  }else if(hand){
    candidates=[mobilePreviewPlacement(dock.x,met.logicalH-met.height-85,met)];
  }else{
    candidates=[mobilePreviewPlacement(ar.right+met.gap,ar.top+(ar.height-met.height)/2,met),dock];
  }
  const avoid=[...document.querySelectorAll('.hero-lane .hero-card,.hero-lane .attachment-card,.hand.bottom .hand-card,.player-mana-pool,.opponent-mana-pool')]
    .filter(e=>e.getClientRects().length).map(mobilePopupLogicalRect).filter(Boolean);
  const result=candidates.map((p,i)=>({p,score:avoid.reduce((sum,r)=>sum+mobilePreviewOverlap(p,r),0)*10+i*12})).sort((a,b)=>a.score-b.score)[0].p;
  layer.style.setProperty('--gl-field-preview-x',Math.round(result.x)+'px');
  layer.style.setProperty('--gl-field-preview-y',Math.round(result.y)+'px');
  layer.style.setProperty('--gl-field-preview-width',Math.round(met.width)+'px');
  layer.style.setProperty('--gl-field-preview-height',Math.round(met.height)+'px');
  return true;
}
let mobilePopupPreviewTimer=null;
function keepMobilePopupPreviewBriefly(){
  if(!hasUnifiedMobilePreviewStage())return;
  clearTimeout(mobilePopupPreviewTimer);
  mobilePopupPreviewTimer=setTimeout(()=>{
    if(hasUnifiedMobilePreviewStage())hideModalHoverPreview();
  },1600);
}
function mobileFlightRect(rect){
  if(!rect)return null;
  const r={left:rect.left,top:rect.top,width:rect.width,height:rect.height};
  if(!isRotatedMobileGameplay())return r;
  // Screen rects are already +90deg: swap CSS dimensions back to portrait,
  // keeping the exact same visual bounding box centered on the same point.
  r.left=rect.left+(rect.width-rect.height)/2;
  r.top=rect.top+(rect.height-rect.width)/2;
  r.width=rect.height;r.height=rect.width;
  return r;
}
function placeBattlefieldHoverPreview(kind,anchor){
  if(!anchor||!battlefieldHoverPreview)return;
  if(placeMobileBattlefieldPreview(kind,anchor,battlefieldHoverPreview))return;
  const cs=getComputedStyle(battlefieldHoverPreview),g=8,vp=uiViewportSize(),vw=vp.width,vh=vp.height;
  let w=parseFloat(cs.width)||259,h=parseFloat(cs.height)||362,left=g,top=g;
  // Fixed-position previews are in viewport pixels, even when game canvas is scaled.
  // A tall opposing Hero preview must never lose its bottom to a short viewport.
  if(kind==='hero'){
    const fit=Math.min(1,Math.max(.1,(vh-2*g)/h),Math.max(.1,(vw-2*g)/w));
    w=Math.max(1,Math.floor(w*fit));h=Math.max(1,Math.floor(h*fit));
    battlefieldHoverPreview.style.setProperty('width',w+'px','important');
    battlefieldHoverPreview.style.setProperty('height',h+'px','important');
  }
  if(kind==='hand'){
    const playerBox=uiRect(document.querySelector('.player-name'));if(!playerBox)return;
    const centerX=playerBox.left+playerBox.width/2;left=centerX-w/2+68;top=playerBox.top-6-h;
    if(choiceOverlay.classList.contains('gl-choice-to-hand')){
      const pr=uiRect(choiceOverlay.querySelector('.choice-panel'));
      if(pr){const right=pr.right+12,leftOutside=pr.left-w-12;
        if(right+w+g<=vw)left=right;else if(leftOutside>=g)left=leftOutside;
      }
    }
  }else if(kind==='hero'){
    // v6.89: restore the v6.83 contextual Hero/Legacy hover. Keep the preview close
    // to the hovered card and choose the side with more free battlefield space.
    const ar=uiRect(anchor),br=uiRect(BF),gap=12;
    const leftSpace=Math.max(0,ar.left-br.left),rightSpace=Math.max(0,br.right-ar.right),useRight=rightSpace>=leftSpace;
    left=useRight?ar.right+gap:ar.left-gap-w;top=ar.top+ar.height/2-h/2;
  }else if(kind==='shard'||kind==='opponentShard'){
    const opponent=kind==='opponentShard';
    const pool=anchor.closest?.('.mana-pool')||document.querySelector(opponent?'.opponent-mana-pool':'.player-mana-pool');if(!pool)return;
    const pr=uiRect(pool),clearance=30;left=pr.left+pr.width/2-w/2;top=opponent?pr.bottom+clearance:pr.top-clearance-h;
  }else{
    const ar=uiRect(anchor);left=ar.right+12;top=ar.top+ar.height/2-h/2;
  }
  left=Math.max(g,Math.min(left,vw-w-g));top=Math.max(g,Math.min(top,vh-h-g));
  battlefieldHoverPreview.style.left=Math.round(left)+'px';battlefieldHoverPreview.style.top=Math.round(top)+'px';
}
function bindBattlefieldPreview(img,kind,anchor){
  if(!img)return;const key='glBattlefieldPreview'+String(kind||'card');if(img.dataset[key]==='1')return;img.dataset[key]='1';
  const show=()=>{if(backgroundPreviewSuppressed(anchor||img))return;promoteTemporaryCardPreview(battlefieldHoverPreview);battlefieldHoverSource=img;battlefieldHoverPreview.classList.toggle('is-hero',kind==='hero');setCardArtwork(battlefieldHoverImg,cardArtwork.original(img));placeBattlefieldHoverPreview(kind,anchor||img);battlefieldHoverPreview.classList.add('open');battlefieldHoverPreview.setAttribute('aria-hidden','false')};
  img.addEventListener('mouseenter',()=>{if(!hasUnifiedMobilePreviewStage())show()});
  img.addEventListener('mousemove',()=>{if(!hasUnifiedMobilePreviewStage()&&battlefieldHoverSource===img&&!backgroundPreviewSuppressed(anchor||img))placeBattlefieldHoverPreview(kind,anchor||img)});
  img.addEventListener('mouseleave',()=>{if(!hasUnifiedMobilePreviewStage()&&battlefieldHoverSource===img)hideBattlefieldHoverPreview()});
  registerMobileCardHold(img,show);
}
function formatMatchTime(ms){const total=Math.max(0,Math.floor(Number(ms||0)/1000)),m=Math.floor(total/60),sec=total%60;return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')}
function updateMatchTimer(){if(!matchTimer)return;const elapsed=matchStartedAt?(matchStoppedElapsed||Date.now()-matchStartedAt):0;matchTimer.textContent=formatMatchTime(elapsed);matchTimer.setAttribute('aria-label','Match time '+matchTimer.textContent)}
function resetMatchTimer(){matchStartedAt=0;matchStoppedElapsed=0;updateMatchTimer()}
function startMatchTimer(){matchStartedAt=Date.now();matchStoppedElapsed=0;updateMatchTimer()}
function stopMatchTimer(){if(matchStartedAt&&!matchStoppedElapsed)matchStoppedElapsed=Date.now()-matchStartedAt;updateMatchTimer()}
function placePhaseIndicator(activeLabel,animate){
  const track=document.querySelector('.phase-track'),underline=track?.querySelector('.gl-phase-underline'),diamond=track?.querySelector('.gl-phase-diamond'),tint=track?.querySelector('.gl-phase-tint');if(!track||!activeLabel||!underline||!diamond||!tint)return;
  const scale=currentUiScale(),tr=uiLayoutRect(track),lr=uiLayoutRect(activeLabel),left=(lr.left-tr.left)/scale,width=lr.width/scale,center=left+width/2;
  const labelTop=(lr.top-tr.top)/scale,labelBottom=(lr.bottom-tr.top)/scale,lineTop=labelBottom+6;
  underline.style.left=left+'px';underline.style.width=width+'px';underline.style.top=lineTop+'px';
  diamond.style.left=center+'px';diamond.style.top=(lineTop-2.5)+'px';
  tint.style.left=(left-7)+'px';tint.style.width=(width+14)+'px';tint.style.top=Math.max(0,labelTop-5)+'px';tint.style.bottom='auto';tint.style.height=(lr.height/scale+10)+'px';
  if(animate){activeLabel.classList.remove('gl-phase-enter');void activeLabel.offsetWidth;activeLabel.classList.add('gl-phase-enter');clearTimeout(placePhaseIndicator.t);placePhaseIndicator.t=setTimeout(()=>activeLabel.classList.remove('gl-phase-enter'),560)}
}
function clearResponseFocusLights(){
  document.querySelectorAll('.gl-focus-lit').forEach(el=>el.classList.remove('gl-focus-lit'));
  document.querySelectorAll('.gl-response-target-hero').forEach(el=>el.classList.remove('gl-response-target-hero'));
  sidebar?.classList.remove('gl-focus-response-sidebar');
}
function addResponseFocusLight(el){if(el)el.classList.add('gl-focus-lit')}
function renderResponseFocusLights(s){
  clearResponseFocusLights();
  if(s?.responseWindow?.response_owner!=='PLAYER')return;
  sidebar?.classList.add('gl-focus-response-sidebar');
  addResponseFocusLight(activeStage?.closest('.active-card-pane')||activeStage);
  const rw=s.responseWindow,action=normalizeAction(rw.action||rw,rw.card_id);
  // A defended Hero's HP must remain above the attacking Hero and its visual card
  // when different focused lanes overlap. Give the TARGET lane the higher peer stack.
  const defended=uiLaneElement(rw.target_side,rw.target_lane);
  if(defended){defended.classList.add('gl-response-target-hero');addResponseFocusLight(defended);}
  if(action?.source_side&&action?.source_lane)addResponseFocusLight(uiLaneElement(action.source_side,action.source_lane));
  const contexts=activeTargetContexts(s,chainActions(s));
  contexts.forEach(ctx=>{
    if(ctx?.source_kind!=='active-card'&&ctx?.source_side&&ctx?.source_lane)addResponseFocusLight(uiLaneElement(ctx.source_side,ctx.source_lane));
    addResponseFocusLight(targetElementForContext(ctx));
  });
}
function renderInteractionFocus(s){
  const p=s?.pending,responseOwned=s?.responseWindow?.response_owner==='PLAYER';
  const payment=pendingOwner(p)==='PLAYER'&&['mana_shard_payment_choice','mana_spend_choice','response_payment_choice'].includes(p?.type)&&Number(p?.mana_cost??p?.selected_mana??1)>0;
  const blindMana=pendingOwner(p)==='PLAYER'&&p?.type==='opponent_mana_selection';
  const centerOnly=pendingOwner(p)==='PLAYER'&&['opponent_hand_choice','magic_scope_reveal'].includes(p?.type);
  const bardSelecting=pendingOwner(p)==='PLAYER'&&p?.type==='s0_bard_draw_choice'&&p.selection_active===true;
  const mode=payment?'payment':(responseOwned?'response':(blindMana?'blind-mana':(centerOnly?'center-choice':(bardSelecting?'bard':''))));
  BF.classList.toggle('gl-focus-bard',mode==='bard');
  for(const lane of laneOrder)uiLaneElement('PLAYER',lane)?.classList.toggle('gl-bard-ability-source',mode==='bard'&&lane===p?.source_lane);
  BF.classList.toggle('gl-focus-payment',mode==='payment');BF.classList.toggle('gl-focus-response',mode==='response');BF.classList.toggle('gl-focus-blind-mana',mode==='blind-mana');
  focusDimmer.classList.toggle('is-visible',!!mode);focusDimmer.setAttribute('aria-hidden',mode?'false':'true');
  if(mode==='response')renderResponseFocusLights(s);else clearResponseFocusLights();
  if(mode!==lastInteractionFocusMode){
    lastInteractionFocusMode=mode;const el=mode==='payment'?payBtn:(mode==='response'&&primary.classList.contains('gl-pass')?primary:null);
    if(el){el.classList.remove('gl-attention-enter');void el.offsetWidth;el.classList.add('gl-attention-enter');setTimeout(()=>el.classList.remove('gl-attention-enter'),520)}
  }
}
function hideSidebarHoverPreview(){sidebarHoverSource=null;sidebarHoverPreview.classList.remove('open');sidebarHoverPreview.setAttribute('aria-hidden','true');sidebarHoverImg.removeAttribute('src')}
function placeSidebarHoverPreview(anchor){
  if(!anchor||!sidebarHoverPreview||!sidebar)return;
  if(placeMobileBattlefieldPreview('sidebar',anchor,sidebarHoverPreview))return;
  const sr=uiRect(sidebar),ar=uiRect(anchor),cs=getComputedStyle(sidebarHoverPreview);
  const vp=uiViewportSize(),w=parseFloat(cs.width)||259,h=parseFloat(cs.height)||362,g=10,vw=vp.width,vh=vp.height;
  let left=sr.left-w-g;
  left=Math.max(g,Math.min(left,vw-w-g));
  let top=ar.top+ar.height/2-h/2;
  top=Math.max(g,Math.min(top,vh-h-g));
  sidebarHoverPreview.style.left=Math.round(left)+'px';sidebarHoverPreview.style.top=Math.round(top)+'px';
}
function bindSidebarPreview(img){
  if(!img||img.dataset.glSidebarPreviewBound==='1')return;img.dataset.glSidebarPreviewBound='1';
  const show=()=>{if(backgroundPreviewSuppressed(img))return;promoteTemporaryCardPreview(sidebarHoverPreview);sidebarHoverSource=img;setCardArtwork(sidebarHoverImg,cardArtwork.original(img));placeSidebarHoverPreview(img);sidebarHoverPreview.classList.add('open');sidebarHoverPreview.setAttribute('aria-hidden','false')};
  img.addEventListener('mouseenter',()=>{if(!hasUnifiedMobilePreviewStage())show()});
  img.addEventListener('mousemove',()=>{if(!hasUnifiedMobilePreviewStage()&&!backgroundPreviewSuppressed(img))placeSidebarHoverPreview(img)});
  img.addEventListener('mouseleave',()=>{if(!hasUnifiedMobilePreviewStage())hideSidebarHoverPreview()});
  registerMobileCardHold(img,show);
}
function hideModalHoverPreview(){modalHoverSource=null;modalHoverPreview.style.removeProperty('width');modalHoverPreview.style.removeProperty('height');modalHoverPreview.classList.remove('open');modalHoverPreview.setAttribute('aria-hidden','true');modalHoverImg.removeAttribute('src')}
// On touch screens a blank-area tap is the explicit dismiss gesture for every
// enlarged preview. Hover exit is not dependable on mobile browsers, especially
// when the game stage is rotated into landscape inside a portrait viewport.
let mobileOutsidePreviewDismissBound=false;
function mobilePreviewSourceContains(source,target){
  const el=target?.nodeType===1?target:target?.parentElement;
  return !!(source&&el&&(source===el||source.contains?.(el)));
}
function bindMobileOutsidePreviewDismiss(){
  if(mobileOutsidePreviewDismissBound)return;
  mobileOutsidePreviewDismissBound=true;
  document.addEventListener('pointerdown',event=>{
    if(!event||event.pointerType==='mouse'||!(event.pointerType==='touch'||event.pointerType==='pen'||Number(navigator.maxTouchPoints||0)>0))return;
    const target=event.target;
    if(mobilePreviewSourceContains(battlefieldHoverSource,target)||
       mobilePreviewSourceContains(sidebarHoverSource,target)||
       mobilePreviewSourceContains(modalHoverSource,target))return;
    hideBattlefieldHoverPreview();
    hideSidebarHoverPreview();
    hideModalHoverPreview();
  },true);
}
bindMobileOutsidePreviewDismiss();
[battlefieldHoverImg,sidebarHoverImg,modalHoverImg].forEach(im=>{
  im.addEventListener('pointerdown',event=>{
    if(!hasUnifiedMobilePreviewStage())return;
    event.preventDefault();event.stopImmediatePropagation();
    hideBattlefieldHoverPreview();hideSidebarHoverPreview();hideModalHoverPreview();
  });
});
function fixedChoicePreviewSlot(){return choiceOverlay.querySelector('.gl-choice-fixed-preview-slot')}
function setFixedChoicePreview(src,alt){
  const slot=fixedChoicePreviewSlot();if(!slot)return false;
  const im=slot.querySelector('img');if(!im)return false;
  setCardArtwork(im,src||'');im.alt=alt||'Card preview';slot.classList.toggle('has-card',!!src);return true;
}
function bindFixedChoicePreview(img,cardId){
  if(!img||img.dataset.glFixedChoicePreviewBound==='1')return;img.dataset.glFixedChoicePreviewBound='1';
  const show=()=>{if(backgroundPreviewSuppressed(img))return;hideModalHoverPreview();const v=cv(cardId);setFixedChoicePreview(art(cardId),v?.name||img.alt)};
  img.addEventListener('mouseenter',show);img.addEventListener('focus',show);
}
function placeModalHoverPreview(anchor){
  if(placeMobilePopupPreview(anchor))return;
  const panel=choiceOverlay.querySelector('.choice-panel');
  const r=uiRect(panel||anchor);if(!r)return;
  const cs=getComputedStyle(modalHoverPreview),w=parseFloat(cs.width)||225,h=parseFloat(cs.height)||315,g=12,vp=uiViewportSize(),vw=vp.width,vh=vp.height;
  // Popup preview uses the exact same card size as the battlefield hover preview.
  // X is centered in the free space between the popup and the right viewport edge.
  // If that side cannot fit the full preview, use the left free space instead rather
  // than changing the established lobby/battlefield/component sizing.
  const rightAvailable=Math.max(0,vw-r.right),leftAvailable=Math.max(0,r.left);
  const useRight=rightAvailable>=w+g;
  const centerX=useRight?(r.right+rightAvailable/2):(leftAvailable/2);
  let left=centerX-w/2;
  if(useRight) left=Math.max(r.right+g,left);
  else left=Math.min(r.left-g-w,left);
  left=Math.max(g,Math.min(left,vw-w-g));
  let top=r.top+(r.height-h)/2;
  top=Math.max(g,Math.min(top,vh-h-g));
  modalHoverPreview.style.left=Math.round(left)+'px';modalHoverPreview.style.top=Math.round(top)+'px';
}
function bindModalPreview(img){
  if(!img||img.dataset.glModalPreviewBound==='1')return;img.dataset.glModalPreviewBound='1';
  const show=()=>{if(backgroundPreviewSuppressed(img))return;modalHoverSource=img;modalHoverPreview.classList.remove('is-context-hero');setCardArtwork(modalHoverImg,cardArtwork.original(img));placeModalHoverPreview(img);modalHoverPreview.classList.add('open');modalHoverPreview.setAttribute('aria-hidden','false')};
  img.addEventListener('mouseenter',()=>{if(!hasUnifiedMobilePreviewStage())show()});
  img.addEventListener('mousemove',()=>{if(!hasUnifiedMobilePreviewStage()&&!backgroundPreviewSuppressed(img))placeModalHoverPreview(img)});
  img.addEventListener('mouseleave',()=>{if(!hasUnifiedMobilePreviewStage())hideModalHoverPreview()});
  registerMobileCardHold(img,show);
}
function placeContextualModalHoverPreview(anchor,compactHero){
  if(!anchor||!modalHoverPreview)return;
  modalHoverPreview.classList.toggle('is-context-hero',!!compactHero);
  if(placeMobilePopupPreview(anchor))return;
  const cs=getComputedStyle(modalHoverPreview),w=parseFloat(cs.width)||259,h=parseFloat(cs.height)||362,g=10,vp=uiViewportSize(),vw=vp.width,vh=vp.height,ar=uiRect(anchor);
  // Contextual popup previews belong to the hovered card, but should not cover the
  // popup grid. Pick the outside edge that corresponds to the hovered card's half
  // of the popup, then fall back to whichever outside edge actually fits.
  const panel=anchor.closest?.('.gl-exp-inspector-panel')||anchor.closest?.('.choice-panel')||choiceOverlay.querySelector('.choice-panel'),pr=uiRect(panel);
  let useRight;
  if(pr){
    useRight=(ar.left+ar.width/2)>=(pr.left+pr.width/2);
    const canRight=(vw-pr.right)>=w+g,canLeft=pr.left>=w+g;
    if(useRight&&!canRight&&canLeft)useRight=false;
    else if(!useRight&&!canLeft&&canRight)useRight=true;
  }else{
    useRight=Math.max(0,vw-ar.right)>=Math.max(0,ar.left);
  }
  let left=pr?(useRight?pr.right+g:pr.left-g-w):(useRight?ar.right+g:ar.left-g-w),top=ar.top+ar.height/2-h/2;
  left=Math.max(g,Math.min(left,vw-w-g));top=Math.max(g,Math.min(top,vh-h-g));
  modalHoverPreview.style.left=Math.round(left)+'px';modalHoverPreview.style.top=Math.round(top)+'px';
}
/* RC25 follow-up: Class Ability preview is docked OUTSIDE the *visible cards*,
   not outside the full-width invisible row. This gives the same left/right
   interaction as the Legacy Deck hover even when the selection row fills 94vw. */
function placeClassChoiceHoverPreview(anchor){
  if(!anchor)return;
  if(placeMobilePopupPreview(anchor))return;
  const vp=uiViewportSize(),margin=12,gap=12,card=anchor.closest?.('.gl-center-choice-card')||anchor;
  const bounds=[...centerChoiceStage.querySelectorAll('.gl-center-choice-card')]
    .map(uiRect).filter(r=>r&&r.width>0&&r.height>0);
  if(!bounds.length)return;
  const groupLeft=Math.min(...bounds.map(r=>r.left));
  const groupRight=Math.max(...bounds.map(r=>r.right));
  const ar=uiRect(card);
  const spaceLeft=Math.max(0,groupLeft-margin-gap);
  const spaceRight=Math.max(0,vp.width-groupRight-margin-gap);
  const onRightHalf=ar.left+ar.width/2>=(groupLeft+groupRight)/2;
  let onRight=onRightHalf;
  if((onRight?spaceRight:spaceLeft)<110&&(onRight?spaceLeft:spaceRight)>(onRight?spaceRight:spaceLeft))onRight=!onRight;
  let space=onRight?spaceRight:spaceLeft;
  const idealW=Math.min(272,Math.max(180,Math.floor(vp.width*.22)));
  const heightFit=Math.max(100,(vp.height-margin*2)*5/7);
  // On narrow screens, leave the selection fully usable and allow a smaller
  // side preview. Do not cover the choice cards or the action buttons.
  const width=Math.max(0,Math.min(idealW,space,heightFit));
  if(width<110){
    // No physically usable side column: dock above the selection, not on top
    // of the CONFIRM/SKIP buttons as the previous RC25 fallback did.
    const w=Math.min(220,vp.width-margin*2,heightFit);
    const h=w*7/5;
    const center=ar.left+ar.width/2;
    const x=Math.max(margin,Math.min(center-w/2,vp.width-w-margin));
    const rowTop=Math.min(...bounds.map(r=>r.top));
    const y=Math.max(margin,Math.min(rowTop-gap-h,vp.height-h-margin));
    modalHoverPreview.style.setProperty('width',Math.round(w)+'px','important');
    modalHoverPreview.style.setProperty('height',Math.round(h)+'px','important');
    modalHoverPreview.style.left=Math.round(x)+'px';
    modalHoverPreview.style.top=Math.round(y)+'px';
    return;
  }
  const w=width,h=w*7/5;
  const x=onRight?groupRight+gap:groupLeft-gap-w;
  const y=Math.max(margin,Math.min(ar.top+ar.height/2-h/2,vp.height-h-margin));
  modalHoverPreview.style.setProperty('width',Math.round(w)+'px','important');
  modalHoverPreview.style.setProperty('height',Math.round(h)+'px','important');
  modalHoverPreview.style.left=Math.round(x)+'px';
  modalHoverPreview.style.top=Math.round(y)+'px';
}
let classChoiceHoverOwner=null;
function bindClassChoiceHoverPreview(card,cardId,explicitArt=null){
  if(!card||(!cardId&&!explicitArt)||card.dataset.glClassChoicePreviewBound==='1')return;
  card.dataset.glClassChoicePreviewBound='1';
  let leaveTimer=null;
  const show=()=>{
    clearTimeout(leaveTimer);
    if(backgroundPreviewSuppressed(card)||!card.isConnected)return;
    classChoiceHoverOwner=card;
    promoteTemporaryCardPreview(modalHoverPreview);
    modalHoverSource=card;
    modalHoverPreview.classList.remove('is-context-hero');
    setCardArtwork(modalHoverImg,explicitArt||art(cardId));
    placeClassChoiceHoverPreview(card);
    modalHoverPreview.classList.add('open');modalHoverPreview.setAttribute('aria-hidden','false');
  };
  // The stable BUTTON is the hover anchor. Binding to its 3D-flipped IMG used
  // to fire pointerleave when the image/hover transform changed under Firefox.
  card.addEventListener('pointerenter',e=>{if(!hasUnifiedMobilePreviewStage()&&e.pointerType!=='touch')show()});
  card.addEventListener('pointermove',e=>{
    if(hasUnifiedMobilePreviewStage()||e.pointerType==='touch')return;
    if(classChoiceHoverOwner!==card||!modalHoverPreview.classList.contains('open'))show();
    else placeClassChoiceHoverPreview(card);
  });
  card.addEventListener('pointerleave',()=>{
    clearTimeout(leaveTimer);
    if(hasUnifiedMobilePreviewStage())return;
    leaveTimer=setTimeout(()=>{
      if(classChoiceHoverOwner===card&&!card.matches(':hover')){classChoiceHoverOwner=null;hideModalHoverPreview()}
    },85);
  });
  card.addEventListener('focus',()=>{if(!hasUnifiedMobilePreviewStage())show()});
  card.addEventListener('blur',()=>{
    clearTimeout(leaveTimer);
    if(!hasUnifiedMobilePreviewStage()&&classChoiceHoverOwner===card){classChoiceHoverOwner=null;hideModalHoverPreview()}
  });
  registerMobileCardHold(card,show);
}
function bindContextualModalPreview(img,cardId){
  if(!img||img.dataset.glContextModalPreviewBound==='1')return;img.dataset.glContextModalPreviewBound='1';
  const v=cv(cardId),family=String(v?.family||v?.type||'').toLowerCase(),compactHero=/hero|legacy/.test(family)||/-(H\d{3}|L\d{3}|LEG)/i.test(String(cardId||''));
  const show=()=>{if(backgroundPreviewSuppressed(img))return;promoteTemporaryCardPreview(modalHoverPreview);modalHoverSource=img;setCardArtwork(modalHoverImg,cardArtwork.original(img));placeContextualModalHoverPreview(img,compactHero);modalHoverPreview.classList.add('open');modalHoverPreview.setAttribute('aria-hidden','false')};
  img.addEventListener('mouseenter',()=>{if(!hasUnifiedMobilePreviewStage())show()});
  img.addEventListener('mousemove',()=>{if(!hasUnifiedMobilePreviewStage()&&!backgroundPreviewSuppressed(img))placeContextualModalHoverPreview(img,compactHero)});
  img.addEventListener('mouseleave',()=>{if(!hasUnifiedMobilePreviewStage()){modalHoverPreview.classList.remove('is-context-hero');hideModalHoverPreview()}});
  // Center-choice buttons have their own stable hold anchor. In card lists,
  // the image is the hold anchor and single tap remains selection-only.
  if(!img.closest('.gl-center-choice-card'))registerMobileCardHold(img,show);
}
function bindChoicePreview(img,cardId,mode){
  // Preview behavior follows the candidate zone, never the action/caller type.
  // Main Deck candidates restore the v6.88 floating fixed preview outside the popup.
  // Legacy Deck / Discard candidates remain contextual to the hovered card.
  if(mode==='fixed')bindModalPreview(img);else bindContextualModalPreview(img,cardId)
}
function candidateSourceZone(p){
  if(!p)return'';
  const explicit=String(p.choice_zone||p.zone||p.candidate_zone||p.source_zone||p.from_zone||'').trim().toLowerCase();
  if(explicit)return explicit;
  // These are source-zone fallbacks only when the pending object omits its zone.
  if(p.type==='legacy_defeat_choice')return'legacy_deck';
  if(p.type==='crystal_ball_reorder')return'deck_top';
  return'';
}
function choicePreviewModeFromCandidateZone(p){
  const z=candidateSourceZone(p);
  return /(^|_|\b)(deck|deck_search|deck_top|main|main_deck)(_|\b|$)/.test(z)&&!/discard|legacy_deck/.test(z)?'fixed':'contextual';
}
let lobbyReviewProgressionIds=[];
function closeCardReview(){
  cardReviewOverlay.classList.remove('open');
  lobbyReviewProgressionIds=[];
  // Preserve the ready iframe. Reopening the same card does not recreate 19 stylesheets.
}
function openCardReview(cardId,options=null){
  if(!cardId)return;
  warmCardArtwork(cardId);
  const v=cv(cardId),body=cardReviewOverlay.querySelector('.gl-card-review-body');
  if(options?.lobbyLineageIds)lobbyReviewProgressionIds=options.lobbyLineageIds.slice(0,3);
  else if(!options?.keepLobbyLineage)lobbyReviewProgressionIds=[];
  const key=String(cardId)+'|'+lobbyReviewProgressionIds.join(',');
  const previous=body.querySelector('.gl-db158-review-frame');
  if(previous&&body.dataset.glReviewKey===key&&body.classList.contains('gl-review-ready')){
    cardReviewOverlay.classList.add('open');return;
  }
  body.classList.remove('gl-review-ready');
  body.dataset.glReviewKey=key;
  if(!window.GL_DB158_REVIEW?.mount?.(body,cardId,lobbyReviewProgressionIds)){
    let html='';try{html=window.GL_CARD_PREVIEW_QA?.html?.(cardId)||''}catch{}
    body.innerHTML='<button type="button" class="gl-card-review-close" aria-label="Close card review">×</button>'+(html||('<img class="gl-card-review-image" src="'+esc(cardArtwork.first(art(cardId)))+'" alt="'+esc(v?.name||'Card Review')+'">'));
    body.classList.add('gl-review-ready');
  }
  cardReviewOverlay.classList.add('open');
}
cardReviewOverlay.addEventListener('click',e=>{if(e.target.closest('.gl-card-review-close'))closeCardReview()});
window.addEventListener('message',e=>{
  const frame=cardReviewOverlay.querySelector('.gl-db158-review-frame');
  if(!frame||e.source!==frame.contentWindow)return;
  if(e.data?.kind==='GL_S0_REVIEW_READY'){
    // Reused frames signal readiness themselves after decoding the new card.
    // Ignore a stale READY emitted by the iframe's original bootstrap card.
    if(!frame.__glReviewRequest)cardReviewOverlay.querySelector('.gl-card-review-body')?.classList.add('gl-review-ready');
    return;
  }
  if(e.data?.kind==='GL_S0_REVIEW_CLOSE'){closeCardReview();return;}
  if(e.data?.kind==='GL_S0_REVIEW_RANK'&&cardReviewOverlay.classList.contains('open')){
    const next=String(e.data.cardId||'');
    if(lobbyReviewProgressionIds.includes(next))openCardReview(next,{keepLobbyLineage:true});
    return;
  }
  if(e.data?.kind==='GL_S0_REVIEW_FIT'&&cardReviewOverlay.classList.contains('open')){
    const h=Number(e.data.height);
    if(Number.isFinite(h)&&h>100){
      // Avoid stretching the Deck Builder card to fill empty background space.
      const logicalViewportHeight=hasUnifiedMobilePreviewStage()?747:window.innerHeight;
      const fit=Math.min(Math.ceil(h),Math.max(250,logicalViewportHeight-32));
      frame.style.setProperty('height',fit+'px','important');
    }
  }
});
cardReviewOverlay.addEventListener('click',e=>{if(e.target===cardReviewOverlay)closeCardReview()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cardReviewOverlay.classList.contains('open'))closeCardReview()});
// Prevent native image dragging / browser selection ghosts on game pieces. These blue drag ghosts
// were being mistaken for a gameplay selection overlay during double-click and payment interactions.
document.addEventListener('dragstart',e=>{if(e.target?.closest?.('.app img,.gl-vsai-choice-overlay img,.gl-played-detail-overlay img,.gl-card-review-overlay img'))e.preventDefault()},true);
document.addEventListener('selectstart',e=>{if(e.target?.closest?.('.hero-card,.hand-card,.mana-card,.played-card,.attachment-card,.gl-combat-card,.gl-inspect-card'))e.preventDefault()},true);
function closePlayedDetail(){playedDetailOverlay.classList.remove('open');playedDetailOverlay.querySelector('.gl-played-detail-body').innerHTML='';}
function openPlayedDetail(side,eventId){
  const detail=E()?.getCardPlayedDetail?.(side,eventId);if(!detail?.html)return;
  playedDetailOverlay.querySelector('#glPlayedDetailTitle').textContent=detail.title||'Card Played';
  playedDetailOverlay.querySelector('.gl-played-detail-body').innerHTML=detail.html;
  playedDetailOverlay.classList.add('open');
}
playedDetailOverlay.querySelector('.gl-played-detail-close').onclick=closePlayedDetail;
playedDetailOverlay.addEventListener('click',e=>{
  const link=e.target.closest?.('[data-gl-linked-event]');
  if(link){e.preventDefault();e.stopPropagation();openPlayedDetail(link.dataset.glLinkedSide,link.dataset.glLinkedEvent);return;}
  if(e.target===playedDetailOverlay)closePlayedDetail();
});
function adaptiveStageActive(){return document.documentElement.classList.contains('gl-adaptive-stage');}
function currentUiScale(){return adaptiveStageActive()?1:(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ui-scale'))||1);}
/* Viewport rectangles for screen-space portals (VFX, arrows, moving cards,
   coin/review/choice overlays); never inverse-transform these coordinates. */
function uiViewportSize(){return{width:Math.max(1,window.innerWidth||1),height:Math.max(1,window.innerHeight||1)};}
function uiRect(el){return el?.getBoundingClientRect?.()||null;}
/* CSS layout offsets inside the scaled battlefield are expressed in the app's
   logical local coordinate system, not the viewport. */
function uiLayoutRect(el){
  if(!el)return null;
  const r=el.getBoundingClientRect();
  const app=document.querySelector('.app');
  if(!adaptiveStageActive()||!app?.contains(el)||typeof DOMMatrixReadOnly==='undefined'||typeof DOMPoint==='undefined')return r;
  const raw=getComputedStyle(app).transform;
  if(!raw||raw==='none')return r;
  try{
    const inv=new DOMMatrixReadOnly(raw).inverse();
    const pts=[[r.left,r.top],[r.right,r.top],[r.left,r.bottom],[r.right,r.bottom]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(inv));
    const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
    return{left,right,top,bottom,width:right-left,height:bottom-top,x:left,y:top};
  }catch(_){return r;}
}
const IDENTITY_MAX_CHARS=25,IDENTITY_VISIBLE_PREFIX=22;
function clampIdentityText(value,fallback){const raw=String(value==null||value===''?fallback:value).trim(),chars=Array.from(raw);if(chars.length<=IDENTITY_MAX_CHARS)return raw;return chars.slice(0,IDENTITY_VISIBLE_PREFIX).join('').replace(/\s+$/u,'')+'...';}
function syncBattlefieldIdentity(){
  const setup=E()?.getDeckSetupState?.()||{};
  const playerName=document.getElementById('playerIdentityName'),opponentName=document.getElementById('opponentPlayerIdentityName');
  const playerDeck=document.getElementById('playerDeckIdentity'),opponentDeck=document.getElementById('opponentDeckIdentity');
  if(playerName)playerName.textContent=clampIdentityText('PLAYER','PLAYER');
  if(opponentName)opponentName.textContent=clampIdentityText('LOCAL AI','LOCAL AI');
  if(playerDeck){const full=String(setup.player?.deck_name||'Player Deck');playerDeck.textContent=clampIdentityText(full,'Player Deck');playerDeck.title=full;}
  if(opponentDeck){const full=String(setup.ai?.deck_name||'AI Deck');opponentDeck.textContent=clampIdentityText(full,'AI Deck');opponentDeck.title=full;}
}
function syncPlayerNameBox(){syncBattlefieldIdentity();}
function lockPrimaryActionWidth(){
  if(!primary)return;
  const label=primary.textContent,cls=primary.className;
  primary.textContent='REPOSITION';primary.className='phase-action';primary.style.width='';
  const w=Math.ceil(uiLayoutRect(primary).width/currentUiScale());
  if(w>0)primary.style.width=w+'px';
  primary.textContent=label;primary.className=cls;
}
function negativeStatusName(name){return ['Bleed','Burn','Freeze','Poison','Sleep','Stun'].some(x=>x.toLowerCase()===String(name||'').toLowerCase())}

function zoneEl(side,type){
  const map={
    'PLAYER|Legacy Deck':'.player-field > .rail-pair:first-child .zone:nth-child(1)',
    'PLAYER|Shard Deck':'.player-field > .rail-pair:first-child .zone:nth-child(2)',
    'PLAYER|Discard Pile':'.player-right-rail .zone:nth-child(1)',
    'PLAYER|Main Deck':'.player-right-rail .zone:nth-child(2)',
    'AI|Main Deck':'.opponent-left-rail .zone:nth-child(2)',
    'AI|Discard Pile':'.opponent-left-rail .zone:nth-child(3)',
    'AI|Shard Deck':'.opponent-right-rail .zone:nth-child(1)',
    'AI|Legacy Deck':'.opponent-right-rail .zone:nth-child(2)'
  };
  return document.querySelector(map[side+'|'+type]||'');
}
// M03: a first handset tap arms one specific Discard Pile; the second tap
// on that same pile within 1.1s opens it. This is presentation-only, never
// affects the authoritative Discard/inspection state or desktop click behavior.
let mobileDiscardArmed=null;
let mobileDiscardTimer=null;
function isHandsetViewport(){
  const short=Math.min(window.innerWidth||0,window.innerHeight||0);
  const long=Math.max(window.innerWidth||0,window.innerHeight||0);
  let touch=(navigator.maxTouchPoints||0)>0;
  try{touch=touch||matchMedia('(pointer:coarse)').matches}catch(_){}
  return touch&&short<=680&&long<=1350;
}
function clearMobileDiscardArm(){
  if(mobileDiscardTimer!==null){clearTimeout(mobileDiscardTimer);mobileDiscardTimer=null}
  mobileDiscardArmed?.classList?.remove('gl-discard-tap-armed');
  mobileDiscardArmed=null;
}
function mobileDiscardDoubleTapGate(pile,open){
  if(!isHandsetViewport()){clearMobileDiscardArm();open();return}
  if(mobileDiscardArmed===pile){clearMobileDiscardArm();open();return}
  clearMobileDiscardArm();mobileDiscardArmed=pile;
  pile.classList.add('gl-discard-tap-armed');
  mobileDiscardTimer=setTimeout(clearMobileDiscardArm,1100);
}
document.addEventListener('pointerdown',event=>{
  if(mobileDiscardArmed&&!event.target.closest?.('.zone[data-zone-type="Discard Pile"]'))clearMobileDiscardArm();
},true);
function configureStaticZones(){
  [['PLAYER','Legacy Deck'],['PLAYER','Shard Deck'],['PLAYER','Discard Pile'],['PLAYER','Main Deck'],['AI','Main Deck'],['AI','Discard Pile'],['AI','Shard Deck'],['AI','Legacy Deck']].forEach(([side,type])=>{
    const z=zoneEl(side,type);if(!z)return;z.dataset.zoneSide=side;z.dataset.zoneType=type;z.querySelector('img')?.classList.add('zoneCard');
  });
  const pd=zoneEl('PLAYER','Discard Pile'),ad=zoneEl('AI','Discard Pile'),pl=zoneEl('PLAYER','Legacy Deck');
  if(pd&&!pd.dataset.glInspectBound){pd.dataset.glInspectBound='1';pd.addEventListener('click',()=>mobileDiscardDoubleTapGate(pd,()=>openInspectCards('Your Discard Pile — '+(st()?.playerDiscard||[]).length+' Cards',(st()?.playerDiscard||[]).slice(),'Discard Piles are public.','contextual')))}
  if(ad&&!ad.dataset.glInspectBound){ad.dataset.glInspectBound='1';ad.addEventListener('click',()=>mobileDiscardDoubleTapGate(ad,()=>openInspectCards('Opponent Discard Pile — '+(st()?.aiDiscard||[]).length+' Cards',(st()?.aiDiscard||[]).slice(),'Discard Piles are public.','contextual')))}
  if(pl&&!pl.dataset.glInspectBound){pl.dataset.glInspectBound='1';pl.addEventListener('click',()=>openInspectCards('Your Legacy Deck — '+(st()?.playerLegacy||[]).length+' Cards',(st()?.playerLegacy||[]).map(x=>typeof x==='string'?x:(x?.card_id||x?.id)).filter(Boolean),'Private zone: only your own Legacy Deck can be inspected.','contextual'))}
}
function openInspectCards(title,ids,instruction,previewMode='contextual'){
  if(st()?.pending)return;
  inspectState={title,ids:(ids||[]).filter(Boolean),instruction:instruction||'',previewMode};modalRenderKey='';renderInspectModal();
}
function closeInspectModal(){hideModalHoverPreview();inspectState=null;activeModalType='';modalRenderKey='';resetReturnToHandSearchDisplay();choiceOverlay.classList.remove('open','gl-choice-main-deck-preview')}
function renderInspectModal(){
  if(!inspectState)return;
  resetReturnToHandSearchDisplay();
  choiceOverlay.classList.remove('gl-choice-main-deck-preview');choiceOverlay.classList.add('open');activeModalType='inspect';
  const sig='inspect|'+inspectState.title+'|'+inspectState.ids.join('|');if(modalRenderKey===sig)return;modalRenderKey=sig;
  const title=choiceOverlay.querySelector('.gl-choice-title'),body=choiceOverlay.querySelector('.gl-choice-body'),confirm=choiceOverlay.querySelector('.gl-choice-confirm');
  title.textContent=inspectState.title;body.innerHTML='';
  if(inspectState.instruction){const p=document.createElement('p');p.className='choice-instruction';p.textContent=inspectState.instruction;body.appendChild(p)}
  if(inspectState.ids.length){const grid=document.createElement('div');grid.className='choice-grid inspect-card-grid';inspectState.ids.forEach(id=>{const v=cv(id),b=document.createElement('button');b.type='button';b.className='gl-inspect-card';const im=document.createElement('img');setCardArtwork(im,art(id));im.alt=v?.name||id;im.draggable=false;const sp=document.createElement('span');sp.textContent=v?.name||id;b.append(im,sp);grid.appendChild(b);bindChoicePreview(im,id,inspectState.previewMode||'contextual')});body.appendChild(grid)}
  else{const e=document.createElement('div');e.className='gl-inspect-empty';e.textContent='This pile is empty.';body.appendChild(e)}
  const cancel=choiceOverlay.querySelector('.gl-choice-cancel');
  if(cancel){cancel.hidden=true;cancel.onclick=null;}
  confirm.textContent='CLOSE';confirm.disabled=false;confirm.onclick=closeInspectModal;
}
// Part 5: music remains OFF by default; the existing engine SFX switch remains ON by default.
// Save user choices without coupling BGM to the card / battle / coin sound effect setting.
const GL_S0_MUSIC_STORAGE_KEY='grandis_legacy_s0_background_music_v1';
// RC36: the approved ceiling is 45% of the original music-file gain.
// The on-screen 0-100% slider is relative to this ceiling (50% = .225).
const GL_S0_MUSIC_BASE_GAIN=.45;
const GL_S0_MUSIC_VOLUME_KEY='grandis_legacy_s0_background_music_relative_volume_v2';
const GL_S0_MUSIC_OLD_VOLUME_KEY='grandis_legacy_s0_background_music_volume_v1';
let glMusicEnabled=false,glMusicVolume=100;
try{
  glMusicEnabled=window.localStorage?.getItem(GL_S0_MUSIC_STORAGE_KEY)==='on';
  const stored=window.localStorage?.getItem(GL_S0_MUSIC_VOLUME_KEY);
  if(stored!==null&&stored!==undefined&&stored!==''){
    glMusicVolume=Math.max(0,Math.min(100,Math.round(Number(stored)||0)));
  }else{
    // One-time migration: RC35.4/5 stored the percentage of raw file gain.
    // Preserve lower user-selected levels, capping loud settings at the baseline.
    const previous=window.localStorage?.getItem(GL_S0_MUSIC_OLD_VOLUME_KEY);
    if(previous!==null&&previous!==undefined&&previous!==''){
      const oldGain=Math.max(0,Math.min(100,Number(previous)||0))/100;
      glMusicVolume=Math.max(0,Math.min(100,Math.round(oldGain/GL_S0_MUSIC_BASE_GAIN*100)));
    }
    window.localStorage?.setItem(GL_S0_MUSIC_VOLUME_KEY,String(glMusicVolume));
  }
}catch(_){}
const glBackgroundMusic=(typeof Audio==='function')?new Audio('engine/assets/audio/Tavern Quest.mp3'):null;
function glAppliedMusicGain(){return GL_S0_MUSIC_BASE_GAIN*(glMusicVolume/100);}
if(glBackgroundMusic){glBackgroundMusic.loop=true;glBackgroundMusic.volume=glAppliedMusicGain();glBackgroundMusic.preload='none'}
function setS0MusicVolume(percent){
  glMusicVolume=Math.max(0,Math.min(100,Math.round(Number(percent)||0)));
  if(glBackgroundMusic)glBackgroundMusic.volume=glAppliedMusicGain();
  if(musicVolumeSlider)musicVolumeSlider.value=String(glMusicVolume);
  if(musicVolumeValue)musicVolumeValue.textContent=glMusicVolume+'%';
  try{window.localStorage?.setItem(GL_S0_MUSIC_VOLUME_KEY,String(glMusicVolume))}catch(_){}
}
function glMusicGameplayActive(){
  // Lobby, deck setup and Coin Flip never play BGM, even with saved Music ON.
  // Opening animations are also pre-game; start after they complete.
  return !lobbyIsOpen && !coinOverlay.classList.contains('open') &&
    !openingPresentationActive && matchStartedAt>0 && !!st();
}
function syncS0MusicForGameState(){
  if(!glBackgroundMusic)return;
  if(!glMusicEnabled||!glMusicGameplayActive()){
    if(!glBackgroundMusic.paused)glBackgroundMusic.pause();
    return;
  }
  if(glBackgroundMusic.paused){
    try{const p=glBackgroundMusic.play();if(p&&typeof p.catch==='function')p.catch(()=>{});}catch(_){}
  }
}
function playS0BackgroundMusic(){syncS0MusicForGameState();}
function setS0MusicEnabled(enabled){
  glMusicEnabled=!!enabled;
  try{window.localStorage?.setItem(GL_S0_MUSIC_STORAGE_KEY,glMusicEnabled?'on':'off')}catch(_){}
  if(musicSwitch)musicSwitch.checked=glMusicEnabled;
  syncS0MusicForGameState();
}
function closeSoundSettings(){if(!soundPanel||!soundBtn)return;soundPanel.hidden=true;soundBtn.setAttribute('aria-expanded','false')}
function syncSoundButton(){
  if(!soundBtn)return;
  soundBtn.textContent='Sound';
  if(musicSwitch)musicSwitch.checked=glMusicEnabled;
  if(musicVolumeSlider)musicVolumeSlider.value=String(glMusicVolume);
  if(musicVolumeValue)musicVolumeValue.textContent=glMusicVolume+'%';
  if(sfxSwitch)sfxSwitch.checked=E()?.getSoundEnabled?.()!==false;
}
function initSoundSettings(){
  if(!soundBtn||!soundPanel)return;
  soundBtn.onclick=e=>{e.stopPropagation();const open=soundPanel.hidden;soundPanel.hidden=!open;soundBtn.setAttribute('aria-expanded',open?'true':'false')};
  musicSwitch.onchange=()=>setS0MusicEnabled(musicSwitch.checked);
  if(musicVolumeSlider)musicVolumeSlider.oninput=()=>setS0MusicVolume(musicVolumeSlider.value);
  sfxSwitch.onchange=()=>{E()?.setSoundEnabled?.(sfxSwitch.checked);syncSoundButton()};
  document.addEventListener('pointerdown',e=>{if(!soundControl.contains(e.target))closeSoundSettings()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!soundPanel.hidden)closeSoundSettings()});
  // If a stored ON setting encounters browser autoplay blocking, a real gesture can unlock it.
  document.addEventListener('pointerdown',playS0BackgroundMusic,{passive:true});
  syncSoundButton();
}

function closeLobbyProgression(){progressionOverlay.classList.remove('open');progressionOverlay.querySelector('.gl-progression-row').innerHTML='';}
progressionOverlay.querySelector('.gl-progression-close').onclick=closeLobbyProgression;
progressionOverlay.addEventListener('click',e=>{if(e.target===progressionOverlay)closeLobbyProgression()});
function openLobbyHeroProgression(side,rankOneId){
  const data=E()?.getHeroProgression?.(side,rankOneId),ids=(data?.ids||[]).slice(0,3);
  if(ids.length<3){lobbyErrorText='The selected Hero package is incomplete.';renderLobby();return;}
  // Deck Builder v1.58 Hero Review + inline HERO LINEAGES footer, not a second progression modal.
  closeLobbyProgression();
  openCardReview(ids[0],{lobbyLineageIds:ids});
}
function deckFormationHtml(side){
  const view=E()?.getLobbyFormationView?.(side)||{rank:1,lanes:{}},parts=[];
  laneOrder.forEach((lane,index)=>{const row=view.lanes?.[lane]||{},id=row.previewId||row.rankOneId||'',v=cv(id),r1=row.rankOneId||id;parts.push('<article class="gl-lobby-hero"><button type="button" data-lobby-progression-side="'+esc(side)+'" data-lobby-progression="'+esc(r1)+'" aria-label="View '+esc(lane)+' Hero Progression">'+(id?'<img src="'+cardArtwork.first(art(id))+'" alt="'+esc(v?.name||id)+'">':'<span class="gl-lobby-hero-empty">—</span>')+'</button><small>'+(lane.charAt(0)+lane.slice(1).toLowerCase())+'</small></article>');if(index<laneOrder.length-1){const next=laneOrder[index+1];parts.push('<button class="gl-lobby-swap" type="button" data-lobby-swap-side="'+esc(side)+'" data-lobby-swap-left="'+lane+'" data-lobby-swap-right="'+next+'" aria-label="Swap '+lane+' and '+next+'"><img src="engine/assets/lobby/Swap.png" alt="" aria-hidden="true"></button>')}});
  return '<div class="gl-lobby-formation">'+parts.join('')+'</div><div class="gl-lobby-rank-control" data-lobby-rank-side="'+esc(side)+'"><button type="button" data-lobby-rank-delta="-1" data-lobby-rank-side="'+esc(side)+'" aria-label="Previous rank">‹</button><strong>RANK '+['I','II','III'][Math.max(1,Math.min(3,Number(view.rank||1)))-1]+'</strong><button type="button" data-lobby-rank-delta="1" data-lobby-rank-side="'+esc(side)+'" aria-label="Next rank">›</button></div>';
}
function renderLobby(){
  syncS0MusicForGameState();
  if(!lobbyIsOpen){lobbyOverlay.classList.remove('open');return}
  lobbyOverlay.classList.add('open');appRoot?.classList.add('gl-lobby-hidden');
  const opts=B()?.getStarterDeckOptions?.()||{},state=E()?.getDeckSetupState?.()||{},difficulty=String(state.difficulty||E()?.getAIDifficulty?.()||'beginner'),keys=Object.keys(opts).slice(0,difficulty==='beginner'?3:5);
  const host=document.getElementById('glLobbyDecks'),err=document.getElementById('glLobbyError');if(!host||!err)return;err.textContent=lobbyErrorText||'';err.classList.toggle('show',!!lobbyErrorText);
  const sideBlock=(side,data)=>{const canImport=difficulty==='intermediate',selected=state.selectedDeckKey?.[side]||keys[0]||'',imported=canImport&&selected==='IMPORTED',optionHtml=keys.map(k=>'<option value="'+esc(k)+'" '+(selected===k?'selected':'')+'>'+esc(opts[k]?.label||k)+'</option>').join('')+(imported?'<option value="IMPORTED" selected>'+esc(data?.deck_name||'Imported Deck')+'</option>':'');const importControl=canImport?'<button class="gl-lobby-desktop-import" type="button" data-lobby-import="'+side+'">Import Deck</button><input type="file" data-lobby-file="'+side+'" accept="application/json,.json" hidden>':'';return '<section class="gl-lobby-deck" data-lobby-side="'+side+'"><header><h2>'+(side==='PLAYER'?'Player Deck':'AI Deck')+'</h2><span class="gl-lobby-valid">VALID</span></header><div class="gl-lobby-picker"><select aria-label="'+(side==='PLAYER'?'Player':'AI')+' deck selector" data-lobby-select="'+side+'">'+optionHtml+'</select>'+importControl+'</div>'+deckFormationHtml(side)+'</section>'};
  // Cache the desired markup, not live HTML (the loader upgrades src in-place).
  // Keep the opposite deck's DOM unchanged; keep same-side image nodes when
  // their Hero identity has not changed, even during rank/formation changes.
  for(const [side,data] of [['PLAYER',state.player],['AI',state.ai]]){
    const html=sideBlock(side,data), prior=host.querySelector('[data-lobby-side="'+side+'"]');
    if(prior?.__glLobbyMarkup===html)continue;
    const template=document.createElement('template');template.innerHTML=html;
    const next=template.content.firstElementChild;next.__glLobbyMarkup=html;
    if(prior){
      const available=new Map([...prior.querySelectorAll('.gl-lobby-hero img')].map(img=>[cardArtwork.id(cardArtwork.original(img)),img]));
      next.querySelectorAll('.gl-lobby-hero img').forEach(img=>{
        const key=cardArtwork.id(img.getAttribute('src')),reuse=available.get(key);
        if(reuse){img.replaceWith(reuse);available.delete(key);}
      });
      prior.replaceWith(next);
    }else host.appendChild(next);
  }
  host.querySelectorAll('[data-lobby-select]').forEach(sel=>sel.onchange=()=>{const side=sel.dataset.lobbySelect,r=E().selectDeck?.(side,sel.value);if(!r?.ok)lobbyErrorText=r?.error||'Could not select deck.';else lobbyErrorText='';renderLobby()});
  host.querySelectorAll('[data-lobby-import]').forEach(btn=>btn.onclick=()=>{
    if(difficulty!=='intermediate')return;
    const side=btn.dataset.lobbyImport;
    host.querySelector('[data-lobby-file="'+side+'"]')?.click();
  });
  host.querySelectorAll('[data-lobby-file]').forEach(inp=>inp.onchange=()=>{const f=inp.files?.[0];if(!f)return;const side=inp.dataset.lobbyFile;if(difficulty!=='intermediate'){lobbyErrorText='Custom deck import requires Intermediate difficulty.';renderLobby();return;}const reader=new FileReader();reader.onload=()=>{try{const raw=JSON.parse(String(reader.result||'')),r=E().importDeck?.(side,raw);if(!r?.ok)throw new Error(r?.error||'Invalid deck file.');lobbyErrorText='';renderLobby()}catch(err){lobbyErrorText=String(err?.message||err);renderLobby()}};reader.onerror=()=>{lobbyErrorText='Could not read the selected deck file.';renderLobby()};reader.readAsText(f);inp.value=''});
  host.querySelectorAll('[data-lobby-swap-left]').forEach(btn=>btn.onclick=()=>{E().swapLobbyFormation?.(btn.dataset.lobbySwapSide,btn.dataset.lobbySwapLeft,btn.dataset.lobbySwapRight);renderLobby()});
  host.querySelectorAll('[data-lobby-rank-delta]').forEach(btn=>btn.onclick=()=>{E().cycleLobbyRank?.(btn.dataset.lobbyRankSide,Number(btn.dataset.lobbyRankDelta||0));renderLobby()});
  host.querySelectorAll('[data-lobby-progression]').forEach(btn=>btn.onclick=()=>openLobbyHeroProgression(btn.dataset.lobbyProgressionSide,btn.dataset.lobbyProgression));
  lobbyOverlay.querySelectorAll('[data-gl-ai-diff]').forEach(btn=>{const active=btn.dataset.glAiDiff===difficulty;btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));btn.onclick=()=>{const r=B()?.setAIDifficulty?.(btn.dataset.glAiDiff,true);lobbyErrorText=r?.ok?'':(r?.error||'Could not select difficulty.');renderLobby()};});
  document.getElementById('glLobbyStart').onclick=startMatchFromLobby;
}
function coinFaceSrc(face){return String(face||'HEADS').toUpperCase()==='TAILS'?'assets/ui/Racial-Token-Tail.webp':'assets/ui/Racial-Token-Head.webp'}
function fairCoinOutcome(){try{const a=new Uint32Array(1);crypto.getRandomValues(a);return (a[0]&1)?'TAILS':'HEADS'}catch{return Math.random()<.5?'HEADS':'TAILS'}}
function renderCoinChoice(){
  openingCoinWinner=null;openingChosenOrder=null;openingFirstSide='PLAYER';
  if(openingAiDecisionTimer!==null){clearTimeout(openingAiDecisionTimer);openingAiDecisionTimer=null;}
  const body=coinOverlay.querySelector('.gl-coin-body');
  body.innerHTML='<p>Choose Heads or Tails. The winner chooses to go FIRST or SECOND.</p><div class="gl-coin-actions"><button type="button" data-coin-choice="HEADS"><img src="'+coinFaceSrc('HEADS')+'" alt="Heads"><span>Heads</span></button><button type="button" data-coin-choice="TAILS"><img src="'+coinFaceSrc('TAILS')+'" alt="Tails"><span>Tails</span></button></div>';
  body.querySelectorAll('[data-coin-choice]').forEach(btn=>btn.onclick=()=>runCoinFlip(btn.dataset.coinChoice));coinOverlay.classList.add('open');
}
function runCoinFlip(choice){
  openingChoice=choice==='TAILS'?'TAILS':'HEADS';openingOutcome=fairCoinOutcome();
  openingCoinWinner=openingChoice===openingOutcome?'PLAYER':'AI';openingChosenOrder=null;
  const body=coinOverlay.querySelector('.gl-coin-body');let face=openingOutcome==='HEADS'?'TAILS':'HEADS';
  body.innerHTML='<p>Flipping the coin...</p><div class="gl-coin-flip-stage"><img src="'+coinFaceSrc(face)+'" alt="Coin"></div>';
  const im=body.querySelector('img');let step=0;const totalSteps=8,halfDuration=72;B()?.playOpeningCoinSound?.();
  const runStep=()=>{
    if(step>=totalSteps){
      im.src=coinFaceSrc(openingOutcome);im.alt=openingOutcome==='HEADS'?'Heads':'Tails';im.style.transition='none';im.style.transform='translateY(0) scaleX(1)';
      const text=body.querySelector('p');if(text)text.textContent=(openingOutcome==='HEADS'?'Heads':'Tails')+'!';
      setTimeout(renderCoinResult,1000);return;
    }
    const progress=(step+1)/totalSteps,lift=Math.round(Math.sin(progress*Math.PI)*22);
    im.style.transition='transform '+halfDuration+'ms cubic-bezier(.45,0,.55,1)';im.style.transform='translateY(-'+lift+'px) scaleX(.04)';
    setTimeout(()=>{face=face==='HEADS'?'TAILS':'HEADS';im.src=coinFaceSrc(face);im.style.transition='transform '+halfDuration+'ms cubic-bezier(.2,.75,.3,1)';im.style.transform='translateY(-'+lift+'px) scaleX(1)';setTimeout(()=>{step++;runStep()},halfDuration)},halfDuration);
  };runStep();
}
function renderCoinResult(){
  if(!coinOverlay.classList.contains('open')||!openingCoinWinner||openingPresentationActive)return;
  const body=coinOverlay.querySelector('.gl-coin-body'),won=openingCoinWinner==='PLAYER';
  if(!won){
    openingChosenOrder=E()?.chooseOpeningTurnOrderForAI?.()||'FIRST';
    if(openingChosenOrder!=='SECOND')openingChosenOrder='FIRST';
    openingFirstSide=openingChosenOrder==='FIRST'?'AI':'PLAYER';
  }
  const winner='<div class="gl-coin-winner '+(won?'player-wins':'ai-wins')+'"><span>Winner</span><strong>'+(won?'You won the coin flip':'Local AI won the coin flip')+'</strong>'+(won?'<p>Choose whether to take the first or second turn.</p>':'')+'</div>';
  const art='<div class="gl-coin-result gl-coin-single-result"><img src="'+coinFaceSrc(openingOutcome)+'" alt="Coin result: '+(openingOutcome==='TAILS'?'Tails':'Heads')+'"></div>';
  const actions=won?'<div class="gl-coin-turn-actions"><button class="gl-coin-start" type="button" data-gl-coin-order="FIRST">Go First</button><button class="gl-coin-start" type="button" data-gl-coin-order="SECOND">Go Second</button></div>':
    '<p class="gl-coin-ai-decision">AI chose to <strong>Go '+openingChosenOrder.charAt(0)+openingChosenOrder.slice(1).toLowerCase()+'</strong></p>';
  body.innerHTML=winner+art+actions;
  body.querySelectorAll('[data-gl-coin-order]').forEach(btn=>btn.onclick=()=>chooseCoinTurnOrder(btn.dataset.glCoinOrder));
  if(!won){
    openingAiDecisionTimer=setTimeout(()=>{openingAiDecisionTimer=null;if(coinOverlay.classList.contains('open')&&!openingPresentationActive&&openingCoinWinner==='AI')beginOpeningPresentation();},1400);
  }
}
function chooseCoinTurnOrder(order){
  if(openingCoinWinner!=='PLAYER'||openingChosenOrder||!coinOverlay.classList.contains('open')||openingPresentationActive)return false;
  if(order!=='FIRST'&&order!=='SECOND')return false;
  openingChosenOrder=order;openingFirstSide=order==='FIRST'?'PLAYER':'AI';
  coinOverlay.querySelectorAll('[data-gl-coin-order]').forEach(btn=>{btn.disabled=true;});
  return beginOpeningPresentation();
}
// Result-only auto-return; never starts during gameplay or an unresolved action.
const GL_RESULT_AUTO_LOBBY_DELAY_MS=15000;
let glCompletedMatchRefreshTimer=null;
let glCompletedMatchCountdownTimer=null;
let glCompletedMatchRefreshDeadline=0;
function updateCompletedMatchCountdown(){
  const label=resultOverlay?.querySelector('.gl-result-countdown');
  if(!label||!glCompletedMatchRefreshDeadline)return;
  const seconds=Math.max(0,Math.ceil((glCompletedMatchRefreshDeadline-Date.now())/1000));
  label.textContent='Returning to Lobby in '+seconds+'s';
}
function cancelCompletedMatchRefresh(){
  if(glCompletedMatchRefreshTimer!==null){clearTimeout(glCompletedMatchRefreshTimer);glCompletedMatchRefreshTimer=null;}
  if(glCompletedMatchCountdownTimer!==null){clearInterval(glCompletedMatchCountdownTimer);glCompletedMatchCountdownTimer=null;}
  glCompletedMatchRefreshDeadline=0;
}
function scheduleCompletedMatchRefresh(s){
  if(!s?.gameOver||glCompletedMatchRefreshTimer!==null||lobbyIsOpen)return;
  glCompletedMatchRefreshDeadline=Date.now()+GL_RESULT_AUTO_LOBBY_DELAY_MS;
  glCompletedMatchRefreshTimer=setTimeout(()=>{
    if(!st()?.gameOver||lobbyIsOpen){cancelCompletedMatchRefresh();return;}
    returnToLobbyAfterResult();
  },GL_RESULT_AUTO_LOBBY_DELAY_MS);
  glCompletedMatchCountdownTimer=setInterval(updateCompletedMatchCountdown,250);
  updateCompletedMatchCountdown();
}
function resetPresentationState(){
  // F20: a genuinely new local match starts the Swap-notice sequence at zero.
  // Polling snapshots are clones, not new matches; they must NOT reset this cursor.
  glLastCardSwapNoticeSeq=0;
  glPresentationEpoch++;
  for(const batch of [...glTrialReturnBatches])batch.cancel();
  glTrialReturnBatches.clear();animationLayer.querySelectorAll('.gl-trial-exp-flight').forEach(x=>x.remove());
  if(expInspectorLocation)closeExpInspector();glPresentationActive=0;glPresentationBusyUntil=0;glRankPresentationRunning=0;if(openingAiDecisionTimer!==null){clearTimeout(openingAiDecisionTimer);openingAiDecisionTimer=null;}openingCoinWinner=null;openingChosenOrder=null;cancelCompletedMatchRefresh();seenCounterMessages.clear();seenRacialMessages.clear();seenManaLossMessages.clear();seenDiscardMessages.clear();shownCompletedCounterChains.clear();currentCounterChainId='';counterChainRenderedSig='';clearTimeout(counterChainHoldTimer);counterChainHoldTimer=null;counterChainBanner.classList.remove('show');counterChainBanner.replaceChildren();presentationNoticeQueue.length=0;presentationNoticeActive=false;clearTimeout(counterBannerTimer);counterBanner.classList.remove('show','is-racial','is-mana','is-discard','is-card-art');counterBanner.style.removeProperty('--gl-notice-duration');presentationPrimed=false;previousVisualState=null;glDeferredTrialRankTransitions.length=0;glTrialHandFlightKeys.clear();glManualTrialReturnEventIds.clear();glPresentedTrialReturnEventIds.clear();seenPresentationEvents.clear();resolvedHistory=[];historyKnown.clear();activeCardHold=null;glPendingDrawReservations.PLAYER.length=0;glPendingDrawReservations.AI.length=0;glHiddenCommittedDrawSlots.PLAYER.clear();glHiddenCommittedDrawSlots.AI.clear();glOpeningHiddenShardUids.clear();glExternalDrawSequence=Promise.resolve();glExternalManaDrawSequence=Promise.resolve();glExternallyPresentedShardUids.clear();resultShown=false;resultOverlay.classList.remove('open');syncMatchActionButton(null);closeLobbyProgression();resetMatchTimer()}
let glStartingLobby=false;
async function startMatchFromLobby(){
  if(glStartingLobby||!lobbyIsOpen)return;
  glStartingLobby=true;const start=document.getElementById('glLobbyStart');if(start)start.disabled=true;
  try{await cardArtwork.preloadAll();}finally{glStartingLobby=false;if(start)start.disabled=false;}
  if(!lobbyIsOpen)return;
  lobbyErrorText='';syncS0MusicForGameState();const r=E().prepareLocalMatch?.();if(!r?.ok){lobbyErrorText=r?.error||'Could not start match.';renderLobby();return}
  resetPresentationState();lobbyIsOpen=false;lobbyOverlay.classList.remove('open');appRoot?.classList.add('gl-lobby-hidden');renderCoinChoice();syncS0MusicForGameState();
}
function beginOpeningPresentation(){
  if(openingPresentationActive||!openingCoinWinner||(openingChosenOrder!=='FIRST'&&openingChosenOrder!=='SECOND')||!coinOverlay.classList.contains('open'))return false;
  if(openingAiDecisionTimer!==null){clearTimeout(openingAiDecisionTimer);openingAiDecisionTimer=null;}
  const r=E().commitOpeningSetup?.(openingChoice,openingOutcome,openingFirstSide,openingChosenOrder);if(!r?.ok){coinOverlay.querySelector('.gl-coin-body').innerHTML='<p>'+esc(r?.error||'Could not begin the match.')+'</p>';return}
  startMatchTimer();coinOverlay.classList.remove('open');openingPresentationActive=true;lastTurnBannerKey='';syncS0MusicForGameState();
  (r.handEvents||[]).forEach(e=>{if(e?.id)seenPresentationEvents.add(e.id);const side=e.side==='AI'?'AI':'PLAYER';if(side==='PLAYER'&&e.card_id)warmCardArtwork(e.card_id);glHiddenCommittedDrawSlots[side].set(Number(e.hand_index),String(e.id||side+'-'+e.hand_index))});
  (r.manaEvents||[]).forEach(e=>glOpeningHiddenShardUids.add((e.side==='AI'?'AI':'PLAYER')+'|'+String(e.uid)));
  handRenderKey='';opponentHandRenderKey='';manaRenderKey='';renderNow();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{syncPlayerManaPoolToHeroLeft();syncPlayerHandToHeroCenter();syncOpponentHand();appRoot?.classList.remove('gl-lobby-hidden');runOpeningHandGroups(r.handEvents||[],r.manaEvents||[])}));
}
function runPairMotions(parts,duration,done){let left=parts.length;if(!left){done();return}parts.forEach((part,i)=>{const finish=()=>{left--;if(left<=0)done()};if(!flyBetween(part.src,part.from,part.to,duration,finish,i===0,false,part.front||null))finish()})}
function runOpeningHandGroups(events,manaEvents){
  const groups=[];for(let i=0;i<6;i++)groups.push((events||[]).filter(e=>Number(e.group_index)===i));let gi=0;
  const next=()=>{if(gi>=groups.length){runOpeningShardGroups(manaEvents);return}const group=groups[gi++],parts=[];group.forEach(e=>{const side=e.side==='AI'?'AI':'PLAYER',hand=side==='PLAYER'?playerHandTrack:oppHandTrack,to=hand?.querySelector('.hand-card[data-hand-index="'+Number(e.hand_index)+'"]'),from=zoneEl(side,'Main Deck');parts.push({src:'assets/ui/back-main.webp',front:side==='PLAYER'&&e.card_id?art(e.card_id):null,from:from?.querySelector('.zoneCard')||from,to});});runPairMotions(parts,220,()=>{group.forEach(e=>glHiddenCommittedDrawSlots[e.side==='AI'?'AI':'PLAYER'].delete(Number(e.hand_index)));handRenderKey='';opponentHandRenderKey='';renderHand(st());renderOpponentHand(st());requestAnimationFrame(()=>setTimeout(next,20))})};next();
}
function runOpeningShardGroups(events){
  const groups=[];for(let i=0;i<3;i++)groups.push((events||[]).filter(e=>Number(e.group_index)===i));let gi=0;
  const next=()=>{if(gi>=groups.length){glOpeningHiddenShardUids.clear();manaRenderKey='';renderMana();requestAnimationFrame(()=>setTimeout(()=>{previousVisualState=visualStateOf(st());presentationPrimed=true;openingPresentationActive=false;E().beginFirstTurn?.(openingFirstSide);syncS0MusicForGameState();setTimeout(renderNow,0)},180));return}const group=groups[gi++],parts=[];group.forEach(e=>{const side=e.side==='AI'?'AI':'PLAYER',host=side==='PLAYER'?playerManaHost:aiManaHost,to=host?.querySelector('.mana-card[data-uid="'+CSS.escape(String(e.uid))+'"]'),from=zoneEl(side,'Shard Deck');parts.push({src:'assets/ui/back-shard.webp',from:from?.querySelector('.zoneCard')||from,to});});runPairMotions(parts,220,()=>{group.forEach(e=>glOpeningHiddenShardUids.delete((e.side==='AI'?'AI':'PLAYER')+'|'+String(e.uid)));manaRenderKey='';renderMana();requestAnimationFrame(()=>setTimeout(next,20))})};next();
}
function visualStateOf(s){
  const hero={};for(const side of ['PLAYER','AI']){hero[side]={};for(const lane of laneOrder){const h=sideHeroes(s,side)?.[lane];hero[side][lane]={card_id:h?.card_id||'',image_id:heroImageId(h)||'',legacy:!!h?.legacy_mode,hp:Number(h?.hp||0),exp_cards:Array.isArray(h?.exp_cards)?h.exp_cards.slice():[]}}}
  return{turn:s.turn,round:Number(s.round||1),phase:s.phase,hero,discard:{PLAYER:(s.playerDiscard||[]).slice(),AI:(s.aiDiscard||[]).slice()},playerMana:(s.playerManaPoolCards||[]).map(x=>String(x.uid)),aiMana:(s.aiManaPoolCards||[]).map(x=>String(x.uid)),presentation:(s.presentationEvents||[]).map(x=>cloneLite(x)).filter(Boolean)};
}
function multisetAdded(before,after){const counts=new Map();(before||[]).forEach(id=>counts.set(String(id),(counts.get(String(id))||0)+1));const out=[];(after||[]).forEach(id=>{const k=String(id),n=counts.get(k)||0;if(n>0)counts.set(k,n-1);else out.push(id)});return out;}
function battlefieldPresentationBusy(){return glRankPresentationRunning>0||glPresentationActive>0||Date.now()<glPresentationBusyUntil;}
function flyBetween(src,fromEl,toEl,duration=380,onFinish,playSound=true,ghost=false,frontSrc=null){
  if(!src||!fromEl||!toEl)return false;const fr=uiRect(fromEl),tr=uiRect(toEl);if(fr.width<1||tr.width<1)return false;
  glPresentationActive++;glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+60);
  // Only the local player's DRAW has a front. A separate inner face allows
  // a physical 3D card flip without interrupting the outer flight transform.
  const artworkReady=frontSrc?warmCardArtwork(frontSrc):null;
  const reveal=!!(frontSrc&&!ghost),flyer=reveal?document.createElement('span'):document.createElement('img');
  flyer.className='gl-flying-card'+(ghost?' gl-return-ghost':'')+(reveal?' gl-draw-flip-flight':'');
  const im=reveal?document.createElement('img'):flyer;
  setCardArtwork(im,src);im.alt='';if(reveal)flyer.appendChild(im);
  const start=mobileFlightRect(fr),end=mobileFlightRect(tr);
  if(ghost)flyer.style.opacity='.55';flyer.style.left=start.left+'px';flyer.style.top=start.top+'px';flyer.style.width=start.width+'px';flyer.style.height=start.height+'px';animationLayer.appendChild(flyer);
  if(playSound)E()?.playCardMotionSound?.();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{flyer.style.transition='translate '+duration+'ms cubic-bezier(.2,.75,.2,1),opacity '+duration+'ms ease,width '+duration+'ms ease,height '+duration+'ms ease';flyer.style.translate=(end.left-start.left)+'px '+(end.top-start.top)+'px';flyer.style.width=end.width+'px';flyer.style.height=end.height+'px';flyer.style.opacity=ghost?'.42':'.88'}));
  if(reveal){
    const half=Math.max(35,Math.min(65,Math.round(duration*.17))),start=Math.max(25,Math.round(duration*.38));
    const launchedAt=performance.now();
    setTimeout(()=>{
      // Only reveal after the bundled thumbnail has decoded. Full-size network
      // loading must not delay a reveal, and landing Hand cards never use a back placeholder.
      artworkReady.then(ok=>{
        if(!ok||!flyer.isConnected||performance.now()-launchedAt>duration-2*half-16)return;
        im.style.transition='transform '+half+'ms ease-in';im.style.transform='rotateY(90deg)';
        setTimeout(()=>{
          if(!flyer.isConnected)return;
          setCardArtwork(im,frontSrc);im.style.transition='none';im.style.transform='rotateY(-90deg)';void im.offsetWidth;
          im.style.transition='transform '+half+'ms ease-out';im.style.transform='rotateY(0deg)';
        },half);
      });
    },start);
  }
  setTimeout(()=>{flyer.remove();glPresentationActive=Math.max(0,glPresentationActive-1);glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+60);if(typeof onFinish==='function')onFinish(true)},duration+20);return true;
}
function flyPublicSelectedPickup(event,fromEl,toEl,onFinish){
  if(!event?.card_id||!toEl)return false;
  const from=fromEl&&uiRect(fromEl),target=uiRect(toEl),vw=window.innerWidth,vh=window.innerHeight;
  if(!target||target.width<1||target.height<1)return false;
  const side=event.side==='AI'?'AI':'PLAYER',epoch=glPresentationEpoch;
  const width=Math.min(146,Math.max(90,Math.round(vw*.12))),height=Math.round(width*1.4);
  const rotated=isRotatedMobileGameplay();
  const visualW=rotated?height:width,visualH=rotated?width:height;
  const visualLeft=Math.max(10,Math.min(vw-visualW-10,target.left+target.width/2-visualW/2));
  const preferred=side==='AI'?target.bottom+20:target.top-visualH-20;
  const visualTop=Math.max(8,Math.min(vh-visualH-8,preferred));
  const hold=mobileFlightRect({left:visualLeft,top:visualTop,width:visualW,height:visualH});
  const origin=from&&from.width>=1?from:{left:target.left,top:target.top,width:target.width,height:target.height};
  glPresentationActive++;glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+3200);
  const img=document.createElement('img');img.className='gl-flying-card gl-public-pickup-reveal';setCardArtwork(img,art(event.card_id));img.alt='';img.draggable=false;
  const launch=mobileFlightRect(origin);img.style.left=launch.left+'px';img.style.top=launch.top+'px';img.style.width=launch.width+'px';img.style.height=launch.height+'px';
  img.style.transform='rotateY(0deg)';animationLayer.appendChild(img);
  E()?.playCardMotionSound?.();
  const isCurrent=()=>epoch===glPresentationEpoch;
  const later=(delay,fn)=>setTimeout(()=>{if(!isCurrent()){img.remove();return;}fn();},delay);
  let settled=false;
  const finish=()=>{if(settled)return;settled=true;img.remove();if(!isCurrent())return;
    glPresentationActive=Math.max(0,glPresentationActive-1);glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+60);
    if(typeof onFinish==='function')onFinish();};
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(!isCurrent())return;
    img.style.transition='left 350ms ease,top 350ms ease,width 350ms ease,height 350ms ease,transform 180ms ease';
    img.style.left=hold.left+'px';img.style.top=hold.top+'px';img.style.width=hold.width+'px';img.style.height=hold.height+'px';
  }));
  // Hold 2,000ms after arriving, not including travel or flip duration.
  later(2350,()=>{
    img.style.transition='transform 150ms ease';img.style.transform='rotateY(90deg)';
    later(155,()=>{
      img.src='assets/ui/back-main.webp';img.style.transition='none';img.style.transform='rotateY(-90deg)';
      void img.offsetWidth;
      img.style.transition='transform 150ms ease';img.style.transform='rotateY(0deg)';
      later(165,()=>{
        const final=mobileFlightRect(uiRect(toEl)||target);
        img.style.transition='left 320ms ease,top 320ms ease,width 320ms ease,height 320ms ease,opacity 320ms ease';
        img.style.left=final.left+'px';img.style.top=final.top+'px';img.style.width=Math.max(1,final.width)+'px';img.style.height=Math.max(1,final.height)+'px';img.style.opacity='.74';
        later(345,finish);
      });
    });
  });
  return true;
}
function flyToHeroOrientation(src,fromEl,toEl,side,lane,duration=390,onFinish,playSound=true){
  if(!src||!fromEl||!toEl)return false;
  const fr=uiRect(fromEl),tr=uiRect(toEl);
  if(fr.width<1||fr.height<1||tr.width<1||tr.height<1)return false;
  const h=sideHeroes(st(),side)?.[lane],exhausted=!!h?.exhausted;
  const tcx=tr.left+tr.width/2,tcy=tr.top+tr.height/2;
  // The flying card remains the moving object.  For an Exhausted Hero the card
  // rotates smoothly to landscape while preserving the destination's visual box.
  // Using final left/top (rather than a center delta while width/height change)
  // prevents the clone from jumping off-target or disappearing on landscape Heroes.
  const rotated=isRotatedMobileGameplay();
  const targetW=rotated?(exhausted?Math.max(1,tr.width):Math.max(1,tr.height)):(exhausted?Math.max(1,tr.height):Math.max(1,tr.width));
  const targetH=rotated?(exhausted?Math.max(1,tr.height):Math.max(1,tr.width)):(exhausted?Math.max(1,tr.width):Math.max(1,tr.height));
  const targetLeft=tcx-targetW/2,targetTop=tcy-targetH/2,rot=exhausted?-90:0;
  glPresentationActive++;glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+60);
  const im=document.createElement('img');
  const launch=mobileFlightRect(fr);im.className='gl-flying-card';setCardArtwork(im,src);im.style.left=launch.left+'px';im.style.top=launch.top+'px';im.style.width=launch.width+'px';im.style.height=launch.height+'px';im.style.transform='rotate(0deg)';im.style.transformOrigin='center center';
  animationLayer.appendChild(im);if(playSound)E()?.playCardMotionSound?.();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    im.style.transition='left '+duration+'ms cubic-bezier(.2,.75,.2,1),top '+duration+'ms cubic-bezier(.2,.75,.2,1),transform '+duration+'ms cubic-bezier(.2,.75,.2,1),opacity '+duration+'ms ease,width '+duration+'ms ease,height '+duration+'ms ease';
    im.style.left=targetLeft+'px';im.style.top=targetTop+'px';im.style.width=targetW+'px';im.style.height=targetH+'px';im.style.transform='rotate('+rot+'deg)';im.style.opacity='.78';
  }));
  setTimeout(()=>{im.remove();glPresentationActive=Math.max(0,glPresentationActive-1);glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+60);if(typeof onFinish==='function')onFinish(true)},duration+24);return true;
}
// The Hand flex fan expands when a Return EXP card is appended. Animate
// existing cards from their previous positions to the new layout so they do
// not snap sideways before the returned card arrives at its exact slot.
function snapshotHandPositions(side){
  const host=side==='AI'?oppHandTrack:playerHandTrack;
  return [...(host?.querySelectorAll(':scope > .hand-card')||[])].map(c=>{
    const r=uiRect(c);return r?{left:r.left,top:r.top,width:r.width,height:r.height}:null;
  });
}
function animateHandExpansion(side,before,duration=440){
  if(!Array.isArray(before)||!before.length)return;
  const host=side==='AI'?oppHandTrack:playerHandTrack,
    cards=[...(host?.querySelectorAll(':scope > .hand-card')||[])];
  cards.slice(0,before.length).forEach((c,i)=>{
    const prev=before[i],next=uiRect(c);if(!prev||!next)return;
    const dx=prev.left-next.left,dy=prev.top-next.top;
    if(Math.abs(dx)<.8&&Math.abs(dy)<.8)return;
    // The independent CSS translate property preserves the card's authored
    // rotate()/fan transform. Animating transform would cancel that rotation.
    try{c.animate([{translate:dx+'px '+dy+'px'},{translate:'0px 0px'}],
      {duration,easing:'cubic-bezier(.22,.72,.2,1)'}).finished.catch(()=>{});}catch{}
  });
}
function trialFlightKey(side,index){return (side==='AI'?'AI':'PLAYER')+'|'+Number(index);}
// The source popup is removed as soon as the Rank Up choice commits. Capture
// its exact screen rectangle first and reuse it as the animation origin.
function virtualFlightSource(rect){return {getBoundingClientRect:()=>rect};}
// Shared by deferred Rank Up VFX and the manual popup-to-Hand flights.
function revealTrialReturnSlot(e){
  if(!e)return;
  const side=e.side==='AI'?'AI':'PLAYER',idx=Number(e.hand_index),host=side==='AI'?oppHandTrack:playerHandTrack;
  glHiddenCommittedDrawSlots[side].delete(idx);
  const slot=host?.querySelector('.hand-card[data-hand-index="'+idx+'"]');
  if(slot){
    // The committed slot was already laid out before the flight began. Just
    // reveal it; rebuilding the entire fan here caused a sideways snap.
    slot.classList.remove('gl-presentation-hidden');
  }else{
    // Defensive fallback if another mechanic replaced the Hand meanwhile.
    invalidateHandRender(side);renderHand(st());renderOpponentHand(st());
  }
}
// One animation frame, one timer, and one reveal for every returned EXP Card.
// Per-card flyBetween() callbacks were independently scheduled, and an unrelated
// 120ms render could rebuild Hand nodes between their completions. On busy
// machines this looked random (Rank II vs III and Player vs AI).
function runAtomicTrialReturnBatch(side,items,onComplete){
  side=side==='AI'?'AI':'PLAYER';
  const hand=side==='AI'?oppHandTrack:playerHandTrack;
  const epoch=glPresentationEpoch;
  const arrivals=(items||[]).filter(x=>Number.isInteger(Number(x.hand_index))&&Number(x.hand_index)>=0);
  let settled=false,timer=null,active=0,clones=[];
  const batch={cancel:()=>finish(true),complete:()=>finish(false)};glTrialReturnBatches.add(batch);
  const finish=(cancelled=false)=>{
    if(settled)return;settled=true;clearTimeout(timer);
    clones.forEach(x=>x.remove());glPresentationActive=Math.max(0,glPresentationActive-active);
    glTrialReturnBatches.delete(batch);
    if(cancelled||epoch!==glPresentationEpoch)return;
    // The Hand may have been re-rendered by the engine since launch; reveal
    // CURRENT slots, not stale DOM references captured at flight start.
    // Clear all locks BEFORE touching any DOM nodes, as a single transaction.
    arrivals.forEach(item=>{
      const idx=Number(item.hand_index);
      const token=String(glHiddenCommittedDrawSlots[side].get(idx)||'');
      if(token.startsWith('TRIAL-'))glHiddenCommittedDrawSlots[side].delete(idx);
      glTrialHandFlightKeys.delete(trialFlightKey(side,idx));
    });
    const cards=[...(hand?.querySelectorAll(':scope > .hand-card[data-hand-index]')||[])];
    cards.forEach(card=>{
      if(arrivals.some(item=>Number(item.hand_index)===Number(card.dataset.handIndex)) &&
         !glHiddenCommittedDrawSlots[side].has(Number(card.dataset.handIndex)))
        card.classList.remove('gl-presentation-hidden');
    });
    // Rebuild only if an expected destination was replaced during the motion.
    if(arrivals.some(item=>!cards.some(card=>Number(card.dataset.handIndex)===Number(item.hand_index)))){
      invalidateHandRender(side);if(side==='AI')renderOpponentHand(st());else renderHand(st());
    }
    if(side==='AI')syncOpponentHand();else syncPlayerHandToHeroCenter();
    glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+70);
    if(typeof onComplete==='function')onComplete();
  };
  if(!arrivals.length){finish();return batch}
  // A hidden tab may throttle requestAnimationFrame indefinitely. Keep the
  // gameplay state and Hand visibility consistent when visibility changes.
  if(document.hidden||window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){
    requestAnimationFrame(()=>finish(false));
    setTimeout(()=>finish(false),45);return batch;
  }
  // Some Hand layouts change on the next render tick after Rank Up. Do not
  // start only 1 of 2/3 flights when one destination is briefly absent or
  // zero-sized: the incomplete batch was another intermittent failure mode.
  // Retry the COMPLETE geometry snapshot, never individual cards.
  let geometryAttempts=0;
  const startWhenReady=()=>{
    if(settled||epoch!==glPresentationEpoch)return;
    if(side==='AI')syncOpponentHand();else syncPlayerHandToHeroCenter();
    const movements=[],missing=[];
    for(const item of arrivals){
      const target=hand?.querySelector('.hand-card[data-hand-index="'+Number(item.hand_index)+'"]');
      const from=item.from,fr=uiRect(from),to=uiRect(target);
      if(!fr||!to||fr.width<1||fr.height<1||to.width<1||to.height<1){missing.push(item);continue;}
      movements.push({src:item.src||((side==='AI')?'assets/ui/back-main.webp':art(item.card_id)),fr:mobileFlightRect(fr),to:mobileFlightRect(to)});
    }
    if(missing.length){
      // Recover the final Hand nodes if the periodic renderer replaced them.
      // Keep every committed return hidden throughout retries.
      if(++geometryAttempts<=6){
        if(geometryAttempts===2){invalidateHandRender(side);if(side==='AI')renderOpponentHand(st());else renderHand(st());}
        requestAnimationFrame(startWhenReady);return;
      }
      // If rendering truly cannot produce a destination, never strand an
      // invisible card or leave the game waiting on an animation callback.
      finish(false);return;
    }
    const duration=440,fragment=document.createDocumentFragment();
    movements.forEach(m=>{
      const im=document.createElement('img');im.className='gl-flying-card gl-trial-exp-flight';
      setCardArtwork(im,m.src);im.style.left=m.fr.left+'px';im.style.top=m.fr.top+'px';
      im.style.width=m.fr.width+'px';im.style.height=m.fr.height+'px';
      im.style.translate='0px 0px';fragment.appendChild(im);clones.push(im);
    });
    animationLayer.appendChild(fragment);active=clones.length;
    glPresentationActive+=active;glPresentationBusyUntil=Math.max(glPresentationBusyUntil,Date.now()+duration+70);
    E()?.playCardMotionSound?.();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(settled||epoch!==glPresentationEpoch)return;
      // A single requestAnimationFrame writes all destinations. No stagger.
      movements.forEach((m,i)=>{
        const im=clones[i];im.style.transition='translate '+duration+'ms cubic-bezier(.2,.75,.2,1),opacity '+duration+'ms ease,width '+duration+'ms ease,height '+duration+'ms ease';
        im.style.translate=(m.to.left-m.fr.left)+'px '+(m.to.top-m.fr.top)+'px';
        im.style.width=m.to.width+'px';im.style.height=m.to.height+'px';im.style.opacity='.76';
      });
      // Start the ONE completion timer only after the ONE animation frame
      // actually starts. Slow displays previously revealed too early.
      timer=setTimeout(()=>finish(false),duration+55);
    }));
  };
  requestAnimationFrame(startWhenReady);
  return batch;
}
function animateTrialExpChoiceCommit(p,cardsHost,discardTarget){
  if(centerChoiceBusy||p?.type!=='trial_rankup_return_exp')return false;
  const side=p.side==='AI'?'AI':'PLAYER',
    all=[...cardsHost.querySelectorAll('.gl-center-choice-card')],
    selected=[...new Set((p.selected_indices||[]).map(Number))].sort((a,b)=>Number(p.candidates?.[b]?.discard_index??0)-Number(p.candidates?.[a]?.discard_index??0)),
    oldState=st(),oldLength=(side==='AI'?oldState?.aiHand:oldState?.playerHand)?.length||0;
  if(selected.some(i=>!Number.isInteger(i)||i<0||i>=all.length))return false;
  const oldEventIds=new Set((oldState?.presentationEvents||[]).map(e=>e.id));
  const flights=all.map((el,i)=>{const r=uiRect(el);return {index:i,card_id:p.candidates?.[i]?.card_id,rect:r?{left:r.left,top:r.top,width:r.width,height:r.height}:null};});
  // Pre-lock the committed positions before calling the engine; after commit,
  // reconcile with its authoritative hand indices (never trust UI ordering).
  selected.forEach((_,i)=>{
    const idx=oldLength+i;glTrialHandFlightKeys.add(trialFlightKey(side,idx));
    glHiddenCommittedDrawSlots[side].set(idx,'TRIAL-SELECT-PENDING');
  });
  centerChoiceBusy=true;centerChoiceStage.classList.add('is-busy');
  const outcome=intent('handleChoiceConfirm',[]);
  if(outcome?.ok===false){
    selected.forEach((_,i)=>{const idx=oldLength+i;glTrialHandFlightKeys.delete(trialFlightKey(side,idx));glHiddenCommittedDrawSlots[side].delete(idx)});
    centerChoiceBusy=false;centerChoiceStage.classList.remove('is-busy');return false;
  }
  const returned=(st()?.presentationEvents||[]).filter(e=>e?.type==='TRIAL_EXP_RETURNED_TO_HAND'&&e.side===side&&e.lane===p.lane&&!oldEventIds.has(e.id)&&e.choice_animated);
  // The authoritative return events belong to the selector flight, even if
  // a deferred Rank Up plan processes them after the temporary Hand lock is
  // removed. Keep events in the plan so Rank Up can still distinguish returned
  // cards from discarded EXP in case its transition was already queued.
  returned.forEach(e=>{if(e.id)glManualTrialReturnEventIds.add(e.id)});
  const returnedItems=[];
  selected.forEach((sourceIndex,i)=>{
    const event=returned[i],idx=Number(event?.hand_index??oldLength+i);
    if(idx!==oldLength+i){glTrialHandFlightKeys.delete(trialFlightKey(side,oldLength+i));glHiddenCommittedDrawSlots[side].delete(oldLength+i);}
    glTrialHandFlightKeys.add(trialFlightKey(side,idx));glHiddenCommittedDrawSlots[side].set(idx,'TRIAL-SELECT-'+(event?.id||i));
    const flight=flights[sourceIndex];
    returnedItems.push({side,hand_index:idx,card_id:event?.card_id||flight?.card_id,
      src:art(event?.card_id||flight?.card_id),from:flight?.rect?virtualFlightSource(flight.rect):null});
  });
  // The pending selector is gone; put the new Hand in its final layout while
  // leaving every returned slot invisible until the entire batch lands.
  renderNow();
  const discarded=flights.filter(item=>!selected.includes(item.index));
  discarded.forEach((item,i)=>{
    if(!item.rect||!item.card_id)return;
    const from=virtualFlightSource(item.rect),to=discardTarget?.querySelector?.('.zoneCard')||discardTarget;
    flyBetween(art(item.card_id),from,to,300,null,i===0);
  });
  runAtomicTrialReturnBatch(side,returnedItems);
  return true;
}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)for(const batch of [...glTrialReturnBatches])batch.complete();
});
function queueBattlefieldTributeMotion(p,lane){
  if(!p||p.type!=='tribute_target'||!p.card_id||!Number.isInteger(Number(p.hand_index))||!lane)return false;
  const from=playerHandTrack?.querySelector('.hand-card[data-hand-index="'+Number(p.hand_index)+'"] .hand-art'),to=heroCardEl('PLAYER',lane);
  return flyToHeroOrientation(art(p.card_id),from,to,'PLAYER',lane,430,null,true);
}
function queueBattlefieldSourceExpMotion(p,lane){
  if(!p||p.type!=='card_search_choice'||p.resolve_to!=='source_exp'||!lane)return false;
  const idx=selectedChoiceIndex(p);if(idx==null)return false;
  const cand=(p.candidates||[])[Number(idx)]||{},handIndex=Number(cand.hand_index),cardId=cand.card_id||cand.id||'';
  if(!cardId||!Number.isInteger(handIndex))return false;
  const from=playerHandTrack?.querySelector('.hand-card[data-hand-index="'+handIndex+'"] .hand-art'),to=heroCardEl('PLAYER',lane);
  return flyToHeroOrientation(art(cardId),from,to,'PLAYER',lane,430,null,true);
}
function runTributeLikeHeroAction(p,side,lane){
  if(side!=='PLAYER'||!lane)return false;
  if(p?.type==='tribute_target'){
    queueBattlefieldTributeMotion(p,lane);
    intent('chooseHeroFromBoard',[side,lane]);
    return true;
  }
  if(directTributeHeroReady(p,side,lane)){
    queueBattlefieldSourceExpMotion(p,lane);
    intent('handleChoiceConfirm',[]);
    return true;
  }
  return false;
}
// COUNTERED and Racial Token notifications use one visual queue to avoid overlap.
// They are sourced only from committed presentation events, never from preview,
// pending choices, or an inferred drop in the token count.
function glPublicCardArtwork(cardId){
  const img=document.createElement('img');img.className='gl-public-card-art';img.draggable=false;
  setCardArtwork(img,art(cardId));img.alt=cv(cardId)?.name||'Card';img.title=img.alt;
  return img;
}
function showNextPresentationNotice(){
  if(presentationNoticeActive||!presentationNoticeQueue.length)return;
  const item=presentationNoticeQueue.shift();presentationNoticeActive=true;
  counterBanner.replaceChildren();
  const header=document.createElement('strong');header.textContent=item.title;
  counterBanner.append(header);
  if(item.kind==='card-art'){
    const gallery=document.createElement('div');gallery.className='gl-card-notice-gallery';
    item.cardIds.forEach(id=>gallery.appendChild(glPublicCardArtwork(id)));
    counterBanner.append(gallery);
  }
  if(item.detail){const desc=document.createElement('small');desc.textContent=item.detail;counterBanner.append(desc)}
  counterBanner.classList.toggle('is-racial',item.kind==='racial');
  counterBanner.classList.toggle('is-turn-player',item.kind==='turn'&&item.title==='YOUR TURN');
  counterBanner.classList.toggle('is-turn-ai',item.kind==='turn'&&item.title==='AI TURN');
  counterBanner.classList.toggle('is-mana',item.kind==='mana');
  counterBanner.classList.toggle('is-discard',item.kind==='discard');
  counterBanner.classList.toggle('is-card-art',item.kind==='card-art');
  const duration=Number(item.duration)||2000;
  counterBanner.style.setProperty('--gl-notice-duration',duration+'ms');
  counterBanner.classList.remove('show');void counterBanner.offsetWidth;counterBanner.classList.add('show');
  clearTimeout(counterBannerTimer);
  counterBannerTimer=setTimeout(()=>{
    counterBanner.classList.remove('show');presentationNoticeActive=false;
    showNextPresentationNotice();
  },duration);
}
function queuePresentationNotice(kind,title,detail,duration){
  presentationNoticeQueue.push({kind,title,detail,duration:2000});
  showNextPresentationNotice();
}
// Public-by-rule artwork only. The human UI is the PLAYER viewer, so show an
// AI Search/Return to the human opponent, never the Player's own acquisition.
// Draw Phase, ordinary Draw effects, and Opening Hand NEVER call this helper.
function queuePublicArtworkNotice(title,cardIds,detail){
  const ids=(cardIds||[]).filter(Boolean);if(!ids.length||!presentationPrimed||openingPresentationActive)return;
  presentationNoticeQueue.push({kind:'card-art',title,detail,cardIds:ids,duration:2700});
  showNextPresentationNotice();
}
// Render a committed chain as individual boxes, one per played card.
// The engine's cardPlayedCancelTraces records legal nesting and LIFO resolution.
function renderCounterChainNotification(state){
  if(!presentationPrimed||(typeof openingPresentationActive!=='undefined'&&openingPresentationActive))return;
  const traces=Object.values(state?.cardPlayedCancelTraces||{}).filter(t=>t&&Array.isArray(t.steps)&&t.steps.length>=2);
  if(!traces.length)return;
  traces.sort((a,b)=>Number(String(a.id||'').split('-').at(-1)||0)-Number(String(b.id||'').split('-').at(-1)||0));
  // A finished chain is shown once, rather than replayed on each 120ms render.
  const active=traces.filter(t=>!shownCompletedCounterChains.has(t.id));
  const trace=active.at(-1);
  if(!trace)return;
  const sig=trace.id+'|'+trace.steps.map(t=>t.side+':'+t.card_id+':'+t.outcome).join('|')+'|'+!!trace.complete;
  if(sig!==counterChainRenderedSig){
    counterChainRenderedSig=sig;currentCounterChainId=trace.id;
    const row=document.createElement('div');row.className='gl-counter-chain-row';
    trace.steps.forEach((step,index)=>{
      if(index){const link=document.createElement('span');link.className='gl-counter-chain-link';link.textContent='→';link.setAttribute('aria-label','Counter');row.appendChild(link);}
      const box=document.createElement('div');box.className='gl-counter-chain-card '+(step.side==='PLAYER'?'is-player':'is-ai');
      const name=cv(step.card_id)?.name||String(step.card_id||'Card');
      box.title=(step.outcome==='PENDING'?'Response pending':String(step.outcome))+' — '+name;
      box.setAttribute('aria-label',name);
      box.appendChild(glPublicCardArtwork(step.card_id));row.appendChild(box);
    });
    const title=document.createElement('div');title.className='gl-counter-chain-title';title.textContent='Chain Result';
    counterChainBanner.replaceChildren(title,row);counterChainBanner.classList.add('show');
    requestAnimationFrame(()=>{row.scrollLeft=row.scrollWidth;});
  }
  if(trace.complete&&!shownCompletedCounterChains.has(trace.id)){
    shownCompletedCounterChains.add(trace.id);
    clearTimeout(counterChainHoldTimer);
    // The latest committed Counter determines who acts next. The player who
    // made that last Counter needs the battlefield back sooner (1 second).
    // The other viewer gets 2 seconds to read the same Chain Result.
    // Standalone VS AI has one visible viewer: PLAYER; AI has no separate UI.
    const lastChainSide=trace.steps[trace.steps.length-1]?.side;
    const resultHoldMs=lastChainSide==='PLAYER'?1000:2000;
    counterChainHoldTimer=setTimeout(()=>{
      if(currentCounterChainId===trace.id){counterChainBanner.classList.remove('show');currentCounterChainId='';counterChainRenderedSig='';}
    },resultHoldMs);
  }else if(!trace.complete){clearTimeout(counterChainHoldTimer);counterChainHoldTimer=null;}
}
function showCommittedRacialBanner(evt){
  if(!evt||evt.type!=='RACIAL_TOKEN_USED'||Number(evt.token_cost||0)<=0)return;
  const by=evt.side==='PLAYER'?'You':(evt.side==='AI'?'AI':'Opponent'),
        ability=String(evt.ability_name||'Racial Trait'),count=Number(evt.token_cost);
  queuePresentationNotice('racial','RACIAL TRAIT!',by+' used '+ability+' · '+count+' Racial Token'+(count===1?'':'s')+' spent.',2000);
}
// Only authoritative, resolved PLAYER Mana loss events are presented.
// The payment/selection modal and its preview never trigger this banner.
function describeRemovedShards(shards){
  const colors={Warrior:'Red',Mage:'Blue',Archer:'Green',Cleric:'White',Thief:'Yellow'};
  const counts=new Map();
  (Array.isArray(shards)?shards:[]).forEach(sh=>{
    const label=sh?.kind==='CLASS'?(colors[sh.class_name]||sh.class_name||'Color')+' Mana Shard':'Regular Mana Shard';
    counts.set(label,(counts.get(label)||0)+1);
  });
  const parts=Array.from(counts.entries()).map(([label,count])=>{
    return count+' '+label+(count===1?'':'s');
  });
  return parts.length===2?parts.join(' and '):parts.length>2?parts.slice(0,-1).join(', ')+', and '+parts.at(-1):parts[0]||'';
}
function showCommittedManaLossBanner(evt){
  if(!evt||evt.type!=='MANA_LOSS_RESOLVED'||evt.side!=='PLAYER'||Number(evt.removed_count||0)<=0)return;
  const self=evt.loss_kind==='ABILITY_SPEND'&&evt.source_side==='PLAYER';
  // Keep the actual committed effect title (not a guessed Burn/Steal type).
  const effect=String(evt.effect_name||(self?'Ability':'Mana Removal'));
  const amount=describeRemovedShards(evt.removed_shards||[]);
  const desc=(self?'Spent ':'Removed ')+amount+'.';
  queuePresentationNotice('mana',effect,desc,2000);
}
function showCommittedDiscardBanner(evt){
  if(!evt||evt.type!=='CARDS_DISCARDED_RESOLVED')return;
  if(evt.source_card_id==='S0-THF-029'&&evt.from_zone==='HAND'&&
      evt.source_side!==evt.target_side){
    // A Plan-discarded card is public AFTER the authoritative action committed.
    // This is not a generic Discard Pile difference notification.
    queuePublicArtworkNotice('CALCULATED PLAN — DISCARD',evt.card_ids||[],
      'CARD DISCARDED FROM '+(evt.target_side==='AI'?'AI':'YOUR')+' HAND');
    return;
  }
  if(evt.target_side!=='PLAYER')return;
  const count=Number(evt.discard_count||(evt.card_names||[]).length||0);
  if(!count)return;
  const source=cv(evt.source_card_id)?.name||'Card Effect';
  const names=(evt.card_names||[]).join(', ');
  const zone=evt.from_zone==='EXP'?(String(evt.target_hero_name||'Hero')+"'s EXP"):
    evt.from_zone==='MAIN_DECK'?'your Main Deck':evt.from_zone==='FIELD'?'your Field':'your Hand';
  const desc=count===1?names+' discarded from '+zone+'.':
    count+' cards discarded from '+zone+': '+names+'.';
  queuePresentationNotice('discard',source,desc,2000);
}
function showNewCounterEvents(s){
  (s?.presentationEvents||[]).forEach(evt=>{
    if(!evt?.id)return;
    if(evt.type==='CARD_NEGATED'&&!seenCounterMessages.has(evt.id)){
      seenCounterMessages.add(evt.id); // The live horizontal chain is rendered from committed cardPlayedCancelTraces.
    }else if(evt.type==='RACIAL_TOKEN_USED'&&!seenRacialMessages.has(evt.id)){
      seenRacialMessages.add(evt.id);if(presentationPrimed)showCommittedRacialBanner(evt);
    }else if(evt.type==='MANA_LOSS_RESOLVED'&&!seenManaLossMessages.has(evt.id)){
      seenManaLossMessages.add(evt.id);if(presentationPrimed)showCommittedManaLossBanner(evt);
    }else if(evt.type==='CARDS_DISCARDED_RESOLVED'&&!seenDiscardMessages.has(evt.id)){
      seenDiscardMessages.add(evt.id);if(presentationPrimed)showCommittedDiscardBanner(evt);
    }
  });
  renderCounterChainNotification(s);
}
function showTurnBannerFor(s){const key=String(s.turn)+'|'+Number(s.round||1);if(openingPresentationActive||!s.turn||lastTurnBannerKey===key)return;lastTurnBannerKey=key;queuePresentationNotice('turn',s.turn==='PLAYER'?'YOUR TURN':'AI TURN','ROUND '+Number(s.round||1),2000);}
function buildPresentationPlan(s){
  showNewCounterEvents(s);
  const cur=visualStateOf(s),prev=previousVisualState,plan={draws:[],picks:[],returns:[],expReturns:[],shards:[],heroTransitions:[],moved:[]};
  if(openingPresentationActive){(cur.presentation||[]).forEach(e=>{if(e?.id&&e.reason==='OPENING_HAND')seenPresentationEvents.add(e.id)});previousVisualState=cur;return plan;}
  // Rank Up presentation is a committed engine transaction, not an inference
  // from two UI snapshots. That snapshot omits the just-Tributed EXP whenever
  // Tribute and Rank Up finish in the same engine step.
  (cur.presentation||[]).forEach(e=>{
    if(!e?.id||seenPresentationEvents.has(e.id))return;
    seenPresentationEvents.add(e.id);
    if(!presentationPrimed)return;
    if(e.type==='CARD_DRAWN'){plan.draws.push(e);if(e.side==='PLAYER'&&e.card_id)warmCardArtwork(e.card_id);}
    else if(e.type==='CARD_PUBLIC_PICKUP')plan.picks.push(e);
    else if(e.type==='CARD_RETURNED_TO_DECK')plan.returns.push(e);
    else if(e.type==='TRIAL_EXP_RETURNED_TO_HAND')plan.expReturns.push(e);
    else if(e.type==='RANK_UP_COMMITTED'&&e.side&&e.lane&&e.to_card_id)
      plan.heroTransitions.push({side:e.side,lane:e.lane,id:e.to_card_id,
        fromId:e.from_card_id||'',kind:'rank',rankUpId:e.id,
        expCardIds:Array.isArray(e.exp_card_ids)?e.exp_card_ids.slice():[]});
  });
  if(prev&&presentationPrimed){
    for(const side of ['PLAYER','AI']){const before=new Set(side==='PLAYER'?prev.playerMana:prev.aiMana),after=side==='PLAYER'?cur.playerMana:cur.aiMana;after.forEach(uid=>{if(!before.has(uid)){const key=side+'|'+String(uid);if(glExternallyPresentedShardUids.has(key))glExternallyPresentedShardUids.delete(key);else plan.shards.push({side,uid})}});
      const beforeById={},afterById={};
      for(const lane of laneOrder){
        const a=prev.hero[side][lane],b=cur.hero[side][lane];
        if(a?.image_id)beforeById[a.image_id]=lane;
        if(b?.image_id)afterById[b.image_id]=lane;
        if(b?.image_id&&a?.image_id!==b.image_id){
          const wasAlreadyOnField=laneOrder.some(prevLane=>prev.hero[side][prevLane]?.image_id===b.image_id);
          // Only Legacy arrivals are inferred from a state delta. Rank Up
          // carries its own RANK_UP_COMMITTED event with every EXP instance.
          if(b.legacy&&!a?.legacy&&!wasAlreadyOnField)
            plan.heroTransitions.push({side,lane,id:b.image_id,kind:'legacy'});
        }
      }
      Object.keys(afterById).forEach(id=>{if(beforeById[id]&&beforeById[id]!==afterById[id])plan.moved.push({side,lane:afterById[id]})});
    }
  }
  // A human Rank Up waits for the mandatory EXP selection before ANY Rank Up
  // VFX (old EXP -> Discard, new Hero arrival) begins. Tribute motion remains
  // separate and finishes normally while the selector is open.
  if(s.pending?.type==='trial_rankup_return_exp'){
    const p=s.pending;
    const wait=plan.heroTransitions.filter(x=>x.kind==='rank'&&x.side===(p.side||'PLAYER')&&x.lane===p.lane);
    if(wait.length){wait.forEach(x=>{x.selectorAnimated=true});glDeferredTrialRankTransitions.push(...wait);plan.heroTransitions=plan.heroTransitions.filter(x=>!wait.includes(x))}
  }else if(glDeferredTrialRankTransitions.length){
    plan.heroTransitions.unshift(...glDeferredTrialRankTransitions);glDeferredTrialRankTransitions=[];
  }
  (plan.expReturns||[]).forEach(e=>{
    const side=e.side==='AI'?'AI':'PLAYER',idx=Number(e.hand_index);
    if(Number.isInteger(idx)&&idx>=0)glHiddenCommittedDrawSlots[side].set(idx,'TRIAL-EXP-'+e.id);
  });
  // Same principle as VS AI's GL_HIDDEN_DRAW_TOKENS: keep every pre-existing
  // Hand card rendered, but hide only incoming committed draw slots in-place.
  (plan.draws||[]).forEach(e=>{
    const side=e.side==='AI'?'AI':'PLAYER',idx=Number(e.hand_index);
    if(Number.isInteger(idx)&&idx>=0)glHiddenCommittedDrawSlots[side].set(idx,String(e.id||side+'-'+idx));
  });
  // Public Search/Return pickups appear in Hand immediately. Do NOT mask
  // them as DRAW slots, animate a card flight, or change Opening Hand.
  // Other branches (ordinary Draw and Rank-Up) keep their RC40 behavior.
  previousVisualState=cur;if(!presentationPrimed)presentationPrimed=true;return plan;
}
function preparePresentationTargets(plan){

  (plan.shards||[]).forEach(x=>{const host=x.side==='PLAYER'?playerManaHost:aiManaHost;const el=host?.querySelector('.mana-card[data-uid="'+CSS.escape(String(x.uid))+'"]');if(el)el.classList.add('gl-presentation-deferred')});
  (plan.heroTransitions||[]).concat(glDeferredTrialRankTransitions).filter(x=>x.kind==='rank').forEach(x=>{
    const hero=heroCardEl(x.side,x.lane),lane=uiLaneElement(x.side,x.lane),pack=hero?.closest('.gl-hero-physical-stack');
    hero?.classList.add('gl-presentation-hidden');lane?.classList.add('gl-rank-transitioning');
    if(pack&&x.fromId&&!pack.querySelector(':scope > .gl-rank-old-hero')){const old=document.createElement('img');old.className='gl-rank-old-hero';setCardArtwork(old,art(x.fromId));old.alt='Previous Hero Rank';old.draggable=false;pack.appendChild(old)}
  });
}
function runPresentationPlan(plan,s){
  showTurnBannerFor(s);
  const picks=(plan.picks||[]).slice(),draws=(plan.draws||[]).slice(),expReturns=(plan.expReturns||[]).slice(),returns=(plan.returns||[]).flatMap(e=>Array.from({length:Math.min(24,Math.max(0,Math.floor(Number(e.count)||0)))},()=>({side:e.side}))),shards=(plan.shards||[]).slice(),rankTransitions=(plan.heroTransitions||[]).filter(x=>x.kind==='rank'),legacyTransitions=(plan.heroTransitions||[]).filter(x=>x.kind==='legacy');
  function runShardSequence(index){
    if(index>=shards.length){if(rankTransitions.length)glRankPresentationRunning=Math.max(0,glRankPresentationRunning-1);return;}
    const x=shards[index],from=zoneEl(x.side,'Shard Deck'),host=x.side==='PLAYER'?playerManaHost:aiManaHost,to=host?.querySelector('.mana-card[data-uid="'+CSS.escape(String(x.uid))+'"]');
    if(to){to.classList.remove('gl-presentation-deferred');to.classList.add('gl-presentation-hidden');layoutManaPoolCards(host)}
    const done=()=>{if(to)to.classList.remove('gl-presentation-hidden');layoutManaPoolCards(host);requestAnimationFrame(()=>setTimeout(()=>runShardSequence(index+1),28))};
    if(!flyBetween('assets/ui/back-shard.webp',from?.querySelector('.zoneCard')||from,to,390,done))done();
  }
  function runReturnSequence(index){
    if(index>=returns.length){runDrawSequence(0);return;}
    const side=returns[index].side==='AI'?'AI':'PLAYER';
    const from=zoneEl(side,'Discard Pile'),to=zoneEl(side,'Main Deck');
    const next=()=>requestAnimationFrame(()=>setTimeout(()=>runReturnSequence(index+1),22));
    // Main Deck card-back ghost only; zone movement was committed by the engine.
    if(!flyBetween('assets/ui/back-main.webp',from,to,300,next,index===0,true))next();
  }
  function runDrawSequence(index){
    if(index>=draws.length){runPublicPickupSequence(0);return;}
    const e=draws[index],side=e.side==='AI'?'AI':'PLAYER',idx=Number(e.hand_index),from=zoneEl(side,'Main Deck'),hand=side==='PLAYER'?playerHandTrack:oppHandTrack,to=hand?.querySelector('.hand-card[data-hand-index="'+idx+'"]');
    if(to)to.classList.add('gl-presentation-hidden');
    const done=()=>{
      glHiddenCommittedDrawSlots[side].delete(idx);
      if(to)to.classList.remove('gl-presentation-hidden');
      requestAnimationFrame(()=>setTimeout(()=>runDrawSequence(index+1),28));
    };
    if(!flyBetween('assets/ui/back-main.webp',from?.querySelector('.zoneCard')||from,to,360,done,true,false,side==='PLAYER'&&e.card_id?art(e.card_id):null))done();
  }

  // ONLY a deliberate public Search/Return pickup (CARD_PUBLIC_PICKUP).
  // The owner sees their own Hand directly; the human opponent is notified
  // of cards the AI searches/returns to its Hand. No regular Draw is affected.
  function runPublicPickupSequence(index){
    if(index>=picks.length){runShardSequence(0);return;}
    const first=picks[index];
    if(first.side!=='AI'){
      runPublicPickupSequence(index+1);return;
    }
    const group=[first];let next=index+1;
    while(next<picks.length&&picks[next].side==='AI'&&
      picks[next].source_card_id===first.source_card_id&&
      picks[next].from_zone===first.from_zone){group.push(picks[next]);next++}
    queuePublicArtworkNotice('AI ADDED TO HAND',group.map(e=>e.card_id),
      first.from_zone==='Discard'?'RETURNED FROM DISCARD':'SEARCHED FROM MAIN DECK');
    runPublicPickupSequence(next);
  }
  // Both 2-card and 3-card automatic returns use the SAME visual transaction.
  // Human returns are owned by the selector-to-Hand batch; they must never be
  // revealed by an overlapping deferred Rank Up or stand-alone presenter.
  function runExpReturnBatch(events,from,onComplete){
    const groups=new Map();
    (events||[]).forEach(e=>{
      const side=e.side==='AI'?'AI':'PLAYER';
      if(!groups.has(side))groups.set(side,[]);
      groups.get(side).push(e);
    });
    if(!groups.size){onComplete();return;}
    let left=groups.size;
    const done=()=>{if(--left===0)onComplete()};
    groups.forEach((list,side)=>{
      const needsVisual=list.filter(e=>{
        if(e.id&&(glManualTrialReturnEventIds.has(e.id)||glPresentedTrialReturnEventIds.has(e.id)))return false;
        // Backward-compatible guard for a just-committed selection before its
        // event IDs have been read out of the engine.
        if(e.choice_animated&&glTrialHandFlightKeys.has(trialFlightKey(side,e.hand_index)))return false;
        return true;
      });
      // Own the event once; temporary Hand-index locks are NOT dedupe keys.
      if(!needsVisual.length){done();return;}
      needsVisual.forEach(e=>{if(e.id)glPresentedTrialReturnEventIds.add(e.id)});
      runAtomicTrialReturnBatch(side,needsVisual.map(e=>({
        side,card_id:e.card_id,hand_index:e.hand_index,from,
        src:side==='AI'?'assets/ui/back-main.webp':art(e.card_id)
      })),done);
    });
  }
  function runStandaloneTrialReturns(index){
    if(index>=expReturns.length){runReturnSequence(0);return;}
    const first=expReturns[index],side=first.side,lane=first.lane;
    const group=expReturns.filter(e=>e.side===side&&e.lane===lane);
    expReturns.splice(0,expReturns.length,...expReturns.filter(e=>e.side!==side||e.lane!==lane));
    runExpReturnBatch(group,heroCardEl(side,lane),()=>runStandaloneTrialReturns(0));
  }
  function runRankTransition(index){
    if(index>=rankTransitions.length){runStandaloneTrialReturns(0);return;}
    const x=rankTransitions[index],hero=heroCardEl(x.side,x.lane),legacy=zoneEl(x.side,'Legacy Deck'),discard=zoneEl(x.side,'Discard Pile'),exp=(x.expCardIds||[]).filter(Boolean);
    // Match returned events to exact EXP multiplicities; a Skill may be
    // Tributed more than once, and only its returned copies go to Hand.
    const moves=exp.map(id=>{
      const eventIndex=expReturns.findIndex(e=>e.side===x.side&&e.lane===x.lane&&e.card_id===id&&
        (!x.rankUpId||!e.rank_up_id||e.rank_up_id===x.rankUpId));
      return {id,returned:eventIndex>=0?expReturns.splice(eventIndex,1)[0]:null};
    });
    const reveal=()=>{const lane=uiLaneElement(x.side,x.lane),pack=hero?.closest('.gl-hero-physical-stack');pack?.querySelector(':scope > .gl-rank-old-hero')?.remove();hero?.classList.remove('gl-presentation-hidden');lane?.classList.remove('gl-rank-transitioning');requestAnimationFrame(()=>setTimeout(()=>runRankTransition(index+1),36))};
    const bringRank=()=>{if(!flyToHeroOrientation(art(x.id),legacy?.querySelector('.zoneCard')||legacy,hero,x.side,x.lane,350,reveal,true))reveal()};
    if(!moves.length){bringRank();return;}
    // Discard-only EXP is animated alongside eligible Returns. Returned cards
    // are revealed together only once the complete batch has landed.
    if(x.selectorAnimated){
      moves.forEach(move=>{
        if(move.returned&&!glManualTrialReturnEventIds.has(move.returned.id)&&
          !glTrialHandFlightKeys.has(trialFlightKey(move.returned.side,move.returned.hand_index)))revealTrialReturnSlot(move.returned);
      });
      bringRank();return;
    }
    const returning=moves.filter(move=>move.returned).map(move=>move.returned);
    const discarded=moves.filter(move=>!move.returned);
    let pending=(returning.length?1:0)+discarded.length;
    if(!pending){bringRank();return;}
    const finish=()=>{if(--pending===0)bringRank()};
    if(returning.length)runExpReturnBatch(returning,hero,finish);
    discarded.forEach((move,i)=>{
      if(!flyBetween(art(move.id),hero,discard?.querySelector('.zoneCard')||discard,330,finish,i===0))finish();
    });
  }
  legacyTransitions.forEach((x,i)=>setTimeout(()=>{const from=zoneEl(x.side,'Legacy Deck'),to=heroCardEl(x.side,x.lane);flyBetween(art(x.id),from?.querySelector('.zoneCard')||from,to,430)},i*70));
  (plan.moved||[]).forEach(x=>{const lane=uiLaneElement(x.side,x.lane);if(!lane)return;lane.classList.remove('gl-reposition-flash');void lane.offsetWidth;lane.classList.add('gl-reposition-flash');setTimeout(()=>lane.classList.remove('gl-reposition-flash'),720)});
  // Allow the manual slot-to-slot Return flights to land before the incoming
  // new-Rank Hero card flies in. Automatic Ultimate returns follow old timing.
  if(rankTransitions.length){
    // AI Tribute and Rank Up often commit in the same tick. Wait until the
    // Tribute card has landed instead of using a fixed 430ms guess.
    let waitStarted=Date.now();
    const afterTribute=()=>{
      if((glPresentationActive>0||Date.now()<glPresentationBusyUntil)&&Date.now()-waitStarted<3200){setTimeout(afterTribute,32);return}
      runRankTransition(0);
    };
    afterTribute();
  }else runStandaloneTrialReturns(0);
  // EXP returns can arrive after the rank visual in a later render plan;
  // without a rank transition the old branch skipped them completely.
  E()?.flushBattleFeedback?.();
}
function responseOptionsForHand(rw,idx){
  const out=[];(rw?.options||[]).forEach((o,i)=>{if(Number(o?.hand_index)===Number(idx))out.push(i)});return out;
}
// Source and protected recipient are two separate decisions for an allied
// Defense. For a team-wide Defense only the source is chosen: its target is
// ALL allied Heroes, never one arbitrarily selected Hero.
// Defense Skills that explicitly protect an ally or the entire team retain
// their dedicated source/recipient flow. Other Defense Skills and every
// Protection Item automatically affect the Hero in the active Response Window.
const RESPONSE_ALLIED_SOURCE_CARDS=new Set(['S0-CLE-010','S0-CLE-022','S0-CLE-025','S0-WAR-004']);
const RESPONSE_SINGLE_PROTECTED_CARDS=new Set(['S0-CLE-010','S0-WAR-004']);
const RESPONSE_TEAMWIDE_SKILLS=new Set(['S0-CLE-022','S0-CLE-025']);
function responseAutoTargetsAttackedHero(cardId){
  return !RESPONSE_ALLIED_SOURCE_CARDS.has(cardId)&&isDefenseResponseArrowCard(cardId);
}
function responseChoiceLanes(s){
  const choice=uiResponseSourceChoice,rw=s?.responseWindow;
  if(!choice||rw?.response_owner!=='PLAYER')return new Map();
  const m=new Map();
  if(choice.stage==='protected'){
    const selected=rw.options?.[choice.selectedOptionIndex];
    if(selected && rw.target_lane && RESPONSE_SINGLE_PROTECTED_CARDS.has(selected.card_id))
      m.set(rw.target_lane,choice.selectedOptionIndex);
    return m;
  }
  choice.optionIndices.forEach(i=>{const o=rw.options?.[i];if(o?.source_lane)m.set(o.source_lane,i)});
  return m;
}
function selectResponseRouteHero(side,lane){
  const choice=uiResponseSourceChoice,s=st(),rw=s?.responseWindow;
  if(!choice||side!=='PLAYER'||rw?.response_owner!=='PLAYER')return;
  const optionIndex=responseChoiceLanes(s).get(lane);
  if(optionIndex==null)return;
  const option=rw.options?.[optionIndex];if(!option)return;
  if(choice.stage==='protected'){
    // Keep the target fixed to the Hero actually being attacked. Response
    // routing must not give the player a way to protect an unrelated Hero.
    if(lane!==rw.target_lane)return;
    confirmResponseOption(optionIndex);return;
  }
  if(RESPONSE_SINGLE_PROTECTED_CARDS.has(option.card_id)){
    choice.stage='protected';choice.selectedOptionIndex=optionIndex;
    renderNow();return;
  }
  // Sacred Bulwark / Blessing of Divinity explicitly affect ALL your Heroes.
  // Choosing a single recipient here would change the printed card rules.
  confirmResponseOption(optionIndex);
}
function renderResponseRouteGuide(s){
  const choice=uiResponseSourceChoice,rw=s?.responseWindow;
  if(!choice||rw?.response_owner!=='PLAYER'){
    responseRouteGuide.classList.remove('open');responseRouteGuide.setAttribute('aria-hidden','true');return;
  }
  const opt=rw.options?.[choice.stage==='protected'?choice.selectedOptionIndex:choice.optionIndices[0]],id=opt?.card_id||'',name=cv(id)?.name||'Defense';
  let caption='SELECT HERO TO USE '+name.toUpperCase();
  if(choice.stage==='protected'){
    const lane=opt?.source_lane||'',hero=sideHeroes(s,'PLAYER')?.[lane];
    caption=(cv(heroImageId(hero))?.name||'Selected Hero')+' → SELECT ATTACKED HERO TO PROTECT';
  }else if(RESPONSE_TEAMWIDE_SKILLS.has(id)){
    caption+=' — PROTECTS ALL ALLIES';
  }else if(responseAutoTargetsAttackedHero(id)){
    caption+=' — AUTOMATICALLY PROTECTS THE ATTACKED HERO';
  }
  responseRouteGuide.textContent=caption;
  responseRouteGuide.classList.add('open');responseRouteGuide.setAttribute('aria-hidden','false');
}
function beginResponseFromHand(handIndex,optionIndices){
  optionIndices=(optionIndices||[]).filter(i=>Number.isInteger(Number(i))).map(Number);
  if(!optionIndices.length)return;
  const s=st(),rw=s?.responseWindow;
  responseRollbackSnapshot=B()?.getSnapshot?.()||null;
  const id=rw?.options?.[optionIndices[0]]?.card_id;
  if(rw?.response_owner==='PLAYER'&&rw.kind==='incoming_attack'&&RESPONSE_ALLIED_SOURCE_CARDS.has(id)){
    // Ally-protecting Skills retain their separate approved routing.
    uiResponseSourceChoice={handIndex:Number(handIndex),optionIndices,stage:'source',selectedOptionIndex:null};renderNow();return;
  }
  // All ordinary Defense Skills and Protection Items target the incoming
  // Response Window's attacked Hero. Only choosing the legal USER may remain;
  // there must never be a second Effect Target/recipient selection.
  if(optionIndices.length===1){confirmResponseOption(optionIndices[0]);return}
  const lanes=optionIndices.map(i=>rw?.options?.[i]?.source_lane).filter(Boolean);
  if(new Set(lanes).size<=1){confirmResponseOption(optionIndices[0]);return}
  uiResponseSourceChoice={handIndex:Number(handIndex),optionIndices,stage:'source',selectedOptionIndex:null,autoProtectedLane:responseAutoTargetsAttackedHero(id)?rw?.target_lane:null};renderNow();
}
function isDefenseResponseArrowCard(cardId){
  const def=rawCardDef(cardId)||cv(cardId)||{},family=String(def.family||'').toLowerCase();
  const subtype=String(def.classification||def.action_category||def.card_subtype||def.subtype||'').toLowerCase();
  // Protection Items and Defense Skills are defensive Responses; unrelated
  // REACTION effects must keep their own targeting and connector logic.
  return (family==='skill' && subtype==='defense') || (family==='item' && subtype==='protection');
}
function protectedHeroFromResponse(rw){
  const atk=findAttackContextInWindow(rw)||rw;
  if(!atk?.target_side||!atk?.target_lane)return null;
  return {target_side:atk.target_side,target_lane:atk.target_lane};
}
function confirmResponseOption(optionIndex){
  if(!responseRollbackSnapshot)responseRollbackSnapshot=B()?.getSnapshot?.()||null;
  const before=st(),rw=before?.responseWindow,opt=rw?.options?.[Number(optionIndex)];
  if(opt?.card_id&&isDefenseResponseArrowCard(opt.card_id)){
    const target=protectedHeroFromResponse(rw);
    if(target)transientDefenseConnector={card_id:opt.card_id,...target};
  }
  uiResponseSourceChoice=null;
  intent('responseSelectNoStuck',[Number(optionIndex)]);
  intent('confirmSelectedResponse',[]);
  // Once an engine Response choice has been confirmed, any payment cancellation is
  // authoritative through cancelResponsePaymentChoice(); the UI snapshot is no longer a rollback source.
  responseRollbackSnapshot=null;
}
function cancelResponsePrecommit(){
  uiResponseSourceChoice=null;
  const s=st();
  // Once the Response payment screen is open, cancellation is an authoritative
  // state-machine transition handled by the engine. Do not roll the whole match
  // back to a local UI snapshot: the original Response Window is stored in the
  // pending payment state and is restored without spending any costs.
  if(s?.pending?.type==='response_payment_choice'){
    responseRollbackSnapshot=null;
    intent('cancelResponsePaymentChoice',[]);
    return true;
  }
  // Snapshot rollback is retained only for the earlier UI-only source-choice
  // presentation path, before an engine Response payment pending state exists.
  if(responseRollbackSnapshot&&B()?.importSnapshot){
    B().importSnapshot(responseRollbackSnapshot,{skipImportAnimations:true});
    responseRollbackSnapshot=null;renderNow();return true;
  }
  return false;
}
function heroCombatHeld(side,lane,s){
  if(!combatChainStillActive(s))return false;
  return heldCombatCards.some(a=>a.side===side&&a.lane===lane&&!a.no_source);
}
function findAttackContextInWindow(rw){
  if(!rw)return null;
  if(rw.kind==='incoming_attack')return rw;
  if(rw.response_continuation){const x=findAttackContextInWindow(rw.response_continuation);if(x)return x}
  if(rw.original_attack_context){const x=findAttackContextInWindow(rw.original_attack_context);if(x)return x}
  return null;
}
function findActiveAttackWindow(s){
  let x=findAttackContextInWindow(s?.responseWindow);if(x)return x;
  const p=s?.pending;
  if(p?.type==='response_payment_choice')return findAttackContextInWindow(p.incoming_response_window);
  if(p?.after_stoneblood_response)return findAttackContextInWindow(p.after_stoneblood_response);
  return null;
}
const PRECOMMIT_PENDING_TYPES=new Set(['warp_scroll_selection','source_selection','target_selection','scouting_target_selection','scouting_exp_selection','exact_two_target_selection','double_casting_target_selection','mana_spend_choice','mana_shard_payment_choice','optional_magical_surge','status_removal_choice','tribute_target','racial_target_selection','hero_ability_target_selection','legacy_cost_selection','legacy_hero_target_selection','manual_reposition']);
function recentEventForCard(s,side,cardId){
  const list=side==='AI'?(s?.opponentPlayedEvents||s?.aiPlayedEvents||[]):(s?.playerPlayedEvents||[]);
  return list.find(e=>e&&e.card_id===cardId)||null;
}
function pendingActionInfo(s,p){
  if(!p||PRECOMMIT_PENDING_TYPES.has(p.type))return null;
  if(['hand_limit_discard','draw_replacement_choice','legacy_defeat_choice','response_window'].includes(p.type))return null;
  const id=p.card_id||p.response_option?.card_id||null;
  if(!id)return null;
  const side=p.source_side||p.host_side||p.side||p.decision_side||'PLAYER';
  const evt=recentEventForCard(s,side,id);
  const sourceCardId=p.source_card_id||p.response_option?.source_card_id||evt?.source_card_id||null;
  const fallbackLane=p.source_lane||p.host_lane||p.response_option?.source_lane||evt?.source_lane||null;
  const lane=currentLaneForSourceCard(s,side,sourceCardId,fallbackLane);
  const targetSide=p.target_side||evt?.target_side||null;
  const targetLane=p.target_lane||evt?.target_lane||null;
  return{card_id:id,side,lane,source_card_id:sourceCardId,target_side:targetSide,target_lane:targetLane,no_source:!lane};
}
function bindBattlefieldHandHover(card){
  if(!card||card.dataset.glHoverBound==='1')return;card.dataset.glHoverBound='1';
  let leaveTimer=0;
  card.addEventListener('mouseenter',()=>{clearTimeout(leaveTimer);card.classList.add('is-hovered');syncExpButtonLock()});
  card.addEventListener('mouseleave',()=>{clearTimeout(leaveTimer);leaveTimer=setTimeout(()=>{card.classList.remove('is-hovered');syncExpButtonLock()},170);syncExpButtonLock()});
  card.addEventListener('focusin',syncExpButtonLock);
  card.addEventListener('focusout',()=>setTimeout(syncExpButtonLock,0));
}

// Stage 1.5.9: calculate the fan from the actual number of visible slots on both sides.
// This removes the old nth-child edge mismatch when the Hand was shorter than the authored fan.
function applyHandFan(track,side){
  const cards=[...track.querySelectorAll('.hand-card')],n=cards.length,isPlayer=side==='PLAYER';
  cards.forEach(c=>{c.style.removeProperty('--fan-rot');c.style.removeProperty('--fan-lift');c.style.removeProperty('--opp-fan-rot');c.style.removeProperty('--opp-fan-lift')});
  if(!n)return;
  const center=(n-1)/2,max=Math.max(center,1),maxRot=n<=1?0:Math.min(3.6,1.15+(n-2)*.48),maxLift=n<=1?0:2.7;
  cards.forEach((c,i)=>{
    const t=center===0?0:(i-center)/max,rot=maxRot*t,lift=maxLift*Math.pow(Math.abs(t),1.55);
    if(isPlayer){c.style.setProperty('--fan-rot',rot.toFixed(2)+'deg');c.style.setProperty('--fan-lift',lift.toFixed(2)+'px');}
    else{c.style.setProperty('--opp-fan-rot',(-rot).toFixed(2)+'deg');c.style.setProperty('--opp-fan-lift',lift.toFixed(2)+'px');}
  });
}


function syncPlayerHandToHeroCenter(){const c=uiLaneElement('PLAYER','CENTER'),r=uiLaneElement('PLAYER','RIGHT'),cards=[...playerHandTrack.querySelectorAll('.hand-card')];if(!c||!r||!cards.length)return;const scale=currentUiScale(),cr=uiLayoutRect(c),rr=uiLayoutRect(r),a=uiLayoutRect(cards[0]),b=uiLayoutRect(cards[cards.length-1]),target=(cr.right+rr.left)/2,actual=(a.left+b.right)/2,d=(target-actual)/scale;if(Math.abs(d)>.15){playerHandShift+=d;document.querySelector('.bottom-hud .hand').style.setProperty('--hand-align-shift',playerHandShift+'px')}}
function syncOpponentHand(){const lanes=[...document.querySelectorAll('.opponent-field .hero-grid .hero-lane')],l=lanes[0],c=lanes[1],cards=[...oppHandTrack.querySelectorAll('.hand-card')];if(!l||!c||!cards.length)return;const scale=currentUiScale(),lr=uiLayoutRect(l),cr=uiLayoutRect(c),a=uiLayoutRect(cards[0]),b=uiLayoutRect(cards[cards.length-1]),target=(lr.right+cr.left)/2,actual=(a.left+b.right)/2,d=(target-actual)/scale;if(Math.abs(d)>.15){opponentHandShift+=d;oppHandTrack.style.setProperty('--opponent-hand-align-shift',opponentHandShift+'px')}}
function syncPlayerManaPoolToHeroLeft(){const field=document.querySelector('.player-field'),lane=uiLaneElement('PLAYER','LEFT'),pool=document.querySelector('.player-mana-pool');if(!field||!lane||!pool)return;const scale=currentUiScale(),fr=uiLayoutRect(field),lr=uiLayoutRect(lane),left=parseFloat(getComputedStyle(pool).left)||4,right=(lr.right-fr.left)/scale,w=Math.max(120,right-left);pool.style.setProperty('--player-mana-pool-w',w+'px');pool.style.width=w+'px';const op=document.querySelector('.opponent-mana-pool'),lockOpponent=centerChoiceModeFor(st())==='opponent-shard';if(op&&!lockOpponent)op.style.width=w+'px';renderMana();requestAnimationFrame(syncPlayerHandToHeroCenter)}
window.syncPlayerHandToHeroCenter=syncPlayerHandToHeroCenter;window.syncOpponentHand=syncOpponentHand;window.syncPlayerManaPoolToHeroLeft=syncPlayerManaPoolToHeroLeft;
function sortedShardPoolForDisplay(pool,side){
  // v6.90.4: preserve canonical Pool order exactly. New draws are appended by the
  // engine, so they now land naturally at the visual end instead of being re-sorted
  // by Shard kind. Center payment reuses this same stable order.
  return (pool||[]).slice();
}
function layoutManaPoolCards(host){
  if(!host)return;const cards=[...host.querySelectorAll(':scope > .mana-card')];if(!cards.length)return;
  const sample=cards.find(c=>getComputedStyle(c).display!=='none')||cards[0];
  const measured=parseFloat(getComputedStyle(sample).getPropertyValue('--gl-mana-original-width'))||parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--std-w'))||parseFloat(getComputedStyle(sample).width)||64;
  // clientWidth is in the card's *local containing-block units*; DOMRects
  // may be scaled and cannot be mixed with absolute-positioned CSS `left`.
  const hostWidth=Math.max(8,host.clientWidth||8);
  const cw=Math.max(6,Math.min(measured,hostWidth-6));
  const inner=Math.max(cw,hostWidth-4),naturalStep=cw+5,start=2;
  // One continuous Shard stack. Position sorting is handled by renderPool; layering follows
  // the visual stack direction only, never Shard type and never payment-selection state.
  // The last Shard must never extend beyond its Pool boundary, even at
  // nonstandard browser zoom. Overlap rather than overflowing when crowded.
  const step=cards.length<=1?0:Math.max(0,Math.min(naturalStep,(inner-cw-2)/(cards.length-1)));
  const isPlayer=host===playerManaHost||host.id==='manaCards';
  cards.forEach((c,i)=>{
    // Resize card's box, keeping click hitbox within Pool when needed.
    c.style.width=cw+'px';
    c.style.left=(isPlayer?(start+i*step):(Math.max(2,hostWidth-cw-2-i*step)))+'px';
    // Player: farther right = in front. Opponent: leftmost (latest visually added) = in front.
    // A selected/lifted Shard changes only Y; it must not jump above a Shard that is already
    // in front of it in the horizontal stack.
    const z=100+i;
    c.style.setProperty('z-index',String(z),'important');
  });
}

function renderPool(host,countEl,pool,side){
  const s=st(),p=s?.pending,plan=side==='PLAYER'?E().getManaPlan():null;
  const selected=new Set(),selectable=new Set();
  if(side==='PLAYER'&&p?.type==='mana_shard_payment_choice'&&plan){
    (plan.plan?.selected_shard_uids||plan.plan?.shards?.map(x=>x.uid)||p.selected_shard_uids||[]).forEach(x=>selected.add(String(x)));
    (pool||[]).forEach(sh=>selectable.add(String(sh.uid)));
  }
  if(side==='PLAYER'&&p?.type==='mana_spend_choice') (pool||[]).forEach(sh=>selected.add(String(sh.uid)));
  if(side==='PLAYER'&&p?.type==='response_payment_choice'&&Number(p.mana_cost||0)>0){
    (p.selected_shard_uids||[]).forEach(uid=>selected.add(String(uid)));
    (pool||[]).forEach(sh=>selectable.add(String(sh.uid)));
  }

  const blindOpponent = p?.type==='opponent_mana_selection' && pendingOwner(p)==='PLAYER' && side===p.target_side;
  const blindInCenter=blindOpponent&&centerChoiceModeFor(s)==='opponent-shard';
  // Clone-only center choice: once the real opponent Pool is on screen, do not
  // rebuild or restyle it while the blind choice is active. This preserves the
  // exact normal geometry, counter, stack order, and card positions behind the
  // center overlay.
  if(blindInCenter&&host.children.length){countEl.textContent=(pool||[]).length;return;}
  const blindSelected = new Set();
  if(blindOpponent) (p.selected_indices||[]).forEach(i=>blindSelected.add(Number(i)));

  host.classList.toggle('gl-blind-shard-layout',!!blindOpponent&&!blindInCenter);
  // Preserve each Mana Shard's DOM node by UID while the pool changes. The old
  // full re-render broke mobile 400ms Hold whenever state updated and also
  // dismissed an already-open preview although the Shard was still present.
  // A spent/removed Shard must still close its preview. Blind opponent selection
  // retains the original rebuild path to avoid exposing hidden identities.
  const displayPool=(blindOpponent&&!blindInCenter)
    ? (p.candidates||[]).map(c=>(pool||[]).find(sh=>String(sh?.uid)===String(c?.uid))).filter(Boolean)
    : sortedShardPoolForDisplay(pool,side);
  const canReuse=!blindOpponent&&host.dataset.glBlindManaPool!=='1';
  const prior=new Map(canReuse?[...host.children].filter(x=>x.classList.contains('mana-card'))
    .map(w=>[String(w.dataset.uid||''),w]):[]);
  const nodes=[];
  if(!canReuse){
    if(battlefieldHoverSource&&host.contains(battlefieldHoverSource))hideBattlefieldHoverPreview();
    host.innerHTML='';
  }
  host.dataset.glBlindManaPool=blindOpponent?'1':'0';

  displayPool.forEach((sh,i)=>{
    const key=String(sh?.uid||'');
    const wrap=canReuse&&prior.has(key)?prior.get(key):document.createElement('div');
    prior.delete(key);
    const blindIdx=(blindOpponent&&!blindInCenter)?i:-1;
    const isBlindSelected=(blindOpponent&&!blindInCenter)&&blindSelected.has(blindIdx);
    const openingHidden=glOpeningHiddenShardUids.has((side==='AI'?'AI':'PLAYER')+'|'+String(sh.uid));
    wrap.className='mana-card'+(selected.has(String(sh.uid))||isBlindSelected?' gl-selected':'')+(selectable.has(String(sh.uid))||(blindOpponent&&!blindInCenter)?' gl-class-choice':'')+(sh?.kind==='CLASS'&&!(blindOpponent&&!blindInCenter)?' gl-class-shard':'')+(openingHidden?' gl-presentation-hidden':'');
    wrap.dataset.uid=sh.uid||'';wrap.dataset.shardKind=sh?.kind||'';
    const im=wrap.querySelector(':scope > img')||document.createElement('img');
    const src=(blindOpponent&&!blindInCenter)?'assets/ui/back-shard.webp':shardArt(sh);
    setCardArtwork(im,src);
    im.alt=(blindOpponent&&!blindInCenter)?'Face-down opponent Shard':((sh.class_name||'Mana')+' Shard');
    if(im.parentElement!==wrap)wrap.appendChild(im);
    // Retain the same image node (and its long-press listener), including when
    // the status/selection state changes. Only reorder if actually necessary.
    if(wrap.parentElement!==host)host.appendChild(wrap);
    nodes.push(wrap);
    if(!(blindOpponent&&!blindInCenter))bindBattlefieldPreview(im,side==='PLAYER'?'shard':'opponentShard',wrap);
    if(blindOpponent&&!blindInCenter){
      wrap.onclick=()=>{intent('selectOpponentManaChoice',[blindIdx])};
    }else if(selectable.has(String(sh.uid))&&!blindInCenter){
      wrap.onclick=()=>{
        if(p?.type==='response_payment_choice') intent('toggleResponseManaShardChoice',[sh.uid]);
        else intent('toggleManaShardPaymentChoice',[sh.uid]);
      };
    }else wrap.onclick=null;
  });
  // Only detach genuinely removed Shards. Never throw away an existing
  // long-press listener for the same UID during an unrelated state update.
  if(canReuse){
    prior.forEach(w=>{if(battlefieldHoverSource&&w.contains(battlefieldHoverSource))hideBattlefieldHoverPreview();w.remove()});
    nodes.forEach((w,i)=>{if(host.children[i]!==w)host.insertBefore(w,host.children[i]||null)});
  }
  countEl.textContent=(pool||[]).length;
  requestAnimationFrame(()=>layoutManaPoolCards(host));
}
let glManaPoolResizeQueued=false;
function refreshManaPoolGeometry(){
  if(glManaPoolResizeQueued)return;
  glManaPoolResizeQueued=true;
  requestAnimationFrame(()=>{
    glManaPoolResizeQueued=false;
    const field=document.querySelector('.player-field'),lane=uiLaneElement('PLAYER','LEFT'),pool=document.querySelector('.player-mana-pool');
    if(field&&lane&&pool){
      const scale=currentUiScale(),fr=uiLayoutRect(field),lr=uiLayoutRect(lane),left=parseFloat(getComputedStyle(pool).left)||4;
      const w=Math.max(120,(lr.right-fr.left)/scale-left);
      if(Math.abs((parseFloat(pool.style.width)||0)-w)>0.75){
        pool.style.width=w+'px';pool.style.setProperty('--player-mana-pool-w',w+'px');
        const op=document.querySelector('.opponent-mana-pool');
        if(op&&centerChoiceModeFor(st())!=='opponent-shard')op.style.width=w+'px';
      }
    }
    layoutManaPoolCards(playerManaHost);layoutManaPoolCards(aiManaHost);
  });
}
let glManaPoolObserver;
function installManaPoolGeometryWatch(){
  if(glManaPoolObserver||typeof ResizeObserver!=='function')return;
  glManaPoolObserver=new ResizeObserver(refreshManaPoolGeometry);
  [playerManaHost,aiManaHost,document.querySelector('.player-mana-pool'),document.querySelector('.opponent-mana-pool'),document.querySelector('.player-field')].filter(Boolean).forEach(el=>glManaPoolObserver.observe(el));
}
window.addEventListener('resize',refreshManaPoolGeometry,{passive:true});
window.addEventListener('orientationchange',refreshManaPoolGeometry,{passive:true});
installManaPoolGeometryWatch();
function renderMana(){
  const s=st();if(!s)return;
  const key=JSON.stringify([
    (s.playerManaPoolCards||[]).map(x=>[x.uid,x.kind,x.class_name]),
    (s.aiManaPoolCards||[]).map(x=>[x.uid,x.kind,x.class_name]),
    s.pending?.type,
    s.pending?.selected_class_uids,
    s.pending?.selected_shard_uids,
    s.pending?.selected_mana_class_uids,
    s.pending?.selected_indices,
    s.pending?.target_side,
    [...glOpeningHiddenShardUids].sort()
  ]);
  if(key===manaRenderKey)return;
  manaRenderKey=key;
  renderPool(playerManaHost,playerManaCount,s.playerManaPoolCards||[],'PLAYER');
  renderPool(aiManaHost,aiManaCount,s.aiManaPoolCards||[],'AI');
}

// Discard decisions share Bard's full-size, focused card selector. The engine
// remains the sole authority for eligible candidates and cost commitment.
let responseDiscardStageApprovedKey='';
function responseDiscardStageKey(p){
  return JSON.stringify([p?.response_option?.card_id,p?.response_option?.hand_index,
    p?.response_option?.source_lane,p?.incoming_response_window?.response_window_token,
    p?.mana_cost,p?.required_discard_count,(p?.candidates||[]).map(c=>[c.card_id,c.hand_index]),
    p?.selected_indices||[]]);
}
function isHandDiscardPending(p){
  return !!p&&(p.type==='legacy_cost_selection'||p.type==='hand_limit_discard'||
    (p.type==='response_payment_choice'&&Number(p.required_discard_count||0)>0)||
    (p.type==='card_search_choice'&&p.zone==='hand'&&
      ['discard_then_draw_three','gods_blessing_precommit'].includes(p.resolve_to)));
}
function centerChoiceModeFor(s){
  const p=s?.pending;
  if(p?.type!=='response_payment_choice')responseDiscardStageApprovedKey='';
  if(!p||pendingOwner(p)!=='PLAYER')return'';
  if(isHandDiscardPending(p)){
    if(p.type==='response_payment_choice'&&Number(p.mana_cost||0)>0&&responseDiscardStageApprovedKey===responseDiscardStageKey(p))return'pay';
    return'discard';
  }
  // Trial Return EXP uses the exact same foreground selector as DISCARD.
  if(p.type==='trial_rankup_return_exp'||p.type==='scouting_exp_selection')return'discard';
  if(p.type==='legacy_defeat_choice')return'legacy';
  if(p.type==='saint_purify_choice')return'purify';
  if(p.type==='s0_bard_draw_choice')return'bard';
  if(p.type==='draw_replacement_choice')return'draw-replacement';
  if(p.type==='racial_stoneblood')return'stoneblood';
  if(p.type==='mana_shard_payment_choice'||(p.type==='response_payment_choice'&&Number(p.mana_cost||0)>0))return'pay';
  if(p.type==='opponent_mana_selection')return'opponent-shard';
  if(p.type==='opponent_hand_choice')return'opponent-hand';
  if(p.type==='magic_scope_reveal')return'magic-scope';
  return'';
}
let lastCenterChoiceBodyMode='';
function setCenterChoiceBodyMode(mode){
  const changed=mode!==lastCenterChoiceBodyMode;
  lastCenterChoiceBodyMode=mode;
  ['pay','opponent-shard','opponent-hand','magic-scope','bard','discard','legacy','purify','draw-replacement','stoneblood'].forEach(x=>document.body.classList.toggle('gl-center-'+x,mode===x));
  document.body.classList.toggle('gl-center-choice-active',!!mode);
  centerFocusBackdrop.classList.toggle('is-visible',!!mode);
  if(mode){
    hideBattlefieldHoverPreview();hideSidebarHoverPreview();
    // The game re-renders every 120ms. Clearing the modal preview here on
    // *every* render made RC25's hovered card flash and immediately vanish.
    if(changed){classChoiceHoverOwner=null;hideModalHoverPreview()}
    sharedBox?.classList.remove('previewing');preview?.removeAttribute('src');
  }else if(changed){classChoiceHoverOwner=null;hideModalHoverPreview()}
}
function centerChoiceOrigin(mode,p){
  if(mode==='discard'&&p?.type==='trial_rankup_return_exp')return heroCardEl(p.side||'PLAYER',p.lane);
  if(mode==='discard'&&p?.type==='scouting_exp_selection')return heroCardEl(p.target_side||'AI',p.target_lane);
  if(mode==='legacy')return zoneEl(p?.side||'PLAYER','Legacy Deck');
  if(mode==='bard'||mode==='discard'||mode==='draw-replacement')return document.querySelector('.hand.bottom');
  if(mode==='purify')return heroCardEl(p?.target_side||'PLAYER',p?.target_lane);
  if(mode==='stoneblood')return document.querySelector('.battlefield .player-heroes');
  if(mode==='pay')return document.querySelector('.player-mana-pool');
  if(mode==='opponent-shard')return p?.target_side==='PLAYER'?document.querySelector('.player-mana-pool'):document.querySelector('.opponent-mana-pool');
  if(mode==='opponent-hand'||mode==='magic-scope')return document.querySelector('.hand.top');
  return null;
}
function centerChoiceDestinationForZone(side,type){
  if(type==='Hand')return side==='PLAYER'?document.querySelector('.hand.bottom'):document.querySelector('.hand.top');
  if(type==='Shard Pool')return side==='PLAYER'?document.querySelector('.player-mana-pool'):document.querySelector('.opponent-mana-pool');
  return zoneEl(side,type);
}
function centerChoiceCardHtml({key,front,back,faceUp=false,selected=false,clickable=false,concealed=false,label='',idx=-1,uid=''}) {
  // Concealed opponent Hand choices are single-sided: a hidden Card ID must
  // never generate or load a front-face image, even on selection/hover.
  const frontHtml=concealed?'':'<span class="gl-center-choice-face gl-center-choice-front"><img src="'+esc(cardArtwork.first(front||back||'assets/ui/back-main.webp'))+'" alt="'+esc(label||'Card')+'"></span>';
  return '<button type="button" class="gl-center-choice-card'+(faceUp?' is-face-up':'')+(selected?' is-selected':'')+(clickable?' is-clickable':'')+(concealed?' is-concealed':'')+'" data-choice-key="'+esc(key)+'" data-choice-index="'+idx+'" data-choice-uid="'+esc(uid)+'" '+(clickable?'':'tabindex="-1"')+' aria-label="'+esc(label||'Card')+'"><span class="gl-center-choice-flip"><span class="gl-center-choice-face gl-center-choice-back"><img src="'+esc(back||'assets/ui/back-main.webp')+'" alt=""></span>'+frontHtml+'</span></button>';
}
function animateCenterChoiceEntrance(origin,mode='',p=null){
  if(!origin)return;
  // Mana center modes are clone-only. Each center clone starts from the real card's
  // current Pool slot; the Pool container and its original cards never move/reflow.
  const fallback=uiRect(origin),fx=fallback.left+fallback.width/2,fy=fallback.top+fallback.height/2;
  centerChoiceStage.querySelectorAll('.gl-center-choice-card').forEach((card,i)=>{
    const r=uiRect(card),cx=r.left+r.width/2,cy=r.top+r.height/2,uid=card.dataset.choiceUid||'';
    let src=null;
    if((mode==='pay'||mode==='opponent-shard')&&uid){
      const side=mode==='pay'?'PLAYER':(p?.target_side||'AI');
      src=centerPoolCardTarget(side,uid);
    }
    const sr=uiRect(src),sx=sr&&sr.width>0?sr.left+sr.width/2:fx,sy=sr&&sr.height>0?sr.top+sr.height/2:fy;
    const scale=sr&&sr.width>0?Math.max(.34,Math.min(1.15,sr.width/Math.max(1,r.width))):.58;
    try{card.animate([{transform:`translate(${sx-cx}px,${sy-cy}px) scale(${scale})`,opacity:.2},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:360+i*18,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}).finished.catch(()=>{});}catch{}
  });
}
function animateCenterChoiceFlip(cards,faceUp=true){
  const list=[...cards];if(!list.length)return Promise.resolve();
  list.forEach(c=>c.classList.toggle('is-face-up',faceUp));
  return new Promise(resolve=>setTimeout(resolve,360));
}
function animateCenterChoiceTo(card,target,duration=430){
  if(!card||!target)return Promise.resolve();
  const r=uiRect(card),tr=uiRect(target),cx=r.left+r.width/2,cy=r.top+r.height/2,tx=tr.left+tr.width/2,ty=tr.top+tr.height/2;
  try{return card.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${tx-cx}px,${ty-cy}px) scale(.48)`,opacity:.12}],{duration,easing:'cubic-bezier(.25,.7,.2,1)',fill:'forwards'}).finished.catch(()=>{})}catch{return Promise.resolve()}
}
function animateCenterChoiceIntoDeck(card,target,duration=520){
  if(!card||!target)return Promise.resolve();
  const r=uiRect(card),targetCard=target.querySelector?.('.zoneCard')||target.querySelector?.('img')||target,tr=uiRect(targetCard),cx=r.left+r.width/2,cy=r.top+r.height/2,tx=tr.left+tr.width/2,ty=tr.top+tr.height/2;
  const endScale=Math.max(.34,Math.min(.82,(tr.width||r.width*.48)/Math.max(1,r.width)));
  const dx=tx-cx,dy=ty-cy;
  // Keep the Shard fully visible all the way into the deck. Fade only after it has
  // visibly reached the deck, so PAY/opponent-choice never looks like a teleport.
  const frames=[
    {offset:0,transform:'translate(0,0) scale(1)',opacity:1},
    {offset:.78,transform:`translate(${dx*.82}px,${dy*.82}px) scale(${Math.max(endScale,.58)})`,opacity:1},
    {offset:.94,transform:`translate(${dx}px,${dy}px) scale(${endScale})`,opacity:1},
    {offset:1,transform:`translate(${dx}px,${dy}px) scale(${endScale*.96})`,opacity:0}
  ];
  try{return card.animate(frames,{duration,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'}).finished.catch(()=>{})}catch{return Promise.resolve()}
}
function centerPoolCardTarget(side,uid){
  const host=side==='PLAYER'?playerManaHost:aiManaHost;
  return [...(host?.querySelectorAll?.(':scope > .mana-card')||[])].find(c=>String(c.dataset.uid||'')===String(uid||''))||null;
}
function animateCenterChoiceShuffle(cards){
  const list=[...cards];if(list.length<2)return Promise.resolve();
  const mid=(list.length-1)/2;
  try{return Promise.all(list.map((c,i)=>c.animate([
    {transform:'translateX(0) rotate(0deg)'},
    {transform:`translateX(${Math.round((mid-i)*18)}px) rotate(${i%2?3:-3}deg)`},
    {transform:`translateX(${Math.round((i-mid)*10)}px) rotate(${i%2?-2:2}deg)`},
    {transform:'translateX(0) rotate(0deg)'}
  ],{duration:360,easing:'ease-in-out'}).finished.catch(()=>{}))).then(()=>{})}catch{return Promise.resolve()}
}
async function animateCenterChoiceExit(selectedKeys,selectedTarget,otherTarget,{revealSelected=false,returnSide=''}={}){
  if(centerChoiceBusy)return false;centerChoiceBusy=true;centerChoiceStage.classList.add('is-busy');
  const cards=[...centerChoiceStage.querySelectorAll('.gl-center-choice-card')],selected=cards.filter(c=>selectedKeys.has(c.dataset.choiceKey));
  if(revealSelected)await animateCenterChoiceFlip(selected,true);
  centerChoiceStage.querySelector('.gl-center-choice-copy')?.classList.add('is-fading');
  centerChoiceStage.querySelector('.gl-center-choice-actions')?.classList.add('is-fading');
  await Promise.all(cards.map(c=>{
    if(selectedKeys.has(c.dataset.choiceKey))return animateCenterChoiceIntoDeck(c,selectedTarget);
    const spreadTarget=returnSide?centerPoolCardTarget(returnSide,c.dataset.choiceUid):null;
    return animateCenterChoiceTo(c,spreadTarget||otherTarget);
  }));
  return true;
}
function resetCenterChoiceVisualState(){
  centerChoiceBusy=false;centerChoiceStage.classList.remove('is-busy');
  const copy=centerChoiceStage.querySelector('.gl-center-choice-copy'),actions=centerChoiceStage.querySelector('.gl-center-choice-actions');
  copy?.classList.remove('is-fading');actions?.classList.remove('is-fading');
  centerChoiceStage.querySelectorAll('.gl-center-choice-card').forEach(c=>{try{c.getAnimations?.().forEach(a=>a.cancel())}catch{}c.style.removeProperty('opacity');c.style.removeProperty('transform')});
}
function closeCenterChoiceStage(){
  classChoiceHoverOwner=null;
  if(modalHoverPreview.classList.contains('open'))hideModalHoverPreview();
  centerChoiceKey='';centerChoiceRenderSig='';centerChoiceMagicRevealed=false;resetCenterChoiceVisualState();
  centerChoiceStage.className='gl-center-choice-stage';centerChoiceStage.setAttribute('aria-hidden','true');
  centerChoiceStage.querySelector('.gl-center-choice-cards').innerHTML='';centerChoiceStage.querySelector('.gl-center-choice-actions').innerHTML='';
  setCenterChoiceBodyMode('');
}
function renderCenterChoiceStage(s){
  const p=s?.pending,mode=centerChoiceModeFor(s);
  // Generic card-search/Legacy modals own the shared hover preview while the
  // center-choice stage is idle. Closing an already-closed center stage every
  // 120ms used to erase Replenish/Legacy hover even with the pointer stationary.
  if(!mode){
    if(centerChoiceKey||lastCenterChoiceBodyMode||centerChoiceStage.classList.contains('open'))closeCenterChoiceStage();
    return;
  }
  setCenterChoiceBodyMode(mode);
  centerChoiceStage.className='gl-center-choice-stage open gl-center-mode-'+mode+(centerChoiceBusy?' is-busy':'');
  centerChoiceStage.dataset.glActionPopup=['trial_rankup_return_exp','scouting_exp_selection'].includes(p?.type)?'1':'0';
  centerChoiceStage.setAttribute('aria-hidden','false');
  const title=centerChoiceStage.querySelector('.gl-center-choice-title'),helper=centerChoiceStage.querySelector('.gl-center-choice-helper'),status=centerChoiceStage.querySelector('.gl-center-choice-status'),cardsHost=centerChoiceStage.querySelector('.gl-center-choice-cards'),actions=centerChoiceStage.querySelector('.gl-center-choice-actions');
  let identity='',sig='',cards=[],selectedKeys=new Set(),clickableKeys=new Set(),titleText='',helperText='',statusText='',selectedTarget=null,otherTarget=null;
  const makeBtn=(text,cls,disabled,fn)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;b.disabled=!!disabled;b.onclick=fn;actions.appendChild(b);return b};

  if(mode==='purify'){
    const choices=p.status_choices||[],selected=p.selected_status_choice==null?-1:Number(p.selected_status_choice);
    identity='purify|'+String(p.target_side||'PLAYER')+'|'+String(p.target_lane||'')+'|'+String(p.source_card_id||'')+'|'+choices.map(x=>String(x.status_index)+':'+String(x.label)).join('|');
    sig=identity+'|'+String(selected);
    titleText='HOLY REJUVENATION — REMOVE STATUS';
    helperText='Healing resolved. Choose the negative Status to remove from '+String(p.target_lane||'the healed Hero')+'.';
    statusText=selected>=0?'1 / 1 SELECTED':'0 / 1 SELECTED';
    cards=choices.map((x,i)=>{
      const statusName=String(x.label||'Status').trim().split(/\s+/)[0];
      return {key:String(i),idx:i,front:purifyStatusArt(statusName),back:purifyStatusArt(statusName),faceUp:true,selected:i===selected,clickable:true,label:String(x.label||'Status')};
    });
    otherTarget=heroCardEl(p.target_side||'PLAYER',p.target_lane);
  }else if(mode==='legacy'){
    // The engine owns eligible Base-Class Legacy cards and the mandatory gate.
    // These are NOT the separate Legacy-Ability choices from Main Deck / Discard.
    const candidates=(p.candidates||[]),selected=selectedChoiceIndex(p),side=p.side||'PLAYER';
    const fallen=cv(p.defeated_card_id)?.name||'Hero';
    identity='legacy-defeat|'+String(p.choice_id||'')+'|'+side+'|'+String(p.lane||'')+'|'+candidates.map(x=>typeof x==='string'?x:(x.card_id||x.id||'')).join('|');
    sig=identity+'|'+String(selected)+'|'+String(!!p.committing);
    titleText='CHOOSE LEGACY CARD';
    helperText=fallen+' was defeated in '+String(p.lane||'the battlefield')+'. Choose the matching Base Class Legacy.';
    statusText=(selected==null?0:1)+' / 1 SELECTED';
    cards=candidates.map((raw,i)=>{
      const id=typeof raw==='string'?raw:(raw.card_id||raw.id);
      return {key:String(i),idx:i,card_id:id,front:art(id),back:'assets/ui/back-legacy.webp',faceUp:true,selected:i===selected,clickable:!p.committing,label:cv(id)?.name||id};
    });
    selectedTarget=heroCardEl(side,p.lane);
    otherTarget=zoneEl(side,'Legacy Deck');
  }else if(mode==='bard'){
    const ids=s.playerHand||[],chosen=new Set((p.selected_indices||[]).map(Number));
    const max=Number(p.max_count||1),rank=max>1?'MAESTRO':'BARD';
    identity='bard|'+p.source_lane+'|'+rank+'|'+ids.join('|');
    sig=identity+'|'+[...chosen].sort().join(',');
    titleText=String(p.ability_name|| (max>1?'ORCHESTRAL CRESCENDO':'PROLONGED SYMPHONY')).toUpperCase();
    helperText=max>1?'Discard up to 2 cards, then draw the same number.':'Discard up to 1 card, then draw 1 card.';
    statusText=chosen.size+' / '+max+' SELECTED';
    cards=ids.map((id,i)=>({key:String(i),idx:i,front:art(id),back:'assets/ui/back-main.webp',faceUp:true,selected:chosen.has(i),clickable:true,label:cv(id)?.name||id}));
    selectedTarget=centerChoiceDestinationForZone('PLAYER','Discard Pile');otherTarget=centerChoiceDestinationForZone('PLAYER','Hand');
  }else if(mode==='discard'){
    const response=p.type==='response_payment_choice';
    const legacy=p.type==='legacy_cost_selection';
    const cleanup=p.type==='hand_limit_discard';
    const search=p.type==='card_search_choice';
    const expReturn=p.type==='trial_rankup_return_exp';
    const scouting=p.type==='scouting_exp_selection';
    const available=scouting?(p.exp_choices||[]):expReturn?(p.candidates||[]):legacy?(p.cost_candidates||[]):response?(p.candidates||[]):
      search?(p.candidates||[]):(s.playerHand||[]).map((card_id,hand_index)=>({card_id,hand_index}));
    const chosen=scouting?(p.selected_exp_choice==null?[]:[Number(p.selected_exp_choice)]):expReturn?(p.selected_indices||[]):legacy?(p.selected_cost_indices||[]):response?(p.selected_indices||[]):
      cleanup?(p.selected||[]):(p.multi_select?(p.selected_indices||[]):
      p.selected_index==null?[]:[Number(p.selected_index)]);
    const selected=new Set(chosen.map(Number));
    const required=scouting?1:expReturn?Math.min(Number(p.quota||0),available.length):legacy?Number(p.required_cost||1):response?Number(p.required_discard_count||1):
      cleanup?Number(p.required||1):Number(p.required_count||1);
    const legacyMin=legacy?Math.max(1,Number(p.min_cost??required)):required;
    const responseCard=response?cv(p.response_option?.card_id):null;
    const sourceCard=legacy?cv(p.card_id):search?cv(p.source_card_id):null;
    const name=(responseCard||sourceCard)?.name||'Card';
    identity='discard|'+p.type+'|'+String(p.resolve_to||'')+'|'+name+'|'+
      available.map(c=>String(c.hand_index??c.index??c.discard_index??c.exp_index??'')+':'+c.card_id).join('|')+'|'+required+'|'+legacyMin;
    sig=identity+'|'+[...selected].sort((a,b)=>a-b).join(',');
    titleText=scouting?'SCOUTING — DISCARD OPPONENT EXP':expReturn?'RANK '+(Number(p.rank)===2?'II':'III')+' — RETURN EXP':cleanup?'HAND LIMIT — DISCARD':(legacy?'LEGACY — '+name.toUpperCase():
      response?name.toUpperCase()+' — DISCARD COST':name.toUpperCase()+' — CHOOSE DISCARD');
    helperText=scouting?'Select 1 normal Skill EXP Card from opponent '+String(p.target_lane||'')+'. Ultimate EXP cannot be discarded.':
      expReturn?'Select exactly '+required+' normal EXP Skill Card'+(required===1?'':'s')+' to return to Hand. Confirm unlocks only after all required cards are selected. Remaining EXP goes to Discard. Return is NOT Draw.':
      cleanup?'Discard exactly '+required+' card(s) to meet the Hand limit.':
      legacy?'Discard '+(legacyMin===required?String(required):(legacyMin+'–'+required))+' eligible '+String(p.ability?.cost?.discard_from_hand?.filter?.class_family||'')+' Skill'+(required===1?'':'s')+'.':
      response?'Select '+required+' other Hand card(s) as the Response cost. No cost is spent before confirmation.':
      'Choose the required Hand card to discard.';
    statusText=legacy?selected.size+' SELECTED':selected.size+' / '+required+' SELECTED';
    cards=available.map((c,i)=>({key:String(i),idx:i,card_id:c.card_id,front:art(c.card_id),
      back:'assets/ui/back-main.webp',faceUp:true,selected:selected.has(i),clickable:true,
      label:cv(c.card_id)?.name||c.card_id}));
    selectedTarget=centerChoiceDestinationForZone(scouting?(p.target_side||'AI'):'PLAYER',expReturn?'Hand':'Discard Pile');
    otherTarget=scouting?heroCardEl(p.target_side||'AI',p.target_lane):centerChoiceDestinationForZone('PLAYER',expReturn?'Discard Pile':'Hand');
  }else if(mode==='draw-replacement'){
    const id=String(p.drawn_card_id||'');
    identity='draw-replacement|'+String(p.source_lane||'')+'|'+String(p.abilityId||'')+'|'+id+'|'+String(p.hand_index);
    sig=identity;
    titleText=String(p.abilityName||'DRAW REVIEW').toUpperCase();
    helperText='Review the card you just drew. Choose to keep it or shuffle it back and redraw.';
    statusText='1 CARD DRAWN';
    cards=id?[{key:id,front:art(id),back:'assets/ui/back-main.webp',faceUp:true,selected:false,clickable:false,label:cv(id)?.name||id}]:[];
    selectedTarget=centerChoiceDestinationForZone('PLAYER','Main Deck');
    otherTarget=centerChoiceDestinationForZone('PLAYER','Hand');
  }else if(mode==='stoneblood'){
    const id=String(p.source_hero_card_id||s.playerHeroes?.[p.source_lane]?.card_id||'');
    identity='stoneblood|'+String(p.source_lane||'')+'|'+id;
    sig=identity;
    titleText='STONEBLOOD — PREVENT DEFEAT';
    helperText='Spend 1 Racial Token to prevent defeat and keep this Hero on the field with 30 HP.';
    statusText='DEFEAT PENDING';
    cards=id?[{key:id,front:art(id),back:'assets/ui/back-main.webp',faceUp:true,selected:false,clickable:false,label:cv(id)?.name||id}]:[];
  }else if(mode==='pay'){
    const responsePay=p.type==='response_payment_choice',info=E().getManaPlan?.(),plan=info?.plan||{},rawPool=info?.pool||s.playerManaPoolCards||[],pool=sortedShardPoolForDisplay(rawPool,'PLAYER'),spentUids=new Set((plan.selected_shard_uids||plan.shards?.map(x=>x.uid)||p.selected_shard_uids||[]).map(String)),cardId=responsePay?p.response_option?.card_id:p.card_id,cost=Number(responsePay?p.mana_cost:p.cost||0),discardNeed=Number(responsePay?p.required_discard_count||0:0),discardHave=Number(responsePay?(p.selected_indices||[]).length:0);
    identity='pay|'+(responsePay?'response':'normal')+'|'+pool.map(x=>x.uid).join('|')+'|'+String(cardId||'')+'|'+cost+'|'+String(p.action?.source_lane||p.response_option?.source_lane||'')+'|'+String(s.playerHeroes?.[p.action?.source_lane]?.card_id||'');
    sig=identity+'|'+[...spentUids].join(',')+'|'+discardHave+'/'+discardNeed+'|'+String(p.use_magical_surge||false)+'|'+String(info?.surge?.available||false)+'|'+String(info?.surge?.reason||'')+'|'+String(info?.surge?.selected&&info.surge.surge_mana_uid||'');
    titleText='PAY MANA';helperText=responsePay&&discardNeed>0?'Select the additional Hand cost, then confirm exact Mana.':'Class Mana can also be selected.';const surge=info?.surge,extra=surge?.selected&&surge?.surge_mana_uid?Number(surge.cost||1):0;statusText='MANA '+(Number(plan.value||0)+extra)+' / '+(cost+extra)+(extra?' (+'+extra+' '+surge.name+')':'');
    if(info?.surge?.selected&&info.surge.surge_mana_uid)spentUids.add(String(info.surge.surge_mana_uid));
    cards=pool.map((sh,i)=>({key:String(sh.uid),uid:String(sh.uid),idx:i,front:shardArt(sh),back:'assets/ui/back-shard.webp',faceUp:true,selected:spentUids.has(String(sh.uid)),clickable:true,label:(sh.class_name?sh.class_name+' Mana':'Mana')}));
    spentUids.forEach(x=>selectedKeys.add(String(x)));pool.forEach(x=>clickableKeys.add(String(x.uid)));
    selectedTarget=centerChoiceDestinationForZone('PLAYER','Shard Deck');otherTarget=centerChoiceDestinationForZone('PLAYER','Shard Pool');
  }else if(mode==='opponent-shard'){
    const target=p.target_side||'AI',pool=target==='PLAYER'?(s.playerManaPoolCards||[]):s.aiManaPoolCards||[],selectedIdx=new Set((p.selected_indices||[]).map(Number)),required=Math.min(Number(p.required_count||1),(p.candidates||[]).length);
    identity='opp-shard|'+target+'|'+(p.candidates||[]).map(x=>x.uid).join('|')+'|'+required;
    sig=identity+'|'+[...selectedIdx].join(',');
    titleText='CHOOSE OPPONENT SHARD';helperText='Choose from the face-down Shards.';statusText=selectedIdx.size+' / '+required+' SELECTED';
    cards=(p.candidates||[]).map((c,i)=>{const sh=pool.find(x=>String(x.uid)===String(c.uid));const key=String(c.uid||i);if(selectedIdx.has(i))selectedKeys.add(key);return{key,uid:key,idx:i,front:shardArt(sh),back:'assets/ui/back-shard.webp',faceUp:false,selected:selectedIdx.has(i),clickable:true,label:'Face-down opponent Shard'}});
    selectedTarget=centerChoiceDestinationForZone(target,'Shard Deck');otherTarget=centerChoiceDestinationForZone(target,'Shard Pool');
  }else if(mode==='opponent-hand'){
    const target=p.opponent_side||'AI',sel=p.selected_index!=null&&Number.isInteger(Number(p.selected_index))&&Number(p.selected_index)>=0?Number(p.selected_index):null,revealed=!!p.reveal_cards;
    identity='opp-hand|'+target+'|'+(p.candidates||[]).map(x=>x.card_id+':'+x.hand_index).join('|')+'|'+String(p.resolve_to||'');
    sig=identity+'|'+String(sel)+'|'+String(revealed);
    titleText=p.resolve_to==='opponent_deck'?'CHOOSE OPPONENT CARD':'CHOOSE A CARD TO DISCARD';helperText=revealed?'Cards are revealed by the current effect.':'Choose one face-down card.';statusText=(sel==null?0:1)+' / 1 SELECTED';
    cards=(p.candidates||[]).map((c,i)=>{const key=String(i);if(sel===i)selectedKeys.add(key);return{key,idx:i,front:revealed?art(c.card_id):'assets/ui/back-main.webp',back:'assets/ui/back-main.webp',faceUp:revealed,concealed:!revealed,selected:sel===i,clickable:true,label:revealed?(cv(c.card_id)?.name||'Opponent card'):'Face-down opponent card'}});
    selectedTarget=p.resolve_to==='opponent_deck'?centerChoiceDestinationForZone(target,'Main Deck'):centerChoiceDestinationForZone(target,'Discard Pile');otherTarget=centerChoiceDestinationForZone(target,'Hand');
  }else{
    const ids=p.revealed_cards||[];
    identity='magic-scope|'+ids.join('|')+'|'+String(p.commit_token||'');
    sig=identity+'|'+String(centerChoiceMagicRevealed);
    titleText='OPPONENT HAND REVEALED';helperText='Review the revealed cards, then close.';statusText=ids.length+' CARDS';
    cards=ids.map((id,i)=>({key:String(i),idx:i,front:art(id),back:'assets/ui/back-main.webp',faceUp:centerChoiceMagicRevealed,selected:false,clickable:false,label:cv(id)?.name||id}));
    otherTarget=centerChoiceDestinationForZone('AI','Hand');
  }

  const newSession=centerChoiceKey!==identity;if(newSession){classChoiceHoverOwner=null;hideModalHoverPreview();centerChoiceKey=identity;centerChoiceRenderSig='';resetCenterChoiceVisualState();if(mode==='magic-scope')centerChoiceMagicRevealed=false}
  sig=mode==='magic-scope'?identity+'|'+String(centerChoiceMagicRevealed):sig;
  if(centerChoiceRenderSig===sig)return;
  centerChoiceRenderSig=sig;title.parentElement?.classList.remove('is-fading');actions.classList.remove('is-fading');centerChoiceStage.classList.toggle('is-busy',!!centerChoiceBusy);title.textContent=titleText;helper.textContent=helperText;status.textContent=statusText;
  // The PAY MANA buttons are rebuilt when a Surge toggle/payment changes.
  // Do not leave a tooltip anchored to a now-detached button/wrapper.
  if(heroActionTipOwner&&actions.contains(heroActionTipOwner))closeHeroActionTip();
  cardsHost.innerHTML='';actions.innerHTML='';
  cardsHost.style.setProperty('--gl-choice-count',String(Math.max(1,cards.length)));
  cardsHost.innerHTML=cards.map(centerChoiceCardHtml).join('');
  if(hasUnifiedMobilePreviewStage()){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach((button,i)=>{
      const entry=cards[i];
      // Face-down hidden information must stay hidden: do not preview unrevealed cards.
      if(entry?.faceUp&&entry.front)bindClassChoiceHoverPreview(button,entry.card_id||null,entry.front);
    });
  }
  if(mode==='opponent-hand'&&p.reveal_cards){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach((c,i)=>{const id=p.candidates?.[i]?.card_id,front=c.querySelector('.gl-center-choice-front img');if(front&&id)bindContextualModalPreview(front,id)});
  }

  if(mode==='legacy'){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach((c,i)=>{
      const id=cards[i]?.card_id;
      if(id)bindClassChoiceHoverPreview(c,id);
      c.onclick=()=>{if(!centerChoiceBusy&&!p.committing)intent('selectLegacyDefeatChoice',[i])};
    });
    const selected=selectedChoiceIndex(p);
    makeBtn('CONFIRM LEGACY','gl-center-choice-primary',!!p.committing||selected==null||!cards[selected],async()=>{
      if(centerChoiceBusy)return;
      const current=st()?.pending;
      if(current?.type!=='legacy_defeat_choice'||current.choice_id!==p.choice_id||selectedChoiceIndex(current)!==selected)return;
      centerChoiceBusy=true;centerChoiceStage.classList.add('is-busy');
      centerChoiceStage.querySelector('.gl-center-choice-copy')?.classList.add('is-fading');
      centerChoiceStage.querySelector('.gl-center-choice-actions')?.classList.add('is-fading');
      await Promise.all([...cardsHost.querySelectorAll('.gl-center-choice-card')].map((card,i)=>
        animateCenterChoiceTo(card,i===selected?selectedTarget:otherTarget,i===selected?460:380)));
      const live=st()?.pending;
      if(live?.type==='legacy_defeat_choice'&&live.choice_id===p.choice_id&&selectedChoiceIndex(live)===selected){
        const committed=intent('handleChoiceConfirm',[]);
        if(committed!==false)return;
      }
      resetCenterChoiceVisualState();centerChoiceRenderSig='';renderCenterChoiceStage(st());
    });
  }else if(mode==='purify'){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach((c,i)=>{
      const status=p.status_choices?.[i];
      const caption=document.createElement('span');caption.className='gl-purify-status-caption';
      caption.textContent=String(status?.label||'Status');c.appendChild(caption);
      c.title=String(status?.detail||status?.label||'Remove status');
      c.onclick=()=>{if(!centerChoiceBusy)intent('selectSaintPurifyChoice',[i])};
    });
    makeBtn('REMOVE SELECTED STATUS','gl-center-choice-primary',p.selected_status_choice==null||!(p.status_choices||[])[Number(p.selected_status_choice)],()=>{
      // The bridge exposes the authoritative confirm dispatcher, not the
      // internal commitSaintPurifyChoice helper.
      if(!centerChoiceBusy)intent('handleChoiceConfirm',[]);
    });
  }else if(mode==='bard'){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach((c,i)=>{const id=cards[i]?.card_id||p.candidates?.[i]?.card_id||s.playerHand?.[i];if(id)bindClassChoiceHoverPreview(c,id)});
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach(c=>c.onclick=()=>{if(!centerChoiceBusy)intent('toggleS0BardDrawIndex',[Number(c.dataset.choiceIndex)])});
    makeBtn('SKIP','gl-center-choice-cancel',false,()=>{
      if(centerChoiceBusy)return;
      // Skip is allowed even after a tentative selection, without committing it.
      intent('cancelS0BardDrawChoice',[]);intent('commitS0BardDrawChoice',[true]);
    });
    makeBtn('DISCARD & DRAW','gl-center-choice-primary',!(p.selected_indices||[]).length,async()=>{
      if(centerChoiceBusy)return;
      const keys=new Set((p.selected_indices||[]).map(String));
      if(await animateCenterChoiceExit(keys,selectedTarget,otherTarget))intent('commitS0BardDrawChoice',[false]);
    });
  }else if(mode==='discard'){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach((c,i)=>{
      const id=cards[i]?.card_id;if(id)bindClassChoiceHoverPreview(c,id);
      c.onclick=()=>{
        if(centerChoiceBusy)return;
        if(p.type==='scouting_exp_selection')intent('selectScoutingExpChoice',[i]);
        else if(p.type==='trial_rankup_return_exp')intent('trialSelectRankUpReturn',[i]);
        else if(p.type==='legacy_cost_selection')intent('selectLegacyCostChoice',[i]);
        else if(p.type==='hand_limit_discard')intent('toggleDiscardIndex',[i]);
        else if(p.type==='response_payment_choice')intent('selectResponsePaymentChoice',[i]);
        else intent('selectCardSearchChoice',[i]);
      };
    });
    const legacy=p.type==='legacy_cost_selection',cleanup=p.type==='hand_limit_discard',response=p.type==='response_payment_choice',expReturn=p.type==='trial_rankup_return_exp',scouting=p.type==='scouting_exp_selection';
    const selectedCount=scouting?(p.selected_exp_choice==null?0:1):expReturn?(p.selected_indices||[]).length:legacy?(p.selected_cost_indices||[]).length:cleanup?(p.selected||[]).length:
      response?(p.selected_indices||[]).length:p.multi_select?(p.selected_indices||[]).length:
      p.selected_index==null?0:1;
    const need=scouting?1:expReturn?Math.min(Number(p.quota||0),(p.candidates||[]).length):legacy?Number(p.required_cost||1):cleanup?Number(p.required||1):
      response?Number(p.required_discard_count||1):Number(p.required_count||1);
    const minNeed=legacy?Math.max(1,Number(p.min_cost??need)):need;
    const canCancel=legacy||response||(p.type==='card_search_choice'&&p.resolve_to==='gods_blessing_precommit');
    if(canCancel)makeBtn('CANCEL','gl-center-choice-cancel',false,()=>{
      if(centerChoiceBusy)return;
      if(response){responseDiscardStageApprovedKey='';responseRollbackSnapshot=null;intent('cancelResponsePaymentChoice',[])}
      else intent('cancelPendingAction',[]);
    });
    const needsMana=response&&Number(p.mana_cost||0)>0;
    makeBtn(scouting?'DISCARD '+selectedCount+' / 1 EXP':expReturn?'RETURN '+selectedCount+' / '+need+' EXP':needsMana?'CONTINUE TO MANA':(cleanup?'DISCARD SELECTED':legacy?'DISCARD & ACTIVATE':'DISCARD & CONFIRM'),
      'gl-center-choice-primary',selectedCount<minNeed||selectedCount>need,async()=>{
        if(centerChoiceBusy)return;
        if(needsMana){
          // Do not discard or spend anything before the final PAY. The selected
          // additional cost stays in the authoritative pending payment.
          responseDiscardStageApprovedKey=responseDiscardStageKey(p);
          renderCenterChoiceStage(st());
          return;
        }
        // Return EXP is special: only after the state has committed do the
        // Hand's final card slots exist. Animate to those exact slots instead
        // of the Hand zone center, which previously caused a visible jump.
        if(expReturn&&selectedCount>0){animateTrialExpChoiceCommit(p,cardsHost,otherTarget);return;}
        const keys=new Set(cards.filter(c=>c.selected).map(c=>c.key));
        if(await animateCenterChoiceExit(keys,selectedTarget,otherTarget)){
          const committed=intent(response?'commitResponsePaymentChoice':'handleChoiceConfirm',[]),live=st()?.pending;
          // An invalid/stale physical choice remains pending. Reopen the same
          // selector and preserve the user's selections instead of freezing it.
          if(committed===false||(live&&live.type===p.type&&
            (response?live.response_option?.card_id===p.response_option?.card_id:
              legacy?live.card_id===p.card_id:true))){
            resetCenterChoiceVisualState();centerChoiceRenderSig='';renderCenterChoiceStage(st());
          }
        }
      });
  }else if(mode==='draw-replacement'){
    // The displayed card is not a choice target. Only the two decision buttons are interactive.
    makeBtn('KEEP CARD','gl-center-choice-cancel',false,()=>{if(!centerChoiceBusy)intent('commitDrawReplacementChoice',[false])});
    makeBtn('SHUFFLE & REDRAW','gl-center-choice-primary',false,async()=>{
      if(centerChoiceBusy)return;
      const current=cardsHost.querySelector('.gl-center-choice-card');
      centerChoiceBusy=true;centerChoiceStage.classList.add('is-busy');
      if(current)await animateCenterChoiceIntoDeck(current,selectedTarget);
      intent('commitDrawReplacementChoice',[true]);
    });
  }else if(mode==='stoneblood'){
    makeBtn('DECLINE & CONTINUE DEFEAT','gl-center-choice-cancel',false,()=>{if(!centerChoiceBusy)intent('resolveStonebloodChoice',[false])});
    makeBtn('SPEND 1 TOKEN & STAY AT 30 HP','gl-center-choice-primary',false,()=>{if(!centerChoiceBusy)intent('resolveStonebloodChoice',[true])});
  }else if(mode==='pay'){
    const responsePay=p.type==='response_payment_choice',discardReady=!responsePay||Number((p.selected_indices||[]).length)===Number(p.required_discard_count||0),planReady=!!E().getManaPlan?.()?.plan?.ok;
    cardsHost.querySelectorAll('.gl-center-choice-card.is-clickable').forEach(c=>c.onclick=()=>{if(centerChoiceBusy)return;intent(responsePay?'toggleResponseManaShardChoice':'toggleManaShardPaymentChoice',[c.dataset.choiceUid])});
    if(responsePay&&Number(p.required_discard_count||0)>0){
      makeBtn('BACK TO DISCARD','gl-center-choice-cancel',false,()=>{
        if(centerChoiceBusy)return;
        responseDiscardStageApprovedKey='';
        renderCenterChoiceStage(st());
      });
    }
    makeBtn('CANCEL','gl-center-choice-cancel',false,()=>{
      if(centerChoiceBusy)return;
      if(responsePay){responseDiscardStageApprovedKey='';responseRollbackSnapshot=null;intent('cancelResponsePaymentChoice',[]);}
      else intent('cancelPendingAction',[]);
    });
    if(!responsePay){
      const surge=E().getManaPlan?.()?.surge;
      if(surge){
        const label=String(surge.name||'MANA SURGE').toUpperCase()+' (+'+Number(surge.bonus||0)+')';
        const reason=surge.available?'Spend '+surge.cost+' additional Mana for +'+surge.bonus+' Magical damage.':(surge.reason||'Unavailable for this Attack.');
        const surgeBtn=makeBtn(label,'gl-center-choice-surge'+(surge.selected?' is-selected':''),!surge.available,()=>{if(!centerChoiceBusy)intent('toggleManaPaymentSurgeChoice',[])});
        surgeBtn.setAttribute('aria-pressed',surge.selected?'true':'false');
        surgeBtn.setAttribute('aria-label',label+'. '+reason);
        // Match the existing gold-on-dark Hero action tooltip rather than the
        // browser's unstyleable white native `title` tooltip. The wrapper owns
        // hover so the disabled button can still explain its unavailable state.
        const wrapper=document.createElement('span');wrapper.className='gl-center-surge-wrap';
        wrapper.setAttribute('aria-label',label+'. '+reason);
        surgeBtn.before(wrapper);wrapper.appendChild(surgeBtn);
        bindHeroActionTip(wrapper,{label,tooltip:reason});
        // Enabled buttons receive keyboard focus; disabled ones cannot, so the
        // wrapper itself must be keyboard reachable when Surge is unavailable.
        surgeBtn.setAttribute('aria-describedby','glHeroActionTip');
        if(surgeBtn.disabled){wrapper.tabIndex=0;wrapper.setAttribute('role','button');wrapper.setAttribute('aria-disabled','true')}
        else{
          surgeBtn.addEventListener('focus',()=>showHeroActionTip(wrapper,label,reason));
          surgeBtn.addEventListener('blur',()=>closeHeroActionTip(wrapper));
        }
      }
    }
    makeBtn('PAY','gl-center-choice-primary',!(planReady&&discardReady),async()=>{if(centerChoiceBusy)return;const liveInfo=E().getManaPlan?.()||{},live=liveInfo.plan||{},keys=new Set((live.selected_shard_uids||live.shards?.map(x=>x.uid)||[]).map(String));if(liveInfo.surge?.selected&&liveInfo.surge.surge_mana_uid)keys.add(String(liveInfo.surge.surge_mana_uid));if(await animateCenterChoiceExit(keys,selectedTarget,otherTarget,{returnSide:'PLAYER'})){const result=intent(responsePay?'commitResponsePaymentChoice':'commitManaShardPaymentChoice',[]),live=st()?.pending;if(result===false||(live&&live.type===p.type)){resetCenterChoiceVisualState();centerChoiceRenderSig='';renderCenterChoiceStage(st())}}});
  }else if(mode==='opponent-shard'){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach(c=>c.onclick=()=>{if(!centerChoiceBusy)intent('selectOpponentManaChoice',[Number(c.dataset.choiceIndex)])});
    const required=Math.min(Number(p.required_count||1),(p.candidates||[]).length),ready=(p.selected_indices||[]).length===required;
    makeBtn('CONFIRM','gl-center-choice-primary',!ready,async()=>{if(centerChoiceBusy)return;const keys=new Set((p.selected_indices||[]).map(i=>String(p.candidates?.[Number(i)]?.uid??i)));if(await animateCenterChoiceExit(keys,selectedTarget,otherTarget,{revealSelected:true,returnSide:p.target_side||'AI'}))intent('commitOpponentManaSelection',[])});
  }else if(mode==='opponent-hand'){
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach(c=>c.onclick=()=>{if(!centerChoiceBusy)intent('selectOpponentHandChoice',[Number(c.dataset.choiceIndex)])});
    const ready=p.selected_index!=null&&Number.isInteger(Number(p.selected_index))&&Number(p.selected_index)>=0;
    makeBtn('CONFIRM','gl-center-choice-primary',!ready,()=>{if(centerChoiceBusy)return;intent('commitOpponentHandChoice',[])});
  }else{
    cardsHost.querySelectorAll('.gl-center-choice-card').forEach((c,i)=>{const id=(p.revealed_cards||[])[i];const front=c.querySelector('.gl-center-choice-front img');if(front)bindContextualModalPreview(front,id)});
    makeBtn('CLOSE','gl-center-choice-primary',false,async()=>{if(centerChoiceBusy)return;centerChoiceBusy=true;centerChoiceStage.classList.add('is-busy');const all=[...cardsHost.querySelectorAll('.gl-center-choice-card')];await animateCenterChoiceFlip(all,false);await animateCenterChoiceShuffle(all);await Promise.all(all.map(c=>animateCenterChoiceTo(c,otherTarget)));intent('handleChoiceConfirm',[])});
  }

  if(newSession){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      animateCenterChoiceEntrance(centerChoiceOrigin(mode,p),mode,p);
      if(mode==='magic-scope')setTimeout(()=>{if(centerChoiceKey!==identity||centerChoiceBusy)return;centerChoiceMagicRevealed=true;[...cardsHost.querySelectorAll('.gl-center-choice-card')].forEach(c=>c.classList.add('is-face-up'));centerChoiceRenderSig=identity+'|true'},420);
    }));
  }else if(mode==='magic-scope'&&centerChoiceMagicRevealed){cardsHost.querySelectorAll('.gl-center-choice-card').forEach(c=>c.classList.add('is-face-up'))}
}
function ensureHeroPhysicalStack(laneEl,hc){
  let pack=laneEl.querySelector(':scope > .gl-hero-physical-stack');
  if(!pack){
    pack=document.createElement('div');pack.className='gl-hero-physical-stack hero-card-physical-stack is-ready';laneEl.appendChild(pack);
  }
  if(hc.parentElement!==pack)pack.appendChild(hc);
  return pack;
}
function renderExpStack(pack,h,exhaustedVisual){
  pack.querySelector(':scope > .gl-exp-stack')?.remove();
  const cards=Array.isArray(h?.exp_cards)?h.exp_cards.slice(0,4):[];
  if(!cards.length)return;
  const wrap=document.createElement('div');
  wrap.className='gl-exp-stack hero-exp-stack';
  for(let i=0;i<4;i++){
    const id=cards[i]||'';
    const slot=document.createElement('span');slot.className='gl-exp-slot hero-exp-slot'+(id?'':' is-empty');
    if(id){
      const c=E().cardView(id);
      slot.dataset.expValue=c?.isUltimate?'200':'100';
      slot.title=(c?.name||id)+' · '+slot.dataset.expValue+' EXP';
    }
    wrap.appendChild(slot);
  }
  pack.appendChild(wrap);
  // Exact v6.90.9 EXP geometry, with production gl-* class naming only.
  const heroEl=pack.querySelector(':scope > .hero-card');
  if(heroEl){
    const visibleW=Number(heroEl.offsetWidth||0),visibleH=Number(heroEl.offsetHeight||0);
    if(visibleW>0&&visibleH>0){
      wrap.style.setProperty('--gl-exp-stack-height',visibleH+'px');
      // The Hero container uses --hero-ratio: .68, whereas Season 0 Hero art
      // is 320x448 (5:7). object-fit:contain leaves small top/bottom gutters.
      // Measure the VISIBLE card art, not the taller container, so Ready EXP
      // edges can sit exactly 1 CSS px inside its upper and lower boundaries.
      // Keep the old dimensions for the Exhausted, rotated stack unchanged.
      const art=heroEl.querySelector('img');
      const naturalRatio=(art&&art.naturalWidth>0&&art.naturalHeight>0)
        ?art.naturalHeight/art.naturalWidth:7/5;
      const visibleArtH=Math.min(visibleH,visibleW*naturalRatio);
      wrap.style.setProperty('--gl-exp-ready-art-height',visibleArtH.toFixed(3)+'px');
      wrap.style.setProperty('--gl-exp-exhausted-stack-width',visibleH+'px');
      wrap.style.setProperty('--gl-exp-exhausted-half-height',(visibleW/2)+'px');
    }
  }
}
// EXP is public under a Hero, but the raised Player Hand can overlap the
// small lower-left counter. The counter is a real disabled button while ANY
// Hand card is elevated by hover/focus, preventing accidental battlefield taps.
let expInspectorLocation=null,expInspectorReturnFocus=null,expInspectorSignature='';
function playerHandIsRaised(){
  return !!playerHandTrack?.querySelector('.hand-card:hover,.hand-card.is-hovered,.hand-card.hand-hover-active,.hand-card:focus-within');
}
function syncExpButtonLock(){
  const locked=playerHandIsRaised();
  document.querySelectorAll('.hero-lane > button.gl-hero-exp-indicator').forEach(button=>{
    button.disabled=locked;
    button.setAttribute('aria-disabled',locked?'true':'false');
    button.title=locked?'Move away from the raised Hand card to inspect EXP.':(button.dataset.glExpTitle||'View EXP Cards');
  });
}
function closeExpInspector(){
  // Legacy Deck and EXP Inspector share the contextual hover layer.
  // Always dismiss it before opening Card Review or returning to the board.
  hideModalHoverPreview();
  const restore=expInspectorReturnFocus,loc=expInspectorLocation;
  expInspectorLocation=null;expInspectorReturnFocus=null;expInspectorSignature='';
  expInspectorOverlay.classList.remove('open');
  const button=loc?uiLaneElement(loc.side,loc.lane)?.querySelector(':scope > button.gl-hero-exp-indicator'):null;
  const candidate=button?.isConnected?button:restore;
  if(candidate?.isConnected&&typeof candidate.focus==='function')candidate.focus({preventScroll:true});
}
function renderExpInspector(){
  const loc=expInspectorLocation;if(!loc)return;
  const h=sideHeroes(st(),loc.side)?.[loc.lane];
  if(!h||h.legacy_mode){closeExpInspector();return;}
  const ids=Array.isArray(h.exp_cards)?h.exp_cards.slice():[],total=Math.max(0,Math.floor(Number(h.exp_total)||0));
  const data=ids.map(id=>({id:String(id),view:cv(id)}));
  const sig=JSON.stringify([loc.side,loc.lane,heroImageId(h),total,ids]);
  if(sig===expInspectorSignature)return;expInspectorSignature=sig;
  const heroName=cv(heroImageId(h))?.name||heroImageId(h)||'Hero';
  expInspectorOverlay.querySelector('#glExpInspectorTitle').textContent=(loc.side==='PLAYER'?'YOUR':'OPPONENT')+' '+loc.lane+' - '+heroName;
  const attachedTotal=data.reduce((sum,x)=>sum+(x.view?.isUltimate?200:100),0);
  const retained=Math.max(0,total-attachedTotal);
  const summary=expInspectorOverlay.querySelector('.gl-exp-inspector-summary');summary.replaceChildren();
  for(const [label,value] of [['TOTAL EXP',total],['ATTACHED CARDS',data.length],['ATTACHED EXP',attachedTotal],['RETAINED EXP',retained]]){
    const cell=document.createElement('div'),labelEl=document.createElement('span'),valueEl=document.createElement('strong');
    labelEl.textContent=label;valueEl.textContent=String(value);cell.append(labelEl,valueEl);summary.appendChild(cell);
  }
  const host=expInspectorOverlay.querySelector('.gl-exp-inspector-list');host.replaceChildren();
  if(!data.length){const empty=document.createElement('p');empty.className='gl-exp-inspector-empty';empty.textContent='No EXP Cards are currently attached to this Hero.';host.appendChild(empty);return;}
  data.forEach(({id,view},index)=>{
    const ultimate=!!view?.isUltimate,card=document.createElement('button');card.type='button';card.className='gl-exp-inspector-card';
    card.dataset.expCardId=id;card.dataset.expIndex=String(index);
    const img=document.createElement('img');setCardArtwork(img,art(id));img.alt=view?.name||id;img.draggable=false;
    const name=document.createElement('strong');name.textContent=view?.name||id;
    const sub=document.createElement('span');sub.textContent=(ultimate?'ULTIMATE - 200 EXP (cannot return)':'SKILL - 100 EXP');
    card.append(img,name,sub);card.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();closeExpInspector();openCardReview(id)});
    host.appendChild(card);
    // Exactly the Legacy Deck contextual enlarge behavior, reused rather than a new zoom UI.
    bindChoicePreview(img,id,'contextual');
  });
}
function openExpInspector(side,lane){
  if(playerHandIsRaised())return false;
  const hero=sideHeroes(st(),side)?.[lane];if(!hero||hero.legacy_mode)return false;
  hideModalHoverPreview();
  expInspectorReturnFocus=document.activeElement;expInspectorLocation={side,lane};expInspectorSignature='';
  renderExpInspector();expInspectorOverlay.classList.add('open');
  expInspectorOverlay.querySelector('.gl-exp-inspector-close')?.focus({preventScroll:true});
  return true;
}
expInspectorOverlay.querySelector('.gl-exp-inspector-close').addEventListener('click',closeExpInspector);
expInspectorOverlay.addEventListener('click',e=>{if(e.target===expInspectorOverlay)closeExpInspector()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&expInspectorOverlay.classList.contains('open')){e.stopPropagation();closeExpInspector()}});

function renderHero(side,lane,h,s){
  const laneEl=uiLaneElement(side,lane),hc=heroCardEl(side,lane);if(!laneEl||!hc)return;
  laneEl.classList.add('hero-panel');laneEl.dataset.side=side;laneEl.dataset.lane=lane;hc.classList.add('hero-main');
  const castingColors=castingTargetColors(s,side,lane);
  const selfHostAttachment=activeSelfHostAttachment(s,h,side,lane);
  laneEl.classList.toggle('gl-self-attachment-active',!!selfHostAttachment);
  if(selfHostAttachment)laneEl.dataset.glSelfAttachment=selfHostAttachment.card_id;
  else delete laneEl.dataset.glSelfAttachment;
  laneEl.classList.toggle('gl-casting-target',castingColors.length>0);
  laneEl.classList.toggle('gl-casting-multi',castingColors.length>1);
  if(castingColors.length){
    laneEl.dataset.glCastingHue=castingColors[0];
    laneEl.style.setProperty('--gl-casting-hue-a',castingColors[0]);
    laneEl.style.setProperty('--gl-casting-hue-b',castingColors[1]||castingColors[0]);
  }else{
    delete laneEl.dataset.glCastingHue;
    laneEl.style.removeProperty('--gl-casting-hue-a');
    laneEl.style.removeProperty('--gl-casting-hue-b');
  }
  const pack=ensureHeroPhysicalStack(laneEl,hc);pack.classList.add('hero-card-anchor');
  // A canceled/interrupted Rank Up animation must never leave a stale lane
  // transition class behind and conceal the attacked Hero's HP overlay.
  if(laneEl.classList.contains('gl-rank-transitioning') &&
     !pack.querySelector(':scope > .gl-rank-old-hero') &&
     !hc.classList.contains('gl-presentation-hidden'))
    laneEl.classList.remove('gl-rank-transitioning');
  const id=heroImageId(h),v=cv(id);let img=hc.querySelector(':scope > img');if(!img){img=document.createElement('img');hc.prepend(img)}
  if(id)setCardArtwork(img,art(id));img.alt=v?.name||'Hero';img.classList.add('heroImg');bindBattlefieldPreview(img,'hero',hc);
  // HP/state UI belongs to the lane overlay and never rotates with the physical Hero package.
  // Legacy is not a Hero and has no HP. Match the VS AI renderer: never show an HP bar / 0/0 in Legacy Mode.
  hc.querySelector(':scope > .hp')?.remove();
  const legacyMode=!!h?.legacy_mode;
  laneEl.classList.toggle('gl-legacy-slot',legacyMode);
  laneEl.querySelector(':scope > .gl-legacy-under-hero')?.remove();
  if(legacyMode){const under=h?.defeated_hero_snapshot?.card_id||h?.original_hero_card_id;if(under){const info=document.createElement('button');info.type='button';info.className='gl-legacy-under-hero';info.textContent='!';info.title='Hover to view Hero under this Legacy';info.setAttribute('aria-label','Hover to view Hero under this Legacy');const showUnder=()=>{setCardArtwork(img,art(under));img.alt=cv(under)?.name||'Hero under Legacy';laneEl.classList.add('gl-legacy-peek')};const restoreLegacy=()=>{setCardArtwork(img,art(id));img.alt=v?.name||'Legacy';laneEl.classList.remove('gl-legacy-peek')};info.addEventListener('mouseenter',showUnder);info.addEventListener('mouseleave',restoreLegacy);info.addEventListener('focus',showUnder);info.addEventListener('blur',restoreLegacy);info.onclick=e=>{e.preventDefault();e.stopPropagation()};laneEl.appendChild(info)}}
  let hp=laneEl.querySelector(':scope > .gl-hp-overlay');
  if(legacyMode){ if(hp)hp.remove(); hp=null; }
  else{
    if(!hp){hp=document.createElement('span');hp.className='gl-hp-overlay';laneEl.appendChild(hp)}
    const hpNow=Math.max(0,Number(h?.hp||0)),hpMax=Math.max(0,Number(h?.maxHp||h?.hp||0)),hpPct=hpMax>0?Math.max(0,Math.min(100,(hpNow/hpMax)*100)):0;
    hp.classList.toggle('is-warning',hpPct>40&&hpPct<=60);hp.classList.toggle('is-low',hpPct<=40);
    hp.style.setProperty('--hp-ratio',String(hpPct/100));
    hp.innerHTML='<span class="gl-hp-text">'+Math.round(hpNow)+'/'+Math.round(hpMax)+'</span><span class="gl-hp-track"><span class="gl-hp-fill"></span></span>';
  }
  // v2.13: the existing lower-left EXP label becomes a public EXP inspector
  // button. Keep the same location and hide it for 0 EXP or Legacy, as before.
  let expBadge=laneEl.querySelector(':scope > .gl-hero-exp-indicator');
  const expTotal=Math.max(0,Math.floor(Number(h?.exp_total||0)));
  if(legacyMode||expTotal===0){if(expBadge)expBadge.remove();}
  else{
    if(!expBadge||expBadge.tagName!=='BUTTON'){
      expBadge?.remove();expBadge=document.createElement('button');expBadge.type='button';
      expBadge.className='gl-hero-exp-indicator';laneEl.appendChild(expBadge);
    }
    const label=expTotal+' EXP';
    if(expBadge.textContent!==label)expBadge.textContent=label;
    expBadge.setAttribute('aria-label','View '+label+' cards for '+(cv(heroImageId(h))?.name||'Hero'));
    expBadge.setAttribute('aria-haspopup','dialog');expBadge.setAttribute('aria-controls','glExpInspectorDialog');
    const rank=Number(h?.rank||1),goal=rank<=1?300:(rank===2?700:null);
    expBadge.dataset.glExpTitle=(goal===null?label+' (Rank III)':label+' / '+goal+' to next Rank')+' - click to view EXP Cards';
    expBadge.onclick=e=>{e.preventDefault();e.stopPropagation();if(!playerHandIsRaised())openExpInspector(side,lane)};
    expBadge.disabled=playerHandIsRaised();
    expBadge.setAttribute('aria-disabled',expBadge.disabled?'true':'false');
    expBadge.title=expBadge.disabled?'Move away from the raised Hand card to inspect EXP.':expBadge.dataset.glExpTitle;
  }
  // Draw This Turn moved into the existing Hero-information ! tooltip in Stage 1.5.10.
  laneEl.querySelector(':scope > .gl-draw-this-turn')?.remove();
  laneEl.classList.remove('gl-selectable','gl-selected','gl-invalid');
  const p=s.pending,engineSelectable=heroSelectable(p,side,lane),selected=heroSelected(p,side,lane),responseLanes=responseChoiceLanes(s);
  const responseSelectable=side==='PLAYER'&&responseLanes.has(lane),selectable=engineSelectable||responseSelectable;
  const routeChoice=uiResponseSourceChoice,routeSource=routeChoice?.stage==='protected'&&s?.responseWindow?.options?.[routeChoice.selectedOptionIndex]?.source_lane;
  const routeSelected=side==='PLAYER'&&routeSource===lane;
  if(selectable)laneEl.classList.add('gl-selectable');if(selected||routeSelected)laneEl.classList.add('gl-selected');
  if(p&&pendingOwner(p)==='PLAYER'&&!selectable&&!selected&&['warp_scroll_selection','source_selection','target_selection','tribute_target','racial_target_selection','hero_ability_target_selection','legacy_hero_target_selection','exact_two_target_selection','double_casting_target_selection','scouting_target_selection'].includes(p.type))laneEl.classList.add('gl-invalid');
  let heroSingleAction=null;
  if(responseSelectable)heroSingleAction=()=>selectResponseRouteHero(side,lane);
  else if(directTributeHeroReady(p,side,lane))heroSingleAction=()=>runTributeLikeHeroAction(p,side,lane);
  else if(engineSelectable&&p?.type==='tribute_target')heroSingleAction=()=>runTributeLikeHeroAction(p,side,lane);
  else if(engineSelectable)heroSingleAction=()=>intent('chooseHeroFromBoard',[side,lane]);
  hc.onclick=heroSingleAction?e=>{e.preventDefault();e.stopPropagation();if(e.detail>1){clearTimeout(hc._glSingleClickTimer);hc._glSingleClickTimer=null;return}clearTimeout(hc._glSingleClickTimer);hc._glSingleClickTimer=setTimeout(()=>{hc._glSingleClickTimer=null;heroSingleAction()},210)}:null;
  // RC36 Patch 6: response-source selection belongs to the whole legal Hero
  // lane, not only the physically rotated Hero card. When a Crusader/Paladin
  // is Exhausted, the narrow rotated art and EXP/status overlays can leave
  // much of its highlighted lane unclickable (notably on a self-targeted
  // Attack). The engine response option remains the source of truth.
  // Single-target Defense still uses its existing protected-Hero stage;
  // team-wide Defense still resolves for ALL allies after source selection.
  const tributePanelAction=(engineSelectable&&p?.type==='tribute_target')||directTributeHeroReady(p,side,lane);
  const responsePanelAction=responseSelectable?()=>selectResponseRouteHero(side,lane):null;
  const tributeClickAction=tributePanelAction?()=>runTributeLikeHeroAction(p,side,lane):null;
  const panelClickAction=responsePanelAction||tributeClickAction;
  laneEl.onclick=panelClickAction?e=>{
    // Hero art has its own (single-click / double-click) handler; named
    // buttons retain their action and tooltips. All other lane space,
    // including EXP/HP/status decorative overlays, chooses the legal source.
    if(e.target.closest('.hero-card,.attachment-card,.gl-legacy-under-hero,.gl-hero-actions,button,a,[role="button"]'))return;
    e.preventDefault();e.stopPropagation();panelClickAction();
  }:null;
  hc.ondblclick=e=>{e.preventDefault();e.stopPropagation();clearTimeout(hc._glSingleClickTimer);hc._glSingleClickTimer=null;openCardReview(id)};
  img.draggable=false;
  const delayExhaust=heroCombatHeld(side,lane,s),exhaustedVisual=!!(h?.exhausted&&!delayExhaust);
  pack.classList.toggle('is-exhausted',exhaustedVisual);
  pack.classList.toggle('is-ready',!exhaustedVisual);
  renderExpStack(pack,h,exhaustedVisual);
  renderAttachments(laneEl,h,side,lane,s);renderStatuses(laneEl,h,s,side,lane,delayExhaust);renderHeroActions(laneEl,side,lane,s);
}
function targetSelectionLanes(p){
  // Runtime is the sole authority for Area of Attack / Range / special targeting.
  // Never cache or reinterpret legal lanes in the UI adapter.
  return Array.isArray(p?.legal_targets)?p.legal_targets:[];
}
function heroSelectable(p,side,lane){
  if(!p||pendingOwner(p)!=='PLAYER')return false;
  if(p.type==='warp_scroll_selection')return side==='PLAYER'&&(p.legal_targets||[]).includes(lane);
  if(p.type==='source_selection')return side==='PLAYER'&&(p.legal_sources||[]).includes(lane);
  if(p.type==='target_selection')
    return side===(p.target_side||'AI')&&targetSelectionLanes(p).includes(lane);
  if(p.type==='scouting_target_selection'||p.type==='double_casting_target_selection'||p.type==='racial_target_selection'||p.type==='hero_ability_target_selection'||p.type==='legacy_hero_target_selection')
    return side===(p.target_side||'AI')&&(p.legal_targets||[]).includes(lane);
  if(p.type==='tribute_target')return side==='PLAYER'&&(p.legal_targets||[]).includes(lane);
  if(directTributeHeroReady(p,side,lane))return true;
  if(p.type==='exact_two_target_selection')return side===p.target_side&&(p.legal_targets||[]).includes(lane);
  return false;
}
function heroSelected(p,side,lane){if(!p)return false;if(side===p.source_side&&lane===p.source_lane)return true;if((p.selected_target_lanes||[]).includes(lane)&&side===p.target_side)return true;return false}
function attachmentCounterValue(h,id,side,lane,slot,s){
  const first=(obj,keys,allowZero=true)=>{if(!obj)return null;for(const k of keys){if(obj[k]==null)continue;const n=Number(obj[k]);if(Number.isFinite(n)&&(allowZero?n>=0:n>0))return n}return null};
  const attached=h?.attachments?.[slot];
  const activeTimed=(s?.activeAttachments||[]).find(a=>a&&a.card_id===id&&a.side===side&&Number(a.slot)===Number(slot)&&(a.lane===lane||!a.lane));
  if(activeTimed&&activeTimed.counter_mode!=='progress'&&Number.isFinite(Number(activeTimed.remaining_count))&&activeTimed.remaining_count!=null){
    const cap=Number(activeTimed.initial_count??activeTimed.original_count??activeTimed.duration_total??0);
    if(cap>0)return Math.max(0,Math.min(6,cap-Number(activeTimed.remaining_count)));
  }
  let v=first(attached,['counters','remaining_count','remaining_turns','turns_remaining','duration','remaining'],true);if(v!=null)return Math.min(6,v);
  const casting=(s?.pendingCastings||[]).find(x=>x&&x.card_id===id&&x.side===side&&Number(x.attachmentSlot)===Number(slot)&&((x.original_source_lane||x.source_lane)===lane||x.source_hero_card_id===h?.card_id||x.source_instance_id===h?.instance_id));
  v=first(casting,['counters','remaining_count','remaining_turns','turns_remaining','duration','remaining'],true);if(v!=null)return Math.min(6,v);
  const active=(s?.activeAttachments||[]).find(a=>a&&a.card_id===id&&a.side===side&&Number(a.slot)===Number(slot)&&(a.lane===lane||!a.lane));
  v=first(active,['counters','remaining_count','remaining_turns','turns_remaining','duration','remaining'],true);if(v!=null)return Math.min(6,v);
  const status=(h?.statuses||[]).find(x=>x&&(x.card_id===id||x.source_card_id===id||x.source===id||(Array.isArray(x.sources)&&x.sources.includes(id))));
  v=first(status,['counters','remaining_count','remaining_turns','turns_remaining','duration','remaining'],false);return v==null?0:Math.min(6,v);
}
function renderAttachments(laneEl,h,side,lane,s){
  const rows=(h?.attachments||[]).slice(0,2).map((entry,slot)=>{
    const id=typeof entry==='string'?entry:entry?.card_id;if(!id)return null;
    const activeCasting=castingForAttachment(s,h,id,side,lane,slot);
    const counter=attachmentCounterValue(h,id,side,lane,slot,s);
    const timed=(s?.activeAttachments||[]).some(a=>a&&a.card_id===id&&a.side===side&&Number(a.slot)===slot&&(a.lane===lane||!a.lane)&&a.counter_mode!=='progress'&&Number(a.initial_count)>0&&a.remaining_count!=null);
    return {id,slot,counter,show:counter>0||timed||!!activeCasting,casting:!!activeCasting,hue:activeCasting?castingAttachmentColor(s,activeCasting):'',self:activeSelfHostAttachment(s,h,side,lane)?.card_id===id};
  }).filter(Boolean);
  const prior=new Map([...laneEl.querySelectorAll(':scope > .attachment-card')].map(d=>[d.dataset.glAttachmentSlot,d]));
  rows.forEach(row=>{
    const {id,slot,counter,show,casting,hue,self}=row,key=String(slot),v=cv(id);
    let d=prior.get(key);prior.delete(key);
    if(d&&d.dataset.glCardId!==id){if(battlefieldHoverSource&&d.contains(battlefieldHoverSource))hideBattlefieldHoverPreview();d.remove();d=null;}
    if(!d){d=document.createElement('div');d.className='attachment-card '+(slot===0?'left':'right');d.dataset.glCardId=id;d.dataset.glAttachmentSide=side;d.dataset.glAttachmentLane=lane;d.dataset.glAttachmentSlot=key;const im=document.createElement('img');setCardArtwork(im,art(id));im.alt=v?.name||'Attachment';d.appendChild(im);laneEl.appendChild(d);bindBattlefieldPreview(im,'attachment',d);}
    d.classList.toggle('gl-casting-active',casting);if(casting)d.dataset.glCastingHue=hue;else delete d.dataset.glCastingHue;
    d.classList.toggle('gl-self-attachment-active',self);
    let c=d.querySelector(':scope > .attachment-turn');
    if(show){if(!c){c=document.createElement('span');c.className='attachment-turn';d.appendChild(c);}c.textContent=counter;c.setAttribute('aria-label',(v?.name||'Attachment')+' counter '+counter);}else c?.remove();
  });
  prior.forEach(d=>{if(battlefieldHoverSource&&d.contains(battlefieldHoverSource))hideBattlefieldHoverPreview();d.remove();});
}
function renderStatuses(laneEl,h,s,side,lane,delayExhaust){
  laneEl.querySelector('.gl-status-stack')?.remove();
  const statuses=h?.statuses||[],negative=statuses.map((x,idx)=>({x,idx,name:getStatusName(x)})).filter(o=>negativeStatusName(o.name));
  const info=[];
  if(h?.exhausted&&!delayExhaust)info.push(h?.exhaust_reason?('Exhausted — '+String(h.exhaust_reason)):'Exhausted');
  if(h?.casting)info.push('Casting');
  if(heroHasDrawReplacementCounter(h))info.push('Draw This Turn: '+Math.max(0,Number(s?.cardsDrawnThisTurn?.[side]||0)));
  statuses.forEach(stt=>{const n=getStatusName(stt);if(n&&!negativeStatusName(n)&&!/^(Ready|Exhausted)$/i.test(n))info.push(n)});
  if(!negative.length&&!info.length)return;
  const wrap=document.createElement('div');wrap.className='gl-status-stack';
  if(info.length){
    const inf=document.createElement('div');inf.className='gl-info-indicator';
    const b=document.createElement('button');b.type='button';b.textContent='!';b.setAttribute('aria-label','Hero information');
    const tip=document.createElement('div');tip.className='gl-indicator-tooltip';tip.innerHTML='<strong>Hero Information</strong>'+info.map(x=>'<span>'+esc(x)+'</span>').join('');
    inf.append(b,tip);wrap.appendChild(inf);
  }
  negative.forEach(({x:stt,idx,name})=>{
    const holder=document.createElement('div');holder.className='gl-negative-status';
    const b=document.createElement('button');b.type='button';b.className='gl-status';b.setAttribute('aria-label',name);
    if(name==='Sleep'){
      const mark=document.createElement('span');mark.className='gl-sleep-status-glyph';mark.textContent='Zz';mark.setAttribute('aria-hidden','true');b.appendChild(mark);
    }else{
      const im=document.createElement('img');im.src=statusIcon(name);im.alt=name;b.appendChild(im);
    }
    const dur=Number(stt?.duration||0);if(dur>0){const sm=document.createElement('small');sm.textContent=dur;b.appendChild(sm)}
    const tip=document.createElement('div');tip.className='gl-indicator-tooltip';tip.innerHTML='<strong>'+esc(name+(dur>0?' '+dur:''))+'</strong><span>'+esc(E().getStatusDetail(stt)||name)+'</span>';
    const p=s.pending;
    if(p?.target_lane===lane&&p?.target_side===side){
      if(p.type==='status_removal_choice'){
        b.classList.add('gl-clickable');b.onclick=()=>{intent('selectStatusRemovalChoice',[idx]);intent('handleChoiceConfirm',[])};
      }
    }
    holder.append(b,tip);wrap.appendChild(holder);
  });
  laneEl.appendChild(wrap);
}
// Tooltip text for Hero-side actions comes from the current S0 DEV45 consumer
// print, not a second manually maintained gameplay rule table. The tooltip is
// detached from the Hero lane so no overflow or render polling can clip it.
const heroActionTip=document.createElement('div');
heroActionTip.className='gl-hero-action-tip';heroActionTip.id='glHeroActionTip';
heroActionTip.setAttribute('role','tooltip');heroActionTip.setAttribute('aria-hidden','true');
document.body.appendChild(heroActionTip);
let heroActionTipOwner=null;
function heroActionHelp(kind,hero,action,responseOption){
  const def=rawCardDef(hero?.card_id||heroImageId(hero)),
    src=kind==='racial'?def?.racial_ability:kind==='class'?def?.class_ability:null;
  if(src?.text){
    const text=String(src.text).trim();
    // Dragon Scale's numerical BLOCK is printed as a badge, not in its text.
    const badge=Number(src.printedBlockBadge);
    return kind==='racial'&&src.name==='Dragon Scale'&&Number.isFinite(badge)&&badge!==0
      ?text+' (BLOCK '+Math.abs(badge)+' damage.)':text;
  }
  if(kind==='racial'&&action?.text)return String(action.text).trim();
  if(kind==='legacy'){
    const legacy=rawCardDef(heroImageId(hero)||hero?.card_id)||def;
    const row=(legacy?.printed?.rows||[]).find(r=>String(r?.label||'').toUpperCase()==='LEGACY_ABILITY');
    if(row?.text)return String(row.text).trim();
  }
  if(kind==='response'&&responseOption?.card_id){
    const cardDef=rawCardDef(responseOption.card_id);
    const racial=cardDef?.racial_ability;
    if(responseOption.racial_ability&&racial?.text){
      const badge=Number(racial.printedBlockBadge),detail=String(racial.text).trim();
      return racial.name==='Dragon Scale'&&Number.isFinite(badge)&&badge!==0
        ?detail+' (BLOCK '+Math.abs(badge)+' damage.)':detail;
    }
    const rows=cardDef?.printed?.rows||[];
    if(rows.length===1&&rows[0]?.text)return String(rows[0].text).trim();
    if(cardDef?.effect_text)return String(cardDef.effect_text).trim();
  }
  return '';
}
function closeHeroActionTip(owner){
  if(owner&&heroActionTipOwner!==owner)return;
  heroActionTipOwner=null;heroActionTip.classList.remove('open');
  heroActionTip.setAttribute('aria-hidden','true');
}
function positionHeroActionTip(button){
  if(!button?.isConnected)return closeHeroActionTip();
  const b=button.getBoundingClientRect(),t=heroActionTip.getBoundingClientRect(),gap=10;
  let left=b.left-t.width-gap;
  if(left<8)left=b.right+gap;
  if(left+t.width>innerWidth-8)left=Math.max(8,innerWidth-t.width-8);
  const top=Math.max(8,Math.min(b.top+(b.height-t.height)/2,innerHeight-t.height-8));
  heroActionTip.style.left=Math.round(left)+'px';
  heroActionTip.style.top=Math.round(top)+'px';
}
function showHeroActionTip(button,title,description){
  if(!description)return;
  heroActionTipOwner=button;
  heroActionTip.replaceChildren();
  const strong=document.createElement('strong');strong.textContent=title;
  const text=document.createElement('span');text.textContent=description;
  heroActionTip.append(strong,text);
  heroActionTip.classList.add('open');heroActionTip.setAttribute('aria-hidden','false');
  positionHeroActionTip(button);
}
function bindHeroActionTip(button,action){
  if(!action.tooltip)return;
  button.setAttribute('aria-describedby','glHeroActionTip');
  button.addEventListener('mouseenter',()=>showHeroActionTip(button,action.label,action.tooltip));
  button.addEventListener('mousemove',()=>{if(heroActionTipOwner===button)positionHeroActionTip(button)});
  button.addEventListener('mouseleave',()=>closeHeroActionTip(button));
  button.addEventListener('focus',()=>showHeroActionTip(button,action.label,action.tooltip));
  button.addEventListener('blur',()=>closeHeroActionTip(button));
}
// RC22: fit text inside the original Hero-side one-line button footprint.
// The button column occupies only the already-reserved space to the right of
// the Hero artwork. Short labels stay at the normal CSS font/auto width.
const GL_S0_HERO_ACTION_ICON_DIR='assets/ui/hero-actions/';
const GL_S0_RACIAL_ICONS={beastman:'Racial Beastman Button.png',dragonborn:'Racial Dragonborn Button.png',dwarf:'Racial Dwarf Button.png',elf:'Racial Elf Button.png',halfling:'Racial Halfling Button.png',human:'Racial Human Button.png'};
function heroActionIconSrc(kind,hero){
  if(kind==='class')return GL_S0_HERO_ACTION_ICON_DIR+'Support Button.png';
  if(kind==='legacy')return GL_S0_HERO_ACTION_ICON_DIR+'Racial Legacy Button.png';
  if(kind!=='racial')return '';
  const def=rawCardDef(hero?.card_id||heroImageId(hero));
  const race=String(def?.race||def?.identity?.race||'').toLowerCase().trim();
  const icon=GL_S0_RACIAL_ICONS[race];
  return icon?GL_S0_HERO_ACTION_ICON_DIR+icon:'';
}
function fitHeroActionFonts(host){
  if(!host?.isConnected)return;
  const width=host.getBoundingClientRect().width;
  if(!width||host.dataset.glFittedWidth===String(Math.round(width*10)/10))return;
  host.dataset.glFittedWidth=String(Math.round(width*10)/10);
  const canvas=fitHeroActionFonts._canvas||(fitHeroActionFonts._canvas=document.createElement('canvas'));
  const ctx=canvas.getContext('2d');if(!ctx)return;
  host.querySelectorAll('.gl-hero-action:not(.gl-hero-action-icon)').forEach(b=>{
    b.classList.remove('gl-action-font-fitted');
    b.style.removeProperty('--gl-action-font-size');
    const st=getComputedStyle(b),base=(window.innerWidth<=820?8:8.75);
    const padding=(parseFloat(st.paddingLeft)||0)+(parseFloat(st.paddingRight)||0);
    const borders=(parseFloat(st.borderLeftWidth)||0)+(parseFloat(st.borderRightWidth)||0);
    const available=Math.max(1,width-padding-borders-1.5);
    ctx.font=st.fontWeight+' '+base+'px '+st.fontFamily;
    const label=b.textContent||'';
    const spacing=parseFloat(st.letterSpacing)||0;
    const natural=ctx.measureText(label).width+Math.max(0,label.length-1)*spacing;
    if(natural>available){
      const fitted=Math.min(base,Math.max(2.5,base*available/natural*.91));
      b.classList.add('gl-action-font-fitted');
      b.style.setProperty('--gl-action-font-size',fitted.toFixed(2)+'px');
    }
  });
}
function renderHeroActions(laneEl,side,lane,s){
  laneEl.classList.remove('gl-class-ability-ready','gl-racial-trait-ready');
  if(side!=='PLAYER'){laneEl.querySelector(':scope > .gl-hero-actions')?.remove();return;}
  const p=s.pending,rw=s.responseWindow,hero=sideHeroes(s,side)?.[lane],glowKey=heroContextGlowKey(hero);
  const items=[];let classReady=false,racialReady=false;

  // Response abilities that live on a Hero use the same top-right Hero action area as VS AI.
  // Glow is only approved for Aurex / Finnian when their Racial response is actually legal now.
  if(rw?.response_owner==='PLAYER'){
    (rw.options||[]).forEach((o,i)=>{
      if(o&&o.hand_index==null&&o.source_lane===lane){
        const isRacial=!!o.racial_ability;
        const label=isRacial?(heroRacialAbilityName(hero)||String(o.label||'').split(' — ')[0]||'RACIAL TRAIT'):(o.label||cv(o.card_id)?.name||o.response_kind||'RESPONSE');
        if(isRacial&&(glowKey==='AUREX'||glowKey==='FINNIAN'))racialReady=true;
        items.push({kind:isRacial?'racial':null,responseReady:true,key:'response:'+String(rw.response_window_token||rw.card_id||'')+':'+i+':'+String(o.card_id||'')+':'+lane,label,tooltip:heroActionHelp('response',hero,null,o)||'Use this response for the incoming Attack.',fn:()=>{responseRollbackSnapshot=B()?.getSnapshot?.()||null;confirmResponseOption(i)}});
      }
    });
  }

  if(pendingOwner(p)==='PLAYER'&&p?.source_side==='PLAYER'&&p?.type!=='s0_bard_draw_choice'&&p?.source_lane===lane){
    if(p.type==='optional_magical_surge'){
      classReady=glowKey==='LUCIEN';const ability=heroClassAbilityName(hero)||(String(rawCardDef(hero?.card_id)?.identity?.class||'').toLowerCase()==='arcane duelist'?'Arcane Surge':'Mana Surge');
      items.push({kind:'class',key:'magical-surge:use',label:ability||'MANA SURGE',tooltip:heroActionHelp('class',hero)||'Spend 1 additional Mana Shard to increase this Magical Attack damage.',fn:()=>intent('commitMagicalSurgeChoice',[true])},{key:'magical-surge:skip',label:'SKIP',tooltip:'Continue without activating this Surge ability.',fn:()=>intent('commitMagicalSurgeChoice',[false])});
    }else if(p.type==='draw_replacement_choice'){
      // RC21: the mandatory draw-review decision lives solely in the center stage.
      // No duplicate inline redraw / SKIP buttons on the Hero during this decision.
    }else if(p.type==='racial_stoneblood'){
      // The defeated Hero's Stoneblood decision lives exclusively in the center stage.
    }else if(p.type==='s0_bard_draw_choice'){
      // Only the ability buttons and Hand are spotlighted, not the full Hero lane.
      if(p.selection_active){
        items.push({key:'bard:confirm:'+String((p.selected_indices||[]).length),label:'CONFIRM',disabled:!(p.selected_indices||[]).length,fn:()=>intent('commitS0BardDrawChoice',[false])});
        items.push({key:'bard:cancel',label:'CANCEL',fn:()=>intent('cancelS0BardDrawChoice',[])});
      }else{
        items.push({kind:'class',key:'bard:activate',label:p.ability_name||heroClassAbilityName(hero)||'CLASS ABILITY',fn:()=>intent('activateS0BardDrawChoice',[])});
        items.push({key:'bard:skip',label:'SKIP',fn:()=>intent('commitS0BardDrawChoice',[true])});
      }
    }
  }

  if(!rw&&!s.pending&&s.turn==='PLAYER'){
    const a=E().getHeroActions(side,lane)||{};
    // Active abilities may still have their normal buttons, but owning one never turns the box on.
    (a.racialAbilities||[]).forEach(x=>items.push({kind:'racial',key:'racial:'+String(x.abilityId||x.label||x.name||''),label:x.label||x.name||heroRacialAbilityName(hero)||'RACIAL TRAIT',tooltip:heroActionHelp('racial',hero,x),fn:()=>intent('beginActivatedRacialAbility',[side,lane,x.abilityId])}));
    (a.classAbilities||[]).forEach(x=>items.push({kind:'class',key:'class:'+String(x.abilityId||x.label||x.name||''),label:x.label||x.name||heroClassAbilityName(hero)||'CLASS SKILL',tooltip:heroActionHelp('class',hero,x),fn:()=>intent('beginActivatedHeroAbility',[side,lane,x.abilityId])}));
    (a.legacyAbilities||[]).forEach(x=>items.push({kind:'legacy',key:'legacy:'+String(x.abilityId||x.label||x.name||''),label:x.label||x.name||'LEGACY',tooltip:heroActionHelp('legacy',hero,x),fn:()=>intent('beginActivatedLegacyAbility',[side,lane,x.abilityId])}));
  }
  laneEl.classList.toggle('gl-class-ability-ready',classReady);
  laneEl.classList.toggle('gl-racial-trait-ready',racialReady);
  const existing=laneEl.querySelector(':scope > .gl-hero-actions');
  if(!items.length){if(existing){if(existing.contains(heroActionTipOwner))closeHeroActionTip();existing.remove();}return;}
  const sig=JSON.stringify(items.map(x=>[x.key,x.label,x.kind||'',x.tooltip||'',!!x.disabled,!!x.responseReady,heroActionIconSrc(x.kind,hero)]));
  // Polling must not recreate a pressed button before its click event fires.
  if(existing?.dataset.glSig===sig){fitHeroActionFonts(existing);return;}
  if(existing){if(existing.contains(heroActionTipOwner))closeHeroActionTip();existing.remove();}
  const w=document.createElement('div');w.className='gl-hero-actions';w.dataset.glSig=sig;
  items.forEach(x=>{const b=document.createElement('button');b.type='button';b.className='gl-hero-action'+(x.responseReady?' gl-response-ready':'');const icon=heroActionIconSrc(x.kind,hero);if(icon){b.classList.add('gl-hero-action-icon');b.setAttribute('aria-label',x.label);const img=document.createElement('img');img.src=icon;img.alt='';img.className='gl-hero-action-image';img.draggable=false;b.appendChild(img)}else b.textContent=x.label;b.disabled=!!x.disabled;bindHeroActionTip(b,x);
    if(!icon&&String(x.label||'').length>14)b.classList.add('gl-long-action-name');
    b.onclick=e=>{e.preventDefault();e.stopPropagation();closeHeroActionTip(b);x.fn()};w.appendChild(b)});
  laneEl.appendChild(w);fitHeroActionFonts(w);
}

function currentActiveSource(s){
  const p=s.pending,r=s.responseWindow;
  if(p?.type==='response_payment_choice'){
    const o=p.response_option||{},rw=p.incoming_response_window||{};
    return{side:p.side||rw.target_side||'PLAYER',lane:o.source_lane||rw.target_lane||null};
  }
  if(r)return{side:r.source_side,lane:r.source_lane};
  if(p?.source_side&&p?.source_lane && !['manual_reposition','source_selection','target_selection','tribute_target'].includes(p.type))
    return{side:p.source_side,lane:p.source_lane};
  return null;
}
function chainActions(s){
  const out=[];
  function walk(rw){
    if(!rw)return;
    if(rw.response_continuation)walk(rw.response_continuation);
    else if(rw.action)out.push(normalizeAction(rw.action,rw.card_id));
    else if(rw.card_id)out.push(normalizeAction(rw,rw.card_id));
    if(rw.kind==='incoming_card'&&rw.card_id&&!rw.action&&!out.some(a=>a.card_id===rw.card_id&&a.side===rw.source_side&&a.lane===rw.source_lane))
      out.push(normalizeAction(rw,rw.card_id));
  }
  walk(s.responseWindow);
  const p=s.pending;
  if(p?.type==='response_payment_choice'&&p.response_option){
    const rw=p.incoming_response_window||{},o=p.response_option;
    {const responseSide=p.side||rw.target_side||'PLAYER',responseLane=o.source_lane||rw.target_lane||null,responseHero=responseLane?sideHeroes(s,responseSide)?.[responseLane]:null,isChainMail=o.card_id==='S0-ITM-016';out.push({card_id:o.card_id,side:responseSide,lane:isChainMail?null:responseLane,source_card_id:isChainMail?null:(o.source_card_id||heroImageId(responseHero)||null),target_side:responseSide,target_lane:responseLane,no_source:true});}
  }
  if(p?.type==='racial_stoneblood'&&p.after_stoneblood_response?.action){
    out.push(normalizeAction(p.after_stoneblood_response.action,p.after_stoneblood_response.action.card_id));
  }
  if(['optional_swap','optional_target_swap'].includes(p?.type)&&p.card_id){
    out.push({card_id:p.card_id,side:p.source_side||'PLAYER',lane:p.source_lane||null,target_side:p.target_side||null,target_lane:p.target_lane||null,no_source:!p.source_lane});
  }
  const pendingAction=pendingActionInfo(s,p);
  if(pendingAction)out.push(pendingAction);
  return dedupeActions(out);
}
function normalizeAction(a,id){return{card_id:id||a.card_id,side:a.source_side||a.side||'AI',lane:a.source_lane||null,source_card_id:a.source_card_id||null,target_side:a.target_side||null,target_lane:a.target_lane||null,target_lanes:Array.isArray(a.target_lanes)?a.target_lanes.slice():null,no_source:!a.source_lane}}
function dedupeActions(a){const seen=new Set();return a.filter(x=>{const k=[x.card_id,x.side,x.lane,x.target_side,x.target_lane].join('|');if(seen.has(k))return false;seen.add(k);return true})}
function combatChainStillActive(s){
  const p=s?.pending;
  return !!(s?.responseWindow || ['response_payment_choice','optional_swap','optional_target_swap','racial_stoneblood','double_casting_target_selection','exact_two_target_selection'].includes(p?.type) || pendingActionInfo(s,p));
}
function renderCombatStacks(s){
  document.querySelectorAll('.gl-combat-stack').forEach(x=>x.remove());
  const now=chainActions(s).map(a=>resolveActionSourceLane(s,a));
  if(combatChainStillActive(s)){
    const merged=heldCombatCards.map(a=>resolveActionSourceLane(s,a));
    now.forEach(a=>{
      // One logical action only. Target changes/redirects update the same action instead of cloning it.
      const idx=merged.findIndex(x=>x.card_id===a.card_id&&x.side===a.side&&x.lane===a.lane);
      if(idx>=0)merged[idx]={...merged[idx],...a};else merged.push(a);
    });
    heldCombatCards=merged;
  }else heldCombatCards=now.slice();
  const chain=heldCombatCards.slice(),groups={};
  chain.forEach(a=>{
    // v6.82: Item/Event visual source is the sidebar Active Card, not a Hero duplicate.
    const family=String(rawCardDef(a.card_id)?.family||cv(a.card_id)?.family||'').toLowerCase();if(family==='item'||family==='event')return;
    // A played card is rendered exactly once on the battlefield.
    // If it has a Hero source (Skill/Attack/Scouting/etc.), keep the card above that source Hero.
    // The target is represented only by the connector line + arrow; never clone the card at the line end.
    // Source-less targeted Item/Event cards anchor to their Hero target. Cards with neither source nor target
    // remain only in Active Card.
    let anchorSide=null,anchorLane=null;
    if(a.lane&&!a.no_source){anchorSide=a.side;anchorLane=a.lane;}
    else if(a.target_side&&a.target_lane){anchorSide=a.target_side;anchorLane=a.target_lane;}
    if(!anchorSide||!anchorLane)return;
    const k=anchorSide+'|'+anchorLane;(groups[k]??=[]).push(a);
  });
  Object.entries(groups).forEach(([k,arr])=>{
    const [side,lane]=k.split('|'),host=uiLaneElement(side,lane);if(!host)return;
    const stack=document.createElement('div');stack.className='gl-combat-stack';
    arr.forEach((a,i)=>{
      const v=cv(a.card_id);if(!v)return;
      const c=document.createElement('div');c.className='gl-combat-card';c.style.setProperty('--gl-stack-y',(i*13)+'px');c.style.setProperty('--gl-stack-i',String(i));
      const im=document.createElement('img');setCardArtwork(im,art(a.card_id));im.alt=v.name;c.appendChild(im);c.addEventListener('dblclick',e=>{e.preventDefault();e.stopPropagation();openCardReview(a.card_id)});stack.appendChild(c);bindPreview(im);
    });
    host.appendChild(stack);
  });
  if(!combatChainStillActive(s))heldCombatCards=[];
  lastChainKey=JSON.stringify(chain);return chain;
}
function itemEventArrowContexts(a){
  if(!a?.card_id)return[];
  const raw=rawCardDef(a.card_id)||{},family=String(raw.family||cv(a.card_id)?.family||'').toLowerCase();
  if(family!=='item'&&family!=='event')return[];
  // History records sometimes carry an attacker's lane for a resolved defensive
  // Response; never interpret that as the defended Hero's visual target.
  if(isDefenseResponseArrowCard(a.card_id))return[];
  if((cv(a.card_id)?.name||'').trim().toLowerCase()==='flashpowder bomb')return[];
  // Designer-approved RC20 zone arrows. Explicit IDs prevent incidental words
  // like 'discard' from creating unrelated or duplicated connector targets.
  // Begin Anew intentionally has no arrow (both Hand and Main Deck are involved).
  if(a.card_id==='S0-EVT-001')return[];
  const rc20Zones={
    'S0-EVT-002':{zone:'Main Deck'},          // Market Bargain
    'S0-EVT-008':{zone:'Racial Tokens'},      // Forged Alliance
    'S0-EVT-010':{zone:'Discard Pile'},       // Deja Vu
    'S0-ITM-006':{zone:'Hand',opponent:true},  // Magic Scope
    'S0-ITM-009':{zone:'Main Deck'},          // Crystal Ball
    'S0-ITM-018':{zone:'Main Deck'}           // Magic Compass
  };
  const named=rc20Zones[a.card_id];
  if(named){
    const fromSide=a.side==='AI'?'AI':'PLAYER';
    return [{source_kind:'active-card',target_kind:'zone',target_side:named.opponent?(fromSide==='PLAYER'?'AI':'PLAYER'):fromSide,target_zone:named.zone,card_id:a.card_id}];
  }
  const lanes=(a.target_lanes&&a.target_lanes.length)?a.target_lanes:(a.target_lane?[a.target_lane]:[]);
  if(a.target_side&&lanes.length)return lanes.filter(Boolean).map(target_lane=>({source_kind:'active-card',target_kind:'hero',target_side:a.target_side,target_lane,card_id:a.card_id}));
  // Prefer canonical target metadata over effect prose. This prevents cards such as
  // Scouting (whose text says "discard" but whose target is a Hero EXP stack) from
  // being misread as a Discard Pile destination.
  const rawTarget=String(raw?.resolver?.raw_target_type||raw?.runtime_resolver?.raw_target_type||'').toLowerCase();
  // Only structured explicit targets are visual targets. Words such as
  // 'discard' in Flashpowder Bomb describe an outcome, not an arrow endpoint.
  const targetText=rawTarget;
  if(/hero/.test(rawTarget))return[];
  let zone='';
  if(/shard pool|mana pool/.test(targetText))zone='Shard Pool';
  else if(/self deck|your deck|owner deck|\bdeck\b/.test(targetText)&&!/shard deck|legacy deck/.test(targetText))zone='Main Deck';
  if(!zone)return[];
  return[{source_kind:'active-card',target_kind:'zone',target_side:a.side||'PLAYER',target_zone:zone,card_id:a.card_id}];
}
function targetElementForContext(ctx){
  if(ctx?.target_kind==='zone'){
    if(ctx.target_zone==='Shard Pool')return ctx.target_side==='AI'?document.querySelector('.opponent-mana-pool'):document.querySelector('.player-mana-pool');
    if(ctx.target_zone==='Racial Tokens')return document.querySelector(ctx.target_side==='AI'?'.opponent-left-rail .racial-row':'.player-right-rail .racial-row');
    if(ctx.target_zone==='Hand')return document.querySelector(ctx.target_side==='AI'?'.hand.top .hand-track':'.hand.bottom .hand-track');
    return zoneEl(ctx.target_side,ctx.target_zone);
  }
  return heroCardEl(ctx?.target_side,ctx?.target_lane)?.parentElement||heroCardEl(ctx?.target_side,ctx?.target_lane);
}
function sourceElementForContext(ctx){
  if(ctx?.source_kind==='active-card')return activeStage?.querySelector('.active-card-visual')||null;
  return heroCardEl(ctx?.source_side,ctx?.source_lane)?.parentElement||heroCardEl(ctx?.source_side,ctx?.source_lane);
}
function activeTargetContexts(s,chain){
  const p=s?.pending;
  if(transientDefenseConnector){
    if(combatChainStillActive(s)||p?.type==='response_payment_choice'||s?.responseWindow)return[{source_kind:'active-card',target_kind:'hero',target_side:transientDefenseConnector.target_side,target_lane:transientDefenseConnector.target_lane,card_id:transientDefenseConnector.card_id}];
    transientDefenseConnector=null;
  }
  // Pre-commit Mana selection is still the acting player's decision. Do not show a source->target
  // connector until payment is committed and the opponent actually owns a Response/decision window.
  if(['mana_shard_payment_choice','mana_spend_choice'].includes(p?.type)&&!s?.responseWindow)return[];
  const rw=s?.responseWindow;
  if(rw?.card_id){
    const rwFamily=String(rawCardDef(rw.card_id)?.family||cv(rw.card_id)?.family||'').toLowerCase();
    if(rwFamily==='item'||rwFamily==='event'){
      const rwAction=normalizeAction(rw.action||rw,rw.card_id),rwContexts=itemEventArrowContexts(rwAction);
      if(rwContexts.length)return rwContexts;
    }
  }
  // A committed Defense Item is visualized from its Active Card to the
  // protected Hero once. Do not also paint a second arrow to the attacker.
  if(p?.type==='response_payment_choice'&&isDefenseResponseArrowCard(p.response_option?.card_id)){
    const defended=protectedHeroFromResponse(p.incoming_response_window||s?.responseWindow);
    if(defended)return [{source_kind:'active-card',target_kind:'hero',...defended,card_id:p.response_option.card_id}];
  }
  // While choosing an allied Defense destination, show the real chosen
  // casting Hero -> attacked ally route (instead of the incoming enemy arrow).
  if(uiResponseSourceChoice?.stage==='protected'&&rw?.response_owner==='PLAYER'){
    const opt=rw.options?.[uiResponseSourceChoice.selectedOptionIndex];
    if(opt?.source_lane&&rw.target_lane)return [{source_side:'PLAYER',source_lane:opt.source_lane,target_side:'PLAYER',target_lane:rw.target_lane}];
  }
  const attack=findActiveAttackWindow(s);
  if(attack?.source_lane&&attack?.target_side){
    // Area / multi-target Attacks are resolved by the authoritative runtime one Hero at a time.
    // Follow the *current* response frame instead of drawing the whole queued affected_lanes list,
    // otherwise the player cannot tell which Hero a Defense/Response currently protects.
    if(attack.multi_sequence&&attack.target_lane){
      return[{source_side:attack.source_side,source_lane:attack.source_lane,target_side:attack.target_side,target_lane:attack.target_lane}];
    }
    const multi=(attack.affected_lanes&&attack.affected_lanes.length?attack.affected_lanes:[]).filter(Boolean);
    const lanes=multi.length?multi:(attack.target_lane?[attack.target_lane]:[]);
    if(lanes.length)return lanes.map(target_lane=>({source_side:attack.source_side,source_lane:attack.source_lane,target_side:attack.target_side,target_lane}));
  }
  if(p?.type==='exact_two_target_selection'&&p.source_side&&p.source_lane&&p.target_side&&(p.selected_target_lanes||[]).length){
    return (p.selected_target_lanes||[]).map(target_lane=>({source_side:p.source_side,source_lane:p.source_lane,target_side:p.target_side,target_lane}));
  }
  const candidates=[...(chain||[])].map(a=>resolveActionSourceLane(s,a)).reverse();
  // Begin Anew affects both Hand and Main Deck: never infer a one-sided arrow.
  if(candidates[0]?.card_id==='S0-EVT-001')return[];
  const activeCardContexts=itemEventArrowContexts(candidates[0]);if(activeCardContexts.length)return activeCardContexts;
  const targeted=candidates.find(a=>a?.lane&&a?.target_side&&(a?.target_lane||(a?.target_lanes||[]).length));
  if(targeted){
    const lanes=(targeted.target_lanes&&targeted.target_lanes.length)?targeted.target_lanes:(targeted.target_lane?[targeted.target_lane]:[]);
    return lanes.map(target_lane=>({source_side:targeted.side,source_lane:targeted.lane,target_side:targeted.target_side,target_lane}));
  }
  const pa=pendingActionInfo(s,p),paActiveCardContexts=itemEventArrowContexts(pa);if(paActiveCardContexts.length)return paActiveCardContexts;
  if(pa?.lane&&pa?.target_side&&(pa?.target_lane||(pa?.target_lanes||[]).length)){
    const lanes=(pa.target_lanes&&pa.target_lanes.length)?pa.target_lanes:[pa.target_lane];
    return lanes.filter(Boolean).map(target_lane=>({source_side:pa.side,source_lane:pa.lane,target_side:pa.target_side,target_lane}));
  }
  // If an Item/Event has just resolved, briefly preserve its Active Card -> target connector.
  // This covers fast AI actions (notably Scouting) whose pending selection can disappear before the UI paint.
  const recent=latestResolvedActionThisPhase(s);
  if(recent?.card_id){
    const recentAction=normalizeAction(recent,recent.card_id),recentContexts=itemEventArrowContexts(recentAction);
    if(recentContexts.length){
      const key=String(recent.id||recent.timestamp||'')+'|'+recent.card_id+'|'+String(recent.target_side||'')+'|'+String(recent.target_lane||'');
      if(key!==transientConnectorKey){transientConnectorKey=key;transientConnectorUntil=performance.now()+900}
      if(performance.now()<transientConnectorUntil)return recentContexts;
    }
  }
  return [];
}
function renderAttackLine(s,chain){
  svg.querySelectorAll(':scope > path').forEach(x=>x.remove());
  const contexts=activeTargetContexts(s,chain);if(!contexts.length)return;
  const vp=uiViewportSize();svg.setAttribute('viewBox','0 0 '+vp.width+' '+vp.height);
  const seen=new Set();
  contexts.forEach(ctx=>{
    const key=[ctx.source_kind||'hero',ctx.source_side||'',ctx.source_lane||'',ctx.target_kind||'hero',ctx.target_side||'',ctx.target_lane||'',ctx.target_zone||''].join('|');if(seen.has(key))return;seen.add(key);
    const src=sourceElementForContext(ctx),tar=targetElementForContext(ctx);
    if(!src||!tar)return;
    const from=uiRect(src),to=uiRect(tar);
    if(from.width<1||to.width<1)return;
    const x1=from.left+from.width/2,y1=from.top+from.height/2,x2=to.left+to.width/2,y2=to.top+to.height/2,dx=x2-x1,dy=y2-y1,dist=Math.sqrt(dx*dx+dy*dy)||1;
    const a=Math.min(from.width,from.height)*.28,b=Math.min(to.width,to.height)*.28;
    const sx=x1+dx/dist*a,sy=y1+dy/dist*a,ex=x2-dx/dist*b,ey=y2-dy/dist*b,lift=Math.max(16,Math.min(70,dist*.12));
    const line=document.createElementNS(svg.namespaceURI,'path');line.setAttribute('class','gl-pending-attack-line is-looping');line.setAttribute('marker-end','url(#glVsaiAttackArrow)');line.setAttribute('d',`M ${sx} ${sy} Q ${(sx+ex)/2} ${(sy+ey)/2-lift} ${ex} ${ey}`);svg.appendChild(line);
  });
}
function updateCommittedHandSlotVisibility(side){
  const host=side==='AI'?oppHandTrack:playerHandTrack,hidden=glHiddenCommittedDrawSlots[side];
  host?.querySelectorAll(':scope > .hand-card[data-hand-index]').forEach(el=>{
    if(el.classList.contains('gl-draw-reservation-slot'))return;
    el.classList.toggle('gl-presentation-hidden',hidden.has(Number(el.dataset.handIndex)));
  });
}
function renderHand(s){
  updateCommittedHandSlotVisibility('PLAYER');
  const model=E().getHandModel(),rw=s.responseWindow,p=s.pending,responseMap=new Map();
  if(rw?.response_owner==='PLAYER')(rw.options||[]).forEach((o,i)=>{if(Number.isInteger(Number(o.hand_index))){const k=Number(o.hand_index);if(!responseMap.has(k))responseMap.set(k,[]);responseMap.get(k).push(i)}});
  const responseNeedsDiscard=p?.type==='response_payment_choice'&&Number(p.required_discard_count||0)>0;
  const discardSet=new Set(),discardMode=p&&(['hand_limit_discard','legacy_cost_selection'].includes(p.type)||responseNeedsDiscard)&&pendingOwner(p)==='PLAYER';
  if(discardMode){
    if(p.type==='hand_limit_discard')(s.playerHand||[]).forEach((_,i)=>discardSet.add(i));
    if(p.type==='response_payment_choice')(p.candidates||[]).forEach(x=>discardSet.add(Number(x.hand_index)));
    if(p.type==='legacy_cost_selection')(p.cost_candidates||[]).forEach(x=>discardSet.add(Number(x.hand_index??x.index)));
  }
  const bardSelection=p?.type==='s0_bard_draw_choice'&&pendingOwner(p)==='PLAYER'&&p.selection_active===true;
  const bardSelected=new Set(bardSelection?(p.selected_indices||[]):[]);
  const directChoice=isDirectHandCardSearch(p)&&pendingOwner(p)==='PLAYER';
  const directCandidates=new Map();
  if(directChoice)(p.candidates||[]).forEach((x,i)=>directCandidates.set(Number(x.hand_index),i));
  const directSelected=selectedChoiceIndex(p);
  const pendingDraws=glPendingDrawReservations.PLAYER||[];
  const signature=(s.playerHand||[]).map((id,idx)=>{
    const m=model[idx]||{},r=(responseMap.get(idx)||[]).join(','),d=discardSet.has(idx)?1:0,dc=directCandidates.has(idx)?directCandidates.get(idx):'';
    const ds=(discardSelectionState(p,idx).selected||bardSelected.has(idx))?1:0;
    const manaOnlyBlock=!m.canPlay&&Array.isArray(m.playReasons)&&m.playReasons.length>0&&m.playReasons.every(reason=>/not enough mana/i.test(String(reason||'')));
    return [id,m.canPlay?1:0,manaOnlyBlock?1:0,m.canTribute?1:0,r,d,dc,directSelected===dc?1:0,ds,'' ].join(':');
  }).join('|')+'#'+String(p?.type||'')+'#'+String(p?.resolve_to||'')+'#BARD:'+String(bardSelection)+'#'+String(rw?.response_window_token||rw?.card_id||'')+'#'+String(uiResponseSourceChoice?.handIndex??'')+'#'+String(uiResponseSourceChoice?.stage||'')+'#'+String(uiResponseSourceChoice?.selectedOptionIndex??'')+'#'+JSON.stringify(p?.selected_indices||p?.selected_cost_indices||p?.selected||[])+'#PR:'+pendingDraws.map(x=>x.id).join(',');
  if(signature===handRenderKey)return;handRenderKey=signature;
  playerHandTrack.innerHTML='';
  (s.playerHand||[]).forEach((id,idx)=>{
    const v=cv(id),m=model[idx]||{},card=document.createElement('div');card.className='hand-card';card.dataset.index=idx;card.dataset.handIndex=idx;if(glHiddenCommittedDrawSlots.PLAYER.has(idx))card.classList.add('gl-presentation-hidden');
    const discardSel=discardSelectionState(p,idx);if(discardSel.selected&&!bardSelection)card.classList.add('is-selected','gl-discard-selected');
    const actions=document.createElement('div');actions.className='card-actions';let actionCount=0;
    if(rw?.response_owner==='PLAYER'){
      const opts=responseMap.get(idx)||[];
      if(opts.length){addAction(actions,'PLAY','play',()=>beginResponseFromHand(idx,opts));actionCount++}
    }else if(isHandDiscardPending(p)&&pendingOwner(p)==='PLAYER'){
      // Unified center-stage discard owns this Hand. No hidden double-click costs.
    }else if(bardSelection){
      // Center-stage card choice is authoritative; the underlying Hand is deliberately inert.
    }else if(directChoice&&directCandidates.has(idx)){
      const choiceIndex=directCandidates.get(idx);
      if(p.resolve_to==='source_exp'){
        addAction(actions,'TRIBUTE','tribute',()=>intent('selectCardSearchChoice',[choiceIndex]));actionCount++;
        if(directSelected===choiceIndex)card.classList.add('is-selected');
      }else if(p.resolve_to==='discard_then_draw_three'){
        addAction(actions,'DISCARD','discard',()=>{intent('selectCardSearchChoice',[choiceIndex]);intent('handleChoiceConfirm',[])});actionCount++;
      }
    }else if(discardMode&&discardSet.has(idx)){
      addAction(actions,discardSel.selected?'CANCEL':'DISCARD',discardSel.selected?'cancel':'discard',()=>handleDiscardClick(p,idx));actionCount++;
    }else if(!s.pending&&!s.responseWindow&&s.turn==='PLAYER'){
      const manaOnlyBlock=!m.canPlay&&Array.isArray(m.playReasons)&&m.playReasons.length>0&&m.playReasons.every(reason=>/not enough mana/i.test(String(reason||'')));
      if(m.canPlay){addAction(actions,'PLAY','play',()=>intent('beginPlayFromHand',[idx]));actionCount++}
      else if(manaOnlyBlock){addAction(actions,'PLAY','play gl-mana-disabled',()=>{}, {disabled:true,reason:'Not enough Mana'});actionCount++}
      if(m.canTribute){addAction(actions,'TRIBUTE','tribute',()=>intent('beginTributeFromHand',[idx]));actionCount++}
    }
    if(actionCount)card.classList.add('gl-has-action');
    card.appendChild(actions);card.dataset.glCardId=id;
    const im=document.createElement('img');im.className='hand-art';im.decoding='async';im.loading='eager';setCardArtwork(im,art(id));im.alt=v?.name||'Card';im.draggable=false;
    card.appendChild(im);bindBattlefieldPreview(im,'hand',card);bindBattlefieldHandHover(card);card.ondblclick=e=>{e.preventDefault();e.stopPropagation();if(!choiceOverlay.classList.contains('gl-choice-to-hand'))openCardReview(id)};
    playerHandTrack.appendChild(card);
  });
  pendingDraws.forEach((r,i)=>{
    const idx=(s.playerHand||[]).length+i,slot=document.createElement('div');slot.className='hand-card gl-draw-reservation-slot gl-presentation-hidden';slot.dataset.handIndex=idx;slot.dataset.drawReservationId=String(r.id||'');
    const im=document.createElement('img');im.className='hand-art';im.src='assets/ui/back-main.webp';im.alt='Incoming card';slot.appendChild(im);playerHandTrack.appendChild(slot);
  });
  applyHandFan(playerHandTrack,'PLAYER');
  requestAnimationFrame(syncPlayerHandToHeroCenter);
}
function addAction(host,label,cls,fn,options={}){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=label;if(options.reason)b.dataset.reason=String(options.reason);if(options.disabled)b.disabled=true;b.onclick=e=>{e.stopPropagation();if(b.disabled)return;fn()};host.appendChild(b);return b}
function handleDiscardClick(p,handIndex){
  if(p.type==='hand_limit_discard'){
    intent('toggleDiscardIndex',[handIndex]);
    const s2=st(),p2=s2.pending;
    if((p2?.selected||[]).length>=Number(p2?.required||0))intent('handleChoiceConfirm',[]);
    return;
  }
  if(p.type==='response_payment_choice'){
    const ci=(p.candidates||[]).findIndex(x=>Number(x.hand_index)===Number(handIndex));
    if(ci>=0){
      intent('selectResponsePaymentChoice',[ci]);
      const q=st()?.pending;
      if(q?.type==='response_payment_choice' &&
         (q.selected_indices||[]).length>=Number(q.required_discard_count||0) &&
         Number(q.mana_cost||0)<=0){
        intent('commitResponsePaymentChoice',[]);
      }
    }
    return;
  }
  if(p.type==='legacy_cost_selection'){
    const ci=(p.cost_candidates||[]).findIndex(x=>Number(x.hand_index??x.index)===Number(handIndex));
    if(ci>=0){
      intent('selectLegacyCostChoice',[ci]);
      const q=st().pending;
      if((q?.selected_cost_indices||[]).length>=Number(q?.required_cost||1))intent('handleChoiceConfirm',[]);
    }
  }
}
function renderOpponentHand(s){
  updateCommittedHandSlotVisibility('AI');
  const p=s.pending,choice=p?.type==='opponent_hand_choice'&&pendingOwner(p)==='PLAYER',scopeReveal=p?.type==='magic_scope_reveal'&&pendingOwner(p)==='PLAYER',reveal=choice?!!p.reveal_cards:scopeReveal;
  const pendingDraws=glPendingDrawReservations.AI||[];
  const finalReveal=!!s.gameOver;
  // Include lifecycle state in the memo key: the same Hand must flip to public
  // artwork when a match ends, even when no cards were added or removed.
  const key=JSON.stringify([s.aiHand||[],finalReveal,p?.type,choice?(p.candidates||[]):null,scopeReveal?(p.revealed_cards||[]):null,reveal,pendingDraws.map(x=>x.id)]);
  if(key===opponentHandRenderKey)return;opponentHandRenderKey=key;
  oppHandTrack.innerHTML='';document.querySelector('.gl-magic-scope-done')?.remove();
  if(finalReveal){
    // Game Over reveals BOTH Hands on the battlefield, not in the Result popup.
    // Player Hand already displays its card fronts; expose AI Hand only now.
    (s.aiHand||[]).forEach((id,i)=>{
      const card=document.createElement('div');card.className='hand-card';card.dataset.handIndex=i;
      const im=document.createElement('img');im.className='hand-art';setCardArtwork(im,art(id));im.alt=cv(id)?.name||'AI Hand card';im.draggable=false;
      card.appendChild(im);card.ondblclick=e=>{e.preventDefault();e.stopPropagation();openCardReview(id)};
      oppHandTrack.appendChild(card);bindPreview(im);
    });
  }else if(choice){
    (p.candidates||[]).forEach((x,i)=>{const card=document.createElement('div');card.className='hand-card';card.dataset.handIndex=i;const im=document.createElement('img');im.className='hand-art';setCardArtwork(im,reveal?art(x.card_id):'assets/ui/back-main.webp');card.appendChild(im);card.style.cursor='pointer';card.onclick=e=>{if(e.detail>1)return;intent('selectOpponentHandChoice',[i])};if(reveal)card.ondblclick=e=>{e.preventDefault();e.stopPropagation();openCardReview(x.card_id)};oppHandTrack.appendChild(card);if(reveal)bindPreview(im)});
  }else if(scopeReveal){
    (p.revealed_cards||[]).forEach((id,i)=>{const card=document.createElement('div');card.className='hand-card';card.dataset.handIndex=i;const im=document.createElement('img');im.className='hand-art';setCardArtwork(im,art(id));card.appendChild(im);card.ondblclick=e=>{e.preventDefault();e.stopPropagation();openCardReview(id)};oppHandTrack.appendChild(card);bindPreview(im)});
  }else{
    // Normal Draw and all other non-reveal states still show card backs only.
    (s.aiHand||[]).forEach((_,i)=>{const card=document.createElement('div');card.className='hand-card';card.dataset.handIndex=i;if(glHiddenCommittedDrawSlots.AI.has(i))card.classList.add('gl-presentation-hidden');const im=document.createElement('img');im.className='hand-art';im.src='assets/ui/back-main.webp';im.alt='Hidden card';card.appendChild(im);oppHandTrack.appendChild(card)});
    pendingDraws.forEach((r,i)=>{const idx=(s.aiHand||[]).length+i,slot=document.createElement('div');slot.className='hand-card gl-draw-reservation-slot gl-presentation-hidden';slot.dataset.handIndex=idx;slot.dataset.drawReservationId=String(r.id||'');const im=document.createElement('img');im.className='hand-art';im.src='assets/ui/back-main.webp';im.alt='Incoming card';slot.appendChild(im);oppHandTrack.appendChild(slot)});
  }
  applyHandFan(oppHandTrack,'AI');
  requestAnimationFrame(syncOpponentHand);
}
function renderPhase(s){
  const labels=[...document.querySelectorAll('.phase-label')];labels.forEach(x=>x.classList.toggle('active',x.textContent.trim().toUpperCase().startsWith(phaseName(s.phase).toUpperCase())));
  const activeLabel=labels.find(x=>x.classList.contains('active'))||labels[0],phaseIndicatorKey=String(s.turn||'')+'|'+Number(s.round||1)+'|'+String(s.phase||''),phaseChanged=!!lastPhaseIndicatorKey&&phaseIndicatorKey!==lastPhaseIndicatorKey;lastPhaseIndicatorKey=phaseIndicatorKey;
  requestAnimationFrame(()=>placePhaseIndicator(activeLabel,phaseChanged));
  const turn=document.querySelector('.phase-turn .turn');turn.innerHTML=(s.turn==='PLAYER'?'YOUR TURN':'AI TURN')+'<small>TURN '+Number(s.round||1)+'</small>';
  const responseOwned=s.responseWindow?.response_owner==='PLAYER',p=s.pending;
  let mode='',label='REPOSITION';
  if(uiResponseSourceChoice){mode='cancel-response-source';label='CANCEL'}
  else if(pendingOwner(p)==='PLAYER'&&p?.type==='response_payment_choice'){mode='cancel-response-payment';label='CANCEL'}
  else if(responseOwned){mode='pass';label='PASS'}
  // F17: all optional card-effect Swaps use the dedicated three-button popup.
  // Do not expose a second phase-bar Cancel next to that decision.
  else if(isPrecommitCancelable(s)||p?.type==='manual_reposition'){mode='cancel';label='CANCEL'}
  else{
    const pairs=E().getRepositionPairs()||[];
    if(s.turn==='PLAYER'&&(s.phase==='Deploy'||s.phase==='Reform')&&!s.pending&&!s.responseWindow&&pairs.length){mode='reposition';label='REPOSITION'}
  }
  const responsePassKey=responseOwned?String(s.responseWindow.response_window_token||[s.responseWindow.card_id,s.responseWindow.source_side,s.responseWindow.source_lane,s.responseWindow.target_side,s.responseWindow.target_lane,s.round].join('|')):'';
  if(!responsePassKey){responsePassWindowKey='';responsePassWindowStartedAt=0;}
  else if(responsePassKey!==responsePassWindowKey){responsePassWindowKey=responsePassKey;responsePassWindowStartedAt=Date.now();}
  const overduePass=mode==='pass'&&responsePassWindowStartedAt>0&&(Date.now()-responsePassWindowStartedAt)>=30000;
  primary.className='phase-action'+(mode==='pass'?' gl-pass':mode.startsWith('cancel')||mode==='decline-swap'?' gl-cancel':mode?'':' gl-hidden')+(overduePass?' gl-response-pass-attention':'');primary.textContent=label;primary.disabled=!mode;
  primary.title=overduePass?'Response is waiting — select PASS or play a Response.':'';
  primary.onclick=()=>{
    if(mode==='pass'){responseRollbackSnapshot=null;uiResponseSourceChoice=null;intent('responsePassNoStuck',[])}
    else if(mode==='cancel-response-source'){uiResponseSourceChoice=null;responseRollbackSnapshot=null;renderNow()}
    else if(mode==='cancel-response-payment'){if(!cancelResponsePrecommit())intent('cancelPendingAction',[])}
    else if(mode==='cancel'){intent('cancelPendingAction',[])}
    else if(mode==='reposition')intent('openManualRepositionChoice',[]);
  };
  const blocked=s.turn!=='PLAYER'||!!s.pending||!!s.responseWindow||!!uiResponseSourceChoice||s.gameOver||s.phase==='Draw';nextBtn.disabled=blocked;nextBtn.textContent=s.phase==='End'?'END TURN':'NEXT PHASE';nextBtn.onclick=()=>intent('advancePhase',[]);renderSwap(s);
}
function renderSwap(s){
  const p=s.pending,descriptors=[];
  if(p&&pendingOwner(p)==='PLAYER'){
    if(p.type==='manual_reposition'){
      const pairs=p.pairs||p.swap_pairs||E().getRepositionPairs()||[];
      pairs.forEach(pair=>{let a,b;if(Array.isArray(pair)){[a,b]=pair}else{const parts=String(pair).split(/[-–—<>|/ ]+/).filter(x=>laneOrder.includes(x));[a,b]=parts}if(a&&b)descriptors.push({kind:'manual',side:'PLAYER',a,b});});
    // F17: card-effect Swaps never create floating battlefield icons.
    }
  }
  const sig=JSON.stringify(descriptors);
  if(sig!==swapRenderKey){
    swapRenderKey=sig;swapLayer.innerHTML='';
    descriptors.forEach((d,i)=>{
      const btn=document.createElement('button');btn.type='button';btn.className='gl-swap-button';btn.setAttribute('aria-label','Swap '+d.a+' with '+d.b);btn.title='Swap '+d.a+' with '+d.b;btn.dataset.swapIndex=String(i);if(d.kind!=='manual')btn.dataset.swapPartner=d.b;
      const im=document.createElement('img');im.src='engine/assets/lobby/Swap.png';im.alt='Swap';btn.appendChild(im);
      btn.onclick=()=>intent('performManualReposition',[d.a+'|'+d.b]);
      swapLayer.appendChild(btn);
    });
  }
  // Recalculate geometry every render/resize, but keep the actual button nodes stable.
  const br=uiLayoutRect(BF);
  descriptors.forEach((d,i)=>{
    const btn=swapLayer.querySelector('[data-swap-index="'+i+'"]'),ae=uiLaneElement(d.side,d.a),be=uiLaneElement(d.side,d.b);if(!btn||!ae||!be)return;
    const ar=uiLayoutRect(ae),rr=uiLayoutRect(be);
    // Manual Reposition retains the original centered-between-lanes icon.
    const px=(ar.left+ar.width/2+rr.left+rr.width/2)/2;
    const py=(ar.top+ar.height/2+rr.top+rr.height/2)/2;
    btn.style.left=((px-br.left)/currentUiScale())+'px';
    btn.style.top=((py-br.top)/currentUiScale())+'px';
  });
}
function responsePaymentReady(s,p){
  const selectedDiscard=(p?.selected_indices||[]).length,requiredDiscard=Number(p?.required_discard_count||0);
  if(selectedDiscard!==requiredDiscard)return false;
  return !!E().getManaPlan?.()?.plan?.ok;
}
function renderPay(s){
  const p=s.pending;
  const show=pendingOwner(p)==='PLAYER'&&['mana_shard_payment_choice','mana_spend_choice','response_payment_choice'].includes(p?.type)&&Number(p?.mana_cost??p?.selected_mana??1)>0;
  payBtn.classList.toggle('is-visible',!!show);
  if(!show)return;
  const pool=document.querySelector('.player-mana-pool'),br=uiLayoutRect(BF),pr=uiLayoutRect(pool);
  payBtn.style.left=((pr.right-br.left)/currentUiScale()+8)+'px';
  payBtn.style.top=((pr.top+pr.height/2-br.top)/currentUiScale()-13)+'px';
  let ready=true;
  if(p.type==='mana_shard_payment_choice')ready=!!E().getManaPlan()?.plan?.ok;
  else if(p.type==='response_payment_choice')ready=responsePaymentReady(s,p);
  payBtn.disabled=!ready;
  payBtn.title=ready?'Pay selected Mana':'Select a valid Mana payment first';
  payBtn.onclick=()=>{
    if(payBtn.disabled)return;
    if(p.type==='mana_shard_payment_choice')intent('commitManaShardPaymentChoice',[]);
    else if(p.type==='response_payment_choice')intent('commitResponsePaymentChoice',[]);
    else intent('handleChoiceConfirm',[]);
  };
}
function renderDeckActions(){document.querySelectorAll('.gl-deck-actions').forEach(x=>x.remove());}
function currentPhaseStamp(s){return [s?.turn||'',Number(s?.round||1),s?.phase||''].join('|')}
function latestResolvedActionThisPhase(s){
  const stamp=currentPhaseStamp(s);
  return allEvents(s).reverse().find(e=>[e.turn||'',Number(e.round||1),e.phase||''].join('|')===stamp&&e.card_id)||null;
}
function renderSidebar(s,chain){
  turnBox.innerHTML=`<h3 class="gold">${s.turn==='PLAYER'?'Your Turn':'AI Turn'}</h3><div class="tiny">Round ${Number(s.round||1)} · ${s.turn==='PLAYER'?'Player':'AI'}<br>Phase: ${esc(phaseName(s.phase))}<br>Mana ${Number(s.mana||0)} / 12 · Regen +${Number(s.manaRegen||0)}<br>AI Mana ${Number(s.aiMana||0)} / 12 · Regen +${Number(s.aiManaRegen||0)}</div>`;
  const phaseStamp=currentPhaseStamp(s);
  if(activeCardPhaseStamp!==phaseStamp){activeCardPhaseStamp=phaseStamp;activeCardHold=null}
  const live=topActive(s,chain);
  if(live?.card_id)activeCardHold={card_id:live.card_id,side:live.side||'PLAYER'};
  else{
    const evt=latestResolvedActionThisPhase(s);
    if(evt?.card_id)activeCardHold={card_id:evt.card_id,side:evt.side||'PLAYER'};
  }
  const active=live||activeCardHold,activeKey=active?[active.card_id,active.side].join('|'):'empty';
  if(activeStage.dataset.activeKey!==activeKey){
    hideSidebarHoverPreview();activeStage.dataset.activeKey=activeKey;activeStage.innerHTML='';
    if(active?.card_id){const v=cv(active.card_id),d=document.createElement('div');d.className='active-card-visual';const im=document.createElement('img');setCardArtwork(im,art(active.card_id));im.alt=v?.name||'Active card';d.appendChild(im);const owner=document.createElement('span');owner.className='active-owner';owner.textContent=active.side==='PLAYER'?'YOU':'OPPONENT';d.appendChild(owner);activeStage.appendChild(d);bindSidebarPreview(im)}
    else activeStage.innerHTML='<div class="gl-active-empty">No active card</div>';
  }
  renderHistory(s,chain);renderLog(s);
}
function topActive(s,chain){
  const p=s.pending,r=s.responseWindow;
  if(p?.type==='response_payment_choice'&&p.response_option)return{card_id:p.response_option.card_id,side:p.side||p.incoming_response_window?.target_side||'PLAYER'};
  if(r?.card_id)return{card_id:r.card_id,side:r.source_side||'AI'};
  const pa=pendingActionInfo(s,p);if(pa)return pa;
  return chain[chain.length-1]||null;
}
// RC33: card history uses actual recorded play order; timestamps alone can tie.
function playedChronology(a,b){
  const x=Number(a.played_event_order||0),y=Number(b.played_event_order||0);
  if(x>0&&y>0&&x!==y)return x-y;
  const dt=Number(a.timestamp||0)-Number(b.timestamp||0);
  if(dt)return dt;
  // Older saves lack an explicit sequence; use a stable fallback.
  if(x!==y)return x-y;
  return String(a.id||'').localeCompare(String(b.id||''));
}
function allEvents(s){const a=[];(s.playerPlayedEvents||[]).forEach(e=>a.push({...e,side:'PLAYER'}));(s.opponentPlayedEvents||[]).forEach(e=>a.push({...e,side:'AI'}));(E()?.getCommittedPublicDiscardCards?.()||[]).forEach(e=>a.push(e));return a.sort(playedChronology)}
function renderHistory(s,chain){
  const activeIds=new Set(chain.map(a=>a.card_id+'|'+a.side)),events=allEvents(s).filter(e=>e.card_id&&(e.card_movement_only||!activeIds.has(e.card_id+'|'+e.side)));
  events.forEach(e=>{const k=e.id||[e.side,e.card_id,e.timestamp].join('|');if(!historyKnown.has(k)){historyKnown.add(k);resolvedHistory.push(e)}else{const old=resolvedHistory.find(x=>(x.id||[x.side,x.card_id,x.timestamp].join('|'))===k);if(old)Object.assign(old,e)}});
  resolvedHistory.sort(playedChronology);
  const draw=(host,arr,keepSix=false)=>{
    const sig=JSON.stringify(arr.map(e=>[e.id||'',e.side||'',e.card_id||'',Number(e.timestamp||0),e.resolution_state||'',e.card_movement_only?'DISCARDED':'']))+'|six:'+String(!!keepSix);
    if(host.dataset.glHistorySig===sig)return false;hideSidebarHoverPreview();host.dataset.glHistorySig=sig;host.innerHTML='';
    arr.forEach(e=>{const v=cv(e.card_id);if(!v)return;const d=document.createElement('button');d.type='button';d.className='played-card gl-played-clickable'+(e.card_movement_only?' gl-played-discarded':'');d.title=e.card_movement_only?'View discarded card':'View Card Played detail';const im=document.createElement('img');setCardArtwork(im,art(e.card_id));im.alt=v.name;im.draggable=false;d.appendChild(im);const badge=document.createElement('span');badge.className='gl-played-result-badge '+(e.side==='PLAYER'?'is-you':'is-opponent');badge.textContent=e.side==='PLAYER'?'YOU':'OPPONENT';d.appendChild(badge);if(e.card_movement_only){const label=document.createElement('span');label.className='gl-played-discard-label';label.textContent='DISCARDED';d.appendChild(label);}d.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();hideSidebarHoverPreview();openPlayedDetail(e.side,e.id)});host.appendChild(d);bindSidebarPreview(im)});
    if(keepSix){for(let i=host.children.length;i<6;i++){const ph=document.createElement('div');ph.className='played-card gl-played-placeholder';host.appendChild(ph)}}
    return true;
  };
  // Card Played runs newest-first: the latest resolved card always occupies the top-left slot.
  // The Battle Log intentionally keeps its separate oldest-to-newest, newest-at-bottom layout.
  const newestFirst=resolvedHistory.slice().reverse();
  const changed=draw(playedGrid,newestFirst.slice(0,6),true)|draw(historyGrid,newestFirst,false);if(changed)requestAnimationFrame(fitPlayedCards);
}

function renderLog(s){
  // Polling occurs every 120ms. Recreating identical log lines reset a
  // scrolling player's position; only touch DOM when the actual log changes.
  const lines=Array.isArray(s.log)?s.log:[];
  const signature=JSON.stringify(lines);
  if(battleLogPanel.dataset.glLogSignature===signature)return;
  const prevTop=battleLogPanel.scrollTop;
  const wasAtEnd=battleLogPanel.scrollHeight-battleLogPanel.clientHeight-prevTop<20;
  battleLogPanel.querySelectorAll('.logline').forEach(x=>x.remove());
  // Engine logs are newest-first; render oldest-first without touching engine state.
  lines.slice().reverse().forEach(line=>{const d=document.createElement('div');d.className='logline';d.textContent=line;battleLogPanel.appendChild(d)});
  battleLogPanel.dataset.glLogSignature=signature;
  battleLogPanel.scrollTop=wasAtEnd?battleLogPanel.scrollHeight:prevTop;
}
function choiceCardTile(id,idx,selected,selectHandler,previewMode='contextual'){
  const v=cv(id),article=document.createElement('article');article.className='card-search-choice'+(selected?' selected':'');
  const previewBtn=document.createElement('button');previewBtn.type='button';previewBtn.className='discard-preview';
  const im=document.createElement('img');setCardArtwork(im,v?.thumb||art(id));im.alt=(v?.name||id)+' thumbnail';previewBtn.appendChild(im);
  const name=document.createElement('span');name.textContent=v?.name||id;previewBtn.appendChild(name);bindChoicePreview(im,id,previewMode);
  const select=document.createElement('button');select.type='button';select.className='discard-select';select.textContent=selected?'Selected':'Select';select.onclick=selectHandler;
  article.append(previewBtn,select);return article;
}
// RC41 F15 -- compact two-row Card Search / Return-to-Hand display.
// Source zones and move destinations come from the committed engine decision,
// not card names; Replenish/CONDITION (which do NOT return chosen cards to Hand)
// keep their existing modal presentation.
function isReturnToHandSearch(p){
  if(!p||p.type!=='card_search_choice'||pendingOwner(p)!=='PLAYER')return false;
  const zone=candidateSourceZone(p);
  return (zone==='deck'||zone==='discard')&&
    !['replenish_to_deck','s0_condition_precommit','s0_response_condition_precommit'].includes(String(p.resolve_to||''));
}
// F24: the game bridge clones each snapshot, including `pending`. Never use
// pending OBJECT IDENTITY to decide whether a player is still in the same
// card-selection popup. Keep a stable per-choice key across selection changes.
let glHandSearchSessionKey='';
function returnToHandSearchSessionKey(s,p){
  if(!p)return '';
  return JSON.stringify({
    match:glPresentationEpoch,round:s?.round||0,turn:s?.turn||'',phase:s?.phase||'',
    zone:candidateSourceZone(p),source:p.source_card_id||'',
    token:p.commit_token||'',resolve_to:p.resolve_to||'',
    title:p.title||'',instruction:p.instruction||'',
    candidates:(p.candidates||[]).map(c=>typeof c==='string'?c:
      [c.card_id||'',c.deck_index??c.discard_index??c.hand_index??-1])
  });
}
function resetReturnToHandSearchDisplay(){
  glHandSearchSessionKey='';
  choiceOverlay.classList.remove('gl-choice-to-hand');
  document.body.classList.remove('gl-choice-to-hand-active');
}
function positionReturnToHandSearch(){
  if(!choiceOverlay.classList.contains('gl-choice-to-hand'))return;
  const mobile=adaptiveStageActive(),r=mobile?uiLayoutRect(playerHandTrack):uiRect(playerHandTrack);
  const style=mobile?getComputedStyle(document.documentElement):null;
  const sceneW=mobile?(parseFloat(style.getPropertyValue('--gl-stage-logical-w'))||1600):Math.max(1,window.innerWidth||1);
  const sceneH=mobile?(parseFloat(style.getPropertyValue('--gl-stage-logical-h'))||747):Math.max(1,window.innerHeight||1);
  // Existing Hand is never moved or resized. Spotlight follows its true track.
  const left=Math.max(0,Math.round((r?.left??sceneW*.38)-12));
  const right=Math.min(sceneW,Math.round((r?.right??sceneW*.70)+12));
  const top=Math.max(0,Math.min(sceneH-30,Math.round((r?.top??sceneH-120)-10)));
  const width=Math.max(1,right-left);
  const panelCap=Math.max(215,Math.min(sceneH-32,Math.floor(2*(top-22+32)-sceneH)));
  const put=(key,value)=>{const v=Math.round(value)+'px';if(choiceOverlay.style.getPropertyValue(key)!==v)choiceOverlay.style.setProperty(key,v)};
  put('--gl-choice-hand-x',left);put('--gl-choice-hand-y',top);
  put('--gl-choice-hand-w',width);put('--gl-choice-hand-right',right);
  put('--gl-choice-panel-cap',panelCap);
}
function limitReturnToHandSearchRows(){
  if(!choiceOverlay.classList.contains('gl-choice-to-hand'))return;
  const body=choiceOverlay.querySelector('.choice-body'),grid=body?.querySelector('.card-search-choice-grid');
  const first=grid?.querySelector('.card-search-choice');if(!first)return;
  const intro=body.querySelector('.choice-instruction'),introStyle=intro?getComputedStyle(intro):null;
  const bs=getComputedStyle(body),gs=getComputedStyle(grid);
  const px=x=>parseFloat(x)||0;
  // Exactly the instruction and two complete rows; any further cards scroll in
  // the candidate grid only, so the footer stays on-screen and Hand remains visible.
  const introH=intro?intro.offsetHeight+px(introStyle?.marginTop)+px(introStyle?.marginBottom):0;
  const gridRows=2*first.offsetHeight+px(gs.rowGap);
  const twoRows=gridRows+introH+px(bs.paddingTop)+px(bs.paddingBottom)+2;
  choiceOverlay.style.setProperty('--gl-choice-grid-two-row-cap',Math.ceil(gridRows)+'px');
  choiceOverlay.style.setProperty('--gl-choice-two-row-cap',Math.ceil(twoRows)+'px');
}
window.addEventListener('resize',()=>{if(choiceOverlay.classList.contains('gl-choice-to-hand')){positionReturnToHandSearch();requestAnimationFrame(limitReturnToHandSearchRows)}},{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(()=>{positionReturnToHandSearch();limitReturnToHandSearchRows()},70),{passive:true});
// F21: the optional-Swap picker is a choice only while at least one legal
// Hero/Legacy partner is still available. Source / partner Freeze and Stun,
// Legacy state and 1v1 Center lock are checked without changing engine rules.
function swapPreviewIsLegacy(h){
  const id=heroImageId(h)||'';
  return !!(h&&(h.legacy_mode||h.legacy||h.active_legacy_card_id||/^S0-[A-Z]{3}-L\d+/i.test(id)));
}
function swapPreviewIsActive(h){return !!(h&&!swapPreviewIsLegacy(h)&&Number(h.hp||0)>0);}
function swapPreviewStatus(h){
  const statuses=(h?.statuses||[]).filter(x=>Number(x?.duration??1)>0);
  if(statuses.some(x=>String(getStatusName(x)).toLowerCase()==='freeze'))return 'Freeze';
  if(statuses.some(x=>String(getStatusName(x)).toLowerCase()==='stun'))return 'Stun';
  return '';
}
function liveOptionalSwapDestinations(s,p){
  if(!s||!p||!laneOrder.includes(p.source_lane))return [];
  const heroes=sideHeroes(s,p.source_side)||{},source=heroes[p.source_lane];
  if(!swapPreviewIsActive(source)||swapPreviewStatus(source))return [];
  const alive=side=>laneOrder.filter(l=>swapPreviewIsActive(sideHeroes(s,side)?.[l])).length;
  if(alive('PLAYER')===1&&alive('AI')===1)return [];
  const requested=Array.isArray(p.swap_options)?p.swap_options:(p.swap_lane?[p.swap_lane]:[]);
  const neighbors=p.source_lane==='LEFT'?['CENTER']:p.source_lane==='RIGHT'?['CENTER']:['LEFT','RIGHT'];
  // When an older pending snapshot is restored, a source-front Attack may
  // choose only the struck facing position, never another adjacent ally.
  const sourceFront=['S0-THF-002','S0-THF-020','S0-THF-026','S0-THF-024','S0-WAR-015','S0-WAR-025','S0-WAR-030'].includes(p.card_id);
  return [...new Set(requested)].filter(lane=>neighbors.includes(lane)&&lane!==p.source_lane&&
    (!sourceFront||lane===p.target_lane)&&
    !!heroes[lane]&&(swapPreviewIsLegacy(heroes[lane])||swapPreviewIsActive(heroes[lane]))&&
    !swapPreviewStatus(heroes[lane]));
}
function liveTargetSwapDestinations(s,p){
  if(!s||!p||!laneOrder.includes(p.target_lane))return [];
  const heroes=sideHeroes(s,p.target_side)||{},source=heroes[p.target_lane];
  if(!swapPreviewIsActive(source)||swapPreviewStatus(source))return [];
  const alive=side=>laneOrder.filter(l=>swapPreviewIsActive(sideHeroes(s,side)?.[l])).length;
  if(alive('PLAYER')===1&&alive('AI')===1)return [];
  const allowed=p.target_lane==='LEFT'?['CENTER']:p.target_lane==='RIGHT'?['CENTER']:['LEFT','RIGHT'];
  return [...new Set(Array.isArray(p.swap_options)?p.swap_options:[])].filter(lane=>
    allowed.includes(lane)&&lane!==p.target_lane&&!!heroes[lane]&&
    (swapPreviewIsActive(heroes[lane])||swapPreviewIsLegacy(heroes[lane]))&&
    !swapPreviewStatus(heroes[lane]));
}
// Only in mobile mode, selection changes must not jump a scrolled card-list
// back to its first row. Hand-return searches retain their separate F24 key.
let glMobileListScrollSession='';
function renderAllowedModal(s){
  // Defeat Legacy choices use the center stage; only source-zone searches
  // (Main Deck / Discard Pile) retain the standard card-list popup.
  const p=s.pending;
  // F25: player-controlled Soul Blast Shot target swaps are now real choices.
  // Never auto-select a random destination from a cloned snapshot.
  if(p?.type==='optional_target_swap'&&pendingOwner(p)==='PLAYER'){
    // A stale cloned decision can lose its last legal lane. Close via a
    // single optional SKIP; with even ONE legal lane the player chooses Swap or SKIP.
    const targetDestinations=liveTargetSwapDestinations(s,p);
    if(!targetDestinations.length){
      choiceOverlay.classList.remove('open','gl-choice-swap');modalRenderKey='';
      intent('performOptionalTargetSwapDecision',[null]);
      return;
    }
  }
  if(p?.type==='optional_swap'&&pendingOwner(p)==='PLAYER'&&!liveOptionalSwapDestinations(s,p).length){
    // All destinations are blocked (Freeze/Stun/1v1/etc.). Do not show any
    // picker: finish the optional post-Attack decision as SKIP once.
    choiceOverlay.classList.remove('open','gl-choice-swap');modalRenderKey='';
    intent('performOptionalSwapDecision',[false]);
    return;
  }
  const allowed=['card_search_choice','legacy_card_choice','crystal_ball_reorder','optional_swap','optional_target_swap'];
  if(!p||!allowed.includes(p.type)||pendingOwner(p)!=='PLAYER'||isDirectHandCardSearch(p)||isHandDiscardPending(p)){
    resetReturnToHandSearchDisplay();
    if(!p&&inspectState){renderInspectModal();return}
    // The generic modal is polled every 120 ms but DOES NOT own the preview
    // for any active center-choice card (including End Phase Hand Limit).
    // Closing the center choice, a pointerleave or a genuine session change
    // still clears the preview through the center-choice lifecycle.
    const centerPreviewOwnedByCenterChoice=!!centerChoiceModeFor(s)&&
      classChoiceHoverOwner?.isConnected&&centerChoiceStage.contains(classChoiceHoverOwner);
    // EXP Inspector reuses the Legacy Deck hover-preview layer. Polling
    // renderAllowedModal must not erase it every 120ms while the panel is open.
    const expPreviewOwnedByInspector=expInspectorOverlay.classList.contains('open');
    if(!centerPreviewOwnedByCenterChoice&&!expPreviewOwnedByInspector)hideModalHoverPreview();
    if(p)inspectState=null;
    choiceOverlay.classList.remove('open','gl-choice-main-deck-preview','gl-choice-swap');activeModalType='';modalRenderKey='';return;
  }
  const candidateZone=candidateSourceZone(p),swapHeroSig=['optional_swap','optional_target_swap'].includes(p.type)?
    laneOrder.map(l=>{const h=sideHeroes(s,p.type==='optional_target_swap'?p.target_side:p.source_side)?.[l];return[l,heroImageId(h)||'',Number(h?.hp||0),!!swapPreviewIsLegacy(h),swapPreviewStatus(h)];}):null,
    modalSig=JSON.stringify({type:p.type,choice_id:p.choice_id||'',title:p.title||'',candidates:(p.candidates||[]).map(x=>typeof x==='string'?x:(x.card_id||x.id||x.hand_index||'')),exp_choices:(p.exp_choices||[]).map(x=>[x.card_id,x.exp_index]),selected_exp_choice:p.selected_exp_choice??null,selected_index:selectedChoiceIndex(p),selected_indices:p.selected_indices||[],selected_order:p.selected_order||[],required_count:p.required_count||p.required_choices||p.max_count||p.quota||0,multi_select:!!p.multi_select,committing:!!p.committing,confirm_text:p.confirm_text||'',candidate_zone:candidateZone,resolve_to:p.resolve_to||'',swap_lane:p.source_lane||p.target_lane||'',swap_options:p.swap_options||[],swap_card:p.card_id||'',swap_hero_state:swapHeroSig});
  activeModalType=p.type;choiceOverlay.classList.add('open');
  const handSearch=isReturnToHandSearch(p),swapChoice=['optional_swap','optional_target_swap'].includes(p.type);
  // F24: `st()` reads a CLONED engine snapshot every render. `pending===oldPending`
  // was always false after a Select, so the old F18 code restored scrollTop=0.
  // The selection state is deliberately absent from this stable session key.
  const searchSessionKey=handSearch?returnToHandSearchSessionKey(s,p):'';
  const searchGridBefore=choiceOverlay.querySelector('.gl-choice-body .card-search-choice-grid');
  const scrollBefore=handSearch&&glHandSearchSessionKey===searchSessionKey&&searchGridBefore?
    Math.max(0,searchGridBefore.scrollTop):0;
  glHandSearchSessionKey=searchSessionKey;
  choiceOverlay.classList.toggle('gl-choice-swap',swapChoice);
  choiceOverlay.classList.toggle('gl-choice-to-hand',handSearch);
  document.body.classList.toggle('gl-choice-to-hand-active',handSearch);
  if(handSearch)positionReturnToHandSearch();
  // For mobile list selectors, preserve the scroll row when a selection
  // triggers a fresh engine snapshot. This is not applied to desktop, Swap,
  // or the Hand-return picker (which already owns the grid scroll session).
  const mobileListSession=hasUnifiedMobilePreviewStage()&&!handSearch&&!swapChoice?
    JSON.stringify([glPresentationEpoch,s?.round||0,s?.turn||'',s?.phase||'',p.type,
      p.choice_id||'',p.source_card_id||'',p.commit_token||'',p.title||'',candidateZone,
      (p.candidates||[]).map(x=>typeof x==='string'?x:(x.card_id||x.id||''))]):'';
  const oldListBody=choiceOverlay.querySelector('.gl-choice-body');
  const listScrollY=mobileListSession&&mobileListSession===glMobileListScrollSession?
    (oldListBody?.scrollTop||0):0;
  glMobileListScrollSession=mobileListSession;
  // Polling renders used to destroy/recreate the modal buttons every 120 ms, which could eat
  // ordinary mouse clicks. Rebuild only when the choice state actually changes.
  if(modalRenderKey===modalSig)return;
  hideModalHoverPreview();
  modalRenderKey=modalSig;
  const title=choiceOverlay.querySelector('.gl-choice-title'),body=choiceOverlay.querySelector('.gl-choice-body'),confirm=choiceOverlay.querySelector('.gl-choice-confirm');
  // CONDITION is chosen before paying Mana. Keep a visible CANCEL inside the
  // foreground modal so the existing authoritative pre-commit rollback is usable.
  // Do not offer it for mandatory/post-commit choices that cannot be rolled back.
  const cancel=choiceOverlay.querySelector('.gl-choice-cancel');
  if(cancel){
    const cancellableCondition=p.type==='card_search_choice'&&
      ['s0_condition_precommit','gods_blessing_precommit','s0_response_condition_precommit'].includes(p.resolve_to);
    cancel.hidden=!cancellableCondition;
    cancel.onclick=cancellableCondition?()=>intent('cancelPendingAction',[]):null;
  }
  // F21/F25: use the same 3-column Hero/Legacy preview for both the
  // OPTIONAL allied Swap and OPTIONAL Soul Blast Shot opponent Swap.
  // Warp Scroll still chooses its target before playing and is unchanged.
  if(swapChoice){
    choiceOverlay.classList.remove('gl-choice-main-deck-preview');
    const isTargetSwap=p.type==='optional_target_swap';
    const from=isTargetSwap?p.target_lane:p.source_lane;
    const heroes=sideHeroes(s,isTargetSwap?p.target_side:p.source_side)||{};
    const available=new Set(isTargetSwap?liveTargetSwapDestinations(s,p):liveOptionalSwapDestinations(s,p));
    // Preserve the three-button Battlefield order agreed for F19. The middle
    // column is always the acting Hero with SKIP below it. A self-lane target
    // is DISABLED with a real Legacy Deck card back (never a blank tile).
    // Frozen/Stunned partners remain visible but dimmed and disabled.
    let destinations=laneOrder.filter(l=>l!==from);
    if(from==='LEFT'&&available.size===1&&available.has('CENTER'))destinations=['LEFT','CENTER'];
    if(from==='RIGHT'&&available.size===1&&available.has('CENTER'))destinations=['CENTER','RIGHT'];
    if(from==='RIGHT'&&available.size===1&&available.has('LEFT'))destinations=['LEFT','RIGHT'];
    if(from==='LEFT'&&available.size===1&&available.has('RIGHT'))destinations=['LEFT','RIGHT'];
    title.textContent=isTargetSwap?'Soul Blast Shot — Choose Opponent Swap':'Swap — Choose Position';
    body.replaceChildren();body.classList.remove('gl-choice-body-main-deck');
    const desc=document.createElement('p');desc.className='choice-instruction';
    const cardLabel=cv(p.card_id)?.name||'This card';
    desc.textContent=isTargetSwap?cardLabel+': choose an adjacent opponent Hero or Legacy to Swap with the struck Hero, or SKIP.':cardLabel+': choose a legal Hero or Legacy to Swap with, or SKIP.';
    const row=document.createElement('div');row.className='gl-swap-choice-actions';
    function swapButton(lane){
      const b=document.createElement('button');b.type='button';b.className='gl-swap-choice-button';
      b.textContent='SWAP TO '+lane;b.disabled=!available.has(lane);
      b.title=b.disabled?'This position is not a legal Swap destination.':'Swap with the Hero or Legacy in '+lane;
      b.setAttribute('aria-label',b.textContent);
      if(!b.disabled)b.onclick=()=>intent(isTargetSwap?'performOptionalTargetSwapDecision':'performOptionalSwapDecision',[lane]);
      return b;
    }
    function swapColumn(lane,isSkip){
      const box=document.createElement('div');box.className='gl-swap-choice-slot';
      const actualLane=isSkip?from:lane,hero=heroes[actualLane];
      const selfSlot=!isSkip&&lane===from,enabled=isSkip||available.has(lane);
      if(!enabled)box.classList.add('is-disabled');
      if(selfSlot)box.classList.add('is-self-position');
      if(isSkip)box.classList.add('is-source');
      const role=document.createElement('div');role.className='gl-swap-choice-role';
      role.textContent=isSkip?(isTargetSwap?'HIT OPPONENT · ':'YOUR HERO · ')+from:lane;
      const frame=document.createElement('div');frame.className='gl-swap-choice-frame';
      const id=!selfSlot?heroImageId(hero):null;
      if(selfSlot){
        // F26: The current lane is not a selectable destination. Show the
        // actual Legacy Deck back rather than an empty/placeholder tile.
        const back=document.createElement('img');
        back.src='assets/ui/back-legacy.webp';
        back.alt='Legacy Deck card back — current '+lane+' position cannot be selected';
        back.loading='eager';frame.appendChild(back);
        frame.classList.add('is-legacy-back');
      }else if(id){
        const im=document.createElement('img');setCardArtwork(im,art(id));
        im.alt=(cv(id)?.name||id)+(swapPreviewIsLegacy(hero)?' Legacy':' Hero')+' at '+actualLane;
        im.loading='eager';frame.appendChild(im);
      }else{
        frame.classList.add('is-empty');const empty=document.createElement('span');empty.textContent='—';
        empty.setAttribute('aria-label','No Swap target');frame.appendChild(empty);
      }
      const name=document.createElement('div');name.className='gl-swap-choice-name';
      const status=!isSkip&&!enabled&&hero?swapPreviewStatus(hero):'';
      name.textContent=selfSlot?'Current position':(status?status+' · ':'')+(id?(cv(id)?.name||id):(isSkip?'Your Hero':'Unavailable'));
      let button;
      if(isSkip){
        button=document.createElement('button');button.type='button';
        button.className='gl-swap-choice-button gl-swap-choice-skip';
        button.textContent='SKIP';button.disabled=false;
        button.title='Do not Swap';
        button.onclick=()=>intent(isTargetSwap?'performOptionalTargetSwapDecision':'performOptionalSwapDecision',[isTargetSwap?null:false]);
      }else button=swapButton(lane);
      box.append(role,frame,name,button);return box;
    }
    row.appendChild(swapColumn(destinations[0]||'LEFT',false));
    row.appendChild(swapColumn(from,true));
    row.appendChild(swapColumn(destinations[1]||'RIGHT',false));
    body.append(desc,row);
    cancel.hidden=true;cancel.onclick=null;
    confirm.hidden=true;confirm.disabled=true;
    return;
  }
  confirm.hidden=false;
  const choicePreviewMode=choicePreviewModeFromCandidateZone(p),mainDeckPreview=choicePreviewMode==='fixed';
  choiceOverlay.classList.toggle('gl-choice-main-deck-preview',mainDeckPreview);
  title.textContent=p.title||({card_search_choice:'Choose Card',legacy_defeat_choice:'Choose Legacy',legacy_card_choice:'Legacy Choice',crystal_ball_reorder:'Crystal Ball — Reorder Top Deck',trial_rankup_return_exp:'TRIAL · Rank '+(Number(p.rank)===2?'II':'III')+' Return EXP',scouting_exp_selection:'TRIAL · Scouting Choose EXP'}[p.type]);
  body.innerHTML='';body.classList.remove('gl-choice-body-main-deck');
  // v6.90.7: Main Deck preview is the v6.88 floating preview OUTSIDE the popup.
  // Do not reserve an internal preview column. The popup keeps all seven card columns.
  const listHost=body;
  const instruction=document.createElement('p');instruction.className='choice-instruction';
  if(p.type==='trial_rankup_return_exp')instruction.textContent='Choose exactly '+Math.min(Number(p.quota||0),(p.candidates||[]).length)+' normal EXP Skill Cards to return to Hand. Ultimate EXP and unselected cards remain in Discard. This is NOT a Draw; Mana Regen +1 is already applied.';
  else if(p.type==='scouting_exp_selection')instruction.textContent='Scouting was paid and committed. Choose exactly 1 opponent normal Skill EXP Card to DISCARD. Ultimate EXP Cards cannot be chosen.';
  else if(p.type==='legacy_defeat_choice')instruction.textContent=(cv(p.defeated_card_id)?.name||'Hero')+' was defeated. Choose which Legacy card will replace this Hero.';
  else if(p.type==='card_search_choice')instruction.textContent=p.instruction||'Select the required card choice.';
  else if(p.type==='legacy_card_choice')instruction.textContent='Choose exactly '+Number(p.required_choices||1)+' card(s).';
  else instruction.textContent='Reorder the revealed top cards. The first card shown will be the next card drawn.';
  listHost.appendChild(instruction);
  const grid=document.createElement('div');grid.className='choice-grid '+(p.type==='crystal_ball_reorder'?'reorder-choice-grid':'card-search-choice-grid');listHost.appendChild(grid);
  if(p.type==='trial_rankup_return_exp'){
    const selected=new Set((p.selected_indices||[]).map(Number)),maximum=Math.min(Number(p.quota||0),(p.candidates||[]).length);
    (p.candidates||[]).forEach((x,i)=>grid.appendChild(choiceCardTile(x.card_id,i,selected.has(i),()=>intent('trialSelectRankUpReturn',[i]),'contextual')));
    confirm.textContent='Return '+selected.size+' / '+maximum+' EXP Card'+(selected.size===1?'':'s');
    confirm.disabled=selected.size!==maximum;
  }else if(p.type==='scouting_exp_selection'){
    const choices=p.exp_choices||[],selected=p.selected_exp_choice===null?-1:Number(p.selected_exp_choice);
    choices.forEach((x,i)=>grid.appendChild(choiceCardTile(x.card_id,i,selected===i,()=>intent('selectScoutingExpChoice',[i]),'contextual')));
    confirm.textContent='Discard Selected EXP';
    confirm.disabled=selected<0||!choices[selected];
  }else if(p.type==='legacy_defeat_choice'){
    (p.candidates||[]).forEach((raw,i)=>{const id=typeof raw==='string'?raw:(raw.card_id||raw.id);grid.appendChild(choiceCardTile(id,i,selectedChoiceIndex(p)===i,()=>intent('selectLegacyDefeatChoice',[i]),'contextual'))});
    const legacySelected=selectedChoiceIndex(p);confirm.textContent=p.committing?'Entering Legacy Mode…':'Enter Legacy Mode';confirm.disabled=!!p.committing||legacySelected==null||!(p.candidates||[])[legacySelected];
  }else if(p.type==='card_search_choice'){
    const req=p.multi_select?Math.min(Number(p.required_count||p.max_count||1),(p.candidates||[]).length):1;
    (p.candidates||[]).forEach((raw,i)=>{const id=typeof raw==='string'?raw:raw.card_id,sel=p.multi_select?(p.selected_indices||[]).includes(i):selectedChoiceIndex(p)===i;grid.appendChild(choiceCardTile(id,i,sel,()=>intent('selectCardSearchChoice',[i]),choicePreviewMode))});
    const count=p.multi_select?(p.selected_indices||[]).length:(typeof p.selected_index==='number'?1:0);confirm.textContent=p.confirm_text||'Add Selected';confirm.disabled=count<req;
  }else if(p.type==='legacy_card_choice'){
    const req=Number(p.required_choices||1);
    (p.candidates||[]).forEach((raw,i)=>{const id=typeof raw==='string'?raw:raw.card_id,sel=(p.selected_indices||[]).includes(i)||selectedChoiceIndex(p)===i;grid.appendChild(choiceCardTile(id,i,sel,()=>intent('selectLegacyCardChoice',[i]),choicePreviewMode))});
    confirm.textContent='Confirm Legacy Choice';confirm.disabled=(p.selected_indices||[]).length!==req && !(req===1&&typeof p.selected_index==='number');
  }else{
    (p.selected_order||[]).forEach((raw,i)=>{const id=typeof raw==='string'?raw:raw.card_id,v=cv(id),article=document.createElement('article');article.className='discard-choice';
      const pb=document.createElement('button');pb.type='button';pb.className='discard-preview';const im=document.createElement('img');setCardArtwork(im,v?.thumb||art(id));im.alt=(v?.name||id)+' thumbnail';pb.appendChild(im);const sp=document.createElement('span');sp.textContent='#'+(i+1)+' '+(v?.name||id);pb.appendChild(sp);bindChoicePreview(im,id,'fixed');
      const buttons=document.createElement('div');buttons.className='choice-footer-buttons';
      const up=document.createElement('button');up.type='button';up.textContent='Up';up.disabled=i===0;up.onclick=()=>intent('moveCrystalBallOrder',[i+':up']);
      const down=document.createElement('button');down.type='button';down.textContent='Down';down.disabled=i===(p.selected_order||[]).length-1;down.onclick=()=>intent('moveCrystalBallOrder',[i+':down']);
      buttons.append(up,down);article.append(pb,buttons);grid.appendChild(article);
    });confirm.textContent='Confirm Order';confirm.disabled=false;
  }
  confirm.onclick=()=>intent('handleChoiceConfirm',[]);
  if(mobileListSession){
    body.scrollTop=listScrollY;
    requestAnimationFrame(()=>{
      if(glMobileListScrollSession===mobileListSession&&body.isConnected)
        body.scrollTop=listScrollY;
    });
  }
  if(handSearch){
    limitReturnToHandSearchRows();
    // The candidate grid is the only scroll owner (F16). Restore its exact
    // prior position after layout, without auto-scrolling to the selected tile.
    // Guard with the stable choice key so a new choice never inherits scroll.
    grid.scrollTop=scrollBefore;
    requestAnimationFrame(()=>{
      if(glHandSearchSessionKey===searchSessionKey&&grid.isConnected&&choiceOverlay.classList.contains('gl-choice-to-hand'))
        grid.scrollTop=scrollBefore;
    });
  }
}
function autoSpecialChoices(s){
  // v6.89 center-choice UX keeps even a single opponent Shard visible as an explicit
  // blind choice so the player sees the card move, reveal after confirm, and destination.
}
function renderRacialTokens(s){const set=(sel,n)=>{const row=document.querySelector(sel);if(!row)return;row.innerHTML='';for(let i=0;i<2;i++){const im=document.createElement('img');im.className='racial-token';im.src=i<n?'assets/ui/Racial-Token-Head.webp':'assets/ui/Racial-Token-Tail.webp';row.appendChild(im)}};set('.player-right-rail .racial-row',Number(s.racial||0));set('.opponent-left-rail .racial-row',Number(s.aiRacial||0))}
function renderRegenCounter(side,value){
  const zone=zoneEl(side,'Shard Deck');if(!zone)return;
  let badge=zone.querySelector(':scope > .gl-regen-counter');
  if(!badge){badge=document.createElement('span');badge.className='gl-regen-counter';zone.appendChild(badge)}
  // Production battlefield: the +N symbol identifies Mana Regen. Keep its
  // full accessible name while removing the cramped visible REGEN label.
  let amount=badge.querySelector('.gl-regen-value');
  if(!amount||badge.children.length!==1){badge.replaceChildren();amount=document.createElement('strong');amount.className='gl-regen-value';badge.appendChild(amount)}
  const v=Number(value),n=Number.isFinite(v)?Math.max(1,Math.min(6,Math.trunc(v))):1;
  amount.textContent='+'+n;
  badge.title='Mana Regen +'+n;badge.setAttribute('aria-label','Mana Regen +'+n);
}
function renderRails(s){
  configureStaticZones();
  const playerZones=document.querySelectorAll('.player-field .zone'),oppZones=document.querySelectorAll('.opponent-field .zone');
  if(playerZones[0])playerZones[0].querySelector('.count').textContent=(s.playerLegacy||[]).length;
  if(playerZones[1])playerZones[1].querySelector('.count').textContent=(s.playerManaDeck||[]).length;
  if(document.querySelector('.player-right-rail .zone:nth-child(1) .count'))document.querySelector('.player-right-rail .zone:nth-child(1) .count').textContent=(s.playerDiscard||[]).length;
  if(document.querySelector('.player-right-rail .zone:nth-child(2) .count'))document.querySelector('.player-right-rail .zone:nth-child(2) .count').textContent=(s.playerDeck||[]).length;
  if(oppZones[0])oppZones[0].querySelector('.count').textContent=(s.aiDeck||[]).length;
  if(oppZones[1])oppZones[1].querySelector('.count').textContent=(s.aiDiscard||[]).length;
  if(document.querySelector('.opponent-right-rail .zone:nth-child(1) .count'))document.querySelector('.opponent-right-rail .zone:nth-child(1) .count').textContent=(s.aiManaDeck||[]).length;
  if(document.querySelector('.opponent-right-rail .zone:nth-child(2) .count'))document.querySelector('.opponent-right-rail .zone:nth-child(2) .count').textContent=(s.aiLegacy||[]).length;
  const setTop=(selector,arr,back,{emptyBlank=false}={})=>{const zone=document.querySelector(selector),im=zone?.querySelector('img.zoneCard, img');if(!im)return;const id=arr?.[arr.length-1];if(!id&&emptyBlank){im.removeAttribute('src');im.style.visibility='hidden';zone?.classList.add('gl-empty-discard');return}im.style.visibility='';zone?.classList.remove('gl-empty-discard');setCardArtwork(im,id?art(id):back);};
  setTop('.player-right-rail .zone:nth-child(1)',s.playerDiscard,'assets/ui/back-main.webp',{emptyBlank:true});
  setTop('.opponent-left-rail .zone:nth-child(3)',s.aiDiscard,'assets/ui/back-main.webp',{emptyBlank:true});
  renderRegenCounter('PLAYER',s.manaRegen);renderRegenCounter('AI',s.aiManaRegen);renderRacialTokens(s);
}
function repairBlockingStateIfNeeded(s){
  const p=s?.pending,rw=s?.responseWindow;
  const orphanResponse=p?.type==='response_window'&&!rw;
  const ownerlessResponse=!!(rw&&!rw.response_owner&&rw.target_side);
  const missingResponsePending=!!(rw&&!p);
  if(!orphanResponse&&!ownerlessResponse&&!missingResponsePending)return false;
  const rv=E()?.intent?.('repairOrphanBlockingState',[]);
  return !!rv?.ok;
}
function returnToLobbyAfterResult(){cancelCompletedMatchRefresh();resultOverlay.classList.remove('open');try{window.location.reload()}catch{location.href=location.href}}
function syncMatchActionButton(s){
  if(!matchActionBtn)return;
  const finished=!!s?.gameOver;
  if(matchActionBtn.dataset.gameFinished===(finished?'yes':'no'))return;
  matchActionBtn.dataset.gameFinished=finished?'yes':'no';
  matchActionBtn.textContent=finished?'Match Result':'Surrender';
  matchActionBtn.classList.toggle('danger',!finished);
  matchActionBtn.classList.toggle('match-result-action',finished);
  matchActionBtn.setAttribute('aria-label',finished?'Open Match Result':'Surrender this match');
}
function openGameResult(){
  const s=st();
  if(!s?.gameOver||lobbyIsOpen)return;
  showGameResult(s);
  resultOverlay.classList.add('open');
}
function showGameResult(s){
  if(!s?.gameOver||resultShown)return;
  resultShown=true;stopMatchTimer();scheduleCompletedMatchRefresh(s);
  const winner=s.winner==='PLAYER'?'YOU':(s.winner==='AI'?'LOCAL AI':String(s.winner||'UNKNOWN'));
  const reason=String(s.gameEndReason||'Game ended.');
  const phase=phaseName(s.phase)||'Unknown';
  const body=resultOverlay.querySelector('.gl-result-body');
  resultOverlay.querySelector('#glResultTitle').textContent='Game Result';
  body.innerHTML='<div class="gl-result-summary"><section class="gl-result-winner"><span>Winner</span><strong>'+esc(winner)+'</strong></section><section class="gl-result-reason"><span>Reason</span><strong>'+esc(reason)+'</strong></section><section class="gl-result-round"><span>Round</span><strong>'+Number(s.round||1)+'</strong><small>'+esc((s.turn==='PLAYER'?'Player':s.turn==='AI'?'Local AI':String(s.turn||''))+' &middot; '+phase+' Phase')+'</small></section></div><div class="gl-result-actions"><div class="gl-result-buttons"><button type="button" class="gl-result-close">CLOSE</button><button type="button" class="gl-result-back">BACK TO LOBBY</button></div><small class="gl-result-countdown">Returning to Lobby in 15s</small></div>';
  updateCompletedMatchCountdown();
  body.querySelector('.gl-result-close').onclick=()=>resultOverlay.classList.remove('open');
  body.querySelector('.gl-result-back').onclick=returnToLobbyAfterResult;
  resultOverlay.classList.add('open');
}
let glStatusPhaseSeen='',glFreezeWindowSeen='';
let glLastCardSwapNoticeSeq=0;
function renderSwapCancellationNotice(s){
  // F19: this UI is the local PLAYER's perspective. Never show a notice to
  // the attacking player when Soul Blast Shot moves the *opponent's* Hero.
  if(!s)return;
  // F20: getSnapshot() returns a new object every 120ms. Re-rendering that
  // cloned object must never replay a previously displayed engine event.
  // Only resetPresentationState() (new match) resets this stable sequence cursor.
  const events=Array.isArray(s.cardSwapNotices)?s.cardSwapNotices:[];
  for(const notice of events){
    const seq=Number(notice.sequence||0);
    if(!seq||seq<=glLastCardSwapNoticeSeq)continue;
    glLastCardSwapNoticeSeq=seq;
    if(notice.side!=='PLAYER')continue;
    const sourceCardName=cv(notice.card_id)?.name||'Card Effect';
    if(notice.kind==='completed'){
      presentationNoticeQueue.push({kind:'swap-completed',title:sourceCardName.toUpperCase(),
        detail:'Your Hero was forced to swap from '+notice.from_lane+' to '+notice.to_lane+'.',duration:2600});
    }else if(notice.kind==='canceled'){
      presentationNoticeQueue.push({kind:'swap-canceled',title:'SWAP CANCELED',
        detail:sourceCardName+': '+String(notice.reason||'No legal Swap is available.'),duration:2600});
    }
  }
  showNextPresentationNotice();
}
function renderStatusReminder(s){
  if(!s||s.gameOver)return;
  const battleKey=s.phase==='Battle'?(s.turn+'|'+s.round+'|Battle'):'';
  if(battleKey&&battleKey!==glStatusPhaseSeen){
    glStatusPhaseSeen=battleKey;
    for(const lane of laneOrder){
      const h=sideHeroes(s,s.turn)?.[lane];
      if((h?.statuses||[]).some(x=>getStatusName(x)==='Sleep'&&Number(x.duration??1)>0))
        E().showBattleSleepHint?.(s.turn,lane);
    }
  }
  const rw=s.responseWindow;
  const freezeKey=rw?.kind==='incoming_attack'?(String(rw.response_window_token||rw.commit_token||rw.card_id||'')+'|'+rw.target_side+'|'+rw.target_lane+'|'+rw.source_side+'|'+rw.source_lane+'|'+s.round):'';
  if(freezeKey&&freezeKey!==glFreezeWindowSeen){
    glFreezeWindowSeen=freezeKey;
    const h=sideHeroes(s,rw.target_side)?.[rw.target_lane];
    if((h?.statuses||[]).some(x=>getStatusName(x)==='Freeze'&&Number(x.duration??1)>0))
      E().queueFreezeHint?.(rw.target_side,rw.target_lane);
  }
}
function renderNow(){
  const s=st();if(!s)return;
  syncS0MusicForGameState();
  // Only normalize objectively inconsistent Response state. Mandatory gameplay choices are never force-cleared.
  if(repairBlockingStateIfNeeded(s)){setTimeout(renderNow,0);return;}
  const presentationPlan=buildPresentationPlan(s);
  // Hold the AI action director through the COMPLETE Rank Up choreography,
  // including the 72ms pauses when no clone is in flight. Lock before RAF.
  if((presentationPlan.heroTransitions||[]).some(x=>x.kind==='rank'))glRankPresentationRunning++;
  const expHandBefore=(presentationPlan.expReturns||[]).length?
    {PLAYER:snapshotHandPositions('PLAYER'),AI:snapshotHandPositions('AI')}:null;
  if(uiResponseSourceChoice&&s.responseWindow?.response_owner!=='PLAYER')uiResponseSourceChoice=null;
  if(responseRollbackSnapshot&&s.pending?.type!=='response_payment_choice'&&!uiResponseSourceChoice&&s.responseWindow?.response_owner!=='PLAYER')responseRollbackSnapshot=null;
  autoSpecialChoices(s);const chain=renderCombatStacks(s);
  for(const side of ['PLAYER','AI'])for(const lane of laneOrder)renderHero(side,lane,sideHeroes(s,side)?.[lane],s);
  renderHand(s);renderOpponentHand(s);syncExpButtonLock();renderExpInspector();renderMana();renderCenterChoiceStage(s);renderPhase(s);renderPay(s);renderInteractionFocus(s);renderResponseRouteGuide(s);renderDeckActions(s);renderSidebar(s,chain);renderAttackLine(s,chain);renderAllowedModal(s);renderRails(s);syncSoundButton();syncMatchActionButton(s);preparePresentationTargets(presentationPlan);showGameResult(s);renderStatusReminder(s);renderSwapCancellationNotice(s);
    requestAnimationFrame(()=>{
    syncPlayerManaPoolToHeroLeft();syncPlayerHandToHeroCenter();syncOpponentHand();syncPlayerNameBox();
    layoutManaPoolCards(playerManaHost);layoutManaPoolCards(aiManaHost);
    if(expHandBefore){
      // FLIP the existing cards, but keep the newly returned Hand slots hidden
      // until their individual animation finishes.
      for(const side of ['PLAYER','AI'])
        if((presentationPlan.expReturns||[]).some(e=>e.side===side))
          animateHandExpansion(side,expHandBefore[side]);
    }
    runPresentationPlan(presentationPlan,s);
  });
}
function clearAuthoredDummyState(){
  document.querySelectorAll('.hand-track').forEach(x=>x.innerHTML='');
  document.querySelectorAll('.hero-lane').forEach(lane=>{lane.querySelectorAll('.hero-card').forEach(x=>x.innerHTML='');lane.querySelectorAll('.attachment-card,.trait,.gl-combat-stack,.gl-status-stack,.gl-hero-actions,.gl-hp-overlay').forEach(x=>x.remove())});
  document.querySelectorAll('.mana-cards').forEach(x=>x.innerHTML='');
  document.querySelector('.played')?.replaceChildren();
  document.querySelector('.history-grid')?.replaceChildren();
  document.querySelector('.active-card-visual')?.replaceChildren();
  document.querySelectorAll('.battlelog-panel .logline').forEach(x=>x.remove());
  if(battleLogPanel)delete battleLogPanel.dataset.glLogSignature;
  const feedback=document.getElementById('actionFeedback');if(feedback)feedback.textContent='';
}
function invalidateHandRender(side){if(side==='AI')opponentHandRenderKey='';else handRenderKey='';}
function markReservedDrawEventHandled(reservation){
  const snap=st(),events=snap?.presentationEvents||[];
  for(let i=events.length-1;i>=0;i--){const e=events[i];if(e?.type==='CARD_DRAWN'&&e.side===reservation.side&&Number(e.hand_index)===Number(reservation.hand_index)&&String(e.card_id)===String(reservation.card_id)){if(e.id)seenPresentationEvents.add(e.id);break}}
}
function queueBattlefieldReservedDraw(reservation,commit){
  if(!reservation||typeof commit!=='function')return false;
  if(reservation.side==='PLAYER'&&reservation.card_id)warmCardArtwork(reservation.card_id);
  const side=reservation.side==='AI'?'AI':'PLAYER',list=glPendingDrawReservations[side];list.push(reservation);invalidateHandRender(side);renderNow();
  const run=()=>new Promise(resolve=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const from=zoneEl(side,'Main Deck'),hand=side==='PLAYER'?playerHandTrack:oppHandTrack,to=hand?.querySelector('.gl-draw-reservation-slot[data-draw-reservation-id="'+CSS.escape(String(reservation.id||''))+'"]');
    const finish=()=>{try{commit()}finally{markReservedDrawEventHandled(reservation);const at=list.findIndex(x=>String(x.id)===String(reservation.id));if(at>=0)list.splice(at,1);invalidateHandRender(side);renderNow();resolve()}};
    if(!flyBetween('assets/ui/back-main.webp',from?.querySelector('.zoneCard')||from,to,360,finish,true,false,side==='PLAYER'&&reservation.card_id?art(reservation.card_id):null))finish();
  }))});
  glExternalDrawSequence=glExternalDrawSequence.then(run,run);return true;
}
function queueBattlefieldReservedManaDraw(reservation,commit){
  if(!reservation||typeof commit!=='function')return false;
  const side=reservation.side==='AI'?'AI':'PLAYER',host=side==='PLAYER'?playerManaHost:aiManaHost;
  if(!host)return false;
  const run=()=>new Promise(resolve=>{
    renderNow();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const placeholder=document.createElement('div');
      placeholder.className='mana-card gl-mana-draw-reservation-slot gl-presentation-hidden';
      placeholder.dataset.manaDrawReservationId=String(reservation.id||'');
      const image=document.createElement('img');image.src='assets/ui/back-shard.webp';image.alt='Incoming Shard';placeholder.appendChild(image);host.appendChild(placeholder);layoutManaPoolCards(host);
      requestAnimationFrame(()=>{
        const from=zoneEl(side,'Shard Deck'),finish=()=>{let committed=false;try{const result=commit();committed=!!result;if(committed&&reservation.uid)glExternallyPresentedShardUids.add(side+'|'+String(reservation.uid));}finally{placeholder.remove();manaRenderKey='';renderNow();resolve()}};
        if(!flyBetween('assets/ui/back-shard.webp',from?.querySelector('.zoneCard')||from,placeholder,390,finish))finish();
      });
    }));
  });
  glExternalManaDrawSequence=glExternalManaDrawSequence.then(run,run);return true;
}
window.GL_GAME_PRESENTATION={queueReservedMainDeckDraw:queueBattlefieldReservedDraw,queueReservedManaDraw:queueBattlefieldReservedManaDraw,isBusy:battlefieldPresentationBusy};

function initStableBattlefieldReviewGestures(){
  if(!BF||BF.dataset.glStableReviewBound==='1')return;BF.dataset.glStableReviewBound='1';
  // Attachment nodes are recreated by the polling renderer, so native dblclick can miss them.
  // Count stable delegated pointer-downs while Hero/combat cards keep their normal dblclick handler.
  BF.addEventListener('pointerdown',e=>{
    if(e.button!=null&&e.button!==0)return;
    const card=e.target?.closest?.('.attachment-card[data-gl-card-id]');
    if(!card||!BF.contains(card)){glAttachmentLastPress={key:'',at:0};return}
    const id=card.dataset.glCardId;if(!id)return;
    const key=[card.dataset.glAttachmentSide||'',card.dataset.glAttachmentLane||'',card.dataset.glAttachmentSlot||'',id].join('|'),now=performance.now();
    if(glAttachmentLastPress.key===key&&now-glAttachmentLastPress.at<=650){
      e.preventDefault();e.stopPropagation();glAttachmentLastPress={key:'',at:0};openCardReview(id);return;
    }
    glAttachmentLastPress={key,at:now};
  },true);
}



function initSidebarControls(){document.getElementById('fullHistoryBtn').onclick=()=>{hideSidebarHoverPreview();sidebar.classList.add('history-open');sidebar.classList.remove('battlelog-open')};document.getElementById('historyClose').onclick=()=>{hideSidebarHoverPreview();sidebar.classList.remove('history-open')};document.getElementById('battleLogBtn').onclick=()=>{hideSidebarHoverPreview();sidebar.classList.add('battlelog-open');sidebar.classList.remove('history-open');requestAnimationFrame(()=>{battleLogPanel.scrollTop=battleLogPanel.scrollHeight})};document.getElementById('battleLogClose').onclick=()=>{hideSidebarHoverPreview();sidebar.classList.remove('battlelog-open')};initSoundSettings();matchActionBtn.onclick=()=>{const s=st();if(s?.gameOver){openGameResult();return}if(!lobbyIsOpen&&confirm('Surrender this match?'))intent('executeConfirmedSurrender',[])};syncMatchActionButton(st());syncSoundButton();}
function boot(){if(!E()||!B()){setTimeout(boot,50);return}B().setExternalHumanUi?.(true);E().setExternalHumanUi?.(true);B().setRenderSuppressed(true);document.getElementById('glPendingAttackDirectionLayer')?.remove();clearAuthoredDummyState();configureStaticZones();initStableBattlefieldReviewGestures();initSidebarControls();lockPrimaryActionWidth();renderLobby();updateMatchTimer();setInterval(updateMatchTimer,250);setInterval(()=>{if(!lobbyIsOpen)renderNow()},120);window.addEventListener('resize',()=>requestAnimationFrame(()=>{if(lobbyIsOpen)return;syncPlayerManaPoolToHeroLeft();syncPlayerHandToHeroCenter();syncOpponentHand();syncPlayerNameBox();layoutManaPoolCards(playerManaHost);layoutManaPoolCards(aiManaHost);placePhaseIndicator(document.querySelector('.phase-label.active'),false);renderAttackLine(st(),chainActions(st()))}),{passive:true});window.GL_GAME_UI={render:renderNow,state:st,intent,openLobby:()=>{lobbyIsOpen=true;syncS0MusicForGameState();renderLobby()},closeInspect:closeInspectModal};}
boot();
})();
