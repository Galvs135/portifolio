import { useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePanel } from "../components/Fullpage/PanelContext";
import { previewFragmentShader, previewVertexShader } from "./shaders";

const isTouchDevice = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

interface PreviewProps {
  colors: [string, string];
  active: boolean;
}

function Plane({ colors, active }: PreviewProps) {
  const { viewport } = useThree();

  const targetA = useMemo(() => new THREE.Color(colors[0]), []);
  const targetB = useMemo(() => new THREE.Color(colors[1]), []);
  targetA.set(colors[0]);
  targetB.set(colors[1]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: previewVertexShader,
        fragmentShader: previewFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uColorA: { value: new THREE.Color(colors[0]) },
          uColorB: { value: new THREE.Color(colors[1]) },
        },
      }),
    []
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const u = material.uniforms;
    u.uTime.value += dt;
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, active ? 1 : 0, 5, dt);
    (u.uColorA.value as THREE.Color).lerp(targetA, 0.08);
    (u.uColorB.value as THREE.Color).lerp(targetB, 0.08);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export default function WorkPreview({ colors, active }: PreviewProps) {
  const panel = usePanel();
  const panelActive = panel?.active ?? true;

  // Mobile: skip Three.js entirely (saves WebGL context + GPU load).
  if (isTouchDevice()) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
          transition: "opacity 0.5s",
          opacity: active ? 0.9 : 0.6,
        }}
      />
    );
  }

  return (
    <Canvas
      // The preview's per-pixel noise shader is costly; only run its render
      // loop while the Work panel is on screen. Off-screen it idles at 0 fps.
      frameloop={panelActive ? "always" : "never"}
      camera={{ position: [0, 0, 1.5], fov: 50 }}
      dpr={1}
      gl={{ antialias: false, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Plane colors={colors} active={active} />
    </Canvas>
  );
}
