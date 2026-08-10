import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';

// ─── ModelPreview ─────────────────────────────────────────────────────────────
// React Three Fiber canvas that loads a GLB model, auto-rotates it,
// and lets the user drag to orbit + scroll to zoom.
// Accepts: modelUrl (string), productName (string), height (string|number)

const ModelPreview = ({ modelUrl, productName, height = 460 }) => {
  return (
    <div
      className="model-canvas-wrapper"
      style={{ height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}
    >
      {/* Outer Canvas */}
      <Canvas
        camera={{ position: [0, 0.5, 2.8], fov: 42 }}
        style={{ background: 'transparent' }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={1.4} castShadow />
        <directionalLight position={[-4, 2, -4]} intensity={0.5} />
        <pointLight position={[0, -2, 0]} intensity={0.3} color="#b8965a" />

        {/* HDRI environment for realistic reflections */}
        <Environment preset="apartment" />

        {/* Ground shadow receiver */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.12} />
        </mesh>

        <Suspense fallback={<LoadingMesh />}>
          <GLBModel url={modelUrl} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={1.4}
          minDistance={1}
          maxDistance={8}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.85}
        />
      </Canvas>

      {/* Watermark hint */}
      <div style={{
        position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        fontSize: '0.68rem', color: 'rgba(92,82,72,0.6)', pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
};

// ─── GLBModel ─────────────────────────────────────────────────────────────────
// Loads the GLB, centers + scales it to fit the viewport.
const GLBModel = ({ url }) => {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  // Auto-fit: compute bounding box and scale to unit size
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) return;
    const scale = 1.6 / maxDim;
    groupRef.current.scale.setScalar(scale);

    // Re-center after scale
    const newBox = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    newBox.getCenter(center);
    groupRef.current.position.sub(center);

    // Sit on ground plane
    const newSize = new THREE.Vector3();
    newBox.getSize(newSize);
    groupRef.current.position.y = newSize.y / 2 - 0.01;
  }, [url]);

  // Cast shadows on all meshes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};

// ─── Suspense fallback: simple animated ring ──────────────────────────────────
const LoadingMesh = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 1.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.4, 0.06, 12, 48]} />
      <meshStandardMaterial color="#B8965A" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

export default ModelPreview;
