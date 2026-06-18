import { useT } from "../../i18n/LanguageContext";
import styles from "./Skills.module.css";

const groups: { title: { en: string; pt: string }; items: string[] }[] = [
  { title: { en: "Languages", pt: "Linguagens" }, items: ["TypeScript", "C#", "JavaScript", "SQL"] },
  { title: { en: "Backend", pt: "Backend" }, items: ["Node.js", ".NET", "REST APIs", "RabbitMQ"] },
  { title: { en: "Frontend", pt: "Frontend" }, items: ["React", "Three.js", "GSAP", "HTML / CSS"] },
  { title: { en: "Data", pt: "Dados" }, items: ["PostgreSQL", "MongoDB", "Observability"] },
  { title: { en: "Practices", pt: "Práticas" }, items: ["SOLID", "Clean Code", "CI/CD", "Scrum"] },
];

export default function Skills() {
  const { t, lang } = useT();
  return (
    <>
      <div data-track className={styles.track}>
        <div data-hstep className={styles.intro}>
          <span className="eyebrow">{t("(Capabilities)", "(Capacidades)")}</span>
          <h2 className={styles.introTitle}>
            {t("A full-stack", "Um kit")}
            <br />
            {t("toolkit", "full-stack")}
          </h2>
          <span className={styles.hint}>
            {t("Scroll", "Role")} <span aria-hidden="true">→</span>
          </span>
        </div>

        {groups.map((g, i) => (
          <div key={g.title.en} data-hstep data-card className={styles.group}>
            <span className={styles.groupIndex}>0{i + 1}</span>
            <h3 className={styles.groupTitle}>{g.title[lang]}</h3>
            <ul className={styles.groupList}>
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}

        <div data-hstep className={styles.end}>
          <span className={styles.endText}>
            {t("Always", "Sempre")}
            <br />
            {t("learning.", "aprendendo.")}
          </span>
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span data-progress-count className={styles.progressCount}>
          01 / {String(groups.length).padStart(2, "0")}
        </span>
        <div className={styles.progressTrack}>
          <span data-progress-bar className={styles.progressBar} />
        </div>
      </div>
    </>
  );
}
