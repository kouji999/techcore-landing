const FEATURES = [
  {
    id: "01",
    title: "Bare-metal GPU Mesh",
    body: "Direct access to H-class accelerators without virtualization tax. Metal-to-metal NVLink, 800G fabric, zero noisy neighbors.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="12" stroke="#B8FF2E" strokeWidth="1.4" />
        <path d="M6 8v4M6 10h3M6 8h3M12 8v4M12 8h3M12 12h3" stroke="#B8FF2E" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Edge Inference Grid",
    body: "Models replicated to 14 regions with anycast routing. First token in under 12ms from 94% of the inhabited planet.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="2.5" fill="#B8FF2E" />
        <path d="M10 1v4M10 15v4M1 10h4M15 10h4" stroke="#B8FF2E" strokeWidth="1.4" />
        <path d="M3.5 3.5l2.8 2.8M13.7 13.7l2.8 2.8M16.5 3.5l-2.8 2.8M6.3 13.7l-2.8 2.8" stroke="#B8FF2E" strokeWidth="1.1" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Zero-Config Orchestration",
    body: "Declare desired state in 12 lines of TOML. Rollbacks, canaries, and autoscale handled by the grid controller, not your pager.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2l7 4v8l-7 4-7-4V6l7-4z" stroke="#B8FF2E" strokeWidth="1.4" />
        <path d="M10 2v4M10 8v4M10 14v4" stroke="#B8FF2E" strokeWidth="1.1" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Confidential Compute",
    body: "Memory encryption and attested boot on every node. Your weights never exist in plaintext outside your enclave.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="4" y="9" width="12" height="8" stroke="#B8FF2E" strokeWidth="1.4" />
        <path d="M7 9V6.5a3 3 0 016 0V9" stroke="#B8FF2E" strokeWidth="1.4" />
        <circle cx="10" cy="13" r="1.2" fill="#B8FF2E" />
      </svg>
    ),
  },
];

export function Platform() {
  return (
    <section id="platform" className="relative border-t border-edge/60 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-widest text-volt">/ THE PLATFORM</p>
            <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              One grid. <span className="text-smoke">Every layer of the stack.</span>
            </h2>
          </div>
          <p className="max-w-sm font-mono text-xs leading-relaxed text-smoke">
            FOUR SUBSYSTEMS, ONE CONTROL PLANE. EVERYTHING BELOW THE API IS OUR PROBLEM, NOT YOURS.
          </p>
        </div>
        <div className="grid gap-px bg-edge/60 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article
              key={f.id}
              className="group relative bg-carbon p-8 transition-colors duration-300 ease-snap hover:bg-panel"
            >
              <span className="absolute right-6 top-6 font-mono text-xs text-smoke/50">{f.id}</span>
              <div className="mb-8">{f.icon}</div>
              <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-smoke">{f.body}</p>
              <span className="mt-6 block h-px w-8 bg-volt/40 transition-all duration-500 ease-snap group-hover:w-full group-hover:bg-volt" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
