import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "./model.jsx";

// Memoized section display component with directional animations
const SectionDisplay = memo(({ sections, currentSection }) => {
  // Get responsive offset based on screen width
  const getResponsiveOffset = () => {
    if (typeof window === 'undefined') return 50;
    const width = window.innerWidth;
    if (width < 640) return 30; // Mobile
    if (width < 1024) return 40; // Tablet
    return 60; // Desktop
  };

  // Check if mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  };

  // Get container alignment based on direction and device
  const getContainerStyle = (direction) => {
    if (isMobile()) {
      return {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 20px"
      };
    }

    switch(direction) {
      case 'left':
        return {
          alignItems: "flex-start",
          justifyContent: "center",
          textAlign: "left",
          paddingLeft: "clamp(40px, 8vw, 80px)",
          paddingRight: "50%"
        };
      case 'right':
        return {
          alignItems: "flex-end",
          justifyContent: "center",
          textAlign: "right",
          paddingRight: "clamp(40px, 8vw, 80px)",
          paddingLeft: "50%"
        };
      case 'up':
        return {
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "center",
          paddingTop: "clamp(220px, 12vh, 100px)",
          padding: "clamp(60px, 12vh, 100px) 20px 0 20px"
        };
      case 'down':
        return {
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "center",
          paddingBottom: "clamp(220px, 12vh, 100px)",
          padding: "0 20px clamp(60px, 12vh, 100px) 20px"
        };
      default:
        return {
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 20px"
        };
    }
  };

  // Define animation directions for each section with faster transitions
  const getAnimationStyle = (section, isActive) => {
    const offset = getResponsiveOffset();
    const direction = section.direction || 'up';
    
    let transform = 'translate(0, 0)';
    if (!isActive) {
      switch(direction) {
        case 'up':
          transform = `translate(0, ${offset}px)`;
          break;
        case 'down':
          transform = `translate(0, -${offset}px)`;
          break;
        case 'left':
          transform = `translate(-${offset}px, 0)`;
          break;
        case 'right':
          transform = `translate(${offset}px, 0)`;
          break;
      }
    }
    
    return {
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translate(0, 0)' : transform,
      transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: isActive ? 'auto' : 'none'
    };
  };

  return (
    <div style={{ position: "relative", zIndex: 2, pointerEvents: "none", width: "100vw" }}>
      {sections.map((section, index) => {
        const isActive = currentSection === index;
        const animStyle = getAnimationStyle(section, isActive);
        const containerStyle = getContainerStyle(section.direction);
        
        return (
          <div 
            key={index} 
            style={{ 
              height: "100vh", 
              display: "flex", 
              flexDirection: "column", 
              color: "white", 
              fontFamily: "system-ui, -apple-system, sans-serif", 
              willChange: isActive ? "opacity, transform" : "auto",
              position: "relative",
              overflowX: "hidden",
              ...containerStyle
            }}
          >
            <div style={{
              ...animStyle,
              willChange: isActive ? "opacity, transform" : "auto"
            }}>
              <h1 style={{ 
                fontSize: "clamp(2rem, 6vw, 5rem)", 
                fontWeight: "900", 
                textShadow: "0 0 60px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2), 0 2px 40px rgba(0,0,0,0.9)", 
                marginBottom: "clamp(12px, 2.5vw, 24px)",
                letterSpacing: "clamp(-1px, -0.02em, -2px)",
                margin: "0 0 clamp(12px, 2.5vw, 24px) 0",
                background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textTransform: "uppercase",
                lineHeight: "1.1"
              }}>
                {section.title}
              </h1>
              <p style={{ 
                fontSize: "clamp(1rem, 3vw, 1.75rem)", 
                textShadow: "0 0 30px rgba(255,255,255,0.15), 0 2px 20px rgba(0,0,0,0.8)",
                opacity: 0.9,
                maxWidth: isMobile() ? "clamp(300px, 90vw, 600px)" : "none",
                lineHeight: "1.7",
                margin: 0,
                fontWeight: "300",
                letterSpacing: "clamp(0.5px, 0.08em, 3px)",
                color: "rgba(255, 255, 255, 0.95)"
              }}>
                {section.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

// Memoized progress indicator with responsive sizing
const ProgressIndicator = memo(({ currentSection, sectionProgress }) => (
  <div style={{ 
    position: "fixed", 
    top: "clamp(10px, 3vw, 20px)", 
    right: "clamp(10px, 3vw, 20px)", 
    zIndex: 10, 
    color: "white", 
    fontSize: "clamp(11px, 2vw, 14px)", 
    fontFamily: "monospace", 
    background: "rgba(0,0,0,0.5)", 
    padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 15px)", 
    borderRadius: "clamp(6px, 1.5vw, 8px)", 
    backdropFilter: "blur(10px)",
    userSelect: "none"
  }}>
    Section {currentSection + 1} / 10
    <div style={{ 
      width: "clamp(60px, 15vw, 100px)", 
      height: "clamp(3px, 1vw, 4px)", 
      background: "rgba(255,255,255,0.2)", 
      borderRadius: "2px", 
      marginTop: "clamp(6px, 1.5vw, 8px)", 
      overflow: "hidden" 
    }}>
      <div style={{ 
        width: `${sectionProgress * 100}%`, 
        height: "100%", 
        background: "#FFD700", 
        transition: "width 0.1s ease-out",
        willChange: "width"
      }} />
    </div>
  </div>
));

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const rafRef = useRef(null);
  const scrollDirectionRef = useRef(0);
  const lastScrollTopRef = useRef(0);

  // Memoized sections data with custom directions
  const sections = useMemo(() => [
    { title: "Elegance Unveiled", subtitle: "Scroll to explore our exquisite ring", direction: "up" },
    { title: "The Perfect Circle", subtitle: "Timeless design meets modern craftsmanship", direction: "down" },
    { title: "Brilliance Captured", subtitle: "Every angle tells a story", direction: "left" },
    { title: "Crown Jewel", subtitle: "A masterpiece from above", direction: "right" },
    { title: "Side Profile", subtitle: "Intricate details in gold", direction: "up" },
    { title: "Artisan's Dream", subtitle: "Where luxury meets precision", direction: "down" },
    { title: "Diamond's Fire", subtitle: "Pure radiance and perfection", direction: "left" },
    { title: "Golden Details", subtitle: "Crafted with passion and care", direction: "right" },
    { title: "Full Presentation", subtitle: "A symbol of eternal beauty", direction: "up" },
    { title: "Forever Yours", subtitle: "The ultimate expression of love", direction: "down" },
  ], []);

  // Optimized scroll handler using RAF with improved state batching
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const section = Math.floor(scrollTop / viewportHeight);
      const progressInSection = (scrollTop % viewportHeight) / viewportHeight;

      // Track scroll direction
      scrollDirectionRef.current = scrollTop > lastScrollTopRef.current ? 1 : -1;
      lastScrollTopRef.current = scrollTop;

      const newSection = Math.min(Math.max(section, 0), 9);
      
      // Batch state updates using React 18's automatic batching
      setCurrentSection(prev => prev !== newSection ? newSection : prev);
      setSectionProgress(progressInSection);
      
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    handleScroll();
    
    // Passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [handleScroll]);

  // Memoized Canvas configuration
  const canvasProps = useMemo(() => ({
    camera: { position: [0, 2, 8], fov: 50 },
    gl: { 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    },
    dpr: [1, 2],
    performance: { min: 0.5 }
  }), []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Fixed Canvas */}
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100vw", 
        height: "100vh", 
        zIndex: 1,
        willChange: "transform"
      }}>
        <Canvas {...canvasProps}>
          <color attach="background" args={["#0a0a0a"]} />
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={2} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight 
            position={[-10, -10, -10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1} 
            castShadow={false}
          />
          <Model 
            currentSection={currentSection} 
            sectionProgress={sectionProgress} 
            position={[0, 0, 0]} 
          />
          <Environment preset="sunset" environmentIntensity={0.8} />
        </Canvas>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator 
        currentSection={currentSection} 
        sectionProgress={sectionProgress} 
      />

      {/* Section Text */}
      <SectionDisplay sections={sections} currentSection={currentSection} />
    </div>
  );
}