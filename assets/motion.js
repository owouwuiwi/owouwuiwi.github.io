(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  // Content is visible by default, even if this file or the observer cannot run.
  // Only intersecting elements animate, once; no scroll polling or hidden queue.
  const active = new Map();
  const tokens = getComputedStyle(document.documentElement);
  const duration = parseFloat(tokens.getPropertyValue('--motion-reveal')) || 500;
  const distance = tokens.getPropertyValue('--motion-distance').trim() || '12px';
  const observer = new IntersectionObserver(entries => {
    let stagger = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      // Deep links, quick scrolling and keyboard navigation must stay immediate.
      if (preference.matches || document.hidden || entry.boundingClientRect.top < 0 ||
          element.contains(document.activeElement)) continue;
      const animation = element.animate([
        { opacity: 0, translate: `0 ${distance}` },
        { opacity: 1, translate: '0 0' },
      ], {
        duration,
        delay: Math.min(stagger++ * 40, 200),
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'backwards',
      });
      active.set(element, animation);
      const clear = () => { if (active.get(element) === animation) active.delete(element); };
      animation.addEventListener('finish', clear, { once: true });
      animation.addEventListener('cancel', clear, { once: true });
    }
  }, { rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('[data-reveal]')
    .forEach(element => observer.observe(element));

  const settle = () => {
    for (const animation of active.values()) animation.cancel();
    active.clear();
  };
  preference.addEventListener('change', () => {
    if (preference.matches) { observer.disconnect(); settle(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
  document.addEventListener('focusin', event => {
    for (const [element, animation] of active) {
      if (element.contains(event.target)) animation.cancel();
    }
  });
})();
