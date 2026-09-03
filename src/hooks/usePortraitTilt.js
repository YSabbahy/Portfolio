import { useRef } from "react";

/**
 * Reproduces the hero portrait's pointer-follow 3D tilt: `wrapRef` listens for
 * pointer position, `frameRef` receives the rotation transform.
 */
export function usePortraitTilt() {
  const wrapRef = useRef(null);
  const frameRef = useRef(null);
  const rectRef = useRef(null);
  const posRef = useRef(null);
  const rafRef = useRef(null);

  const tick = () => {
    rafRef.current = null;
    const frame = frameRef.current;
    const pos = posRef.current;
    if (!frame || !pos) return;
    frame.style.transform = `rotateY(${10 * pos.px}deg) rotateX(${10 * -pos.py}deg)`;
  };

  const onMouseEnter = () => {
    if (wrapRef.current) rectRef.current = wrapRef.current.getBoundingClientRect();
  };

  const onMouseMove = (e) => {
    if (!wrapRef.current) return;
    if (!rectRef.current) rectRef.current = wrapRef.current.getBoundingClientRect();
    const rect = rectRef.current;
    posRef.current = {
      px: (e.clientX - rect.left) / rect.width - 0.5,
      py: (e.clientY - rect.top) / rect.height - 0.5,
    };
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  const onMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    posRef.current = null;
    rectRef.current = null;
    if (frameRef.current) frameRef.current.style.transform = "rotateY(0) rotateX(0)";
  };

  return { wrapRef, frameRef, onMouseEnter, onMouseMove, onMouseLeave };
}
