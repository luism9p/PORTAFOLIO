import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

// Hero background fade+scale on load. Used to also fade in the old
// Header's logo/nav/contact — removed along with Header/MobileNav when
// BubbleMenu took over navigation (it has its own open/close animation,
// no load-in treatment needed for two floating bubbles).
export function usePageLoadAnimation() {
  useGSAP(() => {
    let cancelled = false;

    function run() {
      if (cancelled) return;
      gsap.to('.hero-image', { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' });
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
