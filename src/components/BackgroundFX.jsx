import { useRef } from "react";
import { useHeroParticles } from "../hooks/useHeroParticles";

/** Static/ambient decorative background layers used across the whole page. */
export default function BackgroundFX() {
  const canvasRef = useRef(null);
  useHeroParticles(canvasRef);

  return (
    <>
      <div className="dark-red-bg">
        <div className="red-circle-1" />
        <div className="red-circle-2" />
      </div>
      <canvas className="hero-particles" id="heroParticles" ref={canvasRef} aria-hidden="true" />
      <div className="dot-grid" id="dotGrid" />
      <div className="grain" />
    </>
  );
}
