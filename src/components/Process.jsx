import Reveal from "./Reveal";

const STEPS = [
  { num: "01", title: "Understand", desc: "Get clear on what the interface actually needs to do before opening an editor." },
  { num: "02", title: "Plan", desc: "Sketch the structure — pages, states, what data drives what." },
  { num: "03", title: "Design", desc: "Work out the visual identity and interaction language for the project." },
  { num: "04", title: "Build", desc: "Componentize, wire up state, and make every link and interaction actually work." },
  { num: "05", title: "Refine", desc: "Pass over motion, spacing and edge cases until nothing feels unfinished." },
  { num: "06", title: "Test", desc: "Check it across devices and break it on purpose before calling it done." },
];

export default function Process() {
  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="05"
      id="process"
    >
      <Reveal className="mb-4">
        <span className="section-eyebrow">Process</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
          How I work.
        </h2>
        <p className="text-gray-400 mt-3 max-w-xl">
          Not a formal methodology — just the steps that actually happen on every project.
        </p>
      </Reveal>
      <Reveal className="process-grid">
        {STEPS.map((step) => (
          <div className="process-step" key={step.num}>
            <span className="process-num">{step.num}</span>
            <h3 className="process-title">{step.title}</h3>
            <p className="process-desc">{step.desc}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
