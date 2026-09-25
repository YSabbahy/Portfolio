import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import Reveal from "./Reveal";
import cardTiltSource from "../hooks/useCardTilt.js?raw";
import revealSource from "../hooks/useReveal.js?raw";
import countUpSource from "../hooks/useCountUp.js?raw";

// Real source, pulled straight from the hooks these effects actually run —
// via Vite's `?raw` import, so this can never drift out of sync with the code.
const SNIPPETS = [
  {
    id: "useCardTilt",
    file: "useCardTilt.js",
    tagline: "The pointer-tracked 3D tilt + spotlight glow on every project card above.",
    code: cardTiltSource,
    notes: [
      "Bails out completely on touch devices and prefers-reduced-motion — no listeners attached at all for people who can't or don't want the effect.",
      "Pointer position is captured on every mousemove, but the DOM is only ever touched once per animation frame, so the tilt never fights the browser's paint cycle.",
      "Cleans up after itself: cancels the pending frame and resets the transform the instant the cursor leaves.",
    ],
  },
  {
    id: "useReveal",
    file: "useReveal.js",
    tagline: "The fade-and-rise animation you've seen on every section of this page.",
    code: revealSource,
    notes: [
      "One IntersectionObserver per element, and it unobserves itself the moment it fires — no dangling observers once a section has revealed.",
      "Falls back to 'always visible' when IntersectionObserver isn't supported, instead of leaving content permanently invisible.",
      "threshold and rootMargin are tuned so sections reveal a little before they hit the edge of the viewport, not right at it.",
    ],
  },
  {
    id: "useCountUp",
    file: "useCountUp.js",
    tagline: "The animated stat counters near the top of this page.",
    code: countUpSource,
    notes: [
      "A hasRun ref guards the animation so it plays exactly once, even if the section scrolls back into view later.",
      "Eased by hand with a cubic ease-out curve — the count itself is the animated value, not a CSS transition standing in for it.",
      "Respects prefers-reduced-motion by jumping straight to the final number instead of animating toward it.",
    ],
  },
];

export default function CodeShowcase() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const snippet = SNIPPETS[active];

  const selectTab = (index) => {
    setActive(index);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API blocked (permissions, insecure context) — fail silently.
    }
  };

  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="06"
      id="code"
    >
      <Reveal className="mb-4">
        <span className="section-eyebrow">Real Code</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
          Not a demo. This is what's actually running here.
        </h2>
        <p className="text-gray-400 mt-3 max-w-xl">
          Three hooks pulled straight from this site's source — the tilt on the project cards,
          the reveal-on-scroll you've been watching, the counters up top.
        </p>
      </Reveal>
      <Reveal className="code-showcase">
        <div className="code-window">
          <div className="code-window-bar">
            <div className="code-window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="code-window-tabs" role="tablist" aria-label="Code snippets">
              {SNIPPETS.map((s, index) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  className={`code-tab${active === index ? " is-active" : ""}`}
                  onClick={() => selectTab(index)}
                >
                  {s.file}
                </button>
              ))}
            </div>
            <button type="button" className="code-copy-btn" onClick={handleCopy}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <Highlight theme={themes.vsDark} code={snippet.code.trim()} language="jsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`code-pre ${className}`} style={style}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <div
                      key={i}
                      {...lineProps}
                      className={`code-line ${lineProps.className ?? ""}`}
                    >
                      <span className="code-line-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="code-line-content">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
        <div className="code-notes">
          <span className="code-notes-label">{snippet.tagline}</span>
          <ul>
            {snippet.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
