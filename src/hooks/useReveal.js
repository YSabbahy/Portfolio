import { useEffect, useRef, useState } from "react";

/**
 * Mirrors the original `.reveal` IntersectionObserver: adds an "is-visible"
 * class once the element scrolls into view (or immediately if
 * IntersectionObserver isn't supported).
 */
export function useReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window)
  );

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  return { ref, isVisible };
}
