import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.css";
import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import CursorDot from "./components/CursorDot";
import BackgroundFX from "./components/BackgroundFX";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CommandPalette from "./components/CommandPalette";
import EasterEgg from "./components/EasterEgg";
import ScrollToTop from "./components/ScrollToTop";
import { AppearanceProvider } from "./context/AppearanceProvider";

// Home is the landing route for most visits, so it stays eagerly bundled.
// CaseStudy and Resume are secondary routes — split them into their own
// chunks so a first-time visitor on "/" never pays for their JS.
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Resume = lazy(() => import("./pages/Resume"));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppearanceProvider>
        <ScrollToTop />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Preloader />
        <ScrollProgress />
        <CursorDot />
        <BackgroundFX />
        <Navbar />
        <CommandPalette />
        <EasterEgg />
        <main id="main-content">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<CaseStudy />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </AppearanceProvider>
    </BrowserRouter>
  );
}
