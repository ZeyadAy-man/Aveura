import { useGPU } from "../Utils/GPUProvider";
import { useState } from "react";
import { getQualitySettings } from "../Utils/QualityProvider";

export const GPUDebugPanel = () => {
  const gpuData = useGPU();
  const [isOpen, setIsOpen] = useState(true);
  const qualitySettings = getQualitySettings(gpuData.tier, gpuData.deviceType);
  
  const tierColors = {
    1: '#10b981',
    2: '#3b82f6',
    3: '#f59e0b',
    4: '#f97316',
    5: '#ef4444'
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}
      >
        {isOpen ? '🔽' : '▶️'} GPU Debug
      </button>
      
      {isOpen && (
        <div style={{
          marginTop: '10px',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          minWidth: '300px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '16px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '10px'
          }}>
            🖥️ System Detection
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#9ca3af',
              marginBottom: '5px'
            }}>
              Device Type
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#60a5fa',
              textTransform: 'uppercase'
            }}>
              {gpuData.deviceType}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#9ca3af',
              marginBottom: '5px'
            }}>
              GPU Tier
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: tierColors[gpuData.tier]
              }}>
                TIER {gpuData.tier}
              </div>
              <div style={{
                background: tierColors[gpuData.tier],
                color: 'black',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {gpuData.quality}
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '15px',
            marginTop: '15px'
          }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#9ca3af',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Quality Settings
            </div>
            
            <div style={{ 
              display: 'grid',
              gap: '8px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Samples:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.samples}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Chromatic Aberration:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.chromatic}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Thickness:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.thickness}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>IOR:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.ior}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Env Map Intensity:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.envMapIntensity}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Clearcoat:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.clearcoat}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Clearcoat Roughness:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.clearcoatRoughness}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Attenuation Distance:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.attenuationDistance}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Reflectivity:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.reflectivity}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Specular Intensity:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.specularIntensity}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Anisotropy:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.anisotropy}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Side:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.side}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Cast Shadow:</span>
                <span style={{ 
                  color: qualitySettings.castShadow ? '#10b981' : '#ef4444', 
                  fontWeight: 'bold' 
                }}>
                  {qualitySettings.castShadow ? 'YES' : 'NO'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Receive Shadow:</span>
                <span style={{ 
                  color: qualitySettings.receiveShadow ? '#10b981' : '#ef4444', 
                  fontWeight: 'bold' 
                }}>
                  {qualitySettings.receiveShadow ? 'YES' : 'NO'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Use Fallback:</span>
                <span style={{ 
                  color: qualitySettings.useFallback ? '#f97316' : '#10b981', 
                  fontWeight: 'bold' 
                }}>
                  {qualitySettings.useFallback ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#9ca3af',
            lineHeight: '1.5'
          }}>
            {qualitySettings.description}
          </div>
        </div>
      )}
    </div>
  );
};