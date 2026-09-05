import type { ReactNode } from "react";

export function Hero({ children }: { children: ReactNode }) {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      {/* 3D canvas — right half on desktop, full behind on mobile */}
      <div className="absolute inset-0 md:left-auto md:w-[55%]">
        <div className="h-full w-full cursor-grab active:cursor-grabbing">{children}</div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-24 md:pt-16">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 border border-edge bg-panel/80 px-3 py-1.5 font-mono text-[11px] tracking-widest text-smoke backdrop-blur-sm">
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
              className="border border-edge bg-void/40 px-7 py-3.5 font-mono text-sm tracking-wider text-bone backdrop-blur-sm transition-colors duration-300 ease-snap hover:border-smoke"
            >
              READ SPEC
            </a>
          </div>
          <dl className="mt-12 flex gap-10 font-mono">
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
      </div>
      <p className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] tracking-widest text-smoke">
        ↓ SCROLL
      </p>
    </section>
  );
}
