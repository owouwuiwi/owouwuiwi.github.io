# Community design vote

Public URL: https://owouwuiwi.github.io/vota/

Results: https://owouwuiwi.github.io/vota/#risultati (aggregates, refresh and CSV).

Four choices: Ritmo, Copertina, Taccuino, or retaining the current design. The
three new designs can be explored in a responsive prototype with anime/manga,
library/detail and light/dark controls. The prototype is illustrative, uses the
site's original CC0 demo artwork, and does not access an app or user library.

Real votes live in the separately deployed `nyanime-vota-api` D1 service. A random
browser token is hashed before storage; changing a choice replaces that token's
existing vote. No names or email addresses are requested. This is a low-stakes
anonymous preference poll, not a one-person-one-vote identity system. Clearing
browser storage or changing browser/device can permit another vote. CORS and
change limits are basic friction, not proof against automation.

The optional 300-vote graphic is explicitly marked as simulated: Ritmo 87,
Copertina 72, Taccuino 48, current design 93 (31%). It is never stored in the
database, included in real totals, or exported with real results.

Original frontend code and prototype remain part of this website. Lucide icons
retain their ISC licence in `prototipo/lucide-LICENSE`; the embedded Manrope font
retains its SIL OFL notice. Brand assets retain their existing copyright.
