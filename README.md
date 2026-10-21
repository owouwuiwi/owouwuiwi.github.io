# Nyanime website

English static presentation, Android download links and shared-content landing pages.

Published at https://owouwuiwi.github.io/ using GitHub Pages.
Self-hosted fonts retain their included SIL Open Font License notices.
The Android association preserves the existing application identity and certificate.

The homepage uses `assets/nyanime.css`: warm red glass in dark mode and peach
glass in light mode, with the original red/orange wordmarks and red N mark.
The same classic identity is used on sharing pages, the developer playground
and the guide. Compact sticky navigation, animations and the installation path
remain unchanged. The base layouts contain their top margins so the canvas
background stays continuous from the top edge on both themes.
The Watch / Read / Live TV explorer uses `assets/experience.js`, keyboard tabs
and short fades. Its artwork is labelled as interface illustration, not screenshots.
All three panels share a grid row, sized to their natural content. Inactive panels
are hidden from sight and keyboard/accessibility navigation while preserving the
row height, including narrow screens and text-size changes. Without JavaScript,
all three capability panels remain readable in sequence.

`assets/motion.js` adds one-shot reveals through IntersectionObserver and the
Web Animations API. Content is visible by default. Keyboard focus, backgrounding
and reduced-motion changes cancel in-progress effects. Native FAQ disclosures
work without JavaScript, with progressive intrinsic-size transitions on supported
browsers. Motion preferences disable decorative movement and smooth scrolling.
Glass has solid-surface and high-contrast fallbacks. Fonts are self-hosted.

Player, reader, library, rooms, releases, downloads, backups and live TV information
remain available, alongside privacy, data controls, source, licences and credits.
Download selection retains the existing `assets/site.js` and `assets/releases.js`
logic; only the browser theme colour changes in the theme controller.
Shared-link parsing, Android association files and font licences are unchanged.
Shared-link pages retain their warm glass presentation. Blue branding assets
remain available in the repository but are not loaded by the published pages.

The developer playground at `/example/` shares the product branding and original
SVG illustrations. It is reachable from the main navigation, footer and the
dedicated creator section at `/#developers`. Its gallery initially shows eight
examples, with progressive disclosure and keyboard-accessible family filters.
Each family links directly to its API contract in the canonical guide. Without
JavaScript every example remains available. Reduced motion disables the filter
and reveal animations. Presentation changes do not alter the parser fixtures,
media, SDKs or previously published signed downloads.

Downloads select only a trusted ARM64 APK from a recommended full release.
Patch-only releases are used by the in-app updater, never by the website download
button. A pinned full-APK fallback works without JavaScript or GitHub API access;
installers can then receive newer versions through the app.
