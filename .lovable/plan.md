
## Skills Section + Immersive Contact Form

Add a new **Skills** section between Projects and Footer, plus an **immersive Contact** section replacing the current Footer "Let's Connect" role (Footer stays as the outro grid).

### 1. Skills section — real-time 3D scroll simulation

`src/components/sections/Skills.tsx` + `src/components/three/SkillsOrbit.tsx`

- Sticky-scroll section (~2.5x viewport tall) with a pinned R3F canvas on the left and scroll-driven skill copy on the right.
- 3D scene: a central glowing icosahedron core with **6 orbiting nodes** — one per skill (Java, Spring Boot, Microservices, React, Three.js, 3D Web Dev). Each node is an instanced mesh with a distinctive geometry (torus knot, cube, cluster, sphere, tetrahedron, ring).
- Real-time simulation: nodes orbit continuously with per-node speed + tilt, connected to the core by animated dashed line segments (`LineSegments` with shader dash offset). Slight physics-style trail using `MeshBasicMaterial` + additive blending + bloom (existing post pipeline).
- Scroll behavior via GSAP ScrollTrigger:
  - Pin the section, drive a `progress` value 0→1.
  - Progress rotates the whole orbit rig, increases particle speed, and **focuses** the node matching the currently-active skill (camera lerps toward node, others dim to 25% opacity).
  - Right column: each skill is a full-height panel with Syncopate name, JetBrains Mono category label, a short blurb, and a proficiency bar that fills as its panel enters view.
- Mouse parallax on the rig (reusing the hero's damped lerp pattern).
- Respects `prefers-reduced-motion`: freezes orbit, disables pin, shows a static grid of skill cards instead.
- Lazy-loaded (`React.lazy` + Suspense) like `HeroCanvas`.

Skills data lives in a new `src/data/skills.ts` (name, category, blurb, accent hex, geometry key, level 0–1).

### 2. Contact section — immersive form

New `src/components/sections/Contact.tsx` + `src/components/three/ContactBackdrop.tsx`, mounted between Skills and Footer. Contact becomes the "Let's Connect" moment; Footer trims down to social row + local time + copyright.

- Full-viewport section, background R3F canvas with:
  - Slow-rotating volumetric aurora (shader plane with fbm noise in teal/mint) fading into the dark bg.
  - Soft point light + rim light rig for "perfect lighting".
  - Bloom + subtle chromatic aberration reused from the shared post pipeline.
- Foreground glass card (`glass` + `glow-teal`) with ultra-thin border and inner gradient sheen that follows cursor (radial-gradient mask via `useMotionValue`).
- Fields: **Name, Email, Subject, Message**. Floating labels, monospace helper text, focus glow ring in `--primary`, inline validation.
- Submit button = magnetic CTA (reuse `useMagnetic`) with loading shimmer + success state morph ("Message sent ✓").
- Left column: oversized Syncopate "LET'S BUILD SOMETHING REAL." headline, availability pill ("◇ Available Q3 2026"), direct email link to `kumarrohit60060@gmail.com`.

### 3. Email delivery (Lovable Cloud + Lovable Emails)

Flow after plan approval:
1. Enable Lovable Cloud.
2. Check email domain status. If none, prompt the user to configure a sender domain via the setup dialog (required before sending).
3. Once a domain exists (any status), run email infra setup + scaffold app-email templates.
4. Add `src/lib/email-templates/contact-message.tsx` — React Email template with:
   - Aurora-themed inline styles matching the site (deep bg card, mint accents, JetBrains Mono meta row).
   - Fields: sender name, email (reply-to hint), subject, message body, submitted-at timestamp.
5. Add a public server route `src/routes/api/public/contact.ts` (POST) that:
   - Validates payload with Zod (trim, email, length caps: name ≤100, subject ≤150, message ≤2000).
   - Rate-limits via a lightweight in-memory token bucket keyed on IP header (best-effort).
   - Inserts row into a `contact_messages` table (Cloud) for record-keeping, with proper GRANTs + RLS (`service_role` only writes; no anon select).
   - Calls the internal `/lovable/email/transactional/send` route using service-role auth to send `contact-message` to **kumarrohit60060@gmail.com** with `replyTo` = submitter, idempotency key = row id.
6. `src/lib/contact/send.ts` — thin client helper the form posts to `/api/public/contact`.

### 4. Wiring

- `src/routes/index.tsx`: import + mount `<Skills />` after `<Projects />` and `<Contact />` before `<Footer />`. Update meta description to mention skills + contact.
- Trim `src/components/layout/Footer.tsx`: remove the giant "LET'S CONNECT" block (now owned by Contact); keep terrain wave, social row, local time, copyright.
- Anchor IDs: `#skills` and `#contact`; add both to `Navbar` links (Home, Projects, Skills, Contact) and update the underline morph list.

### Technical notes

- No new heavy libs — reuses three, R3F, drei, postprocessing, GSAP ScrollTrigger, Framer Motion, Lenis, zod (already installed via shadcn form).
- All new canvases lazy-loaded; DPR capped [1, 1.75]; `frameloop="demand"` for Skills when offscreen via IntersectionObserver.
- Contact route lives at `/api/public/contact` so it bypasses auth (public form); signature-style protection isn't applicable, so we rely on Zod + rate limit + Cloud suppression list.
- Recipient email `kumarrohit60060@gmail.com` is hardcoded server-side (not exposed to client).

### Open items handled by defaults
- Domain not yet set — I'll trigger the setup dialog once and pause until it's configured, then continue automatically.
- No captcha added (adds friction + external dep); can layer hCaptcha later if spam appears.
