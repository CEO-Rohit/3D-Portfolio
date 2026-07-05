import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const HeroCanvas = lazy(() =>
  import("@/components/three/HeroCanvas").then((m) => ({ default: m.HeroCanvas })),
);

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = ["ROHIT", "KUMAR"];

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden"
    >
      {/* 3D centerpiece */}
      <div className="absolute inset-0 -z-10">
        {mounted && (
          <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
            <HeroCanvas />
          </Suspense>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 45%, transparent 0%, var(--background) 78%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-20 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-3 rounded-full glass px-4 py-1.5 font-mono text-xs text-muted-foreground"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          About Me
        </motion.div>

        <h1
          ref={titleRef}
          className="font-display text-[14vw] font-bold leading-[0.92] tracking-tight text-foreground md:text-[10vw] lg:text-[105px]"
        >
          {title.map((word, wi) => (
            <span key={wi} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.1,
                  delay: 0.5 + wi * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="max-w-md text-base text-muted-foreground md:text-lg">
            3D Web Architect & Full Stack Developer crafting immersive WebGL
            experiences at the edge of design and engineering.
          </motion.p>

          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <div>
              <div className="text-foreground/40">Lat</div>
              <div className="mt-1 text-foreground">28.61° N</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-foreground/40">Long</div>
              <div className="mt-1 text-foreground">77.20° E</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-foreground/40">Stack</div>
              <div className="mt-1 text-foreground">R3F · GLSL</div>
            </div>
          </motion.div> */}
        </div>
      </div>

      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        scroll ↓
      </motion.div> */}
    </section>
  );
}