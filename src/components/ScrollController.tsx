import { gsap, useGSAP } from"../hooks/useScrollSlides";
import { rig, CAMERA_POSES, CHAPTER_ORDER } from"../state/rig";

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

      const scrollLen = deck.scrollHeight - window.innerHeight;
      if (scrollLen <= 0) return;

      // resolve chapter positions from DOM
      const marks = CHAPTER_ORDER.map((sel) => {
        const el = document.querySelector<HTMLElement>(sel);
        return { at: Math.min(el ? el.offsetTop / scrollLen : 0, 0.97), sel };
      });
      const snaps = marks.map((m) => m.at);

      const tl = gsap.timeline({
        defaults: { ease:"power2.inOut" },
        scrollTrigger: {
          trigger:"#deck",
          start:"top top",
          end:"bottom bottom",
          scrub: 1,
          snap: {
            snapTo: snaps,
            duration: { min: 0.2, max: 0.6 },
            delay: 0.05,
            ease:"power1.inOut",
          },
          onUpdate: (self: { progress: number }) => {
            rig.progress = self.progress;
            const bar = document.getElementById("deck-progress");
            if (bar) bar.style.transform = `scaleY(${self.progress})`;
          },
        },
      });

      marks.forEach((m, i) => {
        const next = marks[i + 1];
        if (!next) return;
        const dur = Math.max(next.at - m.at, 0.001);
        const pose = CAMERA_POSES[m.sel];
        const nextPose = CAMERA_POSES[next.sel];
        (Object.keys(nextPose) as (keyof typeof nextPose)[]).forEach((k) => {
          tl.to(rig.cam, { [k]: nextPose[k], duration: dur }, m.at);
        });
        void pose;
      });
    },
    { dependencies: [] },
  );

  return null;
}

// Scroll-triggered chapter reveals (composited properties only)
export function useSectionReveals() {
  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((el: HTMLElement) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease:"power2.out",
          scrollTrigger: { trigger: el, start:"top 82%", toggleActions:"play none none none" },
        },
      );
    });
  }, []);
}
