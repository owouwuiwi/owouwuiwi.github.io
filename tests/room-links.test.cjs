const { test } = require('node:test');
const assert = require('node:assert/strict');
const links = require('../assets/room-links.js');

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
