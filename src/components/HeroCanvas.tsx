import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Hero: circuit board (Poly Haven CC0) — compute IS the board.
// Camera art-directed static + gentle spin. No scroll scrub.

function HeroModel() {
  const { scene } = useGLTF("/models/circuit_board/circuit_board.gltf");
  const board = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useEffect(() => {
    // normalize real-world scale to ~3 units wide
    const g = inner.current;
    if (!g) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 3 / maxDim;
    g.scale.setScalar(s);
    const center = box.getCenter(new THREE.Vector3()).multiplyScalar(s);
    g.position.set(-center.x, -center.y, -center.z);
  }, [scene]);

  useFrame((_, dt) => {
    if (board.current && !reducedRef.current) {
      board.current.rotation.y += dt * 0.16;
    }
  });

  return (
    <group ref={board} rotation={[-0.4, 0, 0]} position={[0, -0.25, 0]}>
      <group ref={inner}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

const reducedRef = { current: typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches };

// portrait guard: pull camera back on narrow screens
function AspectGuard() {
  const { size, camera } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const z = aspect < 0.75 ? 7.0 : aspect < 1.1 ? 5.6 : 4.6;
    camera.position.set(2.2, 1.4, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size, camera]);
  return null;
}

export default function HeroCanvas() {
  const [reduced, setReduced] = useState(() => reducedRef.current);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      camera={{ position: [2.2, 1.4, 4.6], fov: 42 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} color="#eaf2ff" />
        <directionalLight position={[-4, 2, 3]} intensity={0.8} color="#9db4d8" />
        <directionalLight position={[0, -2, -2]} intensity={0.5} color="#B8FF2E" />
        <AspectGuard />
        <HeroModel />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          autoRotate={!reduced}
          autoRotateSpeed={0.3}
        />
      </Suspense>
    </Canvas>
  );
}
