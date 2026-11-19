# Season 0 PvP RC41 — Website shared asset contract

This ZIP is intended to overlay `/pvp/` ONLY on the existing full Website RC41 repository.

Card images intentionally use **absolute `/card-art/S0-...webp` paths** and are NOT included in this ZIP. The existing website root contains 248 verified bit-identical art images. Do not move/remove the website root `/card-art/` directory.

Both lobby and battlefield load `/assets/js/s0-artwork-fallback.js` from the root website. This is a precondition, not a file included in this overlay.

Backend retains one local standalone copy at `public/battle/card-art/`, so backend-hosted lobby and battlefield remain functional without depending on the website domain. The two packages deliberately have DIFFERENT artwork URLs; their networking, game actions and RC41 content should remain equivalent.

This does not modify `Grandis-Legacy-PvP` (Season 1). Do not upload any of these files there.
