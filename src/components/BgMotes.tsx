import { useMemo } from "react";

// CSS-only particle motes — GPU-cheap (transform/opacity only).
// Deterministic pseudo-random so SSR/hydration-stable.
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function BgMotes({ count = 26 }: { count?: number }) {
  const motes = useMemo(() => {
    const rnd = mulberry(20260905);
    return Array.from({ length: count }, () => ({
      left: (rnd() * 100).toFixed(2) + "%",
      size: (1.5 + rnd() * 2.5).toFixed(2) + "px",
      dur: (16 + rnd() * 18).toFixed(1) + "s",
      delay: (-rnd() * 30).toFixed(1) + "s",
      dx: ((rnd() - 0.5) * 90).toFixed(0) + "px",
      opacity: (0.25 + rnd() * 0.5).toFixed(2),
    }));
  }, [count]);

  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="bg-motes" aria-hidden="true">
      {motes.map((m, i) => (
        <span
          key={i}
          style={
            reduced
              ? undefined
              : {
                  left: m.left,
                  width: m.size,
                  height: m.size,
                  animationDuration: m.dur,
                  animationDelay: m.delay,
                  ["--mote-x" as string]: m.dx,
                  ["--mote-o" as string]: m.opacity,
                }
          }
        />
      ))}
    </div>
  );
}
