# Grandis Legacy — PvP-Only Website Merge (Latest Shared Assets)

## Deployment input

Add exactly the `pvp/` directory from this archive to the **latest uploaded website base**:

`Grandis_Legacy_Website_FULL_NO_PVP_VSAI_RC42_Mobile_All5_Shared_Favicon_2026-11-24.zip`

The Website owner merges manually. Do not replace the Homepage, Rulebook, VS AI, Deck Builder, `/card-art/`, or the shared website root. Do not push any changes to GitHub from this project.

## Shared asset contract

- Card art: all **250** card faces use `/card-art/{CARD_ID}.webp` from the website root, with no card-art duplicates inside `pvp/`.
- Shared non-artwork assets: **109** approved image/audio/font files reuse Website root paths, verified against the latest uploaded Website with SHA-256 checks.
- Header logo: `/assets/site/web-s0/logo-transparent.webp`.
- Header styling: `/assets/css/gl-site-brand.css` and `/assets/css/gl-site-navigation.css`. PvP changes only the positioning of links.
- Favicon on **both** `/pvp/` and `/pvp/battle/`: `/assets/site/web-s0/favicon.png`.
- Analytics on both pages, **once per page**: `/assets/js/gl-site-analytics.js` (`G-FVQCYF8PKQ`).
- Unique PvP assets, including the three PvP-only back images, remain inside `pvp/`.
- Standalone PvP backend separately retains its local assets for backend-hosted pages; no backend files are shipped in the website overlay.

## Gameplay/Network contract

- PvP Engine and PvP adapter are kept in `/pvp/battle/` independently of the Website root engine.
- WSS is configured in `pvp/config.js`, with an independent production host and `wsPath:'/ws'`.
- Both frontend pages use the same existing PvP engine build. The website front-end build ID matches the standalone backend's `BUILD_ID`.
- No production WebSocket or backend deployment is performed by this archive.
- The five VS AI donor mobile UI improvements were adapted to PvP's rotated-body presentation. The donor's AI/gameplay JS was not copied into networking.
- Import Deck now verifies a full authoritative server snapshot before marking a new deck as active, supports re-import of the same filename, and refuses malformed exported Hero formations before they reach the server.

## Manual smoke-test after merge

1. Verify `/pvp/` and `/pvp/battle/` both serve correctly over HTTPS (not just synthetic Chromium).
2. Verify the navigation links, shared favicon, logo, Google Analytics and zero network 404s.
3. Start two browsers: host, join, select/IMPORT custom decks, ready, complete opening and at least one full game with Response, mana effects and reconnect.
4. Check mobile portrait and landscape on real touchscreen hardware, including Magic Compass scrolling and Card Review.
5. Confirm backend build ID and production WSS health; do not declare production stable without this validation.
6. To remove old local duplicates during manual merge, see `docs/WEBSITE_INTEGRATION_QA_2026-11-24.md`. Do not remove the Website root `/engine/assets/favicon.png` until other Website routes have migrated too.

## Paired backend RC42-B import validation

The paired standalone backend validates the entire imported custom deck and
three-Hero formation before committing any player deck state. The earlier
website-only package's warning about partial mutation refers to another
backend snapshot and is resolved in this specific paired delivery.

Direct `/pvp/battle/` now loads `/pvp/config.js` for external WSS; the embedded
Battlefield continues to use its parent's single authenticated WebSocket.
PvP's three unique backs and two unique P.Attack/P.Defense sound files are
served from `/pvp/` to avoid accidentally using byte-different website assets.
The browser-side gesture adapter uses the actual portrait-axis scale.

The new release protocol build ID is `gl-s0-pvp-rc42-r398-r40-20261124-b`. Deploy the standalone
backend and website `/pvp/` folder as a matched pair. Live WSS and physical
mobile acceptance remain required.
