import { useEffect, useRef } from "react";

/**
 * Drives the project grid's entrance animation.
 *
 * The stylesheet hides every `.project-card` (opacity 0) until it receives the
 * `is-in` class, so EVERY card that gets rendered must be revealed by this
 * hook. The original version revealed the cards once, on first mount, and
 * never again — so any card created later by changing the filter (e.g. going
 * from "E-commerce" back to "All") stayed invisible forever.
 *
 * Fix: the caller re-keys the grid whenever the filter changes and passes that
 * filter as `resetKey`; the effect re-runs for the fresh grid and reveals the
 * cards it actually finds in the DOM (no ref bookkeeping to go stale).
 *
 *  - First reveal: waits until the grid scrolls into view, then plays the
 *    "deck deal" animation fanning out from the grid's centre.
 *  - Later reveals (user changed the filter): the grid is already on screen,
 *    so cards appear immediately with a short fade instead of replaying the
 *    multi-second deck animation on every click.
 */
export function useProjectGridStagger(resetKey) {
  const gridRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const getCards = () => Array.from(grid.querySelectorAll(".project-card"));

    const revealCards = () => {
      const cards = getCards();
      const isRefilter = hasPlayedRef.current;

      if (isRefilter) {
        grid.dataset.refiltered = "true";
        cards.forEach((card, index) => {
          card.style.setProperty("--card-delay", `${60 * Math.min(index, 8)}ms`);
        });
      } else {
        const gridRect = grid.getBoundingClientRect();
        const centerX = gridRect.left + gridRect.width / 2;
        const centerY = gridRect.top + gridRect.height / 2;
        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--start-x", `${centerX - (rect.left + rect.width / 2)}px`);
          card.style.setProperty("--start-y", `${centerY - (rect.top + rect.height / 2)}px`);
          card.style.setProperty("--card-delay", `${250 * Math.min(index, 8)}ms`);
        });
      }

      cards.forEach((card) => card.classList.add("is-in"));
      hasPlayedRef.current = true;
    };

    // After the first reveal the grid is already visible — no need to wait.
    if (hasPlayedRef.current || !("IntersectionObserver" in window)) {
      revealCards();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealCards();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, [resetKey]);

  return gridRef;
}
