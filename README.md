# Grandis Legacy — Season 0 RC40 + Deck Builder v1.66 + PvP RC40 Patch 3.2 Static Frontend

**Production static-site package, runtime only, RC40 minor integration 2026-11-14.** No development/QA/history files or authoritative PvP Node server code are included.

## Latest verified source packages

- VS AI: `Grandis_Legacy_VS_AI_Season0_RC40_2026-11-14.zip` (RC40 Part 5, 14 November 2026).
- Deck Builder: `Grandis_Legacy_Deck_Builder_v1.66_2026-11-14.zip` (v1.66 latest UI focus/hover update).
- Artwork: **Main Deck R3.8 / Legacy Deck R3.7**, 242 card files identical byte-for-byte in RC40 and v1.66.
- Mana: 6 existing Mana art files; 248 shared WebP images total in `/card-art/`.
- Player Rulebook: unmodified `Grandis_Legacy_Player_Rulebook_v3.3_EN_2026-11-14.pdf`.

## Entry points

- `/` — VS AI RC40 lobby and game.
- `/deck-builder/` — Deck Builder v1.66 Style 1.
- `/deck-builder/style-2/` — Deck Builder v1.66 Style 2.
- `/deck-builder/style-1/` — redirect to Style 1.
- `/rulebook/Grandis_Legacy_Player_Rulebook_v3.3_EN_2026-11-14.pdf` — downloadable rulebook.
- **GO TO PVP** header button points to **https://grandislegacytcg.web.id/pvp/** from VS AI, Deck Builder Style 1 and Style 2. Mobile menus include PVP. **The PvP static frontend is hosted in this repository; the authoritative Node backend runs separately.**

## PvP frontend hosted here; server hosted separately

- `/pvp/` is a **real static page** under this GitHub Pages site, and `/pvp/battle/` is the PvP battlefield.
- `GrandisLegacyTCG/Grandis-Legacy-PvP-Trial` contains the **independent authoritative Node.js/WebSocket server** and tests; backend code and secrets do not belong in this Website repo.
- PvP is not playable until a matching backend is deployed and its WSS endpoint is reachable. The client uses `pvp/config.js` for `wsBase` and `wsPath` (currently the current Northflank hostname, confirmed reachable by the user with /health on Patch 3.2).
- This frontend corresponds to **PvP RC40 Patch 3.2**, build ID `gl-s0-pvp-rc40-patch32-item-discard-2026-11-14`. The backend must implement the matching protocol/build ID. Future backend changes to that contract may require a future frontend update; otherwise no Website rebuild is required.
- GitHub Pages serves static assets only. **Do not deploy `server.js` or attempt `/ws` at the Website domain.**

## Artwork integrity and caching

Exactly 248 WebP files are shipped in the root `card-art/` folder (242 cards + 6 Mana). Deck Builder standalone's 242 duplicates are excluded. Both Deck Builder styles resolve card and Card Review image URLs to **the same absolute URL** as VS AI under the same website base, using revision `gl-vs-ai-s0-rc40-r38-r37-20261114` to invalidate older R3.6/R3.7 images from browser cache. For every image file, copy remains pixel/byte identical to RC40. A passive Back-of-Card error fallback (and player-hand decode-aware fallback) protects against transient image failure; it cannot fix a missing deployment or broken network.

## Manual GitHub Pages deployment

1. This is a **FULL REPO**, not a patch. Replace the old published repo contents with the *contents of this ZIP at the repository root* (do not upload the ZIP as a single file, and remove stale files not in this package).
2. Keep current `GrandisLegacyTCG/Grandis-Legacy-Website` GitHub Pages settings: **Deploy from a branch → main → /(root)**. No additional Actions workflow/build step.
3. Keep `index.html`, `.nojekyll` and `CNAME` directly in root, with custom domain exactly `grandislegacytcg.web.id`. Confirm Pages site deploys successfully.
4. If Pages reports `startup_failure` before any build job starts, troubleshoot GitHub Pages/Actions configuration. Runtime file changes alone cannot resolve a GitHub-hosted workflow startup error.
5. Smoke-test VS AI, both Deck Builder styles, PvP Lobby and static art after deployment. PvP multiplayer requires the separately hosted matching WebSocket backend.

## Integrity and scope

All RC40 core engine/data/authority/UI scripts are copied without modification, except the outer VS AI index and integration-only `shared-app/app-runtime.js` (lobby buttons and card loading). Deck Builder v1.66 behavior and card data source remain current; only index navigation and the runtime image URL resolver in `deck-builder/js/data-s0.js` are changed. All current active CSS/JS and required UI/audio, review and keyword assets are retained. The PvP browser frontend/network client is included under `/pvp/`, but no authoritative PvP Node backend, secrets, QA logs, development dumps, or test fixtures are shipped. No GitHub operations performed by the assistant.

## RC40 in-place minor update (2026-11-14)

This build incorporates the latest VS AI RC40 source contents while preserving the already-deployed RC40 + Deck Builder v1.66 website's integration. Changed published files: `engine/shared-app/app.bundle.js`, `engine/js/static-data.js`, `assets/review-db158/js/db166-view-model.js`, `assets/review-db158/js/s0-review-clarity.js`, `shared-app/db158-card-review.js`, `index.html` (versioned script URLs), and this README.

- **Card Played:** active Attachment and Casting descriptions show readable player effects instead of internal slot/role/expiry/counter metadata.
- **Intermediate AI Defensive Formation:** waits for opponent Mana Regen >=4, plus a critical allied Hero or sufficiently threatening visible opposing board (no hidden-Hand access).
- **Intermediate AI Coordination Attack:** commits only with two distinct legal Hand Attacks affordable across the current and next AI turns; the second Attack is reserved.
- **Ancestral Focus and Card Review:** printed wording uses '2 Mana cards' (the gameplay still gains 2 physical Mana Shards). MANA STEAL explanation is aligned with current source.
- No Rulebook, Deck Builder logic, shared artwork or GitHub Pages configuration changes were needed. The PvP frontend is added under `/pvp/`.
- Historical RC40 source gate: 373/373 assertions; latest Item/Discard/Draw RC40 maintenance gate reported 726/726 assertions and 25/25 seeded AI games. Source-level regression evidence does not guarantee flawless live browser gameplay.

The GitHub Pages source remains **Deploy from a branch -> main -> /(root)** with `CNAME=grandislegacytcg.web.id`. Use the **ONE_UPLOAD FULL REPO** to replace the complete Website root once. Preserve GitHub Pages settings and domain. This package includes the latest RC40 Item/Discard/Draw maintenance and the `/pvp/` frontend.

## RC40 Item/Discard/Draw maintenance (2026-11-14, Website-only)

This manual deployment package is based on the live `GrandisLegacyTCG/Grandis-Legacy-Website` 482-file layout at commit `dc50d0d6672a2e51fa0787a9be8cf5a18b09e6cc`. No GitHub writes were performed. Latest source: `Grandis_Legacy_VS_AI_Season0_RC40_2026-11-14.zip` with RC40 "Item/Class + physical Discard validator / UI hotfix" revision.

Updated VS AI:
- Adopt source engine `engine/shared-app/app.bundle.js` unchanged: enforce printed class/lineage gates for six restricted Items; separate protected Hero and Item user in Response; reject invalid/stale/duplicate physical Hand/Deck/Discard selections before spending costs.
- Adopt source CSS `shared-ui/battlefield-ui.css` unchanged: hide redundant CANCEL for read-only inspect and style local card Draw flip.
- Merge source UI into `shared-app/app-runtime.js`, retaining existing Website lobby links (GO TO DECK BUILDER, GO TO PVP) and shared artwork loading/Back-of-Card fallback. Fix stale choice recovery, coin sentence-case wording, and player-only Draw reveal; AI Draw remains concealed.
- `index.html`: cache bust for these changed scripts/styles only.

No changes to Deck Builder v1.66, shared `card-art/` (248 WebP), rulebook, CNAME, Pages settings, or PvP backend. This release **adds** the 217-file PvP static frontend under `/pvp/`; server and actual WSS availability remain a separate deployment. The latest Website-only Item/Discard/Draw fixes are preserved.

**ONE UPLOAD:** replace all existing GitHub Website root files with the contents of this ZIP (not the ZIP itself and not a nested directory). Keep `CNAME` and `.nojekyll` at root; Pages source `main` / `(root)` stays as is. Use the separate integration audit for runtime and live-test limitations.


## One-upload release — static Website checklist (2026-11-14)

- **VS AI:** latest RC40 source engine (including Item Class, physical Discard, Coin Flip and Draw UI maintenance).
- **Deck Builder:** v1.66, both Style 1 and Style 2 unchanged from the prior Website package.
- **PvP:** RC40 Patch 3.2 frontend at `/pvp/`, with independent backend `Grandis-Legacy-PvP-Trial`.
- **Artwork:** exactly 248 shared `card-art/*.webp` (242 unique cards + six Mana); no duplicate copies under `pvp/` or `deck-builder/`.
- **Routing:** Website main page `/`, Builder `/deck-builder/`, PvP `/pvp/`, PvP battle `/pvp/battle/`.
- **Backend default:** `pvp/config.js` uses `wss://p01--grandis-legacy-pvp-room2--2kwws8nzlcc2.code.run/ws`, pending live verification. If Northflank hostname changes, that single config file must be updated and redeployed.
- **Required backend config:** allow origin `https://grandislegacytcg.web.id`; preserve build ID/protocol for Patch 3.2 frontend; use one replica while game rooms are in-memory.
- **Live checks after manual deployment:** Pages success; all four entry pages load; no missing art; backend `/health` returns `transport=ws` and expected build ID; two browsers connect, coin flip, play Response, reconnect; no hidden opponent Hand or Mana identities exposed.
- **No GitHub or Northflank writes performed by this build.**


## PvP RC40 Patch 3.2 Website integration (2026-11-15)

This Website build synchronizes the current **PvP-Trial commit `6e16d410617aace6d8190e31af448e35b3ee4dba`** (RC40 Patch 3.2) with the Northflank `/health` report shared by the project owner:

- `buildId`: `gl-s0-pvp-rc40-patch32-item-discard-2026-11-14`
- `transport`: native `ws`
- `architecture`: `s1-v38017-lite-lobby__s0-rc40-authority`
- WSS base host (existing service): `wss://p01--grandis-legacy-pvp-room2--2kwws8nzlcc2.code.run`

Five source files were reconstructed against the source-controlled Patch 3.2 diff and a sixth latest Card Review CSS file was hash-verified and independently verified to match the exact Git SHA blobs in the PvP-Trial repo **before** reapplying the Website's `/pvp/`, `/pvp/battle/`, and shared `/card-art/` asset integrations.

**Additional browser stability fix:** PvP Patch 3.2 source invokes `glBindPlayerHandArtwork()` when rendering player Hand, but lacks its definition in the shipped PvP runtime. The Website integrates the earlier VS AI RC40 decode-aware implementation to prevent an undefined-function runtime error; notify the PvP-Trial maintainer to include the equivalent fix upstream. No authoritative gameplay or server files are included.

**Important:** The Northflank health report confirms the server is active and serves native WebSocket transport. It does NOT prove that two public browser sessions can connect and finish a match. The PvP-Trial GitHub Actions **Run #47 passed all steps**, including full historical regression, Docker image build, and native `ws` health. Website smoke checks and real hosted multiplayer must still be distinguished.

To deploy: unzip this FULL REPO into existing `GrandisLegacyTCG/Grandis-Legacy-Website` `main` root (replace existing files, not a ZIP blob). No GitHub Pages settings changes. If the PvP backend moves beyond Patch 3.2, replace this frontend with a tested handoff matching the new build ID; changing only `build-meta.js` is not sufficient to guarantee compatibility.
