import { useContext } from "react";
import { AppearanceContext } from "../context/appearanceContext";

/**
 * Accent colour ("red" | "green" | "blue"), shared app-wide through
 * <AppearanceProvider>. Returns `[theme, setTheme]`.
 */
export function useTheme() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useTheme must be used inside <AppearanceProvider>");
  return [ctx.theme, ctx.setTheme];
}
