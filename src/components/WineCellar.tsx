"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { WineEntry, WineTags } from "@/lib/types";
import { TASTING_TAG_CATEGORIES } from "@/lib/types";
import { MarkdownContent } from "./MessageBubble";
import ConfirmDialog from "./ConfirmDialog";

/* ─── Wine Detail View ─── */
function WineDetailView({
  wine,
  onClose,
  locale,
}: {
  wine: WineEntry;
  onClose: () => void;
  locale: Locale;
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const getRatingColor = (val: number) => {
    if (val < 40) return "var(--wine-rating-low)";
    if (val < 70) return "var(--wine-rating-mid)";
    return "var(--wine-rating-high)";
  };

  const hasTags = wine.tags && Object.values(wine.tags).some((arr) => arr && arr.length > 0);

  return (
    <div
      className={`fixed inset-0 z-50 ${isClosing ? "wine-detail-slide-down" : "wine-detail-slide-up"}`}
      style={{ backgroundColor: "var(--wine-cream)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ paddingTop: "calc(16px + var(--safe-top))" }}>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all wine-hover-bg active:scale-95"
          style={{ color: "var(--wine-deep)" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="text-base font-semibold" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
          {t(locale, "wineDetailTitle")}
        </h2>
        <div className="w-10" />
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto px-5 pb-12" style={{ height: "calc(var(--app-height, 100vh) - 80px)", WebkitOverflowScrolling: "touch" }}>
        {/* Hero image */}
        {wine.image ? (
          <div className="flex justify-center mb-5">
            <img
              src={wine.image}
              alt={wine.name}
              className="rounded-2xl object-cover"
              style={{ width: "100%", maxHeight: 280, objectFit: "cover", border: "1px solid var(--wine-border)", boxShadow: "var(--wine-shadow-md)" }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center mb-5 rounded-2xl" style={{ height: 160, backgroundColor: "var(--wine-subtle-bg-lighter)", border: "1px solid var(--wine-border)" }}>
            <span className="text-6xl opacity-20">🍷</span>
          </div>
        )}

        {/* Wine name + rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-xl font-bold leading-tight flex-1" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
            {wine.name}
          </h3>
          {wine.rating != null && (
            <div className="flex-shrink-0 flex flex-col items-center">
              <span className="text-4xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: getRatingColor(wine.rating), lineHeight: 1 }}>
                {wine.rating}
              </span>
              <span className="text-xs mt-0.5" style={{ color: "var(--wine-accent)" }}>/100</span>
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-subtle-bg)", color: "var(--wine-accent)" }}>
            📅 {wine.date}
          </span>
          {wine.region && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-subtle-bg)", color: "var(--wine-accent)" }}>
              📍 {wine.region}
            </span>
          )}
          {wine.grape && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-subtle-bg)", color: "var(--wine-accent)" }}>
              🍇 {wine.grape}
            </span>
          )}
          {wine.price && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-subtle-bg)", color: "var(--wine-accent)" }}>
              💰 {wine.price}
            </span>
          )}
        </div>

        {/* Tasting Tags */}
        {hasTags && (
          <div className="mb-5">
            <div className="wine-divider mb-3">
              <span className="text-xs px-3 whitespace-nowrap" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
                {t(locale, "tastingNotesLabel")}
              </span>
            </div>
            {TASTING_TAG_CATEGORIES.map((category) => {
              const tags = wine.tags?.[category.key];
              if (!tags || tags.length === 0) return null;
              const zhToEn: Record<string, string> = {};
              category.tags.forEach((t) => { zhToEn[t.zh] = t.en; });
              return (
                <div key={category.key} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm">{category.emoji}</span>
                    <span className="text-xs font-medium" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
                      {locale === "en" ? category.label.en : category.label.zh}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-xs" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-deep)", color: "#FFFFFF" }}>
                        {locale === "en" ? (zhToEn[tag] || tag) : tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User Notes */}
        {wine.userNotes && (
          <div className="mb-5">
            <div className="wine-divider mb-3">
              <span className="text-xs px-3 whitespace-nowrap" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
                {t(locale, "myNotesLabel")}
              </span>
            </div>
            <div className="p-4 rounded-2xl text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-card, #FFFFFF)", color: "var(--wine-text)", border: "1px solid var(--wine-border)", whiteSpace: "pre-wrap" }}>
              {wine.userNotes}
            </div>
          </div>
        )}

        {/* AI Notes */}
        {wine.aiNotes && (
          <div className="mb-5">
            <div className="wine-divider mb-3">
              <span className="text-xs px-3 whitespace-nowrap" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
                {t(locale, "aiTastingNotesLabel")}
              </span>
            </div>
            <div className="p-4 rounded-2xl text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-card, #FFFFFF)", color: "var(--wine-bubble-text)", border: "1px solid var(--wine-border)" }}>
              <MarkdownContent content={wine.aiNotes} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Wine Cellar Page ─── */
export default function CellarPage({
  visible,
  onClose,
  cellar,
  onDelete,
  locale,
}: {
  visible: boolean;
  onClose: () => void;
  cellar: WineEntry[];
  onDelete: (id: string) => void;
  locale: Locale;
}) {
  const [activeTab, setActiveTab] = useState<"drinking" | "wishlist">("drinking");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedWine, setSelectedWine] = useState<WineEntry | null>(null);

  const filtered = cellar.filter((w) => w.type === activeTab).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!visible) return null;

  return (
    <div className={`cellar-page fixed inset-0 z-40 ${visible ? "cellar-visible" : ""}`} style={{ backgroundColor: "var(--wine-cream)" }}>
      {/* Header */}
      <div className="cellar-header flex items-center justify-between px-4 pt-4 pb-3" style={{ paddingTop: "calc(16px + var(--safe-top))" }}>
        <div className="w-10" />
        <h2 className="text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
          <span style={{ color: "var(--wine-gold-warm)" }}>✦</span> {t(locale, "cellarTitle")} <span style={{ color: "var(--wine-gold-warm)" }}>✦</span>
        </h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-all wine-hover-bg active:scale-95" style={{ color: "var(--wine-deep)" }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="cellar-tabs flex relative mx-4 mb-4 rounded-xl overflow-hidden" style={{ backgroundColor: "var(--wine-subtle-bg)" }}>
        <div
          className="cellar-tab-indicator absolute top-1 bottom-1 rounded-lg transition-all duration-300"
          style={{
            width: "calc(50% - 4px)",
            left: activeTab === "drinking" ? "4px" : "calc(50% + 0px)",
            backgroundColor: "var(--wine-card, #FFFFFF)",
            boxShadow: "var(--wine-shadow)",
          }}
        />
        <button
          onClick={() => setActiveTab("drinking")}
          className="cellar-tab-btn flex-1 py-3 text-sm text-center relative z-10 transition-colors"
          style={{ fontFamily: "'Noto Serif SC', serif", color: activeTab === "drinking" ? "var(--wine-deep)" : "var(--wine-accent)", fontWeight: activeTab === "drinking" ? 600 : 400 }}
        >
          {t(locale, "cellarDrinking")}
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className="cellar-tab-btn flex-1 py-3 text-sm text-center relative z-10 transition-colors"
          style={{ fontFamily: "'Noto Serif SC', serif", color: activeTab === "wishlist" ? "var(--wine-deep)" : "var(--wine-accent)", fontWeight: activeTab === "wishlist" ? 600 : 400 }}
        >
          {t(locale, "cellarWishlist")}
        </button>
      </div>

      {/* Wine list */}
      <div className="flex-1 overflow-y-auto px-4 pb-8" style={{ height: "calc(var(--app-height, 100vh) - 160px)" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center" style={{ minHeight: 300 }}>
            <div className="text-6xl mb-4 opacity-30">🍷</div>
            <p className="text-sm mb-1" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
              {activeTab === "drinking" ? t(locale, "cellarEmptyDrinking") : t(locale, "cellarEmptyWishlist")}
            </p>
            <p className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.6 }}>
              {t(locale, "cellarEmptyHint")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((wine) => (
              <div
                key={wine.id}
                className="cellar-card flex gap-3 p-3 rounded-2xl transition-all cursor-pointer active:scale-[0.98]"
                style={{ backgroundColor: "var(--wine-card, #FFFFFF)", boxShadow: "var(--wine-shadow-card)", border: "1px solid var(--wine-cellar-card-border)" }}
                onClick={() => setSelectedWine(wine)}
                onContextMenu={(e) => { e.preventDefault(); setDeleteConfirmId(wine.id); }}
              >
                {wine.image ? (
                  <img src={wine.image} alt={wine.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid var(--wine-border)" }} />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl" style={{ backgroundColor: "var(--wine-subtle-bg)" }}>🍷</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold truncate" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>{wine.name}</h4>
                    {wine.rating && (
                      <span className="cellar-rating-badge flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: wine.rating >= 70 ? "var(--wine-deep)" : wine.rating >= 40 ? "var(--wine-gold-warm)" : "var(--wine-rating-low)" }}>
                        {wine.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--wine-accent)" }}>
                    {wine.date}
                    {wine.region && ` · ${wine.region}`}
                    {wine.grape && ` · ${wine.grape}`}
                  </p>
                  {(wine.userNotes || wine.aiNotes) && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--wine-accent)", opacity: 0.8 }}>
                      {wine.userNotes || (wine.aiNotes ? wine.aiNotes.slice(0, 60) + "..." : "")}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(wine.id); }}
                  className="flex-shrink-0 self-center w-8 h-8 rounded-full flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--wine-deep)" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirmId && (
        <ConfirmDialog
          message={t(locale, "cellarDeleteConfirm")}
          onConfirm={() => { onDelete(deleteConfirmId); setDeleteConfirmId(null); }}
          onCancel={() => setDeleteConfirmId(null)}
          cancelText={t(locale, "cancel")}
          confirmText={t(locale, "confirm")}
        />
      )}

      {selectedWine && <WineDetailView wine={selectedWine} onClose={() => setSelectedWine(null)} locale={locale} />}
    </div>
  );
}
