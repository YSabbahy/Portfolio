import { useMemo, useState } from "react";
import { PROJECTS } from "../data/projects";
import { useProjectGridStagger } from "../hooks/useProjectGridStagger";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";

const FILTERS = ["All", "E-commerce", "React", "Landing Page", "Interactive"];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  // Re-runs whenever the filter changes so freshly-rendered cards get revealed.
  const gridRef = useProjectGridStagger(activeFilter);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return PROJECTS;
    return PROJECTS.filter((project) => project.tags.includes(activeFilter));
  }, [activeFilter]);

  const [featuredProject, ...otherProjects] = filtered;

  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-10 sm:py-12 md:py-16"
      data-index="02"
      id="projects"
    >
      <Reveal className="mb-6">
        <span className="section-eyebrow">Selected Work</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">Projects</h2>
        <p className="text-gray-400 mt-3 max-w-xl">
          Four real front-end builds — from full e-commerce flows to a concept-driven landing
          page. Every project has a full case study.
        </p>
        <div className="filter-row" role="group" aria-label="Filter projects by category">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-chip${activeFilter === filter ? " is-active" : ""}`}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
      </Reveal>
      <p className="sr-only" role="status">
        Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        {activeFilter === "All" ? "" : ` in ${activeFilter}`}
      </p>
      {featuredProject ? (
        // `key` gives each filter a brand-new grid, so no card DOM node (and no
        // leftover `is-in` class / tilt transform) is ever reused for a
        // different project when the filter changes.
        <div className="project-grid" key={activeFilter} ref={gridRef}>
          <div className="project-featured-row">
            <ProjectCard featured project={featuredProject} />
          </div>
          {otherProjects.length > 0 && (
            <div
              className="project-others"
              style={{ "--cols": Math.min(otherProjects.length, 3) }}
            >
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-10">No projects in this category yet.</p>
      )}
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
