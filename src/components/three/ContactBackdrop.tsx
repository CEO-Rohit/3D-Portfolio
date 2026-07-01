import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  // simplex-ish cheap fbm
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.,0.));
    float c = hash(i + vec2(0.,1.));
    float d = hash(i + vec2(1.,1.));
    vec2 u = f*f*(3.-2.*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 5; i++){
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = uv * 2.5 - 1.25;
    p += uMouse * 0.35;
    float t = uTime * 0.08;
    float n = fbm(p * 1.4 + vec2(t, -t*0.7));
    float n2 = fbm(p * 2.6 - vec2(t*0.5, t));

    // aurora band
    float band = smoothstep(0.15, 0.85, n * 0.7 + n2 * 0.4);
    vec3 col = mix(uColorA, uColorB, band);
    col = mix(col, uColorC, smoothstep(0.55, 0.95, n2));

    // vignette to blend into bg
    float d = distance(uv, vec2(0.5));
    float vignette = smoothstep(0.75, 0.2, d);
    col *= vignette;

    // soft glow
    col += uColorB * pow(band, 3.0) * 0.35;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function AuroraPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uColorA: { value: new THREE.Color("#02110D") },
      uColorB: { value: new THREE.Color("#1FE0B5") },
      uColorC: { value: new THREE.Color("#5BF0D6") },
    }),
    [],
  );

  useFrame((state, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(state.pointer.x, state.pointer.y),
      0.03,
    );
    if (mat.current) mat.current.uniformsNeedUpdate = true;
  });

  return (
    <mesh>
      <planeGeometry args={[10, 6, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

function OrbitingLights() {
  const g = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (g.current) g.current.rotation.y = t * 0.15;
  });
  return (
    <group ref={g}>
      <pointLight position={[3, 1.5, 2]} intensity={4} color="#1FE0B5" distance={10} />
      <pointLight position={[-3, -1, 1]} intensity={3} color="#5BF0D6" distance={10} />
    </group>
  );
}

export function ContactBackdrop() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.2} />
      <OrbitingLights />
      <AuroraPlane />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
