import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function TerrainWave() {
  const mesh = useRef<THREE.Mesh>(null!);
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(40, 25, 120, 80);
    return g;
  }, []);
  const base = useMemo(
    () => Float32Array.from(geom.attributes.position.array as Float32Array),
    [geom],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      const d = Math.sqrt(x * x + y * y);
      arr[i + 2] =
        Math.sin(d * 0.5 - t * 1.2) * 0.4 +
        Math.sin(x * 0.6 + t * 0.8) * 0.2 +
        Math.cos(y * 0.4 - t * 0.6) * 0.2;
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={mesh} geometry={geom} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -2.2, 0]}>
      <meshBasicMaterial color="#1FE0B5" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

export function FooterTerrain() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.2, 7], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <color attach="background" args={["#02110D"]} />
      <fog attach="fog" args={["#02110D", 6, 16]} />
      <TerrainWave />
    </Canvas>
  );
}
