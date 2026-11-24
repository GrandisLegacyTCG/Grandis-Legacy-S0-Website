# Grandis Legacy PvP - Step 1 Website frontend candidate

**Build ID:** `gl-s0-pvp-rc42-r398-r40-20261124-s1`

This `pvp/` folder is paired with **the standalone backend Step 1 (`S1`)**. The website folder changes are limited to synchronizing its Build ID and cache-busting paths with the backend. It does not include any server source, credentials, or root Website files. The current PvP-specific engine and browser network adapter remain unchanged from the HF2 baseline.

**Release status:** local network/engine adapter QA only; NOT a stable production release. Owner-reported obsolete card backs and non-uniform mobile scaling are still open and must not be mistaken for fixed issues. The new backend/website pair must be deployed together after approval; mismatched Build IDs intentionally refuse WebSocket connections.

See the Standalone's `docs/STEP1_NETWORK_ENGINE_BOUNDARY_2026-11-24.md` for implementation, detailed tests, and unverified Northflank/native WebSocket gates. No GitHub or Northflank deployment has been made.
