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

## Deployment note

Asset paths (`/images/...`, `/resume.pdf`, `/favicon.svg`) are root-relative,
assuming the app is deployed at the domain root. If you deploy under a
sub-path, set Vite's `base` option in `vite.config.js` accordingly.
