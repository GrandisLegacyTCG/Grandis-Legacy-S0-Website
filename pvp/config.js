/* Grandis Legacy S0 PvP RC40 Patch 3.2: static website -> Node backend.
 * Current approved Northflank hostname (confirmed by project owner via /health).
 * Static GitHub Pages cannot proxy /ws; use WSS on the backend host.
 */
window.GL_PVP_CONFIG=Object.assign({
  wsBase:'wss://p01--grandis-legacy-pvp-room2--2kwws8nzlcc2.code.run',
  wsPath:'/ws',
  homeUrl:'https://grandislegacytcg.web.id/',
  vsAiUrl:'https://grandislegacytcg.web.id/',
  deckBuilderUrl:'https://grandislegacytcg.web.id/deck-builder/'
},window.GL_PVP_CONFIG||{});
