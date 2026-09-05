import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import HeroCanvas from "./components/HeroCanvas";
import { Hero } from "./components/Hero";
import { Platform } from "./components/Platform";
import { Metrics } from "./components/Metrics";
import { Access, Footer } from "./components/Access";
import { ScrollController, useSectionReveals } from "./components/ScrollController";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

export default function App() {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useSmoothScroll();
  useSectionReveals();

  return (
    <div className="min-h-screen bg-void">
      <div className="bg-drift" aria-hidden="true" />

      {/* fixed 3D backdrop — camera + props driven by scroll */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HeroCanvas />
      </div>

      <Nav />

      {/* scroll deck — slides over the fixed 3D canvas */}
      <main id="deck" className="relative z-10">
        <Hero />
        <Platform />
        <div className="deck-pad h-[30vh]" aria-hidden="true" />
        <Metrics />
        <div className="deck-pad h-[30vh]" aria-hidden="true" />
        <Access />
      </main>

      <Footer />

      {/* progress rail */}
      {!reducedMotion && (
        <div className="fixed right-4 top-24 z-40 h-40 w-px bg-edge md:block" aria-hidden="true">
          <div id="deck-progress" className="h-full w-full origin-top scale-y-0 bg-volt" />
        </div>
      )}

      <ScrollController />
    </div>
  );
}
