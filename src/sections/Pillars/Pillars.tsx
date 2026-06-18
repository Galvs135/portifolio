import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import AnimatedText from "../../components/ui/AnimatedText";
import Parallax from "../../components/ui/Parallax";
import Reveal from "../../components/ui/Reveal";
import { useT } from "../../i18n/LanguageContext";
import styles from "./Pillars.module.css";

type Bi = { en: string; pt: string };

const pillars: { n: string; title: Bi; text: Bi }[] = [
  {
    n: "01",
    title: { en: "Architecture", pt: "Arquitetura" },
    text: {
      en: "Systems designed to stay clear, testable and fast as they scale — SOLID, clean architecture and the right patterns, never over-engineering for its own sake.",
      pt: "Sistemas pensados para continuar claros, testáveis e rápidos conforme escalam — SOLID, clean architecture e os padrões certos, sem over-engineering por esporte.",
    },
  },
  {
    n: "02",
    title: { en: "Delivery", pt: "Entrega" },
    text: {
      en: "Reliable shipping with CI/CD on Azure DevOps, observability and messaging through RabbitMQ — software that holds up once it meets production.",
      pt: "Entrega confiável com CI/CD no Azure DevOps, observabilidade e mensageria via RabbitMQ — software que se sustenta quando chega à produção.",
    },
  },
  {
    n: "03",
    title: { en: "Automation", pt: "Automação" },
    text: {
      en: "Removing the manual, repetitive work — integrations and processes that hand teams back their hours and give them real visibility.",
      pt: "Eliminando o trabalho manual e repetitivo — integrações e processos que devolvem horas aos times e dão visibilidade real.",
    },
  },
];

export default function Pillars() {
  const rootRef = useRef<HTMLElement>(null);
  const { t, lang } = useT();

  // Pointer-driven drift on the oversized ghost numbers.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ghosts = Array.from(root.querySelectorAll<HTMLElement>("[data-ghost]"));
    const setters = ghosts.map((g) => ({
      x: gsap.quickTo(g, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(g, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setters.forEach((s) => {
        s.x(nx * 70);
        s.y(ny * 45);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.pillars}`}>
      <div className="container">
        <header data-vstep className={styles.head}>
          <span className="eyebrow">{t("(How I work)", "(Como eu trabalho)")}</span>
        </header>

        <Parallax speed={16}>
          <AnimatedText
            as="h2"
            className={styles.lead}
            text={t(
              "Three things I keep coming back to.",
              "Três coisas às quais sempre volto."
            )}
            stagger={0.04}
          />
        </Parallax>

        <div className={styles.list}>
          {pillars.map((p) => (
            <article key={p.n} data-pillar className={styles.pillar}>
              <span data-ghost className={styles.ghost} aria-hidden="true">
                {p.n}
              </span>
              <div className={styles.body}>
                <Reveal>
                  <h3 className={styles.title}>{p.title[lang]}</h3>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className={styles.text}>{p.text[lang]}</p>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
