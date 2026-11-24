# Grandis Legacy PvP — Website Integration & QA

Date: 24 November 2026.

## Source of truth
- Latest uploaded standalone Website (without `/pvp/`): `Grandis_Legacy_Website_FULL_NO_PVP_VSAI_RC42_Mobile_All5_Shared_Favicon_2026-11-24.zip`.
- Existing newest PvP website release: `Grandis_Legacy_S0_PvP_Website_PVP_ONLY_RC42_R398_R40_SHARED_2026-11-24.zip`.
- PvP standalone backend (reference only; unchanged): `Grandis_Legacy_S0_PvP_Standalone_Backend_RC42_R398_R40_CLEAN_ROOT_2026-11-24.zip`.
- No GitHub repository, homepage, Deck Builder, VS AI, rulebook, or root Website files were modified.

## Changes (website `/pvp/` ONLY)
- Adopt five VS AI RC42 mobile UI patterns using a PvP-owned overlay CSS and touch gesture adapter. Adapted to PvP BODY rotation and retained its 1600 × 747 gameplay reference frame. Expanded phase tracker; five-column scrolling multi-card decisions; Magic Compass touch scrolling; 85% active-Hero-sized center choices; larger Hand preview/tap-outside dismissal. Persist modal scroll when selecting cards.
- Fixed custom JSON import: selecting the same filename can re-import; success only after exact deck payload is confirmed in authoritative server snapshot; rejected/unconfirmed imports are not optimistically committed in the browser; a separate backend atomic-validation hardening issue remains documented below.
- Shared site navigation owns PvP nav button styles; PvP CSS only positions buttons. Navigation destinations and Rank styling preserved.
- Both Lobby and Battlefield use shared `/assets/site/web-s0/favicon.png`; shared Analytics loader loaded exactly once per page.
- Reuse shared Website `/card-art/` (250 current WebP art), fonts, logo, UI icons/audio. Retain three byte-distinct PvP card backs; remove one identical Tavern Quest audio copy and one unreferenced duplicate exit.png.
- This paired RC42-B release changes direct Battlefield WebSocket config, build-meta and PvP asset paths; game rules and intent protocol remain unchanged.

## SHA-256 verification (actual uploaded source)
- Website artwork files match the standalone backend: **250/250**.
- Website shared non-artwork binaries match existing approved lock: **109/109**.
- No card artwork copied under `/pvp/`.
- Build ID: `gl-s0-pvp-rc42-r398-r40-20261124-b` (new paired release; previous suffix -a superseded).

## Changed files
- pvp/battle/index.html
- pvp/battle/shared-app/app-runtime.js
- pvp/docs/SHARED_ASSETS_DEPLOYMENT.json
- pvp/docs/WEBSITE_PVP_DEPLOYMENT.md
- pvp/index.html
- pvp/lobby/pvp-shared-header-20261120.css
- pvp/pvp/pvp-host.js
- pvp/pvp/pvp-integration.css

## Added files
- pvp/battle/runtime/pvp-mobile-all5.css
- pvp/battle/shared-ui/pvp-mobile-card-list-scroll.js
- pvp/docs/ARCHIVED_BATTLE_README.md
- pvp/docs/WEBSITE_FILES_MANIFEST.json
- pvp/docs/WEBSITE_INTEGRATION_QA_2026-11-24.md
- pvp/docs/WEBSITE_INTEGRATION_QA_RESULTS.json

## Removed obsolete duplicate files
- pvp/battle/README.md
- pvp/battle/assets/lobby/exit.png
- pvp/battle/engine/assets/audio/Tavern Quest.mp3

## Validation results and limits
- Node syntax validation of changed JavaScript: **PASS**.
- Favicon, GA (one loader per page), shared logo/nav dependency and both entry pages' local script/stylesheets: **PASS**.
- Synthetic Chromium lobby and simulated server snapshot import tests: **PASS**, including same filename different content and rejected import.
- Real local server (`node server.js`, offline RFC6455 `ws-lite`) A→B→A custom Deck Builder exports and authoritative snapshot match: **PASS**. The production native `ws` transport remains unverified.
- Known backend-only issue: `setDeckFast()` assigns `customDeck` and `deckName` before completing formation validation; malformed direct WS requests could partially mutate state on rejection. The frontend prevents missing/invalid exported formation from reaching the server, but backend atomicity remains a separate required fix.
- Synthetic mobile layout 393 × 850 / 720 × 393 and physical swipe bridge simulations: **PASS**.
- Mainline Gameplay and network adapters remain byte-identical to baseline; their historical tests were not rerun in a live production backend.
- HTTP navigation to localhost was blocked by runtime's browser policy (`net::ERR_BLOCKED_BY_ADMINISTRATOR`). Native full-page HTTP browser test: **NOT VERIFIED**.
- Live production WSS, complete match using two actual browsers, and device-level touch QA: **NOT VERIFIED**.
- Some old inactive/historical CSS URLs are unresolved in direct static CSS scan: 0. The two HTML entry pages resolve all directly referenced CSS/JS files; these historical nested declarations were not exercised by synthetic tests.

## Deployment & deletion policy
- Add/replace **only** `/pvp/` on top of the newest Website FULL_NO_PVP source. Do not upload root assets, do not delete `/card-art/` or `/engine/`, and do not remove the root favicon compatibility until all other routes are migrated.
- Delete only stale files listed in **Removed** from the old `/pvp/` folder if they already exist. If merging with a clean root, the ZIP includes only the current desired files.
- Keep backend on the matching build ID; validate production `/health` and real WSS before announcing production stable.

## RC42-B paired package correction

This directory was rebuilt from the uploaded **Part 6 All5/Import/SharedFavicon**
ZIP, not from the older GitHub tree. The paired backend now uses the atomic
`setDeckFast()` implementation and is packaged separately. Both pages already
use the shared favicon and one shared Analytics loader; the direct Battlefield
WebSocket is now driven by `../config.js`. All5 CSS and swipe adapter remain.
Card backs and two special PvP battle sounds use their distinct `/pvp/` paths.
These browser-only adjustments do not alter server gameplay rules.
