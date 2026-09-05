import { useEffect, useRef } from "react";

const TICKER_ITEMS = [
  "SGP-01 · A100×8 · load 71%",
  "FRA-03 · H200×4 · load 44%",
  "IAD-02 · MI300X×8 · load 92%",
  "TYO-05 · A100×8 · load 63%",
  "SYD-01 · H200×4 · load 31%",
  "SFO-04 · L40S×8 · load 55%",
];

const STATS = [
  { value: 2.4, decimals: 1, unit: "exaflops", label: "SUSTAINED GRID THROUGHPUT" },
  { value: 11, decimals: 0, unit: "ms", label: "MEDIAN FIRST-TOKEN LATENCY" },
  { value: 38, decimals: 0, unit: "k", label: "H-CLASS ACCELERATORS" },
  { value: 0, decimals: 0, unit: "breaches", label: "SINCE DAY ZERO, ATTESTED" },
];

function useCountUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        targets.forEach((t, i) => {
          const target = parseFloat(t.dataset.count!);
          const dec = parseInt(t.dataset.decimals || "0", 10);
          const obj = { v: 0 };
          const started = performance.now() + i * 90;
          const tick = (now: number) => {
            if (now < started) {
              requestAnimationFrame(tick);
              return;
            }
            const p = Math.min((now - started) / 1400, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            obj.v = target * eased;
            t.textContent = obj.v.toFixed(dec);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Metrics() {
  const ref = useCountUp();

  return (
    <section id="metrics" data-chapter className="relative border-t border-edge/40 py-32">
      <div className="overflow-hidden border-y border-edge/40 bg-panel/30 py-3" aria-hidden="true">
        <div className="flex w-max animate-ticker gap-0">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap px-6 font-mono text-[11px] tracking-wider text-smoke">
              <span className="h-1 w-1 rounded-full bg-volt" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <p className="side-reveal-right mt-20 font-mono text-xs tracking-[0.3em] text-volt">/ THE NUMBERS</p>

        <div className="mt-10 space-y-16">
          {STATS.map((s) => (
            <div key={s.label} className="side-reveal-left flex flex-wrap items-baseline gap-x-6 border-b border-edge/30 pb-8">
              <span className="font-mono text-7xl font-semibold tracking-tight text-bone lg:text-8xl">
                <span data-count={s.value} data-decimals={s.decimals}>{s.value.toFixed(s.decimals)}</span>
                <span className="ml-2 align-baseline font-mono text-2xl text-volt lg:text-3xl">{s.unit}</span>
              </span>
              <span className="font-mono text-[11px] tracking-[0.25em] text-smoke">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
