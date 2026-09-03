import { useCallback, useRef } from "react";
import { prefersReducedMotion } from "./mediaFlags";

/**
 * Returns a stable click handler that plays a short synthesized "click" tone,
 * matching the original site's UI feedback sound on buttons/links.
 */
export function useClickSound() {
  const audioCtxRef = useRef(null);

  return useCallback(() => {
    if (prefersReducedMotion) return;
    try {
      audioCtxRef.current =
        audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      /* AudioContext unavailable — fail silently, as in the original. */
    }
  }, []);
}
