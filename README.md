# GRANDIS LEGACY - SEASON 0 OFFICIAL WEBSITE

Complete deployable Website repository snapshot (17 November 2026).

## Deployment

- GitHub repository: `GrandisLegacyTCG/Grandis-Legacy-Website`
- Branch: `main`
- GitHub Pages: Deploy from branch, `main` / `(root)`
- Custom domain: `grandislegacytcg.web.id`
- `CNAME`, `.nojekyll`, and `index.html` are at repository root.

## Routes

| Route | Application |
| --- | --- |
| `/` | Official Homepage (Design v2.3.7) |
| `/vs-ai/` | VS AI Season 0 RC40 |
| `/deck-builder/` | Deck Builder v1.66 Style 1, Main Deck R3.85 |
| `/deck-builder/style-2/` | Deck Builder v1.66 Style 2, Main Deck R3.85 |
| `/pvp/` | PvP Season 0 RC40 frontend |
| `/card-art/` | 248 shared WebP assets |
| `/rulebook/` | Player Rulebook v3.4 online + downloadable PDF |

## Integration baseline and scope

Source Website baseline: `Grandis_Legacy_Season0_VSAI_RC40_DB166_PvP_RC40_Patch32_WEBSITE_ONE_UPLOAD_2026-11-15.zip`,
original Website repository GitHub commit `e1c17bd9d346794e8c0c5fb74c742cdbbf8440a4` (700 files).
The Homepage + VS AI route + Deck Builder v1.66 / R3.85 + Rulebook v3.4
are integrated from the approved November 17 patch.

The PvP folder uses the later complete `Grandis_Legacy_Website_PVP_FOLDER_RC40_V34_Mobile_2026-11-17_READY_UPLOAD.zip`
(218 files) in preference to any older PvP asset set. Compared with the GitHub
baseline, 8 PvP files had already changed in that later approved PvP source.
The only additional PvP edit made by this Website integration is the AI Lobby
navigation target in `pvp/config.js`, from `/` to `/vs-ai/`.
PvP gameplay engine, WebSocket target and server are not modified by this integration.
If strict GitHub PvP parity is required rather than that newer PvP source, review
these 8 newer-source files before upload (see external audit).

## Important

This archive contains the actual website content and assets, not merely a patch.
Extract its top-level files directly into the repository root; there is **no
extra wrapper folder**. Use manual GitHub Desktop or Git upload, then verify
GitHub Pages. Existing repository history and branch/settings are not included
in a ZIP snapshot and are maintained by GitHub itself.

No commit, push, or deployment was performed by ChatGPT.
