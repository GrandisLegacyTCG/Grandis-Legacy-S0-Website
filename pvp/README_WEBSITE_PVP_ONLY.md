# Season 0 PvP RC41 — Website `/pvp/` upload

This folder is the **entire website-root `pvp/` overlay**; merge into `GrandisLegacyTCG/Grandis-Legacy-S0-Website` (`main`) repository root. It does not contain homepage, `/vs-ai/`, `/deck-builder/`, or their assets. Season 1 PvP repository is untouched.

- `battle/engine/shared-app/app.bundle.js`: exact current PvP RC41 backend gameplay after adjusting website-only art URL paths.
- PvP network code and the 38-card R3.9 print overlay: identical to backend.
- No artwork copies under `/pvp/`; the existing Website RC41 root `/card-art/` contains 248 matching assets and `/assets/js/s0-artwork-fallback.js` is reused.
- `config.js` connects to the Northflank WSS endpoint; the hostname must be verified against live backend `/health` on deployment.
- Client build ID `gl-s0-pvp-rc41-r39-v34-part5-2026-11-19` must match the backend after it deploys.

Source QA: RC41 donor 20/20, additional PvP tests 50/50, four Chromium viewport checks, 248/248 artwork hashes. Real deployed full-match two-browser QA is still required after upload.

## 20 November update
- `config.js` points ONLY to the new S0 Northflank WSS (`wss://p01--grandis-legacy-s0-pvp--2kwws8nzlcc2.code.run/ws`), with `wsPath:'/ws'`. Room2 is retained externally as fallback, NOT active frontend config.
- Logo/navigation use the shared Website CSS and canonical artwork, plus an isolated PvP header adaptation. Two PvP routes load the shared site analytics loader. No root files or copy of shared art are included.
- Battle uses the compatible mobile portrait card preview adaptation. Game rules, backend protocol, build ID and donor engine are unchanged.
- IMPORTANT dependency: upload Website root `/assets/css/gl-site-navigation.css` and `/assets/js/gl-site-analytics.js` from the independently maintained Website release before using this overlay; those assets are not part of this ZIP.
