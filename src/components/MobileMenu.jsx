import { NAV_LINKS } from "../data/nav";

export default function MobileMenu({ open, onClose }) {
  return (
    <div className={`mobile-menu${open ? " is-open" : ""}`} id="mobileMenu">
      {NAV_LINKS.map((link) => (
        <a key={link.section} href={`#${link.section}`} className="mobile-link" onClick={onClose}>
          {link.label}
        </a>
      ))}
      <a href={`${import.meta.env.BASE_URL}resume.pdf`} download className="mobile-link mobile-link-cta" onClick={onClose}>
        Download Resume
      </a>
    </div>
  );
}
