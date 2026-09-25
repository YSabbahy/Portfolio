import { useEffect, useState } from "react";

const SECRET = "kemet";

/**
 * Type "kemet" anywhere on the page to trigger a short gold-accent visual
 * nod to the Kemet Protocol project. Purely decorative, auto-dismisses,
 * and never blocks interaction with the rest of the site.
 */
export default function EasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let buffer = "";
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Browser autofill can fire keydown events with no `key` at all.
      if (typeof e.key !== "string") return;
      // Don't fire while the visitor is typing into a field — e.g. searching
      // "kemet" in the command palette to open the Kemet case study.
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) {
        buffer = "";
        return;
      }
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer === SECRET) {
        setActive(true);
        if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.setTimeout(() => setActive(false), 2600);
        } else {
          window.setTimeout(() => setActive(false), 400);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      "%c𓁹 Looking for something?",
      "color:#c9a227;font-family:monospace;font-size:14px;"
    );
    // eslint-disable-next-line no-console
    console.log(
      "%cTry typing \"kemet\" anywhere on the page.",
      "color:#8b8b93;font-family:monospace;font-size:12px;"
    );
  }, []);

  if (!active) return null;

  return (
    <div className="egg-overlay" role="status" aria-live="polite">
      <div className="egg-glyphs" aria-hidden="true">
        𓁹 𓂀 𓃭 𓆣 𓉔
      </div>
      <p className="egg-text">Kemet Protocol says hi.</p>
    </div>
  );
}
