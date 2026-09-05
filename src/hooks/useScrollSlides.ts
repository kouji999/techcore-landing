import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/**
 * Scroll-driven presentation hook.
 * Section container gets pinned; timeline progresses with scroll scrub.
 */
export function useScrollSlides(
  rootRef: React.RefObject<HTMLElement | null>,
  build: (ctx: { tl: gsap.core.Timeline }) => void,
) {
  const buildRef = useRef(build);
  buildRef.current = build;

  useGSAP(
    () => {
      if (!rootRef.current) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // no pinning/scrub under reduced motion

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${rootRef.current!.offsetHeight * 1.5}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      buildRef.current({ tl });
    },
    { scope: rootRef },
  );
}
