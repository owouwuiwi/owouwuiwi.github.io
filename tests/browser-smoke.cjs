const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  fs.mkdirSync('artifacts', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 960 }, colorScheme: 'dark', reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('https://api.github.com/**', route => route.abort());
      await page.goto('http://127.0.0.1:8841/', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
      assert.match(await page.locator('#apk-download').getAttribute('href'), /releases\/latest$/);
      await page.getByRole('button', { name: 'Switch to light theme' }).click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      await page.screenshot({ path: `artifacts/home-${width}-light.png`, fullPage: true });
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
      await page.screenshot({ path: `artifacts/home-${width}-dark.png`, fullPage: true });
      await page.goto('http://127.0.0.1:8841/open/#v2/anime/test-title?source=9223372036854775807&ref=/title/one&title=A%20shared%20story&item=/episode/2&at=123456', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#open-title').textContent(), 'A shared story');
      assert.equal(await page.locator('#open-position').textContent(), 'Start at 2:03');
      const old = await page.locator('#open-app').getAttribute('href');
      assert.match(Buffer.from(old.split('#')[1], 'base64url').toString('utf8'), /"sourceId":9223372036854775807/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `artifacts/open-${width}.png`, fullPage: true });
      await page.goto('http://127.0.0.1:8841/open/#v2/anime/title?source=0&ref=/title&title=Invalid');
      await page.waitForFunction(() => document.getElementById('open-title').textContent.includes('another look'));
      assert.equal(await page.locator('#open-app').isVisible(), false);
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log('Website smoke passed: 320, 390, 768, 1440 px; both themes; offline release fallback; valid and invalid links.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
