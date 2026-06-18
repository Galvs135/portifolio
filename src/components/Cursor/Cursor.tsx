import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
}

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    document.body.classList.add("custom-cursor");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = (canvas.width = window.innerWidth * dpr);
    let h = (canvas.height = window.innerHeight * dpr);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...mouse };
    const ringPos = { ...mouse };
    let lastX = mouse.x;
    let lastY = mouse.y;
    let ringScale = 1;
    let targetScale = 1;
    let visible = false;

    const particles: Particle[] = [];

    const onResize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
    };

    const spawn = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          life: 0,
          max: 50 + Math.random() * 45,
          size: 1.2 + Math.random() * 2.8,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      const dx = mouse.x - lastX;
      const dy = mouse.y - lastY;
      const dist = Math.hypot(dx, dy);
      const count = Math.min(4, Math.floor(dist / 5) + 1);
      spawn(mouse.x, mouse.y, count);
      lastX = mouse.x;
      lastY = mouse.y;
    };

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      targetScale = t ? 2.4 : 1;
      dot.style.opacity = t ? "0" : "1";
    };

    const onDown = () => (targetScale *= 0.7);
    const onUp = () => (targetScale = targetScale / 0.7);
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      visible = false;
    };

    let raf = 0;
    const render = () => {
      dotPos.x += (mouse.x - dotPos.x) * 0.35;
      dotPos.y += (mouse.y - dotPos.y) * 0.35;
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      ringScale += (targetScale - ringScale) * 0.12;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${ringScale})`;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const t = p.life / p.max;
        if (t >= 1) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = (1 - t) * 0.6;
        ctx.beginPath();
        ctx.fillStyle = `rgba(245, 245, 243, ${alpha})`;
        ctx.arc(p.x * dpr, p.y * dpr, p.size * (1 - t) * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}
