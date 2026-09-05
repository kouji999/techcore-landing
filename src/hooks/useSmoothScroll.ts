import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./useScrollSlides";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // native anchor jumps fight Lenis's internal scroll — route through it
    const onClick = (e: Event) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: -40, duration: 1.2 });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function getLenis() {
  return lenis;
}
