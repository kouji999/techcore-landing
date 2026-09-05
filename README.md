# TechCore Landing

TechCore — 3D dark-themed technology landing page with an interactive Blender-built hero, built with React, TypeScript, and React Three Fiber.

## Features

- **Interactive 3D hero** — TechCore gyroscope model (icosphere core, orbital rings, satellite nodes) modeled and animated in Blender via MCP, exported as compressed Draco GLB (~97KB)
- **Seamless animation loop** — all rotations are clean 2π multiples with linear interpolation; loop boundary is mathematically invisible (frame 0 ≡ frame 120)
- **Responsive 3D** — aspect-aware camera rig keeps the model fully visible from mobile portrait to ultrawide; touch scroll passthrough (`touch-action: pan-y`) so vertical swipes scroll the page while horizontal swipes orbit
- **Accessibility** — `prefers-reduced-motion` respected (CSS animations + 3D autoplay freeze), `:focus-visible` outlines, AA contrast, aria-live form feedback, keyboard navigation
- **HUD design language** — corner brackets, scanline accent, staggered scroll reveals, monospace telemetry ticker

## Tech Stack

- Vite + React 18 + TypeScript
- Tailwind CSS 3 (custom palette: void/carbon/panel + volt lime)
- React Three Fiber + drei (OrbitControls, GLTF + Draco)
- Blender 5.2 (asset authoring via blender-mcp, GLB export)
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
  components/   # Nav, Hero, HeroCanvas (R3F), Platform, Metrics, Access, Footer
  hooks/        # useReveal (IntersectionObserver scroll reveals)
public/
  techcore.glb  # Draco-compressed hero asset
  draco/        # Draco decoder for GLTFLoader
techcore-hero.blend  # Blender source scene
design-system/techcore/  # persisted design system (MASTER.md)
```

**Author:** Raliq Hidayat BM3
