const STATS = [
  { value:"2.4", unit:"exaflops", label:"Sustained grid throughput" },
  { value:"11", unit:"ms", label:"Median first-token latency" },
  { value:"38k", unit:"accelerators", label:"H-class GPUs under management" },
  { value:"0", unit:"breaches", label:"Since day zero, attested" },
];

const TICKER_ITEMS = ["SGP-01 Â· A100Ã—8 Â· load 71%","FRA-03 Â· H200Ã—4 Â· load 44%","IAD-02 Â· MI300XÃ—8 Â· load 92%","TYO-05 Â· A100Ã—8 Â· load 63%","SYD-01 Â· H200Ã—4 Â· load 31%","SFO-04 Â· L40SÃ—8 Â· load 55%",
];

export function Metrics() {
  return (
    <section id="metrics" data-chapter className="relative border-t border-edge/60">
      <div className="overflow-hidden border-b border-edge/60 bg-panel/40 py-3" aria-hidden="true">
        <div className="flex w-max animate-ticker gap-0">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap px-6 font-mono text-[11px] tracking-wider text-smoke">
              <span className="h-1 w-1 rounded-full bg-volt" />
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="border-b border-edge/60 px-2 py-14 text-center lg:border-b-0 lg:px-8 lg:text-left">
            <p className="font-mono text-5xl font-semibold tracking-tight text-bone lg:text-6xl">
              {s.value}
              <span className="ml-1 text-lg text-volt">{s.unit}</span>
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-widest text-smoke">{s.label.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
