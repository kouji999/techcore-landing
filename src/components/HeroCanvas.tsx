import { Suspense, useRef } from"react";
import { Canvas, useFrame, useThree } from"@react-three/fiber";
import { useGLTF, OrbitControls, PerspectiveCamera } from"@react-three/drei";
import * as THREE from"three";
import { rig } from"../state/rig";

const POS_LAMBDA = 3;
const LOOK_LAMBDA = 3;

// Scroll-driven camera: damps toward rig targets every frame.
// Double smoothing (scrub 1 + damp) = fluid camera even on scroll flings.
function CameraRig({ orbitMode }: { orbitMode: boolean }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const { size } = useThree();

  useFrame((_, dt) => {
    const c = camRef.current;
    if (!c) return;
    const r = rig.cam;

    if (orbitMode) {
      c.lookAt(0, 0, 0);
      return;
    }

    // portrait/narrow viewports: scale out so rings never clip
    const aspect = size.width / size.height;
    const zScale = aspect < 0.75 ? 1.56 : aspect < 1.1 ? 1.26 : 1;

    const d = THREE.MathUtils.damp;
    c.position.x = d(c.position.x, r.px, POS_LAMBDA, dt);
    c.position.y = d(c.position.y, r.py, POS_LAMBDA, dt);
    c.position.z = d(c.position.z, r.pz * zScale, POS_LAMBDA, dt);
    target.current.x = d(target.current.x, r.lx, LOOK_LAMBDA, dt);
    target.current.y = d(target.current.y, r.ly, LOOK_LAMBDA, dt);
    target.current.z = d(target.current.z, r.lz, LOOK_LAMBDA, dt);
    c.lookAt(target.current);
  });

  return <PerspectiveCamera ref={camRef} makeDefault fov={42} position={[3.2, 1.6, 4.6]} />;
}

function TechCoreModel() {
  const { scene, animations } = useGLTF("/techcore.glb","/draco/");
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissiveIntensity > 0.6) mat.emissiveIntensity = 0.55;
    }
  });

  if (!mixer.current && animations.length > 0) {
    mixer.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => mixer.current!.clipAction(clip).play());
  }

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive object={scene} />;
}

export default function HeroCanvas({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference:"high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 3]} intensity={1.4} color="#cfe0ff" />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#B8FF2E" />
        <TechCoreModel />
        <CameraRig orbitMode={reducedMotion} />
        {reducedMotion && (
          <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.08} rotateSpeed={0.7} />
        )}
      </Suspense>
    </Canvas>
  );
}
