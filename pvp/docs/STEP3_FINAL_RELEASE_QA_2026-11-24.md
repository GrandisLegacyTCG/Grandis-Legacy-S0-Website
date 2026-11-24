# Grandis Legacy PvP Season 0 — Three-Step Final Candidate (S3)

**Build ID:** `gl-s0-pvp-rc42-r398-r40-20261124-s3`  
**Date:** 24 November 2026  
**Status:** LOCAL QA CANDIDATE — **NOT** production Stable, until manual Northflank/native-ws/two-browser and phone QA pass.  
**Sources:** Approved RC42 VS AI rules + mobile Batch 2 presentation; RC40 network behavior as reference; standalone STEP 1 network/authority fixes. Separate PvP-only networking and server authority are retained.

## Changes delivered in the final S3 pair

### STEP 1 — Multiplayer stability (retained)
- Attack-follow-up opponent Mana Burn and Steal continuation in the server authority bridge; both player seats.
- Missing action ID rejection, sender ACK and revision, duplicate/replay safety, stale socket after reconnect and lost surrender ACK.
- End/Provoke pending state cleanup; five Deck Builder import confirmations in local WS testing.
- PvP browser `pvp-network.js` and original game rules are **not** replaced with VS AI network code.

### STEP 2 — VS AI mobile presentation (retained)
- Uniform scaling in portrait/landscape, preserving card aspect ratio; mobile UI including Mana, Center choices, Return EXP, preview and attachment counters.
- Correct three owner-supplied Main/Legacy/Shard card-back resources. Engine bundle is adjusted only in the corresponding visual card-back code.
- Network and gameplay authority files remained byte-locked from STEP 1.

### STEP 3 — Less browser work, without removing game features
- The previous `pvp-card-thumbnails.js` embedded **250 full base64 thumbnails in a 1,074,066-byte JS program**. Replaced it with **15,628-byte URL manifest** and 250 individually fetched exact-Card WebPs (`battle/assets/thumbnails/S0-*.webp`). All 250 decoded binary files match the prior embedded thumbnail bytes by SHA-256; thumbnail file fetches occur only when needed, preserving full-art upgrade and hidden-card privacy. Standalone `/pvp/` routes and Website `/pvp/` paths were tested.
- Browser manifest-only Playwright benchmark (Chromium, five clean contexts, explicit GC) improved median retained JS heap delta from **1063.7 KB to 30.5 KB**, and median eval from **2.3 ms to 0.2 ms**. **This is not a measurement of whole-game RAM or FPS.**
- On mobile/coarse pointer, READY no longer creates an invisible second Battlefield/engine iframe; constrained devices <=4GB and Save-Data also skip it. Desktop high-RAM still warms only when both players have decks and are READY. Warm iframe is released if browser tab becomes hidden.
- LOW-RAM/Bandwidth prefetch only smaller battlefield bootstrap, not the 7MB `static-data.js` and 2MB engine bundle until START.
- Full resolution image decode concurrency limited to 2 on <=2GB/data-saver, 3 on mobile, 6 on desktop. Exact-card thumbnail remains visible until full-image decode; no fallback to a guessed/secret card face.
- Lobby hero/back/shard preload queue limited to 2 mobile / 4 desktop concurrent decodes, without leaving permanent promises in a growing Map.
- Corrected a remaining own-Hand error placeholder fallback from `/assets/ui/back-*` to the approved `/pvp/assets/ui/back-*` files to avoid wrong global card backs.
- **No network protocol, server authority algorithm, game rules, or opponent-hand privacy model was changed in STEP 3**. `server.js` only updates the paired Build ID and label.

## Local test evidence
- `npm run check` PASS: RC42, STEP 1, STEP 2, STEP 3 regression suites, including real two-seat local WebSocket action ACK, import, privacy, continuation, mobile source locks, and all 250 HTTP WebP thumbnails.
- `tests/step3-lifecycle-soak.mjs`: 20 serial real local WS match lifecycles with two players, 40 mutating intents, coin/opening/surrender/lobby cleanup. Separate extended run: **60 lifecycles, 120 mutating intents**, PASS with `ws-lite`. This is not 60 complete scored games.
- Backend RSS across 60 rapid local match cycles: around **134 MB to 279 MB** without explicit GC and **134 MB to 178 MB** when test-only GC ran every five matches. RSS high-water behavior cannot alone establish or rule out a leak. No explicit GC is enabled in production, and browser RAM/real FPS were not measured in this local server soak.
- Mobile Chromium **synthetic DOM** tests: portrait 390x844, 360x700, landscape 844x390, 1180x820, tablet 1280x600, desktop 1440x900. Uniform scale ratio=1 and 46.8px phase; Mana, Action and Return EXP choice cards verified (not a real two-device match).
- 250/250 exact thumbnails tested by byte SHA-256 in both variants and via local standalone HTTP HEAD, with Brotli static JS content check.
- Official back-of-card SHA-256 retained from STEP 2; card-art original 250 shared Website root references are not duplicated into Website `/pvp/`.

## Known exclusions — do not claim stable
- **Production Northflank WSS/native `ws` is NOT TESTED.** Local network uses `ws-lite`: npm registry and Docker are unreachable in this environment. The Dockerfile installs pinned native `ws` and enforces `PVP_REQUIRE_WS=1`; those are configuration facts, not deployment proof.
- **No real phone, actual hosted Website asset navigation, or two-browser full match performed.** Chromium navigation is sandbox-blocked; synthetic Playwright page content is not equivalent.
- Archival `test:rc41-f19-network`/`rc41-f19-authoritative-swap` fails historical synthetic Swap assumptions; `test:rc39-batch5` hardcodes 248 instead of current 250; `test:rc40-p32` hardcodes older Legacy/card details. Their failures are NOT misreported as PASS. Reconcile current donor F19 Swap semantics before claiming complete gameplay coverage. The passing active `npm run check` is **not proof that every card-specific game path is bug-free**.
- The current in-memory match server supports one live replica/room. Northflank autoscaling multiple replicas will split state without an external room store; use a single replica.

## Manual deployment / acceptance gate
1. Upload **Standalone S3** to Northflank as a Docker service. Set `PVP_ALLOWED_ORIGINS=https://grandislegacytcg.web.id`, `PORT=3000` or host-provided port, and **one replica**. Docker already sets `PVP_REQUIRE_WS=1` and installs pinned ws using `npm ci`.
2. After backend deploy, `GET https://<your-active-northflank-service>/health` must return `ok:true`, `transport:"ws"`, and `buildId:"gl-s0-pvp-rc42-r398-r40-20261124-s3"`. If any fails, do not deploy Website S3 yet.
3. Verify **Website `/pvp/config.js`** `wsBase` is the actual active WSS backend host. The included `wss://p01--grandis-legacy-s0-pvp--2kwws8nzlcc2.code.run` is an old configured hostname, **not independently confirmed live**.
4. Merge **only the `pvp/` directory** from the Website S3 ZIP into the Website repository root. Preserve `/card-art/` (250 originals), root fonts/icons/analytics/logo/navigation/VS AI/Deck Builder/Homepage. Do not upload standalone backend into Website.
5. Run backend `GL_PVP_BACKEND_URL=https://<active-host> npm run smoke:northflank` on a machine with native `ws` installed, and perform Host/Join/Ready, Import, Attack→Mana Burn/Steal, Response, Rank Up, F19, reconnect, spectator, finish, both seats, desktop and physical Android, including 20–30 minute match memory/FPS profiling. Treat errors as release blockers.
6. Only after these gates pass may the owner label S3 Stable. This package is strictly a *candidate* for that test.

## Repro commands

```sh
npm ci --omit=dev --ignore-scripts --no-audit --no-fund
npm run check
PVP_WEBSITE_ROOT=<unpacked-website>/pvp npm run test:step2
PVP_WEBSITE_ROOT=<unpacked-website>/pvp node tests/step3-on-demand-artwork.mjs
PVP_SOAK_ROUNDS=60 node tests/step3-lifecycle-soak.mjs
PVP_SOAK_FORCE_GC=1 PVP_SOAK_ROUNDS=60 node tests/step3-lifecycle-soak.mjs
```

Native dependencies are required for actual production; local offline tests can use the built-in `ws-lite` fallback. No push, commit, or deployment was executed by this deliverable.
