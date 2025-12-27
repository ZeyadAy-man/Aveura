import { useState, useEffect } from "react";

const detectGPUTier = (deviceType) => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return { tier: 5, quality: 'minimal' };
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  
  // --- MOBILE DEVICES ---
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    if (renderer.includes('Apple A17') || renderer.includes('Apple A16') || 
        renderer.includes('Adreno 750') || renderer.includes('Adreno 740')) {
      return { tier: 1, quality: 'ultra' };
    }
    if (renderer.includes('Apple A15') || renderer.includes('Apple A14') || 
        renderer.includes('Adreno 7') || renderer.includes('Mali-G78')) {
      return { tier: 2, quality: 'high' };
    }
    if (renderer.includes('Apple A12') || renderer.includes('Apple A13') || 
        renderer.includes('Adreno 6') || renderer.includes('Mali-G')) {
      return { tier: 3, quality: 'medium' };
    }
    if (renderer.includes('Adreno 5') || renderer.includes('Mali-4')) {
      return { tier: 4, quality: 'low' };
    }
    return { tier: 5, quality: 'minimal' };
  }
  
  // --- DESKTOP PCs ---
  if (deviceType === 'desktop') {
    if (renderer.includes('RTX 4090') || renderer.includes('RTX 4080') || 
        renderer.includes('RTX 3090') || renderer.includes('RX 7900 XTX') || 
        maxTextureSize >= 32768) {
      return { tier: 1, quality: 'ultra' };
    }
    if (renderer.includes('RTX 40') || renderer.includes('RTX 30') || 
        renderer.includes('RX 7') || renderer.includes('RX 6800') || 
        maxTextureSize >= 16384) {
      return { tier: 2, quality: 'high' };
    }
    if (renderer.includes('RTX 20') || renderer.includes('GTX 16') || 
        renderer.includes('RX 6') || renderer.includes('RX 5') || 
        maxTextureSize >= 8192) {
      return { tier: 3, quality: 'medium' };
    }
    if (renderer.includes('GTX 10') || renderer.includes('RX 500') || 
        renderer.includes('Intel UHD') || renderer.includes('Intel Iris')) {
      return { tier: 4, quality: 'low' };
    }
    return { tier: 5, quality: 'minimal' };
  }
  
  // --- LAPTOP DEVICES ---
  if (deviceType === 'laptop') {
    if (renderer.includes('RTX 4090') || renderer.includes('RTX 4080') || 
        renderer.includes('RTX 3080 Ti')) {
      return { tier: 1, quality: 'ultra' };
    }
    if (renderer.includes('RTX 40') || renderer.includes('RTX 30') || 
        renderer.includes('RX 7') || renderer.includes('RX 6')) {
      return { tier: 2, quality: 'high' };
    }
    if (renderer.includes('RTX 20') || renderer.includes('GTX 16') || 
        renderer.includes('Intel Iris Xe') || renderer.includes('MX')) {
      return { tier: 3, quality: 'medium' };
    }
    if (renderer.includes('Intel UHD') || renderer.includes('Intel HD') || 
        renderer.includes('Radeon Graphics') || renderer.includes('Vega')) {
      return { tier: 4, quality: 'low' };
    }
    return { tier: 5, quality: 'minimal' };
  }
  
  return { tier: 5, quality: 'minimal' };
};

export const GPUTierDetector = ({ deviceType }) => {
  const [gpuInfo, setGpuInfo] = useState({ tier: 3, quality: 'medium' });
  
  useEffect(() => {
    const detected = detectGPUTier(deviceType);
    setGpuInfo(detected);
    console.log('🎮 GPU Tier Detected:', {
      deviceType: deviceType.toUpperCase(),
      tier: detected.tier,
      quality: detected.quality,
      description: `Tier ${detected.tier} - ${detected.quality.toUpperCase()}`
    });
  }, [deviceType]);
  
  return gpuInfo;
};
