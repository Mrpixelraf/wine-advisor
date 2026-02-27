"use client";

// IdentifyMode: This scene directly opens camera — handled by parent.
// This component exists for consistency but is minimal.

import type { Locale } from "@/lib/i18n";

interface IdentifyModeProps {
  locale: Locale;
  onOpenCamera: () => void;
}

export default function IdentifyMode({ locale, onOpenCamera }: IdentifyModeProps) {
  return (
    <div className="flex justify-center px-4 py-2">
      <button
        onClick={onOpenCamera}
        className="quick-chip px-4 py-2 rounded-full text-xs transition-all flex items-center gap-2"
        style={{
          fontFamily: "'Noto Serif SC', serif",
          color: "var(--wine-deep)",
          border: "1px solid var(--wine-border)",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <span>📷</span>
        <span>{locale === "en" ? "Take Photo" : "拍照识酒"}</span>
      </button>
    </div>
  );
}
