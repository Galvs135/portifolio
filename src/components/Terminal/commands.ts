import { EMAIL, PHONE_DISPLAY, socials } from "../../data/socials";

export type Tone = "default" | "dim" | "accent";

export interface TermLine {
  text: string;
  tone?: Tone;
}

export interface Command {
  description: string;
  lines: TermLine[];
}

/**
 * Mocked command registry — single source of truth, easy to extend.
 * Swap the `lines` for real data later; the Terminal renders whatever is here.
 * `help` and `clear` are handled inside the Terminal component, not here.
 */
export const commands: Record<string, Command> = {
  about: {
    description: "Quem é o Lucas e o que ele faz",
    lines: [
      { text: "Lucas Galvão França — Software Engineer", tone: "accent" },
      { text: "Belo Horizonte, Brasil", tone: "dim" },
      { text: "" },
      {
        text: "4 anos construindo backends escaláveis, microsserviços e",
      },
      {
        text: "automação no ecossistema .NET (C#) — da ideia à produção.",
      },
      { text: "Foco em SOLID, Clean Architecture e DDD.", tone: "dim" },
    ],
  },
  contact: {
    description: "Formas de contato",
    lines: [
      { text: "Vamos conversar:", tone: "accent" },
      { text: "" },
      { text: `email      ${EMAIL}` },
      { text: `whatsapp   ${PHONE_DISPLAY}` },
      ...socials
        .filter((s) => s.icon === "github" || s.icon === "linkedin")
        .map((s) => ({ text: `${s.label.toLowerCase().padEnd(10)} ${s.href}` })),
    ],
  },
};
