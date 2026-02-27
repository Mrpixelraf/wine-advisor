import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sommé 颂美 — Your Personal AI Sommelier";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2D1B30 0%, #1E1A2B 40%, #3D1F35 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Wine glass emoji */}
        <div style={{ fontSize: 96, marginBottom: 16 }}>🍷</div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#C9A96E", fontSize: 28 }}>✦</span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#F0EDE8",
              letterSpacing: 4,
            }}
          >
            Sommé 颂美
          </span>
          <span style={{ color: "#C9A96E", fontSize: 28 }}>✦</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#C9A96E",
            marginBottom: 24,
            letterSpacing: 2,
          }}
        >
          Your Personal AI Sommelier
        </div>

        {/* Slogan */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(240, 237, 232, 0.6)",
            letterSpacing: 1,
          }}
        >
          好酒不必懂，懂你就够了
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 14,
            color: "rgba(240, 237, 232, 0.3)",
            letterSpacing: 1,
          }}
        >
          Powered by Raymo Tech 瑞莫科技
        </div>
      </div>
    ),
    { ...size }
  );
}
