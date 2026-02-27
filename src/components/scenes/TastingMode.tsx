"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface TastingModeProps {
  locale: Locale;
  onQuickSend: (msg: string) => void;
  onOpenCamera: () => void;
  onOpenCellar: () => void;
}

export default function TastingMode({ locale, onQuickSend, onOpenCamera, onOpenCellar }: TastingModeProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 py-2">
      <button
        onClick={onOpenCamera}
        className="quick-chip px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5"
        style={{
          fontFamily: "'Noto Serif SC', serif",
          color: "var(--wine-deep)",
          border: "1px solid var(--wine-border)",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <span>📷</span>
        {t(locale, "sceneTastePhoto")}
      </button>
      <button
        onClick={onOpenCellar}
        className="quick-chip px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5"
        style={{
          fontFamily: "'Noto Serif SC', serif",
          color: "var(--wine-deep)",
          border: "1px solid var(--wine-border)",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <span>🪵</span>
        {t(locale, "sceneTasteCellar")}
      </button>
    </div>
  );
}
