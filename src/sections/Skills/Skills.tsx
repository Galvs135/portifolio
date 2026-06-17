import styles from "./Skills.module.css";

const groups = [
  { title: "Languages", items: ["TypeScript", "C#", "JavaScript", "SQL"] },
  { title: "Backend", items: ["Node.js", ".NET", "REST APIs", "RabbitMQ"] },
  { title: "Frontend", items: ["React", "Three.js", "GSAP", "HTML / CSS"] },
  { title: "Data", items: ["PostgreSQL", "MongoDB", "Observability"] },
  { title: "Practices", items: ["SOLID", "Clean Code", "CI/CD", "Scrum"] },
];

export default function Skills() {
  return (
    <div data-track className={styles.track}>
      <div data-hstep className={styles.intro}>
        <span className="eyebrow">(Capabilities)</span>
        <h2 className={styles.introTitle}>
          A full-stack
          <br />
          toolkit
        </h2>
        <span className={styles.hint}>
          Scroll <span aria-hidden="true">→</span>
        </span>
      </div>

      {groups.map((g, i) => (
        <div key={g.title} data-hstep className={styles.group}>
          <span className={styles.groupIndex}>0{i + 1}</span>
          <h3 className={styles.groupTitle}>{g.title}</h3>
          <ul className={styles.groupList}>
            {g.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      ))}

      <div data-hstep className={styles.end}>
        <span className={styles.endText}>
          Always
          <br />
          learning.
        </span>
      </div>
    </div>
  );
}
