import { lazy, Suspense } from "react";
import { Nav } from "./components/Nav";
import HeroCanvas from "./components/HeroCanvas";
import { Hero } from "./components/Hero";
import { Platform } from "./components/Platform";
import { Metrics } from "./components/Metrics";
import { Access, Footer } from "./components/Access";
import { BgMotes } from "./components/BgMotes";
import { useSectionReveals } from "./components/ScrollController";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

// 3D chapter scenes are code-split: hero loads first, chapters stream in after
const LatticeScene = lazy(() =>
  import("./scenes/ChapterScenes").then((m) => ({ default: m.LatticeScene })),
);
const WaveGridScene = lazy(() =>
  import("./scenes/ChapterScenes").then((m) => ({ default: m.WaveGridScene })),
);
const PortalScene = lazy(() =>
  import("./scenes/ChapterScenes").then((m) => ({ default: m.PortalScene })),
);

export default function App() {
  useSmoothScroll();
  useSectionReveals();

  return (
    <div className="min-h-screen bg-void">
      <div className="bg-drift" aria-hidden="true" />
      <BgMotes />
      <div className="bg-scan" aria-hidden="true" />

      <Nav />

      <main>
        {/* HERO — the only 3D backdrop chapter */}
        <Hero>
          <HeroCanvas />
        </Hero>

        {/* PLATFORM — nodesphere network */}
        <div className="relative">
          <Suspense fallback={null}>
            <LatticeScene />
          </Suspense>
          <Platform />
        </div>

        {/* METRICS — wave grid horizon */}
        <div className="relative">
          <Suspense fallback={null}>
            <WaveGridScene />
          </Suspense>
          <Metrics />
        </div>

        {/* ACCESS — ringgate portal */}
        <div className="relative">
          <Suspense fallback={null}>
            <PortalScene />
          </Suspense>
          <Access />
        </div>
      </main>

      <Footer />
    </div>
  );
}
