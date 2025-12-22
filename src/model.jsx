import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Model({ currentSection, sectionProgress, ...props }) {
  const groupRef = useRef();
  const { nodes } = useGLTF("/ring.glb");
  const [scaleFactor, setScaleFactor] = useState(1);
  const [positionFactor, setPositionFactor] = useState(1);

  useEffect(() => {
    const updateScaleFactor = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScaleFactor(0.6); // Mobile
        setPositionFactor(0.5); // Reduce position offsets for mobile
      } else if (width < 1024) {
        setScaleFactor(0.8); // Tablet
        setPositionFactor(0.7); // Reduce position offsets for tablet
      } else {
        setScaleFactor(1); // Desktop
        setPositionFactor(1); // Full position offsets for desktop
      }
    };

    updateScaleFactor();
    window.addEventListener('resize', updateScaleFactor);
    return () => window.removeEventListener('resize', updateScaleFactor);
  }, []);

  const keyframes = useMemo(
    () => [
      { position: [0, 0, 0], rotation: [0, 0, 0], scale: 2 * scaleFactor },
      { position: [0, 0.8, 0], rotation: [Math.PI / 2, 0, 0], scale: 3.2 * scaleFactor },
      { position: [-1 * positionFactor, 0, 0], rotation: [Math.PI / 2.5, 0, Math.PI / 5], scale: 3.2 * scaleFactor },
      { position: [-3 * positionFactor, 0, 0], rotation: [0, -Math.PI / 2.4, -Math.PI / 5], scale: 2.6 * scaleFactor },
      { position: [1.5 * positionFactor, 0, 0], rotation: [Math.PI / 2.5, Math.PI, Math.PI / 5], scale: 3.2 * scaleFactor },
      { position: [3 * positionFactor, 0, 0], rotation: [0, -Math.PI / 1.8, -Math.PI / 5], scale: 2.6 * scaleFactor },
      { position: [0, 1.8, 0], rotation: [Math.PI / 6, Math.PI / 4, 0], scale: 4.5 * scaleFactor },
      { position: [-2 * positionFactor, -0.5, 0], rotation: [Math.PI / 3, -Math.PI / 3, Math.PI / 6], scale: 3.8 * scaleFactor },
      { position: [0, 0, 0], rotation: [Math.PI / 4, Math.PI * 1.5, 0], scale: 2.8 * scaleFactor },
      { position: [0, 0.3, 0], rotation: [Math.PI / 8, Math.PI / 3, -Math.PI / 12], scale: 2.5 * scaleFactor },
    ],
    [scaleFactor, positionFactor]
  );

  const targetPos = useRef(new THREE.Vector3());
  const targetRot = useRef(new THREE.Euler());
  const targetScale = useRef(1);

  useFrame(() => {
    if (
      groupRef.current &&
      keyframes[currentSection] &&
      keyframes[currentSection + 1]
    ) {
      const current = keyframes[currentSection];
      const next = keyframes[currentSection + 1];

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const t = easeInOutCubic(sectionProgress);

      targetPos.current.set(
        THREE.MathUtils.lerp(current.position[0], next.position[0], t),
        THREE.MathUtils.lerp(current.position[1], next.position[1], t),
        THREE.MathUtils.lerp(current.position[2], next.position[2], t)
      );

      targetRot.current.set(
        THREE.MathUtils.lerp(current.rotation[0], next.rotation[0], t),
        THREE.MathUtils.lerp(current.rotation[1], next.rotation[1], t),
        THREE.MathUtils.lerp(current.rotation[2], next.rotation[2], t)
      );

      targetScale.current = THREE.MathUtils.lerp(current.scale, next.scale, t);

      groupRef.current.position.lerp(targetPos.current, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.current.x, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.current.y, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.current.z, 0.05);

      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, 0.05);
      groupRef.current.scale.setScalar(newScale);
    } else if (groupRef.current && keyframes[currentSection]) {
      const target = keyframes[Math.min(currentSection, keyframes.length - 1)];

      targetPos.current.set(...target.position);
      targetRot.current.set(...target.rotation);
      targetScale.current = target.scale;

      groupRef.current.position.lerp(targetPos.current, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.current.x, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.current.y, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.current.z, 0.05);

      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, 0.05);
      groupRef.current.scale.setScalar(newScale);
    }
  });

  const mainDiamondMaterial = useMemo(
    () => ({
      transmission: 1,
      thickness: 0.4,
      roughness: 0,
      metalness: 0,
      ior: 2.42,
      chromaticAberration: 0.06,
      envMapIntensity: 2.5,
      clearcoat: 1,
      clearcoatRoughness: 0,
      attenuationDistance: 0.15,
      attenuationColor: new THREE.Color("#ffffff"),
      color: "#ffffff",
    }),
    []
  );

  const sideDiamondMaterial = useMemo(
    () => ({
      transmission: 0.7,
      thickness: 0.25,
      roughness: 0,
      metalness: 0,
      ior: 2.42,
      chromaticAberration: 0.05,
      envMapIntensity: 2.8,
      clearcoat: 1,
      clearcoatRoughness: 0,
      attenuationDistance: 0.12,
      attenuationColor: new THREE.Color("#4169E1"),
      color: "#026d12",
    }),
    []
  );

  const sideDiamond1Material = useMemo(
    () => ({
      transmission: 0.7,
      thickness: 0.25,
      roughness: 0,
      metalness: 0,
      ior: 2.42,
      chromaticAberration: 0.05,
      envMapIntensity: 2.8,
      clearcoat: 1,
      clearcoatRoughness: 0,
      attenuationDistance: 0.12,
      attenuationColor: new THREE.Color("#4169E1"),
      color: "#520069",
    }),
    []
  );

  const metalMaterial = useMemo(
    () => ({
      color: "#FFD700",
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.5,
    }),
    []
  );

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.RingBody.geometry}>
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.MainDiamond.geometry} position={[0, 1.146, 0]} scale={[0.356, 0.394, 0.356]}>
        <MeshTransmissionMaterial {...mainDiamondMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Crown5.geometry} position={[0, 1.151, 0]} scale={0.376}>
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Side6Diamonds.geometry} position={[-0.812, 0.645, -0.003]} rotation={[0.068, -0.202, 0.446]} scale={[0.037, 0.041, 0.037]}>
        <MeshTransmissionMaterial {...sideDiamond1Material} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Side5Diamonds.geometry} position={[0.794, 0.659, 0]} rotation={[2.887, 0.273, -2.126]} scale={[0.037, 0.041, 0.037]}>
        <MeshTransmissionMaterial {...sideDiamond1Material} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Pearls.geometry} position={[-0.611, 0.749, 0.085]} rotation={[Math.PI, 0, Math.PI]} scale={0.025}>
        <meshStandardMaterial color="#FFF5E1" roughness={0.3} metalness={0.1} envMapIntensity={0.8} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Side4Diamonds.geometry} position={[0.071, 1.139, 0.401]} scale={[0.03, 0.034, 0.03]}>
        <MeshTransmissionMaterial {...sideDiamondMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Crown4.geometry} position={[0.071, 1.14, 0.401]} scale={0.032}>
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Crown3.geometry} position={[0, 1.14, -0.407]} rotation={[Math.PI, 0, Math.PI]} scale={0.037}>
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Side3Diamonds.geometry} position={[0.07, 1.139, -0.4]} rotation={[Math.PI, 0, Math.PI]} scale={[0.03, 0.034, 0.03]}>
        <MeshTransmissionMaterial {...sideDiamondMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Crown2.geometry} position={[-0.397, 1.156, -0.007]} rotation={[0, -1.571, 0]} scale={0.028}>
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Side2Diamonds.geometry} position={[-0.372, 1.156, -0.099]} rotation={[0, -1.571, 0]} scale={[0.02, 0.022, 0.02]}>
        <MeshTransmissionMaterial {...sideDiamondMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Crown1.geometry} position={[0.391, 1.156, -0.01]} rotation={[0, Math.PI / 2, 0]} scale={0.028}>
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Side1Diamonds.geometry} position={[0.372, 1.156, -0.1]} rotation={[0, Math.PI / 2, 0]} scale={[0.02, 0.022, 0.02]}>
        <MeshTransmissionMaterial {...sideDiamondMaterial} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/ring.glb");