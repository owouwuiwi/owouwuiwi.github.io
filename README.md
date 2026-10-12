# Nyanime website

English static presentation, Android download links and shared-content landing pages.

Published at https://owouwuiwi.github.io/ using GitHub Pages.
Self-hosted fonts retain their included SIL Open Font License notices.
The Android association preserves the existing application identity and certificate.

`assets/glass.css` adds warm, translucent surfaces in dark and light themes, with
solid fallbacks where backdrop blur is unavailable or higher contrast is requested.
Mobile layouts use smaller blur radii and retain the reduced-motion preferences.
All feature sections, release selection, shared-link validation and Android
association files are preserved. The privacy, data and credits cards link to the
current public documentation rather than the separate development-candidate pages.

The homepage's `assets/motion.css` and `assets/motion.js` add one-shot, staggered
section reveals, small hover feedback, theme-icon transitions and native FAQ
expansion. Reveals animate only opacity and translation, use an IntersectionObserver
instead of scroll polling, and never hide content while waiting for JavaScript.
Keyboard focus cancels an in-progress reveal. Reduced-motion preferences disable
the reveals and decorative motion, including when the preference changes live.
FAQ controls remain native HTML disclosures without JavaScript; browsers without
intrinsic-size CSS transitions retain instant opening and closing. Shared-content
pages do not load the homepage motion layer.
