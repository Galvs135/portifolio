import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroObject from "./HeroObject";

export default function Scene({ paused = false }: { paused?: boolean }) {
  return (
    <div className="bg-canvas" aria-hidden="true">
      <Canvas
        frameloop={paused ? "never" : "always"}
        dpr={[1, 1.5]}
        performance={{ min: 0.75 }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#121212"]} />
        <fog attach="fog" args={["#121212", 3.5, 9]} />
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <HeroObject />
        </Suspense>
      </Canvas>
    </div>
  );
}
