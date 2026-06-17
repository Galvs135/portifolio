export interface Project {
  id: string;
  title: string;
  year: string;
  role: string;
  description: string;
  stack: string[];
  href?: string;
  /** Two hex colors used for the generated WebGL gradient thumbnail. */
  colors: [string, string];
}

/**
 * Edit this file to manage the work showcased on the site.
 * `colors` drives the procedural WebGL thumbnail (no image assets required),
 * but you can later swap in real screenshots under /public/images.
 */
export const projects: Project[] = [
  {
    id: "legacies",
    title: "Legacies",
    year: "2025",
    role: "Full-stack / Architecture",
    description:
      "A CRM tailored for law firms — case management, client pipelines and document workflows built for day-to-day legal operations.",
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    href: "https://github.com/galvs135/legacies",
    colors: ["#2b2b2b", "#6e6e6e"],
  },
  {
    id: "logsense",
    title: "LogSense",
    year: "2025",
    role: "Backend / Distributed Systems",
    description:
      "Error diagnostics for distributed systems — aggregates, correlates and surfaces failures across services so teams find root causes faster.",
    stack: ["C#", ".NET", "Observability", "Microservices"],
    href: "https://github.com/galvs135/LogSense",
    colors: ["#1d1d22", "#4f4f63"],
  },
  {
    id: "telegram-bot",
    title: "n8n Telegram Bot",
    year: "2024",
    role: "Automation / Integrations",
    description:
      "A conversational automation built on n8n that wires a Telegram chatbot to external services and workflows with zero glue-code servers.",
    stack: ["n8n", "Telegram API", "Webhooks", "Automation"],
    href: "https://github.com/galvs135/n8n-chatbot-Telegram",
    colors: ["#22231d", "#5b6045"],
  },
  {
    id: "playground",
    title: "WebGL Playground",
    year: "2026",
    role: "Creative Development",
    description:
      "An ongoing lab of shaders, GPU particles and motion experiments — the place where the interactions on this very site are prototyped.",
    stack: ["Three.js", "GLSL", "GSAP", "WebGL"],
    colors: ["#241d22", "#63455b"],
  },
];
