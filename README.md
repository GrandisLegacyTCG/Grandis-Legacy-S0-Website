# Grandis Legacy Season 0 — Website Root Package (PvP Excluded)

**Target repository:** `GrandisLegacyTCG/Grandis-Legacy-Website`  
**Branch:** `main`  
**Publish source:** GitHub Pages → Deploy from a branch → `main` → `/(root)`  
**Custom domain:** `grandislegacytcg.web.id`

## Package scope

This is a full package of the Website repository root **except the top-level `pvp/` directory**.

Included:
- `/` — VS AI Season 0 RC40, including the latest visual and opponent-Hand privacy update.
- `/deck-builder/` — Deck Builder v1.66, Style 1 and Style 2.
- `/card-art/` — 248 shared WebP images (242 card images + 6 Mana images), with no duplicate Deck Builder artwork.
- `/rulebook/` — Player Rulebook v3.3.
- Required shared runtime, CSS, JavaScript, audio, review, keyword and UI assets.
- `CNAME` and `.nojekyll` at repository root.

**The existing `/pvp/` directory is deliberately omitted. Keep the current `/pvp/` folder in GitHub unchanged when uploading this package. Do not delete it, replace it, or create a new one from this ZIP.** The VS AI and Deck Builder navigation buttons still point to `https://grandislegacytcg.web.id/pvp/`.

## Latest VS AI updates included

- Public-card notifications and Counter Chain card thumbnails.
- AI Hand reveal only after Game Over and 15-second result countdown.
- Player Draw artwork handling and Website shared-artwork fallback integration.
- Counter Chain displays the centered **Chain Result** title.
- Opponent Hand card-choice backs do not create or load a front image while the opponent card remains concealed.

The latest VS AI update changes only these three files:
- `index.html`
- `shared-app/app-runtime.js`
- `shared-ui/battlefield-ui.css`

Deck Builder v1.66, shared artwork, Rulebook, and the existing PvP folder are not changed by this update.

## Upload instructions

1. Extract this ZIP. Its contents are already at repository-root level; there is no enclosing project folder.
2. Update the supplied files and folders in `GrandisLegacyTCG/Grandis-Legacy-Website` on branch `main`.
3. **Preserve the existing top-level `pvp/` directory.** Because it is intentionally absent from this archive, do not use a destructive full-folder replacement that deletes it.
4. Keep `index.html`, `CNAME`, and `.nojekyll` directly at root.
5. Do not change GitHub Pages settings or the custom domain.

After GitHub Pages deployment, smoke-test:
- `https://grandislegacytcg.web.id/`
- `https://grandislegacytcg.web.id/deck-builder/`
- `https://grandislegacytcg.web.id/deck-builder/style-2/`
- `https://grandislegacytcg.web.id/pvp/` (existing folder; not updated by this package)

This package contains static Website files only. The authoritative PvP Node.js/WebSocket backend remains in `GrandisLegacyTCG/Grandis-Legacy-PvP-Trial` and runs separately on Northflank.

## Audit summary

- VS AI source regression: 726/726 PASS.
- Seeded AI match simulation: 25/25 PASS.
- Website JavaScript syntax: 59/59 PASS.
- Chromium component checks for Chain Result and concealed/revealed Opponent Hand: 8/8 PASS.
- Shared artwork: 248/248 retained.
- Deck Builder files: 96 retained.
- ZIP scope: 482 files, zero `pvp/` entries.

These are source/local component checks, not a claim that the live public website has been retested after upload.
