# Grandis Legacy Season 0 PvP — Smooth Battlefield & Lobby Update

**Date:** 20 November 2026  
**Scope:** PvP Season 0 only — UI/image presentation, responsive lobby.  
**Target repos:** `GrandisLegacyTCG/Grandis-Legacy-S0-Website` (merge only `/pvp/`) and `GrandisLegacyTCG/Grandis-Legacy-S0-PvP` (standalone backend).  
**Never modify:** `GrandisLegacyTCG/Grandis-Legacy-PvP` (Season 1), Homepage, Rulebook, VS AI, Deck Builder, website root shared assets, server/authority/network/gameplay code.

## Changes implemented

1. **Persistent artwork in live battlefield:** own-hand and face-down opposing-hand cards reconcile by position and identity instead of destroying/recreating every authoritative snapshot. Attachment image nodes remain while slot/card remains unchanged, with counter badges updated in place; Racial Token images stay mounted as counts change. Status icons regenerate only if status state or a status-selection prompt requires different interaction. HP overlay refreshes only when displayed HP changes.
2. **Nonblank image transitions:** pending-decode images remain visibly backed by a card image placeholder instead of `visibility:hidden`. The current visible Hero art stays painted while new rank artwork is decoded; late asynchronous decode of an obsolete target is ignored. Missing-image fallback retained.
3. **Conservative prefetch:** at most three artwork jobs concurrently; recent up to 96 URLs tracked. Only local player's own hand and publicly visible Heroes/attachments qualify. Opponent hidden hand is *never* prefetched from its private identity. Backend uses local assets; website uses existing `/card-art/`, no duplicate artwork.
4. **Desktop lobby:** wide content no longer follows Homepage's 140–160 px logo/header margin; the header itself keeps canonical logo and navigation coordinates. At 1920px, main panels span ~1848px (instead of ~1600px); sensible mobile widths retained.
5. **Mobile:** removed hamburger deck-actions. `CHOOSE A DECK` select and direct `IMPORT DECK` button remain visible, also in the rotated mobile PvP lobby.
6. **Caching:** cache-bust URL of changed CSS/JS to avoid stale HTML/CSS/runtime, **without changing buildId**.

## Preserved behavior and deployment constraints

- **Gameplay/Rulebook:** unchanged; authoritative PvP engine SHA-256 remains `534e3840dd291e0dbe1dc792a57ded284cbf9092ae7a973ef532f2027d38d848`.
- **WebSocket:** unchanged; website continues to use `wss://p01--grandis-legacy-s0-pvp--2kwws8nzlcc2.code.run/ws`; same buildId `gl-s0-pvp-rc41-r39-v34-part5-2026-11-19`. No change to Response/Mana payments, actions, revisions, ACK/reconnect, spectator visibility, timeouts or server authority. No blanket snapshot/delta protocol change (unsafe without deeper network-state parity testing).
- **Website shared assets:** all 109 recorded mappings exist against the newer website root, with 248 card artworks available. Shared BGM `/engine/assets/audio/Tavern Quest.mp3` is **not duplicated**. The Website root release must supply `/assets/css/gl-site-navigation.css` and `/assets/js/gl-site-analytics.js` from the owner's newer full-website ZIP.
- **Backend standalone:** preserves its own images/audio and `/battle/` routes; website overlay uses `/pvp/battle/` routes.
- **Resources:** the Northflank configuration observed is 0.2 vCPU / 512 MB RAM; no service CPU/RAM settings were changed.

## Quality assurance performed

- **Backend:** `npm run build:precompress` passed; `npm run check` passed. 20/20 gameplay engine regressions and 50/50 independent retained multiplayer/compatibility tests passed (includes privacy, action/reconnect, Mana, Response, assets and HTTP compression).
- **Browser DOM tests:** real modified JavaScript routines exercised in local Chromium fixtures. Verified no replace of live hand/attachment IMG when only pending state/counter changes, face-down opponent remains masked, fallback styling visible, stale Hero Rank Up decode ignored and only own/public artwork preloaded.
- **Lobby layout fixture:** passed at 1920×900, 1600×900, 1440×900, 1100×700, 390×844 and 844×390 logical mobile landscape; direct Import Deck visible.
- **Integrity:** website/backend renderer source parity after normalizing shared asset root paths; engine donor hash unchanged; all 109 shared mappings resolve, 248 root artwork images; no root or Season 1 files included in website ZIP.

### Not verified / production checks

Local Chromium was not able to navigate sandbox localhost (`ERR_BLOCKED_BY_ADMINISTRATOR`); browser *DOM fixtures* do **not** establish full-match production multiplayer, perceptual FPS improvement or live GA4 reporting. Images can still fail on broken server URLs or network errors; this patch is intended to prevent avoidable redraw/blanking, not to guarantee all downloads succeed.

After manual deployment, test **two different browsers**: Join/Ready/Start, Coin/Opening, draw/hand rearrangement, Response payment/choice, Rank Up, attachments and status counters, reconnect, spectator masking, final result. Inspect image/network 404 and console logs. Validate newest root website assets first.

## Manual upload order

1. If not already uploaded, merge the owner's full **S0 Website root NO_PVP** source first. It contains canonical shared navigation CSS and analytics JS. Leave `/pvp/` existing files intact.
2. Merge the release website ZIP folder `/pvp/` **only** into `Grandis-Legacy-S0-Website` (main).
3. Choose **either** full S0 backend repo ZIP **or** backend patch-only ZIP, never both, and deploy to `Grandis-Legacy-S0-PvP` (main). Patching must preserve paths including `.br`/`.gz` precompression sidecars.
4. Deploy/redeploy services manually. Retain Room2 fallback service. Do not touch Season 1. Confirm `/health`, WebSocket and gameplay with two browser tabs/devices.
