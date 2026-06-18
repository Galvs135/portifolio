interface Bilingual {
  en: string;
  pt: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  role: Bilingual;
  description: Bilingual;
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
    role: { en: "Full-stack / Architecture", pt: "Full-stack / Arquitetura" },
    description: {
      en: "A CRM tailored for law firms — case management, client pipelines and document workflows built for day-to-day legal operations.",
      pt: "Um CRM sob medida para escritórios de advocacia — gestão de casos, funis de clientes e fluxos de documentos para a operação jurídica do dia a dia.",
    },
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    href: "https://github.com/galvs135/legacies",
    colors: ["#2b2b2b", "#6e6e6e"],
  },
  {
    id: "logsense",
    title: "LogSense",
    year: "2025",
    role: { en: "Backend / Distributed Systems", pt: "Backend / Sistemas Distribuídos" },
    description: {
      en: "Error diagnostics for distributed systems — aggregates, correlates and surfaces failures across services so teams find root causes faster.",
      pt: "Diagnóstico de erros para sistemas distribuídos — agrega, correlaciona e expõe falhas entre serviços para os times acharem a causa raiz mais rápido.",
    },
    stack: ["C#", ".NET", "Observability", "Microservices"],
    href: "https://github.com/galvs135/LogSense",
    colors: ["#1d1d22", "#4f4f63"],
  },
  {
    id: "telegram-bot",
    title: "n8n Telegram Bot",
    year: "2024",
    role: { en: "Automation / Integrations", pt: "Automação / Integrações" },
    description: {
      en: "A conversational automation built on n8n that wires a Telegram chatbot to external services and workflows with zero glue-code servers.",
      pt: "Uma automação conversacional no n8n que conecta um chatbot do Telegram a serviços e fluxos externos sem servidores de cola.",
    },
    stack: ["n8n", "Telegram API", "Webhooks", "Automation"],
    href: "https://github.com/galvs135/n8n-chatbot-Telegram",
    colors: ["#22231d", "#5b6045"],
  },
  {
    id: "playground",
    title: "WebGL Playground",
    year: "2026",
    role: { en: "Creative Development", pt: "Desenvolvimento Criativo" },
    description: {
      en: "An ongoing lab of shaders, GPU particles and motion experiments — the place where the interactions on this very site are prototyped.",
      pt: "Um laboratório contínuo de shaders, partículas em GPU e experimentos de movimento — onde as interações deste site são prototipadas.",
    },
    stack: ["Three.js", "GLSL", "GSAP", "WebGL"],
    colors: ["#241d22", "#63455b"],
  },
];
