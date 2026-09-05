import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Platform } from "./components/Platform";
import { Metrics } from "./components/Metrics";
import { Access, Footer } from "./components/Access";

export default function App() {
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
