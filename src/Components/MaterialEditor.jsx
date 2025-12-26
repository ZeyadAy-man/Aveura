import { memo } from "react";
import MATERIAL_PRESETS from "../Data/Material";

const MaterialEditor = memo(({ selectedPart, onClose, onMaterialChange }) => {
  if (!selectedPart) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '30px',
      transform: 'translateY(-50%)',
      background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '20px',
      minWidth: '300px',
      maxWidth: '350px',
      zIndex: 10000,
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.1)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
      }}>
        <div>
          <h3 style={{ 
            margin: '0 0 5px 0', 
            fontSize: '22px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px'
          }}>
            {selectedPart.name}
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '11px', 
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600'
          }}>
            {selectedPart.type}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 50, 50, 0.3)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          fontSize: '13px', 
          display: 'block', 
          marginBottom: '12px',
          color: '#ccc',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Material Type
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.keys(MATERIAL_PRESETS[selectedPart.type]).map(matType => (
            <button
              key={matType}
              onClick={() => onMaterialChange(selectedPart.id, matType)}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '12px',
                background: selectedPart.currentMaterialType === matType 
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: selectedPart.currentMaterialType === matType ? '#FFD700' : 'white',
                border: selectedPart.currentMaterialType === matType 
                  ? '2px solid rgba(255, 215, 0, 0.5)' 
                  : '2px solid rgba(255, 255, 255, 0.1)',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: selectedPart.currentMaterialType === matType ? '700' : '500',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => {
                if (selectedPart.currentMaterialType !== matType) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateX(5px)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedPart.currentMaterialType !== matType) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              {matType.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{
        padding: '15px',
        background: 'rgba(255, 215, 0, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        fontSize: '12px',
        color: '#aaa',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: 0 }}>
          💡 Click on different parts of the jewelry to customize their materials
        </p>
      </div>
    </div>
  );
});

export default MaterialEditor;