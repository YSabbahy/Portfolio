import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PROJECTS } from "../data/projects";
import { CASE_STUDIES } from "../data/caseStudies";
import Reveal from "../components/Reveal";

export default function CaseStudy() {
  const { id } = useParams();
  const project = PROJECTS.find((p) => p.id === id);
  const study = CASE_STUDIES[id];

  useEffect(() => {
    document.title = project
      ? `${project.name} — Case Study — Youssef Sabbahy`
      : "Case study not found — Youssef Sabbahy";
    return () => {
      document.title = "Youssef Sabbahy — Front-end Developer";
    };
  }, [project]);

  if (!project || !study) {
    return (
      <section className="px-6 md:px-16 max-w-3xl mx-auto relative z-10 py-32 text-center">
        <span className="section-eyebrow">404</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
          That case study doesn't exist.
        </h1>
        <p className="text-gray-400 mt-4">
          The project you're looking for might have moved, or the link is off.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-3 rounded-full text-sm transition-colors"
        >
          ← Back home
        </Link>
      </section>
    );
  }

  const currentIndex = PROJECTS.findIndex((p) => p.id === id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <article className="px-6 md:px-16 max-w-5xl mx-auto relative z-10 pt-40 pb-24">
      {/* Not wrapped in <Reveal>: this is the view-transition morph target from
          the project card's title, so it needs to be visible immediately on
          mount rather than waiting on the scroll-reveal IntersectionObserver. */}
      <div>
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-mono mb-10"
        >
          ← All projects
        </Link>
        <span className="section-eyebrow">{study.type}</span>
        <h1
          className="font-display text-4xl sm:text-6xl font-bold text-white mt-3 leading-tight"
          style={{ viewTransitionName: `pc-title-${project.id}` }}
        >
          {project.name}
        </h1>
      </div>
      <Reveal>
        <p className="text-lg text-gray-400 mt-6 max-w-3xl leading-relaxed">{study.overview}</p>

        <div className="flex flex-wrap gap-3 mt-8">
          {study.technologies.map((tech) => (
            <span key={tech} className="cs-tech-badge">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-3 rounded-full text-sm transition-colors shadow-lg shadow-red-900/40 active:scale-95"
          >
            Live Project ↗
          </a>
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-medium px-6 py-3 rounded-full text-sm transition-colors active:scale-95"
          >
            Repository ↗
          </a>
        </div>
      </Reveal>

      {/* Also not wrapped in <Reveal> — same reason as the h1 above: it's a
          morph target, so it needs to be on-screen the instant the page
          mounts, not after the observer fires. */}
      <div className="mt-16">
        <div className="cs-hero-media" style={{ viewTransitionName: `pc-media-${project.id}` }}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.imageAlt}
              width={project.width}
              height={project.height}
            />
          ) : (
            <div className={`project-media-glyph-wrap ${project.placeholderClass ?? ""}`}>
              <span className="project-media-glyph">{project.placeholderGlyph ?? "◆"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="cs-body">
        <Reveal className="cs-section">
          <h2 className="cs-heading">Experience</h2>
          <ul className="cs-list">
            {study.experience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="cs-section">
          <h2 className="cs-heading">Design Direction</h2>
          <p className="cs-paragraph">{study.designDirection}</p>
        </Reveal>

        <Reveal className="cs-section">
          <h2 className="cs-heading">Key Features</h2>
          <ul className="cs-list">
            {study.keyFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="cs-section">
          <h2 className="cs-heading">Technical Implementation</h2>
          <p className="cs-paragraph">{study.technicalImplementation}</p>
        </Reveal>

        <Reveal className="cs-section">
          <h2 className="cs-heading">Challenges</h2>
          <p className="cs-paragraph">{study.challenges}</p>
        </Reveal>

        <Reveal className="cs-section">
          <h2 className="cs-heading">Result</h2>
          <p className="cs-paragraph">{study.result}</p>
        </Reveal>
      </div>

      <Reveal className="cs-next">
        <span className="section-eyebrow">Next project</span>
        <Link to={`/project/${nextProject.id}`} className="cs-next-link">
          {nextProject.name} →
        </Link>
      </Reveal>
    </article>
  );
}
