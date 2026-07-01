import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";

const links = [
  { id: "home", label: "Home", href: "#home" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [active, setActive] = useState("home");
  const [hover, setHover] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.4);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const indicator = hover ?? active;

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-5 z-50 -translate-x-1/2"
    >
      <div
        className={`glass flex items-center gap-1 rounded-full px-2 py-2 transition-shadow duration-500 ${
          scrolled ? "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]" : ""
        }`}
      >
        <Link
          to="/"
          className="group relative flex h-10 items-center rounded-full px-4 font-mono text-sm font-medium text-foreground"
        >
          <span className="relative inline-block">
            <span className="absolute inset-0 rounded-full bg-primary/10 transition-opacity group-hover:opacity-100" />
          </span>
        </Link>

        <ul
          className="hidden items-center gap-0 px-1 md:flex"
          onMouseLeave={() => setHover(null)}
        >
          {links.map((l) => (
            <li key={l.id} className="relative">
              <a
                href={l.href}
                onMouseEnter={() => setHover(l.id)}
                onClick={() => setActive(l.id)}
                className="relative z-10 block rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
              <AnimatePresence>
                {indicator === l.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full bg-primary/12"
                    style={{
                      boxShadow:
                        "inset 0 0 0 1px color-mix(in oklab, var(--primary) 30%, transparent)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <a
          ref={ctaRef}
          href="#contact"
          className="relative ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-[0_0_24px_rgba(76,232,196,0.55)]"
        >
          <span className="relative">Let's Build</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="-mr-0.5">
            <path
              d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </motion.nav>
  );
}
