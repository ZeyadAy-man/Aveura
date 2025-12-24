import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function LuxuryLoader() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      // Smooth fade-out delay
      const timeout = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "radial-gradient(circle at center, #111 0%, #050505 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily:
          "'Playfair Display', 'Cormorant Garamond', serif",
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: progress === 100 ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        {/* Brand / Title */}
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontWeight: 400,
            letterSpacing: "0.25em",
            marginBottom: "20px",
            fontStyle: "italic",
            background:
              "linear-gradient(135deg, #fff, #e6d8a2, #fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LOADING
        </h1>

        {/* Progress Bar */}
        <div
          style={{
            width: "220px",
            height: "3px",
            background: "rgba(255,255,255,0.2)",
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, #d4af37, #fff, #d4af37)",
              transition: "width 0.2s ease",
            }}
          />
        </div>

        {/* Percentage */}
        <div
          style={{
            marginTop: "14px",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            opacity: 0.7,
          }}
        >
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
}
