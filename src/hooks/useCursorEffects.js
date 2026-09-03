import { useEffect, useRef } from "react";
import { prefersReducedMotion, supportsFineCursor } from "./mediaFlags";

const STATE_RULES = [
  { selector: ".project-card", state: "is-view", label: "View" },
  { selector: ".btn-magnetic", state: "is-button", label: "" },
  {
    selector:
      ".nav-link, .contact-link, .project-arrow, .mobile-link, .theme-swatch, .mode-btn, .mobile-menu-btn, .theme-toggle-btn, footer a",
    state: "is-link",
    label: "",
  },
];

const GENERIC_SELECTOR = "a, button, input, textarea";

/**
 * Drives the custom cursor dot + trailing ring, including per-element hover
 * states (view / button / link / generic hover). Implemented with a single
 * delegated `mouseover`/`mouseout` listener on `document`, which reproduces
 * the original per-element listeners without needing a ref on every
 * interactive element across the page.
 */
export function useCursorEffects({ dotRef, ringRef, labelRef }) {
  const posRef = useRef({ x: 0, y: 0, ringX: 0, ringY: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || !supportsFineCursor || prefersReducedMotion) return;

    document.body.classList.add("cursor-ready");

    posRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      ringX: window.innerWidth / 2,
      ringY: window.innerHeight / 2,
    };

    const onPointerMove = (e) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const animateRing = () => {
      const pos = posRef.current;
      pos.ringX += 0.18 * (pos.x - pos.ringX);
      pos.ringY += 0.18 * (pos.y - pos.ringY);
      ring.style.transform = `translate(${pos.ringX}px, ${pos.ringY}px) translate(-50%, -50%)`;
      rafRef.current = requestAnimationFrame(animateRing);
    };
    rafRef.current = requestAnimationFrame(animateRing);

    const setState = (state, label) => {
      ring.classList.remove("is-hover", "is-view", "is-link", "is-button");
      if (state) ring.classList.add(state);
      if (labelRef.current) labelRef.current.textContent = label || "";
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const rule = STATE_RULES.find(({ selector }) => target.closest(selector));
      if (rule) {
        setState(rule.state, rule.label);
      } else if (target.closest(GENERIC_SELECTOR)) {
        setState("is-hover", "");
      }
    };
    const onMouseOut = (e) => {
      const related = e.relatedTarget;
      const target = e.target;
      const stillMatches =
        related &&
        (STATE_RULES.some(({ selector }) => related.closest?.(selector)) ||
          related.closest?.(GENERIC_SELECTOR));
      if (target.closest(GENERIC_SELECTOR) && !stillMatches) {
        setState(null, "");
      }
    };
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    const onDocMouseLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onDocMouseEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    document.addEventListener("mouseleave", onDocMouseLeave);
    document.addEventListener("mouseenter", onDocMouseEnter);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseleave", onDocMouseLeave);
      document.removeEventListener("mouseenter", onDocMouseEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("cursor-ready");
    };
  }, [dotRef, ringRef, labelRef]);
}
