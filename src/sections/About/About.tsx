import { useState } from "react";
import AnimatedText from "../../components/ui/AnimatedText";
import Parallax from "../../components/ui/Parallax";
import Reveal from "../../components/ui/Reveal";
import styles from "./About.module.css";

const focus = [
  { k: "Backend", v: "C#, .NET, microservices" },
  { k: "Architecture", v: "Clean Architecture, DDD, SOLID" },
  { k: "Data & messaging", v: "PostgreSQL, MongoDB, RabbitMQ" },
  { k: "Delivery", v: "CI/CD, Azure DevOps, Scrum" },
  { k: "Frontend", v: "TypeScript, React" },
];

interface Job {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
}

const experience: Job[] = [
  {
    company: "Capys IT",
    role: "Software Engineer",
    location: "Minas Gerais, Brazil · Hybrid",
    period: "03/2023 — Present",
    bullets: [
      "Built a real-time CRM notification microservice (C#, .NET, ASP.NET Core, Clean Architecture, DDD) automating dispatch reports, lead updates and operational alerts — cutting manual monitoring by ~70%. Used Twilio, Zenvia, System.Net.Mail and EPPlus.",
      "Built AI-powered conversational analysis for WhatsApp using a RAG architecture, semantic embeddings, Hugging Face models and Google Gemini Embeddings — sentiment analysis and contextual reply suggestions cut response-handling time by ~40%.",
      "Integrated AWS Cognito SSO with OAuth 2.0 / OpenID Connect (C#/.NET) for centralized identity and simpler, safer access.",
      "Designed and optimized CI/CD pipelines in Azure DevOps (YAML, Git) with approval stages, deployment monitoring and automated notifications — ~60% faster deploys with higher reliability and governance.",
      "Integrated card payments and financing with Granito and Banco Inter via payment APIs (C#/.NET), expanding options and improving conversion.",
      "Led the modernization of a legacy rule engine from .NET Framework 4.8 to .NET 8 — redesigning critical flows, refactoring stored procedures and tuning Entity Framework queries. Execution dropped from 48 to 17 minutes (~65%).",
    ],
  },
  {
    company: "Pasi Seguros",
    role: "Software Engineer",
    location: "Minas Gerais, Brazil · Remote",
    period: "07/2020 — 12/2022",
    bullets: [
      "Built automation and monitoring solutions for operational efficiency, data processing and system integration across internal areas (C#, .NET, REST APIs, automation tools).",
      "Designed a legal-process tracking application integrated with RJTJ systems — automated data ingestion, monitoring and centralized visibility, reducing manual effort for the legal department.",
      "Processed and integrated structured operational data from multiple systems and APIs, supporting real-time monitoring, reporting and decision-making.",
      "Built and maintained automation bots and workflow routines for repetitive tasks — fewer errors, faster execution and better productivity.",
      "Technologies: C#, .NET Framework, VB.NET, REST APIs, SQL, automation tools, Git.",
    ],
  },
];

function ExperienceItem({ job, defaultOpen }: { job: Job; defaultOpen?: boolean }) {
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
          <span className={styles.expRole}>{job.role}</span>
        </span>
        <span className={styles.expMeta}>
          <span>{job.period}</span>
          <span className={styles.expLoc}>{job.location}</span>
        </span>
        <span className={styles.expToggle} aria-hidden="true" />
      </button>
      <div className={styles.expPanel}>
        <div className={styles.expPanelInner}>
          <ul className={styles.expBullets}>
            {job.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className={`section ${styles.about}`}>
      <div className="container">
        <header data-vstep className={styles.head}>
          <span className="eyebrow">(About)</span>
          <span className={styles.headIndex}>02 — 05</span>
        </header>

        <Parallax speed={6}>
          <AnimatedText
            as="h2"
            className={styles.lead}
            text="I build scalable, high-performance backends — microservices and automation that move the business forward."
            stagger={0.03}
          />
        </Parallax>

        <div className={styles.grid}>
          <Reveal className={styles.bio}>
            <p>
              I'm Lucas — a Software Engineer with four years in the .NET (C#)
              ecosystem, focused on robust backend solutions, microservices and
              automated processes that drive real business value. I work to
              SOLID principles, Clean Architecture and DDD.
            </p>
            <p>
              My toolkit spans CI/CD on Azure DevOps, PostgreSQL and MongoDB,
              messaging with RabbitMQ and strong API integration — with React
              and TypeScript on the front. I hold an MBA in Artificial
              Intelligence &amp; Automation and work fluently in English and
              Portuguese.
            </p>
          </Reveal>

          <Parallax speed={-5}>
            <ul className={styles.focus}>
              {focus.map((f, i) => (
                <Reveal as="li" className={styles.focusItem} key={f.k} delay={i * 0.05}>
                  <span className={styles.focusKey}>{f.k}</span>
                  <span className={styles.focusVal}>{f.v}</span>
                </Reveal>
              ))}
            </ul>
          </Parallax>
        </div>

        <div data-vstep className={styles.experience}>
          <span className={`eyebrow ${styles.expEyebrow}`}>Experience</span>
          {experience.map((e, i) => (
            <Reveal key={e.company} delay={i * 0.04}>
              <ExperienceItem job={e} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
