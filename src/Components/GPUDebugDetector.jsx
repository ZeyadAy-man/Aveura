import { useGPU } from "../Utils/GPUProvider";
import { useState } from "react";
import { getQualitySettings } from "../Utils/QualityProvider";

export const GPUDebugPanel = () => {
  const gpuData = useGPU();
  const [isOpen, setIsOpen] = useState(true);
  const qualitySettings = getQualitySettings(gpuData.tier);
  
  const tierColors = {
    1: '#10b981', // green
    2: '#3b82f6', // blue
    3: '#f59e0b', // amber
    4: '#f97316', // orange
    5: '#ef4444'  // red
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
          minWidth: '280px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
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
                <span style={{ color: '#9ca3af' }}>Resolution:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.resolution}px
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Chromatic:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.chromatic}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Blur:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                  {qualitySettings.blur}
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