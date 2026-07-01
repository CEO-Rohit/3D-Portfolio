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
  { label: "Email", href: "mailto:kumarrohit60060@gmail.com", handle: "kumarrohit60060@gmail.com" },
];

function MagneticLink({ href, label, handle }: { href: string; label: string; handle: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-6 border-b border-border py-4 transition-colors hover:text-primary"
    >
      <span className="font-display text-lg font-bold tracking-tight md:text-xl">
        {label}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground group-hover:text-primary">
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

  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-border">
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
              "linear-gradient(180deg, var(--background) 0%, transparent 40%, transparent 70%, var(--background) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
              RK //
            </div>
            <p className="max-w-sm font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
              Crafting the web in three dimensions.
            </p>
          </div>

          <div className="md:col-span-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Channels
            </div>
            {socials.map((s) => (
              <MagneticLink key={s.label} {...s} />
            ))}
          </div>

          <div className="md:col-span-3">
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
                  Open Q3
                </div>
              </div>
              <div>
                <div className="text-muted-foreground/70 uppercase tracking-[0.2em]">Response</div>
                <div className="mt-2 text-foreground">~24h</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:flex-row md:items-center">
          <span>© 2026 Rohit Kumar — Crafted with R3F + GSAP</span>
          <span>v1.0.0 · Aurora Forest</span>
        </div>
      </div>
    </footer>
  );
}
