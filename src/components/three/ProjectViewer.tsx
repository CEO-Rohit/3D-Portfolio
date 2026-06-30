import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Project } from "@/data/projects";

function ProjectMesh({ shape, hue }: { shape: Project["shape"]; hue: string }) {
  const mat = (
    <meshStandardMaterial
      color={hue}
      emissive={hue}
      emissiveIntensity={0.6}
      metalness={0.85}
      roughness={0.15}
      wireframe={shape === "ico"}
    />
  );
  switch (shape) {
    case "torus":
      return <mesh><torusKnotGeometry args={[1, 0.32, 180, 32]} />{mat}</mesh>;
    case "ico":
      return <mesh><icosahedronGeometry args={[1.4, 1]} />{mat}</mesh>;
    case "octa":
      return <mesh><octahedronGeometry args={[1.5, 0]} />{mat}</mesh>;
    case "knot":
      return <mesh><torusKnotGeometry args={[1, 0.3, 220, 32, 2, 3]} />{mat}</mesh>;
    case "box":
      return <mesh><boxGeometry args={[1.8, 1.8, 1.8]} />{mat}</mesh>;
    case "sphere":
    default:
      return <mesh><sphereGeometry args={[1.4, 64, 64]} />{mat}</mesh>;
  }
}

export function ProjectViewer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
        style={{ background: "color-mix(in oklab, var(--background) 80%, transparent)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong relative grid h-full max-h-[860px] w-full max-w-6xl grid-rows-[1fr_auto] overflow-hidden rounded-3xl md:grid-cols-[1.4fr_1fr] md:grid-rows-1"
        >
          <div className="relative min-h-[320px]">
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 0, 4.5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
            >
              <color attach="background" args={["#02110D"]} />
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} color="#5BF0D6" />
              <pointLight position={[-4, -2, -3]} intensity={2} color={project.hue} />
              <Float speed={1.6} rotationIntensity={0.8} floatIntensity={0.6}>
                <ProjectMesh shape={project.shape} hue={project.hue} />
              </Float>
              <Environment preset="night" />
              <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={1.2} />
              <EffectComposer multisampling={0}>
                <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.8} mipmapBlur />
              </EffectComposer>
            </Canvas>
            <div className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ◇ 3D Viewer · drag to inspect
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t border-border p-8 md:border-l md:border-t-0 md:p-10">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span>{project.category} · {project.year}</span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/40 text-foreground transition hover:bg-surface"
              >
                ✕
              </button>
            </div>
            <h3 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              {project.title}
            </h3>
            <p className="text-muted-foreground">{project.summary}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Live site
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface/40"
              >
                Case study
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
