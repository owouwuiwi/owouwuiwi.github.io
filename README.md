# Nyanime website

English static website and Android App Link landing page for Nyanime.
Published at https://noire342.github.io/ using GitHub Pages, with no application backend.

- `index.html`: app presentation and latest public APK download.
- `open/`: shared-content landing page; references are kept in the fragment.
- `.well-known/assetlinks.json`: association for the signed public Android preview.
- `assets/content-links.js`: strict, source-agnostic v2 decoder and backward-compatible v1 bridge.

Run locally with `python -m http.server 8841`. Run contract checks with
`node --test tests/content-links.test.cjs`. The browser smoke script uses Playwright.

The download link is resolved from the public GitHub releases API. When that API
is unavailable, the GitHub releases page remains available. No analytics, login,
or cookies are used; the optional theme choice is stored locally in the browser.
GitHub receives website requests. Shared-content fragments are not sent to the host.

The logos belong to Nyanime. DM Sans and Manrope are distributed under the SIL
Open Font License, included alongside the self-hosted fonts. The decorative
interface illustrations are original website artwork, not app screenshots.
