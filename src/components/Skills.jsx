import { SKILL_GROUPS } from "../data/skills";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="03"
      id="skills"
    >
      <Reveal className="mb-14">
        <span className="section-eyebrow">Toolkit</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">Skills</h2>
      </Reveal>
      <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {SKILL_GROUPS.map((group) => (
          <div className="skill-group" key={group.id}>
            <h3 className="skill-group-title">{group.title}</h3>
            <ul className="skill-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
