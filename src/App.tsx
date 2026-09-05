import { Nav } from "./components/Nav";
import HeroCanvas from "./components/HeroCanvas";
import { Hero } from "./components/Hero";
import { Platform } from "./components/Platform";
import { Metrics } from "./components/Metrics";
import { Access, Footer } from "./components/Access";
import { useSectionReveals } from "./components/ScrollController";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { LatticeScene, WaveGridScene, PortalScene } from "./scenes/ChapterScenes";

export default function App() {
  useSmoothScroll();
  useSectionReveals();

  return (
    <div className="min-h-screen bg-void">
      <div className="bg-drift" aria-hidden="true" />

      <Nav />

      <main>
        {/* HERO — the only 3D backdrop chapter */}
        <Hero>
          <HeroCanvas />
        </Hero>

        {/* PLATFORM — lattice lives inside its own chapter */}
        <div className="relative">
          <LatticeScene />
          <Platform />
        </div>

        {/* METRICS — wave grid horizon */}
        <div className="relative">
          <WaveGridScene />
          <Metrics />
        </div>

        {/* ACCESS — portal gate */}
        <div className="relative">
          <PortalScene />
          <Access />
        </div>
      </main>

      <Footer />
    </div>
  );
}
