/* ============================================================
   SANGEET DAS — RESUME  |  main.js
   ============================================================ */

(function () {
  'use strict';

  // ── 1. SCROLL REVEAL with per-element stagger ─────────────
  // Each .reveal fades in when it enters the viewport.
  // Siblings in the same parent get a small stagger delay.
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          // Stagger: count position among .reveal siblings in same parent
          const siblings = Array.from(
            el.parentElement.children
          ).filter(c => c.classList.contains('reveal'));
          const idx = siblings.indexOf(el);

          // Base delay from CSS transition-delay (if set) + stagger offset
          el.style.transitionDelay = (idx * 80) + 'ms';
          el.classList.add('visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -20px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── 2. PARALLAX on hero background ───────────────────────
  // Very subtle — moves the hero bg at 25% scroll speed.
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          hero.style.backgroundPositionY = (y * 0.25) + 'px';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  // ── 3. ACTIVE NAV SECTION HIGHLIGHTING ───────────────────
  // IntersectionObserver on each <section id="..."> in <main>.
  // When a section occupies the centre band of the viewport,
  // its matching nav links get .nav-active (desktop + mobile).
  function initActiveNav() {
    const sections    = document.querySelectorAll('main section[id]');
    const navLinks    = document.querySelectorAll('.nav-links a[href^="#"]');
    const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');

    if (!sections.length) return;

    function setActive(id) {
      [...navLinks, ...mobileLinks].forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id);
      });
    }

    // Use scroll position to determine active section (most reliable approach)
    const navH = document.querySelector('.nav')?.offsetHeight || 58;

    function onScroll() {
      let current = '';
      sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        // Section is "active" when its top is within the upper 55% of viewport
        if (top <= window.innerHeight * 0.42) {
          current = section.id;
        }
      });
      if (current) setActive(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ── 4. STICKY SECTION HEADER DETECTION ───────────────────
  // Adds .is-stuck when a .section-header is pinned at top,
  // so CSS can render a separator below it.
  function initStickyHeaders() {
    const headers = document.querySelectorAll('.section-header');
    const navH = document.querySelector('.nav')?.offsetHeight || 58;

    headers.forEach(header => {
      // Insert a 1px sentinel just before the header inside the section
      const sentinel = document.createElement('div');
      sentinel.style.cssText =
        'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;';
      const parent = header.closest('.section, .section-alt');
      if (parent) {
        parent.style.position = 'relative';
        parent.insertBefore(sentinel, header);
      }

      const obs = new IntersectionObserver(
        ([entry]) => header.classList.toggle('is-stuck', !entry.isIntersecting),
        { rootMargin: `-${navH + 2}px 0px 0px 0px`, threshold: 0 }
      );
      obs.observe(sentinel);
    });
  }

  // ── 5. MOBILE HAMBURGER ───────────────────────────────────
  function initHamburger() {
    const btn  = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      menu.hidden = isOpen;
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── INIT ──────────────────────────────────────────────────
  function init() {
    initReveal();
    initParallax();
    initActiveNav();
    initStickyHeaders();
    initHamburger();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
