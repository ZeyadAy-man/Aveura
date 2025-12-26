import { memo } from "react";

const PartsList = memo(({ parts, selectedPartId, onPartSelect }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '30px',
      left: '30px',
      background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
      color: 'white',
      padding: '25px',
      borderRadius: '20px',
      maxWidth: '320px',
      maxHeight: '80vh',
      overflowY: 'auto',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.1)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      zIndex: 10000
    }}>
      <div style={{ 
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
      }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.5px'
        }}>
          Jewelry Parts
        </h2>
        <p style={{ 
          margin: '0', 
          fontSize: '12px', 
          color: '#999',
          fontWeight: '500'
        }}>
          {parts.length} parts detected
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {parts.map((part) => (
          <div 
            key={part.id} 
            style={{ 
              fontSize: '13px', 
              padding: '14px 16px',
              borderRadius: '12px',
              background: selectedPartId === part.id 
                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedPartId === part.id ? 'rgba(255, 215, 0, 0.4)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: selectedPartId === part.id ? 'scale(1.02)' : 'scale(1)'
            }}
            onClick={() => onPartSelect(part)}
            onMouseOver={(e) => {
              if (selectedPartId !== part.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedPartId !== part.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: part.type === 'stone' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 
                           part.type === 'pearl' ? 'linear-gradient(135deg, #E91E63, #c2185b)' : 
                           'linear-gradient(135deg, #FFC107, #ffa000)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: '600', 
                  marginBottom: '4px',
                  color: selectedPartId === part.id ? '#FFD700' : 'white',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {part.name}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#888',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  {part.type} • {part.currentMaterialType.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PartsList;