import { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import * as THREE from "three";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import ease from "../Utils/ease";
import MATERIAL_PRESETS from "../Data/Material";
import detectGPUTier from "../Utils/GPUDetector";
import MeshComponent from "./MeshComponent";

// TransmissionMesh with forced re-creation on prop changes
const TransmissionMesh = ({ geometry, transmissionProps, ...props }) => {
  const meshRef = useRef();
  
  // Force material recreation when resolution/samples change
  const materialKey = `${transmissionProps.resolution}-${transmissionProps.samples}-${transmissionProps.anisotropicBlur}`;
  
  useEffect(() => {
    console.log('🔷 Material updated with resolution:', transmissionProps.resolution, 'samples:', transmissionProps.samples);
  }, [transmissionProps.resolution, transmissionProps.samples]);
  
  return (
    <mesh ref={meshRef} geometry={geometry} {...props}>
      <MeshTransmissionMaterial 
        key={materialKey}
        {...transmissionProps} 
      />
    </mesh>
  );
};

export default function Model({ currentSection, sectionProgress, onPartsDetected, onPartSelect, selectedPartId, parts: externalParts, ...props }) {
  const gRef = useRef();
  const { nodes } = useGLTF("/ring.glb");
  const [scale, setScale] = useState({ s: 1, p: 1 });
  const [gpuTier, setGpuTier] = useState('medium');
  const [hovered, setHovered] = useState(null);
  const tgt = useRef({ pos: new THREE.Vector3(), rot: new THREE.Euler(), scale: 1 });
  const prevSection = useRef(currentSection);
  const materialsRef = useRef(new Map());

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

  useEffect(() => {
    const detectedParts = [];
    
    Object.entries(nodes).forEach(([name, node]) => {
      if (node.geometry) {
        const partType = detectPartType(name);
        const materialType = partType === 'stone' ? 'diamond' : 
                           partType === 'pearl' ? 'white' : 'gold';
        
        detectedParts.push({
          id: name,
          name: name,
          type: partType,
          node: node,
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

  useEffect(() => {
    const tier = detectGPUTier();
    setGpuTier(tier);
    console.log('GPU Tier detected:', tier);
    
    // Listen for manual GPU tier changes (for testing)
    const handleGPUTierChange = (e) => {
      console.log('🎮 Manually changing GPU tier to:', e.detail);
      setGpuTier(e.detail);
    };
    window.addEventListener('changeGPUTier', handleGPUTierChange);
    
    const update = () => {
      const w = window.innerWidth;
      const newScale = w < 640 ? { s: 0.5, p: 0.35 } : w < 1024 ? { s: 0.6, p: 0.5 } : { s: 1, p: 1 };
      setScale(newScale);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('changeGPUTier', handleGPUTierChange);
    };
  }, []);

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

  const createMaterial = useCallback((part) => {
    const cacheKey = `${part.id}-${part.currentMaterialType}`;
    
    if (materialsRef.current.has(cacheKey)) {
      return materialsRef.current.get(cacheKey);
    }

    const preset = MATERIAL_PRESETS[part.type][part.currentMaterialType];
    
    let newMaterial;
    if (part.type === 'pearl') {
      newMaterial = new THREE.MeshPhysicalMaterial({
        color: preset.color,
        metalness: preset.metalness,
        roughness: preset.roughness,
        clearcoat: preset.clearcoat || 0,
        clearcoatRoughness: preset.clearcoatRoughness || 0,
        sheen: preset.sheen || 0,
        sheenColor: preset.sheenColor || '#ffffff',
        sheenRoughness: 0.3,
        iridescence: 0.6,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 400],
        envMapIntensity: preset.envMapIntensity,
        reflectivity: 0.5
      });
    } else {
      newMaterial = new THREE.MeshStandardMaterial({
        color: preset.color,
        metalness: preset.metalness,
        roughness: preset.roughness,
        envMapIntensity: preset.envMapIntensity
      });
    }

    materialsRef.current.set(cacheKey, newMaterial);
    
    return newMaterial;
  }, []);

  // Helper function to determine diamond size category
  const getDiamondSize = (name) => {
    const lower = name.toLowerCase();
    
    // Main/large diamonds
    if (lower.includes('main') || lower.includes('center') || lower.includes('large')) {
      return 'main';
    }
    
    // Medium diamonds
    if (lower.includes('medium') || lower.includes('side')) {
      return 'medium';
    }
    
    // Small/accent diamonds (default for most)
    if (lower.includes('small') || lower.includes('accent') || lower.includes('tiny')) {
      return 'small';
    }
    
    // If it has a number > 3, it's probably a small accent diamond
    const numbers = name.match(/\d+/);
    if (numbers && parseInt(numbers[0]) > 3) {
      return 'small';
    }
    
    // Default to small for safety
    return 'small';
  };

  const getTransmissionProps = (part) => {
    const preset = MATERIAL_PRESETS[part.type][part.currentMaterialType];
    const isDiamond = part.currentMaterialType === 'diamond';
    
    // Determine diamond size
    const diamondSize = isDiamond ? getDiamondSize(part.name) : 'small';
    
    // Quality settings with separate main and small diamond configs - EXTREME VALUES FOR TESTING
    const qualitySettings = {
      high: { 
        mainResolution: 512, 
        smallResolution: 256,
        mainSamples: 6, 
        smallSamples: 4,
        blur: 0.0,
        roughness: 0.0,
        transmission: 1.0
      },
      medium: { 
        mainResolution: 128,  // VERY LOW - should see pixelation
        smallResolution: 64,   // VERY LOW - should see pixelation
        mainSamples: 2, 
        smallSamples: 1,
        blur: 0.5,  // HIGH blur
        roughness: 0.1,
        transmission: 0.9
      },
      low: { 
        mainResolution: 32,   // EXTREMELY LOW - obvious pixelation
        smallResolution: 32,   // EXTREMELY LOW - obvious pixelation
        mainSamples: 1, 
        smallSamples: 1,
        blur: 0.8,  // VERY HIGH blur
        roughness: 0.3,
        transmission: 0.7
      }
    };
    
    const settings = qualitySettings[gpuTier];
    
    // Select resolution and samples based on diamond size
    const resolution = diamondSize === 'main' ? settings.mainResolution : settings.smallResolution;
    const samples = diamondSize === 'main' ? settings.mainSamples : settings.smallSamples;
    
    console.log(`💎 ${part.name} (${diamondSize}) - Tier ${gpuTier}:`, {
      resolution,
      samples,
      blur: settings.blur,
      roughness: settings.roughness,
      transmission: settings.transmission
    });
    
    return {
      transmission: settings.transmission,  // CHANGED: Now uses tier-based transmission
      thickness: preset.thickness,
      roughness: settings.roughness,  // CHANGED: Now uses tier-based roughness
      metalness: preset.metalness,
      ior: preset.ior,
      chromaticAberration: isDiamond ? (gpuTier === 'high' ? 0.08 : 0.04) : (gpuTier === 'high' ? 0.02 : 0.01),
      envMapIntensity: gpuTier === 'low' ? 1.0 : preset.envMapIntensity,  // CHANGED: Lower on low tier
      clearcoat: preset.clearcoat || (gpuTier === 'low' ? 0 : 0.8),
      clearcoatRoughness: preset.clearcoatRoughness || 0.1,
      attenuationDistance: isDiamond ? 0.01 : 0.2,
      attenuationColor: preset.color,
      color: preset.color,
      reflectivity: preset.reflectivity || 0.5,
      samples: samples,
      resolution: resolution,
      anisotropicBlur: settings.blur,
      ...(isDiamond && gpuTier === 'high' && { 
        distortion: 0.05,
        distortionScale: 0.2,
        temporalDistortion: 0.1
      })
    };
  };

  const handlePartClick = (part) => (e) => {
    e.stopPropagation();
    onPartSelect?.(part);
  };

  const handlePartHover = (partId) => (e) => {
    e.stopPropagation();
    setHovered(partId);
    document.body.style.cursor = 'pointer';
  };

  const handlePartOut = () => {
    setHovered(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={gRef} {...props} dispose={null}>
      {externalParts.map((part) => {
        const isSelected = selectedPartId === part.id;
        const isHovered = hovered === part.id;
        
        console.log('🔍 Processing part:', part.name, 'type:', part.type);
        
        // ALWAYS use TransmissionMesh for stones (diamonds)
        if (part.type === 'stone') {
          const transmissionProps = getTransmissionProps(part);
          console.log('💎 STONE DETECTED - Using TransmissionMesh:', part.name, transmissionProps);
          return (
            <group key={part.id}>
              <TransmissionMesh
                key={`${part.id}-${gpuTier}-${transmissionProps.resolution}`}
                geometry={part.geometry}
                position={part.position}
                rotation={part.rotation}
                scale={part.scale}
                transmissionProps={transmissionProps}
                onClick={handlePartClick(part)}
                onPointerOver={handlePartHover(part.id)}
                onPointerOut={handlePartOut}
                castShadow={false}
                receiveShadow={false}
              />
              {(isSelected || isHovered) && (
                <mesh geometry={part.geometry} position={part.position} rotation={part.rotation} scale={part.scale}>
                  <meshBasicMaterial color={isSelected ? "#ffff00" : "#ffffff"} wireframe transparent opacity={0.3} />
                </mesh>
              )}
            </group>
          );
        }
        
        console.log('🔧 NON-STONE - Using MeshComponent:', part.name);
        
        // For non-stones (metal, pearls), use regular material
        return (
          <group key={part.id}>
            <MeshComponent
              geometry={part.geometry}
              position={part.position}
              rotation={part.rotation}
              scale={part.scale}
              material={createMaterial(part)}
              onClick={handlePartClick(part)}
              onPointerOver={handlePartHover(part.id)}
              onPointerOut={handlePartOut}
              castShadow={false}
              receiveShadow={false}
            />
            {(isSelected || isHovered) && (
              <mesh geometry={part.geometry} position={part.position} rotation={part.rotation} scale={part.scale}>
                <meshBasicMaterial color={isSelected ? "#ffff00" : "#ffffff"} wireframe transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}