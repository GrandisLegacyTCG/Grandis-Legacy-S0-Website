/* Grandis Legacy S0 | Website-wide GA4 initialization | 2026-11-20.
 * Canonical property: Homepage G-FVQCYF8PKQ, shared by all non-PvP pages.
 * Deck Builder also retains its former property G-TG5921Z2EL for continuity.
 * One library load + one 'js' initialization per page. No gameplay dependency. */
(function () {
  'use strict';
  if (window.__GL_S0_ANALYTICS_LOADED__) return;
  window.__GL_S0_ANALYTICS_LOADED__ = true;
  var primaryId = 'G-FVQCYF8PKQ';
  var deckBuilderId = 'G-TG5921Z2EL';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {window.dataLayer.push(arguments);};
  window.gtag('js', new Date());
  window.gtag('config', primaryId);
  var routePath = new URL(document.baseURI).pathname;
  if (/^\/deck-builder(?:\/|$)/.test(routePath)) {
    window.gtag('config', deckBuilderId);
  }
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(primaryId);
  document.head.appendChild(tag);
})();
