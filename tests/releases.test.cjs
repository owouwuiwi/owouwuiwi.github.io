const { test } = require('node:test');
const assert = require('node:assert/strict');
const { select, load } = require('../assets/releases.js');
const repositories = ['new-publisher/app', 'previous-publisher/app'];
const release = repository => ({
  tag_name: 'v0.19.0.1', draft: false, prerelease: false,
  html_url: `https://github.com/${repository}/releases/tag/v0.19.0.1`,
  assets: [{ name: 'Nyanime-0.19.0.1-universal.apk', browser_download_url:
    `https://github.com/${repository}/releases/download/v0.19.0.1/Nyanime-0.19.0.1-universal.apk` }],
});
const signal = () => new AbortController().signal;

test('accepts canonical recommended APKs under either verified publisher after a redirect', () => {
  for (const repository of repositories) assert.equal(select(release(repository), repositories).version, '0.19.0.1');
});
test('rejects drafts previews legacy aliases and unrelated download destinations', () => {
  const valid = release(repositories[0]);
  for (const changed of [{ draft: true }, { prerelease: true }, { tag_name: 'r9000' },
    { html_url: 'https://github.com/unrelated/app/releases/tag/v0.19.0.1' },
    { assets: [{ ...valid.assets[0], browser_download_url: valid.assets[0].browser_download_url + '/untrusted' }] }]) {
    assert.equal(select({ ...valid, ...changed }, repositories), null);
  }
});
test('primary recommended endpoint is authoritative', async () => {
  const visited = [];
  const selected = await load(repositories, async url => {
    visited.push(url);
    return { ok: true, json: async () => release(repositories[0]) };
  }, signal());
  assert.equal(selected.version, '0.19.0.1');
  assert.deepEqual(visited, ['https://api.github.com/repos/new-publisher/app/releases/latest']);
});
test('temporary errors retry the previous address once', async () => {
  for (const status of [404, 503]) {
    let calls = 0;
    const selected = await load([...repositories, repositories[1]], async () => {
      if (++calls === 1) return { ok: false, status };
      return { ok: true, json: async () => release(repositories[1]) };
    }, signal());
    assert.equal(selected.version, '0.19.0.1');
    assert.equal(calls, 2);
  }
});
test('rate limits and an empty valid channel stop without consulting the old address', async () => {
  for (const response of [{ ok: false, status: 429 }, { ok: true, json: async () => ({}) }]) {
    let calls = 0;
    assert.equal(await load(repositories, async () => { calls++; return response; }, signal()), null);
    assert.equal(calls, 1);
  }
});
test('cancellation stops all publisher requests', async () => {
  const controller = new AbortController();
  controller.abort();
  let calls = 0;
  await assert.rejects(load(repositories, async () => { calls++; throw new DOMException('cancelled', 'AbortError'); },
    controller.signal), { name: 'AbortError' });
  assert.equal(calls, 1);
});
