"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

/* ─── Image Action Sheet (bottom slide-up) ─── */
export function ImageActionSheet({
  onClose,
  onCamera,
  onGallery,
  locale,
}: {
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  locale: Locale;
}) {
  return (
    <div className="action-sheet-overlay fixed inset-0 z-50" onClick={onClose}>
      <div
        className="action-sheet-content fixed bottom-0 left-0 right-0 z-50 px-4"
        style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="action-sheet-card rounded-2xl overflow-hidden mb-2" style={{ backgroundColor: "var(--wine-cream)" }}>
          <div className="text-center py-3 border-b" style={{ borderColor: "var(--wine-border)" }}>
            <p className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
              {t(locale, "imgSourceTitle")}
            </p>
          </div>
          <button
            onClick={onCamera}
            className="action-sheet-btn w-full py-4 flex items-center justify-center gap-3 border-b transition-colors"
            style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)", borderColor: "var(--wine-border)", fontSize: "15px" }}
          >
            <span className="text-xl">📷</span>
            <span>{t(locale, "imgCamera")}</span>
          </button>
          <button
            onClick={onGallery}
            className="action-sheet-btn w-full py-4 flex items-center justify-center gap-3 transition-colors"
            style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)", fontSize: "15px" }}
          >
            <span className="text-xl">🖼️</span>
            <span>{t(locale, "imgGallery")}</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="action-sheet-card w-full py-4 rounded-2xl text-center transition-colors"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            backgroundColor: "var(--wine-cream)",
            color: "var(--wine-medium)",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          {t(locale, "cancel")}
        </button>
      </div>
    </div>
  );
}

/* ─── Image Preview Bar ─── */
export function ImagePreviewBar({
  imageSrc,
  onRemove,
  altText,
}: {
  imageSrc: string;
  onRemove: () => void;
  altText?: string;
}) {
  return (
    <div className="image-preview-bar px-4 pb-2">
      <div className="image-preview-container inline-block relative">
        <img
          src={imageSrc}
          alt={altText || "Preview"}
          className="image-preview-thumb rounded-xl"
          style={{
            width: 72,
            height: 72,
            objectFit: "cover",
            border: "2px solid var(--wine-border)",
            boxShadow: "0 2px 12px rgba(139, 34, 82, 0.12)",
          }}
        />
        <button
          onClick={onRemove}
          className="image-preview-remove absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: "var(--wine-deep)", boxShadow: "0 2px 6px rgba(139, 34, 82, 0.3)" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ─── Image Lightbox ─── */
export function ImageLightbox({
  src,
  onClose,
  altText,
}: {
  src: string;
  onClose: () => void;
  altText?: string;
}) {
  return (
    <div className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg z-10"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", top: "calc(16px + var(--safe-top))" }}
        onClick={onClose}
      >
        ✕
      </button>
      <img
        src={src}
        alt={altText || "Full size"}
        className="lightbox-image max-w-[92vw] max-h-[85vh] rounded-xl object-contain"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
