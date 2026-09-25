import { useEffect, useState } from 'react';

/** Tracks page scroll progress as a 0–100 percentage, like the original bar. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      ticking = false;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0);
    };

    // Coalesce scroll/resize events into a single measurement per animation
    // frame instead of running a layout-reading calculation (and a React
    // state update) on every raw scroll event — this was firing far more
    // often than the browser could paint, which is a common cause of
    // scrolling feeling heavy/stuttery, especially on trackpads and mobile.
    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('load', measure);
    measure();
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('load', measure);
    };
  }, []);

  return progress;
}
