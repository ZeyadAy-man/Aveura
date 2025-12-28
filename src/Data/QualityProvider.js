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

      // MAXIMUM REALISM - Focus on transparency and light behavior
      // Real diamonds are HIGHLY transparent with strong refraction
      const qualityPresets = {
        1: [ // Ultra Performance - Desktop PCs
          { 
            level: 1, name: 'Low', 
            mainRes: 128, smallRes: 64, 
            mainSamples: 3, smallSamples: 2, 
            transmission: 1.0, // Max transparency
            thickness: 1.2,
            ior: 2.35,
            roughness: 0,
            chromaticAberration: 0.05,
            distortion: 0.3,
            distortionScale: 0.5,
            envMapIntensity: 3.5,
            attenuationDistance: 2.0
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 192, smallRes: 96, 
            mainSamples: 4, smallSamples: 2, 
            transmission: 1.0,
            thickness: 1.4,
            ior: 2.38,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          },
          { 
            level: 3, name: 'High', 
            mainRes: 256, smallRes: 128, 
            mainSamples: 5, smallSamples: 3, 
            transmission: 1.0,
            thickness: 1.6,
            ior: 2.4,
            roughness: 0,
            chromaticAberration: 0.07,
            distortion: 0.4,
            distortionScale: 0.7,
            envMapIntensity: 4.5,
            attenuationDistance: 3.0
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 320, smallRes: 160, 
            mainSamples: 6, smallSamples: 4, 
            transmission: 1.0,
            thickness: 1.8,
            ior: 2.415,
            roughness: 0,
            chromaticAberration: 0.08,
            distortion: 0.45,
            distortionScale: 0.8,
            envMapIntensity: 5.0,
            attenuationDistance: 3.5
          },
          { 
            level: 5, name: 'Extreme', 
            mainRes: 384, smallRes: 192, 
            mainSamples: 8, smallSamples: 5, 
            transmission: 1.0,
            thickness: 2.0,
            ior: 2.417, // Exact diamond
            roughness: 0,
            chromaticAberration: 0.1,
            distortion: 0.5,
            distortionScale: 1.0,
            envMapIntensity: 5.5,
            attenuationDistance: 4.0
          }
        ],
        2: [ // High Performance - Gaming laptops
          { 
            level: 1, name: 'Low', 
            mainRes: 96, smallRes: 64, 
            mainSamples: 2, smallSamples: 1, 
            transmission: 0.98,
            thickness: 1.0,
            ior: 2.3,
            roughness: 0.005,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 128, smallRes: 96, 
            mainSamples: 3, smallSamples: 2, 
            transmission: 1.0,
            thickness: 1.2,
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
            mainRes: 192, smallRes: 128, 
            mainSamples: 4, smallSamples: 3, 
            transmission: 1.0,
            thickness: 1.4,
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
            mainRes: 256, smallRes: 160, 
            mainSamples: 5, smallSamples: 3, 
            transmission: 1.0,
            thickness: 1.6,
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
            mainRes: 320, smallRes: 192, 
            mainSamples: 6, smallSamples: 4, 
            transmission: 1.0,
            thickness: 1.8,
            ior: 2.415,
            roughness: 0,
            chromaticAberration: 0.08,
            distortion: 0.45,
            distortionScale: 0.8,
            envMapIntensity: 5.0,
            attenuationDistance: 3.5
          }
        ],
        3: [ // Moderate Performance - Laptops, Mini PCs
          { 
            level: 1, name: 'Low', 
            mainRes: 96, smallRes: 64, 
            mainSamples: 2, smallSamples: 1, 
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.01,
            chromaticAberration: 0.035,
            distortion: 0.2,
            distortionScale: 0.35,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 128, smallRes: 96, 
            mainSamples: 3, smallSamples: 2, 
            transmission: 0.98,
            thickness: 1.0,
            ior: 2.3,
            roughness: 0.005,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 3, name: 'High', 
            mainRes: 192, smallRes: 128, 
            mainSamples: 4, smallSamples: 2, 
            transmission: 1.0,
            thickness: 1.2,
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
            mainRes: 256, smallRes: 160, 
            mainSamples: 5, smallSamples: 3, 
            transmission: 1.0,
            thickness: 1.4,
            ior: 2.38,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          },
          { 
            level: 5, name: 'Max', 
            mainRes: 320, smallRes: 192, 
            mainSamples: 6, smallSamples: 3, 
            transmission: 1.0,
            thickness: 1.6,
            ior: 2.4,
            roughness: 0,
            chromaticAberration: 0.07,
            distortion: 0.4,
            distortionScale: 0.7,
            envMapIntensity: 4.5,
            attenuationDistance: 3.0
          }
        ],
        4: [ // Basic Performance - Office devices
          { 
            level: 1, name: 'Low', 
            mainRes: 64, smallRes: 48, 
            mainSamples: 2, smallSamples: 1, 
            transmission: 0.94,
            thickness: 0.8,
            ior: 2.2,
            roughness: 0.015,
            chromaticAberration: 0.03,
            distortion: 0.15,
            distortionScale: 0.3,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 96, smallRes: 64, 
            mainSamples: 2, smallSamples: 1, 
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.01,
            chromaticAberration: 0.035,
            distortion: 0.2,
            distortionScale: 0.35,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 3, name: 'High', 
            mainRes: 128, smallRes: 96, 
            mainSamples: 3, smallSamples: 2, 
            transmission: 0.98,
            thickness: 1.0,
            ior: 2.3,
            roughness: 0.005,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 192, smallRes: 128, 
            mainSamples: 4, smallSamples: 2, 
            transmission: 1.0,
            thickness: 1.2,
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
            mainRes: 256, smallRes: 160, 
            mainSamples: 5, smallSamples: 3, 
            transmission: 1.0,
            thickness: 1.4,
            ior: 2.38,
            roughness: 0,
            chromaticAberration: 0.06,
            distortion: 0.35,
            distortionScale: 0.6,
            envMapIntensity: 4.0,
            attenuationDistance: 2.5
          }
        ],
        5: [ // Mobile / Fixed - Phones, tablets
          { 
            level: 1, name: 'Low', 
            mainRes: 64, smallRes: 48, 
            mainSamples: 1, smallSamples: 1, 
            transmission: 0.92,
            thickness: 0.7,
            ior: 2.15,
            roughness: 0.02,
            chromaticAberration: 0.025,
            distortion: 0.12,
            distortionScale: 0.25,
            envMapIntensity: 1.8,
            attenuationDistance: 0.8
          },
          { 
            level: 2, name: 'Medium', 
            mainRes: 96, smallRes: 64, 
            mainSamples: 2, smallSamples: 1, 
            transmission: 0.94,
            thickness: 0.8,
            ior: 2.2,
            roughness: 0.015,
            chromaticAberration: 0.03,
            distortion: 0.15,
            distortionScale: 0.3,
            envMapIntensity: 2.0,
            attenuationDistance: 1.0
          },
          { 
            level: 3, name: 'High', 
            mainRes: 128, smallRes: 96, 
            mainSamples: 3, smallSamples: 1, 
            transmission: 0.96,
            thickness: 0.9,
            ior: 2.25,
            roughness: 0.01,
            chromaticAberration: 0.035,
            distortion: 0.2,
            distortionScale: 0.35,
            envMapIntensity: 2.5,
            attenuationDistance: 1.2
          },
          { 
            level: 4, name: 'Ultra', 
            mainRes: 192, smallRes: 128, 
            mainSamples: 3, smallSamples: 2, 
            transmission: 0.98,
            thickness: 1.0,
            ior: 2.3,
            roughness: 0.005,
            chromaticAberration: 0.04,
            distortion: 0.25,
            distortionScale: 0.4,
            envMapIntensity: 3.0,
            attenuationDistance: 1.5
          },
          { 
            level: 5, name: 'Max', 
            mainRes: 256, smallRes: 160, 
            mainSamples: 4, smallSamples: 2, 
            transmission: 1.0,
            thickness: 1.2,
            ior: 2.35,
            roughness: 0,
            chromaticAberration: 0.05,
            distortion: 0.3,
            distortionScale: 0.5,
            envMapIntensity: 3.5,
            attenuationDistance: 2.0
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

      console.log('🎯 Quality Provider:', {
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