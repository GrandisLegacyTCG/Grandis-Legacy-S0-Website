/* Two interaction profiles: desktop PC/laptop and touchscreen tablet/phone.
 * Identity does not depend on CSS resolution, DPR, or an attached pointer.
 * The historic 'mobile' key is retained for all touch-layout consumers. */
(()=>{'use strict';
 const root=document.documentElement,nav=navigator;
 const requested=String(new URLSearchParams(location.search).get('platform')||'').toLowerCase();
 const ua=String(nav.userAgent||''),platformHint=String(nav.platform||'');
 const touchOverride=requested==='mobile'||requested==='touch'||requested==='tablet';
 const manual=touchOverride||requested==='desktop';
 const ipadOS=/MacIntel|Macintosh/i.test(platformHint+' '+ua)&&Number(nav.maxTouchPoints||0)>1;
 const mobileDevice=nav.userAgentData?.mobile===true||ipadOS||
   /iPhone|iPod|iPad|Android|Windows Phone|IEMobile|Opera Mini|BlackBerry|BB10|Tablet|PlayBook|Silk\/|Kindle|\bKF[A-Z0-9]+\b/i.test(ua);
 const touch=touchOverride||(requested!=='desktop'&&mobileDevice);
 const platform=touch?'mobile':'desktop';
 root.dataset.glPlatform=platform;
 root.dataset.glInteraction=touch?'touch':'cursor';
 window.GL_PLATFORM=Object.freeze({name:platform,interaction:touch?'touch':'cursor',isMobile:()=>touch,isTouch:()=>touch,manual});
 // Browser bars, split-screen and keyboard may reduce the visible CSS area.
 // Coordinates are CSS pixels; DPR must never be applied to a touch stage.
 window.GL_VIEWPORT=Object.freeze({read(){
   const vv=window.visualViewport,iw=Math.max(1,window.innerWidth||1),ih=Math.max(1,window.innerHeight||1);
   const style=window.getComputedStyle?.(root),inset=edge=>Math.max(0,parseFloat(style?.getPropertyValue('--gl-safe-'+edge))||0);
   const vx=Math.max(0,Number(vv?.offsetLeft)||0),vy=Math.max(0,Number(vv?.offsetTop)||0);
   const x=Math.max(vx,inset('left')),y=Math.max(vy,inset('top'));
   const right=Math.min(vx+(Number(vv?.width)||iw),iw-inset('right'));
   const bottom=Math.min(vy+(Number(vv?.height)||ih),ih-inset('bottom'));
   return{width:Math.max(1,right-x),height:Math.max(1,bottom-y),x,y};
 }});
})();
