# Season 0 PvP Website — RC41 F18/F19 Stability Overlay

Ini overlay **hanya folder `/pvp/`** untuk root `Grandis-Legacy-S0-Website`. Baseline: paket website PvP RC41 F15 Interactions, 21 November 2026. Donor: VS AI RC41 Part 7 F18/F19.

Perubahan terbatas pada `battle/index.html`, `battle/shared-ui/battlefield-ui.css`, `battle/shared-app/app-runtime.js`, dan `battle/engine/shared-app/app.bundle.js` serta README ini. Adaptasi popup Search (1 scrollbar & scroll persisten saat snapshot), pilihan Swap F19, notifikasi Search/Return untuk kedua pemain, dan renderer hasil Search/Return di Card Played.

Source gameplay dan server authority berada di repo backend Season 0. **Upload backend F19 lebih dulu**; frontend ini membutuhkan receipt `CARD_PUBLIC_PICKUP` berkorelasi dengan `source_action_id` agar hasil Search Main Deck tampil aman. Semuanya hanya diumumkan setelah server committed. Kartu Draw biasa tetap disembunyikan. Website root, folder shared `/card-art/`, `/assets/ui/`, `/engine/assets/audio/`, Analytics, logo, dan navigasi global tidak perlu diubah atau diduplikasi. Build ID network tetap.

QA lokal: backend `npm run check:rc41` dan historical 50/50 PASS, tes browser produksi/HP fisik belum dilakukan. Jangan ubah Season 1.
