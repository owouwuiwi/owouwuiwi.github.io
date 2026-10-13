(() => {
  const control = document.querySelector('[data-experience-switch]');
  const container = document.querySelector('.experience-panels');
  if (!control || !container) return;
  const tabs = [...control.querySelectorAll('[data-mode]')];
  const panels = [...container.querySelectorAll('[data-panel]')];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let activeAnimation;
  control.setAttribute('role', 'tablist');
  container.dataset.enhanced = '';
  tabs.forEach(tab => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${tab.dataset.mode}-panel`);
  });
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${panel.dataset.panel}-tab`);
    panel.tabIndex = 0;
  });
  const settle = () => { activeAnimation?.cancel(); activeAnimation = undefined; };
  const activate = (tab, animate) => {
    settle();
    control.dataset.active = tab.dataset.mode;
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.panel !== tab.dataset.mode;
      panel.inert = panel.hidden;
    });
    const panel = panels.find(item => !item.hidden);
    if (animate && !preference.matches && !document.hidden && panel?.animate) {
      activeAnimation = panel.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-fast')) || 250,
        easing: 'ease-in-out',
      });
    }
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { if (tab.getAttribute('aria-selected') !== 'true') activate(tab, true); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activate(tabs[next], true);
      tabs[next].focus();
    });
  });
  preference.addEventListener('change', () => { if (preference.matches) settle(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
  container.addEventListener('focusin', settle);
  activate(tabs[0], false);
  control.hidden = false;
})();
