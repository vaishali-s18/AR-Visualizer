import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  TransformControls,
  Environment,
  ContactShadows,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';

// ─── GLTF Error Boundary ──────────────────────────────────────────────────────
class GLTFErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) {
    console.error(`[RoomScene] Failed to load "${this.props.itemName}":`, error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Room shell ───────────────────────────────────────────────────────────────
const Room = ({ dimensions, onDeselect }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={(e) => { e.stopPropagation(); onDeselect(); }}>
      <planeGeometry args={[dimensions.width, dimensions.depth]} />
      <meshStandardMaterial color="#E5DDD4" roughness={0.85} metalness={0.02} />
    </mesh>
    <mesh position={[0, dimensions.height / 2, -dimensions.depth / 2]} receiveShadow>
      <planeGeometry args={[dimensions.width, dimensions.height]} />
      <meshStandardMaterial color="#F2EDE6" roughness={0.95} />
    </mesh>
    <mesh rotation={[0, Math.PI / 2, 0]} position={[-dimensions.width / 2, dimensions.height / 2, 0]} receiveShadow>
      <planeGeometry args={[dimensions.depth, dimensions.height]} />
      <meshStandardMaterial color="#EDE8E0" roughness={0.95} />
    </mesh>
    <mesh rotation={[0, -Math.PI / 2, 0]} position={[dimensions.width / 2, dimensions.height / 2, 0]} receiveShadow>
      <planeGeometry args={[dimensions.depth, dimensions.height]} />
      <meshStandardMaterial color="#EDE8E0" roughness={0.95} />
    </mesh>
  </group>
);

// ─── Error placeholder box ────────────────────────────────────────────────────
const ModelErrorMesh = ({ item, isSelected, onClick }) => (
  <group
    position={[item.position.x, item.position.y, item.position.z]}
    rotation={[0, item.rotation, 0]}
    scale={[item.scale, item.scale, item.scale]}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
  >
    <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.9, 1.2, 0.9]} />
      <meshStandardMaterial color={isSelected ? '#3b82f6' : '#E74C3C'} roughness={0.6} metalness={0.1} />
    </mesh>
    <mesh position={[0, 0.6, 0]}>
      <boxGeometry args={[0.91, 1.21, 0.91]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.5} />
    </mesh>
  </group>
);

// ─── FurniturePiece ───────────────────────────────────────────────────────────
// FIX 1: Clone the scene so multiple instances of the same GLB don't share geometry.
// Product dimensions set the model's real-world size when available.
const FurniturePiece = ({ item, isSelected, onClick, onReady }) => {
  const gltf = useGLTF(item.modelUrl);
  const groupRef = useRef();

  // Clone the scene so every placed instance is independent
  const clonedScene = useRef(null);
  if (!clonedScene.current) {
    clonedScene.current = gltf.scene.clone(true);
    clonedScene.current.traverse((child) => {
      if (child.isMesh) {
        child.material = Array.isArray(child.material)
          ? child.material.map(material => material.clone())
          : child.material.clone();
      }
    });
  }
  const scene = clonedScene.current;
  const materialDefaults = useRef(new Map());

  // Enable shadows and normalize the model to its product dimensions on mount.
  useEffect(() => {
    if (!scene || !groupRef.current) return;

    // Enable shadows on every mesh
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = true;
        child.receiveShadow = true;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (!materialDefaults.current.has(material)) {
            materialDefaults.current.set(material, {
              color: material.color?.clone(),
              roughness: material.roughness,
              metalness: material.metalness,
            });
          }
        });
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const modelMax = Math.max(size.x, size.y, size.z);
    const dimensions = item.dimensions || {};
    const productMaxMeters = Math.max(
      dimensions.width || 0,
      dimensions.height || 0,
      dimensions.depth || 0,
    ) / 100;
    const targetMaxMeters = productMaxMeters > 0 ? productMaxMeters : 1.5;
    if (modelMax > 0) {
      scene.scale.setScalar(targetMaxMeters / modelMax);
    }

    const scaledBox = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    scaledBox.getCenter(center);
    scene.position.x = -center.x;
    scene.position.z = -center.z;
    scene.position.y = -scaledBox.min.y;

    if (isSelected && onReady) onReady(groupRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);                               // Model geometry is normalized once per mount.

  useEffect(() => {
    const finishPresets = {
      original: null,
      fabric: { roughness: 0.92, metalness: 0 },
      wood: { roughness: 0.58, metalness: 0 },
      leather: { roughness: 0.72, metalness: 0 },
      metal: { roughness: 0.3, metalness: 0.72 },
    };
    const preset = finishPresets[item.finish || 'original'];
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        const defaults = materialDefaults.current.get(material);
        if (!defaults) return;
        if (defaults.color && material.color) {
          if (item.color) material.color.set(item.color);
          else material.color.copy(defaults.color);
        }
        material.roughness = preset ? preset.roughness : defaults.roughness;
        material.metalness = preset ? preset.metalness : defaults.metalness;
        material.needsUpdate = true;
      });
    });
  }, [scene, item.color, item.finish]);

  // Attach transform gizmo when this item becomes selected
  useEffect(() => {
    if (isSelected && groupRef.current && onReady) {
      onReady(groupRef.current);
    }
  }, [isSelected, onReady]);

  // Sync position/rotation/scale from React state → Three.js every frame
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(item.position.x, item.position.y, item.position.z);
    groupRef.current.rotation.y = item.rotation;
    if (item.isScaled) groupRef.current.scale.setScalar(item.scale);
  }, [item.position, item.rotation, item.scale, item.isScaled]);

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <primitive object={scene} />
    </group>
  );
};

// ─── Loading ring (Suspense fallback inside Canvas) ───────────────────────────
const LoadingRing = () => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 1.8;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.4;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.8, 0]}>
      <torusGeometry args={[0.35, 0.06, 12, 48]} />
      <meshStandardMaterial color="#B8965A" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────
const Scene = ({ placedItems, selectedItemUuid, onSelectItem, onUpdateItemTransform, controlMode, roomDimensions }) => {
  const [selectedObj, setSelectedObj] = useState(null);
  const orbitRef     = useRef();
  const transformRef = useRef();

  useEffect(() => {
    if (!selectedItemUuid) setSelectedObj(null);
  }, [selectedItemUuid]);

  // Disable orbit while using gizmo
  useEffect(() => {
    const tc = transformRef.current;
    if (!tc) return;
    const toggle = (e) => { if (orbitRef.current) orbitRef.current.enabled = !e.value; };
    tc.addEventListener('dragging-changed', toggle);
    return () => tc.removeEventListener('dragging-changed', toggle);
  }, [selectedObj]);

  // FIX 3: drei v10 renamed 'mouseUp' → 'mouse-up'
  useEffect(() => {
    const tc = transformRef.current;
    if (!tc || !selectedObj || !selectedItemUuid) return;

    const sync = () => {
      if (!tc.object) return;
      onUpdateItemTransform(selectedItemUuid, {
        position: {
          x: parseFloat(tc.object.position.x.toFixed(3)),
          y: parseFloat(tc.object.position.y.toFixed(3)),
          z: parseFloat(tc.object.position.z.toFixed(3)),
        },
        rotation: parseFloat(tc.object.rotation.y.toFixed(3)),
        scale:    parseFloat(tc.object.scale.x.toFixed(3)),
      });
    };

    // Try both event names for compatibility
    tc.addEventListener('mouse-up', sync);
    tc.addEventListener('mouseUp',  sync);
    return () => {
      tc.removeEventListener('mouse-up', sync);
      tc.removeEventListener('mouseUp',  sync);
    };
  }, [selectedObj, selectedItemUuid, onUpdateItemTransform]);

  const isValidModel = (url) => {
    const imageRe = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i;
    return url && typeof url === 'string' && url.trim() !== '' && !imageRe.test(url);
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} />
      <pointLight position={[0, 3, 2]} intensity={0.2} color="#FFDDB3" />

      <Environment preset="apartment" />
      <Room dimensions={roomDimensions} onDeselect={() => onSelectItem(null)} />
      <ContactShadows position={[0, 0.005, 0]} opacity={0.45} scale={Math.max(roomDimensions.width, roomDimensions.depth) * 1.5} blur={2.5} far={4} color="#3D2B1F" />

      {placedItems.map((item) => {
        const isSelected = item.uuid === selectedItemUuid;
        const modelKey = `${item.uuid}:${item.productId}:${item.modelUrl}`;
        const errorMesh = (
          <ModelErrorMesh
            item={item}
            isSelected={isSelected}
            onClick={() => onSelectItem(item.uuid)}
          />
        );

        if (!isValidModel(item.modelUrl)) {
          console.warn(`[RoomScene] Invalid modelUrl for "${item.name}": "${item.modelUrl}"`);
          return <React.Fragment key={item.uuid}>{errorMesh}</React.Fragment>;
        }

        return (
          <GLTFErrorBoundary key={modelKey} itemName={item.name} itemId={item.productId} fallback={errorMesh}>
            <Suspense fallback={<LoadingRing />}>
              <FurniturePiece
                key={modelKey}
                item={item}
                isSelected={isSelected}
                onClick={() => onSelectItem(item.uuid)}
                onReady={setSelectedObj}
              />
            </Suspense>
          </GLTFErrorBoundary>
        );
      })}

      {selectedObj && selectedItemUuid && (
        <TransformControls
          ref={transformRef}
          object={selectedObj}
          mode={controlMode}
          size={0.8}
        />
      )}

      <OrbitControls
        ref={orbitRef}
        makeDefault
        target={[0, roomDimensions.height * 0.22, 0]}
        minPolarAngle={Math.PI * 0.05}
        maxPolarAngle={Math.PI * 0.48}
        minDistance={2.0}
        maxDistance={Math.max(roomDimensions.width, roomDimensions.depth) * 2}
      />
    </>
  );
};

// ─── RoomScene (public export) ────────────────────────────────────────────────
const RoomScene = ({
  placedItems = [],
  selectedItemUuid = null,
  onSelectItem,
  onUpdateItemTransform,
  controlMode = 'translate',
  roomDimensions = { width: 8, depth: 8, height: 3.5 },
}) => (
  <Canvas
    shadows={{ type: THREE.PCFShadowMap }}
    camera={{
      position: [0, roomDimensions.height, Math.max(roomDimensions.width, roomDimensions.depth) * 0.85],
      fov: 45,
    }}
    style={{ background: '#F5F3F0', width: '100%', height: '100%' }}
    gl={{
      antialias: true,
      alpha: false,
      // Use mediump to avoid the double-precision HLSL compiler warnings
      // produced by the DirectX shader compiler on Windows (X4122).
      precision: 'mediump',
    }}
  >
    <Scene
      placedItems={placedItems}
      selectedItemUuid={selectedItemUuid}
      onSelectItem={onSelectItem}
      onUpdateItemTransform={onUpdateItemTransform}
      controlMode={controlMode}
      roomDimensions={roomDimensions}
    />
  </Canvas>
);

export default RoomScene;
