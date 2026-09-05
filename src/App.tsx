import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Platform } from "./components/Platform";
import { Metrics } from "./components/Metrics";
import { Access, Footer } from "./components/Access";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  useReveal();

  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main>
        <Hero />
        <Platform />
        <Metrics />
        <Access />
      </main>
      <Footer />
    </div>
  );
}
