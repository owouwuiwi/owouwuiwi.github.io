(() => {
  'use strict';
  const decode = value => {
    if (typeof value !== 'string' || value.length > 32) return null;
    const code = value.startsWith('#') ? value.slice(1) : value;
    return /^[0-9]{8}$/.test(code) ? code : null;
  };
  const nativeLink = value => {
    const code = decode(value);
    return code ? `nyanime://watch/v1#${code}` : null;
  };
  const format = value => {
    const code = decode(value);
    return code ? `${code.slice(0, 4)} ${code.slice(4)}` : null;
  };
  const api = Object.freeze({ decode, nativeLink, format });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else globalThis.NyanimeRoomLinks = api;
})();
