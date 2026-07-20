import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll-triggered "digital interference" reveal on the works section title.
// Falls back to IntersectionObserver if ScrollTrigger.create ever throws —
// cheap defensive net even though ScrollTrigger is now a direct npm import.
export function useWorksGlitch(wrapRef) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const worksTitle = wrap.querySelector('.works-title');
    const glitchBlocks = wrap.querySelectorAll('.glitch-block');
    const glitchBanner = wrap.querySelector('.glitch-banner');

    glitchBlocks.forEach((block) => {
      const isBar = Math.random() > 0.5;
      block.style.top = Math.random() * 80 + '%';
      block.style.left = Math.random() * 70 + '%';
      block.style.width = (isBar ? 40 + Math.random() * 55 : 15 + Math.random() * 30) + '%';
      block.style.height = (isBar ? 4 + Math.random() * 10 : 10 + Math.random() * 25) + '%';
    });

    gsap.set(worksTitle, { color: '#000000' });

    function playGlitch() {
      gsap
        .timeline()
        .set(glitchBlocks, { opacity: 0 })
        .set(glitchBanner, { opacity: 0 })
        .to(
          glitchBlocks,
          {
            opacity: () => (Math.random() > 0.45 ? 1 : 0),
            duration: 0.035,
            repeat: 9,
            repeatRefresh: true,
            ease: 'none',
            stagger: { each: 0.018, from: 'random' },
          },
          0
        )
        .to(glitchBanner, { opacity: 1, duration: 0.03, ease: 'none' }, 0.16)
        .to(glitchBanner, { opacity: 0, duration: 0.03, ease: 'none' }, 0.36)
        .to(glitchBlocks, { opacity: 0, duration: 0.12, ease: 'power1.out' }, 0.42)
        .to(worksTitle, { color: '#ffffff', duration: 0.25, ease: 'power2.out' }, 0.46);
    }

    let scrollTriggerInstance;
    let observer;

    try {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 75%',
        once: true,
        onEnter: playGlitch,
      });
    } catch (e) {
      scrollTriggerInstance = null;
    }

    if (!scrollTriggerInstance) {
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                playGlitch();
                observer.disconnect();
              }
            });
          },
          { threshold: 0.25 }
        );
        observer.observe(wrap);
      } else {
        playGlitch();
      }
    }

    return () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      if (observer) observer.disconnect();
    };
  }, [wrapRef]);
}
