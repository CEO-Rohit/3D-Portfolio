import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/data/skills";

const SkillsOrbit = lazy(() =>
  import("@/components/three/SkillsOrbit").then((m) => ({
    default: m.SkillsOrbit,
  })),
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const focusIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${window.innerHeight * skills.length}`,
        pin: ".skills-pin",
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const idx = Math.min(
            skills.length - 1,
            Math.floor(self.progress * skills.length),
          );
          focusIndexRef.current = idx;
          setActiveIndex(idx);
        },
      });
      return () => st.kill();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full"
      style={{ minHeight: `${(skills.length + 1) * 100}vh` }}
    >
      <div className="skills-pin relative h-screen w-full overflow-hidden">
        {/* backdrop grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(circle at 50% 50%, black 20%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-12">
          {/* 3D canvas */}
          <div className="relative col-span-1 h-[55vh] md:col-span-7 md:h-[80vh]">
            {mounted && (
              <Suspense fallback={<div className="h-full w-full" />}>
                <SkillsOrbit
                  progressRef={progressRef}
                  focusIndexRef={focusIndexRef}
                />
              </Suspense>
            )}
            {/* section label */}
            <div className="pointer-events-none absolute left-0 top-0 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ◇ 04 / Stack
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              realtime.simulation · {String(activeIndex + 1).padStart(2, "0")}/
              {String(skills.length).padStart(2, "0")}
            </div>
          </div>

          {/* text column */}
          <div className="relative col-span-1 md:col-span-5">
            <h2 className="mb-8 font-display text-4xl font-bold tracking-tight md:text-5xl">
              THE STACK<br />
              <span className="text-muted-foreground">IN MOTION.</span>
            </h2>
            <div className="relative h-[38vh] md:h-[50vh]">
              {skills.map((s, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={s.id}
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : i < activeIndex
                          ? "translateY(-30px)"
                          : "translateY(30px)",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div
                      className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em]"
                      style={{ color: s.hue }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background: s.hue,
                          boxShadow: `0 0 12px ${s.hue}`,
                        }}
                      />
                      {String(i + 1).padStart(2, "0")} · {s.category}
                    </div>
                    <h3
                      className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl"
                      style={{
                        textShadow: `0 0 40px ${s.hue}55`,
                      }}
                    >
                      {s.name}
                    </h3>
                    <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">
                      {s.blurb}
                    </p>
                    <div className="mt-8 max-w-sm">
                      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        <span>Proficiency</span>
                        <span style={{ color: s.hue }}>
                          {Math.round(s.level * 100)}%
                        </span>
                      </div>
                      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-border">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                          style={{
                            width: isActive ? `${s.level * 100}%` : "0%",
                            background: `linear-gradient(90deg, ${s.hue}, ${s.hue}00)`,
                            boxShadow: `0 0 12px ${s.hue}`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* progress dots */}
            <div className="mt-8 flex items-center gap-2">
              {skills.map((s, i) => (
                <span
                  key={s.id}
                  className="h-[3px] flex-1 rounded-full transition-all duration-500"
                  style={{
                    background:
                      i <= activeIndex ? s.hue : "color-mix(in oklab, var(--border) 100%, transparent)",
                    boxShadow:
                      i === activeIndex ? `0 0 10px ${s.hue}` : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
