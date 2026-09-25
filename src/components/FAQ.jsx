import { useState } from "react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "What technologies do you use?",
    a: "HTML5, CSS3 and JavaScript (ES6+) as the foundation, React with Tailwind CSS for component-based projects, plus Vite and React Router for tooling and routing. C++ for programming/problem-solving.",
  },
  {
    q: "What kind of front-end projects do you build?",
    a: "Mostly e-commerce storefronts (catalog, cart, checkout, wishlist, account flows) and concept-driven landing pages / interactive experiences with a strong single visual identity.",
  },
  {
    q: "Do you work on e-commerce sites?",
    a: "Yes — Essence and RaceCore are both full e-commerce builds, covering catalog, cart, checkout and account flows on the front end.",
  },
  {
    q: "Are your projects front-end only?",
    a: "Yes, currently. The e-commerce projects simulate cart, checkout and account state on the client (localStorage) rather than a real backend — the READMEs are upfront about that.",
  },
  {
    q: "How can someone contact you?",
    a: "Email or WhatsApp are the fastest — both are linked in the Contact section below.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="08"
      id="faq"
    >
      <Reveal className="mb-4">
        <span className="section-eyebrow">FAQ</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
          Common questions.
        </h2>
      </Reveal>
      <Reveal className="faq-list max-w-3xl">
        {FAQS.map((item, index) => (
          <div className={`faq-item${openIndex === index ? " is-open" : ""}`} key={item.q}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {item.q}
              <span className="faq-icon" aria-hidden="true">+</span>
            </button>
            <div className="faq-answer">
              <div className="faq-answer-inner">{item.a}</div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
