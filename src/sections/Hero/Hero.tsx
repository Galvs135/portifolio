import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useTransition } from "../../components/Fullpage/Fullpage";
import { useT } from "../../i18n/LanguageContext";
import styles from "./Hero.module.css";

interface HeroProps {
  /** Becomes true when the preloader finishes — triggers the entrance. */
  loaded: boolean;
}

export default function Hero({ loaded }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const { navigate } = useTransition();
  const { t } = useT();

  useEffect(() => {
    if (!loaded) return;
    const root = rootRef.current;
    if (!root) return;

    const lines = root.querySelectorAll<HTMLElement>(".reveal-line > span");
    const fades = root.querySelectorAll<HTMLElement>("[data-fade]");

    const tl = gsap.timeline();
    tl.fromTo(
      lines,
      { yPercent: 120 },
      { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.12 }
    ).fromTo(
      fades,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12 },
      "-=0.8"
    );

    return () => {
      tl.kill();
    };
  }, [loaded]);

  return (
    <section ref={rootRef} className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <p data-fade className={`eyebrow ${styles.eyebrow}`}>
          Lucas Galvão França — {t("Software Engineer", "Engenheiro de Software")}
        </p>

        <h1 className={styles.title}>
          <span className="reveal-line">
            <span>{t("Software that scales.", "Software que escala.")}</span>
          </span>
          <span className="reveal-line">
            <span>{t("Systems that last.", "Sistemas que duram.")}</span>
          </span>
        </h1>

        <div className={styles.bottom}>
          <p data-fade className={styles.tagline}>
            {t(
              "Four years engineering scalable backends, microservices and automation in the .NET ecosystem — from first idea to production.",
              "Quatro anos desenvolvendo backends escaláveis, microsserviços e automação no ecossistema .NET — da primeira ideia à produção."
            )}
          </p>

          <a
            data-fade
            href="#about"
            className={styles.scroll}
            data-cursor="hover"
            onClick={(e) => {
              e.preventDefault();
              navigate("#about");
            }}
          >
            <span>{t("Scroll to explore", "Role para explorar")}</span>
            <span className={styles.scrollLine} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
