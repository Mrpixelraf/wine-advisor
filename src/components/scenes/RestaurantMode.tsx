"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface RestaurantModeProps {
  locale: Locale;
  onQuickSend: (msg: string) => void;
}

export default function RestaurantMode({ locale, onQuickSend }: RestaurantModeProps) {
  const chips = [
    t(locale, "sceneRestChinese"),
    t(locale, "sceneRestWestern"),
    t(locale, "sceneRestJapanese"),
    t(locale, "sceneRestBBQ"),
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 py-2">
      {chips.map((chip, idx) => (
        <button
          key={chip}
          onClick={() => onQuickSend(chip)}
          className="quick-chip px-3 py-1.5 rounded-full text-xs transition-all"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: "var(--wine-deep)",
            border: "1px solid var(--wine-border)",
            background: "rgba(255,255,255,0.5)",
            animationDelay: `${idx * 0.05}s`,
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
