export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  tags: string[];
  span: "lg" | "md" | "sm";
  shape: "torus" | "ico" | "octa" | "knot" | "box" | "sphere";
  hue: string;
};

export const projects: Project[] = [
  {
    id: "aurora-os",
    title: "Aurora OS",
    category: "Product Site",
    year: "2025",
    summary:
      "Flagship launch site for a spatial operating system. Realtime WebGL hero, scroll-bound interface tour, custom shader transitions.",
    tags: ["R3F", "GLSL", "Lenis"],
    span: "lg",
    shape: "knot",
    hue: "#1FE0B5",
  },
  {
    id: "halo-audio",
    title: "Halo Audio",
    category: "E-commerce",
    year: "2025",
    summary:
      "3D headphone configurator with material swapping, reactive audio visualizer, and a physically-based product viewer.",
    tags: ["Three.js", "Drei", "Zustand"],
    span: "md",
    shape: "torus",
    hue: "#5BF0D6",
  },
  {
    id: "nimbus-data",
    title: "Nimbus Dataviz",
    category: "Dashboard",
    year: "2024",
    summary:
      "Realtime 3D network graph for cloud infrastructure — 50k nodes, GPU instancing, and a buttery 120fps inspector.",
    tags: ["WebGPU", "D3", "Workers"],
    span: "md",
    shape: "ico",
    hue: "#9FF5E0",
  },
  {
    id: "kintsu",
    title: "Kintsu Studio",
    category: "Agency Site",
    year: "2024",
    summary:
      "Editorial portfolio for a Tokyo motion studio. Page-flip transitions, sound design, and a custom cursor language.",
    tags: ["GSAP", "Lenis", "Framer"],
    span: "sm",
    shape: "octa",
    hue: "#1FE0B5",
  },
  {
    id: "field-notes",
    title: "Field Notes",
    category: "Long-form",
    year: "2023",
    summary:
      "An interactive essay on procedural terrain. Embedded R3F demos, GLSL playgrounds, and a calm typographic system.",
    tags: ["MDX", "R3F", "Shaders"],
    span: "sm",
    shape: "sphere",
    hue: "#5BF0D6",
  },
  {
    id: "vector-bank",
    title: "Vector Bank",
    category: "Fintech",
    year: "2023",
    summary:
      "Onboarding flow for a neo-bank. 3D card reveal, animated value tickers, and a motion-driven hero state machine.",
    tags: ["React", "Motion", "Three"],
    span: "md",
    shape: "box",
    hue: "#9FF5E0",
  },
];
