# Season 0 PvP RC41 - Website battlefield path correction

Scope: Website repository `/pvp/` only. Standalone PvP-Trial backend and Season 1 unchanged.

## Fixed
`pvp/pvp/pvp-host.js`: all seven absolute root `/battle/` references in the recovery link, embedded iframe URL, and five battle prefetch paths now use `/pvp/battle/`.

## Verified
- `node --check pvp/pvp/pvp-host.js`: pass.
- All five prefetch files and `/pvp/battle/index.html`: present inside this package.
- All 109 mapped website shared asset destinations: present in the 18 Nov 2026 website RC41 baseline.
- No old absolute quoted `/battle/` references remain in website PvP HTML, CSS or JS.
- No gameplay or networking protocol source altered.

## Deployment
Merge the `pvp/` folder into the existing Website repository root. Leave root `/card-art/`, `/assets/`, `/engine/`, `/vs-ai/`, `/deck-builder/`, and homepage intact. This website package must **not** be deployed to the standalone PvP backend.

Browser integration test was attempted, but the execution environment blocked localhost (`ERR_BLOCKED_BY_ADMINISTRATOR`). Therefore online full-match validation remains unverified.
