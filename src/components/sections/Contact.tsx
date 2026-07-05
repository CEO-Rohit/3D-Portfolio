import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { z } from "zod";
import { useMagnetic } from "@/hooks/useMagnetic";

const ContactBackdrop = lazy(() =>
  import("@/components/three/ContactBackdrop").then((m) => ({
    default: m.ContactBackdrop,
  })),
);

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Required").max(150),
  message: z.string().trim().min(1, "Required").max(2000),
});

type FormState = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const initial: FormState = { name: "", email: "", subject: "", message: "" };

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
      >
        <span>{label}</span>
        {error && <span className="text-destructive normal-case">{error}</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-300 focus:border-primary/60 focus:bg-background/60 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent),0_0_30px_-6px_color-mix(in_oklab,var(--primary)_60%,transparent)]";

export function Contact() {
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const ctaRef = useMagnetic<HTMLButtonElement>(0.35);
  const emailLinkRef = useMagnetic<HTMLAnchorElement>(0.3);
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sheen = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 55%)`;

  useEffect(() => setMounted(true), []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      setStatus("ok");
      setValues(initial);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section
      id="contact"
      className="relative isolate w-full overflow-hidden px-6 py-32 md:py-44"
    >
      {/* 3D backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {mounted && (
          <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
            <ContactBackdrop />
          </Suspense>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--background) 0%, transparent 25%, transparent 75%, var(--background) 100%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Left: headline */}
        <div className="md:col-span-5">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            ◇ 05 / Contact
          </div>
          <h2 className="font-display text-3xl font-bold leading-[0.9] tracking-tighter md:text-6xl">
            LET'S BUILD
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              SOMETHING REAL.
            </span>
          </h2>
          <p className="mt-8 max-w-md text-muted-foreground md:text-lg text-color-white/80">
            Product sites, 3D interfaces, immersive brand moments. If it needs
            to feel alive on the web — send a note.
          </p>

          {/* <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available · Q3 2026
          </div> */}

          {/* <div className="mt-10">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Direct
            </div>
            <a
              ref={emailLinkRef}
              href="mailto:kumarrohit60060@gmail.com"
              className="inline-block font-display text-2xl font-bold tracking-tight text-foreground transition-colors hover:text-primary md:text-3xl"
            >
              kumarrohit60060@gmail.com ↗
            </a>
          </div> */}
        </div>

        {/* Right: glass form */}
        <div className="md:col-span-7">
          <motion.div
            ref={cardRef}
            onMouseMove={onMove}
            className="glass-strong relative overflow-hidden rounded-3xl p-8 md:p-10"
            style={{
              boxShadow:
                "0 40px 120px -40px rgba(31,224,181,0.35), inset 0 1px 0 color-mix(in oklab, var(--primary) 20%, transparent)",
            }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-80 transition-opacity"
              style={{ background: sheen }}
            />

            <div className="relative">
              {status === "ok" ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-primary/15 text-primary shadow-[0_0_40px_rgba(31,224,181,0.4)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l5 5L20 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl font-bold tracking-tight">
                    MESSAGE SENT.
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                    Thanks — I'll get back to you shortly. In the meantime, keep
                    building.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full border border-border bg-background/40 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground transition hover:bg-surface/40"
                  >
                    ◇ Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field id="name" label="Name" error={errors.name}>
                      <input
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder="Ada Lovelace"
                        value={values.name}
                        onChange={update("name")}
                        className={inputClass}
                        maxLength={100}
                      />
                    </Field>
                    <Field id="email" label="Email" error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@studio.com"
                        value={values.email}
                        onChange={update("email")}
                        className={inputClass}
                        maxLength={255}
                      />
                    </Field>
                  </div>
                  <Field id="subject" label="Subject" error={errors.subject}>
                    <input
                      id="subject"
                      name="subject"
                      placeholder="Project · timeline · brief"
                      value={values.subject}
                      onChange={update("subject")}
                      className={inputClass}
                      maxLength={150}
                    />
                  </Field>
                  <Field id="message" label="Message" error={errors.message}>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell me about what you're building…"
                      value={values.message}
                      onChange={update("message")}
                      className={`${inputClass} resize-none`}
                      maxLength={2000}
                    />
                    <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground/60">
                      {values.message.length}/2000
                    </div>
                  </Field>

                  {status === "error" && errorMsg && (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex-col md:flex-row lg:flex-row items-center justify-between gap-4 pt-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      → routed to kumarrohit60060@gmail.com
                    </p>
                    <button
                      ref={ctaRef}
                      type="submit"
                      disabled={status === "loading"}
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground transition-shadow hover:shadow-[0_0_36px_rgba(31,224,181,0.6)] disabled:opacity-70"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative">
                        {status === "loading" ? "Sending…" : "Send message"}
                      </span>
                      <span className="relative grid h-7 w-7 place-items-center rounded-full bg-primary-foreground/15 transition-transform group-hover:rotate-45">
                        
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
