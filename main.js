// ============================================================
// Staggered scroll-reveal with IntersectionObserver
// ============================================================

(function () {
  const STAGGER_DELAY = 80; // ms between sibling reveals

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Stagger siblings in the same container
          const siblings = Array.from(
            el.parentElement?.querySelectorAll(".reveal") || []
          );
          const idx = siblings.indexOf(el);
          const base = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
          const delay = base + idx * STAGGER_DELAY;

          setTimeout(() => {
            el.classList.add("visible");
          }, delay);

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  // Observe all .reveal elements once DOM is ready
  function init() {
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
