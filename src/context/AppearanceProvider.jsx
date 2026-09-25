import { useCallback, useEffect, useMemo, useState } from "react";
import { AppearanceContext } from "./appearanceContext";

const MODE_KEY = "portfolioMode";
const THEME_KEY = "portfolioTheme";
const VALID_THEMES = ["red", "green", "blue"];

// localStorage can throw (Safari private mode, blocked cookies, quota). The
// site must keep working — just without persistence — when that happens.
function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* persistence is best-effort */
  }
}

const normalizeMode = (value) => (value === "light" ? "light" : "dark");
const normalizeTheme = (value) => (VALID_THEMES.includes(value) ? value : "red");

/**
 * Owns the appearance state ONCE for the whole app. Before this existed,
 * `useMode()` was called separately by the appearance panel and the command
 * palette, which produced two independent copies of the state that drifted
 * out of sync (the palette would toggle from a stale value).
 */
export function AppearanceProvider({ children }) {
  const [mode, setModeState] = useState(() =>
    typeof window === "undefined" ? "dark" : normalizeMode(readStorage(MODE_KEY))
  );
  const [theme, setThemeState] = useState(() =>
    typeof window === "undefined" ? "red" : normalizeTheme(readStorage(THEME_KEY))
  );

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "light") root.setAttribute("data-mode", "light");
    else root.removeAttribute("data-mode");
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "green" || theme === "blue") root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
  }, [theme]);

  // Keep several open tabs in agreement.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === null || e.key === MODE_KEY) setModeState(normalizeMode(readStorage(MODE_KEY)));
      if (e.key === null || e.key === THEME_KEY) setThemeState(normalizeTheme(readStorage(THEME_KEY)));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setMode = useCallback((next) => {
    const value = normalizeMode(next);
    setModeState(value);
    writeStorage(MODE_KEY, value);
  }, []);

  const setTheme = useCallback((next) => {
    const value = normalizeTheme(next);
    setThemeState(value);
    writeStorage(THEME_KEY, value);
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, theme, setTheme }),
    [mode, setMode, theme, setTheme]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}
