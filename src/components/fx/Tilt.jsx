import React, { useRef, useCallback } from 'react';

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 3D tilt wrapper: card rotates toward the cursor, with a moving glare.
 * Only active on devices with a real pointer; no-op on touch / reduced motion.
 */
export const Tilt = ({ children, max = 9, scale = 1.02, className = '', style }) => {
  const ref = useRef(null);
  const raf = useRef(0);

  const onMove = useCallback((e) => {
    if (!canHover()) return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      el.style.setProperty('--ts', scale);
    });
  }, [max, scale]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--ts', 1);
  }, []);

  return (
    <div className={`tilt-wrap ${className}`} style={style}>
      <div ref={ref} className="tilt-inner" onMouseMove={onMove} onMouseLeave={onLeave}>
        {children}
        <span className="tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
};
