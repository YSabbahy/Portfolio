import "./app.css";
import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import CursorDot from "./components/CursorDot";
import BackgroundFX from "./components/BackgroundFX";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ScrollCue from "./components/ScrollCue";
import StatsStrip from "./components/StatsStrip";
import TechMarquee from "./components/TechMarquee";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <CursorDot />
      <BackgroundFX />
      <Navbar />
      <Hero />
      <ScrollCue />
      <StatsStrip />
      <TechMarquee />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
