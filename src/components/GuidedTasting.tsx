"use client";

import { useState, useEffect, useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type {
  TastingLevel,
  GuidedTastingData,
  WineEntry,
  WineTags,
} from "@/lib/types";
import {
  TASTING_STEPS,
  TASTING_LEVEL_KEY,
  APPEARANCE_COLORS,
  APPEARANCE_CLARITY,
  AROMA_CATEGORIES,
  PALATE_TEXTURES,
  PALATE_SWEETNESS,
  FINISH_LENGTHS,
  FINISH_DESCRIPTORS,
} from "@/lib/types";

/* ─── Props ─── */
interface GuidedTastingProps {
  locale: Locale;
  wineName: string;
  wineImage?: string;
  onComplete: (entry: WineEntry) => void;
  onExit: () => void;
}

/* ─── Helper: get guidance text by step + level ─── */
type GuidanceKey =
  | "guidanceAppearanceBeginner" | "guidanceAromaBeginner" | "guidancePalateBeginner" | "guidanceFinishBeginner"
  | "guidanceAppearanceIntermediate" | "guidanceAromaIntermediate" | "guidancePalateIntermediate" | "guidanceFinishIntermediate"
  | "guidanceAppearanceExpert" | "guidanceAromaExpert" | "guidancePalateExpert" | "guidanceFinishExpert"
  | "teachAppearanceBeginner" | "teachAromaBeginner" | "teachPalateBeginner" | "teachFinishBeginner"
  | "teachAppearanceIntermediate" | "teachAromaIntermediate" | "teachPalateIntermediate" | "teachFinishIntermediate"
  | "teachAppearanceExpert" | "teachAromaExpert" | "teachPalateExpert" | "teachFinishExpert";

function getGuidance(locale: Locale, step: string, level: TastingLevel): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const key = `guidance${capitalize(step)}${capitalize(level)}` as GuidanceKey;
  return t(locale, key as Parameters<typeof t>[1]);
}

function getTeaching(locale: Locale, step: string, level: TastingLevel): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const key = `teach${capitalize(step)}${capitalize(level)}` as GuidanceKey;
  return t(locale, key as Parameters<typeof t>[1]);
}

/* ─── Component ─── */
export default function GuidedTasting({
  locale,
  wineName,
  wineImage,
  onComplete,
  onExit,
}: GuidedTastingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [level, setLevel] = useState<TastingLevel>("beginner");
  const [showLevelMenu, setShowLevelMenu] = useState(false);

  // Tasting data
  const [data, setData] = useState<GuidedTastingData>({
    wineName,
    wineImage,
    level: "beginner",
    appearance: { color: [], clarity: [] },
    aroma: { primary: [], secondary: [], intensity: 3 },
    palate: { acidity: 3, tannin: 3, body: 3, texture: [], sweetness: "" },
    finish: { length: "", descriptors: [], overallScore: 75 },
  });

  // Aroma expanded categories
  const [expandedAroma, setExpandedAroma] = useState<string[]>([]);

  // Summary / report state
  const [showSummary, setShowSummary] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);

  // Load level from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TASTING_LEVEL_KEY) as TastingLevel | null;
      if (saved && ["beginner", "intermediate", "expert"].includes(saved)) {
        setLevel(saved);
        setData((d) => ({ ...d, level: saved }));
      }
    } catch {}
  }, []);

  // Save level
  const changeLevel = useCallback((newLevel: TastingLevel) => {
    setLevel(newLevel);
    setData((d) => ({ ...d, level: newLevel }));
    setShowLevelMenu(false);
    try {
      localStorage.setItem(TASTING_LEVEL_KEY, newLevel);
    } catch {}
  }, []);

  const step = TASTING_STEPS[currentStep];

  /* ── Tag toggle helpers ── */
  const toggleAppearanceColor = (tag: string) => {
    setData((d) => ({
      ...d,
      appearance: {
        ...d.appearance,
        color: d.appearance.color.includes(tag)
          ? d.appearance.color.filter((c) => c !== tag)
          : [...d.appearance.color, tag],
      },
    }));
  };

  const toggleAppearanceClarity = (tag: string) => {
    setData((d) => ({
      ...d,
      appearance: {
        ...d.appearance,
        clarity: d.appearance.clarity.includes(tag)
          ? d.appearance.clarity.filter((c) => c !== tag)
          : [...d.appearance.clarity, tag],
      },
    }));
  };

  const toggleAromaPrimary = (tag: string) => {
    setExpandedAroma((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setData((d) => ({
      ...d,
      aroma: {
        ...d.aroma,
        primary: d.aroma.primary.includes(tag)
          ? d.aroma.primary.filter((t) => t !== tag)
          : [...d.aroma.primary, tag],
      },
    }));
  };

  const toggleAromaSecondary = (tag: string) => {
    setData((d) => ({
      ...d,
      aroma: {
        ...d.aroma,
        secondary: d.aroma.secondary.includes(tag)
          ? d.aroma.secondary.filter((t) => t !== tag)
          : [...d.aroma.secondary, tag],
      },
    }));
  };

  const togglePalateTexture = (tag: string) => {
    setData((d) => ({
      ...d,
      palate: {
        ...d.palate,
        texture: d.palate.texture.includes(tag)
          ? d.palate.texture.filter((t) => t !== tag)
          : [...d.palate.texture, tag],
      },
    }));
  };

  const toggleFinishDescriptor = (tag: string) => {
    setData((d) => ({
      ...d,
      finish: {
        ...d.finish,
        descriptors: d.finish.descriptors.includes(tag)
          ? d.finish.descriptors.filter((t) => t !== tag)
          : [...d.finish.descriptors, tag],
      },
    }));
  };

  /* ── Navigation ── */
  const goNext = () => {
    if (currentStep < TASTING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete → show summary
      setShowSummary(true);
      generateReport();
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /* ── Generate AI tasting report ── */
  const generateReport = async () => {
    setGeneratingReport(true);
    setAiReport("");

    const prompt = locale === "zh"
      ? `作为专业侍酒师，请根据以下品鉴数据为"${data.wineName}"生成一份简洁的品鉴笔记（150-250字）。

外观：颜色 ${data.appearance.color.join("、")}，清澈度 ${data.appearance.clarity.join("、")}
闻香：${data.aroma.primary.join("、")}${data.aroma.secondary.length > 0 ? `，具体有${data.aroma.secondary.join("、")}` : ""}，香气强度 ${data.aroma.intensity}/5
口感：酸度 ${data.palate.acidity}/5，单宁 ${data.palate.tannin}/5，酒体 ${data.palate.body}/5，${data.palate.texture.join("、")}，${data.palate.sweetness}
余味：${data.finish.length}，${data.finish.descriptors.join("、")}
整体评分：${data.finish.overallScore}/100

请用${level === "beginner" ? "通俗易懂的语言" : level === "intermediate" ? "半专业的语言" : "专业品鉴术语"}撰写。包含外观、闻香、口感、余味四段和最终总结。`
      : `As a professional sommelier, generate concise tasting notes (150-250 words) for "${data.wineName}" based on these tasting data:

Appearance: Color ${data.appearance.color.join(", ")}, Clarity ${data.appearance.clarity.join(", ")}
Nose: ${data.aroma.primary.join(", ")}${data.aroma.secondary.length > 0 ? `, specifically ${data.aroma.secondary.join(", ")}` : ""}, Intensity ${data.aroma.intensity}/5
Palate: Acidity ${data.palate.acidity}/5, Tannin ${data.palate.tannin}/5, Body ${data.palate.body}/5, ${data.palate.texture.join(", ")}, ${data.palate.sweetness}
Finish: ${data.finish.length}, ${data.finish.descriptors.join(", ")}
Overall Score: ${data.finish.overallScore}/100

Write in ${level === "beginner" ? "accessible, everyday language" : level === "intermediate" ? "semi-professional terms" : "professional tasting terminology"}. Include sections for Appearance, Nose, Palate, Finish, and a final summary.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          locale,
        }),
      });

      if (!response.ok) {
        setAiReport(locale === "zh" ? "品鉴笔记生成失败，请稍后重试" : "Failed to generate notes. Please try again.");
        setGeneratingReport(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const d = line.slice(6);
            if (d === "[DONE]") continue;
            try {
              const parsed = JSON.parse(d);
              fullContent += parsed.content || "";
              setAiReport(fullContent);
            } catch {}
          }
        }
      }
    } catch {
      setAiReport(locale === "zh" ? "品鉴笔记生成失败，请稍后重试" : "Failed to generate notes. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  /* ── Save to cellar ── */
  const handleSaveToCellar = () => {
    const tags: WineTags = {
      appearance: [...data.appearance.color, ...data.appearance.clarity],
      aroma: [...data.aroma.primary, ...data.aroma.secondary],
      palate: [...data.palate.texture, data.palate.sweetness].filter(Boolean),
      finish: [data.finish.length, ...data.finish.descriptors].filter(Boolean),
    };

    const entry: WineEntry = {
      id: Date.now().toString(),
      name: data.wineName,
      image: data.wineImage,
      type: "drinking",
      rating: data.finish.overallScore,
      userNotes: "",
      aiNotes: aiReport,
      date: new Date().toISOString().split("T")[0],
      tags,
    };

    onComplete(entry);
  };

  /* ─── Localized tag display ─── */
  const tagLabel = (tag: { zh: string; en: string }) =>
    locale === "en" ? tag.en : tag.zh;

  /* ─── Slider Component ─── */
  const TastingSlider = ({
    value,
    onChange,
    min = 1,
    max = 5,
    leftLabel,
    rightLabel,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    leftLabel: string;
    rightLabel: string;
    label: string;
  }) => (
    <div className="tasting-slider-container mb-4">
      <div className="flex justify-between items-baseline mb-2">
        <span
          className="text-xs font-medium"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: "var(--wine-deep)",
          }}
        >
          {label}
        </span>
        <span
          className="text-sm font-bold"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "var(--wine-gold-warm)",
          }}
        >
          {value}{max > 5 ? "" : `/${max}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rating-slider w-full"
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: "var(--wine-secondary-text)" }}>
          {leftLabel}
        </span>
        <span className="text-xs" style={{ color: "var(--wine-secondary-text)" }}>
          {rightLabel}
        </span>
      </div>
    </div>
  );

  /* ─── Render: Summary view ─── */
  if (showSummary) {
    return (
      <div
        className="guided-tasting-container"
        style={{ backgroundColor: "var(--wine-cream)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <button
            onClick={() => setShowSummary(false)}
            className="text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-deep)",
              backgroundColor: "var(--wine-hover-bg)",
            }}
          >
            ← {t(locale, "backToTasting")}
          </button>
          <h2
            className="text-base font-semibold"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-deep)",
            }}
          >
            {t(locale, "tastingSummaryTitle")}
          </h2>
          <div style={{ width: 80 }} />
        </div>

        {/* Wine name + score */}
        <div className="px-4 pt-2 pb-3 text-center">
          <p
            className="text-sm mb-1"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-accent)",
            }}
          >
            {data.wineName}
          </p>
          <div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full"
            style={{
              background: "var(--wine-action-bg)",
              border: "1px solid var(--wine-action-border-color)",
            }}
          >
            <span className="text-lg">🏆</span>
            <span
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "var(--wine-deep)",
              }}
            >
              {data.finish.overallScore}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--wine-secondary-text)" }}
            >
              /100
            </span>
          </div>
        </div>

        {/* Report */}
        <div
          className="tasting-summary mx-4 mb-4 p-4 rounded-2xl"
          style={{
            backgroundColor: "var(--wine-card)",
            border: "1px solid var(--wine-border)",
            boxShadow: "var(--wine-shadow-card)",
          }}
        >
          {generatingReport ? (
            <div className="flex items-center gap-2 py-4 justify-center">
              <div className="image-loading-spinner" />
              <span
                className="text-sm"
                style={{
                  fontFamily: "'Noto Serif SC', serif",
                  color: "var(--wine-accent)",
                }}
              >
                {t(locale, "generatingNotes")}
              </span>
            </div>
          ) : null}
          {aiReport && (
            <div
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                fontFamily: "'Noto Serif SC', serif",
                color: "var(--wine-text)",
              }}
            >
              {aiReport}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="px-4 pb-6">
          <button
            onClick={handleSaveToCellar}
            disabled={generatingReport}
            className="w-full py-3.5 rounded-2xl text-white text-sm font-medium transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              background:
                "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
              boxShadow: "var(--wine-shadow-strong)",
            }}
          >
            🍷 {t(locale, "saveToCellar")}
          </button>
        </div>
      </div>
    );
  }

  /* ─── Render: Main tasting view ─── */
  return (
    <div
      className="guided-tasting-container"
      style={{ backgroundColor: "var(--wine-cream)" }}
    >
      {/* ── Top bar: exit + level selector ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <button
          onClick={onExit}
          className="text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: "var(--wine-deep)",
            backgroundColor: "var(--wine-hover-bg)",
          }}
        >
          ✕ {t(locale, "exitGuidedTasting")}
        </button>

        {/* Level selector */}
        <div className="relative">
          <button
            onClick={() => setShowLevelMenu(!showLevelMenu)}
            className="tasting-level-selector text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-deep)",
              backgroundColor: "var(--wine-subtle-bg)",
              border: "1px solid var(--wine-border)",
            }}
          >
            {t(locale, level === "beginner" ? "levelBeginner" : level === "intermediate" ? "levelIntermediate" : "levelExpert")} ▾
          </button>
          {showLevelMenu && (
            <div
              className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden"
              style={{
                backgroundColor: "var(--wine-card)",
                border: "1px solid var(--wine-border)",
                boxShadow: "var(--wine-shadow-lg)",
                minWidth: 140,
              }}
            >
              {(["beginner", "intermediate", "expert"] as TastingLevel[]).map(
                (l) => (
                  <button
                    key={l}
                    onClick={() => changeLevel(l)}
                    className="block w-full text-left px-4 py-2.5 text-xs transition-colors"
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      color: l === level ? "var(--wine-deep)" : "var(--wine-text)",
                      backgroundColor: l === level ? "var(--wine-hover-bg)" : "transparent",
                    }}
                  >
                    {t(locale, l === "beginner" ? "levelBeginner" : l === "intermediate" ? "levelIntermediate" : "levelExpert")}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Wine name */}
      <div className="px-4 pb-2 text-center">
        <p
          className="text-xs"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: "var(--wine-accent)",
          }}
        >
          {wineName}
        </p>
      </div>

      {/* ── Progress bar ── */}
      <div className="tasting-progress px-6 pb-4">
        <div className="flex items-center justify-between">
          {TASTING_STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center" style={{ flex: i < TASTING_STEPS.length - 1 ? 1 : "none" }}>
              {/* Step node */}
              <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
                <div
                  className={`tasting-progress-step ${i < currentStep ? "completed" : ""} ${i === currentStep ? "active" : ""}`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    border: i <= currentStep ? "2px solid var(--wine-gold-warm)" : "2px solid var(--wine-border)",
                    backgroundColor: i <= currentStep ? "var(--wine-gold-warm)" : "transparent",
                    color: i <= currentStep ? "#fff" : "var(--wine-secondary-text)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {i < currentStep ? "✓" : s.emoji}
                </div>
                <span
                  className="text-xs mt-1"
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    color: i === currentStep ? "var(--wine-deep)" : "var(--wine-secondary-text)",
                    fontWeight: i === currentStep ? 600 : 400,
                    transition: "all 0.3s ease",
                  }}
                >
                  {t(locale, s.labelKey as Parameters<typeof t>[1])}
                </span>
              </div>
              {/* Connecting line */}
              {i < TASTING_STEPS.length - 1 && (
                <div
                  className="flex-1 mx-1"
                  style={{
                    height: 2,
                    backgroundColor: i < currentStep ? "var(--wine-gold-warm)" : "var(--wine-border)",
                    transition: "background-color 0.3s ease",
                    marginBottom: 18,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Step content area ── */}
      <div className="tasting-step-content flex-1 overflow-y-auto px-4 pb-4" style={{ WebkitOverflowScrolling: "touch" }}>
        {/* AI guidance bubble */}
        <div
          className="mb-4 p-4 rounded-2xl"
          style={{
            background: "var(--wine-action-bg)",
            border: "1px solid var(--wine-action-border-color)",
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-text)",
            }}
          >
            {step.emoji}{" "}
            {getGuidance(locale, step.key, level)}
          </p>
          <p
            className="text-xs mt-2 leading-relaxed"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-accent)",
              fontStyle: "italic",
            }}
          >
            💡 {getTeaching(locale, step.key, level)}
          </p>
        </div>

        {/* ── Step 1: Appearance ── */}
        {step.key === "appearance" && (
          <div className="tasting-step-appearance">
            {/* Color tags */}
            <div className="mb-4">
              <span
                className="text-xs font-medium mb-2 block"
                style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}
              >
                {t(locale, "colorLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {APPEARANCE_COLORS.map((c) => {
                  const selected = data.appearance.color.includes(c.zh);
                  return (
                    <button
                      key={c.zh}
                      onClick={() => toggleAppearanceColor(c.zh)}
                      className={`tasting-tag-primary ${selected ? "tasting-tag-selected" : ""}`}
                    >
                      {tagLabel(c)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clarity tags */}
            <div className="mb-4">
              <span
                className="text-xs font-medium mb-2 block"
                style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}
              >
                {t(locale, "clarityLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {APPEARANCE_CLARITY.map((c) => {
                  const selected = data.appearance.clarity.includes(c.zh);
                  return (
                    <button
                      key={c.zh}
                      onClick={() => toggleAppearanceClarity(c.zh)}
                      className={`tasting-tag-primary ${selected ? "tasting-tag-selected" : ""}`}
                    >
                      {tagLabel(c)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Aroma ── */}
        {step.key === "aroma" && (
          <div className="tasting-step-aroma">
            {AROMA_CATEGORIES.map((cat) => {
              const isPrimarySelected = data.aroma.primary.includes(cat.label.zh);
              const isExpanded = expandedAroma.includes(cat.label.zh);
              return (
                <div key={cat.key} className="mb-3">
                  {/* Primary tag */}
                  <button
                    onClick={() => toggleAromaPrimary(cat.label.zh)}
                    className={`tasting-tag-primary ${isPrimarySelected ? "tasting-tag-selected" : ""}`}
                  >
                    {cat.emoji} {tagLabel(cat.label)}
                  </button>

                  {/* Secondary tags (expanded) */}
                  <div
                    className="tasting-secondary-expand"
                    style={{
                      maxHeight: isExpanded ? 200 : 0,
                      opacity: isExpanded ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease",
                      marginTop: isExpanded ? 8 : 0,
                      paddingLeft: 12,
                    }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {cat.secondary.map((s) => {
                        const selected = data.aroma.secondary.includes(s.zh);
                        return (
                          <button
                            key={s.zh}
                            onClick={() => toggleAromaSecondary(s.zh)}
                            className={`tasting-tag-secondary ${selected ? "tasting-tag-selected" : ""}`}
                          >
                            {tagLabel(s)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Intensity slider */}
            <div className="mt-4">
              <TastingSlider
                value={data.aroma.intensity}
                onChange={(v) =>
                  setData((d) => ({ ...d, aroma: { ...d.aroma, intensity: v } }))
                }
                label={t(locale, "aromaIntensity")}
                leftLabel={t(locale, "aromaIntensityLight")}
                rightLabel={t(locale, "aromaIntensityStrong")}
              />
            </div>
          </div>
        )}

        {/* ── Step 3: Palate ── */}
        {step.key === "palate" && (
          <div className="tasting-step-palate">
            <TastingSlider
              value={data.palate.acidity}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  palate: { ...d.palate, acidity: v },
                }))
              }
              label={t(locale, "acidityLabel")}
              leftLabel={t(locale, "acidityLow")}
              rightLabel={t(locale, "acidityHigh")}
            />

            <TastingSlider
              value={data.palate.tannin}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  palate: { ...d.palate, tannin: v },
                }))
              }
              label={t(locale, "tanninLabel")}
              leftLabel={t(locale, "tanninSoft")}
              rightLabel={t(locale, "tanninFirm")}
            />

            <TastingSlider
              value={data.palate.body}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  palate: { ...d.palate, body: v },
                }))
              }
              label={t(locale, "bodyLabel")}
              leftLabel={t(locale, "bodyLight")}
              rightLabel={t(locale, "bodyFull")}
            />

            {/* Texture tags */}
            <div className="mb-4">
              <span
                className="text-xs font-medium mb-2 block"
                style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}
              >
                {t(locale, "textureLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {PALATE_TEXTURES.map((tex) => {
                  const selected = data.palate.texture.includes(tex.zh);
                  return (
                    <button
                      key={tex.zh}
                      onClick={() => togglePalateTexture(tex.zh)}
                      className={`tasting-tag-primary ${selected ? "tasting-tag-selected" : ""}`}
                    >
                      {tagLabel(tex)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sweetness */}
            <div className="mb-4">
              <span
                className="text-xs font-medium mb-2 block"
                style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}
              >
                {t(locale, "sweetnessLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {PALATE_SWEETNESS.map((sw) => {
                  const selected = data.palate.sweetness === sw.zh;
                  return (
                    <button
                      key={sw.zh}
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          palate: { ...d.palate, sweetness: sw.zh },
                        }))
                      }
                      className={`tasting-tag-primary ${selected ? "tasting-tag-selected" : ""}`}
                    >
                      {tagLabel(sw)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Finish ── */}
        {step.key === "finish" && (
          <div className="tasting-step-finish">
            {/* Finish length */}
            <div className="mb-4">
              <span
                className="text-xs font-medium mb-2 block"
                style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}
              >
                {t(locale, "finishLengthLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {FINISH_LENGTHS.map((fl) => {
                  const selected = data.finish.length === fl.zh;
                  return (
                    <button
                      key={fl.zh}
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          finish: { ...d.finish, length: fl.zh },
                        }))
                      }
                      className={`tasting-tag-primary ${selected ? "tasting-tag-selected" : ""}`}
                    >
                      {tagLabel(fl)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finish descriptors */}
            <div className="mb-4">
              <span
                className="text-xs font-medium mb-2 block"
                style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}
              >
                {t(locale, "finishDescriptorsLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {FINISH_DESCRIPTORS.map((fd) => {
                  const selected = data.finish.descriptors.includes(fd.zh);
                  return (
                    <button
                      key={fd.zh}
                      onClick={() => toggleFinishDescriptor(fd.zh)}
                      className={`tasting-tag-primary ${selected ? "tasting-tag-selected" : ""}`}
                    >
                      {tagLabel(fd)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overall score */}
            <TastingSlider
              value={data.finish.overallScore}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  finish: { ...d.finish, overallScore: v },
                }))
              }
              min={1}
              max={100}
              label={t(locale, "overallScoreLabel")}
              leftLabel="1"
              rightLabel="100"
            />
          </div>
        )}
      </div>

      {/* ── Bottom navigation ── */}
      <div
        className="px-4 pb-4 pt-2 flex gap-3"
        style={{
          paddingBottom: "calc(var(--safe-bottom, 0px) + 16px)",
        }}
      >
        {currentStep > 0 && (
          <button
            onClick={goPrev}
            className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all active:scale-[0.97]"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-deep)",
              backgroundColor: "var(--wine-hover-bg)",
              border: "1px solid var(--wine-border)",
            }}
          >
            ← {t(locale, "prevStep")}
          </button>
        )}
        <button
          onClick={goNext}
          className="flex-1 py-3 rounded-2xl text-white text-sm font-medium transition-all active:scale-[0.97]"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            background:
              "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
            boxShadow: "var(--wine-shadow-strong)",
          }}
        >
          {currentStep < TASTING_STEPS.length - 1
            ? `${t(locale, "nextStep")} →`
            : `${t(locale, "finishTasting")} ✨`}
        </button>
      </div>
    </div>
  );
}
