# Grandis Legacy Season 0 PvP — card-choice network repair

This `/pvp/` overlay includes the previously approved website UI/mobile/music/WSS/shared-art configuration and a targeted card-selection fix; it does **not** change Homepage, VS AI, Deck Builder, Rulebook or root assets.

The server masks Main Deck card IDs for privacy. A browser cannot safely validate a searched card's physical deck slot. Previously it tried, and selection sometimes stalled before any request reached the server. The browser now only highlights candidate indices locally; pressing CONFIRM sends a single exact transaction to the Season 0 PvP authority. The backend must be updated with the accompanying card-choice network repair **before** deploying this frontend overlay. Never deploy the frontend repair alone.

Required backend: `GrandisLegacyTCG/Grandis-Legacy-S0-PvP` with `commitExactCardSearchChoice` and `commitExactLocalChoiceDraft` handlers. WebSocket service: `wss://p01--grandis-legacy-s0-pvp--2kwws8nzlcc2.code.run/ws`. Existing multiplayer `buildId` remains unchanged, but the changed scripts use a new `choicefix` query parameter to bypass old browser caches.

No card artwork, UI, font, music, or battle audio duplicates were introduced. The site root `/card-art/`, `/assets/`, and `/engine/assets/` are still required.

After the owner uploads both packages manually: hard refresh both browsers; verify lobby ready/start, Turn 1/Turn 2, a deck-search card choice (Tune Up if available), Hand/Discard choices, Legacy cost, Mana Pay, Response, Rank Up, and reconnect. This is Season **0** only. Do not update the separate Season 1 repository.
