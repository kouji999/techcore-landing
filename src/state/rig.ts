// Mutable rig — bridge antara GSAP (scroll) dan R3F render loop.
export const rig = {
  cam: { px: 3.2, py: 1.6, pz: 4.6, lx: 0, ly: 0, lz: 0 },
  progress: 0,
};

// chapter prop visibility flags — GSAP timeline set, useFrame read
export const rigProps: { hero: boolean; platform: boolean; metrics: boolean; access: boolean } = {
  hero: true,
  platform: false,
  metrics: false,
  access: false,
};

export type CamKey = keyof typeof rig.cam;

export const CAMERA_POSES: Record<string, Record<CamKey, number>> = {
  "#top":      { px: 3.2,  py: 1.6,  pz: 4.6, lx: 0, ly: 0,   lz: 0 },
  "#platform": { px: -3.4, py: 2.6,  pz: 3.8, lx: -0.6, ly: -0.2, lz: 0 },
  "#metrics":  { px: 4.2,  py: 0.9,  pz: -2.0, lx: 0.4, ly: -0.5, lz: 0 },
  "#access":   { px: 0,    py: 0.5,  pz: 6.2, lx: 0, ly: -0.2, lz: -1.4 },
};

export const CHAPTER_ORDER = ["#top", "#platform", "#metrics", "#access"] as const;
