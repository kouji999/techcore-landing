import { gsap, ScrollTrigger, useGSAP } from "../hooks/useScrollSlides";
import { rig, rigProps, CAMERA_POSES, CHAPTER_ORDER } from "../state/rig";

// Renders nothing. Owns the master scroll timeline that drives the camera rig.
// Keyframe positions are measured from real section offsets at build time,
// so the camera arrives at each pose exactly when that chapter's content is on screen.
export function ScrollController() {
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const deck = document.getElementById("deck");
      if (!deck) return;

      const measure = () => {
        const scrollLen = deck.scrollHeight - window.innerHeight;
        if (scrollLen <= 0) return null;
        const marks = CHAPTER_ORDER.map((sel) => {
          const el = document.querySelector<HTMLElement>(sel);
          return { at: Math.min(el ? el.offsetTop / scrollLen : 0, 0.97), sel };
        });
        return marks;
      };

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: "#deck",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          snap: {
            snapTo: ((value: number): number => {
              const marks = measure();
              const points = marks ? marks.map((m) => m.at) : [0, 0.5, 1];
              return points.reduce((prev, cur) =>
                Math.abs(cur - value) < Math.abs(prev - value) ? cur : prev,
              );
            }) as unknown as number[],
            duration: { min: 0.2, max: 0.6 },
            delay: 0.05,
            ease: "power1.inOut",
          },
          invalidateOnRefresh: true,
          onRefresh: (self: { progress: number }) => {
            rig.progress = self.progress;
          },
          onUpdate: (self: { progress: number }) => {
            rig.progress = self.progress;
            const bar = document.getElementById("deck-progress");
            if (bar) bar.style.transform = `scaleY(${self.progress})`;
          },
        },
      });

      const buildKeyframes = () => {
        const marks = measure();
        if (!marks) return;
        tl.clear();

        marks.forEach((m, i) => {
          const next = marks[i + 1];
          if (!next) return;
          const dur = Math.max(next.at - m.at, 0.001);
          const nextPose = CAMERA_POSES[next.sel];
          (Object.keys(nextPose) as (keyof typeof nextPose)[]).forEach((k) => {
            tl.to(rig.cam, { [k]: nextPose[k], duration: dur }, m.at);
          });
        });

        const propBySel: Record<string, keyof typeof rigProps> = {
          "#top": "hero",
          "#platform": "platform",
          "#metrics": "metrics",
          "#access": "access",
        };
        marks.forEach((m, i) => {
          if (i === 0) return;
          const key = propBySel[m.sel];
          tl.call(
            () => {
              (Object.keys(rigProps) as (keyof typeof rigProps)[]).forEach((k) => {
                rigProps[k] = k === key;
              });
            },
            [],
            m.at - 0.001,
          );
        });
      };

      buildKeyframes();

      // snap targets from current layout; rebuilt on refresh (layout shifts, font settle)
      ScrollTrigger.addEventListener("refreshInit", buildKeyframes);
    },
    { dependencies: [] },
  );

  return null;
}

// Scroll-triggered chapter reveals — editorial: side slides alternating + clip headings
export function useSectionReveals() {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray<HTMLElement>(".side-reveal-left, .side-reveal-right").forEach((el: HTMLElement) => {
        const fromLeft = el.classList.contains("side-reveal-left");
        gsap.to(el, {
          x: 0,
          xPercent: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        });
        void fromLeft;
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
