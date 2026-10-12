(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-button');
  let stored;
  try { stored = localStorage.getItem('nyanime-theme'); } catch { /* Storage is optional. */ }
  const media = matchMedia('(prefers-color-scheme: light)');
  const apply = theme => {
    root.dataset.theme = theme;
    const label = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    themeButton?.setAttribute('aria-label', label);
    themeButton?.setAttribute('title', label);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#faf6ef' : '#111014');
  };
  apply(stored === 'light' || stored === 'dark' ? stored : media.matches ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => {
    stored = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(stored);
    try { localStorage.setItem('nyanime-theme', stored); } catch { /* Storage is optional. */ }
  });
  media.addEventListener('change', () => { if (!stored) apply(media.matches ? 'light' : 'dark'); });

  const download = document.getElementById('apk-download');
  if (!download) return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  NyanimeReleases.load(['owouwuiwi/nyanime', 'noire342/nyanime'], fetch, controller.signal)
    .then(selected => {
      if (!selected) return;
      const { release, asset, version } = selected;
      download.href = asset.browser_download_url;
      const notes = document.getElementById('release-notes');
      if (notes) notes.href = release.html_url;
      const label = document.getElementById('release-label');
      if (label) label.textContent = `${version} · Recommended${asset.size ? ' · ' + Math.round(asset.size / 1048576) + ' MB' : ''}`;
    })
    .catch(() => { /* The GitHub release link remains usable when the API is unavailable. */ })
    .finally(() => clearTimeout(timeout));
})();
