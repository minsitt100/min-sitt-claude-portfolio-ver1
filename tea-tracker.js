/* ============================================
   BURMESE MILK TEA PROGRESS TRACKER
   Tracks visited case study pages and fills a
   tea glass proportionally.

   TO ADD NEW PAGES: add an entry to PAGES and
   increment TOTAL_PAGES. Each page = 100/TOTAL_PAGES %.
   Home (index) intentionally does NOT count.
   ============================================ */
(function () {
  'use strict';

  // ---- CONFIG ----
  // Update PAGES and TOTAL_PAGES whenever a new case study is added.
  // Each visited page fills: Math.round(100 / TOTAL_PAGES) percent.
  var PAGES = {
    '/case-study-1.html': 'cs1',
    '/case-study-2.html': 'cs2',
    '/case-study-3.html': 'cs3',
    '/case-study-5.html': 'cs5'
  };
  var TOTAL_PAGES = 4; // Must equal number of entries in PAGES above
  var STORAGE_KEY = 'tea_v2'; // bumped to clear old dev data

  // ---- STORAGE ----
  function getVisited() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function markVisited(pageId) {
    var visited = getVisited();
    visited[pageId] = true;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(visited)); }
    catch (e) {}
    return visited;
  }

  function getProgress(visited) {
    return Math.min(Math.round((Object.keys(visited).length / TOTAL_PAGES) * 100), 100);
  }

  // ---- PAGE DETECTION ----
  function getCurrentPageId() {
    var path = window.location.pathname;
    if (PAGES[path]) return PAGES[path];
    var filename = '/' + path.split('/').pop();
    return PAGES[filename] || null;
  }

  // ---- BUILD WIDGET HTML ----
  function createWidget() {
    var wrap = document.createElement('div');
    wrap.className = 'tea-tracker-wrap';
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-label', 'Portfolio exploration progress');

    wrap.innerHTML =
      '<div class="tea-tracker-pill">' +
        '<div class="tea-pill-icon">' +
        '<svg class="tea-tracker__glass" viewBox="0 0 56 90" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="tg-fill" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#C68E5B"/>' +
              '<stop offset="45%" stop-color="#A0714F"/>' +
              '<stop offset="100%" stop-color="#7B4F30"/>' +
            '</linearGradient>' +
            '<linearGradient id="tg-cream" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#F5E6D0"/>' +
              '<stop offset="100%" stop-color="#D4A574" stop-opacity="0"/>' +
            '</linearGradient>' +
            '<clipPath id="tg-clip">' +
              '<path d="M10 12 L8 72 Q8 80 16 80 L40 80 Q48 80 48 72 L46 12 Z"/>' +
            '</clipPath>' +
          '</defs>' +
          /* Glass outline */
          '<path d="M10 12 L8 72 Q8 80 16 80 L40 80 Q48 80 48 72 L46 12 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>' +
          /* Clipped liquid area */
          '<g clip-path="url(#tg-clip)">' +
            '<rect id="tg-liquid" x="6" y="80" width="44" height="0" fill="url(#tg-fill)"/>' +
            '<rect id="tg-cream" x="6" y="80" width="44" height="6" fill="url(#tg-cream)" opacity="0"/>' +
            '<path class="tea-wave" id="tg-wave1" d="" fill="#C68E5B" opacity="0.5"/>' +
            '<path class="tea-wave tea-wave--slow" id="tg-wave2" d="" fill="#D4A574" opacity="0.3"/>' +
          '</g>' +
          /* Glass rim */
          '<rect x="7" y="10" width="42" height="4" rx="2" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.28)" stroke-width="0.8"/>' +
          /* Glass shine */
          '<rect x="14" y="16" width="3" height="48" rx="1.5" fill="rgba(255,255,255,0.11)"/>' +
        '</svg>' +
        '<span class="tea-tracker__label" id="tg-pct">0%</span>' +
      '</div>' +  // closes .tea-pill-icon
      '<div class="tea-character-group">' +
        '<img class="tea-character" src="assets/IMG_3517.png" alt="Min Sitt" />' +
        '<div class="tea-msg-wrap">' +
          '<span class="tea-speaker-name">Min Sitt:</span>' +
          '<p class="tea-status-msg" id="tg-msg">Explore more of the portfolio to fill up the glass with La Phet Yae (Burmese Milk Tea). Current: <strong id="tg-msg-pct">0%</strong></p>' +
        '</div>' +
      '</div>' +  // closes .tea-character-group
      '</div>';   // closes .tea-tracker-pill

    return wrap;
  }

  // ---- UPDATE FILL (called each animation frame) ----
  function updateFill(widget, progress) {
    var GLASS_TOP = 12;
    var GLASS_BOTTOM = 80;
    var maxH = GLASS_BOTTOM - GLASS_TOP;       // 68 viewBox units
    var fillH = (progress / 100) * maxH;
    var fillY = GLASS_BOTTOM - fillH;          // liquid surface y-position
    var wY   = fillY - 2;                      // wave surface (2px above liquid)

    var liquid = widget.querySelector('#tg-liquid');
    var cream  = widget.querySelector('#tg-cream');
    var wave1  = widget.querySelector('#tg-wave1');
    var wave2  = widget.querySelector('#tg-wave2');
    var pct    = widget.querySelector('#tg-pct');
    var msgPct = widget.querySelector('#tg-msg-pct');
    if (liquid) {
      liquid.setAttribute('y', String(fillY));
      liquid.setAttribute('height', String(fillH));
    }

    if (cream) {
      cream.setAttribute('y', String(fillY - 3));
      cream.setAttribute('opacity', progress > 0 ? '0.7' : '0');
    }

    // Wave paths hug the liquid surface
    var w1d = 'M6 ' + wY + ' Q14 ' + (wY - 2) + ' 20 ' + wY + ' Q28 ' + (wY + 2) + ' 34 ' + wY + ' Q42 ' + (wY - 2) + ' 50 ' + wY + ' L50 ' + (wY + 4) + ' L6 ' + (wY + 4) + ' Z';
    var w2d = 'M6 ' + wY + ' Q12 ' + (wY + 2) + ' 20 ' + wY + ' Q30 ' + (wY - 2) + ' 38 ' + wY + ' Q46 ' + (wY + 2) + ' 50 ' + wY + ' L50 ' + (wY + 4) + ' L6 ' + (wY + 4) + ' Z';
    if (wave1) wave1.setAttribute('d', w1d);
    if (wave2) wave2.setAttribute('d', w2d);

    if (pct)    pct.textContent    = progress + '%';
    if (msgPct) msgPct.textContent = progress + '%';

    // Swap message text at 100%
    var msg = widget.querySelector('#tg-msg');
    if (msg) {
      if (progress >= 100) {
        msg.innerHTML = 'Thank you for checking out my whole portfolio! Current: <strong id="tg-msg-pct">100%</strong>';
      } else {
        msg.innerHTML = 'Explore more of the portfolio to fill up the glass with La Phet Yae (Burmese Milk Tea). Current: <strong id="tg-msg-pct">' + progress + '%</strong>';
      }
    }

  }

  // ---- ANIMATE FILL (smooth rAF interpolation) ----
  function animateFill(widget, fromPct, toPct) {
    if (fromPct === toPct) { updateFill(widget, toPct); return; }
    var start = null;
    var duration = 900;

    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - t, 3);
      var current = Math.round(fromPct + (toPct - fromPct) * eased);
      updateFill(widget, current);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- CELEBRATE ----
  function celebrate(widget) {
    var char = widget.querySelector('.tea-character');
    if (!char) return;
    char.classList.add('tea-character--celebrate');
    setTimeout(function () { char.classList.remove('tea-character--celebrate'); }, 700);
  }

  // ---- INIT ----
  function init() {
    var navLeft = document.querySelector('.nav-left');
    if (!navLeft) return;

    var pageId      = getCurrentPageId();
    var prevVisited = getVisited();
    var prevPct     = getProgress(prevVisited);

    var newPct = prevPct;
    if (pageId) {
      var visited = markVisited(pageId);
      newPct = getProgress(visited);
    }

    var widget = createWidget();
    navLeft.appendChild(widget);

    // Set initial state immediately (no animation)
    updateFill(widget, prevPct);

    // Animate to new progress level if it increased
    if (newPct > prevPct) {
      setTimeout(function () {
        animateFill(widget, prevPct, newPct);
        celebrate(widget);
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
