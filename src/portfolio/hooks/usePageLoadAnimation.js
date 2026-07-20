import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

// Header logo/nav/contact staggered fade+slide, hero background fade+scale.
// Unscoped (global selectors) to match the original — targets span across
// Header and Hero, two separate components.
export function usePageLoadAnimation() {
  useGSAP(() => {
    let cancelled = false;

    function run() {
      if (cancelled) return;
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo('.logo', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
        .fromTo('.main-nav a', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.1)
        .fromTo('.header-contact', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.4);

      tl.to('.hero-image', { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, 0.1);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }

    return () => {
      cancelled = true;
    };
  }, []);
}
