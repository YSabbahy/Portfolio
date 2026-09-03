import { useRef } from "react";
import { PROJECTS } from "../data/projects";
import { useProjectGridStagger } from "../hooks/useProjectGridStagger";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const cardRefs = useRef([]);
  const gridRef = useProjectGridStagger(cardRefs);
  const [featuredProject, ...otherProjects] = PROJECTS;

  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-10 sm:py-12 md:py-16"
      data-index="02"
      id="projects"
    >
      <Reveal className="mb-14">
        <span className="section-eyebrow">Selected Work</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">Projects</h2>
        <p className="text-gray-400 mt-3 max-w-xl">
          A handful of front-end builds — from full e-commerce flows to concept-driven landing
          experiences.
        </p>
      </Reveal>
      <div className="project-grid" ref={gridRef}>
        <div className="project-featured-row">
          <ProjectCard
            featured
            project={featuredProject}
            registerRef={(node) => {
              cardRefs.current[0] = node;
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {otherProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              registerRef={(node) => {
                cardRefs.current[index + 1] = node;
              }}
            />
          ))}
        </div>
      </div>
      <Reveal className="mt-10 text-center">
        <a
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-mono"
          href="https://github.com/YSabbahy"
          rel="noopener noreferrer"
          target="_blank"
        >
          View all repositories on GitHub <span>→</span>
        </a>
      </Reveal>
    </section>
  );
}
