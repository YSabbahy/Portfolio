// Shared, module-level capability flags — mirrors the original vanilla script,
// which read these once at load time rather than re-checking on every call.
export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const supportsFineCursor =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
