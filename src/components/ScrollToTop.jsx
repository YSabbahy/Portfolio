import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * React Router keeps the previous scroll offset when the route changes, so
 * opening a case study from the middle of the home page dropped you into the
 * middle of the new page. This resets to the top on every forward navigation.
 *
 * It deliberately does nothing when:
 *  - the URL has a #hash (Home scrolls to that section itself), or
 *  - the user pressed Back/Forward (the browser restores their old position).
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash || navigationType === "POP") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, key, navigationType]);

  return null;
}
