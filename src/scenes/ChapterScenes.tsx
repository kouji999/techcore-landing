import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Render only while on screen — offscreen canvases cost nothing
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
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setActive(entries.some((e) => e.isIntersecting)), {
      rootMargin: "10% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holder} className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={`h-full w-full ${opacityClass}`}>
        <Canvas
          frameloop={active ? "always" : "never"}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <SceneCamera {...camera} />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      </div>
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

// ---------- PLATFORM: worn server rack, right column ----------
export function LatticeScene() {
  return (
    <ChapterCanvas
      camera={{ position: [1.5, 0.8, 2.7], fov: 38, lookAt: [0, 0, 0] }}
      className="inset-y-0 right-0 w-full opacity-60 lg:w-[42%] lg:opacity-100"
    >
      <Lights />
      <Prop url="/models/worn_metal_rack/worn_metal_rack.gltf" position={[0, -0.1, 0]} fit={1.9} rotation={[0, -0.45, 0]} spinAxis="y" spinSpeed={0.08} />
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

// ---------- ACCESS: power junction behind the statement ----------
export function PortalScene() {
  return (
    <ChapterCanvas
      camera={{ position: [0, 0.7, 3.8], fov: 40, lookAt: [0, 0, 0] }}
      className="inset-0 opacity-70"
    >
      <Lights />
      <Prop url="/models/power_box_01/power_box_01.gltf" position={[2.0, -0.55, -0.6]} fit={1.7} rotation={[0, 0.65, 0]} spinAxis="y" spinSpeed={0.06} />
    </ChapterCanvas>
  );
}
