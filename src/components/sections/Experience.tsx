import { motion } from "framer-motion";

const roles = [
  {
    year: "2026 — Now",
    role: "3D Web Developer",
    company: "Independent / Freelance",
    desc: "Building immersive WebGL flagship sites for design-led agencies and brands. R3F, GLSL shaders, performance budgets, motion design.",
    stack: ["Three.js", "R3F", "GLSL", "GSAP", "React"],
  },
  {
    year: "2026 — 2026",
    role: "Full Stack Developer Intern",
    company: "Digital Byte Solutions",
    desc: "Developed Restaurant website, Manufacturing ERP, healthcare website",
    stack: ["React", "NodeJs", "Express", "MongoDB", "PostgreSQL"],
  },
  {
    year: "2025 — 2025",
    role: "Java Full stack Developer",
    company: "VaultOfCodes",
    desc: "Developed full stack CRM and Online Reservatons systems.",
    stack: ["Java", "Java Database Connectivity (JDBC)", "JSP", "Jakarta Servlet", "MySQL"],
  },

  {
    year: "2024 — 2025",
    role: "frontend Developer",
    company: "ONLEI Technologies",
    desc: "Developed responsive Blogging website and prototypes for early-stage startups.",
    stack: ["JS", "CSS", "HTML"],
  },
];

export function Experience() {
  return (
    <section
      id="experience"
      className="relative w-full px-6 py-32 md:py-44"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ◇ 02 / Experience
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-7xl">
              MORE THAN TWO YEARS<br />
              <span className="text-muted-foreground">fULL STACK DEVELOPEMENT</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            A timeline of studios, products, and shipped experiences that taught
            me how the web really moves.
          </p>
        </div>

        <ol className="relative space-y-4 border-l border-border pl-6 md:pl-10">
          {roles.map((r, i) => (
            <motion.li
              key={r.year}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <span className="absolute -left-[34px] top-6 h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_rgba(31,224,181,0.6)] md:-left-[46px]" />
              <div className="glass overflow-hidden rounded-2xl p-6 transition-colors md:p-8">
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    {r.year}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {r.company}
                  </div>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                  {r.role}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {r.desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {r.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-surface/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}