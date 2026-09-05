import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Hero-only canvas: fixed backdrop for the FIRST chapter, gentle idle rotation,
// drag-to-orbit. No scroll scrub. Camera is art-directed and stays put.
function clampEmissive(scene: THREE.Group | THREE.Scene) {
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissiveIntensity > 0.6) mat.emissiveIntensity = 0.55;
    }
  });
}

function IdleSpin({ speed = 0.1 }: { speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return (
    <group ref={ref}>
      <HeroModel />
    </group>
  );
}

function HeroModel() {
  const { scene, animations } = useGLTF("/techcore.glb", "/draco/");
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  useEffect(() => clampEmissive(scene), [scene]);
  if (!mixer.current && animations.length > 0) {
    mixer.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => mixer.current!.clipAction(clip).play());
  }
  useFrame((_, delta) => mixer.current?.update(delta));
  return <primitive object={scene} />;
}

// portrait guard: pull camera back so rings never clip
function AspectGuard() {
  const { size, camera } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const z = aspect < 0.75 ? 7.4 : aspect < 1.1 ? 5.9 : 4.8;
    camera.position.set(2.6, 1.5, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size, camera]);
  return null;
}

export default function HeroCanvas() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      camera={{ position: [2.6, 1.5, 4.8], fov: 42 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[4, 6, 3]} intensity={1.3} color="#cfe0ff" />
        <directionalLight position={[-5, -2, -3]} intensity={0.45} color="#B8FF2E" />
        <AspectGuard />
        {reduced ? <HeroModel /> : <IdleSpin />}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          autoRotate={!reduced}
          autoRotateSpeed={0.35}
        />
      </Suspense>
    </Canvas>
  );
}
