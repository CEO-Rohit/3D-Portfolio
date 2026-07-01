import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { skills, type Skill } from "@/data/skills";

function nodeGeometry(kind: Skill["geometry"]) {
  switch (kind) {
    case "knot":
      return <torusKnotGeometry args={[0.28, 0.09, 128, 16]} />;
    case "cube":
      return <boxGeometry args={[0.42, 0.42, 0.42]} />;
    case "cluster":
      return <dodecahedronGeometry args={[0.32, 0]} />;
    case "sphere":
      return <sphereGeometry args={[0.32, 32, 32]} />;
    case "tetra":
      return <tetrahedronGeometry args={[0.4, 0]} />;
    case "ring":
      return <torusGeometry args={[0.3, 0.08, 24, 96]} />;
  }
}

function SkillNode({
  skill,
  index,
  total,
  progressRef,
  focusIndexRef,
}: {
  skill: Skill;
  index: number;
  total: number;
  progressRef: { current: number };
  focusIndexRef: { current: number };
}) {
  const group = useRef<THREE.Group>(null!);
  const mat = useRef<THREE.MeshStandardMaterial>(null!);
  const glow = useRef<THREE.MeshBasicMaterial>(null!);
  const line = useRef<THREE.LineBasicMaterial>(null!);
  const lineGeom = useRef<THREE.BufferGeometry>(null!);

  const orbit = useMemo(() => {
    const radius = 2.6;
    const angle = (index / total) * Math.PI * 2;
    const tilt = (index % 2 === 0 ? 1 : -1) * (0.25 + (index / total) * 0.35);
    const speed = 0.22 + (index % 3) * 0.05;
    return { radius, angle, tilt, speed };
  }, [index, total]);

  const positions = useMemo(() => new Float32Array([0, 0, 0, 0, 0, 0]), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = progressRef.current;
    const focused = focusIndexRef.current === index;
    const anyFocus = focusIndexRef.current >= 0;

    const a = orbit.angle + t * orbit.speed * (1 + progress * 1.4);
    const x = Math.cos(a) * orbit.radius;
    const z = Math.sin(a) * orbit.radius;
    const y = Math.sin(a * 1.6 + orbit.tilt) * 0.75 * (1 + progress * 0.4);

    if (group.current) {
      group.current.position.set(x, y, z);
      group.current.rotation.x = t * 0.4 + index;
      group.current.rotation.y = t * 0.6 + index;
      const targetScale = focused ? 1.55 : anyFocus ? 0.6 : 1;
      group.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );
    }
    const targetOpacity = focused ? 1 : anyFocus ? 0.22 : 0.85;
    if (mat.current) {
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity,
        focused ? 1.6 : 0.5,
        0.08,
      );
      mat.current.opacity = THREE.MathUtils.lerp(
        mat.current.opacity,
        targetOpacity,
        0.08,
      );
    }
    if (glow.current) {
      glow.current.opacity = THREE.MathUtils.lerp(
        glow.current.opacity,
        focused ? 0.6 : anyFocus ? 0.08 : 0.28,
        0.08,
      );
    }
    if (line.current) {
      line.current.opacity = THREE.MathUtils.lerp(
        line.current.opacity,
        focused ? 0.9 : anyFocus ? 0.08 : 0.35,
        0.08,
      );
    }
    if (lineGeom.current) {
      const arr = lineGeom.current.attributes.position.array as Float32Array;
      arr[3] = x;
      arr[4] = y;
      arr[5] = z;
      lineGeom.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* connector line from core */}
      <line>
        <bufferGeometry ref={lineGeom}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={line}
          color={skill.hue}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>
      <group ref={group}>
        {/* halo */}
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshBasicMaterial
            ref={glow}
            color={skill.hue}
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* body */}
        <mesh>
          {nodeGeometry(skill.geometry)}
          <meshStandardMaterial
            ref={mat}
            color="#02110D"
            emissive={skill.hue}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.25}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* wireframe overlay */}
        <mesh>
          {nodeGeometry(skill.geometry)}
          <meshBasicMaterial
            color={skill.hue}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>
    </>
  );
}

function Rig({
  progressRef,
  focusIndexRef,
}: {
  progressRef: { current: number };
  focusIndexRef: { current: number };
}) {
  const group = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const mouse = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector2());

  useFrame((state, dt) => {
    target.current.set(state.pointer.x, state.pointer.y);
    mouse.current.lerp(target.current, 0.06);
    const p = progressRef.current;
    if (group.current) {
      group.current.rotation.y += dt * (0.08 + p * 0.35);
      group.current.rotation.x = mouse.current.y * 0.25 + p * 0.15;
      group.current.rotation.z = mouse.current.x * 0.1;
    }
    if (core.current) {
      const t = state.clock.elapsedTime;
      core.current.rotation.x = t * 0.3;
      core.current.rotation.y = t * 0.4;
      const s = 1 + Math.sin(t * 1.2) * 0.05;
      core.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      {/* core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#053931"
          emissive="#1FE0B5"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.15}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#02110D"
          emissive="#5BF0D6"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.3}
        />
      </mesh>
      {skills.map((s, i) => (
        <SkillNode
          key={s.id}
          skill={s}
          index={i}
          total={skills.length}
          progressRef={progressRef}
          focusIndexRef={focusIndexRef}
        />
      ))}
    </group>
  );
}

export function SkillsOrbit({
  progressRef,
  focusIndexRef,
}: {
  progressRef: { current: number };
  focusIndexRef: { current: number };
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.6, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 4, 5]} intensity={1} color="#5BF0D6" />
      <pointLight position={[-4, -2, -3]} intensity={2} color="#1FE0B5" />
      <Rig progressRef={progressRef} focusIndexRef={focusIndexRef} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.95}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
