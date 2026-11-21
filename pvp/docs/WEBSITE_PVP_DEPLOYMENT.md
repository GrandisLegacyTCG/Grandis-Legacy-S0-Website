# Grandis Legacy — PvP Website Overlay Deployment

This ZIP contains ONLY `pvp/` to insert into the **latest unpublished full
Website repo** (`Grandis_Legacy_Website_FULL_REPO_NO_PVP_RC42_DB168_Rulebook35_2026-11-22.zip`).
It does not contain or replace Homepage, Deck Builder, VS AI, or any
shared website-root assets.

- All **250** current card artworks resolve to `/card-art/S0-*.webp`.
- The 109 pre-existing shared visual/font/audio copies resolve to root `/assets/`,
  `/engine/assets/`, and `/deck-builder/assets/` paths, as specified in
  `docs/SHARED_ASSETS_DEPLOYMENT.json` and backend
  `scripts/website-shared-assets-lock.json`.
- The /pvp/ overlay includes no card artwork files. The root website is expected
  to already include all 250 card files, including Cheers! and Fire Flask.
- No website root assets are modified by this package; existing website
  directories must not be deleted to upload this overlay.
- PvP backend is independently standalone and retains all 250 local artworks.
- Build ID in `pvp/build-meta.js` must match the backend build. WSS endpoint
  in `pvp/config.js` must point to the live backend instance.

IMPORTANT: The full latest unpublished Website source ZIP was not mounted in the
PvP build environment. Card images have instead been verified byte-for-byte
against the 250-file VS AI RC42 donor. Run the included backend verification
script against the actual latest website source ZIP before publishing.
If the source ZIP differs, fix the shared asset map instead of deploying broken
asset links. Two-browser production WSS gameplay QA remains required.
