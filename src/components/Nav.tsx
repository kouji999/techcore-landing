export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-edge/60 bg-void/70 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center border border-volt/40 bg-volt/10">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#B8FF2E" strokeWidth="1.4" />
                <circle cx="8" cy="8" r="2.2" fill="#B8FF2E" />
              </svg>
            </span>
            <span className="font-mono text-sm font-semibold tracking-widest text-bone">
              TECH<span className="text-volt">CORE</span>
            </span>
          </a>
          <ul className="hidden items-center gap-8 font-mono text-xs tracking-wider text-smoke md:flex">
            <li><a className="transition-colors duration-300 ease-snap hover:text-volt" href="#platform">PLATFORM</a></li>
            <li><a className="transition-colors duration-300 ease-snap hover:text-volt" href="#metrics">METRICS</a></li>
            <li><a className="transition-colors duration-300 ease-snap hover:text-volt" href="#access">ACCESS</a></li>
          </ul>
          <a
            href="#access"
            className="border border-volt/50 bg-volt/10 px-4 py-2 font-mono text-xs font-semibold tracking-wider text-volt transition-all duration-300 ease-snap hover:bg-volt hover:text-void"
          >
            GET ACCESS
          </a>
        </nav>
      </div>
    </header>
  );
}
