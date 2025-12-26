import { useRef, useState, useEffect, useMemo, memo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// Ease function
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// GPU Detection
const detectGPUTier = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 'low';
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
  
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    if (renderer.includes('Apple A1') || renderer.includes('Adreno 7') || renderer.includes('Mali-G7')) {
      return 'medium';
    }
    return 'low';
  }
  
  const highEndKeywords = ['RTX', 'RX 6', 'RX 7', 'GTX 16', 'GTX 20', 'GTX 30', 'GTX 40', 'M1', 'M2', 'M3'];
  const midEndKeywords = ['GTX 10', 'GTX 9', 'RX 5', 'Intel Iris', 'Radeon', 'GeForce'];
  
  for (const keyword of highEndKeywords) {
    if (renderer.includes(keyword)) return 'high';
  }
  
  for (const keyword of midEndKeywords) {
    if (renderer.includes(keyword)) return 'medium';
  }
  
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (maxTextureSize >= 16384) return 'high';
  if (maxTextureSize >= 8192) return 'medium';
  
  return 'low';
};

// Simple memoized mesh component
const MeshComponent = memo(({ geometry, material, ...props }) => (
  <mesh geometry={geometry} material={material} {...props} />
));

// Transmission mesh with MeshPhysicalMaterial
const TransmissionMesh = memo(({ geometry, transmissionProps, ...props }) => (
  <mesh geometry={geometry} {...props}>
    <meshPhysicalMaterial {...transmissionProps} />
  </mesh>
));

function Model({ currentSection = 0, sectionProgress = 0, onPartsDetected, ...props }) {
  const gRef = useRef();
  const { nodes } = useGLTF("/ring.glb");
  const [scale, setScale] = useState({ s: 1, p: 1 });
  const [gpuTier, setGpuTier] = useState('medium');
  const tgt = useRef({ pos: new THREE.Vector3(), rot: new THREE.Euler(), scale: 1 });
  const prevSection = useRef(currentSection);

  useEffect(() => {
    const tier = detectGPUTier();
    setGpuTier(tier);
    console.log('GPU Tier detected:', tier);
    
    const update = () => {
      const w = window.innerWidth;
      const newScale = w < 640 ? { s: 0.4, p: 0.35 } : w < 1024 ? { s: 0.6, p: 0.5 } : { s: 1, p: 1 };
      setScale(newScale);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // Detect parts once on mount
  useEffect(() => {
    const detectedParts = [];
    
    const detectPartType = (name) => {
      const lower = name.toLowerCase();
      if (lower.includes('pearl')) return 'pearl';
      if (lower.includes('stone') || lower.includes('diamond') || 
          lower.includes('gem') || lower.includes('ruby') || 
          lower.includes('sapphire') || lower.includes('emerald')) {
        return 'stone';
      }
      if (lower.includes('crown') || lower.includes('band') || lower.includes('ring') || 
          lower.includes('shank') || lower.includes('metal') ||
          lower.includes('prong') || lower.includes('setting')) {
        return 'metal';
      }
      return 'metal';
    };

    Object.entries(nodes).forEach(([name, node]) => {
      if (node.geometry) {
        const partType = detectPartType(name);
        const materialType = partType === 'stone' ? 'diamond' : 
                           partType === 'pearl' ? 'white' : 'gold';
        
        detectedParts.push({
          id: name,
          name: name,
          type: partType,
          geometry: node.geometry,
          position: node.position,
          rotation: node.rotation,
          scale: node.scale,
          currentMaterialType: materialType
        });
      }
    });
    
    onPartsDetected?.(detectedParts);
    console.log('Auto-detected parts:', detectedParts);
  }, [nodes, onPartsDetected]);

  const kf = useMemo(() => {
    const { s, p } = scale;
    return [
      [[0,0,0],[0,0,0],2*s],
      [[0,0.8*s,0],[1.57,0,0],3.2*s],
      [[-p,0,0],[1.26,0,0.63],3.2*s],
      [[-3*p,0,0],[0,-1.31,-0.63],2.6*s],
      [[1.5*p,0,0],[1.26,3.14,0.63],3.2*s],
      [[3*p,0,0],[0,-1.75,-0.63],2.6*s],
      [[0,1.8*s,0],[0.52,0.79,0],4.5*s],
      [[-2*p,-0.5*s,0],[1.05,-1.05,0.52],3*s],
      [[0,0,0],[0.79,4.71,0],2.8*s],
      [[0,-0.2*s,0],[0.39,1.05,-0.26],2.5*s]
    ];
  }, [scale]);

  useFrame(() => {
    const g = gRef.current;
    if (!g) return;
    
    const section = Math.min(currentSection, kf.length - 1);
    const c = kf[section];
    const n = kf[section + 1];
    const t = tgt.current;

    if (n) {
      const e = ease(sectionProgress);
      t.pos.x = c[0][0] + (n[0][0] - c[0][0]) * e;
      t.pos.y = c[0][1] + (n[0][1] - c[0][1]) * e;
      t.pos.z = c[0][2] + (n[0][2] - c[0][2]) * e;
      
      t.rot.x = c[1][0] + (n[1][0] - c[1][0]) * e;
      t.rot.y = c[1][1] + (n[1][1] - c[1][1]) * e;
      t.rot.z = c[1][2] + (n[1][2] - c[1][2]) * e;
      
      t.scale = c[2] + (n[2] - c[2]) * e;
    } else {
      t.pos.x = c[0][0];
      t.pos.y = c[0][1];
      t.pos.z = c[0][2];
      t.rot.x = c[1][0];
      t.rot.y = c[1][1];
      t.rot.z = c[1][2];
      t.scale = c[2];
    }

    prevSection.current = currentSection;

    const lerpFactor = 0.15;
    
    g.position.x += (t.pos.x - g.position.x) * lerpFactor;
    g.position.y += (t.pos.y - g.position.y) * lerpFactor;
    g.position.z += (t.pos.z - g.position.z) * lerpFactor;
    
    g.rotation.x += (t.rot.x - g.rotation.x) * lerpFactor;
    g.rotation.y += (t.rot.y - g.rotation.y) * lerpFactor;
    g.rotation.z += (t.rot.z - g.rotation.z) * lerpFactor;
    
    const scaleVal = g.scale.x + (t.scale - g.scale.x) * lerpFactor;
    g.scale.set(scaleVal, scaleVal, scaleVal);
  });

  const col = useMemo(() => ({
    w: new THREE.Color(0xffffff),
    gd: new THREE.Color(0xffd700),
    pr: new THREE.Color(0xfff5e1)
  }), []);

  const sharedMaterials = useMemo(() => {
    const mtMat = new THREE.MeshStandardMaterial({
      color: col.gd,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.5
    });

    const plMat = new THREE.MeshPhysicalMaterial({
      color: col.pr,
      metalness: 0,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      sheen: 1,
      sheenRoughness: 0.3,
      sheenColor: new THREE.Color(0xffd1dc),
      iridescence: 0.6,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
      envMapIntensity: 1.2,
      reflectivity: 0.5
    });

    const diamondMatSimple = new THREE.MeshPhysicalMaterial({
      color: col.w,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 0.5,
      ior: 2.417,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0,
      transparent: true,
      envMapIntensity: 3
    });

    return { mtMat, plMat, diamondMatSimple };
  }, [col]);

  useEffect(() => {
    return () => {
      sharedMaterials.mtMat.dispose();
      sharedMaterials.plMat.dispose();
      sharedMaterials.diamondMatSimple.dispose();
    };
  }, [sharedMaterials]);

  const transmissionProps = useMemo(() => {
    const qualitySettings = {
      high: { samples: 6, resolution: 1024 },
      medium: { samples: 4, resolution: 512 },
      low: { samples: 2, resolution: 256 }
    };

    const settings = qualitySettings[gpuTier];

    return {
      transmission: 1,
      thickness: 0.5,
      roughness: 0,
      metalness: 0,
      ior: 2.417,
      chromaticAberration: gpuTier === 'high' ? 0.08 : 0.04,
      envMapIntensity: 3,
      clearcoat: 1,
      clearcoatRoughness: 0,
      attenuationDistance: 0.01,
      attenuationColor: col.w,
      color: col.w,
      reflectivity: 1,
      transparent: true
    };
  }, [col, gpuTier]);

  const n = nodes;
  const useFallback = gpuTier === 'low';

  return (
    <group ref={gRef} {...props} dispose={null}>
      {Object.entries(n).map(([name, node]) => {
        if (!node.geometry) return null;
        
        const isDiamond = name.toLowerCase().includes('diamond');
        const isPearl = name.toLowerCase().includes('pearl');
        
        // Determine material
        let material = sharedMaterials.mtMat; // default metal
        if (isPearl) material = sharedMaterials.plMat;
        if (isDiamond && useFallback) material = sharedMaterials.diamondMatSimple;
        
        return (
          <group key={name}>
            {isDiamond && !useFallback ? (
              <TransmissionMesh
                geometry={node.geometry}
                position={node.position}
                rotation={node.rotation}
                scale={node.scale}
                transmissionProps={transmissionProps}
                castShadow={false}
                receiveShadow={false}
              />
            ) : (
              <MeshComponent
                geometry={node.geometry}
                position={node.position}
                rotation={node.rotation}
                scale={node.scale}
                material={material}
                castShadow={false}
                receiveShadow={false}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

export default memo(Model);

useGLTF.preload("/ring.glb");