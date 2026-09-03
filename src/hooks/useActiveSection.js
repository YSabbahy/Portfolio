import { useEffect, useState } from 'react';

/**
 * Watches the top-level `main[id]`/`section[id]` landmarks and reports which
 * one is currently in view, used to highlight the matching nav link.
 *
 * Uses a thin horizontal "band" near the top of the viewport (via a large
 * negative rootMargin) rather than requiring 50% of the section itself to be
 * visible. The old threshold-based approach only works for sections shorter
 * than the viewport — any section taller than ~2x the viewport height
 * (Projects, Skills, Contact) could never reach 50% visibility while
 * scrolling through it, so the nav link would silently stop updating.
 */
export function useActiveSection() {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main[id], section[id]'));
    if (!('IntersectionObserver' in window) || !sections.length) return;

    const order = sections.map(section => section.id);
    const visible = new Set();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        });

        // Pick the topmost section (in document order) that currently
        // intersects the band, so the result is stable even when two
        // sections' edges both cross it in the same frame.
        const next = order.find(id => visible.has(id));
        if (next) setActiveId(next);
      },
      // Shrink the observed viewport to a thin strip just below the fixed
      // navbar; a section is "active" once it crosses that strip.
      { rootMargin: '-110px 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
