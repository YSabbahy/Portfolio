import { useScrollProgress } from "../hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="scroll-progress"
      id="scrollProgress"
      aria-hidden="true"
      style={{ width: `${progress}%` }}
    />
  );
}
