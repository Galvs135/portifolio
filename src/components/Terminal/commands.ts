import type { Lang } from "../../i18n/LanguageContext";
import { projects } from "../../data/projects";
import { EMAIL, PHONE_DISPLAY, socials } from "../../data/socials";

export type Tone = "default" | "dim" | "accent";

export interface TermLine {
  text: string;
  tone?: Tone;
}

export type CommandAction =
  | "clear"
  | "exit"
  | "resume"
  | "site"
  | "terminal"
  | "ptbr"
  | "en";

export interface Command {
  description: string;
  /** Static output (data commands). */
  lines?: TermLine[];
  /** Side-effect commands handled by the Terminal. */
  action?: CommandAction;
}

const link = (s: { label: string; href: string }): TermLine => ({
  text: `${s.label.toLowerCase().padEnd(10)} ${s.href}`,
});

/**
 * Command registry for a given language — single source of truth.
 * `help` lists every entry here; `getCommands` is memoized by the Terminal.
 */
export function getCommands(lang: Lang): Record<string, Command> {
  const t = (en: string, pt: string) => (lang === "pt" ? pt : en);

  return {
    about: {
      description: t("Who I am and what I do", "Quem sou eu e o que faço"),
      lines: [
        { text: "Lucas Galvão França — Data & AI Engineer", tone: "accent" },
        { text: "Belo Horizonte, Brazil", tone: "dim" },
        { text: "" },
        {
          text: t(
            "Data & AI Engineer | .NET & Azure Specialist with 4+ years of experience designing and developing scalable data-driven and backend solutions using C#, .NET, Python, SQL, and cloud technologies. Experienced in building and optimizing data integration workflows, automation processes, RESTful APIs, microservices, and distributed systems in Azure and AWS environments. Strong background in CI/CD pipelines, cloud architecture, data processing, and integration of multiple data sources.",
            "Engenheiro de Dados & IA | Especialista em .NET & Azure com 4+ anos de experiência projetando e desenvolvendo soluções de backend e orientadas a dados escaláveis usando C#, .NET, Python, SQL e tecnologias de nuvem. Experiência em construir e otimizar fluxos de integração de dados, processos de automação, APIs RESTful, microsserviços e sistemas distribuídos em ambientes Azure e AWS. Sólida vivência em pipelines de CI/CD, arquitetura de nuvem, processamento de dados e integração de múltiplas fontes."
          ),
        },
        { text: "" },
        {
          text: t(
            "Hands-on experience developing AI-powered solutions using RAG architectures, embeddings, NLP, and LLM integrations to improve operational efficiency and decision-making. Skilled in designing high-performance applications, implementing authentication and security standards (OAuth 2.0/OpenID Connect), and supporting data-centric solutions with focus on scalability, reliability, and maintainability.",
            "Experiência prática no desenvolvimento de soluções com IA usando arquiteturas RAG, embeddings, NLP e integrações com LLMs para melhorar a eficiência operacional e a tomada de decisão. Habilidade em projetar aplicações de alta performance, implementar padrões de autenticação e segurança (OAuth 2.0/OpenID Connect) e dar suporte a soluções centradas em dados com foco em escalabilidade, confiabilidade e manutenibilidade."
          ),
        },
        { text: "" },
        {
          text: t(
            "Proficient in Azure DevOps, Git, Docker, PostgreSQL, relational and NoSQL databases, Clean Architecture, SOLID principles, and agile methodologies. Comfortable collaborating with technical and non-technical stakeholders in cross-functional and international environments.",
            "Proficiente em Azure DevOps, Git, Docker, PostgreSQL, bancos relacionais e NoSQL, Clean Architecture, princípios SOLID e metodologias ágeis. Confortável colaborando com stakeholders técnicos e não técnicos em ambientes multifuncionais e internacionais."
          ),
          tone: "dim",
        },
      ],
    },
    contact: {
      description: t("Ways to reach me", "Como falar comigo"),
      lines: [
        { text: t("Let's talk:", "Vamos conversar:"), tone: "accent" },
        { text: "" },
        { text: `email      ${EMAIL}` },
        { text: `whatsapp   ${PHONE_DISPLAY}` },
        ...socials
          .filter((s) => s.icon === "github" || s.icon === "linkedin")
          .map(link),
      ],
    },
    works: {
      description: t("My work at Capys IT", "Meu trabalho na Capys IT"),
      lines: [
        {
          text: t(
            "Capys IT — Software Engineer (03/2023 — present)",
            "Capys IT — Software Engineer (03/2023 — atual)"
          ),
          tone: "accent",
        },
        { text: "" },
        {
          text: t(
            "• Real-time CRM notification microservice (C#/.NET) —",
            "• Microsserviço de notificações em tempo real (C#/.NET) —"
          ),
        },
        {
          text: t(
            "  automated reports and alerts, -70% manual monitoring.",
            "  relatórios e alertas automatizados, -70% de monitoramento manual."
          ),
          tone: "dim",
        },
        {
          text: t(
            "• AI conversational analysis on WhatsApp (RAG, embeddings,",
            "• Análise conversacional com IA no WhatsApp (RAG, embeddings,"
          ),
        },
        {
          text: t(
            "  Gemini) — -40% response-handling time.",
            "  Gemini) — -40% no tempo de atendimento."
          ),
          tone: "dim",
        },
        {
          text: t(
            "• SSO with AWS Cognito (OAuth 2.0 / OpenID Connect).",
            "• SSO com AWS Cognito (OAuth 2.0 / OpenID Connect)."
          ),
        },
        {
          text: t(
            "• CI/CD pipelines on Azure DevOps — ~60% faster deploys.",
            "• Pipelines de CI/CD no Azure DevOps — deploys ~60% mais rápidos."
          ),
        },
        {
          text: t(
            "• Card payments integration (Granito, Banco Inter).",
            "• Integração de pagamentos com cartão (Granito, Banco Inter)."
          ),
        },
        {
          text: t(
            "• Legacy engine modernization .NET 4.8 → .NET 8 —",
            "• Modernização de engine legado .NET 4.8 → .NET 8 —"
          ),
        },
        {
          text: t(
            "  runtime from 48 → 17 min (-65%).",
            "  execução de 48 → 17 min (-65%)."
          ),
          tone: "dim",
        },
      ],
    },
    projects: {
      description: t("My repositories", "Meus repositórios"),
      lines: [
        { text: t("Repositories:", "Repositórios:"), tone: "accent" },
        { text: "" },
        ...projects.flatMap((p): TermLine[] => [
          { text: `${p.title}  (${p.year})` },
          {
            text: `  ${p.href ?? t("private repository", "repositório privado")}`,
            tone: "dim",
          },
        ]),
      ],
    },
    skill: {
      description: t("My skills", "Minhas skills"),
      lines: [
        { text: "Skills:", tone: "accent" },
        { text: "" },
        { text: t("Languages", "Linguagens").padEnd(11) + " TypeScript · C# · JavaScript · SQL" },
        { text: "Backend".padEnd(11) + " Node.js · .NET · REST APIs · RabbitMQ" },
        { text: "Frontend".padEnd(11) + " React · Three.js · GSAP · HTML / CSS" },
        { text: t("Data", "Dados").padEnd(11) + " PostgreSQL · MongoDB · Observability" },
        { text: t("Practices", "Práticas").padEnd(11) + " SOLID · Clean Code · CI/CD · Scrum" },
      ],
    },
    site: {
      description: t("Load the full portfolio site", "Carrega o portfólio completo"),
      action: "site",
    },
    terminal: {
      description: t(
        "Back to the full-screen terminal",
        "Volta ao terminal em tela cheia"
      ),
      action: "terminal",
    },
    resume: {
      description: t("Download my resume (CV)", "Baixa meu currículo (CV)"),
      action: "resume",
    },
    ptbr: {
      description: t("Switch to Portuguese (BR)", "Muda para Português (BR)"),
      action: "ptbr",
    },
    en: {
      description: t("Switch to English", "Muda para inglês"),
      action: "en",
    },
    clear: {
      description: t("Clear the terminal (or cls)", "Limpa o terminal (ou cls)"),
      action: "clear",
    },
    exit: {
      description: t("Leave the terminal", "Sai do terminal"),
      action: "exit",
    },
    help: {
      description: t("List all commands", "Lista todos os comandos"),
    },
  };
}

/** Aliases → canonical command name. */
export const aliases: Record<string, string> = {
  cls: "clear",
  skills: "skill",
  "pt-br": "ptbr",
  pt: "ptbr",
  english: "en",
};
