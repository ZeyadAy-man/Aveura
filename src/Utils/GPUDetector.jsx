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

export default detectGPUTier;