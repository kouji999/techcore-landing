// Mutable rig — the bridge between GSAP (scroll) and the R3F render loop.
// GSAP tweens these plain numbers; CameraRig reads them in useFrame.
// Zero React re-renders during scroll.
export const rig = {
  cam: { px: 3.2, py: 1.6, pz: 4.6, lx: 0, ly: 0, lz: 0 },
  progress: 0,
};

export type CamKey = keyof typeof rig.cam;

// Camera poses per chapter. `at` is resolved at runtime from the section's
// real scroll offset, so camera arrival always matches content arrival.
export const CAMERA_POSES: Record<string, Record<CamKey, number>> = {
  "#top":      { px: 3.2,  py: 1.6,  pz: 4.6, lx: 0, ly: 0,   lz: 0 },  // hero: classic 3/4
  "#platform": { px: -2.4, py: 3.4,  pz: 3.6, lx: 0, ly: 0.4, lz: 0 },  // platform: high dramatic
  "#metrics":  { px: 4.6,  py: 0.5,  pz: -2.2, lx: 0, ly: 0.2, lz: 0 }, // metrics: low front-left
  "#access":   { px: 0,    py: 0.9,  pz: 6.4, lx: 0, ly: 0.1, lz: 0 },  // access: centered pullback
};

export const CHAPTER_ORDER = ["#top", "#platform", "#metrics", "#access"] as const;
