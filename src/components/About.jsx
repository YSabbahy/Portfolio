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
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 pt-8">
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
        <div className="lg:col-span-8 space-y-0">
          <div className="about-block">
            <span className="about-block-label">Who I Am</span>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
              I'm Youssef Sabbahy, a Computer Science student and front-end developer based in
              Fayoum, Egypt. I care about the details most people skip past — the ease of a
              transition, the weight of a shadow, the moment a button responds to your cursor.
            </p>
          </div>
          <div className="about-block">
            <span className="about-block-label">What I Build</span>
            <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
              Front-end interfaces and UI-focused experiences — e-commerce storefronts with real
              cart, checkout and account flows, and concept-driven landing pages with a strong
              single visual identity. React and Tailwind on the surface, careful attention to
              feel underneath.
            </p>
          </div>
          <div className="about-block">
            <span className="about-block-label">How I Think</span>
            <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
              My work sits at the intersection of clean engineering and deliberate motion. A
              project isn't done when it looks right in a screenshot — it's done when every link
              actually goes somewhere and every interaction responds the way it should.
            </p>
          </div>
          <div className="about-block">
            <span className="about-block-label">Current Direction</span>
            <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
              Studying Computer Science at Fayoum University while building real, deployed
              front-end projects on the side — using each one to push further into React,
              interaction design and the details that separate a demo from a product.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
