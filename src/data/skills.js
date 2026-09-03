export const SKILL_GROUPS = [
  {
    id: "languages",
    title: "Languages & Markup",
    items: ["HTML5", "CSS3", "JavaScript (ES6+)"],
  },
  {
    id: "frameworks",
    title: "Frameworks & Styling",
    items: ["React", "Tailwind CSS", "Responsive Design"],
  },
  {
    id: "craft",
    title: "Craft & Tooling",
    items: ["Motion & Micro-interactions", "Git & GitHub", "Cross-browser QA"],
  },
];

export const ALL_SKILLS = SKILL_GROUPS.flatMap((group) => group.items);
