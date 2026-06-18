import { projects } from "../../data/projects";
import { EMAIL, PHONE_DISPLAY, socials } from "../../data/socials";

export type Tone = "default" | "dim" | "accent";

export interface TermLine {
  text: string;
  tone?: Tone;
}

export type CommandAction = "clear" | "exit" | "resume";

export interface Command {
  description: string;
  /** Static output (data commands). */
  lines?: TermLine[];
  /** Side-effect commands handled by the Terminal (clear/exit/download). */
  action?: CommandAction;
}

const link = (s: { label: string; href: string }): TermLine => ({
  text: `${s.label.toLowerCase().padEnd(10)} ${s.href}`,
});

/**
 * Command registry — single source of truth (still mocked content).
 * Swap the `lines` for real data later; `help` lists everything here.
 */
export const commands: Record<string, Command> = {
  about: {
    description: "Fala sobre mim",
    lines: [
      { text: "Lucas Galvão França — Software Engineer", tone: "accent" },
      { text: "Belo Horizonte, Brasil", tone: "dim" },
      { text: "" },
      { text: "4 anos no ecossistema .NET (C#) construindo backends" },
      { text: "escaláveis, microsserviços e automação — da ideia à produção." },
      { text: "SOLID, Clean Architecture e DDD. MBA em IA & Automação." },
    ],
  },
  contact: {
    description: "Meus contatos",
    lines: [
      { text: "Vamos conversar:", tone: "accent" },
      { text: "" },
      { text: `email      ${EMAIL}` },
      { text: `whatsapp   ${PHONE_DISPLAY}` },
      ...socials
        .filter((s) => s.icon === "github" || s.icon === "linkedin")
        .map(link),
    ],
  },
  works: {
    description: "Minhas tarefas na Capys IT",
    lines: [
      { text: "Capys IT — Software Engineer (03/2023 — atual)", tone: "accent" },
      { text: "" },
      { text: "• Microsserviço de notificações em tempo real (C#/.NET) —" },
      { text: "  automação de relatórios e alertas, -70% de monitoramento manual.", tone: "dim" },
      { text: "• Análise conversacional com IA no WhatsApp (RAG, embeddings," },
      { text: "  Gemini) — -40% no tempo de atendimento.", tone: "dim" },
      { text: "• SSO com AWS Cognito (OAuth 2.0 / OpenID Connect)." },
      { text: "• Pipelines CI/CD no Azure DevOps — deploys ~60% mais rápidos." },
      { text: "• Integração de pagamentos (Granito, Banco Inter)." },
      { text: "• Modernização de engine legado .NET 4.8 → .NET 8 —" },
      { text: "  execução de 48 → 17 min (-65%).", tone: "dim" },
    ],
  },
  projects: {
    description: "Meus repositórios",
    lines: [
      { text: "Repositórios:", tone: "accent" },
      { text: "" },
      ...projects.flatMap((p): TermLine[] => [
        { text: `${p.title}  (${p.year})` },
        { text: `  ${p.href ?? "repositório privado"}`, tone: "dim" },
      ]),
    ],
  },
  skill: {
    description: "Minhas skills",
    lines: [
      { text: "Skills:", tone: "accent" },
      { text: "" },
      { text: "Languages   TypeScript · C# · JavaScript · SQL" },
      { text: "Backend     Node.js · .NET · REST APIs · RabbitMQ" },
      { text: "Frontend    React · Three.js · GSAP · HTML / CSS" },
      { text: "Data        PostgreSQL · MongoDB · Observability" },
      { text: "Practices   SOLID · Clean Code · CI/CD · Scrum" },
    ],
  },
  resume: {
    description: "Baixa meu currículo (CV)",
    action: "resume",
  },
  clear: {
    description: "Limpa o terminal (ou cls)",
    action: "clear",
  },
  exit: {
    description: "Fecha o terminal",
    action: "exit",
  },
  help: {
    description: "Lista todos os comandos",
  },
};

/** Aliases → canonical command name. */
export const aliases: Record<string, string> = {
  cls: "clear",
  skills: "skill",
};
