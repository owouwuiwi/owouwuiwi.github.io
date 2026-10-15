const { test } = require('node:test');
const assert = require('node:assert/strict');
const links = require('../assets/room-links.js');
const associations = require('../.well-known/assetlinks.json');

test('HTTPS invites are associated with the current production Android identity', () => {
  const production = associations.find(entry => entry.target.package_name === 'it.owouwuiwi.nyanime');
  assert.ok(production.relation.includes('delegate_permission/common.handle_all_urls'));
  assert.equal(production.target.namespace, 'android_app');
  assert.ok(production.target.sha256_cert_fingerprints.some(fingerprint =>
    fingerprint.replaceAll(':', '') === '7DD368792C4D94D1186CC4B0E2AD6C2F34FCE5DD37F19C6A1BAB45106FFC136B'));
});

test('room codes preserve leading zeroes and use the exact native route', () => {
  assert.equal(links.decode('#01234567'), '01234567');
  assert.equal(links.decode('01234567'), '01234567');
  assert.equal(links.nativeLink('#01234567'), 'nyanime://watch/v1#01234567');
  assert.equal(links.format('01234567'), '0123 4567');
});

test('incomplete, encoded, executable and extended inputs never become native links', () => {
  for (const value of ['', '#', '#1234567', '#123456789', '#01234567?x=1', '#%30%31%32%33%34%35%36%37',
    '#１２３４５６７８', '#javascript:alert(1)', 'https://example.invalid/#01234567', '#01234567\n', null, {}]) {
    assert.equal(links.decode(value), null);
    assert.equal(links.nativeLink(value), null);
  }
});
