import { useRef } from "react";

/**
 * Attaches a subtle pointer-following "magnetic" translate effect to an
 * element, matching the original `.btn-magnetic` behavior. Returns a ref to
 * attach to the target element plus mouse event handlers to spread onto it.
 */
export function useMagnetic() {
  const elRef = useRef(null);
  const rectRef = useRef(null);
  const offsetRef = useRef(null);
  const rafRef = useRef(null);

  const tick = () => {
    rafRef.current = null;
    const offset = offsetRef.current;
    if (offset && elRef.current) {
      elRef.current.style.transform = `translate(${0.18 * offset.x}px, ${0.35 * offset.y}px)`;
    }
  };

  const onMouseEnter = () => {
    if (elRef.current) rectRef.current = elRef.current.getBoundingClientRect();
  };

  const onMouseMove = (e) => {
    if (!elRef.current) return;
    if (!rectRef.current) rectRef.current = elRef.current.getBoundingClientRect();
    const rect = rectRef.current;
    offsetRef.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  const onMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    offsetRef.current = null;
    rectRef.current = null;
    if (elRef.current) elRef.current.style.transform = "translate(0, 0)";
  };

  return { ref: elRef, onMouseEnter, onMouseMove, onMouseLeave };
}
