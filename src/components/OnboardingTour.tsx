"use client";

import { useState, useEffect, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { ONBOARDING_KEY } from "@/lib/types";

interface OnboardingStep {
  title: { zh: string; en: string };
  subtitle?: { zh: string; en: string };
  slogan?: { zh: string; en: string };
  description: { zh: string; en: string };
  detail?: { zh: string; en: string };
  icon: ReactNode;
  targetId?: string;
  btnText: { zh: string; en: string };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: { zh: "欢迎来到 Sommé 颂美", en: "Welcome to Sommé" },
    subtitle: { zh: "你的私人AI侍酒师", en: "Your Personal AI Sommelier" },
    slogan: { zh: "好酒不必懂，懂你就够了", en: "Great wine needs no expertise — just you" },
    description: { zh: "", en: "" },
    icon: <span className="text-6xl">🍷</span>,
    btnText: { zh: "开始探索", en: "Let's Explore" },
  },
  {
    title: { zh: "四大场景", en: "Four Scenarios" },
    description: { zh: "选择一个场景，AI会根据你的需求给出专业建议", en: "Pick a scenario, and AI gives you expert advice" },
    detail: {
      zh: "🍽️ 餐厅配酒 · 🛒 选购指南\n📸 认识一瓶酒 · 🍷 品酒记录",
      en: "🍽️ Restaurant Pairing · 🛒 Buying Guide\n📸 Identify a Wine · 🍷 Tasting Notes",
    },
    icon: <span className="text-5xl">✨</span>,
    targetId: "scenario-cards",
    btnText: { zh: "下一步", en: "Next" },
  },
  {
    title: { zh: "拍照识酒", en: "Snap a Label" },
    description: { zh: "拍一张酒标，AI 帮你识别酒款、给出品鉴建议", en: "Take a photo of a wine label — AI identifies it and offers tasting notes" },
    icon: <span className="text-5xl">📷</span>,
    targetId: "camera-btn",
    btnText: { zh: "下一步", en: "Next" },
  },
  {
    title: { zh: "我的酒窖", en: "My Cellar" },
    description: { zh: "品过的酒都会存在这里，记录你的品酒旅程", en: "All your wines are stored here — your personal tasting journey" },
    icon: <span className="text-5xl">🪵</span>,
    targetId: "cellar-btn",
    btnText: { zh: "下一步", en: "Next" },
  },
  {
    title: { zh: "味蕾画像", en: "Palate Profile" },
    description: { zh: "AI 会学习你的口味偏好，推荐越来越精准", en: "AI learns your palate — recommendations get better over time" },
    icon: <span className="text-5xl">🎯</span>,
    targetId: "taste-profile-section",
    btnText: { zh: "开始品酒！", en: "Start Tasting!" },
  },
];

export default function OnboardingTour({ locale, onComplete }: { locale: Locale; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [spotlight, setSpotlight] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const lang = locale === "en" ? "en" : "zh";
  const current = ONBOARDING_STEPS[step];
  const totalSteps = ONBOARDING_STEPS.length;

  useEffect(() => {
    if (!current.targetId) {
      setSpotlight(null);
      return;
    }
    const el = document.getElementById(current.targetId);
    if (!el) {
      setSpotlight(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const padding = 8;
    setSpotlight({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });
    const onResize = () => {
      const r = el.getBoundingClientRect();
      setSpotlight({
        top: r.top - padding,
        left: r.left - padding,
        width: r.width + padding * 2,
        height: r.height + padding * 2,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [step, current.targetId]);

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDirection("next");
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    try { localStorage.setItem(ONBOARDING_KEY, "true"); } catch {}
    onComplete();
  };

  const overlayStyle: React.CSSProperties = spotlight
    ? {
        position: "fixed",
        top: spotlight.top,
        left: spotlight.left,
        width: spotlight.width,
        height: spotlight.height,
        borderRadius: 16,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
        zIndex: 60,
        pointerEvents: "none",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }
    : {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 60,
        pointerEvents: "none",
      };

  return (
    <div className="onboarding-overlay" style={{ position: "fixed", inset: 0, zIndex: 59 }}>
      <div style={overlayStyle} />
      <div style={{ position: "fixed", inset: 0, zIndex: 61 }} onClick={(e) => e.stopPropagation()} />

      {/* Skip button */}
      <button
        onClick={finish}
        className="onboarding-skip-btn"
        style={{
          position: "fixed",
          top: "calc(16px + var(--safe-top, 0px))",
          right: 16,
          zIndex: 62,
          fontFamily: "'Noto Serif SC', serif",
          fontSize: 13,
          color: "rgba(255,255,255,0.7)",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 20,
          padding: "6px 16px",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          transition: "all 0.2s",
        }}
      >
        {lang === "zh" ? "跳过" : "Skip"}
      </button>

      {/* Card */}
      <div
        key={step}
        className={`onboarding-card ${direction === "next" ? "onboarding-card-enter-next" : "onboarding-card-enter-prev"}`}
        style={{
          position: "fixed",
          left: "50%",
          bottom: spotlight ? "max(120px, 18vh)" : "50%",
          transform: spotlight ? "translateX(-50%)" : "translate(-50%, 50%)",
          zIndex: 62,
          width: "min(360px, calc(100vw - 48px))",
          backgroundColor: "var(--wine-cream)",
          borderRadius: 24,
          padding: "32px 28px 24px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
          textAlign: "center",
        }}
      >
        <div className="mb-4 onboarding-icon-bounce">{current.icon}</div>

        <h2
          style={{
            fontFamily: step === 0 ? "'Cormorant Garamond', 'Noto Serif SC', serif" : "'Noto Serif SC', serif",
            fontSize: step === 0 ? 22 : 18,
            fontWeight: 600,
            color: "var(--wine-deep)",
            marginBottom: current.subtitle ? 6 : 10,
            lineHeight: 1.3,
          }}
        >
          {current.title[lang]}
        </h2>

        {current.subtitle && (
          <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 14, color: "var(--wine-accent)", marginBottom: 6 }}>
            {current.subtitle[lang]}
          </p>
        )}

        {current.slogan && (
          <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 12, color: "var(--wine-accent)", opacity: 0.7, marginBottom: 16, fontStyle: "italic" }}>
            {current.slogan[lang]}
          </p>
        )}

        {current.description[lang] && (
          <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 13, color: "var(--wine-text)", lineHeight: 1.6, marginBottom: current.detail ? 8 : 20 }}>
            {current.description[lang]}
          </p>
        )}

        {current.detail && (
          <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 12, color: "var(--wine-accent)", lineHeight: 1.8, marginBottom: 20, whiteSpace: "pre-line" }}>
            {current.detail[lang]}
          </p>
        )}

        <button
          onClick={goNext}
          className="onboarding-cta-btn"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 14,
            fontWeight: 500,
            color: "white",
            background: "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
            border: "none",
            borderRadius: 16,
            padding: "12px 36px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(139, 34, 82, 0.3)",
            transition: "all 0.25s",
            width: "100%",
          }}
        >
          {current.btnText[lang]}
        </button>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === step ? "var(--wine-deep)" : "var(--wine-border)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
