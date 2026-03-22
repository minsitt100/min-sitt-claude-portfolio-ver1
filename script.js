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

  /* --- iMessage chat animation --- */
  var imsgWindow = document.getElementById('imsgWindow');
  var imsgBody   = document.getElementById('imsgBody');

  if (imsgWindow && imsgBody) {
    var chatStarted = false;

    function showRow(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('imsg-row--hidden');
      el.offsetHeight; // force reflow so animation triggers
      el.classList.add('imsg-row--visible');
      setTimeout(function () {
        imsgBody.scrollTop = imsgBody.scrollHeight;
      }, 40);
    }

    function hideRow(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('imsg-row--hidden');
    }

    function startChat() {
      if (chatStarted) return;
      chatStarted = true;

      // Roylan typing → message
      showRow('imsgTyping0');
      setTimeout(function () {
        hideRow('imsgTyping0');
        showRow('imsgMsg0');

        // Will typing → message
        setTimeout(function () {
          showRow('imsgTyping1');
          setTimeout(function () {
            hideRow('imsgTyping1');
            showRow('imsgMsg1');

            // Vikas typing → message
            setTimeout(function () {
              showRow('imsgTyping2');
              setTimeout(function () {
                hideRow('imsgTyping2');
                showRow('imsgMsg2');

                // My reply
                setTimeout(function () {
                  showRow('imsgReply');
                }, 1000);

              }, 1600);
            }, 600);
          }, 1600);
        }, 700);
      }, 1600);
    }

    var chatObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startChat();
          chatObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });

    chatObserver.observe(imsgWindow);
  }

  /* --- Speech bubble on headshot --- */
  var bubble = document.querySelector('.speech-bubble');
  var photoWrap = document.querySelector('.hero-photo-wrap');

  if (bubble && photoWrap) {
    // Loop: show for 5s, hide for 2s, repeat
    function runBubbleCycle() {
      bubble.classList.remove('is-fading');
      bubble.classList.add('is-visible');

      setTimeout(function () {
        bubble.classList.remove('is-visible');
        bubble.classList.add('is-fading');

        setTimeout(function () {
          bubble.classList.remove('is-fading');
          setTimeout(runBubbleCycle, 2000); // 2s hidden gap
        }, 500); // fade-out duration
      }, 5000); // visible for 5s
    }

    setTimeout(runBubbleCycle, 1000); // initial delay before first show
  }

  /* --- Idle nudge toward work section --- */
  var idleNudge = document.getElementById('idleNudge');
  var workSection = document.getElementById('work');

  if (idleNudge && workSection) {
    var nudgeDismissed = false;
    var nudgeShown = false;

    // Observe when #work enters viewport
    var workObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !nudgeDismissed) {
          nudgeDismissed = true;
          idleNudge.classList.remove('is-visible');
          idleNudge.classList.add('is-dismissed');
          workObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });

    workObserver.observe(workSection);

    // Show nudge after 8s if user hasn't scrolled to work
    setTimeout(function () {
      if (!nudgeDismissed && !nudgeShown) {
        nudgeShown = true;
        idleNudge.classList.add('is-visible');
      }
    }, 8000);

    // Clicking nudge smooth-scrolls and dismisses
    idleNudge.addEventListener('click', function (e) {
      e.preventDefault();
      nudgeDismissed = true;
      idleNudge.classList.remove('is-visible');
      idleNudge.classList.add('is-dismissed');
      var navHeight = document.querySelector('.nav') ? 88 : 0;
      var top = workSection.getBoundingClientRect().top + window.scrollY - navHeight - 24;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* --- Theme toggle --- */
  var themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    function updateToggleLabel() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    updateToggleLabel();

    themeToggleBtn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      }
      updateToggleLabel();
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
