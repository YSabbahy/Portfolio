const BASE = import.meta.env.BASE_URL;

export const PROJECTS = [
  {
    id: "kemet-protocol",
    name: "Kemet Protocol",
    liveUrl: "https://ysabbahy.github.io/Kemet_Protocol/",
    codeUrl: "https://github.com/YSabbahy/Kemet_Protocol",
    image: `${BASE}images/kemet-thumb.webp`,
    imageAlt: "Kemet Protocol — interactive ancient Egypt data archive",
    width: 1365,
    height: 627,
    description:
      'A sci-fi terminal interface over real ancient-Egyptian history — decoded "data archive" files on the Sphinx, the pyramids and the Rosetta Stone, with an in-page AI chat, sound and animated stats.',
    tags: ["CSS3", "JavaScript", "Interactive"],
  },
  {
    id: "essence",
    name: "Essence",
    liveUrl: "https://ysabbahy.github.io/Essence-project/",
    codeUrl: "https://github.com/YSabbahy/Essence-project",
    image: `${BASE}images/essence-thumb.webp`,
    imageAlt: "Essence — luxury fragrance e-commerce site",
    width: 1400,
    height: 819,
    description:
      "A full luxury fragrance storefront — product catalog, dark mode, cart, checkout flow and auth pages, built as a cohesive multi-page e-commerce experience.",
    tags: ["HTML5", "CSS3", "E-commerce"],
  },
  {
    id: "matchday",
    name: "MATCHDAY",
    liveUrl: "https://ysabbahy.github.io/MATCHDAY/",
    codeUrl: "https://github.com/YSabbahy/MATCHDAY",
    image: `${BASE}images/matchday-thumb.webp`,
    imageAlt: "MATCHDAY — football shirts e-commerce site",
    width: 1365,
    height: 627,
    description:
      "A full e-commerce storefront for club and national team football shirts — retro classics and modern kits, with cart, checkout and dark mode.",
    tags: ["HTML5", "CSS3", "E-commerce"],
  },
  {
    id: "orbitax",
    name: "OrbitaX",
    liveUrl: "https://ysabbahy.github.io/OrbitaX/",
    codeUrl: "https://github.com/YSabbahy/OrbitaX",
    image: `${BASE}images/orbitax-thumb.webp`,
    imageAlt: "OrbitaX — sci-fi space-tourism landing page",
    width: 1365,
    height: 626,
    description:
      "A sci-fi space-tourism landing page — pricing tiers, crew profiles, testimonials and a live mission-timeline section, styled with a cyan Tailwind theme.",
    tags: ["Tailwind CSS", "Landing Page"],
  },
];
