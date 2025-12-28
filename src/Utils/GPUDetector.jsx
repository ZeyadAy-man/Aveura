import { useState, useEffect } from "react";

export const useGPUDetection = () => {
  const [gpuInfo, setGpuInfo] = useState(null);

  useEffect(() => {
    const detectGPU = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2', { powerPreference: 'high-performance' }) || 
                   canvas.getContext('webgl', { powerPreference: 'high-performance' }) || 
                   canvas.getContext('experimental-webgl', { powerPreference: 'high-performance' });
        
        if (!gl) {
          return { renderer: 'Unknown', vendor: 'Unknown', type: 'Unknown', score: 1 };
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        let renderer, vendor;
        
        if (debugInfo) {
          renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        } else {
          renderer = gl.getParameter(gl.RENDERER);
          vendor = gl.getParameter(gl.VENDOR);
        }

        let gpuType = 'Unknown';
        let score = 1;
        const rendererLower = renderer.toLowerCase();
        
        // NVIDIA GPUs
        if (rendererLower.includes('rtx 40') || rendererLower.includes('rtx 50')) {
          gpuType = 'NVIDIA High-End';
          score = 5;
        } else if (rendererLower.includes('rtx 30') || rendererLower.includes('rtx 20')) {
          gpuType = 'NVIDIA Mid-High';
          score = 4;
        } else if (rendererLower.includes('gtx 16') || rendererLower.includes('rtx 16')) {
          gpuType = 'NVIDIA Mid';
          score = 3;
        } else if (rendererLower.includes('nvidia') || rendererLower.includes('geforce')) {
          gpuType = 'NVIDIA';
          score = 2;
        }
        
        // AMD GPUs
        else if (rendererLower.includes('rx 7') || rendererLower.includes('radeon 7')) {
          gpuType = 'AMD High-End';
          score = 5;
        } else if (rendererLower.includes('rx 6') || rendererLower.includes('radeon 6')) {
          gpuType = 'AMD Mid-High';
          score = 4;
        } else if (rendererLower.includes('rx 5') || rendererLower.includes('vega')) {
          gpuType = 'AMD Mid';
          score = 3;
        } else if (rendererLower.includes('amd') || rendererLower.includes('radeon')) {
          gpuType = 'AMD';
          score = 2;
        }
        
        // Intel GPUs
        else if (rendererLower.includes('arc')) {
          gpuType = 'Intel Arc';
          score = 3;
        } else if (rendererLower.includes('iris xe')) {
          gpuType = 'Intel Iris Xe';
          score = 2;
        } else if (rendererLower.includes('intel')) {
          gpuType = 'Intel Integrated';
          score = 1;
        }
        
        // Apple Silicon
        else if (rendererLower.includes('m3') || rendererLower.includes('m4')) {
          gpuType = 'Apple M3/M4';
          score = 4;
        } else if (rendererLower.includes('m2')) {
          gpuType = 'Apple M2';
          score = 3;
        } else if (rendererLower.includes('m1')) {
          gpuType = 'Apple M1';
          score = 2;
        } else if (rendererLower.includes('apple')) {
          gpuType = 'Apple GPU';
          score = 2;
        }
        
        // Mobile GPUs
        else if (rendererLower.includes('mali') || rendererLower.includes('adreno') || rendererLower.includes('powervr')) {
          gpuType = 'Mobile GPU';
          score = 1;
        }
        
        return { renderer, vendor, type: gpuType, score };
      } catch (e) {
        return { renderer: 'Detection failed', vendor: 'Unknown', type: 'Unknown', score: 1 };
      }
    };

    setGpuInfo(detectGPU());
  }, []);

  return gpuInfo;
};