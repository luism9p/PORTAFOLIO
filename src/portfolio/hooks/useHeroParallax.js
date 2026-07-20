import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

// Background lags behind (.hero__bg), content drifts up (.hero__content) —
// scrubbed to scroll position across the hero section's own height.
export function useHeroParallax(heroRef) {
  useGSAP(
    () => {
      const heroBg = gsap.utils.toArray('.hero__bg');
      const heroContent = gsap.utils.toArray('.hero__content');
      if (!heroBg.length && !heroContent.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      if (heroBg.length) tl.to(heroBg, { yPercent: 30, ease: 'none', force3D: true }, 0);
      if (heroContent.length) tl.to(heroContent, { y: -50, ease: 'none', force3D: true }, 0);
    },
    { scope: heroRef }
  );
}
