import { Suspense, lazy, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "@/data/projects";

const ProjectViewer = lazy(() =>
  import("@/components/three/ProjectViewer").then((m) => ({
    default: m.ProjectViewer,
  })),
);

const spanClass: Record<Project["span"], string> = {
  lg: "md:col-span-8 md:row-span-2 aspect-[16/10] md:aspect-auto",
  md: "md:col-span-4 aspect-[5/4]",
  sm: "md:col-span-4 aspect-[5/4]",
};

function Card({ p, onOpen }: { p: Project; onOpen: (p: Project) => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const px = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });
  const py = useSpring(useTransform(y, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => onOpen(p)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={`group relative overflow-hidden rounded-3xl glass text-left transition-shadow hover:shadow-[0_30px_80px_-30px_rgba(31,224,181,0.35)] ${spanClass[p.span]}`}
    >
      {/* gradient field */}
      <motion.div
        style={{ x: px, y: py }}
        className="absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at 70% 30%, ${p.hue}33 0%, transparent 60%), radial-gradient(50% 50% at 20% 80%, ${p.hue}22 0%, transparent 60%), linear-gradient(135deg, var(--surface) 0%, var(--background) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at 50% 50%, black 30%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* meta */}
      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>◇ {p.category}</span>
          <span>{p.year}</span>
        </div>

        <div>
          <h3 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            {p.title}
          </h3>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            {p.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground"
              >
                {t}
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View 3D
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function Projects() {
  const projects = [
    {
      id: 1,
      title: "Basque Restaurant",
      image: "/projects/basque.jpeg",
      description: "A modern and responsive restaurant website featuring online reservations, event booking, interactive navigation and an elegant user experience.",
      live: "https://basquedehradun.com/",

    },
    {
      id: 2,
      title: "Manufacturing ERP",
      image: "/projects/proFactory.jpeg",
      description: "Interactive manufacturing dashboard with production insights, inventory control, analytics and responsive design for efficient business management.",
      live: "https://manufacturingerp.netlify.app/",

    },
    {
      id: 3,
      title: "Nexa Care Healthcare",
      image: "/projects/nexa.jpeg",
      description: "A modern and responsive healthcare website featuring medical services, doctor information, appointment sections and a clean user experience.",
      live: "https://nexa-caree.netlify.app/",

    },

    {
      id: 4,
      title: "Restro Takeaway",
      image: "/projects/rest.jpeg",
      description: "A modern and responsive restaurant website featuring online food ordering, takeaway services, menu showcase and an intuitive user experience.",
      live: "https://restrotakeaway.netlify.app/",

    },

    {
      id: 5,
      title: "Flyward",
      image: "/projects/flyward.jpeg",
      description: "A modern aviation finance platform that helps airlines, lessors, financiers, and investors analyze aircraft maintenance costs, forecast cash flows, evaluate transactions, and make data-driven financial decisions through an intuitive and responsive interface.",
      live: "https://www.flyward.com/",
    }
  ];


  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative w-full px-6 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ◇ 03 / Selected Work
            </div>
            <h2 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
              BUILT TO BE<br />
              <span className="text-muted-foreground">FELT, NOT JUST SEEN.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            A handful of recent shipped experiences. Click any tile to open its
            interactive 3D viewer.
          </p>
        </div>


      </div>
      {/* Card */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[oklch(0.24_0.045_175)] border border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col"
          >
            <div className="p-3">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 sm:h-56 lg:h-60 object-cover rounded-2xl"
              />
            </div>

            <div className="px-6 pb-6 flex flex-col flex-1">
              <h2 className="text-2xl font-bold text-center mb-4 font-serif">
                {project.title}
              </h2>

              <p className="text-gray-400 text-center text-sm leading-7 mb-6 ">
                {project.description}
              </p>

              <div className="mt-auto flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" w-full sm:w-auto text-center px-6 py-3 rounded-full border border-slate-600"
                >
                  Visit Site
                </a>

              </div>
            </div>
          </div>
        ))}

      </div>


    </section>
  );
}