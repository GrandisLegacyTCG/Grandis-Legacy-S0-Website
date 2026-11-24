# Grandis Legacy Season 0 PvP — STEP 2 mobile UI integration (24 Nov 2026)

Status: **working source / not a released artifact**. Retain this branch of local source for STEP 3; owner requested only the final two packages after all three steps.

## Architecture boundary
- **Donor**: VS AI RC42 most recent available 24 Nov source, Mobile Batch 2 plus prior approved touch UI.
- **PvP authority/network**: STEP 1 unchanged; byte-locked `server.js`, headless engine, commit semantics, `pvp-network.js`, and `pvp-adapter.js`.
- **Gameplay**: `static-data.js` and rules unaffected. Only a *card-back presentation* correction is made to `app.bundle.js`; no gameplay action semantics changed.
- **Website package**: update stays within `/pvp/`; no shared root/other apps copied.

## Implemented
1. Remove nonuniform `scale(scaleX, scaleY)` mobile transform and use one `scale(s)` as in latest VS AI donor; support portrait rotation via existing full-body PvP stage. Visible viewport used to avoid Chrome desktop-canvas overflow; dynamic logical stage W/H replaces stretching.
2. Keep previously approved RC42 touch (46.8px Phase Tracker, 5-column scroll selection, Magic Compass/Search to Hand, 400ms long press, 85%-of-Hero center prompt, attachment 5% reduction) and add donor **Mobile Batch 2**: centered selection row, dynamic 1..12 prompt cards incl Return EXP, contextual +20% preview, attachment/status/deck/mana counters.
3. Donor preview coordinates are converted through PvP's `uiRect()` and do not import VS AI gameplay event handlers; scenes remain in the rotated full-body PvP context.
4. Correct obsolete `back-main.webp`, `back-legacy.webp`, `back-shard.webp` files in standalone and `/pvp/assets/ui/`; correct the five isolated Mana-Shard visualization routines still referencing Legacy-back.
5. `uiViewportSize()` uses actual expanded logical W/H on mobile so floating UI/animation position matches stage dimensions.

## Main changed files
- `battle/index.html` (standalone under `/pvp/`)
- `battle/runtime/pvp-mobile-vsai-batch2-parity.css` (new)
- `battle/shared-app/app-runtime.js`
- `battle/engine/shared-app/app.bundle.js` (visual card backs only)
- `/pvp/assets/ui/back-{main,legacy,shard}.webp` and corresponding standalone assets.
- Standalone-only `tests/step2-mobile-vsai-parity.mjs`, `package.json` regression wiring, compression outputs.

## Local QA
- `npm run check`: PASS, including STEP 1 full network/authority regression + STEP 2 lock.
- `PVP_WEBSITE_ROOT=... npm run test:step2`: PASS (standalone vs Website byte parity; authoritative network/engine hash locks, correct owner back-of-card hashes).
- `python3 docs/step2/qa_mobile_synthetic.py`: PASS, touch viewport 390x844, 844x390, 360x700, 1180x820, 1280x600. Verified full BODY matrix has **uniform x/y scaling**, ratio 1.000, no JS exceptions, Phase 46.8 CSS px; desktop 1440x900 untouched.
- `python3 docs/step2/qa_mobile_choices.py`: PASS for Pay Mana 1/12 cards, 8 Action choices, 8 Return EXP, three handset viewports; no horizontal scrolling, cards 85% of actual mobile Hero where row width permits. Synthetic actual stage uses both embedded HTML CSS blocks.
- JS syntax checks: PASS. `npm run build:precompress`: PASS.

## Limitations (do not claim production PASS)
- Chromium in this environment denies all navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`), so the synthetic tests used DOM/CSS/JS injected via `page.set_content`. **Real game in two devices/browsers, CSS/network loading from hosted Website, Northflank native WSS, RAM/FPS load, and production mobile visuals remain unverified.**
- No GitHub commit/push, no Northflank deployment. Do not release before STEP 3 comprehensive performance/security/gameplay tests.
