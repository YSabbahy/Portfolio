import { useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "./mediaFlags";

/**
 * Wraps react-router's navigate() in the native View Transitions API
 * (document.startViewTransition) so elements sharing a `view-transition-name`
 * (see ProjectCard / CaseStudy) morph between the two pages instead of the
 * new route just popping in.
 *
 * Falls back to a plain navigate() — same as today — when the browser
 * doesn't support the API (Firefox, at the time of writing) or the visitor
 * prefers reduced motion. No router upgrade required: this app uses the
 * plain declarative <BrowserRouter>, so the transition is driven manually
 * instead of via react-router's own (data-router-only) `viewTransition` prop.
 */
export function useViewTransitionNav() {
  const navigate = useNavigate();

  return function navigateWithTransition(to, options) {
    if (typeof document === "undefined" || !document.startViewTransition || prefersReducedMotion) {
      navigate(to, options);
      return;
    }

    // Warm the target route's lazy chunk *before* starting the transition so
    // the "after" snapshot the browser captures is the real page, not the
    // route's Suspense fallback.
    const preload =
      to.startsWith("/project/") || to === "/project" ? import("../pages/CaseStudy") : Promise.resolve();

    document.startViewTransition(async () => {
      await preload;
      flushSync(() => navigate(to, options));
      // One extra macrotask so a first-ever visit to a lazy route (chunk
      // fetched but not yet swapped in by Suspense) has time to settle
      // before the browser takes its "new state" screenshot.
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };
}
