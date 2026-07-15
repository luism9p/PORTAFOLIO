(function () {
  var hasGSAP = typeof window.gsap !== 'undefined';

  // Safety net: if GSAP failed to load (CDN blocked, offline, etc.)
  // just reveal everything instantly instead of leaving it hidden.
  if (!hasGSAP) {
    document.querySelectorAll('.logo,.main-nav a,.header-contact').forEach(function (el) {
      el.style.opacity = '1';
    });
    var heroTitleFallback = document.getElementById('heroTitle');
    if (heroTitleFallback) heroTitleFallback.style.opacity = '1';
    var heroImageFallback = document.querySelector('.hero-image');
    if (heroImageFallback) {
      heroImageFallback.style.opacity = '1';
      heroImageFallback.style.transform = 'none';
    }
    return;
  }

  var hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     1. PAGE LOAD SEQUENCE — header + hero headline mask reveal + bg
     ============================================================ */

  function splitHeroTitleIntoLines(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(function (w) { return '<span class="word">' + w + '&nbsp;</span>'; })
      .join('');

    var wordEls = Array.prototype.slice.call(el.querySelectorAll('.word'));
    var lines = [];
    var lastTop = null;

    wordEls.forEach(function (w) {
      var top = w.offsetTop;
      if (top !== lastTop) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1].push(w);
    });

    el.innerHTML = '';
    lines.forEach(function (lineWords) {
      var outer = document.createElement('div');
      outer.className = 'line';
      var inner = document.createElement('div');
      inner.className = 'line-inner';
      lineWords.forEach(function (w) { inner.appendChild(w); });
      outer.appendChild(inner);
      el.appendChild(outer);
    });

    return el.querySelectorAll('.line-inner');
  }

  function runLoadSequence() {
    var heroTitle = document.getElementById('heroTitle');
    var lineInners = heroTitle ? splitHeroTitleIntoLines(heroTitle) : [];
    if (heroTitle) heroTitle.style.opacity = '1';

    var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Header: logo + nav links fade in with a slight downward-to-rest slide, staggered.
    tl.fromTo('.logo', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
      .fromTo('.main-nav a', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.1)
      .fromTo('.header-contact', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.4);

    // Hero headline: masked lines slide up from y:100% -> 0% with expo.out.
    if (lineInners.length) {
      tl.to(lineInners, {
        y: '0%',
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.12
      }, 0.15);
    }

    // Background image: slow fade-in coupled with a subtle zoom-out.
    tl.to('.hero-image', {
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: 'power2.out'
    }, 0.1);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runLoadSequence).catch(runLoadSequence);
  } else {
    runLoadSequence();
  }

  /* ============================================================
     1b. Hero parallax on scroll — bg lags behind, content drifts up
     ============================================================ */

  if (hasScrollTrigger) {
    var heroSection = document.querySelector('.hero');
    var heroBg = document.querySelectorAll('.hero__bg');
    var heroContent = document.querySelectorAll('.hero__content');

    if (heroSection && (heroBg.length || heroContent.length)) {
      var parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      if (heroBg.length) {
        parallaxTl.to(heroBg, { yPercent: 30, ease: 'none', force3D: true }, 0);
      }
      if (heroContent.length) {
        parallaxTl.to(heroContent, { y: -50, ease: 'none', force3D: true }, 0);
      }
    }
  }

  /* ============================================================
     2. "SELECTED WORKS" scroll-triggered glitch reveal
     ============================================================ */

  var worksWrap = document.getElementById('worksTitleWrap');
  if (worksWrap) {
    var worksTitle = document.getElementById('worksTitle');
    var glitchBlocks = worksWrap.querySelectorAll('.glitch-block');
    var glitchBanner = document.getElementById('glitchBanner');

    // Randomize block geometry once, up front, for a chaotic scanline look.
    glitchBlocks.forEach(function (block) {
      var isBar = Math.random() > 0.5;
      block.style.top = Math.random() * 80 + '%';
      block.style.left = Math.random() * 70 + '%';
      block.style.width = isBar ? (40 + Math.random() * 55) + '%' : (15 + Math.random() * 30) + '%';
      block.style.height = isBar ? (4 + Math.random() * 10) + '%' : (10 + Math.random() * 25) + '%';
    });

    gsap.set(worksTitle, { color: '#000000' });

    function playGlitch() {
      gsap.timeline()
        .set(glitchBlocks, { opacity: 0 })
        .set(glitchBanner, { opacity: 0 })
        // Rapid random flicker of neon blocks — digital interference feel.
        .to(glitchBlocks, {
          opacity: function () { return Math.random() > 0.45 ? 1 : 0; },
          duration: 0.035,
          repeat: 9,
          repeatRefresh: true,
          ease: 'none',
          stagger: { each: 0.018, from: 'random' }
        }, 0)
        // "WE BUILD INTERFACE" poster flashes for ~0.2s.
        .to(glitchBanner, { opacity: 1, duration: 0.03, ease: 'none' }, 0.16)
        .to(glitchBanner, { opacity: 0, duration: 0.03, ease: 'none' }, 0.36)
        // Blocks fall away like a glitch clearing.
        .to(glitchBlocks, { opacity: 0, duration: 0.12, ease: 'power1.out' }, 0.42)
        // Text resolves clean and legible.
        .to(worksTitle, { color: '#ffffff', duration: 0.25, ease: 'power2.out' }, 0.46);
    }

    if (hasScrollTrigger) {
      ScrollTrigger.create({
        trigger: worksWrap,
        start: 'top 75%',
        once: true,
        onEnter: playGlitch
      });
    } else if ('IntersectionObserver' in window) {
      // Fallback if the ScrollTrigger CDN failed to load.
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playGlitch();
            observer.disconnect();
          }
        });
      }, { threshold: 0.25 });
      observer.observe(worksWrap);
    } else {
      playGlitch();
    }
  }

  /* ============================================================
     3. Project hover tracking with lerp-smoothed cursor follow
     ============================================================ */

  var worksSection = document.getElementById('works');
  var tracker = document.getElementById('workTracker');

  if (worksSection && tracker && window.matchMedia('(min-width: 1001px)').matches) {
    var previews = tracker.querySelectorAll('.work-preview');
    var workRows = document.querySelectorAll('.work-row');
    var offsetX = 26;
    var offsetY = -135;
    var lerpAmount = 0.15;

    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var rafId = null;
    var initialized = false;

    function loop() {
      current.x += (target.x - current.x) * lerpAmount;
      current.y += (target.y - current.y) * lerpAmount;
      tracker.style.transform = 'translate(' + current.x + 'px, ' + current.y + 'px)';
      rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
      if (rafId === null) rafId = requestAnimationFrame(loop);
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    worksSection.addEventListener('mousemove', function (e) {
      target.x = e.clientX + offsetX;
      target.y = e.clientY + offsetY;
      if (!initialized) {
        current.x = target.x;
        current.y = target.y;
        initialized = true;
      }
      startLoop();
    });

    worksSection.addEventListener('mouseleave', function () {
      tracker.style.opacity = '0';
      stopLoop();
      initialized = false;
    });

    workRows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var index = row.dataset.work;
        tracker.style.opacity = '1';
        previews.forEach(function (p) {
          p.classList.toggle('active', p.dataset.preview === index);
        });
      });
    });
  }
})();
