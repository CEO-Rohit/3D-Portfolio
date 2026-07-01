export type Skill = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  level: number; // 0..1
  hue: string;
  geometry: "knot" | "cube" | "cluster" | "sphere" | "tetra" | "ring";
};

export const skills: Skill[] = [
  {
    id: "java",
    name: "Java",
    category: "Language / JVM",
    blurb:
      "Production JVM services — concurrency, streams, and clean domain models built to last.",
    level: 0.92,
    hue: "#F0A55B",
    geometry: "cube",
  },
  {
    id: "spring-boot",
    name: "Spring Boot",
    category: "Backend Framework",
    blurb:
      "REST APIs, security, observability. Opinionated defaults, tuned config, zero boilerplate.",
    level: 0.9,
    hue: "#6BE07A",
    geometry: "ring",
  },
  {
    id: "microservices",
    name: "Microservices",
    category: "Architecture",
    blurb:
      "Bounded contexts, async messaging, resilient contracts. Distributed systems that stay debuggable.",
    level: 0.85,
    hue: "#5BB8F0",
    geometry: "cluster",
  },
  {
    id: "react",
    name: "React",
    category: "Frontend",
    blurb:
      "Composable UI, suspense-first data flow, and interfaces that feel responsive at 60fps.",
    level: 0.94,
    hue: "#5BF0D6",
    geometry: "tetra",
  },
  {
    id: "three",
    name: "Three.js",
    category: "WebGL / 3D",
    blurb:
      "Custom shaders, GPU instancing, post-processing pipelines. Cinematic 3D on the open web.",
    level: 0.88,
    hue: "#1FE0B5",
    geometry: "knot",
  },
  {
    id: "web3d",
    name: "3D Web Dev",
    category: "Creative Engineering",
    blurb:
      "R3F, GLSL, physics — interactive product experiences that blur site and simulation.",
    level: 0.86,
    hue: "#B47BFF",
    geometry: "sphere",
  },
];
