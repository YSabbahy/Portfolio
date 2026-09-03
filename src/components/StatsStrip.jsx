import { useRef } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { useReveal } from "../hooks/useReveal";
import { PROJECTS } from "../data/projects";
import { ALL_SKILLS } from "../data/skills";

export default function StatsStrip() {
  const sectionRef = useRef(null);
  const { ref: revealRef, isVisible } = useReveal();
  const projectsCount = useCountUp(PROJECTS.length, sectionRef);
  const yearCount = useCountUp(3, sectionRef);
  const skillsCount = useCountUp(ALL_SKILLS.length, sectionRef);

  const setRefs = (node) => {
    sectionRef.current = node;
    revealRef.current = node;
  };

  return (
    <section
      aria-label="Quick stats"
      className={`stats-strip reveal${isVisible ? " is-visible" : ""} px-6 md:px-16 max-w-7xl mx-auto relative z-10`}
      ref={setRefs}
    >
      <div className="stat-item">
        <span className="stat-number" data-suffix="+" id="statProjects">
          {projectsCount}
        </span>
        <span className="stat-label">Projects Shipped</span>
      </div>
      <div className="stat-item">
        <span className="stat-number" data-suffix="rd" id="statYear">
          {yearCount}
        </span>
        <span className="stat-label">Year, Computer Science</span>
      </div>
      <div className="stat-item">
        <span className="stat-number" data-suffix="+" id="statSkills">
          {skillsCount}
        </span>
        <span className="stat-label">Core Skills</span>
      </div>
    </section>
  );
}
