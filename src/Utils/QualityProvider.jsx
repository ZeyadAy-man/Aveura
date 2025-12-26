export const getQualitySettings = (tier, deviceType) => {
  const qualitySettings = {
    mobile: {
      1: { samples: 4, resolution: 1024, chromatic: 0.08, blur: 0, name: 'Ultra' },
      2: { samples: 3, resolution: 512, chromatic: 0.06, blur: 0.05, name: 'High' },
      3: { samples: 2, resolution: 256, chromatic: 0.04, blur: 0.1, name: 'Medium' },
      4: { samples: 1, resolution: 128, chromatic: 0.02, blur: 0.2, name: 'Low' },
      5: { samples: 1, resolution: 64, chromatic: 0.01, blur: 0.3, name: 'Minimal' }
    },
    tablet: {
      1: { samples: 6, resolution: 1536, chromatic: 0.09, blur: 0, name: 'Ultra' },
      2: { samples: 4, resolution: 768, chromatic: 0.07, blur: 0.05, name: 'High' },
      3: { samples: 3, resolution: 512, chromatic: 0.05, blur: 0.1, name: 'Medium' },
      4: { samples: 2, resolution: 256, chromatic: 0.03, blur: 0.2, name: 'Low' },
      5: { samples: 1, resolution: 128, chromatic: 0.02, blur: 0.3, name: 'Minimal' }
    },
    desktop: {
      1: { samples: 8, resolution: 2048, chromatic: 0.1, blur: 0, name: 'Ultra' },
      2: { samples: 6, resolution: 1024, chromatic: 0.08, blur: 0.05, name: 'High' },
      3: { samples: 4, resolution: 512, chromatic: 0.06, blur: 0.1, name: 'Medium' },
      4: { samples: 2, resolution: 256, chromatic: 0.04, blur: 0.2, name: 'Low' },
      5: { samples: 1, resolution: 128, chromatic: 0.02, blur: 0.3, name: 'Minimal' }
    },
    laptop: {
      1: { samples: 7, resolution: 1536, chromatic: 0.09, blur: 0, name: 'Ultra' },
      2: { samples: 5, resolution: 768, chromatic: 0.07, blur: 0.05, name: 'High' },
      3: { samples: 3, resolution: 512, chromatic: 0.05, blur: 0.1, name: 'Medium' },
      4: { samples: 2, resolution: 256, chromatic: 0.03, blur: 0.2, name: 'Low' },
      5: { samples: 1, resolution: 128, chromatic: 0.02, blur: 0.3, name: 'Minimal' }
    }
  };
  
  return qualitySettings[deviceType]?.[tier] || qualitySettings['laptop'][3];
};