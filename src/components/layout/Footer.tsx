import { Suspense, lazy, useEffect, useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useLocalTime } from "@/hooks/useLocalTime";

const FooterTerrain = lazy(() =>
  import("@/components/three/FooterTerrain").then((m) => ({
    default: m.FooterTerrain,
  })),
);

const socials = [
  { label: "GitHub", href: "https://github.com", handle: "@rohitkumar" },
  { label: "LinkedIn", href: "https://linkedin.com", handle: "in/rohitkumar" },
  { label: "Twitter / X", href: "https://x.com", handle: "@rohit_3d" },
  { label: "Email", href: "mailto:hello@rohit.dev", handle: "hello@rohit.dev" },
];

function MagneticLink({ href, label, handle }: { href: string; label: string; handle: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-6 border-b border-border py-5 transition-colors hover:text-primary"
    >
      <span className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        {label}
      </span>
      <span className="font-mono text-xs text-muted-foreground group-hover:text-primary">
        {handle}
        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">↗</span>
      </span>
    </a>
  );
}

export function Footer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const time = useLocalTime("Asia/Kolkata");
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.4);

  return (
    <footer id="contact" className="relative isolate w-full overflow-hidden border-t border-border">
      {/* terrain */}
      <div className="absolute inset-0 -z-10">
        {mounted && (
          <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
            <FooterTerrain />
          </Suspense>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--background) 0%, transparent 30%, transparent 70%, var(--background) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          ◇ 04 / Contact
        </div>
        <h2 className="font-display text-[16vw] font-bold leading-[0.9] tracking-tighter md:text-[10vw]">
          LET'S
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            CONNECT.
          </span>
        </h2>

        <p className="mt-8 max-w-xl text-muted-foreground md:text-lg">
          I'm taking on a small number of projects for late 2026. If you're
          building something ambitious — let's talk.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            ref={ctaRef}
            href="mailto:hello@rohit.dev"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground transition-shadow hover:shadow-[0_0_36px_rgba(31,224,181,0.5)]"
          >
            Start a project
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-foreground/15 transition-transform group-hover:rotate-45">
              ↗
            </span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-4 font-medium text-foreground transition hover:bg-surface/40"
          >
            Download CV
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Channels
            </div>
            <div>
              {socials.map((s) => (
                <MagneticLink key={s.label} {...s} />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10">
            <div className="grid grid-cols-2 gap-6 font-mono text-xs">
              <div>
                <div className="text-muted-foreground/70 uppercase tracking-[0.2em]">Based in</div>
                <div className="mt-2 text-foreground">New Delhi, IN</div>
              </div>
              <div>
                <div className="text-muted-foreground/70 uppercase tracking-[0.2em]">Local time</div>
                <div className="mt-2 tabular-nums text-primary">{time || "--:--:--"}</div>
              </div>
              <div>
                <div className="text-muted-foreground/70 uppercase tracking-[0.2em]">Status</div>
                <div className="mt-2 flex items-center gap-2 text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  Open for Q4
                </div>
              </div>
              <div>
                <div className="text-muted-foreground/70 uppercase tracking-[0.2em]">Response</div>
                <div className="mt-2 text-foreground">~24 hours</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:flex-row md:items-center">
          <span>© 2026 Rohit Kumar — Crafted with R3F + GSAP</span>
          <span>v1.0.0 · Aurora Forest</span>
        </div>
      </div>
    </footer>
  );
}
