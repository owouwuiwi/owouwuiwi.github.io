const { test } = require('node:test');
const assert = require('node:assert/strict');
const { decode, legacyLink } = require('../assets/content-links.js');
const fragment = '#v2/anime/test-title?source=9223372036854775807&ref=/catalogue/test%3Fedition%3D2&title=Test%20title&item=/episode/2&at=123456';

test('old app bridge preserves 64-bit extension identities and exact opaque references', () => {
  const link = decode(fragment);
  assert.equal(link.sourceId, '9223372036854775807');
  assert.equal(link.entryUrl, '/catalogue/test?edition=2');
  assert.equal(link.positionMs, 123456);
  const old = legacyLink(link);
  const json = Buffer.from(old.split('#')[1], 'base64url').toString('utf8');
  assert.match(json, /"sourceId":9223372036854775807/);
  assert.equal(JSON.parse(json).positionMs, 123456);
  assert.equal(JSON.parse(json).entryUrl, '/catalogue/test?edition=2');
});
test('unicode and page links work without interpreting source references', () => {
  const link = decode('#v2/manga/title?source=-9223372036854775808&ref=/a%252Fb&title=%E6%9C%AC%20%C3%A8&item=/c%3Fx%3D1%26y%3D2&page=17');
  assert.equal(link.title, '本 è');
  assert.equal(link.entryUrl, '/a%2Fb');
  assert.equal(link.itemUrl, '/c?x=1&y=2');
  assert.equal(link.page, 17);
  assert.equal(JSON.parse(Buffer.from(legacyLink(link).split('#')[1], 'base64url').toString('utf8')).title, '本 è');
});
test('ambiguous identities, malformed encodings, unsupported versions and mixed destinations fail closed', () => {
  for (const raw of [
    fragment + '&source=12', fragment + '&%73ource=12',
    fragment.replace('source=9223372036854775807', 'source=9223372036854775808'),
    fragment.replace('source=9223372036854775807', 'source=0'),
    fragment.replace('title=Test', 'title=%FFTest'),
    fragment.replace('title=Test', 'title=%00Test'),
    fragment.replace('title=Test', 'title=%ZZTest'),
    fragment.replace('v2/', 'v3/'), fragment + '&page=1',
    fragment.replace('at=123456', 'at=-1'), fragment.replace('at=123456', 'at=oops'),
    fragment.replace('&item=/episode/2', ''),
  ]) assert.equal(decode(raw), null, raw);
});
