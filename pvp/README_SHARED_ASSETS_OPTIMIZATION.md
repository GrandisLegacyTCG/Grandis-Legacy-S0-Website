# PvP Season 0 RC41 — Website Shared Assets Optimization

This ZIP includes only `/pvp/` and assumes the **Grandis Legacy Website RC41 (2026-11-18)** already exists at the site root.

- Identical binary assets have been removed from `/pvp/` and linked to their existing site-root equivalents by verified SHA-256 match.
- CSS/HTML URLs and JS asset-string URLs were adjusted to use absolute website paths.
- Only artwork, images, audio and fonts with identical bytes were shared; assets unique to PvP were retained.
- Gameplay logic, WebSocket protocol and backend deployment files have not been modified by this optimization.
- The backend release ZIP is unchanged: it must remain self-contained.
- Do not upload this package to the standalone PvP backend host; it requires existing website-root shared assets.

IMPORTANT: Deploy with the *same* Website RC41 shared assets; future root asset replacement should preserve these URLs or update the references.
