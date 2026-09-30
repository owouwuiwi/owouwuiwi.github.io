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
  fetch('https://api.github.com/repos/noire342/nyanime/releases?per_page=5', { signal: controller.signal })
    .then(response => { if (!response.ok) throw new Error('Release unavailable'); return response.json(); })
    .then(releases => {
      const release = releases.find(item => !item.draft && item.assets?.some(asset => asset.name === 'app-universal-preview.apk'));
      if (!release) return;
      const asset = release.assets.find(item => item.name === 'app-universal-preview.apk');
      const trusted = /^https:\/\/github\.com\/noire342\/nyanime\/releases\//;
      if (!trusted.test(asset.browser_download_url) || !trusted.test(release.html_url)) return;
      download.href = asset.browser_download_url;
      const notes = document.getElementById('release-notes');
      if (notes) notes.href = release.html_url;
      const label = document.getElementById('release-label');
      if (label) label.textContent = `${release.tag_name} · Preview${asset.size ? ' · ' + Math.round(asset.size / 1048576) + ' MB' : ''}`;
    })
    .catch(() => { /* The GitHub release link remains usable when the API is unavailable. */ })
    .finally(() => clearTimeout(timeout));
})();
