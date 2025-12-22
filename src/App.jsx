import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "./model.jsx";

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const section = Math.floor(scrollTop / viewportHeight);
      const progressInSection = (scrollTop % viewportHeight) / viewportHeight;

      setCurrentSection(Math.min(section, 9));
      setSectionProgress(progressInSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { title: "Elegance Unveiled", subtitle: "Scroll to explore our exquisite ring" },
    { title: "The Perfect Circle", subtitle: "Timeless design meets modern craftsmanship" },
    { title: "Brilliance Captured", subtitle: "Every angle tells a story" },
    { title: "Crown Jewel", subtitle: "A masterpiece from above" },
    { title: "Side Profile", subtitle: "Intricate details in gold" },
    { title: "Artisan's Dream", subtitle: "Where luxury meets precision" },
    { title: "Diamond's Fire", subtitle: "Pure radiance and perfection" },
    { title: "Golden Details", subtitle: "Crafted with passion and care" },
    { title: "Full Presentation", subtitle: "A symbol of eternal beauty" },
    { title: "Forever Yours", subtitle: "The ultimate expression of love" },
  ];

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 1 }}>
        <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={["#0a0a0a"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
          <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={1} castShadow />
          <Model currentSection={currentSection} sectionProgress={sectionProgress} position={[0, 0, 0]} />
          <Environment preset="sunset" />
        </Canvas>
      </div>

      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 10, color: "white", fontSize: "14px", fontFamily: "monospace", background: "rgba(0,0,0,0.5)", padding: "10px 15px", borderRadius: "8px", backdropFilter: "blur(10px)" }}>
        Section {currentSection + 1} / 10
        <div style={{ width: "100px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
          <div style={{ width: `${sectionProgress * 100}%`, height: "100%", background: "#FFD700", transition: "width 0.1s ease-out" }} />
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
        {sections.map((section, index) => (
          <div key={index} style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "system-ui, -apple-system, sans-serif", textAlign: "center", padding: "0 20px" }}>
            <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", textShadow: "0 0 40px rgba(0,0,0,0.9)", marginBottom: "10px", opacity: currentSection === index ? 1 : 0.3, transition: "opacity 0.5s ease" }}>
              {section.title}
            </h1>
            <p style={{ fontSize: "1.5rem", textShadow: "0 0 20px rgba(0,0,0,0.8)", opacity: currentSection === index ? 0.8 : 0.2, transition: "opacity 0.5s ease" }}>
              {section.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}