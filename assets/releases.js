/* The current publisher wins. Old addresses are retained only for migration fallback. */
(() => {
  function select(release, repositories) {
    if (!release || release.draft || release.prerelease ||
        !/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(release.tag_name)) return null;
    const version = release.tag_name.slice(1);
    if (!version.split('.').every(part => Number.isSafeInteger(Number(part)))) return null;
    // Browser downloads are installers. Patch files can only be applied by the app.
    for (const name of [`Nyanime-Production-${version}-universal.apk`,
      `Nyanime-production-${version}-universal.apk`, `Nyanime-${version}-universal.apk`]) {
      const asset = release.assets?.find(item => item.name === name);
      if (!asset) continue;
      const trusted = repositories.some(repository =>
        release.html_url === `https://github.com/${repository}/releases/tag/${release.tag_name}` &&
        asset.browser_download_url === `https://github.com/${repository}/releases/download/${release.tag_name}/${name}`);
      if (trusted) return { release, asset, version };
    }
    return null;
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
      // A patch-only release must never become a browser download or send users to another publisher.
      const selected = select(await response.json(), repositories);
      if (selected) return selected;
      const history = await fetcher(`https://api.github.com/repos/${repository}/releases?per_page=30`, { signal });
      if (!history.ok) return null;
      const releases = await history.json();
      if (!Array.isArray(releases)) return null;
      return releases.map(release => select(release, repositories)).filter(Boolean).sort((a, b) => {
        const left = a.version.split('.').map(Number), right = b.version.split('.').map(Number);
        for (let i = 0; i < 4; i++) if (left[i] !== right[i]) return right[i] - left[i];
        return 0;
      })[0] || null;
    }
    return null;
  }

  const api = { select, load };
  if (typeof module !== 'undefined') module.exports = api;
  else globalThis.NyanimeReleases = api;
})();
