// Case study content. Every line here is either drawn from the project's own
// README/source, or from facts Youssef gave directly about his own project.
// Nothing here should ever claim a client, a user base, real payments, or a
// business result — these are personal/demo builds, and are described as such.

export const CASE_STUDIES = {
  "kemet-protocol": {
    overview:
      'Kemet Protocol reframes ancient-Egyptian history as a sci-fi "data archive" — a terminal-style interface you explore instead of a page you scroll past. The Sphinx, the pyramids and the Rosetta Stone are each presented as a decoded file, with an in-page AI chat, ambient sound and animated stats woven through the experience.',
    type: "Interactive Experience",
    technologies: ["CSS3", "JavaScript"],
    experience: [
      "Browse the pyramids, the Sphinx and the Rosetta Stone as \"decoded data archive\" files rather than a traditional history page",
      "Chat with an in-page AI interface built into the terminal aesthetic",
      "Ambient sound and animated stat counters run through the experience",
      "A Neo-Pharaonic, gold-on-dark visual identity with a custom cursor and typewriter-style text reveals",
    ],
    designDirection:
      "A deliberate clash of two eras — futuristic terminal UI conventions layered over genuine ancient-Egyptian subject matter — carried through a dark, gold-accented palette rather than a generic museum-site look.",
    keyFeatures: [
      "Sci-fi \"data archive\" framing for real historical content",
      "In-page AI chat interface",
      "Animated stat counters and ambient audio",
      "Custom cursor and typewriter text-reveal detailing",
    ],
    technicalImplementation:
      "Built with vanilla CSS3 and JavaScript — no framework — and deployed as a static site on GitHub Pages, which is what let the terminal/typewriter effects and custom cursor be hand-tuned at the DOM level.",
    challenges:
      "Keeping a heavily-themed, animation-and-audio-driven interface readable and fast on a static-site stack, without a framework to lean on for state management.",
    result:
      "A live, deployed concept piece that's the most visually distinct project in the portfolio — built to prove that a personal project can look and feel like a shipped product, not a template.",
  },

  racecore: {
    overview:
      "RaceCore is a fully-wired React storefront demo for superbikes and racing gear. The README's own framing is the most honest way to put it: every link in the header, footer, mobile menu and product cards goes to a real page — nothing is a dead `#` link.",
    type: "React E-commerce (Frontend Demo)",
    technologies: ["React", "Vite", "Tailwind CSS", "React Router"],
    experience: [
      "Shop (/shop) — full catalog with category, subcategory, a search query (?q=) and price sorting",
      "Product pages (/product/:slug) — image gallery, quantity picker, add to cart, wishlist toggle, related products",
      "Cart (/cart) — persists in the browser via localStorage, with quantity editing and live totals",
      "Checkout (/checkout) → Order Confirmation — a validated form that generates an order ID",
      "Wishlist (/wishlist) — the heart icon on any product saves it here",
      "A search overlay from the header icon that filters the shop live",
      "Account (/account) — demo sign in / sign up, stored on-device only",
      "Contact, Events (with working Register buttons), Track Days, Warranty, a searchable Dealers page, and footer info pages (/info/:slug)",
      "A proper custom 404 page for any unknown route",
    ],
    designDirection:
      "A black-and-red motorsport palette with bold, condensed headline type over full-bleed bike photography — built around real navigation rather than mockup screens, so clicking anything in the site actually goes somewhere.",
    keyFeatures: [
      "Zero dead links across header, footer, mobile menu and product cards",
      "Full catalog with filtering, subcategories and price sorting",
      "Cart, wishlist and demo account state persisted client-side via localStorage",
      "Validated checkout flow that produces an order confirmation",
    ],
    technicalImplementation:
      "Routing is handled with React Router across every page listed above. Cart, wishlist and account state live in a StoreContext and persist to localStorage. There is intentionally no backend: checkout does not charge a real card, and the account system is on-device only. The README notes that wiring in real payments, auth or an inventory database is a matter of swapping the demo logic in StoreContext.jsx, Checkout.jsx and Account.jsx for real API calls.",
    challenges:
      "Making a frontend-only demo feel complete — every navigational path (header, footer, mobile menu, product cards) had to lead to a real, working page instead of a placeholder, which is normally the first thing left unfinished in a portfolio e-commerce project.",
    result:
      "A demo storefront where the frontend is fully navigable end-to-end. By the project's own design, it's structured so a real backend (Stripe for payments, a proper auth provider, a database) could be wired in later without restructuring the frontend.",
  },

  essence: {
    overview:
      "Essence is a full luxury fragrance storefront — a cohesive, multi-page e-commerce experience covering the whole shopping flow from product catalog to checkout.",
    type: "E-commerce",
    technologies: ["HTML5", "CSS3"],
    experience: [
      "A product catalog styled for a luxury fragrance brand",
      "Dark mode",
      "Cart",
      "Checkout flow",
      "Auth pages (sign in / sign up)",
    ],
    designDirection:
      "A premium, editorial presentation befitting a fragrance brand — the multi-page structure was built to feel like a cohesive site rather than a single scrolling landing page.",
    keyFeatures: [
      "Multi-page catalog and product presentation",
      "Dark mode toggle",
      "Cart and checkout flow",
      "Auth pages (frontend only)",
    ],
    technicalImplementation:
      "Built with HTML5 and CSS3 as a multi-page static site — no backend, no framework. Cart, checkout and auth are frontend flows rather than being wired to a real payment processor, database or user system.",
    challenges:
      "Keeping a multi-page static site visually and structurally consistent across the catalog, cart, checkout and auth pages without a component framework to share layout logic.",
    result:
      "A complete, browsable luxury e-commerce front end — every core page in the shopping flow exists and is styled, not just the homepage.",
  },

  orbitax: {
    overview:
      "OrbitaX is a sci-fi space-tourism landing page — pricing tiers, crew profiles, testimonials and a live mission-timeline section, styled around a cyan Tailwind theme.",
    type: "Landing Page",
    technologies: ["Tailwind CSS"],
    experience: [
      "Pricing tiers for the (fictional) space-tourism offering",
      "Crew profile cards",
      "A testimonials section",
      "A live mission-timeline section",
    ],
    designDirection:
      "A cyan-accented, sci-fi visual identity built entirely with Tailwind CSS utility classes — the goal was a landing page with a strong single visual concept rather than a general-purpose template.",
    keyFeatures: [
      "Pricing tier layout",
      "Crew profile section",
      "Testimonials section",
      "Animated mission-timeline component",
    ],
    technicalImplementation:
      "Built as a single-page site styled entirely with Tailwind CSS, focused on responsive layout and visual hierarchy across the pricing, crew, testimonial and timeline sections.",
    challenges:
      "Designing a landing page around a single strong concept (space tourism) while keeping the pricing/crew/testimonial/timeline sections visually distinct from each other on one page.",
    result:
      "A polished, single-concept landing page live on GitHub Pages, used in the portfolio to show Tailwind-driven visual design work distinct from the e-commerce projects.",
  },
};
