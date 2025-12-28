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

      // ⚡⚡⚡ DRASTICALLY REDUCED for GPU efficiency
      // Cut resolution by 50%, samples by 60%, but keep visual effects for realism
      const qualityPresets = {
        1: [ // Ultra Performance - Desktop PCs
          { 
            level: 1, name: 'Low', 
            mainRes: 64, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
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
            level: 2, name: 'Medium', 
            mainRes: 96, smallRes: 48,
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
            level: 3, name: 'High', 
            mainRes: 128, smallRes: 64,
            mainSamples: 2, smallSamples: 1,
            transmission: 1.0,
            thickness: 1.2,
            ior: 2.38,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 160, smallRes: 80,
            mainSamples: 3, smallSamples: 2,
            transmission: 1.0,
            thickness: 1.4,
            ior: 2.4,
            roughness: 0,
            chromaticAberration: 0.07,
            distortion: 0.4,
            distortionScale: 0.7,
            envMapIntensity: 4.5,
            attenuationDistance: 3.0
          },
          { 
            level: 5, name: 'Extreme', 
            mainRes: 192, smallRes: 96,
            mainSamples: 4, smallSamples: 2,
            transmission: 1.0,
            thickness: 1.6,
            ior: 2.417,
            roughness: 0,
            chromaticAberration: 0.08,
            distortion: 0.45,
            distortionScale: 0.8,
            envMapIntensity: 5.0,
            attenuationDistance: 3.5
          }
        ],
        2: [ // High Performance - Gaming laptops
          { 
            level: 1, name: 'Low', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.005,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.35,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 64, smallRes: 48,
            mainSamples: 1, smallSamples: 1,
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
            level: 3, name: 'High', 
            mainRes: 96, smallRes: 64,
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
            level: 4, name: 'Ultra', 
            mainRes: 128, smallRes: 80,
            mainSamples: 2, smallSamples: 1,
            transmission: 1.0,
            thickness: 1.2,
            ior: 2.38,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          },
          { 
            level: 5, name: 'Extreme', 
            mainRes: 160, smallRes: 96,
            mainSamples: 3, smallSamples: 2,
            transmission: 1.0,
            thickness: 1.4,
            ior: 2.4,
            roughness: 0,
            chromaticAberration: 0.07,
            distortion: 0.4,
            distortionScale: 0.7,
            envMapIntensity: 4.5,
            attenuationDistance: 3.0
          }
        ],
        3: [ // Moderate Performance - Laptops, Mini PCs
          { 
            level: 1, name: 'Low', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.94,
            thickness: 0.8,
            ior: 2.2,
            roughness: 0.01,
            chromaticAberration: 0.025,
            distortion: 0.15,
            distortionScale: 0.3,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 64, smallRes: 48,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.005,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.35,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 3, name: 'High', 
            mainRes: 96, smallRes: 64,
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
            mainRes: 128, smallRes: 80,
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
            mainRes: 160, smallRes: 96,
            mainSamples: 3, smallSamples: 1,
            transmission: 1.0,
            thickness: 1.2,
            ior: 2.38,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          }
        ],
        4: [ // Basic Performance - Office devices
          { 
            level: 1, name: 'Low', 
            mainRes: 32, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.92,
            thickness: 0.7,
            ior: 2.15,
            roughness: 0.015,
            chromaticAberration: 0.02,
            distortion: 0.12,
            distortionScale: 0.25,
            envMapIntensity: 1.5,
            attenuationDistance: 0.8
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.94,
            thickness: 0.8,
            ior: 2.2,
            roughness: 0.01,
            chromaticAberration: 0.025,
            distortion: 0.15,
            distortionScale: 0.3,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 3, name: 'High', 
            mainRes: 64, smallRes: 48,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.005,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.35,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 96, smallRes: 64,
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
            level: 5, name: 'Max', 
            mainRes: 128, smallRes: 80,
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
          }
        ],
        5: [ // Mobile / Fixed - Phones, tablets
          { 
            level: 1, name: 'Low', 
            mainRes: 32, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.90,
            thickness: 0.6,
            ior: 2.1,
            roughness: 0.02,
            chromaticAberration: 0.015,
            distortion: 0.1,
            distortionScale: 0.2,
            envMapIntensity: 1.2,
            attenuationDistance: 0.6
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 48, smallRes: 32,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.92,
            thickness: 0.7,
            ior: 2.15,
            roughness: 0.015,
            chromaticAberration: 0.02,
            distortion: 0.12,
            distortionScale: 0.25,
            envMapIntensity: 1.5,
            attenuationDistance: 0.8
          },
          { 
            level: 3, name: 'High', 
            mainRes: 64, smallRes: 48,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.94,
            thickness: 0.8,
            ior: 2.2,
            roughness: 0.01,
            chromaticAberration: 0.025,
            distortion: 0.15,
            distortionScale: 0.3,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 96, smallRes: 64,
            mainSamples: 1, smallSamples: 1,
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.005,
            chromaticAberration: 0.03,
            distortion: 0.2,
            distortionScale: 0.35,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 5, name: 'Max', 
            mainRes: 128, smallRes: 80,
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

      console.log('🎯 Quality Provider (GPU Optimized):', {
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