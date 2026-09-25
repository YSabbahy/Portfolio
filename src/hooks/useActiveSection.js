import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Watches the page sections inside <main> and reports which one is currently
 * in view, used to highlight the matching nav link.
 *
 * Two bugs lived here before:
 *  1. The selector was `main[id], section[id]`. <main id="main-content"> wraps
 *     every section and always intersects the viewport, and it comes first in
 *     document order — so "the topmost visible landmark" was ALWAYS
 *     "main-content" and no nav link was ever highlighted. We now observe only
 *     the sections inside <main>.
 *  2. The effect ran once, on first mount. After visiting a case study and
 *     returning Home, the Home sections are brand-new DOM nodes that the old
 *     observer knew nothing about. It now re-subscribes on every route change.
 *
 * Uses a thin horizontal "band" near the top of the viewport (via a large
 * negative rootMargin) rather than requiring a share of the section itself to
 * be visible, so it also works for sections much taller than the viewport.
 */
export function useActiveSection() {
  const { pathname } = useLocation();
  // Store the route alongside the id: an id observed on a previous route is
  // ignored automatically, so no synchronous reset inside the effect is needed.
  const [active, setActive] = useState({ path: null, id: null });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!('IntersectionObserver' in window) || !sections.length) return undefined;

    const order = sections.map(section => section.id);
    const visible = new Set();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        });

        // When two neighbouring sections touch the band at once (always the
        // case right after clicking a nav link: the previous section's bottom
        // edge and the target's top edge sit on the same pixel) the LOWER one
        // is the one the visitor is heading to — so take the last visible
        // section in document order.
        const next = [...order].reverse().find(id => visible.has(id));
        if (next) setActive({ path: pathname, id: next });
      },
      // Shrink the observed viewport to a thin strip just below the fixed
      // navbar; a section is "active" once it crosses that strip.
      { rootMargin: '-110px 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return active.path === pathname ? active.id : null;
}
