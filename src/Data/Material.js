const MATERIAL_PRESETS = {
  metal: {
    gold: {
      color: '#FFD700',
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.5
    },
    silver: {
      color: '#C0C0C0',
      metalness: 1,
      roughness: 0.15,
      envMapIntensity: 1.5
    },
    platinum: {
      color: '#E5E4E2',
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 1.8
    },
    rose_gold: {
      color: '#B76E79',
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.5
    }
  },
  stone: {
    diamond: {
      color: '#FFFFFF',
      transmission: 1,
      thickness: 0.3,
      roughness: 0.05,
      metalness: 0,
      ior: 2.2,
      envMapIntensity: 2
    },
    ruby: {
      color: '#E0115F',
      transmission: 0.6,
      thickness: 0.15,
      roughness: 0.15,
      metalness: 0,
      ior: 2,
      envMapIntensity: 1.5
    },
    sapphire: {
      color: '#0F52BA',
      transmission: 0.6,
      thickness: 0.15,
      roughness: 0.15,
      metalness: 0,
      ior: 2,
      envMapIntensity: 1.5
    },
    emerald: {
      color: '#50C878',
      transmission: 0.6,
      thickness: 0.15,
      roughness: 0.15,
      metalness: 0,
      ior: 2,
      envMapIntensity: 1.5
    }
  },
  pearl: {
    white: {
      color: '#FFF5E1',
      metalness: 0,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      sheen: 1,
      sheenColor: '#FFD1DC',
      envMapIntensity: 1.2
    },
    black: {
      color: '#2C2C2C',
      metalness: 0,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      sheen: 1,
      sheenColor: '#4A4A4A',
      envMapIntensity: 1.2
    },
    pink: {
      color: '#FFE4E8',
      metalness: 0,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      sheen: 1,
      sheenColor: '#FFC0CB',
      envMapIntensity: 1.2
    },
    golden: {
      color: '#F4E4C1',
      metalness: 0,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      sheen: 1,
      sheenColor: '#FFD700',
      envMapIntensity: 1.2
    }
  }
};
export default MATERIAL_PRESETS;