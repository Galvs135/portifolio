import { projects } from "../../data/projects";
import { EMAIL, PHONE_DISPLAY, socials } from "../../data/socials";

export type Tone = "default" | "dim" | "accent";

export interface TermLine {
  text: string;
  tone?: Tone;
}

export type CommandAction = "clear" | "exit" | "resume" | "site" | "terminal";

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
 * Command registry — single source of truth (still mocked content).
 * Swap the `lines` for real data later; `help` lists everything here.
 */
export const commands: Record<string, Command> = {
  about: {
    description: "Who I am and what I do",
    lines: [
      { text: "Lucas Galvão França — Software Engineer", tone: "accent" },
      { text: "Belo Horizonte, Brazil", tone: "dim" },
      { text: "" },
      { text: "4 years in the .NET (C#) ecosystem building scalable" },
      { text: "backends, microservices and automation — idea to production." },
      { text: "SOLID, Clean Architecture and DDD. MBA in AI & Automation.", tone: "dim" },
    ],
  },
  contact: {
    description: "Ways to reach me",
    lines: [
      { text: "Let's talk:", tone: "accent" },
      { text: "" },
      { text: `email      ${EMAIL}` },
      { text: `whatsapp   ${PHONE_DISPLAY}` },
      ...socials
        .filter((s) => s.icon === "github" || s.icon === "linkedin")
        .map(link),
    ],
  },
  works: {
    description: "My work at Capys IT",
    lines: [
      { text: "Capys IT — Software Engineer (03/2023 — present)", tone: "accent" },
      { text: "" },
      { text: "• Real-time CRM notification microservice (C#/.NET) —" },
      { text: "  automated reports and alerts, -70% manual monitoring.", tone: "dim" },
      { text: "• AI conversational analysis on WhatsApp (RAG, embeddings," },
      { text: "  Gemini) — -40% response-handling time.", tone: "dim" },
      { text: "• SSO with AWS Cognito (OAuth 2.0 / OpenID Connect)." },
      { text: "• CI/CD pipelines on Azure DevOps — ~60% faster deploys." },
      { text: "• Card payments integration (Granito, Banco Inter)." },
      { text: "• Legacy engine modernization .NET 4.8 → .NET 8 —" },
      { text: "  runtime from 48 → 17 min (-65%).", tone: "dim" },
    ],
  },
  projects: {
    description: "My repositories",
    lines: [
      { text: "Repositories:", tone: "accent" },
      { text: "" },
      ...projects.flatMap((p): TermLine[] => [
        { text: `${p.title}  (${p.year})` },
        { text: `  ${p.href ?? "private repository"}`, tone: "dim" },
      ]),
    ],
  },
  skill: {
    description: "My skills",
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
  site: {
    description: "Load the full portfolio site",
    action: "site",
  },
  terminal: {
    description: "Back to the full-screen terminal",
    action: "terminal",
  },
  resume: {
    description: "Download my resume (CV)",
    action: "resume",
  },
  clear: {
    description: "Clear the terminal (or cls)",
    action: "clear",
  },
  exit: {
    description: "Leave the terminal",
    action: "exit",
  },
  help: {
    description: "List all commands",
  },
};

/** Aliases → canonical command name. */
export const aliases: Record<string, string> = {
  cls: "clear",
  skills: "skill",
};
