import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Drift in px as the pointer moves across the viewport. */
  speed?: number;
}

/**
 * Pointer-driven parallax: the block drifts gently with the cursor, giving
 * depth without relying on page scroll (we use isolated full-screen panels).
 */
export default function Parallax({ children, className, speed = 18 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo(nx * speed);
      yTo(ny * speed);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
