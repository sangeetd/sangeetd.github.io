// ── Scroll Reveal ─────────────────────────────────────────────
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(el);
        setTimeout(() => el.classList.add('visible'), idx * 75);
        observer.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -28px 0px' }
  );

  function init() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

// ── Mobile Hamburger ──────────────────────────────────────────
(function () {
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ── Hide nav on scroll down, show on scroll up ────────────────
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.style.transform = (y > lastY && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
    nav.style.transition = 'transform 0.3s ease';
    lastY = y;
  }, { passive: true });
})();
