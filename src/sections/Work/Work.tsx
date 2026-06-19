import { useState } from "react";
import { projects, type Project } from "../../data/projects";
import WorkPreview from "../../three/WorkPreview";
import Carousel from "../../components/Carousel/Carousel";
import styles from "./Work.module.css";

function Card({ p, i }: { p: Project; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <article
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
          <span className={styles.cardRole}>{p.role}</span>
          <p className={styles.cardDesc}>{p.description}</p>
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
              View project <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const intro = (
    <>
      <span className="eyebrow">(Selected work)</span>
      <h2 className={styles.introTitle}>
        Selected
        <br />
        work
      </h2>
      <span className={styles.hint}>
        <span aria-hidden="true">‹</span> Click <span aria-hidden="true">›</span>
      </span>
    </>
  );

  const items = projects.map((p, i) => ({
    key: p.id,
    node: <Card p={p} i={i} />,
  }));

  return <Carousel items={items} intro={intro} />;
}
