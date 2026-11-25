# Grandis Legacy PvP — Latest VS AI Standalone UI Integration

**Date:** 25 November 2026  
**Scope:** Season 0 PvP, presentation-only change.  
**Source of truth:** owner-supplied VS AI standalone archive `Grandis_Legacy_VS_AI_Season0_RC42_2026-11-25.zip` and last working PvP S3 UI Sync 1 with asset dedup. **No GitHub/Website repo source consulted.**

## Changes actually integrated

- **Universal Action Popup:** use the donor's shared count/space sizing logic for center pending-action cards and optional Swap; desktop normal face 100% Hero, mobile 89% Hero, with a bounded one-row layout (1, 3, 8 and 12 cards exercised in synthetic Chromium). Collection selection grids keep their own presentation rules. No client-side game resolution was added.
- **Adaptive Hand:** both live-game Hand strips fit the space between adjacent HUD rails, reducing card sizes as count increases, restoring size as cards leave; no `innerHTML` reset or artwork source change.
- **Mobile Hero HUD:** HP anchor, Status, EXP/Attachment and micro-actions use the same measured Hero scale factor; CSS applies viewport scale once and retains exhaustion orientation.
- **Status details:** read-only tap tooltip on a mobile Hero; tap again/outside to close. Clickable Status removal continues to invoke the pre-existing validated intent path and must not be swallowed by the tooltip.
- **Mobile popup & Review:** donor-style typography, layout, header and scroll owner; portrait scroll bridged to PvP's rotated physical axis. Lobby and Battlefield Card Review are adapted separately, without replacing their existing popup lifecycle/parent-origin controls.
- **Card Played:** visible slots adapt between six and nine based on available sidebar height; placeholders and signature include slot count, preventing a stale six-card grid on resize.
- **Artwork contract:** exact-card thumbnail-first pipeline, fail-safe high-resolution upgrade, back-of-card privacy masking and 250-thumbnail manifest unchanged.
- **Previously shipped UI:** Response PASS gold highlight, REPOSITION spacing, dark/gold Import Deck button and mobile counter sizes kept from prior sync.

## Explicit exclusions and network safety

Only the following existing UI files are changed: `public/index.html` (lobby review cache token), `public/battle/index.html`, `public/battle/shared-app/app-runtime.js`, `public/battle/shared-app/db158-card-review.js`, `public/pvp/db158-card-review.js`, and `public/battle/shared-ui/pvp-mobile-card-list-scroll.js`, plus one new scoped CSS file and QA/docs. `package.json` adds test script only. No donor AI policy, autoplay or browser-owned authority imported.

The following modules are **SHA-256 locked and unchanged** relative to the PvP baseline: `server.js`, `public/battle/runtime/pvp-network.js`, `public/battle/runtime/adapters/pvp-adapter.js`, `public/battle/runtime/adapters/authority-adapter.js`, `public/battle/engine/shared-app/app.bundle.js`, `public/battle/runtime/pvp-artwork-loader.js` and `public/battle/runtime/pvp-card-thumbnails.js`. Both-seat authenticated intent, ACK/revision/idempotency, exact Mana payment, pending continuation, reconnect, hidden viewer projections and spectator remain owned by PvP server.

## Two outputs & distribution

1. **Standalone:** complete Node backend repo, including self-hosted UI, canonical art, 250 WebP thumbnail files + inline thumbnail fallback, network and tests, dedup manifest/hydrator. Launch with `npm start` or build the bundled `Dockerfile`; running a raw extracted package using `node server.js` without hydration is unsupported. Keep one Northflank replica while state remains in-process.
2. **Website:** ZIP with **only one top-level `pvp/`**, shared root artwork/assets URLs and a remote WSS configuration. Website/VS AI/Deck Builder/homepage/root assets are not modified; merge manually after the owner finishes their independent website build.

The PvP protocol **Build ID remains the same as the UI Sync 1 baseline** for compatibility. Changed CSS/JS have new cache query tokens. This is an **UI release candidate**, not an engine/network protocol migration.

## Test evidence and limits

- Static contract asserts the exact runtime features and SHA-256 immutability of the seven protected modules; PASS.
- Chromium `page.set_content` synthetic: desktop Hero 100%, mobile 89%, count 1/3/8/12 without overflow, adaptive Hand 1/5/12, Card Played 6 or 9, read-only Status tap and outside close; PASS.
- Chromium synthetic viewport test 320x568, 390x844, 844x390, 430x932, 720x393, 738x1370, plus desktop 1440x900; uniform mobile scaling and HP measured; PASS.
- Existing `check:rc42`, `test:step1`, `test:step2`, `test:step3` (standalone + paired Website manifest), and `test:ui-sync`: **each passed with exit status 0 when run individually**; `npm run check` displayed all PASS lines but the combined runner was interrupted by the execution timeout, so it is **not claimed as one successful exit-0 command**.
- **NOT TESTED:** native two-real-browser full match on actual deployed Northflank WS, real Android/iOS UI, real Website root integration, and live network-latency/reconnect tests. The static/synthetic tests do **not** prove those results.

## Regression policy

Before declaring Stable, deploy both matching artifacts together and run a live two-human full match: Ready, coin, opening, Response PASS, Mana payment, blind opponent Mana Burn/Steal (including Attack follow-up), nested choices, Search/Return, Swap, reconnect/lost ACK, surrender, mobile Card Review/Hand/Status/scroll; inspect both seats and spectator for privacy, image fallback and no 404. No GitHub push or deployment was performed as part of this change.
