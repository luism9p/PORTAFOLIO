import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Vanilla-to-React port of the typewriter effect: types a single static string
// once (no delete/loop, this is a permanent headline), cursor blink via GSAP.
export function useTypewriter(
  text,
  { typingSpeed = 45, variableSpeed = null, initialDelay = 300 } = {}
) {
  const [count, setCount] = useState(0);
  const cursorRef = useRef(null);

  useEffect(() => {
    let timeoutId;
    let i = 0;

    function nextDelay() {
      if (!variableSpeed) return typingSpeed;
      return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
    }

    function step() {
      if (i < text.length) {
        i += 1;
        setCount(i);
        timeoutId = setTimeout(step, nextDelay());
      }
    }

    setCount(0);
    timeoutId = setTimeout(step, initialDelay);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return undefined;
    gsap.set(cursor, { opacity: 1 });
    const tween = gsap.to(cursor, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });
    return () => tween.kill();
  }, []);

  return { displayedText: text.slice(0, count), cursorRef };
}
