import HeroCanvas from "./HeroCanvas";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-6 pt-28 pb-16 md:pt-16 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className="mb-5 inline-flex items-center gap-2 border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-widest text-smoke">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-volt" />
            GRID STATUS: OPERATIONAL — 14 REGIONS
          </p>
          <h1 className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            COMPUTE
            <br />
            <span className="text-outline">BEYOND</span>
            <br />
            LIMITS<span className="text-volt">.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-smoke">
            GPU clusters, edge inference, and orchestration fused into one dark grid.
            Deploy models in seconds, scale to continents, pay only for cycles.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#access"
              className="bg-volt px-7 py-3.5 font-mono text-sm font-semibold tracking-wider text-void transition-transform duration-300 ease-snap hover:translate-y-[-2px]"
            >
              DEPLOY NOW →
            </a>
            <a
              href="#platform"
              className="border border-edge px-7 py-3.5 font-mono text-sm tracking-wider text-bone transition-colors duration-300 ease-snap hover:border-smoke"
            >
              READ SPEC
            </a>
          </div>
          <dl className="reveal reveal-stagger mt-12 flex gap-10 font-mono">
            <div>
              <dt className="text-[11px] tracking-widest text-smoke">P99 LATENCY</dt>
              <dd className="mt-1 text-2xl font-semibold text-bone">11<span className="text-volt">ms</span></dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-widest text-smoke">UPTIME</dt>
              <dd className="mt-1 text-2xl font-semibold text-bone">99.99<span className="text-volt">%</span></dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-widest text-smoke">REGIONS</dt>
              <dd className="mt-1 text-2xl font-semibold text-bone">14<span className="text-volt">+</span></dd>
            </div>
          </dl>
        </div>
        <div className="relative order-1 h-[380px] sm:h-[440px] lg:order-2 lg:h-[560px]">
          <HeroCanvas />
          <p
            id="drag-hint"
            className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-smoke transition-opacity duration-700"
          >
            ← DRAG TO ORBIT →
          </p>
        </div>
      </div>
    </section>
  );
}
