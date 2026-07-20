import { useEffect } from 'react';

// Desktop-only (>=1001px), floating preview image trails the cursor with a
// lerp-smoothed rAF loop instead of snapping 1:1 to mouse position.
export function useLerpCursorPreview({
  sectionRef,
  trackerRef,
  offsetX = 26,
  offsetY = -135,
  lerpAmount = 0.15,
}) {
  useEffect(() => {
    const section = sectionRef.current;
    const tracker = trackerRef.current;
    if (!section || !tracker) return undefined;

    const mql = window.matchMedia('(min-width: 1001px)');
    let enabled = mql.matches;

    const previews = tracker.querySelectorAll('.work-preview');
    const workRows = section.querySelectorAll('.work-row');

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId = null;
    let initialized = false;

    function loop() {
      current.x += (target.x - current.x) * lerpAmount;
      current.y += (target.y - current.y) * lerpAmount;
      tracker.style.transform = `translate(${current.x}px, ${current.y}px)`;
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

    function handleMouseMove(e) {
      if (!enabled) return;
      target.x = e.clientX + offsetX;
      target.y = e.clientY + offsetY;
      if (!initialized) {
        current.x = target.x;
        current.y = target.y;
        initialized = true;
      }
      startLoop();
    }

    function handleMouseLeave() {
      if (!enabled) return;
      tracker.style.opacity = '0';
      stopLoop();
      initialized = false;
    }

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    const rowHandlers = Array.from(workRows).map((row) => {
      function handler() {
        if (!enabled) return;
        const index = row.dataset.work;
        tracker.style.opacity = '1';
        previews.forEach((p) => p.classList.toggle('active', p.dataset.preview === index));
      }
      row.addEventListener('mouseenter', handler);
      return { row, handler };
    });

    // Small upgrade over the original: react to crossing the 1001px breakpoint
    // (e.g. resize, tablet rotation) instead of only checking once at mount.
    function handleMqlChange(e) {
      enabled = e.matches;
      if (!enabled) {
        tracker.style.opacity = '0';
        stopLoop();
        initialized = false;
      }
    }
    mql.addEventListener('change', handleMqlChange);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      rowHandlers.forEach(({ row, handler }) => row.removeEventListener('mouseenter', handler));
      mql.removeEventListener('change', handleMqlChange);
      stopLoop();
    };
  }, [sectionRef, trackerRef, offsetX, offsetY, lerpAmount]);
}
