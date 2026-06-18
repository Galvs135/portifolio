import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "../../lib/gsap";
import styles from "./Preloader.module.css";

interface PreloaderProps {
  /** Fired when the reveal starts so the hero can animate in. */
  onComplete?: () => void;
}

const COLUMNS = 5;

// First `site` load gets the full count; later re-entries are quick
// (assets are already cached, so don't make the user wait again).
let firstBoot = true;

export default function Preloader({ onComplete }: PreloaderProps) {
  const { active } = useProgress();
  const activeRef = useRef(active);
  const rootRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const counter = { v: 0 };
    const dur = firstBoot ? 2 : 0.4;
    firstBoot = false;

    const paint = () => {
      const v = Math.round(counter.v);
      if (numRef.current) numRef.current.textContent = String(v).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
    };

    // Intro reveal of the counter content.
    gsap.fromTo(
      contentRef.current,
      { yPercent: 18, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out" }
    );

    const exit = (delay: number) => {
      if (done.current) return;
      done.current = true;
      const cols = colsRef.current
        ? Array.from(colsRef.current.children)
        : [];
      const tl = gsap.timeline({ delay });
      tl.add(() => onComplete?.())
        .to(contentRef.current, {
          yPercent: -120,
          opacity: 0,
          duration: 0.6,
          ease: "expo.inOut",
        })
        .to(
          cols,
          {
            yPercent: -100,
            duration: 1.1,
            ease: "expo.inOut",
            stagger: { each: 0.08, from: "start" },
          },
          "-=0.25"
        )
        .set(rootRef.current, { display: "none" });
    };

    const count = gsap.to(counter, {
      v: 100,
      duration: dur,
      ease: "power2.inOut",
      onUpdate: paint,
      onComplete: () => {
        const tryFinish = () => {
          if (activeRef.current) gsap.delayedCall(0.12, tryFinish);
          else exit(0.25);
        };
        tryFinish();
      },
    });

    return () => {
      count.kill();
    };
  }, [onComplete]);

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={colsRef} className={styles.cols} aria-hidden="true">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <span key={i} className={styles.col} />
        ))}
      </div>

      <div ref={contentRef} className={styles.content}>
        <span className={styles.name}>Lucas&nbsp;Galvão&nbsp;França</span>
        <div className={styles.counter}>
          <span ref={numRef} className={styles.num}>
            000
          </span>
          <span className={styles.percent}>%</span>
        </div>
        <div className={styles.barTrack}>
          <span ref={barRef} className={styles.bar} />
        </div>
      </div>
    </div>
  );
}
