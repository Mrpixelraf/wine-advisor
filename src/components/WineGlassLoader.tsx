"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function WineGlassLoader({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="wine-glass-loader">
      <div className="glass-bowl">
        <div className="wine-fill" />
      </div>
      <div className="glass-stem" />
      <div className="glass-base" />
      <span className="shimmer-text">
        {t(locale, "analyzing")}
      </span>
    </div>
  );
}
