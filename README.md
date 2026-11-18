# GRANDIS LEGACY — SEASON 0 OFFICIAL WEBSITE

Integrated deployable GitHub Pages website, 18 November 2026.

## Deployment
- Repository: `GrandisLegacyTCG/Grandis-Legacy-Website`
- Baseline: GitHub `main` SHA `af9f0815aa50bffabfc1cc5d9c26250e984a7b71`
- Branch/root: `main` / `(root)`; retain `CNAME` and `.nojekyll`.
- Domain: `grandislegacytcg.web.id`.

## Routes
| Route | Application / source |
|---|---|
| `/` | Homepage standalone v2.3.14 (18 November 2026) |
| `/rulebook/` | Player Rulebook v3.4 latest PDF/HTML supplied 18 November 2026 |
| `/vs-ai/` | VS AI Season 0 RC41, Main/Legacy R3.9 |
| `/deck-builder/` | Deck Builder v1.67 (Style 1), Main/Legacy R3.9 |
| `/deck-builder/style-2/` | Deck Builder v1.67 (Style 2), Main/Legacy R3.9 |
| `/card-art/` | 248 shared artwork assets, 242 R3.9 DB/VS AI card images matched |
| `/pvp/` | Existing website PvP, **unchanged byte-for-byte from GitHub main** |

## Source synchronization / separation of responsibilities
Step 1: Homepage and Rulebook from the v2.3.14 standalone archive. Includes the revised 15-page original Rulebook PDF.
Step 2: VS AI RC41 shared runtime/engine/starter sets, the RC41 print overlay, Deck Builder v1.67 both styles, and R3.9 shared artwork. A website-only adapter keeps VS AI under `/vs-ai/` and Deck Builder artwork under `/card-art/`.

The PvP directory is strictly managed by the separate PvP development workflow. This snapshot preserves all 218 PvP files exactly as in GitHub main (including `pvp/config.js`). **The current GitHub PvP `vsAiUrl` still points to `/`; ask the PvP maintainer to update it to `/vs-ai/` as a separate change.** No other PvP change was made.

## Upload
The full ZIP is a snapshot with repository-root files (no wrapper directory). Upload/commit/push are performed **manually by the project owner**, not by ChatGPT. Do not delete existing .git metadata. After deployment verify website routes, Rulebook PDF, RC41 match flow, and both Deck Builder styles.

## Scope exclusions
No PvP, Northflank, server, or networking modifications. No duplicate-asset deletion/optimization in this update. No standalone VS AI or Deck Builder historical source/test archives added to the static website.
