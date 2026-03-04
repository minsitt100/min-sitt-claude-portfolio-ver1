/* ============================================
   BURMESE MILK TEA PROGRESS TRACKER
   Tracks which portfolio pages the visitor has seen
   and fills a tea glass accordingly.
   ============================================ */
(function () {
  'use strict';

  // ---- CONFIG ----
  var PAGES = {
    '/': 'home',
    '/index.html': 'home',
    '/case-study-1.html': 'cs1',
    '/case-study-2.html': 'cs2',
    '/case-study-3.html': 'cs3',
    '/case-study-4.html': 'cs4',
    '/case-study-5.html': 'cs5'
  };
  var TOTAL_PAGES = 6; // home + 5 case studies
  var STORAGE_KEY = 'tea_visited';

  // ---- STATE ----
  function getVisited() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function markVisited(pageId) {
    var visited = getVisited();
    visited[pageId] = true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
    } catch (e) { /* storage full or unavailable */ }
    return visited;
  }

  function getProgress(visited) {
    var count = Object.keys(visited).length;
    return Math.min(Math.round((count / TOTAL_PAGES) * 100), 100);
  }

  // ---- DETECT CURRENT PAGE ----
  function getCurrentPageId() {
    var path = window.location.pathname;
    // Handle trailing slashes and root paths
    if (path === '/' || path === '' || path.endsWith('/index.html')) {
      return 'home';
    }
    // Try exact match first
    if (PAGES[path]) return PAGES[path];
    // Try filename only (for subdirectory deployments)
    var filename = '/' + path.split('/').pop();
    return PAGES[filename] || null;
  }

  // ---- BUILD THE WIDGET ----
  function createWidget() {
    var wrapper = document.createElement('div');
    wrapper.className = 'tea-tracker';
    wrapper.setAttribute('role', 'status');
    wrapper.setAttribute('aria-label', 'Portfolio exploration progress');

    wrapper.innerHTML =
      '<div class="tea-tracker__tooltip">Brew your journey!</div>' +
      '<div class="tea-tracker__scene">' +
        '<!-- Character -->' +
        '<div class="tea-character">' +
          '<svg class="tea-character__body" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Body -->' +
            '<ellipse cx="18" cy="24" rx="10" ry="8" fill="#D4A574"/>' +
            '<!-- Head -->' +
            '<circle cx="18" cy="13" r="10" fill="#E8C9A0"/>' +
            '<!-- Cheeks -->' +
            '<circle cx="11" cy="15" r="2.5" fill="#F0B8A0" opacity="0.6"/>' +
            '<circle cx="25" cy="15" r="2.5" fill="#F0B8A0" opacity="0.6"/>' +
            '<!-- Eyes -->' +
            '<g class="tea-character__eyes">' +
              '<ellipse cx="14" cy="12" rx="1.5" ry="1.8" fill="#3D2B1F"/>' +
              '<ellipse cx="22" cy="12" rx="1.5" ry="1.8" fill="#3D2B1F"/>' +
              '<!-- Eye shine -->' +
              '<circle cx="14.7" cy="11.2" r="0.6" fill="#FFF"/>' +
              '<circle cx="22.7" cy="11.2" r="0.6" fill="#FFF"/>' +
            '</g>' +
            '<!-- Mouth (happy curve) -->' +
            '<path class="tea-character__mouth" d="M15 17 Q18 19 21 17" stroke="#3D2B1F" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
            '<!-- Little hat / beret -->' +
            '<ellipse cx="18" cy="5" rx="8" ry="3" fill="#8B5E3C"/>' +
            '<rect x="12" y="3" width="12" height="4" rx="2" fill="#A0714F"/>' +
          '</svg>' +
        '</div>' +
        '<!-- Steam (visible at 100%) -->' +
        '<div class="tea-steam">' +
          '<svg width="30" height="18" viewBox="0 0 30 18" fill="none">' +
            '<path class="steam-wisp" d="M8 16 Q6 10 8 6 Q10 2 8 0" stroke="#D4A574" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>' +
            '<path class="steam-wisp" d="M15 16 Q13 10 15 6 Q17 2 15 0" stroke="#D4A574" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>' +
            '<path class="steam-wisp" d="M22 16 Q20 10 22 6 Q24 2 22 0" stroke="#D4A574" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>' +
          '</svg>' +
        '</div>' +
        '<!-- Glass -->' +
        '<svg class="tea-tracker__glass" viewBox="0 0 56 90" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<!-- Tea gradient -->' +
            '<linearGradient id="teaGrad" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#C68E5B"/>' +
              '<stop offset="40%" stop-color="#A0714F"/>' +
              '<stop offset="100%" stop-color="#7B4F30"/>' +
            '</linearGradient>' +
            '<!-- Cream swirl at top -->' +
            '<linearGradient id="creamGrad" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#F5E6D0"/>' +
              '<stop offset="100%" stop-color="#D4A574" stop-opacity="0"/>' +
            '</linearGradient>' +
            '<!-- Glass shape clip -->' +
            '<clipPath id="glassClip">' +
              '<path d="M10 12 L8 72 Q8 80 16 80 L40 80 Q48 80 48 72 L46 12 Z"/>' +
            '</clipPath>' +
          '</defs>' +
          '<!-- Glass body (transparent look) -->' +
          '<path d="M10 12 L8 72 Q8 80 16 80 L40 80 Q48 80 48 72 L46 12 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>' +
          '<!-- Tea liquid (clipped to glass) -->' +
          '<g clip-path="url(#glassClip)">' +
            '<!-- Main tea body -->' +
            '<rect class="tea-liquid" id="teaFill" x="6" y="80" width="44" height="0" fill="url(#teaGrad)"/>' +
            '<!-- Cream layer at top of liquid -->' +
            '<rect class="tea-liquid tea-cream" id="teaCream" x="6" y="80" width="44" height="6" fill="url(#creamGrad)" opacity="0.7"/>' +
            '<!-- Wave surface -->' +
            '<path class="tea-wave" id="teaWave1" d="M6 80 Q14 78 20 80 Q28 82 34 80 Q42 78 50 80 L50 84 L6 84 Z" fill="#C68E5B" opacity="0.5"/>' +
            '<path class="tea-wave tea-wave--slow" id="teaWave2" d="M6 80 Q12 82 20 80 Q30 78 38 80 Q46 82 50 80 L50 84 L6 84 Z" fill="#D4A574" opacity="0.3"/>' +
          '</g>' +
          '<!-- Glass rim -->' +
          '<rect x="7" y="10" width="42" height="4" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>' +
          '<!-- Glass shine -->' +
          '<rect x="14" y="16" width="3" height="50" rx="1.5" fill="rgba(255,255,255,0.12)"/>' +
        '</svg>' +
      '</div>' +
      '<span class="tea-tracker__label" id="teaLabel">0%</span>';

    return wrapper;
  }

  // ---- UPDATE FILL LEVEL ----
  function updateFill(widget, progress, animate) {
    var glassTop = 12;
    var glassBottom = 80;
    var maxHeight = glassBottom - glassTop;
    var fillHeight = (progress / 100) * maxHeight;
    var fillY = glassBottom - fillHeight;

    var teaFill = widget.querySelector('#teaFill');
    var teaCream = widget.querySelector('#teaCream');
    var wave1 = widget.querySelector('#teaWave1');
    var wave2 = widget.querySelector('#teaWave2');
    var label = widget.querySelector('#teaLabel');
    var tooltip = widget.querySelector('.tea-tracker__tooltip');

    if (teaFill) {
      teaFill.setAttribute('y', String(fillY));
      teaFill.setAttribute('height', String(fillHeight));
    }

    if (teaCream && progress > 0) {
      teaCream.setAttribute('y', String(fillY - 3));
      teaCream.setAttribute('height', '6');
      teaCream.style.opacity = '0.7';
    }

    // Move waves to surface
    if (wave1) {
      var waveY = fillY - 2;
      wave1.setAttribute('d',
        'M6 ' + waveY + ' Q14 ' + (waveY - 2) + ' 20 ' + waveY +
        ' Q28 ' + (waveY + 2) + ' 34 ' + waveY +
        ' Q42 ' + (waveY - 2) + ' 50 ' + waveY +
        ' L50 ' + (waveY + 4) + ' L6 ' + (waveY + 4) + ' Z'
      );
    }

    if (wave2) {
      var waveY2 = fillY - 2;
      wave2.setAttribute('d',
        'M6 ' + waveY2 + ' Q12 ' + (waveY2 + 2) + ' 20 ' + waveY2 +
        ' Q30 ' + (waveY2 - 2) + ' 38 ' + waveY2 +
        ' Q46 ' + (waveY2 + 2) + ' 50 ' + waveY2 +
        ' L50 ' + (waveY2 + 4) + ' L6 ' + (waveY2 + 4) + ' Z'
      );
    }

    if (label) {
      label.textContent = progress + '%';
    }

    // Update tooltip message
    if (tooltip) {
      if (progress === 0) {
        tooltip.textContent = 'Brew your journey!';
      } else if (progress < 50) {
        tooltip.textContent = 'Keep exploring! ' + progress + '% brewed';
      } else if (progress < 100) {
        tooltip.textContent = 'Almost there! ' + progress + '% brewed';
      } else {
        tooltip.textContent = 'Fully brewed! Enjoy the tea!';
      }
    }

    // Update mouth based on progress (wider smile)
    var mouth = widget.querySelector('.tea-character__mouth');
    if (mouth) {
      if (progress < 33) {
        mouth.setAttribute('d', 'M15 17 Q18 18.5 21 17');
      } else if (progress < 66) {
        mouth.setAttribute('d', 'M15 17 Q18 20 21 17');
      } else {
        mouth.setAttribute('d', 'M14 16 Q18 21 22 16');
      }
    }

    // Set progress data attribute for CSS hooks
    widget.setAttribute('data-progress', String(progress));
  }

  // ---- CELEBRATION ANIMATION ----
  function celebrate(widget) {
    var character = widget.querySelector('.tea-character');
    if (!character) return;
    character.classList.add('tea-character--celebrate');
    setTimeout(function () {
      character.classList.remove('tea-character--celebrate');
    }, 700);
  }

  // ---- INIT ----
  function init() {
    var pageId = getCurrentPageId();
    if (!pageId) return; // Not a tracked page

    var prevVisited = getVisited();
    var prevProgress = getProgress(prevVisited);

    var visited = markVisited(pageId);
    var progress = getProgress(visited);

    var widget = createWidget();
    document.body.appendChild(widget);

    // Set initial state (before animation)
    updateFill(widget, prevProgress, false);

    // If progress increased, animate after a short delay
    if (progress > prevProgress) {
      setTimeout(function () {
        updateFill(widget, progress, true);
        celebrate(widget);
      }, 600);
    } else {
      updateFill(widget, progress, false);
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
