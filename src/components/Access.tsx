import { useState } from "react";

export function Access() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done">("idle");

  return (
      <section id="access" className="reveal relative overflow-hidden border-t border-edge/60 py-28">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="hud-corner relative border border-edge bg-panel/60 px-8 py-12 sm:px-14 sm:py-16">
          <span className="scanline" aria-hidden="true" />
        <p className="font-mono text-xs tracking-widest text-volt">/ REQUEST ACCESS</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          The grid has capacity<span className="text-volt">.</span>
      </h2>
        <p className="mx-auto mt-4 max-w-md text-smoke">
          Rollout is sequenced by workload. Tell us what you are running and we will route you to the nearest live partition.
        </p>
        <form
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setState("done");
          }}
        >
          <label htmlFor="access-email" className="sr-only">Work email</label>
          <input
            id="access-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engineer@yourcompany.dev"
            className="flex-1 border border-edge bg-panel px-4 py-3 font-mono text-sm text-bone placeholder:text-smoke/60 focus:border-volt focus:outline-none"
          />
          <button
            type="submit"
            className="bg-volt px-7 py-3 font-mono text-sm font-semibold tracking-wider text-void transition-transform duration-300 ease-snap hover:translate-y-[-2px]"
          >
            {state === "done" ? "✓ QUEUED" : "JOIN GRID →"}
          </button>
        </form>
        <p aria-live="polite" className="mt-4 h-4 font-mono text-[11px] tracking-wider text-volt">
          {state === "done" ? "PARTITION REQUEST LOGGED — WATCH YOUR INBOX" : ""}
        </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-edge/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center border border-volt/40 bg-volt/10">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#B8FF2E" strokeWidth="1.6" />
              <circle cx="8" cy="8" r="2.2" fill="#B8FF2E" />
            </svg>
          </span>
          <span className="font-mono text-xs tracking-widest text-bone">TECH<span className="text-volt">CORE</span></span>
        </div>
        <ul className="flex gap-8 font-mono text-[11px] tracking-wider text-smoke">
          <li><a href="#platform" className="transition-colors duration-300 ease-snap hover:text-volt">PLATFORM</a></li>
          <li><a href="#metrics" className="transition-colors duration-300 ease-snap hover:text-volt">METRICS</a></li>
          <li><a href="#access" className="transition-colors duration-300 ease-snap hover:text-volt">ACCESS</a></li>
        </ul>
        <p className="font-mono text-[11px] text-smoke">© 2026 TECHCORE SYSTEMS — ALL CYCLES RESERVED</p>
      </div>
    </footer>
  );
}
