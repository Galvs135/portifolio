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

  // Detailed icosahedron => smooth organic displacement.
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, 64), []);

  useFrame((_, delta) => {
    const u = material.uniforms;
    u.uTime.value += delta;

    // Ease the intro amplitude in (gives the object a "breathe in" on load).
    u.uIntro.value = THREE.MathUtils.damp(u.uIntro.value, 1, 2, delta);

    // Smoothly follow the pointer (-1..1 from our window listener).
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, target.current.x, 4, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, target.current.y, 4, delta);
    (u.uMouse.value as THREE.Vector2).copy(mouse.current);

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x = mouse.current.y * 0.25;
      meshRef.current.rotation.z = mouse.current.x * -0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} scale={1} />
  );
}
