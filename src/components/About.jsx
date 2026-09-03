import Reveal from "./Reveal";

export default function About() {
  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="01"
      id="about"
    >
      <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-4">
          <span className="section-eyebrow">About</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3 leading-tight">
            Interfaces, built with intent.
          </h2>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
            I'm Youssef Sabbahy, a Computer Science student and front-end developer based in
            Fayoum, Egypt. I care about the details most people skip past — the ease of a
            transition, the weight of a shadow, the moment a button responds to your cursor. My
            work sits at the intersection of clean engineering and deliberate motion: React and
            Tailwind on the surface, careful attention to feel underneath.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="about-fact">
              <span className="about-fact-label">Focus</span>
              <span className="about-fact-value">Front-end Engineering</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-label">Studying</span>
              <span className="about-fact-value">Computer Science, Fayoum University</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-label">Based in</span>
              <span className="about-fact-value">Fayoum, Egypt</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
