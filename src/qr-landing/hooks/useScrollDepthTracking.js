import { useEffect } from 'react';
import { track } from '../lib/analytics';

// Fires an analytics event once when the given ref's element scrolls into view.
export function useScrollDepthTracking(ref, eventName) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;

    let fired = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          track(eventName);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, eventName]);
}
