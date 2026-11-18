import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { AlertCircle, Box } from 'lucide-react';
import * as THREE from 'three';

// ─── Error Boundary ──────────────────────────────────────────────────────────
// Captures React Three Fiber / Suspense GLB loader errors to prevent app crashes.
class GLTFErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[GLTF Load Error] Failed to load model for product "${this.props.productName}":`, error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── ModelPreview ─────────────────────────────────────────────────────────────
// React Three Fiber canvas that loads a GLB model and handles 2D image fallbacks.
const ModelPreview = ({ modelUrl, productName, imageUrl, height = 460 }) => {
  const [loadError, setLoadError] = useState(false);

  // Validate modelUrl: Must be present and must not be a standard 2D image format
  const isImageRegex = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i;
  const hasValidModel = modelUrl && 
                        typeof modelUrl === 'string' && 
                        modelUrl.trim() !== '' && 
                        !isImageRegex.test(modelUrl);

  const fallbackImage = imageUrl || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    console.log(`[3D Preview Audit] Selected Product Name: "${productName}"`);
    console.log(`[3D Preview Audit] Model URL:`, modelUrl);
    console.log(`[3D Preview Audit] Has Valid Model Path:`, !!hasValidModel);
  }, [productName, modelUrl, hasValidModel]);

  // Fallback UI 1: Model is explicitly unavailable or invalid
  if (!hasValidModel) {
    return (
      <div 
        className="model-canvas-wrapper" 
        style={{ 
          height, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        <img 
          src={fallbackImage} 
          alt={productName} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <Box size={24} style={{ color: '#fff', marginBottom: '0.5rem', opacity: 0.9 }} />
          <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
            3D Preview Unavailable
          </h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0, maxWidth: 280 }}>
            3D model is currently unavailable for this product.
          </p>
        </div>
      </div>
    );
  }

  // Fallback UI 2: Model failed to parse or download during rendering
  const errorFallback = (
    <div 
      className="model-canvas-wrapper" 
      style={{ 
        height, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      <img 
        src={fallbackImage} 
        alt={productName} 
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
      />
      <div style={{
        position: 'absolute',
        textAlign: 'center',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <AlertCircle size={30} style={{ color: 'var(--error)', marginBottom: '0.5rem' }} />
        <h4 style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
          Unable to load this 3D model
        </h4>
        <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', margin: 0 }}>
          Check your network or file compatibility.
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="model-canvas-wrapper"
      style={{ height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', background: 'var(--surface-2)' }}
    >
      <GLTFErrorBoundary 
        productName={productName} 
        fallback={errorFallback} 
        onError={() => setLoadError(true)}
      >
        <Canvas
          camera={{ position: [0, 1.3, 3.8], fov: 42 }}
          style={{ background: 'transparent' }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 8, 4]} intensity={1.5} castShadow />
          <directionalLight position={[-4, 2, -4]} intensity={0.5} />
          <pointLight position={[0, -2, 0]} intensity={0.3} color="#b8965a" />

          {/* Ground shadow receiver */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial transparent opacity={0.12} />
          </mesh>

          <Suspense fallback={<LoadingMesh />}>
            <GLBModel url={modelUrl} />
          </Suspense>

          <OrbitControls
            target={[0, 0.75, 0]}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={1.4}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={Math.PI * 0.1}
            maxPolarAngle={Math.PI * 0.85}
          />
        </Canvas>
      </GLTFErrorBoundary>

      {/* Watermark hint */}
      {!loadError && (
        <div style={{
          position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
          fontSize: '0.68rem', color: 'rgba(92,82,72,0.6)', pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          Drag to rotate · Scroll to zoom
        </div>
      )}
    </div>
  );
};

// ─── GLBModel ─────────────────────────────────────────────────────────────────
const GLBModel = ({ url }) => {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  useEffect(() => {
    if (scene) {
      console.log(`[GLTF Load Success] 3D model loaded successfully from URL: "${url}"`);
    }
  }, [scene, url]);

  // Center and Scale Model using its Bounding Box
  useEffect(() => {
    if (!groupRef.current || !scene) return;

    // Force updates on matrix calculations
    groupRef.current.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim === 0) return;

    // Scale to standard unit size (1.6 units)
    const scale = 1.6 / maxDim;
    groupRef.current.scale.setScalar(scale);

    // Re-center model pivot
    const newBox = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    newBox.getCenter(center);
    groupRef.current.position.sub(center);

    // Position model base to sit flush on the floor grid (Y=0)
    const floorBox = new THREE.Box3().setFromObject(groupRef.current);
    const floorSize = new THREE.Vector3();
    floorBox.getSize(floorSize);
    groupRef.current.position.y = floorSize.y / 2 - 0.01;

    console.log(`[3D Auto-Fit] Bounding box sized: [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}]. Applied scale scalar: ${scale.toFixed(4)}`);
  }, [scene, url]);

  // Cast shadows on all meshes
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
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
    <group>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.4, 0.06, 12, 48]} />
        <meshStandardMaterial color="#B8965A" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Tiny text indicating loading state */}
      <mesh position={[0, -0.7, 0]}>
        {/* Placeholder mesh since canvas text needs custom loaders, standard DOM overlay preferred */}
      </mesh>
    </group>
  );
};

export default ModelPreview;
