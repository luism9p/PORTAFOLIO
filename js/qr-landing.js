(function () {
  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  function track(eventName, params) {
    params = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (window.dataLayer) {
      window.dataLayer.push(Object.assign({ event: eventName }, params));
    }
    if (isLocal) {
      console.log('[analytics]', eventName, params);
    }
  }

  // Clicks on any tagged element (the 3 WhatsApp CTAs + footer link).
  document.querySelectorAll('[data-event]').forEach(function (el) {
    el.addEventListener('click', function () {
      track(el.getAttribute('data-event'));
    });
  });

  // Scroll-depth: fires once when the visitor reaches Resultados / Cierre.
  function trackOnceVisible(selector, eventName) {
    var el = document.querySelector(selector);
    if (!el || !('IntersectionObserver' in window)) return;
    var fired = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !fired) {
          fired = true;
          track(eventName);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(el);
  }

  trackOnceVisible('#resultados', 'scroll_resultados');
  trackOnceVisible('#cierre', 'scroll_cierre');

  // Scroll reveal: fade-in + slide-up for whole blocks (hero, resultados),
  // plus the steps container which cascades its 3 children via CSS transition-delay.
  var revealTargets = document.querySelectorAll('.reveal');
  var stepsContainer = document.querySelector('.qr-steps');

  function revealNow(el) {
    el.classList.add('is-visible');
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
    if (stepsContainer) revealObserver.observe(stepsContainer);
  } else {
    // No IntersectionObserver support: just show everything immediately.
    revealTargets.forEach(revealNow);
    if (stepsContainer) revealNow(stepsContainer);
  }

  // Rough time-on-page, sent when the visitor leaves.
  var startedAt = Date.now();
  window.addEventListener('pagehide', function () {
    track('tiempo_en_pagina', { value: Math.round((Date.now() - startedAt) / 1000) });
  });
})();
