import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import ScrollCue from "../components/ScrollCue";
import StatsStrip from "../components/StatsStrip";
import TechMarquee from "../components/TechMarquee";
import About from "../components/About";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Journey from "../components/Journey";
import Process from "../components/Process";
import BuildLog from "../components/BuildLog";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";

// CodeShowcase pulls in prism-react-renderer just to syntax-highlight a few
// snippets far below the fold — split it into its own chunk so that weight
// never blocks the hero/LCP paint on first load.
const CodeShowcase = lazy(() => import("../components/CodeShowcase"));

function findAnchorTarget(hash) {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null; // malformed %-escape in the URL — ignore rather than crash
  }
}

export default function Home() {
  const { hash, key } = useLocation();

  // `key` changes on every navigation, so clicking the same nav link a second
  // time (same hash) still scrolls back to the section instead of doing nothing.
  useEffect(() => {
    if (!hash) return undefined;
    const el = findAnchorTarget(hash);
    if (!el) return undefined;
    const raf = requestAnimationFrame(() =>
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    );
    return () => cancelAnimationFrame(raf);
  }, [hash, key]);

  return (
    <>
      <Hero />
      <ScrollCue />
      <StatsStrip />
      <TechMarquee />
      <About />
      <Projects />
      <Skills />
      <Journey />
      <Process />
      <Suspense fallback={null}>
        <CodeShowcase />
      </Suspense>
      <BuildLog />
      <FAQ />
      <Contact />
    </>
  );
}
