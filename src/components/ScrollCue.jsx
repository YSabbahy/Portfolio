import { useEffect, useRef, useState } from "react";

export default function ScrollCue() {
  const [hidden, setHidden] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      tickingRef.current = false;
      const threshold = 0.35 * window.innerHeight;
      setHidden(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`scroll-cue fixed bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-gray-500${hidden ? " is-hidden" : ""}`}
      id="scrollCue"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Scroll</span>
      <div className="line" />
    </div>
  );
}
