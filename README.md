# GRANDIS LEGACY - SEASON 0 WEBSITE (22 NOVEMBER 2026)

**Current website release:** Homepage v2.3.17 (unchanged); **Player Rulebook v3.5** (20 Nov); **VS AI RC42** (22 Nov); **Deck Builder v1.68** (22 Nov); **Main Deck R3.94**, Legacy Deck R3.9; **250 shared artworks**. VS AI Import Deck button uses the approved PvP gold gradient style (appearance only; PvP source not included).

**Repository:** `GrandisLegacyTCG/Grandis-Legacy-S0-Website` (`main`). Selective merge based on the most recently available Website non-PvP snapshot and verified against GitHub state at `a702b62241388d95891e31fea90d5b2c7dcef393` (21 Nov). **No `/pvp/` folder is present in this ZIP.** The website assistant does not commit or push to GitHub; owner uploads manually.

**Deployment:** For an existing Website, prefer the accompanying PATCH when the baseline matches. For a full non-PvP snapshot, extract this ZIP directly into repository root, not into a nested directory. A merge upload does **not** delete existing `/pvp/` on GitHub. PvP is owned by its separate development chat. Preserve `CNAME`, `.nojekyll`, current shared header, shared navigation, shared logo and Google Analytics.

**Validation:** JS/JSON syntax, shared assets, Rulebook v3.5 HTML/search/PDF, Deck Builder v1.68 source QA, image checks and import-button CSS were checked. Synthetic Chromium renders succeeded for Homepage, Rulebook and both Deck Builder styles. Full VS AI RC42 game/browser regression and production GitHub Pages are **not** verified here; test after deployment. The RC42 source includes its own release QA evidence, but this report does not claim those tests were rerun as deployed E2E.

---

## Previous integration notes (historical)

# GRANDIS LEGACY - SEASON 0 WEBSITE (NO PVP FOLDER)

**Website integration:** 19 November 2026.  **Scope:** Homepage, Rulebook, VS AI RC41, Deck Builder v1.67, Main/Legacy Deck R3.9, and shared website assets. This artifact deliberately contains **no `pvp/` directory**.

## Repository and deployment

- Repository: `GrandisLegacyTCG/Grandis-Legacy-Website`
- Source baseline: GitHub `main` commit `4302b2f92e5602b48ae7d587c124a35d2767b595` (19 Nov 2026; *S0 Website, Header Update*). The full source, EXCLUDING `pvp/`, was verified against this baseline before changing the header assets.
- Branch/hosting: `main` / repository root, GitHub Pages. Retain the `CNAME` and `.nojekyll` files.
- Domain: `https://grandislegacytcg.web.id/`.
- GitHub is READ ONLY for the website assistant. The owner handles upload, deletions and commits manually.

## Routes and ownership

| URL path | Contents | Owner |
|---|---|---|
| `/` | Homepage v2.3.14 | Website |
| `/rulebook/` | Season 0 Player Rulebook v3.4 HTML, PDF, search | Website |
| `/vs-ai/` | VS AI RC41 with Starter Deck 2/3 switch | Website |
| `/deck-builder/` | Deck Builder v1.67 Style 1 | Website |
| `/deck-builder/style-2/` | Deck Builder v1.67 Style 2 | Website |
| `/card-art/` | 248 shared card artwork files (R3.9) | Website |
| `/assets/`, `/engine/`, `/runtime/`, `/shared-app/`, `/shared-ui/` | Shared app resources | Website |
| **`/pvp/`** | **NOT INCLUDED. The separate PvP development chat owns this directory.** | **PvP chat** |

## Shared logo contract (all non-PvP headers)

The **single canonical image** for every website application header is:

`/assets/site/web-s0/logo-transparent.webp`

The common header/logo CSS file is:

`/assets/css/gl-site-brand.css`

Each non-PvP header loads the same image URL and the same CSS rules, with `.gl-site-brand` on the logo anchor and `.gl-site-brand-img` on the image. Desktop header: 90px, logo width 174px, left inset 24px. Tablet: header 80px, width 152px, left 24px. Phone <=600px: header 80px, width 150px, left 20px. The CSS is loaded **after** the page-specific header CSS, eliminating old overrides and a 12px mobile Builder logo offset. The special VS AI landscape-mode layout remains controlled by its own game CSS.

Other old logo image files are retained solely as backward-compatible assets. Non-PvP **header** URLs no longer load those duplicates. Do not delete them without a separate reference audit.

## IMPORTANT: how to deploy without PvP collisions

This ZIP is a **complete deployable snapshot of the non-PvP website**, at repository root, with no wrapping folder and **no `pvp/` files**. Extract/merge it into the repository root.

**An upload/merge does NOT remove an existing `pvp/` folder from GitHub.** If the owner wants the GitHub repository itself to temporarily have no `pvp/`, its tracked contents must be **explicitly deleted in a manual commit**; merely uploading this ZIP does not delete them.

The Homepage, Deck Builder, and VS AI retain navigational links to `/pvp/` for future integration. These links may show 404 until the separate PvP team delivers its own folder. If GitHub already retains an older `/pvp/`, those links will continue opening that older version.

The PvP development chat must deliver a **`pvp/`-only website folder package**, integrating with shared site assets and without writing/updating Homepage, Rulebook, VS AI, Deck Builder, shared engines/assets or GitHub Pages configuration. The PvP handoff specification is delivered separately from this ZIP.

## Validation boundaries

- Original non-PvP baseline content verified against GitHub using per-path Git blob hashes.
- The common header image is identical and physically aligned across the five non-PvP page types on desktop/tablet/phone in Chromium synthetic layout QA.
- CSS/JS syntax, HTML asset references, shared artwork files and ZIP integrity checked during release.
- No PvP gameplay, networking or Northflank changes. No code in `pvp/` is included.
- Live website deployment and production gameplay/multiplayer tests are not performed by this package. Re-test after manual GitHub upload.
