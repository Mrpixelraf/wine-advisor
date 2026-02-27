"use client";

export default function WineGlassLoader({ locale = "zh" }: { locale?: string }) {
  return (
    <div className="wine-glass-loader">
      <div className="glass-bowl">
        <div className="wine-fill" />
      </div>
      <div className="glass-stem" />
      <div className="glass-base" />
      <span className="shimmer-text">
        {locale === "en" ? "Tasting…" : "品鉴中…"}
      </span>
    </div>
  );
}
