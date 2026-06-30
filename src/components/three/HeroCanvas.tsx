import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ParticleCore() {
  const points = useRef<THREE.Points>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const { positions, colors } = useMemo(() => {
    const N = 3500;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const c1 = new THREE.Color("#1FE0B5");
    const c2 = new THREE.Color("#5BF0D6");
    const c3 = new THREE.Color("#053931");
    for (let i = 0; i < N; i++) {
      // shell with some inner noise
      const r = 1.6 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const mix = Math.random();
      const c = c1.clone().lerp(mix > 0.7 ? c2 : c3, mix);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, dt) => {
    target.current.x = state.pointer.x;
    target.current.y = state.pointer.y;
    mouse.current.lerp(target.current, 0.06);

    const t = state.clock.elapsedTime;
    if (points.current) {
      points.current.rotation.y += dt * 0.06;
      points.current.rotation.x = mouse.current.y * 0.35;
      points.current.rotation.z = mouse.current.x * 0.2;
      const s = 1 + Math.sin(t * 0.8) * 0.02;
      points.current.scale.setScalar(s);
    }
    if (core.current) {
      core.current.rotation.x = t * 0.15 + mouse.current.y * 0.4;
      core.current.rotation.y = t * 0.2 + mouse.current.x * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color="#053931"
          emissive="#1FE0B5"
          emissiveIntensity={0.35}
          metalness={0.9}
          roughness={0.15}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#02110D"
          emissive="#1FE0B5"
          emissiveIntensity={0.15}
          metalness={1}
          roughness={0.3}
        />
      </mesh>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <color attach="background" args={["#02110D"]} />
      <fog attach="fog" args={["#02110D", 6, 12]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#5BF0D6" />
      <pointLight position={[-4, -2, -3]} intensity={2} color="#1FE0B5" />
      <ParticleCore />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <ChromaticAberration
          offset={[0.0008, 0.0012] as unknown as [number, number]}
          radialModulation
          modulationOffset={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  );
}
