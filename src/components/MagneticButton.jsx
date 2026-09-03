import { useMagnetic } from "../hooks/useMagnetic";
import { useClickSound } from "../hooks/useClickSound";

/**
 * Renders an `<a>` with the pointer-following "magnetic" hover effect and the
 * UI click sound, matching every `.btn-magnetic` element in the original
 * design (resume download, hero CTAs, contact buttons).
 */
export default function MagneticButton({ className = "", children, onClick, ...rest }) {
  const { ref, onMouseEnter, onMouseMove, onMouseLeave } = useMagnetic();
  const playClick = useClickSound();

  const handleClick = (e) => {
    playClick();
    onClick?.(e);
  };

  return (
    <a
      className={`btn-magnetic ${className}`.trim()}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
