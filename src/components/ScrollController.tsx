import { gsap, useGSAP } from "../hooks/useScrollSlides";

// Editorial chapter reveals — side slides alternating direction + heading lifts.
// No camera scrub, no pinning: chapters own their 3D scenes statically.
export function useSectionReveals() {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray<HTMLElement>(".side-reveal-left, .side-reveal-right").forEach((el: HTMLElement) => {
        gsap.to(el, {
          x: 0,
          xPercent: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-chapter] h2").forEach((h: HTMLElement) => {
        gsap.fromTo(
          h,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power4.out",
            scrollTrigger: { trigger: h, start: "top 85%", toggleActions: "play none none none" },
          },
        );
      });
    },
    [],
  );
}
