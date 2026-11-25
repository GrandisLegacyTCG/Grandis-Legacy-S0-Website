/* Platform identity is independent of viewport size and pointer capability.
 * Explicit override covers desktop-site mode and browsers that conceal identity. */
(()=>{'use strict';
 const root=document.documentElement,nav=navigator;
 const requested=new URLSearchParams(location.search).get('platform');
 const ua=String(nav.userAgent||''),mobileUA=/iPhone|iPod|Windows Phone|Android.*Mobile|Mobile.*Android|Opera Mini|BlackBerry|BB10/i.test(ua);
 const smartphone=requested==='mobile'||(requested!=='desktop'&&(nav.userAgentData?.mobile===true||mobileUA));
 const platform=smartphone?'mobile':'desktop';
 root.dataset.glPlatform=platform;
 window.GL_PLATFORM=Object.freeze({name:platform,isMobile:()=>smartphone,manual:requested==='mobile'||requested==='desktop'});
})();
