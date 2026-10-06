(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.getElementById('stage');
  const counter = document.getElementById('slideCounter');
  const progress = document.getElementById('progressFill');
  const previous = document.getElementById('previousButton');
  const next = document.getElementById('nextButton');
  const presentation = document.getElementById('presentationButton');
  const fullscreen = document.getElementById('fullscreenButton');
  const status = document.getElementById('screenReaderStatus');
  let current = 0;

  const clamp = (value) => Math.max(0, Math.min(slides.length - 1, value));
  const hashIndex = () => {
    const match = location.hash.match(/slide-(\d{1,2})/);
    return match ? clamp(Number(match[1]) - 1) : 0;
  };
  const titleOf = (slide) => slide.querySelector('h1,h2')?.textContent.trim() || '';

  function render(index, updateHash = true) {
    current = clamp(index);
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    const visibleNumber = String(current + 1).padStart(2, '0');
    counter.value = `${visibleNumber} / ${slides.length}`;
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    status.textContent = `スライド${current + 1}、${titleOf(slides[current])}`;
    if (updateHash) history.replaceState(null, '', `#slide-${visibleNumber}`);
  }

  function fitStage() {
    const mobile = matchMedia('(max-width: 700px)').matches;
    const width = mobile ? 900 : 1600;
    const height = mobile ? 1600 : 900;
    const scale = Math.min(innerWidth / width, innerHeight / height);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function setPresentationMode(on) {
    document.body.classList.toggle('presentation-mode', on);
    presentation.setAttribute('aria-pressed', String(on));
    presentation.textContent = on ? '編集表示' : '発表モード';
  }

  previous.addEventListener('click', () => render(current - 1));
  next.addEventListener('click', () => render(current + 1));
  presentation.addEventListener('click', () => setPresentationMode(!document.body.classList.contains('presentation-mode')));
  fullscreen.addEventListener('click', async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  });
  addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); render(current + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); render(current - 1); }
    if (event.key.toLowerCase() === 'p') setPresentationMode(!document.body.classList.contains('presentation-mode'));
    if (event.key.toLowerCase() === 'f') fullscreen.click();
  });
  addEventListener('hashchange', () => render(hashIndex(), false));
  addEventListener('resize', fitStage);
  if (new URLSearchParams(location.search).get('present') === '1') setPresentationMode(true);
  fitStage();
  render(hashIndex(), false);
  window.BDXLearn07Presentation = { goToSlide: (slideNumber) => render(Number(slideNumber) - 1), fitStage };
})();
