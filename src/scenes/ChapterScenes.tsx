import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Shared: clamp emissive so ACES doesn't wash lime to cream
function clampEmissive(scene: THREE.Group | THREE.Scene) {
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissiveIntensity > 0.6) mat.emissiveIntensity = 0.55;
    }
  });
}

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
      <directionalLight position={[4, 6, 3]} intensity={1.3} color="#cfe0ff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.45} color="#B8FF2E" />
    </>
  );
}

function Prop({
  url,
  position,
  scale = 1,
  rotation = [0, 0, 0],
  spinAxis = "y",
  spinSpeed = 0.1,
}: {
  url: string;
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  spinAxis?: "x" | "y" | "z";
  spinSpeed?: number;
}) {
  const { scene, animations } = useGLTF(url, "/draco/");
  const group = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => clampEmissive(scene), [scene]);
  if (!mixer.current && animations.length > 0) {
    mixer.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => mixer.current!.clipAction(clip).play());
  }
  useFrame((_, dt) => {
    mixer.current?.update(dt);
    if (group.current) group.current.rotation[spinAxis] += dt * spinSpeed;
  });

  return (
    <group ref={group} position={position} scale={scale} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}

// ---------- PLATFORM: data lattice, right column, frontal camera ----------
export function LatticeScene() {
  return (
    <ChapterCanvas
      camera={{ position: [0, 1.1, 4.6], fov: 40, lookAt: [0, 0.1, 0] }}
      className="inset-y-0 right-0 w-full opacity-50 lg:w-[46%] lg:opacity-100"
    >
      <Lights />
      <Prop url="/props/lattice.glb" position={[0, -0.55, 0]} scale={1.7} rotation={[0.12, 0.6, 0]} spinAxis="y" spinSpeed={0.12} />
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
      <Prop url="/props/wavegrid.glb" position={[0.6, -0.9, -0.5]} scale={1.35} rotation={[0, -0.35, 0]} spinAxis="z" spinSpeed={0.05} />
    </ChapterCanvas>
  );
}

// ---------- ACCESS: portal gate behind the statement ----------
export function PortalScene() {
  return (
    <ChapterCanvas
      camera={{ position: [0, 0.35, 6.2], fov: 42, lookAt: [0, 0.1, 0] }}
      className="inset-0 opacity-65"
    >
      <Lights />
      <Prop url="/props/portal.glb" position={[0.9, -0.15, 0]} scale={1.15} spinAxis="y" spinSpeed={0.08} />
    </ChapterCanvas>
  );
}
