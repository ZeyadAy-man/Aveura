import { useEffect, useRef, useMemo, memo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Memoized mesh component to prevent unnecessary re-renders
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
  const tgt = useRef({ pos: new THREE.Vector3(), rot: new THREE.Euler(), scale: 1 });
  const prevSection = useRef(currentSection);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const newScale = w < 640 ? { s: 0.5, p: 0.35 } : w < 1024 ? { s: 0.6, p: 0.5 } : { s: 1, p: 1 };
      setScale(newScale);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const kf = useMemo(() => {
    const { s, p } = scale;
    return [
      [[0,0,0],[0,0,0],2*s],[[0,0.8*s,0],[1.57,0,0],3.2*s],
      [[-p,0,0],[1.26,0,0.63],3.2*s],[[-3*p,0,0],[0,-1.31,-0.63],2.6*s],
      [[1.5*p,0,0],[1.26,3.14,0.63],3.2*s],[[3*p,0,0],[0,-1.75,-0.63],2.6*s],
      [[0,1.8*s,0],[0.52,0.79,0],4.5*s],[[-2*p,-0.5*s,0],[1.05,-1.05,0.52],3.8*s],
      [[0,0,0],[0.79,4.71,0],2.8*s],[[0,-0.2*s,0],[0.39,1.05,-0.26],2.5*s]
    ];
  }, [scale]);

  useFrame(() => {
    const g = gRef.current;
    if (!g) return;
    
    const section = Math.min(currentSection, kf.length - 1);
    const c = kf[section];
    const n = kf[section + 1];
    const t = tgt.current;

    // Only recalculate if section changed or animating
    if (n && prevSection.current === currentSection) {
      const e = ease(sectionProgress);
      t.pos.x = c[0][0] + (n[0][0] - c[0][0]) * e;
      t.pos.y = c[0][1] + (n[0][1] - c[0][1]) * e;
      t.pos.z = c[0][2] + (n[0][2] - c[0][2]) * e;
      
      t.rot.x = c[1][0] + (n[1][0] - c[1][0]) * e;
      t.rot.y = c[1][1] + (n[1][1] - c[1][1]) * e;
      t.rot.z = c[1][2] + (n[1][2] - c[1][2]) * e;
      
      t.scale = c[2] + (n[2] - c[2]) * e;
    } else {
      t.pos.x = c[0][0]; t.pos.y = c[0][1]; t.pos.z = c[0][2];
      t.rot.x = c[1][0]; t.rot.y = c[1][1]; t.rot.z = c[1][2];
      t.scale = c[2];
    }

    prevSection.current = currentSection;

    // Smooth interpolation - optimized
    const lerpFactor = 0.05;
    g.position.x += (t.pos.x - g.position.x) * lerpFactor;
    g.position.y += (t.pos.y - g.position.y) * lerpFactor;
    g.position.z += (t.pos.z - g.position.z) * lerpFactor;
    
    g.rotation.x += (t.rot.x - g.rotation.x) * lerpFactor;
    g.rotation.y += (t.rot.y - g.rotation.y) * lerpFactor;
    g.rotation.z += (t.rot.z - g.rotation.z) * lerpFactor;
    
    const scaleVal = g.scale.x + (t.scale - g.scale.x) * lerpFactor;
    g.scale.set(scaleVal, scaleVal, scaleVal);
  });

  // Memoized colors
  const col = useMemo(() => ({
    w: new THREE.Color(0xffffff), b: new THREE.Color(0x4169e1),
    g: new THREE.Color(0x026d12), p: new THREE.Color(0x520069),
    gd: new THREE.Color(0xffd700), pr: new THREE.Color(0xfff5e1)
  }), []);

  // Shared materials with disposal
  const sharedMaterials = useMemo(() => {
    const mtMat = new THREE.MeshStandardMaterial({
      color: col.gd,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.5
    });

    const plMat = new THREE.MeshStandardMaterial({
      color: col.pr,
      roughness: 0.3,
      metalness: 0.1,
      envMapIntensity: 0.8
    });

    return { mtMat, plMat };
  }, [col]);

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      sharedMaterials.mtMat.dispose();
      sharedMaterials.plMat.dispose();
    };
  }, [sharedMaterials]);

  // Ultra-aggressive transmission optimization
  const transmissionProps = useMemo(() => ({
    md: {
      transmission: 1,
      thickness: 0.35,
      roughness: 0,
      metalness: 0,
      ior: 2.3,
      chromaticAberration: 0.02,
      envMapIntensity: 2.2,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      attenuationDistance: 0.12,
      attenuationColor: col.w,
      color: col.w,
      samples: 2,
      resolution: 256,
      anisotropicBlur: 0.15,
      temporalDistortion: 0,
      distortion: 0,
      distortionScale: 0
    },
    sd: {
      transmission: 0.65,
      thickness: 0.15,
      roughness: 0.08,
      metalness: 0,
      ior: 2.0,
      chromaticAberration: 0.01,
      envMapIntensity: 2.0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      attenuationDistance: 0.08,
      attenuationColor: col.b,
      color: col.g,
      samples: 1,
      resolution: 64,
      anisotropicBlur: 0.25,
      temporalDistortion: 0,
      distortion: 0,
      distortionScale: 0
    },
    sd1: {
      transmission: 0.65,
      thickness: 0.15,
      roughness: 0.08,
      metalness: 0,
      ior: 2.0,
      chromaticAberration: 0.01,
      envMapIntensity: 2.0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      attenuationDistance: 0.08,
      attenuationColor: col.b,
      color: col.p,
      samples: 1,
      resolution: 64,
      anisotropicBlur: 0.25,
      temporalDistortion: 0,
      distortion: 0,
      distortionScale: 0
    }
  }), [col]);

  const n = nodes;

  return (
    <group ref={gRef} {...props} dispose={null}>
      <TransmissionMesh 
        geometry={n.MainDiamond.geometry} 
        position={[0,1.146,0]} 
        scale={[0.356,0.394,0.356]}
        transmissionProps={transmissionProps.md}
        castShadow={false}
        receiveShadow={false}
      />
      
      <MeshComponent 
        geometry={n.Crown5.geometry} 
        position={[0,1.151,0]} 
        scale={0.376} 
        material={sharedMaterials.mtMat}
        castShadow={false}
        receiveShadow={false}
      />
      
      <TransmissionMesh 
        geometry={n.Side5Diamonds.geometry} 
        position={[0.794,0.659,0]} 
        rotation={[2.887,0.273,-2.126]} 
        scale={[0.037,0.041,0.037]}
        transmissionProps={transmissionProps.sd1}
        castShadow={false}
        receiveShadow={false}
      />
      
      <MeshComponent 
        geometry={n.Pearls.geometry} 
        position={[-0.611,0.749,0.085]} 
        rotation={[3.14,0,3.14]} 
        scale={0.025} 
        material={sharedMaterials.plMat}
        castShadow={false}
        receiveShadow={false}
      />
            
      <TransmissionMesh 
        geometry={n.Side3Diamonds.geometry} 
        position={[0.07,1.139,-0.4]} 
        rotation={[3.14,0,3.14]} 
        scale={[0.03,0.034,0.03]}
        transmissionProps={transmissionProps.sd}
        castShadow={false}
        receiveShadow={false}
      />
      
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