"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { WineTags } from "@/lib/types";
import { TASTING_TAG_CATEGORIES } from "@/lib/types";

export default function RatingModal({
  wineName,
  onSubmit,
  onClose,
  locale,
}: {
  wineName: string;
  onSubmit: (rating: number, notes: string, tags: WineTags) => void;
  onClose: () => void;
  locale: Locale;
}) {
  const [rating, setRating] = useState(75);
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<WineTags>({});

  const getRatingColor = (val: number) => {
    if (val < 40) return "#999";
    if (val < 70) return "#C9A96E";
    return "#8B2252";
  };

  const toggleTag = (category: keyof WineTags, tag: string) => {
    setSelectedTags((prev) => {
      const current = prev[category] || [];
      const exists = current.includes(tag);
      return {
        ...prev,
        [category]: exists ? current.filter((t) => t !== tag) : [...current, tag],
      };
    });
  };

  const isTagSelected = (category: keyof WineTags, tag: string) => {
    return (selectedTags[category] || []).includes(tag);
  };

  return (
    <div className="rating-overlay fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="rating-modal w-full max-w-md mx-4 rounded-t-3xl"
        style={{ backgroundColor: "var(--wine-cream)", marginBottom: 0, maxHeight: "85vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-semibold" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
              {t(locale, "ratingTitle")}
            </h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(114,47,55,0.08)", color: "var(--wine-deep)" }}>
              ✕
            </button>
          </div>
          <p className="text-sm mb-4" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
            {wineName}
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* Rating slider */}
          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
                {t(locale, "ratingLabel")}
              </span>
              <span className="text-3xl font-bold transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif", color: getRatingColor(rating) }}>
                {rating}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rating-slider w-full"
              style={{ accentColor: getRatingColor(rating) }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: "#999" }}>1</span>
              <span className="text-xs" style={{ color: "#999" }}>100</span>
            </div>
          </div>

          {/* Tasting Tags */}
          <div className="mb-5">
            {TASTING_TAG_CATEGORIES.map((category) => (
              <div key={category.key} className="mb-4 last:mb-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">{category.emoji}</span>
                  <span className="text-xs font-medium" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
                    {locale === "en" ? category.label.en : category.label.zh}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => {
                    const tagValue = tag.zh;
                    const tagDisplay = locale === "en" ? tag.en : tag.zh;
                    const selected = isTagSelected(category.key, tagValue);
                    return (
                      <button
                        key={tagValue}
                        onClick={() => toggleTag(category.key, tagValue)}
                        className="tasting-chip px-3 py-1.5 rounded-full text-xs transition-all active:scale-95"
                        style={{
                          fontFamily: "'Noto Serif SC', serif",
                          backgroundColor: selected ? "var(--wine-deep)" : "rgba(114,47,55,0.06)",
                          color: selected ? "#FFFFFF" : "var(--wine-text)",
                          border: selected ? "1px solid var(--wine-deep)" : "1px solid var(--wine-border)",
                          fontWeight: selected ? 500 : 400,
                        }}
                      >
                        {tagDisplay}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Notes input */}
          <div className="mb-5">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(locale, "ratingNotes")}
              rows={3}
              className="w-full p-3 rounded-xl text-sm resize-none outline-none border transition-all"
              style={{ fontFamily: "'Noto Serif SC', serif", borderColor: "var(--wine-border)", color: "var(--wine-text)", backgroundColor: "var(--wine-card, #FFFFFF)" }}
            />
          </div>

          {/* Submit button */}
          <button
            onClick={() => onSubmit(rating, notes, selectedTags)}
            className="w-full py-3.5 rounded-2xl text-white text-sm font-medium transition-all active:scale-[0.97]"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              background: "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
              boxShadow: "0 4px 16px rgba(139, 34, 82, 0.3)",
            }}
          >
            {t(locale, "ratingSave")}
          </button>
        </div>
      </div>
    </div>
  );
}
