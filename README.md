# Nyanime website

English static presentation, Android download links and shared-content landing pages.

Published at https://owouwuiwi.github.io/ using GitHub Pages.
Self-hosted fonts retain their included SIL Open Font License notices.
The Android association preserves the existing application identity and certificate.

The homepage retains `assets/nyanime.css` for layout. The shared
`assets/blue-theme.css` supplies midnight blue, petrol and indigo glass in dark
mode, and cool blue glass in light mode. The star-speckled blue wordmark and N
mark are transparent SVGs with the original lettering and open counters.
Broad petrol/indigo gradients keep the wordmark readable; the deepest midnight
blue is reserved for the folds of the N instead of a stripe across the letters.
The palette covers the homepage, sharing pages, developer playground and guide;
versioned extension fixtures and download packages keep their original bytes.
Compact sticky navigation and the installation path remain unchanged.
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
The legacy layout of shared-link pages uses the same blue presentation overlay.
The original red/orange logo assets remain available for versioned demo content.

The developer playground at `/example/` shares the product branding and original
SVG illustrations. It is reachable from the main navigation, footer and the
dedicated creator section at `/#developers`. Its gallery initially shows eight
examples, with progressive disclosure and keyboard-accessible family filters.
Each family links directly to its API contract in the canonical guide. Without
JavaScript every example remains available. Reduced motion disables the filter
and reveal animations. Presentation changes do not alter the parser fixtures,
media, SDKs or previously published signed downloads.
