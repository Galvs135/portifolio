# Lucas Galvão França — Portfolio

An Awwwards-style personal portfolio for a Software Engineer, inspired by the
craft of [steven.com](https://www.awwwards.com/sites/steven-com): a dark,
minimal aesthetic with a WebGL hero, custom cursor + particle trail, an
animated preloader, a full-screen menu with a page-transition wipe, and
scroll-driven motion throughout.

## Tech stack

- **React + Vite + TypeScript**
- **Three.js** via **@react-three/fiber** + **@react-three/drei** — hero shader
  object and the floating WebGL project preview
- **GSAP** (+ ScrollTrigger) — preloader, menu, transitions and reveals
- **Lenis** — smooth scrolling, synced to GSAP's ticker
- Plain **CSS** with design tokens + **CSS Modules** per component

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into /dist
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
```

## Editing content

Everything personal lives in a couple of small, typed data files:

- **Projects** — [`src/data/projects.ts`](src/data/projects.ts). Each project
  has a title, year, role, description, stack and an optional link. The two
  `colors` drive its procedural WebGL preview (no image assets needed — swap in
  real screenshots later if you like).
- **Social links** — [`src/data/socials.ts`](src/data/socials.ts). GitHub,
  LinkedIn, email and WhatsApp are wired here and reused in the menu and footer.
- **Navigation** — [`src/data/nav.ts`](src/data/nav.ts).

Copy (hero tagline, about text, skills) lives directly in the matching
section under [`src/sections/`](src/sections/).

## How it's wired

- [`src/App.tsx`](src/App.tsx) composes the preloader, cursor, background
  `<Scene>` canvas and the smooth-scrolled content.
- [`src/three/`](src/three/) holds the R3F scene, the hero shader object and the
  project preview, with GLSL kept as strings in
  [`src/three/shaders.ts`](src/three/shaders.ts).
- [`src/components/`](src/components/) holds the reusable pieces (Preloader,
  Cursor, Navbar, Menu, SmoothScroll, Transition and small UI helpers).

## Motion

All effects run full-strength on every device — the WebGL hero, particle-trail
cursor, magnetic buttons and the floating project preview are always on (no
reduced-motion or touch gating). Renderer DPR is capped at 2 only to avoid
needless overdraw on very high-density screens.

## To do for you

- Drop a real `public/og-image.png` (1200×630) for nice social sharing — the
  `<meta property="og:image">` tag in `index.html` already points at it.
