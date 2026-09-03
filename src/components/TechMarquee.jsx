import { ALL_SKILLS } from "../data/skills";

/** Infinite marquee of skill names, duplicated once so the CSS scroll loop is seamless. */
export default function TechMarquee() {
  const items = [...ALL_SKILLS, ...ALL_SKILLS];

  return (
    <div aria-hidden="true" className="tech-marquee">
      <div className="tech-marquee-track" id="techMarqueeTrack">
        {items.map((item, index) => (
          <span className="tech-marquee-item" key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
