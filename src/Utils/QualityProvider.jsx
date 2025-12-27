export const getQualitySettings = (tier, deviceType) => {
  const qualitySettings = {
    mobile: {
      1: { 
        // Transmission properties
        samples: 4,
        chromatic: 0.08,
        thickness: 0.5,
        ior: 2.417,
        attenuationDistance: 0.01,
        
        // Material properties
        envMapIntensity: 2.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        specularIntensity: 0.9,
        specularColor: 0xffffff,
        anisotropy: 0.3,
        roughness: 0,
        metalness: 0,
        
        // Rendering properties
        side: 'DoubleSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        // Resolution & quality
        resolution: 1024,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 1024,
        
        // Performance
        maxLights: 3,
        enableBloom: true,
        bloomIntensity: 0.3,
        enableAO: false,
        useFallback: false,
        
        name: 'Ultra',
        description: 'Maximum quality for high-end mobile GPUs'
      },
      2: { 
        samples: 3,
        chromatic: 0.06,
        thickness: 0.4,
        ior: 2.2,
        attenuationDistance: 0.05,
        
        envMapIntensity: 2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.05,
        reflectivity: 0.9,
        specularIntensity: 0.8,
        specularColor: 0xffffff,
        anisotropy: 0.2,
        roughness: 0.05,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 768,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        antialias: true,
        shadowMapSize: 512,
        
        maxLights: 2,
        enableBloom: true,
        bloomIntensity: 0.25,
        enableAO: false,
        useFallback: false,
        
        name: 'High',
        description: 'High quality with optimized performance'
      },
      3: { 
        samples: 2,
        chromatic: 0.04,
        thickness: 0.3,
        ior: 1.8,
        attenuationDistance: 0.1,
        
        envMapIntensity: 1.5,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        reflectivity: 0.7,
        specularIntensity: 0.7,
        specularColor: 0xffffff,
        anisotropy: 0.1,
        roughness: 0.1,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 512,
        pixelRatio: 1,
        antialias: true,
        shadowMapSize: 256,
        
        maxLights: 2,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: false,
        
        name: 'Medium',
        description: 'Balanced quality and performance'
      },
      4: { 
        samples: 1,
        chromatic: 0.02,
        thickness: 0.2,
        ior: 1.5,
        attenuationDistance: 0.2,
        
        envMapIntensity: 1,
        clearcoat: 0,
        clearcoatRoughness: 0.2,
        reflectivity: 0.5,
        specularIntensity: 0.6,
        specularColor: 0xffffff,
        anisotropy: 0,
        roughness: 0.2,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 256,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 128,
        
        maxLights: 1,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Low',
        description: 'Performance focused with simplified materials'
      },
      5: { 
        samples: 1,
        chromatic: 0,
        thickness: 0.1,
        ior: 1.3,
        attenuationDistance: 0.3,
        
        envMapIntensity: 0.8,
        clearcoat: 0,
        clearcoatRoughness: 0.3,
        reflectivity: 0.3,
        specularIntensity: 0.5,
        specularColor: 0xdddddd,
        anisotropy: 0,
        roughness: 0.3,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 128,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 64,
        
        maxLights: 1,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Minimal',
        description: 'Maximum performance with basic materials only'
      }
    },
    tablet: {
      1: { 
        samples: 6,
        chromatic: 0.09,
        thickness: 0.5,
        ior: 2.417,
        attenuationDistance: 0.01,
        
        envMapIntensity: 2.8,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        specularIntensity: 1.0,
        specularColor: 0xffffff,
        anisotropy: 0.4,
        roughness: 0,
        metalness: 0,
        
        side: 'DoubleSide',
        castShadow: true,
        receiveShadow: true,
        toneMappingExposure: 1.0,
        
        resolution: 1536,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 2048,
        
        maxLights: 4,
        enableBloom: true,
        bloomIntensity: 0.35,
        enableAO: false,
        useFallback: false,
        
        name: 'Ultra',
        description: 'Maximum quality for high-end tablet GPUs'
      },
      2: { 
        samples: 4,
        chromatic: 0.07,
        thickness: 0.45,
        ior: 2.3,
        attenuationDistance: 0.03,
        
        envMapIntensity: 2.2,
        clearcoat: 0.9,
        clearcoatRoughness: 0.05,
        reflectivity: 0.95,
        specularIntensity: 0.9,
        specularColor: 0xffffff,
        anisotropy: 0.3,
        roughness: 0.05,
        metalness: 0,
        
        side: 'DoubleSide',
        castShadow: false,
        receiveShadow: true,
        toneMappingExposure: 1.0,
        
        resolution: 1024,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 1024,
        
        maxLights: 3,
        enableBloom: true,
        bloomIntensity: 0.3,
        enableAO: false,
        useFallback: false,
        
        name: 'High',
        description: 'High quality with optimized performance'
      },
      3: { 
        samples: 3,
        chromatic: 0.05,
        thickness: 0.35,
        ior: 2.0,
        attenuationDistance: 0.08,
        
        envMapIntensity: 1.7,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        reflectivity: 0.8,
        specularIntensity: 0.75,
        specularColor: 0xffffff,
        anisotropy: 0.15,
        roughness: 0.1,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 768,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        antialias: true,
        shadowMapSize: 512,
        
        maxLights: 2,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: false,
        
        name: 'Medium',
        description: 'Balanced quality and performance'
      },
      4: { 
        samples: 2,
        chromatic: 0.03,
        thickness: 0.25,
        ior: 1.6,
        attenuationDistance: 0.15,
        
        envMapIntensity: 1.2,
        clearcoat: 0.3,
        clearcoatRoughness: 0.15,
        reflectivity: 0.6,
        specularIntensity: 0.65,
        specularColor: 0xffffff,
        anisotropy: 0,
        roughness: 0.2,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 512,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 256,
        
        maxLights: 2,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Low',
        description: 'Performance focused with simplified materials'
      },
      5: { 
        samples: 1,
        chromatic: 0,
        thickness: 0.15,
        ior: 1.4,
        attenuationDistance: 0.25,
        
        envMapIntensity: 0.9,
        clearcoat: 0,
        clearcoatRoughness: 0.3,
        reflectivity: 0.4,
        specularIntensity: 0.5,
        specularColor: 0xdddddd,
        anisotropy: 0,
        roughness: 0.3,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 256,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 128,
        
        maxLights: 1,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Minimal',
        description: 'Maximum performance with basic materials only'
      }
    },
    desktop: {
      1: { 
        samples: 8,
        chromatic: 0.1,
        thickness: 0.5,
        ior: 2.417,
        attenuationDistance: 0.01,
        
        envMapIntensity: 3,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        specularIntensity: 1.0,
        specularColor: 0xffffff,
        anisotropy: 0.5,
        roughness: 0,
        metalness: 0,
        
        side: 'DoubleSide',
        castShadow: true,
        receiveShadow: true,
        toneMappingExposure: 1.0,
        
        resolution: 2048,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 4096,
        
        maxLights: 5,
        enableBloom: true,
        bloomIntensity: 0.4,
        enableAO: true,
        useFallback: false,
        
        name: 'Ultra',
        description: 'Maximum quality with full transmission and effects'
      },
      2: { 
        samples: 6,
        chromatic: 0.08,
        thickness: 0.5,
        ior: 2.417,
        attenuationDistance: 0.01,
        
        envMapIntensity: 2.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        specularIntensity: 1.0,
        specularColor: 0xffffff,
        anisotropy: 0.4,
        roughness: 0,
        metalness: 0,
        
        side: 'DoubleSide',
        castShadow: true,
        receiveShadow: true,
        toneMappingExposure: 1.0,
        
        resolution: 2048,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 2048,
        
        maxLights: 4,
        enableBloom: true,
        bloomIntensity: 0.35,
        enableAO: false,
        useFallback: false,
        
        name: 'High',
        description: 'High quality with optimized transmission'
      },
      3: { 
        samples: 4,
        chromatic: 0.06,
        thickness: 0.4,
        ior: 2.2,
        attenuationDistance: 0.05,
        
        envMapIntensity: 2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.05,
        reflectivity: 0.9,
        specularIntensity: 0.85,
        specularColor: 0xffffff,
        anisotropy: 0.2,
        roughness: 0.05,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: true,
        toneMappingExposure: 1.0,
        
        resolution: 1024,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 1024,
        
        maxLights: 3,
        enableBloom: true,
        bloomIntensity: 0.25,
        enableAO: false,
        useFallback: false,
        
        name: 'Medium',
        description: 'Balanced quality and performance'
      },
      4: { 
        samples: 2,
        chromatic: 0.04,
        thickness: 0.3,
        ior: 1.8,
        attenuationDistance: 0.1,
        
        envMapIntensity: 1.5,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        reflectivity: 0.7,
        specularIntensity: 0.7,
        specularColor: 0xffffff,
        anisotropy: 0,
        roughness: 0.15,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 512,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 512,
        
        maxLights: 2,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Low',
        description: 'Performance focused with simplified materials'
      },
      5: { 
        samples: 1,
        chromatic: 0,
        thickness: 0.2,
        ior: 1.5,
        attenuationDistance: 0.2,
        
        envMapIntensity: 1,
        clearcoat: 0,
        clearcoatRoughness: 0.2,
        reflectivity: 0.5,
        specularIntensity: 0.6,
        specularColor: 0xdddddd,
        anisotropy: 0,
        roughness: 0.3,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 256,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 256,
        
        maxLights: 1,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Minimal',
        description: 'Maximum performance with basic materials only'
      }
    },
    laptop: {
      1: { 
        samples: 7,
        chromatic: 0.09,
        thickness: 0.5,
        ior: 2.417,
        attenuationDistance: 0.01,
        
        envMapIntensity: 2.8,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        specularIntensity: 1.0,
        specularColor: 0xffffff,
        anisotropy: 0.45,
        roughness: 0,
        metalness: 0,
        
        side: 'DoubleSide',
        castShadow: true,
        receiveShadow: true,
        toneMappingExposure: 1.0,
        
        resolution: 1536,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 2048,
        
        maxLights: 4,
        enableBloom: true,
        bloomIntensity: 0.35,
        enableAO: false,
        useFallback: false,
        
        name: 'Ultra',
        description: 'Maximum quality for high-end laptop GPUs'
      },
      2: { 
        samples: 5,
        chromatic: 0.07,
        thickness: 0.45,
        ior: 2.3,
        attenuationDistance: 0.03,
        
        envMapIntensity: 2.3,
        clearcoat: 0.9,
        clearcoatRoughness: 0.05,
        reflectivity: 0.95,
        specularIntensity: 0.9,
        specularColor: 0xffffff,
        anisotropy: 0.35,
        roughness: 0.05,
        metalness: 0,
        
        side: 'DoubleSide',
        castShadow: false,
        receiveShadow: true,
        toneMappingExposure: 1.0,
        
        resolution: 1024,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 1024,
        
        maxLights: 3,
        enableBloom: true,
        bloomIntensity: 0.3,
        enableAO: false,
        useFallback: false,
        
        name: 'High',
        description: 'High quality with optimized performance'
      },
      3: { 
        samples: 3,
        chromatic: 0.05,
        thickness: 0.35,
        ior: 2.0,
        attenuationDistance: 0.08,
        
        envMapIntensity: 1.8,
        clearcoat: 0.7,
        clearcoatRoughness: 0.08,
        reflectivity: 0.8,
        specularIntensity: 0.8,
        specularColor: 0xffffff,
        anisotropy: 0.2,
        roughness: 0.1,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 768,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        antialias: true,
        shadowMapSize: 512,
        
        maxLights: 2,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: false,
        
        name: 'Medium',
        description: 'Balanced quality and performance'
      },
      4: { 
        samples: 2,
        chromatic: 0.03,
        thickness: 0.25,
        ior: 1.7,
        attenuationDistance: 0.12,
        
        envMapIntensity: 1.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.12,
        reflectivity: 0.6,
        specularIntensity: 0.65,
        specularColor: 0xffffff,
        anisotropy: 0,
        roughness: 0.15,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 512,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 256,
        
        maxLights: 2,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Low',
        description: 'Performance focused with simplified materials'
      },
      5: { 
        samples: 1,
        chromatic: 0,
        thickness: 0.15,
        ior: 1.5,
        attenuationDistance: 0.2,
        
        envMapIntensity: 1,
        clearcoat: 0,
        clearcoatRoughness: 0.25,
        reflectivity: 0.5,
        specularIntensity: 0.5,
        specularColor: 0xdddddd,
        anisotropy: 0,
        roughness: 0.3,
        metalness: 0,
        
        side: 'FrontSide',
        castShadow: false,
        receiveShadow: false,
        toneMappingExposure: 1.0,
        
        resolution: 256,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 128,
        
        maxLights: 1,
        enableBloom: false,
        bloomIntensity: 0,
        enableAO: false,
        useFallback: true,
        
        name: 'Minimal',
        description: 'Maximum performance with basic materials only'
      }
    }
  };
  
  return qualitySettings[deviceType]?.[tier] || qualitySettings['laptop'][3];
};