import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS } from "../data/projects";
import { useMode } from "../hooks/useMode";
import { useClickSound } from "../hooks/useClickSound";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone/.test(navigator.platform ?? "");

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const [mode, setMode] = useMode();
  const playClick = useClickSound();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const goHome = useCallback(
    (hash) => {
      navigate(hash ? `/${hash}` : "/");
    },
    [navigate]
  );

  const commands = useMemo(
    () => [
      { id: "home", label: "Go Home", hint: "Hero", action: () => goHome() },
      { id: "about", label: "About", hint: "Section", action: () => goHome("#about") },
      { id: "projects", label: "Projects", hint: "Section", action: () => goHome("#projects") },
      { id: "skills", label: "Skills", hint: "Section", action: () => goHome("#skills") },
      { id: "journey", label: "Journey", hint: "Section", action: () => goHome("#journey") },
      { id: "process", label: "Process", hint: "Section", action: () => goHome("#process") },
      { id: "code", label: "Code", hint: "Section", action: () => goHome("#code") },
      { id: "faq", label: "FAQ", hint: "Section", action: () => goHome("#faq") },
      { id: "resume-page", label: "Interactive Resume", hint: "Page", action: () => navigate("/resume") },
      { id: "contact", label: "Contact", hint: "Section", action: () => goHome("#contact") },
      ...PROJECTS.map((p) => ({
        id: `case-${p.id}`,
        label: `${p.name} — Case Study`,
        hint: "Project",
        action: () => navigate(`/project/${p.id}`),
      })),
      {
        id: "resume",
        label: "Download Resume",
        hint: "PDF",
        action: () => {
          const a = document.createElement("a");
          a.href = `${import.meta.env.BASE_URL}resume.pdf`;
          a.download = "";
          a.click();
        },
      },
      {
        id: "theme",
        label: `Switch to ${mode === "light" ? "Dark" : "Light"} Mode`,
        hint: "Toggle",
        action: () => setMode(mode === "light" ? "dark" : "light"),
      },
      {
        id: "github",
        label: "Open GitHub Profile",
        hint: "External",
        action: () => window.open("https://github.com/YSabbahy", "_blank", "noopener"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn Profile",
        hint: "External",
        action: () => window.open("https://www.linkedin.com/in/youssef-sabbahy-cs", "_blank", "noopener"),
      },
    ],
    [goHome, mode, navigate, setMode]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const run = useCallback(
    (cmd) => {
      if (!cmd) return;
      playClick();
      cmd.action();
      close();
    },
    [close, playClick]
  );

  useEffect(() => {
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => window.removeEventListener("open-command-palette", onOpenEvent);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && e.key?.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (filtered.length === 0) return;
        const next =
          e.key === "ArrowDown"
            ? Math.min(activeIndex + 1, filtered.length - 1)
            : Math.max(activeIndex - 1, 0);
        setActiveIndex(next);
        // Keep the highlighted row inside the scrollable list when navigating
        // with the keyboard (the list is capped at 50vh, so rows past the
        // fold used to be selected while off-screen).
        listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Tab") {
        // Keep focus inside the palette's input instead of tabbing into the
        // page hidden behind the overlay.
        e.preventDefault();
      } else if (e.key === "Enter") {
        e.preventDefault();
        run(filtered[activeIndex]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close, filtered, activeIndex, run]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="cmdk-overlay" onMouseDown={close} role="presentation">
      <div
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cmdk-input-row">
          <span className="cmdk-icon" aria-hidden="true">
            ⌘
          </span>
          <input
            ref={inputRef}
            autoFocus
            className="cmdk-input"
            type="text"
            placeholder="Type a command or search…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            aria-label="Search commands"
          />
          <kbd className="cmdk-kbd">Esc</kbd>
        </div>
        <ul className="cmdk-list" role="listbox" ref={listRef}>
          {filtered.length === 0 && <li className="cmdk-empty">No matching commands.</li>}
          {filtered.map((cmd, index) => (
            <li key={cmd.id}>
              <button
                type="button"
                className={`cmdk-item${index === activeIndex ? " is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => run(cmd)}
                tabIndex={-1}
                role="option"
                aria-selected={index === activeIndex}
              >
                <span>{cmd.label}</span>
                <span className="cmdk-hint">{cmd.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
