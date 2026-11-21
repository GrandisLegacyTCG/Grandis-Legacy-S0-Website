/* PvP shared artwork: all 250 current cards already live at /card-art/. */
(()=>{'use strict';
window.GL_PVP_CARD_ART_URL=function(id){
 const raw=String(id||'').trim();
 if(!/^S0-[A-Z0-9-]+$/.test(raw))return '';
 return '/card-art/'+encodeURIComponent(raw)+'.webp';
};
})();
