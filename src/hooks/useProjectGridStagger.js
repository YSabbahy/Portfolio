import { useEffect, useRef } from "react";

/**
 * Reproduces the project grid's "deck deal" stagger-in animation: once the
 * grid scrolls into view, each card's CSS custom properties are set to its
 * offset from the grid's center (so the card-in animation appears to fan out
 * from the middle), then a staggered delay class triggers the transition.
 */
export function useProjectGridStagger(cardRefs) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const applyOffsets = () => {
      const gridRect = grid.getBoundingClientRect();
      const centerX = gridRect.left + gridRect.width / 2;
      const centerY = gridRect.top + gridRect.height / 2;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        card.style.setProperty("--start-x", `${centerX - cardCenterX}px`);
        card.style.setProperty("--start-y", `${centerY - cardCenterY}px`);
        card.style.setProperty("--card-delay", `${250 * Math.min(index, 8)}ms`);
      });
    };

    const revealCards = () => {
      applyOffsets();
      cardRefs.current.forEach((card) => card?.classList.add("is-in"));
    };

    if (!("IntersectionObserver" in window)) {
      revealCards();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealCards();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, [cardRefs]);

  return gridRef;
}
