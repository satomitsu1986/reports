(() => {
  "use strict";

  const DESKTOP_CANVAS = { width: 1600, height: 900 };
  const MOBILE_CANVAS = { width: 900, height: 1600 };
  const MOBILE_QUERY = window.matchMedia("(max-width: 700px)");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const stage = document.getElementById("stage");
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");
  const presentationButton = document.getElementById("presentationButton");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const slideCounter = document.getElementById("slideCounter");
  const progressFill = document.getElementById("progressFill");
  const screenReaderStatus = document.getElementById("screenReaderStatus");

  if (
    slides.length === 0 ||
    !stage ||
    !previousButton ||
    !nextButton ||
    !presentationButton ||
    !fullscreenButton ||
    !slideCounter ||
    !progressFill ||
    !screenReaderStatus
  ) {
    return;
  }

  const parseSlideFromHash = () => {
    const match = window.location.hash.match(/^#slide-(\d{2})$/);
    if (!match) return 0;
    const index = Number(match[1]) - 1;
    return Number.isInteger(index) && index >= 0 && index < slides.length ? index : 0;
  };

  let currentIndex = parseSlideFromHash();
  let pointerGesture = null;

  const scaleStage = () => {
    const canvas = MOBILE_QUERY.matches ? MOBILE_CANVAS : DESKTOP_CANVAS;
    stage.style.width = `${canvas.width}px`;
    stage.style.height = `${canvas.height}px`;
    stage.dataset.layout = MOBILE_QUERY.matches ? "mobile" : "desktop";
    const scale = Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
    stage.dataset.scale = String(scale);
  };

  const showSlide = (nextIndex, updateHash = true) => {
    currentIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));

    slides.forEach((slide, index) => {
      const active = index === currentIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    const visibleNumber = String(currentIndex + 1).padStart(2, "0");
    slideCounter.textContent = `${visibleNumber} / ${slides.length}`;
    progressFill.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    screenReaderStatus.textContent = `スライド${currentIndex + 1}、${slides[currentIndex].querySelector("h1, h2")?.textContent?.trim() ?? ""}`;

    if (updateHash) {
      window.history.replaceState(null, "", `#slide-${visibleNumber}`);
    }
  };

  const setPresentationMode = (enabled) => {
    document.body.classList.toggle("presentation-mode", enabled);
    presentationButton.setAttribute("aria-pressed", String(enabled));
  };

  const togglePresentationMode = () => {
    setPresentationMode(!document.body.classList.contains("presentation-mode"));
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen availability depends on the recording browser and user gesture.
    }
  };

  previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
  presentationButton.addEventListener("click", togglePresentationMode);
  fullscreenButton.addEventListener("click", toggleFullscreen);

  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest("button, a, input, textarea, select")) return;

    pointerGesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startedAt: performance.now(),
    };
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointerup", (event) => {
    if (!pointerGesture || event.pointerId !== pointerGesture.pointerId) return;

    const deltaX = event.clientX - pointerGesture.startX;
    const deltaY = event.clientY - pointerGesture.startY;
    const elapsed = performance.now() - pointerGesture.startedAt;
    const horizontalSwipe = Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;
    const shortTap = Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12 && elapsed < 350;
    pointerGesture = null;

    if (horizontalSwipe) {
      showSlide(currentIndex + (deltaX < 0 ? 1 : -1));
      return;
    }

    if (shortTap) {
      const horizontalPosition = event.clientX / window.innerWidth;
      if (horizontalPosition <= 0.35) showSlide(currentIndex - 1);
      if (horizontalPosition >= 0.65) showSlide(currentIndex + 1);
    }
  });

  stage.addEventListener("pointercancel", () => {
    pointerGesture = null;
  });

  window.addEventListener("resize", scaleStage, { passive: true });
  MOBILE_QUERY.addEventListener("change", scaleStage);
  window.addEventListener("hashchange", () => showSlide(parseSlideFromHash(), false));
  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "全画面を終了" : "全画面";
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      showSlide(currentIndex + 1);
      return;
    }

    if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      showSlide(currentIndex - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      showSlide(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1);
      return;
    }

    if (event.key.toLowerCase() === "p") {
      event.preventDefault();
      togglePresentationMode();
      return;
    }

    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      void toggleFullscreen();
      return;
    }

    if (event.key === "Escape" && document.body.classList.contains("presentation-mode")) {
      setPresentationMode(false);
    }
  });

  const startInPresentationMode = new URLSearchParams(window.location.search).get("present") === "1";
  setPresentationMode(startInPresentationMode);
  scaleStage();
  showSlide(currentIndex);

  window.BDXLearn01Presentation = Object.freeze({
    getCurrentSlide: () => currentIndex + 1,
    getSlideCount: () => slides.length,
    goToSlide: (number) => showSlide(Number(number) - 1),
    setPresentationMode,
  });
})();
