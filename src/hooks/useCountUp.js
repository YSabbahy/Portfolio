import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./mediaFlags";

/**
 * Animates a numeric value from 0 up to `target` with an ease-out cubic curve
 * once the given section wrapper scrolls into view, matching the original
 * stats-strip count-up behavior.
 */
export function useCountUp(target, sectionRef) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const run = () => {
      if (hasRun.current) return;
      hasRun.current = true;
      if (prefersReducedMotion) {
        setValue(target);
        return;
      }
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 900);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [target, sectionRef]);

  return value;
}
