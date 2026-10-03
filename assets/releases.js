/* The current publisher wins. Old addresses are retained only for migration fallback. */
(() => {
  function select(release, repositories) {
    if (!release || release.draft || release.prerelease ||
        !/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(release.tag_name)) return null;
    const version = release.tag_name.slice(1);
    const asset = release.assets?.find(item => item.name === `Nyanime-${version}-universal.apk`);
    if (!asset) return null;
    const trusted = repositories.some(repository =>
      release.html_url === `https://github.com/${repository}/releases/tag/${release.tag_name}` &&
      asset.browser_download_url === `https://github.com/${repository}/releases/download/${release.tag_name}/${asset.name}`);
    return trusted ? { release, asset, version } : null;
  }

  async function load(repositories, fetcher, signal) {
    for (const repository of new Set(repositories)) {
      let response;
      try {
        response = await fetcher(`https://api.github.com/repos/${repository}/releases/latest`, { signal });
      } catch (error) {
        if (signal.aborted || error.name === 'AbortError') throw error;
        if (!(error instanceof TypeError)) throw error;
        continue;
      }
      if (!response.ok) {
        if ([404, 410, 500, 502, 503, 504].includes(response.status)) continue;
        return null;
      }
      // Don't override a valid current response using a stale release from an old address.
      return select(await response.json(), repositories);
    }
    return null;
  }

  const api = { select, load };
  if (typeof module !== 'undefined') module.exports = api;
  else globalThis.NyanimeReleases = api;
})();
