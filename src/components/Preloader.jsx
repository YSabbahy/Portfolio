import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../hooks/mediaFlags";

/** Brief branded loading overlay shown on first mount, then faded out. */
export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let hideTimer;
    let removeTimer;
    const hide = () => {
      setHidden(true);
      removeTimer = setTimeout(() => setRemoved(true), 200);
    };
    if (prefersReducedMotion) {
      hide();
    } else {
      hideTimer = setTimeout(hide, 260);
    }
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      className={`preloader${hidden ? " is-hidden" : ""}`}
      id="preloader"
      aria-hidden="true"
    >
      <span className="preloader-logo">&lt;Y-Sabbahy&gt;</span>
    </div>
  );
}
