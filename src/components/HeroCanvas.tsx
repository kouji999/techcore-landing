import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Pull camera back on narrow/portrait viewports so the orbit rings never clip
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const dist = aspect < 0.75 ? 7.2 : aspect < 1.1 ? 5.8 : 4.6;
    const k = dist / 4.6;
    camera.position.set(3.2 * k, 1.6 * k, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// OrbitControls sets touch-action:none — restore vertical page scroll on touch,
// horizontal swipes still orbit (pan-y lets the browser own the vertical axis)
function TouchFix() {
  const { gl } = useThree();
  useEffect(() => {
    gl.domElement.style.touchAction = "pan-y";
  }, [gl]);
  return null;
}

function TechCoreModel() {
  const { scene, animations } = useGLTF("/techcore.glb", "/draco/");
  const root = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ACES desaturates strong emissives toward cream — pull intensity back so lime reads lime
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissiveIntensity > 0.6) mat.emissiveIntensity = 0.55;
    }
  });

  // reduced motion: freeze at initial pose, no autoplay, no float
  if (!reducedMotion && !mixer.current && animations.length > 0) {
    mixer.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => mixer.current!.clipAction(clip).play());
  }

  useFrame((_, delta) => {
    if (reducedMotion) return;
    mixer.current?.update(delta);
    if (root.current) {
      // gentle float
      root.current.position.y = Math.sin(Date.now() / 1600) * 0.12;
    }
  });

  return (
    <group ref={root}>
      <primitive object={scene} />
    </group>
  );
}

export default function HeroCanvas() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="font-mono text-xs text-smoke">[ 3D module unavailable ]</div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full cursor-grab active:cursor-grabbing"
      onPointerDown={() => {
        // drag hint disappears on first interaction
        const hint = document.getElementById("drag-hint");
        if (hint) hint.style.opacity = "0";
      }}
    >
      <Canvas
        camera={{ position: [3.2, 1.6, 4.6], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={() => setFailed(true)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[4, 6, 3]} intensity={1.4} color="#cfe0ff" />
          <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#B8FF2E" />
          <TechCoreModel />
          <CameraRig />
          <TouchFix />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.7}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
