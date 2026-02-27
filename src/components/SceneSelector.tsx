"use client";

import { useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import { t, displayLabel } from "@/lib/i18n";
import type { TasteProfile, SceneType } from "@/lib/types";
import { hasTasteData, generateRecommendations } from "@/lib/taste-extraction";
import { WineBottleSVG } from "./Decorations";

interface SceneSelectorProps {
  locale: Locale;
  tasteProfile: TasteProfile;
  hydrated: boolean;
  transitioning: boolean;
  onSelectScene: (scene: SceneType) => void;
  onSendMessage: (msg: string) => void;
  onOpenCamera: () => void;
}

export default function SceneSelector({
  locale,
  tasteProfile,
  hydrated,
  transitioning,
  onSelectScene,
  onSendMessage,
  onOpenCamera,
}: SceneSelectorProps) {
  return (
    <div className={`flex flex-col items-center min-h-full empty-state-bg py-4 ${transitioning ? "fade-out-up" : "welcome-animate"}`}>
      <WineBottleSVG
        className="wine-bottle-decor"
        style={{ width: 30, height: 90, top: "8%", left: "8%", color: "var(--wine-deep)", opacity: 0.04, position: "absolute", transform: "rotate(-12deg)" }}
      />
      <WineBottleSVG
        className="wine-bottle-decor"
        style={{ width: 25, height: 75, top: "12%", right: "10%", color: "var(--wine-accent)", opacity: 0.04, position: "absolute", transform: "rotate(8deg)" }}
      />

      {/* Brand Header */}
      <div className="wine-icon-float text-5xl mt-6 mb-3">🍷</div>
      <div className="wine-decoration text-center mb-1">
        <h2
          className="text-lg font-medium"
          style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif", color: "var(--wine-deep)" }}
        >
          {t(locale, "tagline")}
        </h2>
      </div>

      {/* Scenario Cards */}
      <div className="w-full max-w-md px-4 mt-5 space-y-3">
        <p
          className="text-xs text-center mb-3"
          style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.7 }}
        >
          {t(locale, "scenePrompt")}
        </p>

        <div id="scenario-cards" className="grid grid-cols-2 gap-3">
          {/* Scene 1: Restaurant */}
          <button
            onClick={() => onSelectScene("restaurant")}
            className="scenario-card quick-btn-animate stagger-1 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
            style={{ borderColor: "var(--wine-border)", background: "var(--wine-card)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-2xl mb-2">🍽️</span>
            <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
              {t(locale, "scene1Title")}
            </span>
            <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
              {t(locale, "scene1Desc")}
            </span>
          </button>

          {/* Scene 2: Shopping */}
          <button
            onClick={() => onSelectScene("shopping")}
            className="scenario-card quick-btn-animate stagger-2 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
            style={{ borderColor: "var(--wine-border)", background: "var(--wine-card)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-2xl mb-2">🛒</span>
            <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
              {t(locale, "scene2Title")}
            </span>
            <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
              {t(locale, "scene2Desc")}
            </span>
          </button>

          {/* Scene 3: Identify */}
          <button
            onClick={onOpenCamera}
            className="scenario-card quick-btn-animate stagger-3 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
            style={{ borderColor: "var(--wine-border)", background: "var(--wine-card)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-2xl mb-2">📸</span>
            <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
              {t(locale, "scene3Title")}
            </span>
            <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
              {t(locale, "scene3Desc")}
            </span>
          </button>

          {/* Scene 4: Tasting */}
          <button
            onClick={() => onSelectScene("tasting")}
            className="scenario-card quick-btn-animate stagger-4 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
            style={{ borderColor: "var(--wine-border)", background: "var(--wine-card)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-2xl mb-2">🍷</span>
            <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
              {t(locale, "scene4Title")}
            </span>
            <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
              {t(locale, "scene4Desc")}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="wine-divider mt-4">
          <span
            className="text-xs px-3 whitespace-nowrap"
            style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.6 }}
          >
            {t(locale, "orAsk")}
          </span>
        </div>

        {/* Quick questions */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[t(locale, "quick1"), t(locale, "quick2"), t(locale, "quick3"), t(locale, "quick4")].map((q, idx) => (
            <button
              key={q}
              onClick={() => onSendMessage(q)}
              className="quick-chip px-3 py-1.5 rounded-full text-xs transition-all"
              style={{
                fontFamily: "'Noto Serif SC', serif",
                color: "var(--wine-deep)",
                border: "1px solid var(--wine-border)",
                background: "rgba(255,255,255,0.5)",
                animationDelay: `${0.3 + idx * 0.05}s`,
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Taste Profile Section */}
      {hydrated && <TasteProfileSection profile={tasteProfile} onSendMessage={onSendMessage} locale={locale} />}
    </div>
  );
}

/* ─── Taste Profile Section (inlined here, used only in scene selector) ─── */
function TasteProfileSection({
  profile,
  onSendMessage,
  locale,
}: {
  profile: TasteProfile;
  onSendMessage: (msg: string) => void;
  locale: Locale;
}) {
  const recommendations = useMemo(() => generateRecommendations(profile, locale), [profile, locale]);
  const allTags = useMemo(() => {
    const tags: { label: string; zhLabel: string; type: string }[] = [];
    profile.regions.forEach((r) => tags.push({ label: displayLabel(locale, r), zhLabel: r, type: "region" }));
    profile.grapes.forEach((g) => tags.push({ label: displayLabel(locale, g), zhLabel: g, type: "grape" }));
    profile.styles.forEach((s) => tags.push({ label: displayLabel(locale, s), zhLabel: s, type: "style" }));
    profile.occasions.forEach((o) => tags.push({ label: displayLabel(locale, o), zhLabel: o, type: "occasion" }));
    if (profile.priceRange) {
      const priceUnit = t(locale, "priceUnit");
      tags.push({ label: `${profile.priceRange}${priceUnit}`, zhLabel: `${profile.priceRange}${priceUnit}`, type: "price" });
    }
    return tags;
  }, [profile, locale]);

  if (!hasTasteData(profile)) return null;

  const typeEmoji: Record<string, string> = { region: "📍", grape: "🍇", style: "✨", occasion: "🎯", price: "💰" };
  const queryKeyMap: Record<string, "queryRegion" | "queryGrape" | "queryStyle" | "queryOccasion" | "queryPrice"> = {
    region: "queryRegion",
    grape: "queryGrape",
    style: "queryStyle",
    occasion: "queryOccasion",
    price: "queryPrice",
  };

  return (
    <div id="taste-profile-section" className="taste-section w-full max-w-md px-2 mt-6">
      <div className="wine-divider">
        <span className="text-xs px-3 whitespace-nowrap" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
          {t(locale, "tasteLabel")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-3 mb-4">
        {allTags.map((tag, i) => {
          const queryKey = queryKeyMap[tag.type] || ("queryDefault" as const);
          const query = t(locale, queryKey).replace("{0}", tag.label);
          return (
            <button
              key={`${tag.type}-${tag.zhLabel}`}
              className="taste-tag taste-tag-clickable"
              style={{ animationDelay: `${i * 0.05}s`, cursor: "pointer" }}
              onClick={() => onSendMessage(query)}
            >
              {typeEmoji[tag.type]} {tag.label}
            </button>
          );
        })}
      </div>
      {recommendations.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {recommendations.map((rec) => (
            <button
              key={rec}
              onClick={() =>
                onSendMessage(rec.replace(/^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\s]+/u, "").trim())
              }
              className="taste-recommend-btn text-left text-sm"
            >
              <span className="taste-recommend-text">{rec}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
