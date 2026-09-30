(() => {
  const byId = id => document.getElementById(id);
  let generation = 0;
  function render() {
  const current = ++generation;
  document.title = 'Open in Nyanime';
  byId('open-kind').textContent = 'Shared with you';
  byId('open-position').textContent = '';
  byId('open-status').textContent = '';
  byId('open-app').classList.add('hidden');
  byId('copy-link').classList.add('hidden');
  byId('open-help').textContent = 'You’ll need Nyanime and the matching extension on your device.';
  const link = NyanimeLinks.decode(location.hash);
  if (!link) {
    byId('open-title').textContent = 'This link needs another look.';
    byId('open-subtitle').textContent = 'The shared link is incomplete or uses a newer format. Ask your friend to share it again, and make sure your app is up to date.';
    byId('open-help').textContent = 'Your library and progress have not been changed.';
    return;
  }
  document.title = `${link.title} — Nyanime`;
  byId('open-kind').textContent = link.medium === 'ANIME' ? 'A video shared with you' : 'A manga shared with you';
  byId('open-title').textContent = link.title;
  byId('open-subtitle').textContent = link.itemTitle || (link.itemUrl ? (link.medium === 'ANIME' ? 'Open the shared episode.' : 'Open the shared chapter.') : 'Open the title in your app.');
  if (link.positionMs > 0) {
    const total = Math.floor(link.positionMs / 1000);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const time = hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${minutes}:${String(seconds).padStart(2, '0')}`;
    byId('open-position').textContent = `Start at ${time}`;
  } else if (link.page) byId('open-position').textContent = `Page ${link.page}`;
  const open = byId('open-app');
  const legacy = NyanimeLinks.legacyLink(link);
  open.href = legacy;
  open.classList.remove('hidden');
  open.onclick = () => {
    byId('open-status').textContent = 'Opening Nyanime…';
    setTimeout(() => {
      if (current === generation && !document.hidden) byId('open-status').textContent = 'Still here? Install or update Nyanime, then tap Open again.';
    }, 1800);
  };
  const copy = byId('copy-link');
  copy.classList.remove('hidden');
  copy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      byId('open-status').textContent = 'Link copied. You can also share it with Nyanime from your device’s Share menu.';
    } catch {
      byId('open-status').textContent = 'Copy the link from your browser’s address bar.';
    }
  };
  }
  render();
  window.addEventListener('hashchange', render);
})();
