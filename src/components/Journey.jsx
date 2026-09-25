import Reveal from "./Reveal";
import { JOURNEY } from "../data/journey";

export default function Journey() {
  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="04"
      id="journey"
    >
      <Reveal className="mb-4">
        <span className="section-eyebrow">Journey</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
          How I got here.
        </h2>
      </Reveal>
      <Reveal className="journey-track max-w-3xl">
        {JOURNEY.map((step) => (
          <div className="journey-item" key={step.phase}>
            <span className="journey-dot" aria-hidden="true" />
            <span className="journey-phase">{step.phase}</span>
            <h3 className="journey-title">{step.title}</h3>
            <p className="journey-desc">{step.desc}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
