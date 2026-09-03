import { useRef } from "react";
import { prefersReducedMotion, supportsFineCursor } from "./mediaFlags";

/**
 * Reproduces the `.project-card` pointer-tilt + spotlight effect: tracks the
 * cursor position within the card to set CSS custom properties for the
 * spotlight glow and a subtle 3D rotation.
 */
export function useCardTilt() {
  const elRef = useRef(null);
  const rectRef = useRef(null);
  const posRef = useRef(null);
  const rafRef = useRef(null);

  if (!supportsFineCursor || prefersReducedMotion) {
    return { ref: elRef };
  }

  const tick = () => {
    rafRef.current = null;
    const el = elRef.current;
    const rect = rectRef.current;
    const pos = posRef.current;
    if (!el || !rect || !pos) return;
    el.style.setProperty("--spot-x", `${pos.x}px`);
    el.style.setProperty("--spot-y", `${pos.y}px`);
    const nx = pos.x / rect.width - 0.5;
    const ny = pos.y / rect.height - 0.5;
    el.style.transform = `perspective(900px) translateY(-6px) rotateX(${(6 * -ny).toFixed(2)}deg) rotateY(${(6 * nx).toFixed(2)}deg)`;
  };

  const onMouseEnter = () => {
    if (elRef.current) rectRef.current = elRef.current.getBoundingClientRect();
  };

  const onMouseMove = (e) => {
    if (!elRef.current) return;
    if (!rectRef.current) rectRef.current = elRef.current.getBoundingClientRect();
    const rect = rectRef.current;
    posRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  const onMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    posRef.current = null;
    rectRef.current = null;
    if (elRef.current) elRef.current.style.transform = "";
  };

  return { ref: elRef, onMouseEnter, onMouseMove, onMouseLeave };
}
