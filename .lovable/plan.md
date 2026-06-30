
# Rohit Kumar — 3D Web Architect Portfolio

A cinematic, cyber-minimal portfolio built on the existing TanStack Start + Tailwind v4 stack, themed around the "Aurora Forest" palette (#053931). Focus: a hero WebGL centerpiece, smooth-scroll storytelling, magnetic interactions, and a custom 3D preloader.

## Design System

Palette (oklch tokens in `src/styles.css`):
- `--background` Aurora Forest deep `#02110D`
- `--surface` `#053931` (the swatch)
- `--surface-elev` `#0A4F44`
- `--foreground` `#E8F3EF` (soft mint white)
- `--muted-foreground` `#7FA89E`
- `--primary` aurora teal-glow `#1FE0B5`
- `--accent` cool cyan rim `#5BF0D6`
- `--border` `rgba(95, 240, 214, 0.12)`
- Gradients: `--gradient-aurora` (forest → teal glow), `--gradient-glass` (translucent surface)
- Shadows: `--shadow-glow` (teal bloom), `--shadow-elevated`

Typography (loaded via `<link>` in `__root.tsx`):
- Display: **Syncopate** (700/400) for hero + section headers
- Body: **Space Grotesk** (400/500/600)
- Mono: **JetBrains Mono** for code/labels/time

Effects:
- Glassmorphism utility (`@utility glass`) — blurred surface + ultra-thin border
- Neon drop-shadow utility (`@utility glow-teal`)
- Noise grain overlay (subtle SVG)
- Lenis smooth scroll + GSAP ScrollTrigger
- Custom cursor magnet hook (`useMagnetic`)

## Folder Structure

```text
src/
  routes/
    __root.tsx           (fonts, head, Lenis provider, cursor)
    index.tsx            (Hero + Experience + Projects + Footer scroll page)
  components/
    layout/
      Navbar.tsx
      Footer.tsx
      Preloader.tsx
      SmoothScroll.tsx   (Lenis bridge)
      GrainOverlay.tsx
    three/
      HeroCanvas.tsx     (R3F Canvas + Suspense + EffectComposer)
      ParticleCore.tsx   (instanced particle monolith, mouse inertia)
      FooterTerrain.tsx  (shader plane wave grid)
      ProjectViewer.tsx  (modal R3F viewer)
      Lights.tsx
    sections/
      Hero.tsx
      Experience.tsx
      Projects.tsx
      ProjectCard.tsx    (tilt + parallax)
    ui/                  (existing shadcn)
  hooks/
    useMagnetic.ts
    useMousePosition.ts
    useLocalTime.ts
    useScrollReveal.ts   (GSAP SplitText reveal)
  lib/
    motion.ts            (shared eases, variants)
    three-utils.ts
  styles.css             (tokens, glass/glow utilities, grain)
```

## Implementation Steps

1. **Dependencies**: `bun add three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing gsap @gsap/react lenis framer-motion`.
2. **Design tokens & fonts**: rewrite `src/styles.css` with Aurora Forest oklch tokens, `@theme inline` mapping, `@utility glass`, `@utility glow-teal`, `@utility text-balance-tight`. Add Google Fonts `<link>` tags in `__root.tsx` head.
3. **Smooth scroll + cursor**: `SmoothScroll.tsx` wraps app body with Lenis, syncs to GSAP ticker. Mount in `RootComponent`.
4. **Preloader**: full-screen overlay reading R3F `useProgress`; animated SVG ring + monospace percent; exits with GSAP timeline.
5. **Navbar**: floating glass pill, `framer-motion` `layoutId` underline morphing between active links, magnetic CTA via `useMagnetic`. Logo "RK //" with glitch on hover (CSS clip-path layers).
6. **Hero**: `HeroCanvas` mounts `<Canvas>` with `ParticleCore` (instanced mesh of ~4000 points orbiting a distorted icosahedron; mouse-driven rotation with damped lerp; click pulses particle velocity). Bloom + chromatic aberration via `@react-three/postprocessing`. Foreground typographic overlay with GSAP staggered char reveal.
7. **Experience**: vertical timeline with scroll-triggered reveals (GSAP ScrollTrigger), monospace year labels, glass cards.
8. **Projects**: asymmetric CSS grid (col-span variations), `ProjectCard` uses Framer Motion `useMotionValue` rotateX/Y tilt + parallax cover. Click opens `ProjectViewer` modal — R3F canvas with OrbitControls rendering a placeholder GLTF/primitive per project.
9. **Footer**: oversized "LET'S CONNECT." Syncopate headline, magnetic social links, JetBrains Mono local-time ticker, R3F `FooterTerrain` plane with custom vertex shader sine-wave grid fading to background.
10. **Performance**: lazy-load `HeroCanvas`/`ProjectViewer`/`FooterTerrain` via `React.lazy` + Suspense; cap DPR `[1, 1.75]`; `shadow-map` only on hero key light; `frameloop="demand"` for footer terrain when offscreen (IntersectionObserver).
11. **Accessibility**: respect `prefers-reduced-motion` (disable Lenis, freeze particles, fade-only reveals); semantic landmarks; focus-visible glow rings; alt text on project media.
12. **SEO**: update `index.tsx` head with title "Rohit Kumar — 3D Web Architect & Creative Developer", description, og tags.

## Technical Notes

- TanStack Start runs SSR — guard all WebGL/Lenis/GSAP behind `useEffect` or dynamic import; canvas components are client-only via `React.lazy` + Suspense fallback (the preloader).
- Tailwind v4: tokens in `@theme inline`, all custom utilities via `@utility`, no `tailwind.config.js`.
- Fonts loaded with `<link>` in `__root.tsx` head — never `@import` remote URLs in `styles.css`.
- No backend needed; everything is presentational. Lovable Cloud not required.
- Project data + 3D models live in `src/data/projects.ts` with placeholder primitives until real GLTFs are supplied.

## Open Questions

Before I build, two quick confirmations would sharpen the result — but I can also proceed with sensible defaults if you'd rather I just go.

1. **Project content**: do you have real projects (titles, descriptions, links, images/GLTFs) to feature, or should I scaffold 4–6 placeholder projects you can edit later?
2. **Experience content**: any roles/companies/years to include, or placeholder timeline entries?

Reply with content or "use placeholders" and I'll implement.
