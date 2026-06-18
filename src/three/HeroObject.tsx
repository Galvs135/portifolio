import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroFragmentShader, heroVertexShader } from "./shaders";

export default function HeroObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  // The background canvas is pointer-events:none, so track the pointer
  // ourselves from window events instead of relying on R3F's event system.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: heroVertexShader,
      fragmentShader: heroFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uAmp: { value: 0.42 },
        uIntro: { value: 0 },
        uColorA: { value: new THREE.Color("#15151a") },
        uColorB: { value: new THREE.Color("#4a4a55") },
      },
    });
  }, []);

  // Detail 32 = ~5k faces (still smooth) vs 64 = ~25k. Big perf win on mobile.
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, 32), []);

  useFrame((_, delta) => {
    // Clamp delta so resuming a paused frameloop (or a backgrounded tab)
    // doesn't snap the animation forward by a huge step.
    const dt = Math.min(delta, 0.033);
    const u = material.uniforms;
    u.uTime.value += dt;

    // Ease the intro amplitude in (gives the object a "breathe in" on load).
    u.uIntro.value = THREE.MathUtils.damp(u.uIntro.value, 1, 2, dt);

    // Smoothly follow the pointer (-1..1 from our window listener).
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, target.current.x, 4, dt);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, target.current.y, 4, dt);
    (u.uMouse.value as THREE.Vector2).copy(mouse.current);

    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.06;
      meshRef.current.rotation.x = mouse.current.y * 0.25;
      meshRef.current.rotation.z = mouse.current.x * -0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} scale={1} />
  );
}
