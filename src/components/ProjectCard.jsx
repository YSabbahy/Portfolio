import { useCardTilt } from "../hooks/useCardTilt";
import { useClickSound } from "../hooks/useClickSound";

export default function ProjectCard({ project, registerRef, featured = false }) {
  const { ref: tiltRef, onMouseEnter, onMouseMove, onMouseLeave } = useCardTilt();
  const playClick = useClickSound();

  const setRefs = (node) => {
    tiltRef.current = node;
    registerRef?.(node);
  };

  return (
    <div
      className={`project-card group${featured ? " project-card--featured" : ""}`}
      ref={setRefs}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <a
        className="project-media-link"
        href={project.liveUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="project-media">
          <img
            alt={project.imageAlt}
            decoding="async"
            height={project.height}
            loading={featured ? "eager" : "lazy"}
            src={project.image}
            width={project.width}
          />
          <div className="project-media-overlay" />
        </div>
      </a>
      <div className="project-body">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={
              featured
                ? "font-display text-3xl sm:text-4xl font-bold text-white"
                : "font-display text-xl font-bold text-white"
            }
          >
            {project.name}
          </h3>
          <a
            aria-label={`Open ${project.name} live demo`}
            className="project-arrow"
            href={project.liveUrl}
            rel="noopener noreferrer"
            target="_blank"
            onClick={playClick}
          >
            ↗
          </a>
        </div>
        <p
          className={
            featured
              ? "text-base text-gray-400 mt-2 leading-relaxed"
              : "text-sm text-gray-400 mt-2 leading-relaxed"
          }
        >
          {project.description}
        </p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="project-links">
          <a href={project.liveUrl} rel="noopener noreferrer" target="_blank">
            Live Demo ↗
          </a>
          <a href={project.codeUrl} rel="noopener noreferrer" target="_blank">
            Code
          </a>
        </div>
      </div>
    </div>
  );
}
