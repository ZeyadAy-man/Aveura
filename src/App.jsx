import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import LuxuryLoader from "./LoadingPage.jsx";
import Model from "./Components/Model.jsx";
import { GPUProvider } from "./Utils/GPUProvider.jsx";
import { GPUDebugPanel } from "./Components/GPUDebugDetector.jsx";
// Memoized section display component with directional animations
const SectionDisplay = memo(({ sections, currentSection }) => {
  // Get responsive offset based on screen width
  const getResponsiveOffset = () => {
    if (typeof window === "undefined") return 50;
    const width = window.innerWidth;
    if (width < 640) return 30; // Mobile
    if (width < 1024) return 40; // Tablet
    return 60; // Desktop
  };

  // Check if mobile
  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  // Get container alignment based on direction and device
  const getContainerStyle = (direction) => {
    if (isMobile()) {
      return {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 0px",
      };
    }

    switch (direction) {
      case "left":
        return {
          alignItems: "flex-start",
          justifyContent: "center",
          textAlign: "left",
          paddingLeft: "clamp(40px, 8vw, 80px)",
          paddingRight: "50%",
        };
      case "right":
        return {
          alignItems: "flex-end",
          justifyContent: "center",
          textAlign: "right",
          paddingRight: "clamp(40px, 8vw, 80px)",
          marginLeft: "-80px",
        };
      case "up":
        return {
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 20px",
        };
      case "down":
        return {
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 20px",
        };
      default:
        return {
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 20px",
        };
    }
  };

  // Define animation directions for each section with faster transitions
  const getAnimationStyle = (section, isActive) => {
    const offset = getResponsiveOffset();
    const direction = section.direction || "up";

    let transform = "translate(0, 0)";
    if (!isActive) {
      switch (direction) {
        case "up":
          transform = `translate(0, ${offset}px)`;
          break;
        case "down":
          transform = `translate(0, -${offset}px)`;
          break;
        case "left":
          transform = `translate(-${offset}px, 0)`;
          break;
        case "right":
          transform = `translate(${offset}px, 0)`;
          break;
      }
    }

    return {
      opacity: isActive ? 1 : 0,
      transform: isActive ? "translate(0, 0)" : transform,
      transition:
        "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      pointerEvents: isActive ? "auto" : "none",
    };
  };

  return (
    <>
      {sections.map((section, index) => {
        const isActive = currentSection === index;
        const animStyle = getAnimationStyle(section, isActive);
        const containerStyle = getContainerStyle(section.direction);

        return (
          <div
            key={index}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              color: "white",
              fontFamily:
                "'Playfair Display', 'Cormorant Garamond', 'Cinzel', serif",
              willChange: isActive ? "opacity, transform" : "auto",
              overflowX: "hidden",
              zIndex: 2,
              pointerEvents: "none",
              ...containerStyle,
            }}
          >
            <div
              style={{
                ...animStyle,
                willChange: isActive ? "opacity, transform" : "auto",
              }}
            >
              <h1
                style={{
                  fontSize: "clamp(2.25rem, 6.5vw, 5.5rem)",
                  fontWeight: "400",
                  textShadow:
                    "0 0 60px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2), 0 2px 40px rgba(0,0,0,0.9)",
                  marginBottom: "clamp(16px, 3vw, 28px)",
                  letterSpacing: "clamp(2px, 0.12em, 8px)",
                  margin: "0 0 clamp(16px, 3vw, 28px) 0",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f5f5f5 30%, #ffffff 60%, #e8e8e8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: "1.2",
                  fontStyle: "italic",
                  maxWidth: "100%",
                }}
              >
                {section.title}
              </h1>
              <p
                style={{
                  fontSize: "clamp(1rem, 2.75vw, 1.65rem)",
                  textShadow:
                    "0 0 30px rgba(255,255,255,0.15), 0 2px 20px rgba(0,0,0,0.8)",
                  opacity: 0.92,
                  maxWidth: isMobile() ? "clamp(300px, 90vw, 600px)" : "none",
                  lineHeight: "1.8",
                  margin: 0,
                  fontWeight: "300",
                  letterSpacing: "clamp(1px, 0.1em, 4px)",
                  color: "rgba(255, 255, 255, 0.95)",
                  fontStyle: "normal",
                }}
              >
                {section.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
});

// Memoized progress indicator with responsive sizing
const ProgressIndicator = memo(
  ({ currentSection, sectionProgress, totalSections }) => (
    <div
      style={{
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
        userSelect: "none",
      }}
    >
      Section {currentSection + 1} / {totalSections}
      <div
        style={{
          width: "clamp(60px, 15vw, 100px)",
          height: "clamp(3px, 1vw, 4px)",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "2px",
          marginTop: "clamp(6px, 1.5vw, 8px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${sectionProgress * 100}%`,
            height: "100%",
            background: "#FFD700",
            transition: "width 0.1s ease-out",
            willChange: "width",
          }}
        />
      </div>
    </div>
  )
);

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const rafRef = useRef(null);
  const scrollDirectionRef = useRef(0);
  const lastScrollTopRef = useRef(0);

  // Memoized sections data with custom directions
  const sections = useMemo(
    () => [
      {
        title: "Pure Elegance",
        subtitle: "18K gold, flawlessly refined",
        direction: "up",
      },
      {
        title: "Perfect Geometry",
        subtitle: "Balanced circular precision",
        direction: "down",
      },
      {
        title: "Maximum Brilliance",
        subtitle: "Expert-cut diamond facets",
        direction: "right",
      },
      {
        title: "Crown Setting",
        subtitle: "Secure, elevated stone mount",
        direction: "right",
      },
      {
        title: "Side Detailing",
        subtitle: "Hand-finished gold contours",
        direction: "left",
      },
      {
        title: "Master Craft",
        subtitle: "Artisan-level metalwork",
        direction: "left",
      },
      {
        title: "Diamond Fire",
        subtitle: "Exceptional light dispersion",
        direction: "left",
      },
      {
        title: "Golden Core",
        subtitle: "Durable, premium alloy",
        direction: "right",
      },
      {
        title: "Complete Form",
        subtitle: "Designed from every angle",
        direction: "up",
      },
      {
        title: "Timeless Bond",
        subtitle: "Built to last forever",
        direction: "down",
      },
    ],
    []
  );

  // Update viewport height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      // Use visualViewport if available (better for mobile), otherwise use window.innerHeight
      const height = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(height);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, []);

  // Optimized scroll handler using RAF with improved state batching
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const height = viewportHeight || window.innerHeight;
      const section = Math.floor(scrollTop / height);
      const progressInSection = (scrollTop % height) / height;

      // Track scroll direction
      scrollDirectionRef.current =
        scrollTop > lastScrollTopRef.current ? 1 : -1;
      lastScrollTopRef.current = scrollTop;

      const newSection = Math.min(Math.max(section, 0), sections.length - 1);

      // Batch state updates using React 18's automatic batching
      setCurrentSection((prev) => (prev !== newSection ? newSection : prev));
      setSectionProgress(progressInSection);

      rafRef.current = null;
    });
  }, [sections.length, viewportHeight]);

  useEffect(() => {
    if (viewportHeight === 0) return;

    handleScroll();

    // Passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [handleScroll, viewportHeight]);

  // Memoized Canvas configuration
  const canvasProps = useMemo(
    () => ({
      camera: { position: [0, 2, 8], fov: 50 },
      gl: {
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      },
      dpr: [1, 2],
      performance: { min: 0.5 },
    }),
    []
  );

  // Calculate total scroll height - add extra buffer for mobile
  const scrollHeight = useMemo(() => {
    const baseHeight = sections.length * 100;
    // Add 10vh buffer for mobile browsers to ensure last section is reachable
    return `${baseHeight + 10}vh`;
  }, [sections.length]);

  return (
    <>
      {/* Scroll spacer to enable scrolling through all sections with buffer */}
      <div
        style={{
          height: scrollHeight,
          width: "100%",
          position: "relative",
          minHeight: `${sections.length * (viewportHeight || 800)}px`,
        }}
      />

      {/* Fixed Canvas */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          willChange: "transform",
        }}
      >
        <GPUProvider>
        <GPUDebugPanel/>
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
          <Suspense>
            <Model
              currentSection={currentSection}
              sectionProgress={sectionProgress}
              position={[0, 0, 0]}
            />
          </Suspense>
          <Environment preset="sunset" environmentIntensity={0.8} />
        </Canvas>
        </GPUProvider>
      </div>

      {/* Progress Indicator */}
      {/* <ProgressIndicator 
        currentSection={currentSection} 
        sectionProgress={sectionProgress} 
        totalSections={sections.length}
      /> */}
      <LuxuryLoader />

      {/* Section Text - all sections are fixed and switch based on currentSection */}
      <SectionDisplay sections={sections} currentSection={currentSection} />
    </>
  );
}
