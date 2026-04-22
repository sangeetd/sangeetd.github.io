/* ============================================================
   SANGEET DAS — RESUME  |  main.js
   ============================================================ */

(function () {
  'use strict';

  // ── 1. SCROLL REVEAL ──────────────────────────────────────
  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Stagger among same-parent siblings
          const siblings = Array.from(el.parentElement.children)
            .filter(c => c.classList.contains('reveal'));
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = (idx * 80) + 'ms';
          el.classList.add('visible');
          io.unobserve(el);
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -20px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // ── 2. PARALLAX ───────────────────────────────────────────
  // Hero bg shifts at 35% scroll speed; stats-bar at -15%
  // giving a layered depth effect.
  function initParallax() {
    const hero  = document.querySelector('.hero');
    const stats = document.querySelector('.stats-bar');
    if (!hero) return;
    let raf = false;

    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.5) {
          // Hero shifts down (feels like it recedes)
          hero.style.transform = `translateY(${y * 0.22}px)`;
          hero.style.opacity   = Math.max(0, 1 - y / (window.innerHeight * 0.9));
        }
        if (stats) {
          // Stats bar has a counter-direction micro-shift
          const statsTop = stats.getBoundingClientRect().top;
          if (statsTop < window.innerHeight && statsTop > -200) {
            const offset = (window.innerHeight - statsTop) * 0.06;
            stats.style.backgroundPositionY = offset + 'px';
          }
        }
        raf = false;
      });
    }, { passive: true });
  }

  // ── 3. ACTIVE NAV HIGHLIGHTING ────────────────────────────
  // Scroll-position based — checks each section's bounding rect.
  function initActiveNav() {
    const sections    = document.querySelectorAll('main section[id]');
    const desktopLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const mobileLinks  = document.querySelectorAll('.mobile-menu a[href^="#"]');
    if (!sections.length) return;

    function setActive(id) {
      [...desktopLinks, ...mobileLinks].forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id);
      });
    }

    function onScroll() {
      let current = '';
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          current = section.id;
        }
      });
      if (current) setActive(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 4. STICKY SECTION HEADER — IN / OUT ANIMATION ────────
  // Each section-header is now a DIRECT CHILD of its section
  // (outside .container), so it spans full viewport width.
  //
  // Logic:
  //   sentinel (invisible 1px div) is inserted at the very top
  //   of each section, BEFORE the section-header.
  //   When sentinel scrolls ABOVE the nav → header sticks → play IN.
  //   When sentinel comes back into view → header unsticks → play OUT.
  function initStickyHeaders() {
    const NAV_H = document.querySelector('.nav')?.offsetHeight || 58;

    document.querySelectorAll('.section-header').forEach(header => {
      const section = header.parentElement; // direct parent = the <section>

      // Sentinel: sits at absolute top of the section
      const sentinel = document.createElement('div');
      sentinel.style.cssText =
        'position:absolute;top:0;left:0;width:1px;height:1px;' +
        'pointer-events:none;visibility:hidden;';
      section.style.position = 'relative';
      section.insertBefore(sentinel, header); // insert before header

      let isCurrentlyStuck = false;

      const io = new IntersectionObserver(
        ([entry]) => {
          const shouldStick = !entry.isIntersecting;

          if (shouldStick && !isCurrentlyStuck) {
            // ── IN: sentinel went above nav → header sticks
            isCurrentlyStuck = true;
            header.classList.remove('is-leaving');
            header.classList.add('is-stuck');

          } else if (!shouldStick && isCurrentlyStuck) {
            // ── OUT: sentinel came back → header unsticks
            isCurrentlyStuck = false;
            header.classList.remove('is-stuck');
            header.classList.add('is-leaving');
            // Remove leaving class after animation completes
            setTimeout(() => header.classList.remove('is-leaving'), 320);
          }
        },
        {
          rootMargin: `-${NAV_H + 1}px 0px 0px 0px`,
          threshold: 0
        }
      );

      io.observe(sentinel);
    });
  }

  // ── 5. HAMBURGER — mobile menu toggle ─────────────────────
  function initHamburger() {
    const btn  = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!btn || !menu) return;

    function openMenu() {
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }

    // Both click and touchend to cover all mobile scenarios
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    // Close on any nav link tap
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Close when tapping outside the nav
    document.addEventListener('click', (e) => {
      const nav = document.querySelector('.nav');
      if (nav && !nav.contains(e.target)) closeMenu();
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
