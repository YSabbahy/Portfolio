import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function Contact() {
  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="04"
      id="contact"
    >
      <Reveal className="contact-panel">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Get in touch</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mt-3 leading-tight">
            Let's build something premium.
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg">
            Open to freelance work and full-time roles. The fastest way to reach me is email or
            WhatsApp.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <MagneticButton
              href="mailto:yh1410@fayoum.edu.eg"
              className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-3 rounded-full text-sm transition-colors shadow-lg shadow-red-900/40 active:scale-95"
            >
              Email Me
            </MagneticButton>
            <MagneticButton
              href="https://wa.me/201015155161"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-medium px-6 py-3 rounded-full text-sm transition-colors active:scale-95"
            >
              WhatsApp
            </MagneticButton>
          </div>
        </div>
        <div className="contact-links">
          <a className="contact-link" href="mailto:yh1410@fayoum.edu.eg">
            <span className="contact-link-label">Email</span>
            <span className="contact-link-value">
              yh1410@<wbr />
              fayoum.edu.eg
            </span>
          </a>
          <a className="contact-link" href="tel:+201015155161">
            <span className="contact-link-label">Phone</span>
            <span className="contact-link-value">+20 101 515 5161</span>
          </a>
          <a
            className="contact-link"
            href="https://www.linkedin.com/in/youssef-sabbahy-cs"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="contact-link-label">LinkedIn</span>
            <span className="contact-link-value">/in/youssef-sabbahy-cs</span>
          </a>
          <a
            className="contact-link"
            href="https://github.com/YSabbahy"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="contact-link-label">GitHub</span>
            <span className="contact-link-value">/YSabbahy</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
