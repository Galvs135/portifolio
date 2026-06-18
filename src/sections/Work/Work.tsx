import { useState } from "react";
import { projects, type Project } from "../../data/projects";
import WorkPreview from "../../three/WorkPreview";
import { useT } from "../../i18n/LanguageContext";
import styles from "./Work.module.css";

function Card({ p, i }: { p: Project; i: number }) {
  const [hover, setHover] = useState(false);
  const { t, lang } = useT();
  return (
    <article
      data-hstep
      data-card
      className={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.cardCanvas}>
        <WorkPreview colors={p.colors} active={hover} />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.cardIndex}>0{i + 1}</span>
          <span className={styles.cardYear}>{p.year}</span>
        </div>

        <div className={styles.cardBottom}>
          <h3 className={styles.cardTitle}>{p.title}</h3>
          <span className={styles.cardRole}>{p.role[lang]}</span>
          <p className={styles.cardDesc}>{p.description[lang]}</p>
          <ul className={styles.cardStack}>
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {p.href && (
            <a
              className={styles.cardLink}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
            >
              {t("View project", "Ver projeto")} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const { t } = useT();
  const total = projects.length;
  return (
    <>
      <div data-track className={styles.track}>
        <div data-hstep className={styles.intro}>
          <span className="eyebrow">{t("(Selected work)", "(Trabalhos selecionados)")}</span>
          <h2 className={styles.introTitle}>
            {t("Selected", "Trabalhos")}
            <br />
            {t("work", "selecionados")}
          </h2>
          <span className={styles.hint}>
            {t("Scroll", "Role")} <span aria-hidden="true">→</span>
          </span>
        </div>

        {projects.map((p, i) => (
          <Card key={p.id} p={p} i={i} />
        ))}

        <div data-hstep className={styles.end}>
          <span className={styles.endIndex}>{t("Let's talk →", "Vamos conversar →")}</span>
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span data-progress-count className={styles.progressCount}>
          01 / {String(total).padStart(2, "0")}
        </span>
        <div className={styles.progressTrack}>
          <span data-progress-bar className={styles.progressBar} />
        </div>
      </div>
    </>
  );
}
