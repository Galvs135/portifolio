import { useState } from "react";
import AnimatedText from "../../components/ui/AnimatedText";
import Parallax from "../../components/ui/Parallax";
import Reveal from "../../components/ui/Reveal";
import { useT } from "../../i18n/LanguageContext";
import styles from "./About.module.css";

type Bi = { en: string; pt: string };

const focus: { k: Bi; v: Bi }[] = [
  { k: { en: "Backend", pt: "Backend" }, v: { en: "C#, .NET, microservices", pt: "C#, .NET, microsserviços" } },
  { k: { en: "Architecture", pt: "Arquitetura" }, v: { en: "Clean Architecture, DDD, SOLID", pt: "Clean Architecture, DDD, SOLID" } },
  { k: { en: "Data & messaging", pt: "Dados & mensageria" }, v: { en: "PostgreSQL, MongoDB, RabbitMQ", pt: "PostgreSQL, MongoDB, RabbitMQ" } },
  { k: { en: "Delivery", pt: "Entrega" }, v: { en: "CI/CD, Azure DevOps, Scrum", pt: "CI/CD, Azure DevOps, Scrum" } },
  { k: { en: "Frontend", pt: "Frontend" }, v: { en: "TypeScript, React", pt: "TypeScript, React" } },
];

interface Job {
  company: string;
  role: Bi;
  location: Bi;
  period: Bi;
  bullets: Bi[];
}

const experience: Job[] = [
  {
    company: "Capys IT",
    role: { en: "Software Engineer", pt: "Engenheiro de Software" },
    location: { en: "Minas Gerais, Brazil · Hybrid", pt: "Minas Gerais, Brasil · Híbrido" },
    period: { en: "03/2023 — Present", pt: "03/2023 — Atual" },
    bullets: [
      {
        en: "Built a real-time CRM notification microservice (C#, .NET, ASP.NET Core, Clean Architecture, DDD) automating dispatch reports, lead updates and operational alerts — cutting manual monitoring by ~70%. Used Twilio, Zenvia, System.Net.Mail and EPPlus.",
        pt: "Desenvolvi um microsserviço de notificações de CRM em tempo real (C#, .NET, ASP.NET Core, Clean Architecture, DDD) automatizando relatórios de disparo, atualizações de leads e alertas operacionais — reduzindo o monitoramento manual em ~70%. Usei Twilio, Zenvia, System.Net.Mail e EPPlus.",
      },
      {
        en: "Built AI-powered conversational analysis for WhatsApp using a RAG architecture, semantic embeddings, Hugging Face models and Google Gemini Embeddings — sentiment analysis and contextual reply suggestions cut response-handling time by ~40%.",
        pt: "Construí análise conversacional com IA para WhatsApp usando arquitetura RAG, embeddings semânticos, modelos Hugging Face e Google Gemini Embeddings — análise de sentimento e sugestões de resposta contextual reduziram o tempo de atendimento em ~40%.",
      },
      {
        en: "Integrated AWS Cognito SSO with OAuth 2.0 / OpenID Connect (C#/.NET) for centralized identity and simpler, safer access.",
        pt: "Integrei SSO com AWS Cognito via OAuth 2.0 / OpenID Connect (C#/.NET) para identidade centralizada e acesso mais simples e seguro.",
      },
      {
        en: "Designed and optimized CI/CD pipelines in Azure DevOps (YAML, Git) with approval stages, deployment monitoring and automated notifications — ~60% faster deploys with higher reliability and governance.",
        pt: "Projetei e otimizei pipelines de CI/CD no Azure DevOps (YAML, Git) com estágios de aprovação, monitoramento de deploy e notificações automáticas — deploys ~60% mais rápidos, com mais confiabilidade e governança.",
      },
      {
        en: "Integrated card payments and financing with Granito and Banco Inter via payment APIs (C#/.NET), expanding options and improving conversion.",
        pt: "Integrei pagamentos com cartão e financiamento com Granito e Banco Inter via APIs de pagamento (C#/.NET), ampliando opções e melhorando a conversão.",
      },
      {
        en: "Led the modernization of a legacy rule engine from .NET Framework 4.8 to .NET 8 — redesigning critical flows, refactoring stored procedures and tuning Entity Framework queries. Execution dropped from 48 to 17 minutes (~65%).",
        pt: "Liderei a modernização de um motor de regras legado de .NET Framework 4.8 para .NET 8 — redesenhando fluxos críticos, refatorando stored procedures e otimizando consultas no Entity Framework. A execução caiu de 48 para 17 minutos (~65%).",
      },
    ],
  },
  {
    company: "Pasi Seguros",
    role: { en: "Software Engineer", pt: "Engenheiro de Software" },
    location: { en: "Minas Gerais, Brazil · Remote", pt: "Minas Gerais, Brasil · Remoto" },
    period: { en: "07/2020 — 12/2022", pt: "07/2020 — 12/2022" },
    bullets: [
      {
        en: "Built automation and monitoring solutions for operational efficiency, data processing and system integration across internal areas (C#, .NET, REST APIs, automation tools).",
        pt: "Desenvolvi soluções de automação e monitoramento para eficiência operacional, processamento de dados e integração de sistemas entre áreas internas (C#, .NET, APIs REST, ferramentas de automação).",
      },
      {
        en: "Designed a legal-process tracking application integrated with RJTJ systems — automated data ingestion, monitoring and centralized visibility, reducing manual effort for the legal department.",
        pt: "Projetei uma aplicação de acompanhamento de processos jurídicos integrada aos sistemas do TJ — ingestão de dados automatizada, monitoramento e visibilidade centralizada, reduzindo o esforço manual do jurídico.",
      },
      {
        en: "Processed and integrated structured operational data from multiple systems and APIs, supporting real-time monitoring, reporting and decision-making.",
        pt: "Processei e integrei dados operacionais estruturados de múltiplos sistemas e APIs, apoiando monitoramento em tempo real, relatórios e tomada de decisão.",
      },
      {
        en: "Built and maintained automation bots and workflow routines for repetitive tasks — fewer errors, faster execution and better productivity.",
        pt: "Construí e mantive bots de automação e rotinas de workflow para tarefas repetitivas — menos erros, execução mais rápida e mais produtividade.",
      },
      {
        en: "Technologies: C#, .NET Framework, VB.NET, REST APIs, SQL, automation tools, Git.",
        pt: "Tecnologias: C#, .NET Framework, VB.NET, APIs REST, SQL, ferramentas de automação, Git.",
      },
    ],
  },
];

function ExperienceItem({
  job,
  defaultOpen,
  lang,
}: {
  job: Job;
  defaultOpen?: boolean;
  lang: "en" | "pt";
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const toggle = () => setOpen((o) => !o);
  return (
    <div className={styles.expItem} data-open={open}>
      <button
        className={styles.expHead}
        onClick={toggle}
        aria-expanded={open}
        data-cursor="hover"
      >
        <span className={styles.expIdentity}>
          <span className={styles.expCompany}>{job.company}</span>
          <span className={styles.expRole}>{job.role[lang]}</span>
        </span>
        <span className={styles.expMeta}>
          <span>{job.period[lang]}</span>
          <span className={styles.expLoc}>{job.location[lang]}</span>
        </span>
        <span className={styles.expToggle} aria-hidden="true" />
      </button>
      <div className={styles.expPanel}>
        <div className={styles.expPanelInner}>
          <ul className={styles.expBullets}>
            {job.bullets.map((b, j) => (
              <li key={j}>{b[lang]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { t, lang } = useT();
  return (
    <section className={`section ${styles.about}`}>
      <div className="container">
        <header data-vstep className={styles.head}>
          <span className="eyebrow">{t("(About)", "(Sobre)")}</span>
          <span className={styles.headIndex}>02 — 05</span>
        </header>

        <Parallax speed={6}>
          <AnimatedText
            as="h2"
            className={styles.lead}
            text={t(
              "I build scalable, high-performance backends — microservices and automation that move the business forward.",
              "Construo backends escaláveis e de alta performance — microsserviços e automação que movem o negócio para frente."
            )}
            stagger={0.03}
          />
        </Parallax>

        <div className={styles.grid}>
          <Reveal className={styles.bio}>
            <p>
              {t(
                "I'm Lucas — a Software Engineer with four years in the .NET (C#) ecosystem, focused on robust backend solutions, microservices and automated processes that drive real business value. I work to SOLID principles, Clean Architecture and DDD.",
                "Sou o Lucas — engenheiro de software com quatro anos no ecossistema .NET (C#), focado em soluções de backend robustas, microsserviços e processos automatizados que geram valor real para o negócio. Trabalho com princípios SOLID, Clean Architecture e DDD."
              )}
            </p>
            <p>
              {t(
                "My toolkit spans CI/CD on Azure DevOps, PostgreSQL and MongoDB, messaging with RabbitMQ and strong API integration — with React and TypeScript on the front. I hold an MBA in Artificial Intelligence & Automation and work fluently in English and Portuguese.",
                "Meu kit vai de CI/CD no Azure DevOps, PostgreSQL e MongoDB, mensageria com RabbitMQ e forte integração de APIs — com React e TypeScript no front. Tenho MBA em Inteligência Artificial & Automação e atuo fluentemente em inglês e português."
              )}
            </p>
          </Reveal>

          <Parallax speed={-5}>
            <ul className={styles.focus}>
              {focus.map((f, i) => (
                <Reveal as="li" className={styles.focusItem} key={f.k.en} delay={i * 0.05}>
                  <span className={styles.focusKey}>{f.k[lang]}</span>
                  <span className={styles.focusVal}>{f.v[lang]}</span>
                </Reveal>
              ))}
            </ul>
          </Parallax>
        </div>

        <div data-vstep className={styles.experience}>
          <span className={`eyebrow ${styles.expEyebrow}`}>
            {t("Experience", "Experiência")}
          </span>
          {experience.map((e, i) => (
            <Reveal key={e.company} delay={i * 0.04}>
              <ExperienceItem job={e} defaultOpen={i === 0} lang={lang} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
