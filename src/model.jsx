import { memo, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useQualityProvider } from "./Data/QualityProvider";

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const MeshComponent = memo(({ geometry, material, ...props }) => (
  <mesh geometry={geometry} material={material} {...props} />
));

const TransmissionMesh = memo(({ geometry, transmissionProps, ...props }) => {
  const materialKey = `${transmissionProps.resolution}-${transmissionProps.samples}-${transmissionProps.transmission}`;
  
  return (
    <mesh geometry={geometry} {...props}>
      <MeshTransmissionMaterial key={materialKey} {...transmissionProps} />
    </mesh>
  );
});

function Model({
  currentSection = 0,
  sectionProgress = 0,
  onPartsDetected,
  ...props
}) {
  const gRef = useRef();
  const { nodes } = useGLTF("/ring.glb");
  const [scale, setScale] = useState({ s: 1, p: 1 });
  
  const quality = useQualityProvider();
  console.log('🎚️ Selected Quality:', quality?.selectedQuality);
  
  const tgt = useRef({
    pos: new THREE.Vector3(),
    rot: new THREE.Euler(),
    scale: 1,
  });
  const prevSection = useRef(currentSection);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const newScale =
        w < 640
          ? { s: 0.4, p: 0.35 }
          : w < 1024
          ? { s: 0.6, p: 0.5 }
          : { s: 1, p: 1 };
      setScale(newScale);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const detectedParts = [];

    const detectPartType = (name) => {
      const lower = name.toLowerCase();
      if (lower.includes("pearl")) return "pearl";
      if (
        lower.includes("stone") ||
        lower.includes("diamond") ||
        lower.includes("gem") ||
        lower.includes("ruby") ||
        lower.includes("sapphire") ||
        lower.includes("emerald")
      ) {
        return "stone";
      }
      if (
        lower.includes("crown") ||
        lower.includes("band") ||
        lower.includes("ring") ||
        lower.includes("shank") ||
        lower.includes("metal") ||
        lower.includes("prong") ||
        lower.includes("setting")
      ) {
        return "metal";
      }
      return "metal";
    };

    Object.entries(nodes).forEach(([name, node]) => {
      if (node.geometry) {
        const partType = detectPartType(name);
        const materialType =
          partType === "stone"
            ? "diamond"
            : partType === "pearl"
            ? "white"
            : "gold";

        detectedParts.push({
          id: name,
          name: name,
          type: partType,
          geometry: node.geometry,
          position: node.position,
          rotation: node.rotation,
          scale: node.scale,
          currentMaterialType: materialType,
        });
      }
    });

    onPartsDetected?.(detectedParts);
    console.log("Auto-detected parts:", detectedParts);
  }, [nodes, onPartsDetected]);

  const kf = useMemo(() => {
    const { s, p } = scale;
    return [
      [[0, 0, 0], [0, 0, 0], 2 * s],
      [[0, 0.8 * s, 0], [1.57, 0, 0], 3.2 * s],
      [[-p, 0, 0], [1.26, 0, 0.63], 3.2 * s],
      [[-3 * p, 0, 0], [0, -1.31, -0.63], 2.6 * s],
      [[1.5 * p, 0, 0], [1.26, 3.14, 0.63], 3.2 * s],
      [[3 * p, 0, 0], [0, -1.75, -0.63], 2.6 * s],
      [[0, 1.8 * s, 0], [0.52, 0.79, 0], 4.5 * s],
      [[-2 * p, -0.5 * s, 0], [1.05, -1.05, 0.52], 3 * s],
      [[0, 0, 0], [0.79, 4.71, 0], 2.8 * s],
      [[0, -0.2 * s, 0], [0.39, 1.05, -0.26], 2.5 * s],
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

  const col = useMemo(
    () => ({
      w: new THREE.Color(0xffffff),
      gd: new THREE.Color(0xffd700),
      pr: new THREE.Color(0xfff5e1),
    }),
    []
  );

  const sharedMaterials = useMemo(() => {
    const mtMat = new THREE.MeshStandardMaterial({
      color: col.gd,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.5,
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
      reflectivity: 0.5,
    });

    // 💎 ULTRA REALISTIC simple diamond - fully transparent fallback
    const diamondMatSimple = new THREE.MeshPhysicalMaterial({
      color: col.w,
      metalness: 0,
      roughness: 0,
      transmission: 0.95, // High transparency even in fallback
      thickness: 1.0,
      ior: 2.3,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0,
      transparent: true,
      opacity: 1.0,
      envMapIntensity: 4.0,
      iridescence: 0.5,
      iridescenceIOR: 1.4,
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

  const getDiamondSize = (name) => {
    const lower = name.toLowerCase();
    
    if (lower.includes('main') || lower.includes('center') || lower.includes('large')) {
      return 'main';
    }
    
    if (lower.includes('medium') || lower.includes('side')) {
      return 'medium';
    }
    
    if (lower.includes('small') || lower.includes('accent') || lower.includes('tiny')) {
      return 'small';
    }
    
    const numbers = name.match(/\d+/);
    if (numbers && parseInt(numbers[0]) > 3) {
      return 'small';
    }
    
    return 'small';
  };

  const getTransmissionProps = useMemo(() => {
    if (!quality) return () => ({});

    const settings = quality.selectedQuality;

    return (diamondName) => {
      const diamondSize = getDiamondSize(diamondName);
      const resolution = diamondSize === 'main' ? settings.mainRes : settings.smallRes;
      const samples = diamondSize === 'main' ? settings.mainSamples : settings.smallSamples;
      
      console.log(`💎 ${diamondName} (${diamondSize}) - ${quality.selectedQuality.name}: transmission=${settings.transmission}, IOR=${settings.ior}`);

      return {
        samples: samples,
        resolution: resolution,
        
        // 💎💎💎 MAXIMUM TRANSPARENCY & REALISM
        transmission: settings.transmission, // 0.92-1.0 = VERY transparent
        thickness: settings.thickness, // 0.7-2.0 = deep material
        roughness: settings.roughness, // 0-0.02 = mirror smooth
        metalness: 0,
        ior: settings.ior, // 2.15-2.417 = accurate diamond refraction
        
        // ✨ REALISTIC LIGHT EFFECTS
        chromaticAberration: settings.chromaticAberration, // Rainbow fire
        distortion: settings.distortion, // Light bending
        distortionScale: settings.distortionScale,
        temporalDistortion: 0,
        
        anisotropicBlur: 0, // Keep sharp for transparency
        
        clearcoat: 0, // Don't need clearcoat with high transmission
        clearcoatRoughness: 0,
        
        envMapIntensity: settings.envMapIntensity, // 1.8-5.5 = strong reflections
        
        // 💎 DEEP LIGHT PENETRATION
        attenuationDistance: settings.attenuationDistance, // 0.8-4.0
        attenuationColor: new THREE.Color(0xffffff), // Pure white
        
        color: col.w,
        reflectivity: 1.0, // Maximum reflectivity
        transparent: true,
        opacity: 1.0, // Fully opaque surface (transparency through transmission)
      };
    };
  }, [col, quality]);

  const useFallback = quality && (
    quality.gpuScore <= 2 ||
    (quality.gpuScore === 3 && quality.deviceTier >= 4)
  );

  if (!quality) {
    console.log('⏳ Waiting for quality detection...');
    return null;
  }

  const n = nodes;

  const maxSmallDiamonds = quality.gpuScore >= 4 ? Infinity : 
                           quality.gpuScore >= 3 ? 20 :
                           quality.gpuScore >= 2 ? 10 : 5;
  let smallDiamondCount = 0;

  return (
    <group ref={gRef} {...props} dispose={null}>
      {Object.entries(n).map(([name, node]) => {
        if (!node.geometry) return null;

        const isDiamond = name.toLowerCase().includes("diamond");
        const isPearl = name.toLowerCase().includes("pearl");
        const diamondSize = isDiamond ? getDiamondSize(name) : null;

        if (isDiamond && diamondSize === 'small') {
          if (smallDiamondCount >= maxSmallDiamonds) {
            return null;
          }
          smallDiamondCount++;
        }

        let material = sharedMaterials.mtMat;
        if (isPearl) material = sharedMaterials.plMat;
        if (isDiamond && useFallback) material = sharedMaterials.diamondMatSimple;

        return (
          <group key={name}>
            {isDiamond && !useFallback ? (
              <TransmissionMesh
                key={`${name}-${quality.selectedQuality.name}`}
                geometry={node.geometry}
                position={node.position}
                rotation={node.rotation}
                scale={node.scale}
                transmissionProps={getTransmissionProps(name)}
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