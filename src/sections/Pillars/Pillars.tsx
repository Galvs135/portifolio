import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import AnimatedText from "../../components/ui/AnimatedText";
import Parallax from "../../components/ui/Parallax";
import Reveal from "../../components/ui/Reveal";
import styles from "./Pillars.module.css";

const pillars = [
  {
    n: "01",
    title: "Architecture",
    text: "Systems designed to stay clear, testable and fast as they scale — SOLID, clean architecture and the right patterns, never over-engineering for its own sake.",
  },
  {
    n: "02",
    title: "Delivery",
    text: "Reliable shipping with CI/CD on Azure DevOps, observability and messaging through RabbitMQ — software that holds up once it meets production.",
  },
  {
    n: "03",
    title: "Automation",
    text: "Removing the manual, repetitive work — integrations and processes that hand teams back their hours and give them real visibility.",
  },
];

export default function Pillars() {
  const rootRef = useRef<HTMLElement>(null);

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
          <span className="eyebrow">(How I work)</span>
        </header>

        <Parallax speed={16}>
          <AnimatedText
            as="h2"
            className={styles.lead}
            text="Three things I keep coming back to."
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
                  <h3 className={styles.title}>{p.title}</h3>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className={styles.text}>{p.text}</p>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
