/* Public, source-agnostic link contract. All references stay in the URL fragment. */
(() => {
  const clean = (value, maximum) => typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum && !/[\x00-\x1f\x7f]/.test(value);
  const optional = (fields, key, maximum) => !fields.has(key) || clean(fields.get(key), maximum);
  const decimal = value => /^-?\d+$/.test(value);
  function decode(fragment) {
    if (!fragment || fragment.length > 24000) return null;
    try {
      const raw = fragment.replace(/^#/, '');
      const divider = raw.indexOf('?');
      if (divider < 0) return null;
      const route = /^v2\/(anime|manga|tv)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(raw.slice(0, divider));
      if (!route || route[2].length > 80) return null;
      const query = raw.slice(divider + 1);
      // URLSearchParams tolerates malformed UTF-8. Validate percent escapes strictly first.
      decodeURIComponent(query.replace(/\+/g, ' '));
      const fields = new URLSearchParams(query);
      const seen = new Set();
      for (const [key] of fields) { if (seen.has(key)) return null; seen.add(key); }
      if (seen.size > 20) return null;
      const source = fields.get('source');
      if (!source || !decimal(source)) return null;
      const sourceId = BigInt(source);
      if (sourceId === 0n || sourceId < -9223372036854775808n || sourceId > 9223372036854775807n) return null;
      if (!clean(fields.get('ref'), 4096) || !clean(fields.get('title'), 512) ||
        !optional(fields, 'sourceName', 128) || !optional(fields, 'item', 4096) ||
        !optional(fields, 'itemTitle', 512)) return null;
      if (!fields.has('item') && ['itemTitle', 'at', 'page'].some(key => fields.has(key))) return null;
      const medium = { anime: 'ANIME', manga: 'MANGA', tv: 'TV' }[route[1]];
      if (medium === 'TV' && (fields.get('ref').length > 1024 || /^https?:\/\//i.test(fields.get('ref')) ||
        ['item', 'itemTitle', 'at', 'page'].some(key => fields.has(key)))) return null;
      const link = { medium, sourceId: sourceId.toString(), entryUrl: fields.get('ref'), title: fields.get('title') };
      for (const [input, output] of [['sourceName', 'sourceName'], ['item', 'itemUrl'], ['itemTitle', 'itemTitle']]) {
        if (fields.has(input)) link[output] = fields.get(input);
      }
      if (fields.has('at')) {
        const at = fields.get('at');
        if (medium !== 'ANIME' || !/^\d+$/.test(at) || Number(at) > 2592000000) return null;
        link.positionMs = Number(at);
      }
      if (fields.has('page')) {
        const page = fields.get('page');
        if (medium !== 'MANGA' || !/^\d+$/.test(page) || Number(page) < 1 || Number(page) > 100000) return null;
        link.page = Number(page);
      }
      return link;
    } catch { return null; }
  }
  function legacyLink(link) {
    // Preserve the full 64-bit source ID; converting it to a JS Number loses precision.
    const json = JSON.stringify(link).replace(/"sourceId":"(-?\d+)"/, '"sourceId":$1');
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return 'nyanime://open/v1#' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  const api = { decode, legacyLink };
  if (typeof module !== 'undefined') module.exports = api;
  else globalThis.NyanimeLinks = api;
})();
