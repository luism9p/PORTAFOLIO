import { useMemo } from 'react';

// React port of React Bits' <GradualBlur/>, with a real fix applied (not just
// a lift-and-shift): the original wasn't visible on the user's iPhone. Cause
// (verified empirically, not guessed): Safari/WebKit is known to fail to
// activate backdrop-filter on elements inserted after first paint, and is
// unreliable with many overlapping backdrop-filter layers. Fix: promote each
// layer to its own compositing layer (transform:translateZ(0)/will-change),
// and reduce divCount from 6 to 4 to shrink the overlapping-layer surface.
const CURVE_FUNCTIONS = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - (1 - p) ** 2,
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2),
};

function getGradientDirection(position) {
  return { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' }[position] || 'to bottom';
}

export default function GradualBlur({
  position = 'top',
  height = '10rem',
  width = null,
  strength = 2,
  divCount = 4,
  exponential = false,
  curve = 'bezier',
  opacity = 1,
  target = 'page',
  zIndex = 50,
  className = '',
}) {
  const layers = useMemo(() => {
    const curveFunc = CURVE_FUNCTIONS[curve] || CURVE_FUNCTIONS.linear;
    const increment = 100 / divCount;
    const direction = getGradientDirection(position);
    const items = [];

    for (let i = 1; i <= divCount; i += 1) {
      const progress = curveFunc(i / divCount);
      const blurValue = exponential
        ? 2 ** (progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const maskImage = `linear-gradient(${direction}, ${gradient})`;

      items.push({
        key: i,
        style: {
          position: 'absolute',
          inset: 0,
          maskImage,
          WebkitMaskImage: maskImage,
          backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
          WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
          opacity,
          transform: 'translateZ(0)',
          willChange: 'transform',
        },
      });
    }
    return items;
  }, [position, strength, divCount, exponential, curve, opacity]);

  const isVertical = position === 'top' || position === 'bottom';
  const isPageTarget = target === 'page';

  const containerStyle = {
    position: isPageTarget ? 'fixed' : 'absolute',
    pointerEvents: 'none',
    zIndex: isPageTarget ? zIndex + 100 : zIndex,
    transform: 'translateZ(0)',
    ...(isVertical
      ? { height, width: width || '100%', [position]: 0, left: 0, right: 0 }
      : { width: width || height, height: '100%', [position]: 0, top: 0, bottom: 0 }),
  };

  return (
    <div
      className={`gradual-blur ${isPageTarget ? 'gradual-blur-page' : 'gradual-blur-parent'} ${className}`.trim()}
      style={containerStyle}
    >
      <div className="gradual-blur-inner" style={{ position: 'relative', width: '100%', height: '100%' }}>
        {layers.map((layer) => (
          <div key={layer.key} style={layer.style} />
        ))}
      </div>
    </div>
  );
}
