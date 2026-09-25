import { useRef, useState } from "react";
import { useHeroParticles } from "../hooks/useHeroParticles";
import { useShaderField } from "../hooks/useShaderField";

/** Static/ambient decorative background layers used across the whole page. */
export default function BackgroundFX() {
  const canvasRef = useRef(null);
  const shaderRef = useRef(null);
  useHeroParticles(canvasRef);

  // Only spend a WebGL context on devices that can comfortably afford it:
  // fine pointer + hover support + a reasonably wide viewport. Everyone
  // else keeps the existing CSS radial-gradient orbs — a fully adequate
  // fallback with zero extra cost.
  const [enableShader] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth >= 900
    );
  });

  useShaderField(enableShader ? shaderRef : { current: null });

  return (
    <>
      <div className="dark-red-bg">
        <div className="red-circle-1" />
        <div className="red-circle-2" />
      </div>
      {enableShader && (
        <canvas className="shader-field" ref={shaderRef} aria-hidden="true" />
      )}
      <canvas className="hero-particles" id="heroParticles" ref={canvasRef} aria-hidden="true" />
      <div className="dot-grid" id="dotGrid" />
      <div className="grain" />
    </>
  );
}
