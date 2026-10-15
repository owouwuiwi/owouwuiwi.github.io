(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  let generation = 0;
  function render() {
    const current = ++generation;
    const code = NyanimeRoomLinks.decode(location.hash);
    const join = byId('join-room');
    const copy = byId('copy-room');
    join.classList.add('hidden');
    join.removeAttribute('href');
    join.onclick = null;
    copy.classList.add('hidden');
    copy.onclick = null;
    byId('room-code').textContent = '';
    byId('room-status').textContent = '';
    if (!code) {
      byId('room-title').textContent = 'This invitation is incomplete.';
      byId('room-help').textContent = 'Ask your friend for a new room link or an eight-digit code.';
      byId('room-fallback').textContent = 'Your app and your current room have not been changed.';
      return;
    }
    byId('room-title').textContent = 'Join the room.';
    byId('room-help').textContent = 'Join your friends in Nyanime. The host needs to approve your request.';
    byId('room-code').textContent = NyanimeRoomLinks.format(code);
    byId('room-fallback').textContent = 'You can also open Watch together in the app and enter this code. Everyone plays their own content.';
    join.href = NyanimeRoomLinks.nativeLink(code);
    join.classList.remove('hidden');
    copy.classList.remove('hidden');
    join.onclick = () => {
      byId('room-status').textContent = 'Opening Nyanime…';
      setTimeout(() => {
        if (generation === current && !document.hidden) byId('room-status').textContent = 'Still here? Install or update Nyanime, then tap Open again.';
      }, 1800);
    };
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(code);
        if (generation === current) byId('room-status').textContent = 'Room code copied.';
      } catch {
        if (generation === current) byId('room-status').textContent = `Open Watch together in Nyanime and enter ${NyanimeRoomLinks.format(code)}.`;
      }
    };
  }
  render();
  window.addEventListener('hashchange', render);
})();
