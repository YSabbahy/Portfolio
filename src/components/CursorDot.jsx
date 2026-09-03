import { useRef } from "react";
import { useCursorEffects } from "../hooks/useCursorEffects";

export default function CursorDot() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useCursorEffects({ dotRef, ringRef, labelRef });

  return (
    <>
      <div className="cursor-dot" id="cursorDot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" id="cursorRing" ref={ringRef} aria-hidden="true">
        <span className="cursor-ring-label" ref={labelRef} />
      </div>
    </>
  );
}
