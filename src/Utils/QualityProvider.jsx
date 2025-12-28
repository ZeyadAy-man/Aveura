import { useDeviceType } from "../Utils/DeviceTypeDetector";
import { useGPUDetection } from "../Utils/GPUDetector";
import { useState, useEffect } from "react";

export const useQualityProvider = () => {
  const deviceType = useDeviceType();
  const gpuInfo = useGPUDetection();
  const [quality, setQuality] = useState(null);

  console.log('🖥️ Device Type:', deviceType, 'gpu info: ', gpuInfo);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!deviceType || !gpuInfo) return;

      // ⚡⚡⚡ MAXIMUM GPU OPTIMIZATION
      // - Resolution: 32-128px (down from 384px)
      // - Samples: All 1-2 (down from 8)
      // - Reduced distortion & effects slightly
      const qualityPresets = {
        1: [ // Ultra Performance - Desktop PCs
          { 
            level: 1, name: 'Low', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.97,
            thickness: 0.8,
            ior: 2.25,
            roughness: 0,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.3,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 64, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.98,
            thickness: 0.9,
            ior: 2.3,
            roughness: 0,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 3, name: 'High', 
            mainRes: 96, smallRes: 48,
            mainSamples: 2, smallSamples: 1,
            transmission: 0.99,
            thickness: 1.0,
            ior: 2.35,
            roughness: 0,
            chromaticAberration: 0.05,
            distortion: 0.3,
            distortionScale: 0.5,
            envMapIntensity: 3.5,
            attenuationDistance: 2.0
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 128, smallRes: 64,
            mainSamples: 2, smallSamples: 1,
            transmission: 1.0,
            thickness: 1.2,
            ior: 2.4,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          },
          { 
            level: 5, name: 'Extreme', 
            mainRes: 128, smallRes: 64,
            mainSamples: 2, smallSamples: 1,
            transmission: 1.0,
            thickness: 1.4,
            ior: 2.417,
            roughness: 0,
            chromaticAberration: 0.07,
            distortion: 0.4,
            distortionScale: 0.7,
            envMapIntensity: 4.5,
            attenuationDistance: 3.0
          }
        ],
        2: [ // High Performance - Gaming laptops
          { 
            level: 1, name: 'Low', 
            mainRes: 32, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.95,
            thickness: 0.7,
            ior: 2.2,
            roughness: 0.005,
            chromaticAberration: 0.025,
            distortion: 0.15,
            distortionScale: 0.25,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.97,
            thickness: 0.8,
            ior: 2.25,
            roughness: 0,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.3,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 3, name: 'High', 
            mainRes: 64, smallRes: 48,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.98,
            thickness: 0.9,
            ior: 2.3,
            roughness: 0,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 96, smallRes: 48,
            mainSamples: 2, smallSamples: 1,
            transmission: 0.99,
            thickness: 1.0,
            ior: 2.35,
            roughness: 0,
            chromaticAberration: 0.05,
            distortion: 0.3,
            distortionScale: 0.5,
            envMapIntensity: 3.5,
            attenuationDistance: 2.0
          },
          { 
            level: 5, name: 'Extreme', 
            mainRes: 128, smallRes: 64,
            mainSamples: 2, smallSamples: 1,
            transmission: 1.0,
            thickness: 1.2,
            ior: 2.4,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          }
        ],
        3: [ // Moderate Performance - Laptops, Mini PCs
          { 
            level: 1, name: 'Low', 
            mainRes: 32, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.93,
            thickness: 0.7,
            ior: 2.15,
            roughness: 0.01,
            chromaticAberration: 0.02,
            distortion: 0.12,
            distortionScale: 0.2,
            envMapIntensity: 1.8,
            attenuationDistance: 0.8
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.95,
            thickness: 0.7,
            ior: 2.2,
            roughness: 0.005,
            chromaticAberration: 0.025,
            distortion: 0.15,
            distortionScale: 0.25,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 3, name: 'High', 
            mainRes: 64, smallRes: 48,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.97,
            thickness: 0.8,
            ior: 2.25,
            roughness: 0,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.3,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 96, smallRes: 48,
            mainSamples: 2, smallSamples: 1,
            transmission: 0.98,
            thickness: 0.9,
            ior: 2.3,
            roughness: 0,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 5, name: 'Max', 
            mainRes: 128, smallRes: 64,
            mainSamples: 2, smallSamples: 1,
            transmission: 0.99,
            thickness: 1.0,
            ior: 2.35,
            roughness: 0,
            chromaticAberration: 0.05,
            distortion: 0.3,
            distortionScale: 0.5,
            envMapIntensity: 3.5,
            attenuationDistance: 2.0
          }
        ],
        4: [ // Basic Performance - Office devices
          { 
            level: 1, name: 'Low', 
            mainRes: 32, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.90,
            thickness: 0.6,
            ior: 2.1,
            roughness: 0.015,
            chromaticAberration: 0.015,
            distortion: 0.1,
            distortionScale: 0.15,
            envMapIntensity: 1.5,
            attenuationDistance: 0.7
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 32, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.93,
            thickness: 0.7,
            ior: 2.15,
            roughness: 0.01,
            chromaticAberration: 0.02,
            distortion: 0.12,
            distortionScale: 0.2,
            envMapIntensity: 1.8,
            attenuationDistance: 0.8
          },
          { 
            level: 3, name: 'High', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.95,
            thickness: 0.7,
            ior: 2.2,
            roughness: 0.005,
            chromaticAberration: 0.025,
            distortion: 0.15,
            distortionScale: 0.25,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 64, smallRes: 48,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.97,
            thickness: 0.8,
            ior: 2.25,
            roughness: 0,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.3,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 5, name: 'Max', 
            mainRes: 96, smallRes: 48,
            mainSamples: 2, smallSamples: 1,
            transmission: 0.98,
            thickness: 0.9,
            ior: 2.3,
            roughness: 0,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          }
        ],
        5: [ // Mobile / Fixed - Phones, tablets
          { 
            level: 1, name: 'Low', 
            mainRes: 64, smallRes: 48,  // Increased from 32
            mainSamples: 1, smallSamples: 1,
            transmission: 0.94,  // Increased transparency
            thickness: 0.8,  // Increased from 0.5
            ior: 2.2,  // Better refraction
            roughness: 0.01,  // Smoother
            chromaticAberration: 0.025,  // More sparkle
            distortion: 0.15,  // More refraction
            distortionScale: 0.25,
            envMapIntensity: 2.0,  // Better reflections
            attenuationDistance: 1.0
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 96, smallRes: 64,  // Increased from 32
            mainSamples: 2, smallSamples: 1,  // More samples
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.005,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.3,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 3, name: 'High', 
            mainRes: 128, smallRes: 80,  // Increased from 48
            mainSamples: 2, smallSamples: 1,
            transmission: 0.98,
            thickness: 1.0,
            ior: 2.3,
            roughness: 0,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 160, smallRes: 96,  // Increased from 64
            mainSamples: 2, smallSamples: 1,
            transmission: 0.99,
            thickness: 1.1,
            ior: 2.35,
            roughness: 0,
            chromaticAberration: 0.05,
            distortion: 0.3,
            distortionScale: 0.5,
            envMapIntensity: 3.5,
            attenuationDistance: 2.0
          },
          { 
            level: 5, name: 'Max', 
            mainRes: 192, smallRes: 128,  // Increased from 96
            mainSamples: 3, smallSamples: 2,  // More samples
            transmission: 1.0,
            thickness: 1.2,
            ior: 2.4,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          }
        ]
      };

      const availableQualities = qualityPresets[deviceType.tier];
      const selectedQuality = availableQualities[gpuInfo.score - 1];

      setQuality({
        deviceTier: deviceType.tier,
        deviceType: deviceType.name,
        gpuScore: gpuInfo.score,
        gpuType: gpuInfo.type,
        availableQualities,
        selectedQuality,
        recommendation: selectedQuality
      });

      console.log('🎯 Quality Provider (MAXIMUM GPU Optimization):', {
        device: `Tier ${deviceType.tier} - ${deviceType.name}`,
        gpu: `Score ${gpuInfo.score} - ${gpuInfo.type}`,
        quality: selectedQuality.name,
        settings: selectedQuality
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [deviceType, gpuInfo]);

  return quality;
};