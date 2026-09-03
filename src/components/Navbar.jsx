import { useRef, useState } from "react";
import { NAV_LINKS } from "../data/nav";
import { useActiveSection } from "../hooks/useActiveSection";
import { useClickSound } from "../hooks/useClickSound";
import ThemeSwitcher from "./ThemeSwitcher";
import MagneticButton from "./MagneticButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const activeSection = useActiveSection();
  const playClick = useClickSound();
  const [mobileOpen, setMobileOpen] = useState(false);

  const containerRef = useRef(null);
  const beamRef = useRef(null);
  const linkRefs = useRef([]);

  const positionBeam = (el) => {
    const beam = beamRef.current;
    if (!beam || !el) return;
    beam.style.opacity = "1";
    beam.style.width = `${el.offsetWidth}px`;
    beam.style.left = `${el.offsetLeft}px`;
  };

  const onContainerMouseLeave = () => {
    if (beamRef.current) beamRef.current.style.opacity = "0";
  };

  return (
    <>
      <nav className="floating-nav">
        <div className="logo">
          <a
            href="#home"
            className="font-display text-base font-bold no-underline tracking-tight flex items-center gap-1 group"
          >
            <span className="logo-text">
              &lt;Y-Sabbahy
              <span className="logo-bracket group-hover:rotate-12 transition-transform duration-300 inline-block">
                &gt;
              </span>
            </span>
          </a>
        </div>
        <div
          className="nav-links-container hidden md:flex items-center"
          id="navContainer"
          ref={containerRef}
          onMouseLeave={onContainerMouseLeave}
        >
          <div className="nav-beam-pill" id="beamPill" ref={beamRef} />
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.section}
              href={`#${link.section}`}
              className={`nav-link${activeSection === link.section ? " is-active" : ""}`}
              data-section={link.section}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              onMouseEnter={(e) => positionBeam(e.currentTarget)}
              onClick={playClick}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button
            type="button"
            className="mobile-menu-btn md:hidden text-gray-300 hover:text-white transition-colors"
            id="mobileMenuBtn"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <MagneticButton
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            download
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 shadow-lg shadow-red-900/50 active:scale-95 hidden sm:inline-flex"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Resume
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </span>
          </MagneticButton>
        </div>
      </nav>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
