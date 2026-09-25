import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data/nav";

export default function MobileMenu({ open, onClose }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className={`mobile-menu${open ? " is-open" : ""}`} id="mobileMenu" inert={!open}>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.section}
          to={isHome ? `#${link.section}` : `/#${link.section}`}
          className="mobile-link"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
      <a
        href={`${import.meta.env.BASE_URL}resume.pdf`}
        download
        className="mobile-link mobile-link-cta"
        onClick={onClose}
      >
        Download Resume
      </a>
    </div>
  );
}
