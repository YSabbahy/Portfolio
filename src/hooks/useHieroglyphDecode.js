import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./mediaFlags";

// Same small glyph set already used by the Kemet Protocol easter egg
// (see components/EasterEgg.jsx) — reused here so the "decode" moment reads
// as the same visual language rather than a new, unrelated effect.
const GLYPHS = ["𓁹", "𓂀", "𓃭", "𓆣", "𓉔", "𓆓", "𓊪", "𓈖"];

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Non-letter characters (spaces, hyphens, punctuation) are left alone so the
// word shape stays readable while it's still "encoded".
const scramble = (text) =>
  text
    .split("")
    .map((ch) => (/[a-zA-Z]/.test(ch) ? randomGlyph() : ch))
    .join("");

/**
 * Renders `text` as random hieroglyphs first, then decodes it one character
 * at a time, left to right, a single time per mount. Skips straight to the
 * final text when the visitor prefers reduced motion.
 */
export function useHieroglyphDecode(text, { delay = 0, speed = 45 } = {}) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion ? text : scramble(text)));
  const [done, setDone] = useState(prefersReducedMotion);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const timers = [];
    let revealed = 0;

    const tick = () => {
      const letters = textRef.current.split("");
      revealed += 1;
      setDisplay(
        letters.map((ch, i) => (i < revealed || !/[a-zA-Z]/.test(ch) ? ch : randomGlyph())).join("")
      );
      if (revealed < letters.length) {
        timers.push(setTimeout(tick, speed));
      } else {
        setDone(true);
      }
    };

    timers.push(setTimeout(tick, delay));
    return () => timers.forEach(clearTimeout);
    // Only ever run once per mount — this is a load-time moment, not something
    // that should re-trigger if `text` changes identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { display, done };
}
