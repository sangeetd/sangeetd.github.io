/* ============================================================
   SANGEET DAS — RESUME  |  main.js
   ============================================================ */

(function () {
  'use strict';

  // ── 1. FOOTER TIMESTAMP ───────────────────────────────────
  // Uses document.lastModified so it always reflects the last
  // time the HTML file was actually updated and deployed.
  function setFooterTimestamp() {
    const el = document.getElementById('last-updated');
    if (!el) return;

    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const d = new Date(document.lastModified);

    // Fallback to today if lastModified is epoch-zero (some servers return it that way)
    const date = (d.getFullYear() > 2000) ? d : new Date();

    el.textContent =
      'Last updated: ' +
      days[date.getDay()] + ', ' +
      date.getDate() + ' ' +
      months[date.getMonth()] + '. ' +
      date.getFullYear();
  }

  // ── 2. SCROLL REVEAL ──────────────────────────────────────
  // Stagger siblings within the same parent container.
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Find siblings with .reveal in the same parent
          const siblings = Array.from(
            el.parentElement.querySelectorAll(':scope > .reveal, .reveal')
          ).filter(s => s.parentElement === el.parentElement);
          const idx = siblings.indexOf(el);
          const delay = idx * 72; // ms stagger
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── 3. ACTIVE NAV SECTION HIGHLIGHTING ───────────────────
  // Watches each section; when it's in view the matching nav
  // link gets .nav-active — both desktop and mobile menus.
  function initActiveNav() {
    const sections  = document.querySelectorAll('main section[id]');
    const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
    const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    function setActive(id) {
      [...navLinks, ...mobileLinks].forEach(a => {
        const matches = a.getAttribute('href') === '#' + id;
        a.classList.toggle('nav-active', matches);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio that is intersecting
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) setActive(visible[0].target.id);
      },
      {
        // Trigger when section occupies the middle 40% of the viewport
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.1, 0.2, 0.5, 1.0],
      }
    );

    sections.forEach(s => observer.observe(s));
  }

  // ── 4. STICKY SECTION HEADER DETECTION ───────────────────
  // Adds .is-stuck to .section-header when it transitions from
  // its natural position to its sticky position, so CSS can
  // apply a visual separator.
  function initStickyHeaders() {
    const headers = document.querySelectorAll('.section-header');
    if (!headers.length) return;

    // Use a sentinel element just above each header to detect sticking
    headers.forEach(header => {
      const sentinel = document.createElement('div');
      sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
      header.parentElement.style.position = 'relative';
      header.parentElement.insertBefore(sentinel, header);

      const obs = new IntersectionObserver(
        ([entry]) => {
          header.classList.toggle('is-stuck', !entry.isIntersecting);
        },
        { rootMargin: '-58px 0px 0px 0px', threshold: 0 }
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
      menu.hidden = isOpen; // toggle: if was open, now hide; if was closed, now show
    });

    // Close on any mobile link click (including Contact mailto)
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── 6. SMART NAV HIDE ON SCROLL ──────────────────────────
  // Hides nav when scrolling down quickly; reveals on scroll up.
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Only hide nav after scrolled past 100px and moving down
        if (y > lastY && y > 100) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  // ── INIT ──────────────────────────────────────────────────
  function init() {
    setFooterTimestamp();
    initReveal();
    initActiveNav();
    initStickyHeaders();
    initHamburger();
    initNavScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
