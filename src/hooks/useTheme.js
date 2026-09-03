import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "portfolioTheme";
const VALID_THEMES = ["red", "green", "blue"];

function readInitialTheme() {
  if (typeof window === "undefined") return "red";
  const stored = window.localStorage.getItem(THEME_KEY);
  return VALID_THEMES.includes(stored) ? stored : "red";
}

/**
 * Manages the accent-color theme ("red" | "green" | "blue"), persisting it to
 * localStorage and reflecting it on <html data-theme="..."> exactly like the
 * original script.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(readInitialTheme);

  useEffect(() => {
    if (theme === "green" || theme === "blue") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    const value = VALID_THEMES.includes(next) ? next : "red";
    setThemeState(value);
    window.localStorage.setItem(THEME_KEY, value);
  }, []);

  return [theme, setTheme];
}
