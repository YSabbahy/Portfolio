import { createContext } from "react";

/**
 * Single source of truth for light/dark mode and the accent colour.
 * Consumed through the `useMode()` / `useTheme()` hooks — never directly.
 */
export const AppearanceContext = createContext(null);
