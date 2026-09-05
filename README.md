# TechCore Landing

TechCore — 3D dark-themed technology landing page with scroll-driven editorial chapters, built with React, TypeScript, and React Three Fiber.

## Features

- **Cohesive web3 3D family** — orbit gyroscope hero, nodeSphere network (platform), ringGate portal (access), waveGrid horizon (metrics); all modeled in Blender via MCP, exported as compressed Draco GLB with seamless loop animation
- **Editorial scroll chapters** — no-card layout: numbered flow, giant stat rows with count-up, statement CTA; alternating side text reveals (GSAP + Lenis smooth scroll + snap)
- **Animated background** — CSS-only particle motes, scanline sweep, grid drift (transform-only, zero WebGL cost)
- **Performance** — lazy-mount chapter canvases (IntersectionObserver), code-split chunks (three/motion/app), GLB preload, tuned DPR/antialias; ~120 FPS with all layers active
- **Accessibility** — `prefers-reduced-motion` fully respected (3D freeze, reveal skip, bg frozen), `:focus-visible` outlines, aria-live form feedback, AA contrast
- **Responsive** — 390px mobile to ultrawide with aspect-aware camera framing

## Tech Stack

- Vite 8 + React 18 + TypeScript
- Tailwind CSS 3 (custom palette: void/carbon/panel + volt lime)
- React Three Fiber + drei (GLTF + Draco)
- GSAP + ScrollTrigger + @gsap/react + Lenis
- Blender 5.2 (asset authoring via blender-mcp)
- Space Grotesk + JetBrains Mono

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

```bash
npm run build   # production build to dist/
```

## Project Structure

```
src/
  components/   # Nav, Hero, HeroCanvas, Platform, Metrics, Access, BgMotes, ScrollController
  scenes/       # ChapterScenes (per-chapter 3D canvases with lazy mounting)
  hooks/        # useSmoothScroll (Lenis), useScrollSlides (GSAP)
public/
  techcore.glb        # hero gyroscope (Draco)
  props/*.glb         # nodesphere, ringgate, wavegrid (Draco)
  draco/              # Draco decoder
techcore-hero.blend   # Blender source scene
```

**Author:** Raliq Hidayat BM3
