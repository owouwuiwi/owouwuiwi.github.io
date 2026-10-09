# Nyanime website

English static website and Android App Link landing page for Nyanime.
Published at https://owouwuiwi.github.io/ using GitHub Pages, with no application backend.

- `index.html`: app presentation and latest public APK download.
- `open/`: shared-content landing page; references are kept in the fragment.
- `.well-known/assetlinks.json`: association for the signed public Android preview.
- `assets/content-links.js`: strict, source-agnostic v2 decoder and backward-compatible v1 bridge.

The landing page highlights the current Android feature set, including two-page
manga reading and optional live TV. Its wordmarks and app mark follow the assets
used by the Android app; the website does not bundle app code.

Run locally with `python -m http.server 8841`. Run contract checks with
`node --test tests/*.test.cjs`. The browser smoke script uses Playwright.

The download link uses the latest recommended four-part release from
`owouwuiwi/nyanime`, with the former repository address as a migration fallback.
Only verified canonical universal APKs are offered; preview compatibility aliases
do not change the website's recommended download. The previous Pages address keeps
a compatibility redirect and Android association so already shared links keep working.
When the public GitHub releases API
is unavailable, the GitHub releases page remains available. No analytics, login,
or cookies are used; the optional theme choice is stored locally in the browser.
GitHub receives website requests. Shared-content fragments are not sent to the host.

The logos belong to Nyanime. DM Sans and Manrope are distributed under the SIL
Open Font License, included alongside the self-hosted fonts. The decorative
interface illustrations are original website artwork, not app screenshots.
