import { useCallback, useEffect, useState } from "react";

const MODE_KEY = "portfolioMode";

function readInitialMode() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(MODE_KEY);
  return stored === "light" ? "light" : "dark";
}

/**
 * Manages light/dark mode, persisting it to localStorage and reflecting it on
 * <html data-mode="light"> exactly like the original script.
 */
export function useMode() {
  const [mode, setModeState] = useState(readInitialMode);

  useEffect(() => {
    if (mode === "light") {
      document.documentElement.setAttribute("data-mode", "light");
    } else {
      document.documentElement.removeAttribute("data-mode");
    }
  }, [mode]);

  const setMode = useCallback((next) => {
    const value = next === "light" ? "light" : "dark";
    setModeState(value);
    window.localStorage.setItem(MODE_KEY, value);
  }, []);

  return [mode, setMode];
}
