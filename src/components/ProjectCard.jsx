import { Link } from "react-router-dom";
import { useCardTilt } from "../hooks/useCardTilt";
import { useClickSound } from "../hooks/useClickSound";
import { useViewTransitionNav } from "../hooks/useViewTransitionNav";

export default function ProjectCard({ project, featured = false }) {
  const { ref: tiltRef, onMouseEnter, onMouseMove, onMouseLeave } = useCardTilt();
  const playClick = useClickSound();
  const navigateWithTransition = useViewTransitionNav();
  const caseStudyPath = `/project/${project.id}`;

  // Only intercept a plain left-click. Modifier/middle clicks should still
  // open in a new tab etc. exactly like a normal <a>.
  const handleCaseStudyClick = (event) => {
    playClick();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigateWithTransition(caseStudyPath);
  };

  return (
    <div
      className={`project-card group${featured ? " project-card--featured" : ""}`}
      ref={tiltRef}
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
        <div className="project-media" style={{ viewTransitionName: `pc-media-${project.id}` }}>
          {project.image ? (
            <img
              alt={project.imageAlt}
              decoding="async"
              height={project.height}
              loading={featured ? "eager" : "lazy"}
              src={project.image}
              width={project.width}
            />
          ) : (
            <div
              className={`project-media-glyph-wrap ${project.placeholderClass ?? ""}`}
              role="img"
              aria-label={project.imageAlt}
            >
              <span className="project-media-glyph">{project.placeholderGlyph ?? "◆"}</span>
            </div>
          )}
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
            style={{ viewTransitionName: `pc-title-${project.id}` }}
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
          <Link className="project-cs-link" to={caseStudyPath} onClick={handleCaseStudyClick}>
            Case Study →
          </Link>
        </div>
      </div>
    </div>
  );
}
