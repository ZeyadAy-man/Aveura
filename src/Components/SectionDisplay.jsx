import { memo } from "react";

const SectionDisplay = memo(({ sections, currentSection }) => {
  const getResponsiveOffset = () => {
    if (typeof window === "undefined") return 50;
    const width = window.innerWidth;
    if (width < 640) return 30;
    if (width < 1024) return 40;
    return 60;
  };

  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

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
      default:
        return {
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 20px",
        };
    }
  };

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
      transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
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
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Cinzel', serif",
              willChange: isActive ? "opacity, transform" : "auto",
              overflowX: "hidden",
              zIndex: 2,
              pointerEvents: "none",
              ...containerStyle,
            }}
          >
            <div style={{ ...animStyle, willChange: isActive ? "opacity, transform" : "auto" }}>
              <h1
                style={{
                  fontSize: "clamp(2.25rem, 6.5vw, 5.5rem)",
                  fontWeight: "400",
                  textShadow: "0 0 60px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2), 0 2px 40px rgba(0,0,0,0.9)",
                  marginBottom: "clamp(16px, 3vw, 28px)",
                  letterSpacing: "clamp(2px, 0.12em, 8px)",
                  margin: "0 0 clamp(16px, 3vw, 28px) 0",
                  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 30%, #ffffff 60%, #e8e8e8 100%)",
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
                  textShadow: "0 0 30px rgba(255,255,255,0.15), 0 2px 20px rgba(0,0,0,0.8)",
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

export default SectionDisplay;