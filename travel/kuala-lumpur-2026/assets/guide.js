(() => {
  const progress = document.querySelector('.scroll-progress');
  const topButton = document.querySelector('.back-to-top');
  const navLinks = [...document.querySelectorAll('.day-nav a')];
  const daySections = [...document.querySelectorAll('[data-nav]')];

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    if (topButton) topButton.classList.toggle('visible', window.scrollY > 700);
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  topButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const activeId = visible.target.id;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeId}`;
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .1, .4] });
    daySections.forEach((section) => observer.observe(section));
  }

  const storageKey = 'kl-family-trip-2026-packing';
  const packInputs = [...document.querySelectorAll('[data-pack]')];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    packInputs.forEach((input) => { input.checked = Boolean(saved[input.dataset.pack]); });
  } catch (_) {
    // Storage is an enhancement; the guide remains usable without it.
  }

  const savePacking = () => {
    const state = Object.fromEntries(packInputs.map((input) => [input.dataset.pack, input.checked]));
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
  };
  packInputs.forEach((input) => input.addEventListener('change', savePacking));

  document.querySelector('.reset-checks')?.addEventListener('click', () => {
    packInputs.forEach((input) => { input.checked = false; });
    savePacking();
  });
})();
