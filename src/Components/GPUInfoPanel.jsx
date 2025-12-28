import { useGPU } from "../Utils/GPUProvider";

export const GPUInfoBadge = () => {
  const gpuData = useGPU();
  
  const tierColors = {
    1: '#10b981',
    2: '#3b82f6',
    3: '#f59e0b',
    4: '#f97316',
    5: '#ef4444'
  };
  
  const deviceIcons = {
    mobile: '📱',
    tablet: '📱',
    desktop: '🖥️',
    laptop: '💻'
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '10px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <span style={{ fontSize: '18px' }}>
        {deviceIcons[gpuData.deviceType]}
      </span>
      <div>
        <div style={{ 
          fontSize: '11px', 
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {gpuData.deviceType}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '2px'
        }}>
          <span style={{ 
            fontWeight: 'bold',
            color: tierColors[gpuData.tier]
          }}>
            Tier {gpuData.tier}
          </span>
          <span style={{ color: '#6b7280' }}>•</span>
          <span style={{ 
            color: '#d1d5db',
            textTransform: 'capitalize'
          }}>
            {gpuData.quality}
          </span>
        </div>
      </div>
    </div>
  );
};