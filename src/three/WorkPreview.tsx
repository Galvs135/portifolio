import { useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { previewFragmentShader, previewVertexShader } from "./shaders";

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

  useFrame((_, dt) => {
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
  return (
    <Canvas
      camera={{ position: [0, 0, 1.5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Plane colors={colors} active={active} />
    </Canvas>
  );
}
