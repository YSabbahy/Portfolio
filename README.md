# Youssef Sabbahy — Portfolio (React + Vite)

This is a React/Vite port of the original vanilla HTML/CSS/JS portfolio. The
visual design, layout, and every interaction from the original site are
preserved exactly — only the implementation moved from raw DOM scripting to
React components and hooks.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

## Testing

`tests/` holds two Playwright end-to-end suites covering project filtering,
theme/mode sync between the appearance panel and the command palette,
cursor/overlay stacking, scroll restoration, mobile menu `inert` behavior,
and persistence. One-time setup:

```bash
pip install -r tests/requirements.txt
playwright install chromium
```

Then, from the project root:

```bash
npm run test:e2e
```

This builds the site, serves it on `http://localhost:4173/Portfolio/`, runs
both suites against it, and tears the server down automatically. To iterate
faster against a server you already have running, use
`npm run test:e2e:run` directly.

## Deploy to GitHub Pages (automatic)

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds and deploys the site automatically on every push to `main`.

One-time setup after creating the repo (name it **Portfolio** exactly, to
match `base: '/Portfolio/'` in `vite.config.js`):

1. Push this project to `github.com/<your-username>/Portfolio`.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push any commit to `main` (or re-run the workflow from the **Actions** tab)
   — the site will be published at `https://<your-username>.github.io/Portfolio/`.

## Project structure

```
public/
  images/            static image assets (served as-is, unprocessed)
  resume.pdf
  favicon.svg
src/
  app.css            the site's compiled stylesheet (Tailwind output + custom
                      CSS), carried over unchanged to guarantee pixel-identical
                      design — see note below
  data/               content data (nav links, projects, skills)
  hooks/              reusable behavior: theme/mode, cursor, particles,
                      magnetic buttons, reveal-on-scroll, count-up, etc.
  components/         one component per section/UI piece (Navbar, Hero,
                      Projects, Skills, Contact, Footer, ...)
  App.jsx             assembles the page
  main.jsx            React entry point
```

## Why `app.css` is kept as a compiled file

The original project used Tailwind CSS v4 compiled ahead of time into
`css/app.min.css`, plus a large block of hand-written CSS (custom cursor,
particle canvas, theme/mode color variables, card tilt effects, marquee,
keyframe animations, etc.). That compiled file is copied into this project
unchanged as `src/app.css` and imported once in `App.jsx`.

This was a deliberate choice to satisfy the "preserve the exact design"
requirement with zero risk of visual drift: re-deriving a Tailwind v4 build
pipeline (with the project's custom theme tokens, `data-theme`/`data-mode`
variants, and dozens of hand-tuned keyframes) could easily introduce subtle
pixel differences. All the original class names are used unchanged in the
JSX, so the stylesheet applies exactly as it did before.

## Functionality parity

Every interactive feature from the original `js/script.min.js` has a React
equivalent:

- Preloader, scroll-progress bar, animated hero particle canvas
- Accent theme (red/green/blue) + light/dark mode, persisted to localStorage
- Custom cursor (dot + trailing ring) with per-element hover states
- Magnetic buttons, project-card 3D tilt/spotlight, hero portrait tilt
- Nav "beam" pill that follows hover/active section, mobile menu
- Scroll-reveal animations, staggered project-card grid entrance
- Animated stats count-up, scrolling tech marquee, UI click sound
- Cycling headline word (typewriter effect), scroll cue, dynamic footer year

All of these respect `prefers-reduced-motion` and `pointer: fine`/`hover: hover`
media capabilities exactly as the original did.

## What's new since the original port

- **Routing** — React Router now drives the app. Every project has a real
  `/project/:id` case-study page, plus `/resume` for an interactive resume.
  A GitHub Pages SPA redirect (`public/404.html` + a decode script in
  `index.html`) makes deep links and page refreshes work correctly once
  deployed.
- **Case studies** — `src/data/caseStudies.js` holds honest, non-fabricated
  write-ups for all four real projects (Essence, RaceCore, OrbitaX, Kemet
  Protocol), each with its own page (Overview, Experience, Design Direction,
  Key Features, Technical Implementation, Challenges, Result).
- **Command Palette** — `Ctrl/Cmd + K` (or the ⌘K button in the navbar) opens
  a searchable command list: jump to any section, open a case study, toggle
  theme, download the résumé, or open GitHub/LinkedIn.
- **New content sections** — expanded About, a Journey timeline
  (`src/data/journey.js`), a How-I-Work Process grid, a Playground of small
  original UI experiments, a live GitHub activity feed (Build Log, via the
  public GitHub events API), and an FAQ accordion.
- **PWA** — `public/site.webmanifest` (paths fixed to match the `/Portfolio/`
  base), `public/sw.js` (a conservative offline-fallback service worker,
  registered in `main.jsx`) and `public/offline.html`.
- **Easter egg** — type `kemet` anywhere on the page.
- **Accessibility** — a skip-to-content link and a `<main>` landmark were
  added around the routed page content.

None of this changes the four real projects themselves — RaceCore, Essence,
OrbitaX and Kemet Protocol are described only from their own README/source,
never invented. See `src/data/caseStudies.js` for exactly what's claimed
about each.

## Deployment note

The site is served from a sub-path: `base: '/Portfolio/'` in `vite.config.js`
(so the repo must be named **Portfolio**). All asset URLs in the code go through
`import.meta.env.BASE_URL`, so they follow that setting automatically.

> The "Deploy to GitHub Pages (automatic)" section above refers to
> `.github/workflows/deploy.yml`. That file was **not** part of the project
> archive this README shipped with — check that it exists in your repo, or
> deploy the `dist/` folder manually.

## Architecture notes (read before changing these areas)

- **Appearance state is shared.** Light/dark mode and accent colour live in
  ONE place, `src/context/AppearanceProvider.jsx`. `useMode()` / `useTheme()`
  read from it. Never re-implement them with local `useState` — two copies of
  the state drift apart (this used to break the ⌘K "Switch mode" command).
- **Project cards start invisible.** The stylesheet hides `.project-card` until
  it gets the `is-in` class. `useProjectGridStagger` adds it, and `Projects.jsx`
  re-keys the grid on every filter change so newly rendered cards are always
  revealed. If you add another way to change which cards render, keep that in
  mind.
- **Custom cursor stacking.** `.cursor-dot` / `.cursor-ring` sit at
  `z-index: 9999`, above every overlay (command palette 4000, easter egg 4500,
  preloader 5000). Any new overlay must stay below that or the pointer vanishes.
- **Service worker** runs only in production builds and only handles
  same-origin requests (cross-origin calls such as the GitHub API bypass it).
