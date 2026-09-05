import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { rig, rigProps } from "../state/rig";

const POS_LAMBDA = 3;
const LOOK_LAMBDA = 3;

function CameraRig() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const { size } = useThree();

  useFrame((_, dt) => {
    const c = camRef.current;
    if (!c) return;
    const r = rig.cam;
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

function useLoopingModel(url: string, chapter: keyof typeof rigProps) {
  const { scene, animations } = useGLTF(url, "/draco/");
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const root = useRef<THREE.Group>(null);

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

  useFrame((_, dt) => {
    mixer.current?.update(dt);
    if (root.current) {
      root.current.visible = rigProps[chapter];
    }
  });

  return { scene, root };
}

function Prop({ url, scale, position, chapter }: { url: string; scale: number; position: [number, number, number]; chapter: keyof typeof rigProps }) {
  const { scene, root } = useLoopingModel(url, chapter);
  return (
    <group ref={root} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function TechCoreModel() {
  const { scene, animations } = useGLTF("/techcore.glb", "/draco/");
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

// slow particle field — background "breathing"
function ParticleField() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const seeds = useRef(
    Array.from({ length: 90 }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8 - 2,
      s: 0.015 + Math.random() * 0.02,
      v: 0.1 + Math.random() * 0.25,
    })),
  );

  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    seeds.current.forEach((p, i) => {
      dummy.current.position.set(p.x + Math.sin(t * 0.2 + i) * 0.4, p.y + ((t * p.v + i) % 10) - 5, p.z);
      dummy.current.scale.setScalar(p.s);
      dummy.current.updateMatrix();
      m.setMatrixAt(i, dummy.current.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 90]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#B8FF2E" emissive="#B8FF2E" emissiveIntensity={0.7} transparent opacity={0.5} />
    </instancedMesh>
  );
}

export default function HeroCanvas() {
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="font-mono text-xs text-smoke">[ 3D module unavailable ]</div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      onError={() => setFailed(true)}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 3]} intensity={1.4} color="#cfe0ff" />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#B8FF2E" />
        <TechCoreModel />
        {!reduced && <Prop url="/props/lattice.glb" scale={1} position={[-2.6, -0.4, -2.2]} chapter="platform" />}
        {!reduced && <Prop url="/props/wavegrid.glb" scale={1} position={[0.4, -1.2, -1.4]} chapter="metrics" />}
        {!reduced && <Prop url="/props/portal.glb" scale={0.9} position={[0, -0.2, -1.8]} chapter="access" />}
        {!reduced && <ParticleField />}
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}
