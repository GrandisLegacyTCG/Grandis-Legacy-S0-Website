# Grandis Legacy Season 0 PvP Website overlay — 20 Nov 2026

**Merge only `pvp/`** into `GrandisLegacyTCG/Grandis-Legacy-S0-Website` on `main`. Do not use in the S0 backend standalone host or Season 1 PvP. GitHub upload and Northflank deployment are manual owner tasks only.

## New WSS endpoint
`/pvp/config.js` supplies `wsBase:'wss://p01--grandis-legacy-s0-pvp--2kwws8nzlcc2.code.run'`, `wsPath:'/ws'`.
Backend `GrandisLegacyTCG/Grandis-Legacy-S0-PvP` must report `transport:ws`, and both must keep build ID `gl-s0-pvp-rc41-r39-v34-part5-2026-11-19`. Keep old Room2 active as fallback but do not route normal PvP requests to it.

## Shared Website UI and analytics (no root files inside ZIP)
- PvP lobby and directly loaded battlefield include shared Analytics loader: `/assets/js/gl-site-analytics.js?v=20261120-v1` (measurement ID managed by Website root, not hardcoded twice in PvP).
- PvP lobby includes `/assets/css/gl-site-brand.css` and `/assets/css/gl-site-navigation.css`, plus scoped PvP-only compatibility CSS.
- Header logo source `/assets/site/web-s0/logo-transparent.webp`, classes `gl-site-brand` and `gl-site-brand-img`, routing to `/`.
- `GO TO DECK BUILDER` routes `/deck-builder/`; `GO TO VS AI` routes `/vs-ai/`, primary blue and no gold hover border.
- Existing 109 SHA-verified asset redirects stay rooted at Website `/assets/`, `/engine/assets/` and `/deck-builder/` as mapped in `SHARED_ASSET_AUDIT.json`; `/card-art/` remains shared for 248 card images.
- Website owner must deploy the canonical root Navigation CSS and Analytics JS first; the currently visible main-branch snapshot checked during integration did not contain those two files. Do not copy their contents into `/pvp/` or modify root assets in this PvP release.

## Donor compatible mobile scope
- The 20 Nov VS AI donor includes new AI Intermediate decision policy, viewport mobile flight orientation and mobile preview CSS.
- Only the applicable mobile visual intent (248×347 preview of Hero/Skill/Item/Event/Legacy/Mana in logical stage) is adapted for PvP's already-rotated BODY. No AI decision policy, card engine, game rules, seat/network authority or WebSocket protocol was modified.
- Desktop and unrotated mobile landscape preview code retains its original behavior. Mobile lobby header is isolated from physical CSS viewport breakpoints, so rotated lobby stays compact instead of wrapping buttons vertically.

## Acceptance
- GitHub Pages pages `/pvp/` and `/pvp/battle/` load without 404; header links, analytics and card art work.
- Desktop/phone: inspect logo header offsets, nav hover, mobile rotated lobby and preview; no modal overlays off screen.
- Two live clients: Host/Join/Ready/Spectate, Coin, Match, Payment, Response, End Phase, Reconnect, Surrender. Verify `/health` WS native and matching buildId.
- A local browser using inline fixtures validates layout but does NOT validate network or on-site GA4 Realtime reporting. Production testing is required.
