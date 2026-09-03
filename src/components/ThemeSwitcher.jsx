import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useMode } from "../hooks/useMode";
import { useClickSound } from "../hooks/useClickSound";

const ACCENTS = [
  { value: "red", label: "Red theme" },
  { value: "green", label: "Green theme" },
  { value: "blue", label: "Blue theme" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useTheme();
  const [mode, setMode] = useMode();
  const [open, setOpen] = useState(false);
  const switcherRef = useRef(null);
  const playClick = useClickSound();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="theme-switcher" id="themeSwitcher" ref={switcherRef}>
      <button
        type="button"
        className="theme-toggle-btn"
        id="themeToggleBtn"
        aria-label="Change theme color"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      <div
        className={`theme-panel${open ? " is-open" : ""}`}
        id="themePanel"
        role="group"
        aria-label="Theme color options"
      >
        <span className="theme-panel-label">Appearance</span>
        <div
          className="mode-toggle-row"
          id="modeToggleRow"
          role="radiogroup"
          aria-label="Light or dark mode"
        >
          <button
            type="button"
            className={`mode-btn${mode === "dark" ? " is-active" : ""}`}
            data-mode-value="dark"
            role="radio"
            aria-checked={mode === "dark"}
            onClick={() => {
              playClick();
              setMode("dark");
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            Dark
          </button>
          <button
            type="button"
            className={`mode-btn${mode === "light" ? " is-active" : ""}`}
            data-mode-value="light"
            role="radio"
            aria-checked={mode === "light"}
            onClick={() => {
              playClick();
              setMode("light");
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Light
          </button>
        </div>
        <span className="theme-panel-label">Accent Color</span>
        <div className="theme-swatch-row" role="radiogroup" aria-label="Accent color">
          {ACCENTS.map((accent) => (
            <button
              key={accent.value}
              type="button"
              className={`theme-swatch${theme === accent.value ? " is-active" : ""}`}
              data-theme-value={accent.value}
              role="radio"
              aria-checked={theme === accent.value}
              aria-label={accent.label}
              onClick={() => {
                playClick();
                setTheme(accent.value);
                setOpen(false);
              }}
            >
              <span className={`swatch-dot swatch-${accent.value}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
