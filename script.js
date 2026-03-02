/* ============================================
   MIN SITT — PORTFOLIO INTERACTIONS
   ============================================ */

(function () {
  'use strict';

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* --- Scroll-reveal: .fade-up elements --- */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Nav scroll shadow --- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY > 30;
      nav.style.setProperty(
        '--nav-shadow',
        scrolled
          ? '0 8px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)'
          : ''
      );
      lastScroll = window.scrollY;
    }, { passive: true });
  }

  /* --- Smooth anchor scroll for in-page links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navHeight = document.querySelector('.nav') ? 88 : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* --- Testimonials scroll controls --- */
  var testimonialsTrack = document.getElementById('testimonialsTrack');
  var scrollLeftBtn = document.getElementById('testimonialsScrollLeft');
  var scrollRightBtn = document.getElementById('testimonialsScrollRight');

  if (testimonialsTrack && scrollLeftBtn && scrollRightBtn) {
    var cardStep = 396; // card width (380) + gap (16)

    scrollLeftBtn.addEventListener('click', function () {
      testimonialsTrack.scrollBy({ left: -cardStep, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', function () {
      testimonialsTrack.scrollBy({ left: cardStep, behavior: 'smooth' });
    });
  }

  /* --- Active nav link highlight on scroll --- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 120;
      sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var sectionId = section.getAttribute('id');
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(function (link) {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + sectionId ||
              link.getAttribute('href') === 'index.html#' + sectionId
            );
          });
        }
      });
    }, { passive: true });
  }
})();
