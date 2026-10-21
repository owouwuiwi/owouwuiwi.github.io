const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { select, load } = require('../assets/releases.js');
const repos = ['publisher/app', 'old-publisher/app'];
const signal = () => new AbortController().signal;
const release = (version, prefix = 'Nyanime-Production', repository = repos[0]) => ({
  tag_name: 'v' + version, draft: false, prerelease: false,
  html_url: `https://github.com/${repository}/releases/tag/v${version}`,
  assets: [{ name: `${prefix}-${version}-universal.apk`,
    browser_download_url: `https://github.com/${repository}/releases/download/v${version}/${prefix}-${version}-universal.apk` }],
});
const response = value => ({ ok: true, json: async () => value });

test('production and historic installers are recognized; production wins', () => {
  for (const prefix of ['Nyanime-Production', 'Nyanime-production', 'Nyanime']) {
    assert.equal(select(release('1.2.3.4', prefix), repos).version, '1.2.3.4');
  }
  const value = release('1.2.3.4', 'Nyanime');
  value.assets.push(...release('1.2.3.4').assets);
  assert.match(select(value, repos).asset.name, /^Nyanime-Production-/);
});

test('patches, previews, drafts, non-numeric tags and untrusted destinations cannot be installers', () => {
  const value = release('1.2.3.4');
  const patch = { ...value.assets[0], name: 'Nyanime-Delta-base-1.2.3.4-universal.nyadelta' };
  for (const changed of [{ draft: true }, { prerelease: true }, { tag_name: 'r9999' },
    { assets: [patch] }, { html_url: 'https://github.com/other/app/releases/tag/v1.2.3.4' },
    { assets: [{ ...value.assets[0], browser_download_url: 'https://example.invalid/app.apk' }] }]) {
    assert.equal(select({ ...value, ...changed }, repos), null);
  }
});

test('latest full release uses one request and never consults an old publisher', async () => {
  const urls = [];
  const selected = await load(repos, async url => { urls.push(url); return response(release('1.2.3.4')); }, signal());
  assert.equal(selected.version, '1.2.3.4');
  assert.deepEqual(urls, ['https://api.github.com/repos/publisher/app/releases/latest']);
});

test('patch-only latest resolves to the newest complete installer in the same publisher', async () => {
  const latest = { ...release('1.3.0.0'), assets: [{ name: 'update.nyadelta' }] };
  const preview = { ...release('2.0.0.0'), prerelease: true };
  const urls = [];
  const selected = await load(repos, async url => {
    urls.push(url);
    return response(url.endsWith('/latest') ? latest : [release('1.2.9.0'), latest, preview, release('1.2.10.0')]);
  }, signal());
  assert.equal(selected.version, '1.2.10.0');
  assert.equal(urls.length, 2);
  assert.ok(urls.every(url => url.includes('/publisher/app/')));
});

test('a failed history lookup cannot replace an installer with a patch or stale publisher', async () => {
  let calls = 0;
  const selected = await load(repos, async () => ++calls === 1 ? response({ ...release('1.3.0.0'), assets: [] }) :
    { ok: false, status: 403 }, signal());
  assert.equal(selected, null);
  assert.equal(calls, 2);
});

test('rate limiting returns safely without querying an old publisher', async () => {
  let calls = 0;
  assert.equal(await load(repos, async () => { calls++; return { ok: false, status: 429 }; }, signal()), null);
  assert.equal(calls, 1);
});

test('an unavailable current publisher may use its explicitly trusted old address', async () => {
  let calls = 0;
  const selected = await load(repos, async () => ++calls === 1 ? { ok: false, status: 404 } :
    response(release('1.2.3.4', 'Nyanime', repos[1])), signal());
  assert.equal(selected.version, '1.2.3.4');
});

test('the no-JavaScript and API-error fallback downloads a complete APK directly', () => {
  const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');
  const href = html.match(/id="apk-download"[^>]*href="([^"]+)"/)[1];
  assert.match(href, /^https:\/\/github\.com\/owouwuiwi\/nyanime\/releases\/download\/v[\d.]+\/Nyanime-Production-[\d.]+-universal\.apk$/);
  assert.ok(!href.includes('.nyadelta'));
});
