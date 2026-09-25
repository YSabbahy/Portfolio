import { useEffect } from "react";
import { Link } from "react-router-dom";
import { JOURNEY } from "../data/journey";
import { SKILL_GROUPS } from "../data/skills";
import Reveal from "../components/Reveal";

export default function Resume() {
  useEffect(() => {
    document.title = "Resume — Youssef Sabbahy";
    return () => {
      document.title = "Youssef Sabbahy — Front-end Developer";
    };
  }, []);

  return (
    <article className="px-6 md:px-16 max-w-4xl mx-auto relative z-10 pt-40 pb-24">
      <Reveal>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-mono mb-10"
        >
          ← Home
        </Link>
        <span className="section-eyebrow">Resume</span>
        <div className="flex flex-wrap items-end justify-between gap-6 mt-3">
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight">
            Youssef Sabbahy
          </h1>
          <a
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            download
            className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-3 rounded-full text-sm transition-colors shadow-lg shadow-red-900/40 active:scale-95"
          >
            Download PDF ↓
          </a>
        </div>
        <p className="text-lg text-gray-400 mt-4 max-w-2xl leading-relaxed">
          Computer Science student &amp; front-end developer, based in Fayoum, Egypt.
        </p>
      </Reveal>

      <div className="cs-body" style={{ paddingTop: "56px" }}>
      <Reveal className="cs-section">
        <h2 className="cs-heading">Education</h2>
        <div className="resume-row">
          <span className="resume-row-title">B.Sc. Computer Science</span>
          <span className="resume-row-sub">Fayoum University</span>
        </div>
      </Reveal>

      <div className="cs-section" >
        <h2 className="cs-heading">Skill Matrix</h2>
        <div className="resume-skills">
          {SKILL_GROUPS.map((group) => (
            <div key={group.id} className="skill-group">
              <h3 className="skill-group-title">{group.title}</h3>
              <ul className="skill-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="cs-section">
        <h2 className="cs-heading">Timeline</h2>
        <div className="journey-track" style={{ marginTop: "24px" }}>
          {JOURNEY.map((step) => (
            <div className="journey-item" key={step.phase}>
              <span className="journey-dot" aria-hidden="true" />
              <span className="journey-phase">{step.phase}</span>
              <h3 className="journey-title">{step.title}</h3>
              <p className="journey-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cs-section">
        <h2 className="cs-heading">Contact</h2>
        <div className="contact-links">
          <a className="contact-link" href="mailto:yh1410@fayoum.edu.eg">
            <span className="contact-link-label">Email</span>
            <span className="contact-link-value">yh1410@fayoum.edu.eg</span>
          </a>
          <a className="contact-link" href="tel:+201015155161">
            <span className="contact-link-label">Phone</span>
            <span className="contact-link-value">+20 101 515 5161</span>
          </a>
          <a
            className="contact-link"
            href="https://www.linkedin.com/in/youssef-sabbahy-cs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-link-label">LinkedIn</span>
            <span className="contact-link-value">/in/youssef-sabbahy-cs</span>
          </a>
          <a
            className="contact-link"
            href="https://github.com/YSabbahy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-link-label">GitHub</span>
            <span className="contact-link-value">/YSabbahy</span>
          </a>
        </div>
      </div>
      </div>
    </article>
  );
}
