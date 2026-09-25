export const SKILL_GROUPS = [
  {
    id: "frontend",
    title: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Tailwind CSS"],
  },
  {
    id: "tools",
    title: "Tools & Ecosystem",
    items: ["Vite", "React Router", "Git & GitHub"],
  },
  {
    id: "programming",
    title: "Programming",
    items: ["C++"],
  },
];

export const ALL_SKILLS = SKILL_GROUPS.flatMap((group) => group.items);
