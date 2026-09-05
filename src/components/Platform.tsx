const SPECS = [
  { n: "01", t: "Bare-Metal Mesh", d: "H-class accelerators, NVLink fabric, zero hypervisor tax.", meta: "800G · 38k GPUs" },
  { n: "02", t: "Edge Inference", d: "Models replicated to 14 regions, anycast-routed.", meta: "11ms first token" },
  { n: "03", t: "Orchestration", d: "Desired state in TOML. Canaries and rollbacks on the grid.", meta: "12 lines of config" },
  { n: "04", t: "Confidential Compute", d: "Attested boot, memory encryption, sealed weights.", meta: "zero breaches" },
];

export function Platform() {
  return (
    <section id="platform" data-chapter className="relative border-t border-edge/40 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="side-reveal-left font-mono text-xs tracking-[0.3em] text-volt">/ THE PLATFORM</p>

        <h2 className="clip-head mt-6 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          One grid<span className="text-volt">.</span>
          <br />
          Every layer beneath you<span className="text-smoke">.</span>
        </h2>

        <div className="mt-20 space-y-14">
          {SPECS.map((s, i) => (
            <div
              key={s.n}
              className={`grid items-baseline gap-6 border-t border-edge/40 pt-8 md:grid-cols-[8rem_1fr_auto] ${i % 2 ? "side-reveal-right" : "side-reveal-left"}`}
            >
              <span className="font-mono text-4xl font-semibold text-edge lg:text-5xl">{s.n}</span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight lg:text-3xl">{s.t}</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-smoke">{s.d}</p>
              </div>
              <span className="font-mono text-xs tracking-widest text-volt/90">{s.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
