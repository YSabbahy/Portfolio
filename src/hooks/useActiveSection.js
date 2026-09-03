import { useEffect, useState } from "react";

/**
 * Watches the top-level `main[id]`/`section[id]` landmarks and reports which
 * one is currently in view, used to highlight the matching nav link.
 */
export function useActiveSection() {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const sections = document.querySelectorAll("main[id], section[id]");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute("id"));
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
