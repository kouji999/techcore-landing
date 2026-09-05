import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Render only while on screen — offscreen canvases cost nothing.
// Canvas mounts on FIRST intersection (models + GL context deferred until needed),
// then only the frameloop toggles. Chapter canvases skip AA + high DPR + discrete
// GPU preference: they are dimmed backgrounds, invisible quality loss, big win.
export function ChapterCanvas({
  children,
  camera,
  className = "",
  opacityClass = "",
}: {
  children: React.ReactNode;
  camera: { position: [number, number, number]; fov: number; lookAt: [number, number, number] };
  className?: string;
  opacityClass?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const any = entries.some((e) => e.isIntersecting);
        setActive(any);
        if (any) setMounted(true); // mount once, never unmount (remount = context re-create jank)
      },
      { rootMargin: "15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holder} className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {mounted && (
        <div className={`h-full w-full ${opacityClass}`}>
          <Canvas
            frameloop={active ? "always" : "never"}
            dpr={[1, 1.25]}
            gl={{ antialias: false, alpha: true }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <SceneCamera {...camera} />
            <Suspense fallback={null}>{children}</Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}

function SceneCamera({
  position,
  fov,
  lookAt,
}: {
  position: [number, number, number];
  fov: number;
  lookAt: [number, number, number];
}) {
  return (
    <PerspectiveCamera
      makeDefault
      fov={fov}
      position={position}
      onUpdate={(cam: THREE.PerspectiveCamera) => {
        cam.lookAt(...lookAt);
        cam.updateProjectionMatrix();
      }}
    />
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#dfeaff" />
      <directionalLight position={[-4, 1, 2]} intensity={0.7} color="#9db4d8" />
      <directionalLight position={[0, -3, -2]} intensity={0.4} color="#B8FF2E" />
    </>
  );
}

// Normalizes any model to a target size (real-world scale varies wildly)
function AutoFit({ scene, target = 2.5 }: { scene: THREE.Group; target?: number }) {
  const inner = useRef<THREE.Group>(null);
  useEffect(() => {
    const g = inner.current;
    if (!g) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = target / maxDim;
    g.scale.setScalar(s);
    const center = box.getCenter(new THREE.Vector3()).multiplyScalar(s);
    g.position.set(-center.x, -center.y, -center.z);
  }, [scene, target]);
  return <group ref={inner}><primitive object={scene} /></group>;
}

function Prop({
  url,
  position,
  fit = 2.5,
  rotation = [0, 0, 0],
  spinAxis = "y",
  spinSpeed = 0.1,
}: {
  url: string;
  position: [number, number, number];
  fit?: number;
  rotation?: [number, number, number];
  spinAxis?: "x" | "y" | "z";
  spinSpeed?: number;
}) {
  const { scene, animations } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  if (!mixer.current && animations.length > 0) {
    mixer.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => mixer.current!.clipAction(clip).play());
  }
  useFrame((_, dt) => {
    mixer.current?.update(dt);
    if (group.current) group.current.rotation[spinAxis] += dt * spinSpeed;
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <AutoFit scene={scene} target={fit} />
    </group>
  );
}

// ---------- PLATFORM: nodesphere network (web3), right column ----------
export function LatticeScene() {
  return (
    <ChapterCanvas
      camera={{ position: [0, 1.2, 4.8], fov: 40, lookAt: [0, 0, 0] }}
      className="inset-y-0 right-0 w-full opacity-60 lg:w-[46%] lg:opacity-100"
    >
      <Lights />
      <Prop url="/props/nodesphere.glb" position={[0, -0.1, 0]} fit={2.6} spinAxis="y" spinSpeed={0.05} />
    </ChapterCanvas>
  );
}

// ---------- METRICS: wave grid as data horizon under the numbers ----------
export function WaveGridScene() {
  return (
    <ChapterCanvas
      camera={{ position: [0, 3.4, 5.6], fov: 42, lookAt: [0, -0.4, 0] }}
      className="inset-0 opacity-55"
    >
      <Lights />
      <Prop url="/props/wavegrid.glb" position={[0.6, -0.9, -0.5]} fit={4.6} rotation={[0, -0.35, 0]} spinAxis="z" spinSpeed={0.05} />
    </ChapterCanvas>
  );
}

// ---------- ACCESS: ringgate behind the statement ----------
export function PortalScene() {
  return (
    <ChapterCanvas
      camera={{ position: [0, 0.5, 6.0], fov: 42, lookAt: [0, 0.1, 0] }}
      className="inset-0 opacity-70"
    >
      <Lights />
      <Prop url="/props/ringgate.glb" position={[1.7, -0.35, -0.3]} fit={2.3} rotation={[1.15, 0.35, 0]} spinAxis="y" spinSpeed={0.06} />
    </ChapterCanvas>
  );
}
