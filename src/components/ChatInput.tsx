"use client";

import { useRef, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { ImageActionSheet, ImagePreviewBar } from "./ImageWidgets";

/* ─── Image compression utility ─── */
function compressImage(file: File, maxWidth = 1024, quality = 0.7): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas context not available")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve({ base64, mimeType: "image/jpeg" });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export interface PendingImage {
  base64: string;
  mimeType: string;
}

interface ChatInputProps {
  locale: Locale;
  isLoading: boolean;
  onSend: (text: string, image?: PendingImage) => void;
  /** External trigger to open the action sheet (e.g. from scene selector) */
  externalActionSheetOpen?: boolean;
  onExternalActionSheetClosed?: () => void;
}

export default function ChatInput({
  locale,
  isLoading,
  onSend,
  externalActionSheetOpen,
  onExternalActionSheetClosed,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [sendBtnAnimate, setSendBtnAnimate] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Handle external action sheet trigger
  useEffect(() => {
    if (externalActionSheetOpen) {
      setShowActionSheet(true);
    }
  }, [externalActionSheetOpen]);

  // Textarea auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleImageFile = async (file: File) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
    if (!isImage) return;
    setImageLoading(true);
    try {
      let processFile = file;
      if (file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name)) {
        const heic2any = (await import("heic2any")).default;
        const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
        processFile = new File(
          [converted as Blob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );
      }
      const compressed = await compressImage(processFile);
      setPendingImage(compressed);
    } catch (err) {
      console.error("Image processing failed:", err);
    } finally {
      setImageLoading(false);
      setShowActionSheet(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = "";
  };

  const handleSend = () => {
    const text = input.trim();
    const hasImage = !!pendingImage;
    if ((!text && !hasImage) || isLoading) return;
    setSendBtnAnimate(true);
    setTimeout(() => setSendBtnAnimate(false), 400);
    onSend(text || (hasImage ? t(locale, "analyzeImg") : ""), pendingImage || undefined);
    setInput("");
    setPendingImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const closeActionSheet = () => {
    setShowActionSheet(false);
    onExternalActionSheetClosed?.();
  };

  return (
    <>
      {/* Action Sheet */}
      {showActionSheet && (
        <ImageActionSheet
          onClose={closeActionSheet}
          onCamera={() => { closeActionSheet(); setTimeout(() => cameraInputRef.current?.click(), 100); }}
          onGallery={() => { closeActionSheet(); setTimeout(() => galleryInputRef.current?.click(), 100); }}
          locale={locale}
        />
      )}

      {/* Hidden file inputs */}
      <input ref={cameraInputRef} type="file" accept="image/*,.heic,.heif" capture="environment" onChange={handleFileInputChange} className="hidden" />
      <input ref={galleryInputRef} type="file" accept="image/*,.heic,.heif" onChange={handleFileInputChange} className="hidden" />

      {/* Input Area */}
      <div className="footer-decorated px-4 py-4" style={{ paddingBottom: "calc(1.5rem + var(--safe-bottom))" }}>
        {(pendingImage || imageLoading) && (
          <div className="image-preview-bar pb-2">
            {imageLoading ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(139, 34, 82, 0.06)", border: "1px solid var(--wine-border)" }}>
                <div className="image-loading-spinner" />
                <span className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
                  {t(locale, "processingImg")}
                </span>
              </div>
            ) : pendingImage ? (
              <ImagePreviewBar imageSrc={pendingImage.base64} onRemove={() => setPendingImage(null)} altText={t(locale, "preview")} />
            ) : null}
          </div>
        )}

        <div className="input-container flex items-end gap-2 rounded-2xl px-3 py-3" style={{ backgroundColor: "var(--wine-card, #FFFFFF)" }}>
          <button
            id="camera-btn"
            onClick={() => setShowActionSheet(true)}
            disabled={isLoading}
            className="camera-btn flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              backgroundColor: pendingImage ? "var(--wine-deep)" : "transparent",
              border: pendingImage ? "none" : "1.5px solid var(--wine-light)",
            }}
            title={t(locale, "photoBtn")}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke={pendingImage ? "white" : "var(--wine-deep)"} strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={pendingImage ? t(locale, "placeholderImg") : t(locale, "placeholder")}
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent text-sm leading-relaxed sm:text-sm text-base"
            style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-text)", fontSize: "16px" }}
          />

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !pendingImage) || isLoading}
            className={`send-btn flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30 ${sendBtnAnimate ? "send-btn-fly" : ""}`}
            style={{
              backgroundColor: (input.trim() || pendingImage) ? "var(--wine-deep)" : "var(--wine-light)",
              boxShadow: (input.trim() || pendingImage) ? "0 2px 8px rgba(139, 34, 82, 0.3)" : "none",
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, var(--wine-accent))" }} />
          <p className="text-xs text-center" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.45 }}>
            {t(locale, "footer")}
          </p>
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, var(--wine-accent), transparent)" }} />
        </div>
      </div>
    </>
  );
}
