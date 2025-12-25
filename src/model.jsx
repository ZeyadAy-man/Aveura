import { useEffect, useRef, useMemo, memo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// GPU tier detection
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

const MeshComponent = memo(({ geometry, material, ...props }) => (
  <mesh geometry={geometry} material={material} {...props} />
));

const TransmissionMesh = memo(({ geometry, transmissionProps, ...props }) => (
  <mesh geometry={geometry} {...props}>
    <MeshTransmissionMaterial {...transmissionProps} />
  </mesh>
));

function Model({ currentSection, sectionProgress, ...props }) {
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

    // Always use eased interpolation when we have a next keyframe
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
      // Last section - stay at current keyframe
      t.pos.x = c[0][0];
      t.pos.y = c[0][1];
      t.pos.z = c[0][2];
      t.rot.x = c[1][0];
      t.rot.y = c[1][1];
      t.rot.z = c[1][2];
      t.scale = c[2];
    }

    prevSection.current = currentSection;

    // Smooth lerp with higher factor for responsive feel
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
    w: new THREE.Color(0xffffff), b: new THREE.Color(0x4169e1),
    g: new THREE.Color(0x026d12), p: new THREE.Color(0x520069),
    gd: new THREE.Color(0xffd700), pr: new THREE.Color(0xfff5e1)
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
      metalness: 0.1,
      roughness: 0,
      transmission: 0.95,
      thickness: 0.5,
      ior: 2.4,
      reflectivity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0,
      transparent: true,
      envMapIntensity: 2
    });

    const tintedGlassGreen = new THREE.MeshPhysicalMaterial({
      color: col.g,
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.8,
      thickness: 0.3,
      ior: 2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      transparent: true,
      envMapIntensity: 1.5
    });

    const tintedGlassPurple = new THREE.MeshPhysicalMaterial({
      color: col.p,
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.8,
      thickness: 0.3,
      ior: 2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      transparent: true,
      envMapIntensity: 1.5
    });

    return { mtMat, plMat, diamondMatSimple, tintedGlassGreen, tintedGlassPurple };
  }, [col]);

  useEffect(() => {
    return () => {
      sharedMaterials.mtMat.dispose();
      sharedMaterials.plMat.dispose();
      if (sharedMaterials.diamondMatSimple) sharedMaterials.diamondMatSimple.dispose();
      if (sharedMaterials.tintedGlassGreen) sharedMaterials.tintedGlassGreen.dispose();
      if (sharedMaterials.tintedGlassPurple) sharedMaterials.tintedGlassPurple.dispose();
    };
  }, [sharedMaterials]);

  const transmissionProps = useMemo(() => {
    const qualitySettings = {
      high: {
        mainSamples: 4,
        mainResolution: 512,
        smallSamples: 2,
        smallResolution: 128,
        blur: 0.15
      },
      medium: {
        mainSamples: 3,
        mainResolution: 280,
        smallSamples: 1,
        smallResolution: 32,
        blur: 0.25
      },
      low: {
        mainSamples: 1,
        mainResolution: 64,
        smallSamples: 1,
        smallResolution: 32,
        blur: 0.4
      }
    };

    const settings = qualitySettings[gpuTier];

    return {
      md: {
        transmission: 1,
        thickness: 0.3,
        roughness: gpuTier === 'low' ? 0.1 : 0.05,
        metalness: 0,
        ior: 2.2,
        chromaticAberration: gpuTier === 'high' ? 0.02 : 0.01,
        envMapIntensity: gpuTier === 'low' ? 1.2 : 2,
        clearcoat: gpuTier === 'low' ? 0 : gpuTier === 'medium' ? 0.5 : 0.8,
        clearcoatRoughness: 0.2,
        attenuationDistance: 0.2,
        attenuationColor: col.w,
        color: col.w,
        samples: settings.mainSamples,
        resolution: settings.mainResolution,
        anisotropicBlur: settings.blur,
        temporalDistortion: 0,
        distortion: 0,
        distortionScale: 0,
        backside: false,
        backsideThickness: 0
      },
      sd: {
        transmission: 0.6,
        thickness: 0.15,
        roughness: 0.15,
        metalness: 0,
        ior: 2,
        chromaticAberration: 0.01,
        envMapIntensity: gpuTier === 'low' ? 1 : 1.5,
        clearcoat: 0,
        clearcoatRoughness: 0.2,
        attenuationDistance: 0.15,
        attenuationColor: col.b,
        color: col.g,
        samples: settings.smallSamples,
        resolution: settings.smallResolution,
        anisotropicBlur: settings.blur * 2,
        temporalDistortion: 0,
        distortion: 0,
        distortionScale: 0,
        backside: false,
        backsideThickness: 0
      },
      sd1: {
        transmission: 0.6,
        thickness: 0.15,
        roughness: 0.15,
        metalness: 0,
        ior: 2,
        chromaticAberration: 0.01,
        envMapIntensity: gpuTier === 'low' ? 1 : 1.5,
        clearcoat: 0,
        clearcoatRoughness: 0.2,
        attenuationDistance: 0.15,
        attenuationColor: col.b,
        color: col.p,
        samples: settings.smallSamples,
        resolution: settings.smallResolution,
        anisotropicBlur: settings.blur * 2,
        temporalDistortion: 0,
        distortion: 0,
        distortionScale: 0,
        backside: false,
        backsideThickness: 0
      }
    };
  }, [col, gpuTier]);

  const n = nodes;
  const useFallbackForSmallDiamonds = gpuTier === 'low' || gpuTier === 'medium';
  const useFallbackForMainDiamond = gpuTier === 'low';

  return (
    <group ref={gRef} {...props} dispose={null}>
      {useFallbackForMainDiamond ? (
        <MeshComponent 
          geometry={n.MainDiamond.geometry} 
          position={[0,1.146,0]} 
          scale={[0.356,0.394,0.356]}
          material={sharedMaterials.diamondMatSimple}
          castShadow={false}
          receiveShadow={false}
        />
      ) : (
        <TransmissionMesh 
          geometry={n.MainDiamond.geometry} 
          position={[0,1.146,0]} 
          scale={[0.356,0.394,0.356]}
          transmissionProps={transmissionProps.md}
          castShadow={false}
          receiveShadow={false}
        />
      )}
      
      <MeshComponent 
        geometry={n.Crown5.geometry} 
        position={[0,1.151,0]} 
        scale={0.376} 
        material={sharedMaterials.mtMat}
        castShadow={false}
        receiveShadow={false}
      />
      
      {useFallbackForSmallDiamonds ? (
        <MeshComponent 
          geometry={n.Side5Diamonds.geometry} 
          position={[0.794,0.659,0]} 
          rotation={[2.887,0.273,-2.126]} 
          scale={[0.037,0.041,0.037]}
          material={sharedMaterials.tintedGlassPurple}
          castShadow={false}
          receiveShadow={false}
        />
      ) : (
        <TransmissionMesh 
          geometry={n.Side5Diamonds.geometry} 
          position={[0.794,0.659,0]} 
          rotation={[2.887,0.273,-2.126]} 
          scale={[0.037,0.041,0.037]}
          transmissionProps={transmissionProps.sd1}
          castShadow={false}
          receiveShadow={false}
        />
      )}
      
      <MeshComponent 
        geometry={n.Pearls.geometry} 
        position={[-0.611,0.749,0.085]} 
        rotation={[3.14,0,3.14]} 
        scale={0.025} 
        material={sharedMaterials.plMat}
        castShadow={false}
        receiveShadow={false}
      />
      
      {useFallbackForSmallDiamonds ? (
        <MeshComponent 
          geometry={n.Side3Diamonds.geometry} 
          position={[0.07,1.139,-0.4]} 
          rotation={[3.14,0,3.14]} 
          scale={[0.03,0.034,0.03]}
          material={sharedMaterials.tintedGlassGreen}
          castShadow={false}
          receiveShadow={false}
        />
      ) : (
        <TransmissionMesh 
          geometry={n.Side3Diamonds.geometry} 
          position={[0.07,1.139,-0.4]} 
          rotation={[3.14,0,3.14]} 
          scale={[0.03,0.034,0.03]}
          transmissionProps={transmissionProps.sd}
          castShadow={false}
          receiveShadow={false}
        />
      )}
      
      <MeshComponent 
        geometry={n.Crown1.geometry} 
        position={[0.391,1.156,-0.01]} 
        rotation={[0,1.57,0]} 
        scale={0.028} 
        material={sharedMaterials.mtMat}
        castShadow={false}
        receiveShadow={false}
      />
    </group>
  );
}

export default memo(Model);

useGLTF.preload("/ring.glb");