import { useContext } from "react";
import { AppearanceContext } from "../context/appearanceContext";

/**
 * Light/dark mode, shared app-wide through <AppearanceProvider>. Every caller
 * reads and writes the SAME state, so the appearance panel and the command
 * palette can never disagree. Returns `[mode, setMode]`.
 */
export function useMode() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useMode must be used inside <AppearanceProvider>");
  return [ctx.mode, ctx.setMode];
}
