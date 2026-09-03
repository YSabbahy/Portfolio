import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../hooks/mediaFlags";
import { usePortraitTilt } from "../hooks/usePortraitTilt";
import MagneticButton from "./MagneticButton";

const CYCLE_WORDS = ["Developer", "Engineer", "Designer"];

function useCycleWord() {
  const [word, setWord] = useState(CYCLE_WORDS[0]);
  const [caretBlink, setCaretBlink] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const timers = [];
    let index = 0;

    const typeWord = (str, len, cb) => {
      setWord(str.slice(0, len));
      if (len <= str.length) {
        timers.push(setTimeout(() => typeWord(str, len + 1, cb), 65));
      } else {
        cb();
      }
    };

    const eraseWord = (str, len, cb) => {
      if (len < 0) {
        cb();
        return;
      }
      setWord(str.slice(0, len));
      timers.push(setTimeout(() => eraseWord(str, len - 1, cb), 40));
    };

    const scheduleErase = () => {
      timers.push(
        setTimeout(() => {
          eraseWord(CYCLE_WORDS[index], CYCLE_WORDS[index].length, () => {
            index = (index + 1) % CYCLE_WORDS.length;
            typeWord(CYCLE_WORDS[index], 0, scheduleErase);
          });
        }, 2200)
      );
    };

    timers.push(
      setTimeout(() => {
        setCaretBlink(true);
        scheduleErase();
      }, 1900)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return { word, caretBlink };
}

export default function Hero() {
  const { word, caretBlink } = useCycleWord();
  const { wrapRef, frameRef, onMouseEnter, onMouseMove, onMouseLeave } = usePortraitTilt();

  return (
    <main
      id="home"
      className="pt-36 pb-20 px-6 md:px-16 max-w-7xl mx-auto relative z-10 min-h-screen flex items-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="eyebrow inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Available for Freelance &amp; Full-time
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="headline-row">
              <span className="headline-word" style={{ "--i": 0 }}>
                Front-end
              </span>{" "}
              <span
                aria-hidden="true"
                className={`headline-word${caretBlink ? " caret-blink" : ""}`}
                id="cycleWord"
                style={{ "--i": 1 }}
              >
                {word}
              </span>
              <span className="sr-only">Developer</span>
            </span>
            <span className="headline-row">
              <span
                className="headline-word text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400"
                style={{ "--i": 2 }}
              >
                Portfolio
              </span>
            </span>
          </h1>
          <p className="hero-copy text-lg text-gray-400 max-w-xl leading-relaxed">
            I build interfaces that pay attention to the small things — timing, spacing, and how a
            page feels to move through, not just how it looks.
          </p>
          <div className="hero-ctas flex flex-wrap gap-4 pt-2">
            <MagneticButton
              href="#projects"
              className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-3 rounded-full text-sm transition-colors shadow-lg shadow-red-900/40 active:scale-95"
            >
              Explore Projects
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-medium px-6 py-3 rounded-full text-sm transition-colors active:scale-95"
            >
              Contact Me
            </MagneticButton>
          </div>
        </div>
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="portrait-wrap relative w-full max-w-md"
            id="portraitWrap"
            ref={wrapRef}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            <div className="profile-frame relative" id="profileFrame" ref={frameRef}>
              <div className="portrait-panel">
                <span className="panel-corner corner-tl" />
                <span className="panel-corner corner-br" />
              </div>
              <div className="portrait-media">
                <img
                  alt="Youssef Sabbahy"
                  decoding="async"
                  fetchPriority="high"
                  height="964"
                  loading="eager"
                  src={`${import.meta.env.BASE_URL}images/profile-cutout.webp`}
                  width="900"
                />
              </div>
            </div>
            <div className="chip chip-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              React &amp; Tailwind
            </div>
            <div className="chip chip-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Motion Design
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
