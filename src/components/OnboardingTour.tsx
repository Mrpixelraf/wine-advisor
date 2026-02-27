"use client";

import { useState, useEffect, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
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
    description: {
      zh: "选择一个场景，AI会根据你的需求给出专业建议",
      en: "Pick a scenario, and AI gives you expert advice",
    },
    detail: {
      zh: "🍽️ 餐厅配酒 — 扫菜单，AI推荐最佳搭配\n🛒 选购指南 — 预算+场景，精准推荐\n📸 认识一瓶酒 — 拍酒标，秒懂一切\n🍷 品酒记录 — 边喝边聊，记录感受",
      en: "🍽️ Restaurant Pairing — Scan menu, get matches\n🛒 Buying Guide — Budget + occasion picks\n📸 Identify a Wine — Snap label, know everything\n🍷 Tasting Notes — Sip and record",
    },
    icon: <span className="text-5xl">✨</span>,
    // No targetId — this step is always text-only (scenario cards only show in empty state)
    btnText: { zh: "下一步", en: "Next" },
  },
  {
    title: { zh: "拍照识酒", en: "Snap a Label" },
    description: {
      zh: "拍一张酒标，AI 帮你识别酒款、给出品鉴建议",
      en: "Take a photo of a wine label — AI identifies it and offers tasting notes",
    },
    icon: <span className="text-5xl">📷</span>,
    targetId: "camera-btn",
    btnText: { zh: "下一步", en: "Next" },
  },
  {
    title: { zh: "我的酒窖", en: "My Cellar" },
    description: {
      zh: "品过的酒都会存在这里，记录你的品酒旅程",
      en: "All your wines are stored here — your personal tasting journey",
    },
    icon: <span className="text-5xl">🪵</span>,
    targetId: "cellar-btn",
    btnText: { zh: "下一步", en: "Next" },
  },
  {
    title: { zh: "味蕾画像", en: "Palate Profile" },
    description: {
      zh: "AI 会学习你的口味偏好，推荐越来越精准",
      en: "AI learns your palate — recommendations get better over time",
    },
    icon: <span className="text-5xl">🎯</span>,
    // taste-profile-section may not exist for new users; keep as optional
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

  // Calculate spotlight position for target elements
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
    const padding = 12;
    const calcRect = () => {
      const rect = el.getBoundingClientRect();
      setSpotlight({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    };
    calcRect();
    window.addEventListener("resize", calcRect);
    return () => window.removeEventListener("resize", calcRect);
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

  // Build spotlight clip-path to cut a rounded-rect hole in the overlay
  const getClipPath = () => {
    if (!spotlight) return undefined;
    const { top, left, width, height } = spotlight;
    const r = 12; // border radius for the hole
    const cx = left + width / 2;
    const cy = top + height / 2;
    const hw = width / 2;
    const hh = height / 2;
    // Outer: full screen (clockwise). Inner: rounded rect (counter-clockwise) to cut hole.
    return `polygon(evenodd, 
      0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 
      ${left + r}px ${top}px, ${left + width - r}px ${top}px, ${left + width}px ${top + r}px, ${left + width}px ${top + height - r}px, ${left + width - r}px ${top + height}px, ${left + r}px ${top + height}px, ${left}px ${top + height - r}px, ${left}px ${top + r}px, ${left + r}px ${top}px
    )`;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      {/* Dark overlay with spotlight hole */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "var(--wine-overlay-dark)",
          zIndex: 100,
          transition: "clip-path 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          ...(spotlight ? { clipPath: getClipPath() } : {}),
        }}
      />

      {/* Spotlight glow ring (when targeting an element) */}
      {spotlight && (
        <div
          style={{
            position: "fixed",
            top: spotlight.top - 4,
            left: spotlight.left - 4,
            width: spotlight.width + 8,
            height: spotlight.height + 8,
            borderRadius: 16,
            border: "2px solid var(--wine-glow-border)",
            boxShadow: "var(--wine-glow-shadow)",
            zIndex: 101,
            pointerEvents: "none",
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            animation: "onboarding-glow-pulse 2s ease-in-out infinite",
          }}
        />
      )}

      {/* Clickable layer to block interaction */}
      <div style={{ position: "fixed", inset: 0, zIndex: 102 }} />

      {/* Skip button */}
      <button
        onClick={finish}
        style={{
          position: "fixed",
          top: "calc(16px + var(--safe-top, 0px))",
          right: 16,
          zIndex: 103,
          fontFamily: "'Noto Serif SC', serif",
          fontSize: 13,
          color: "var(--wine-skip-color)",
          background: "var(--wine-skip-bg)",
          border: "1px solid var(--wine-skip-border)",
          borderRadius: 20,
          padding: "6px 18px",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          transition: "all 0.2s",
        }}
      >
        {t(locale, "onboardingSkip")}
      </button>

      {/* Card */}
      <div
        key={step}
        className={`onboarding-card ${direction === "next" ? "onboarding-card-enter-next" : "onboarding-card-enter-prev"}`}
        style={{
          position: "fixed",
          left: "50%",
          ...(spotlight
            ? { bottom: "max(100px, 14vh)", transform: "translateX(-50%)" }
            : { top: "50%", transform: "translate(-50%, -50%)" }
          ),
          zIndex: 103,
          width: "min(360px, calc(100vw - 48px))",
          backgroundColor: "var(--wine-cream, #FFF9F0)",
          borderRadius: 24,
          padding: "32px 28px 24px",
          boxShadow: "var(--wine-card-overlay-shadow)",
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
          <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 13, color: "var(--wine-text)", lineHeight: 1.6, marginBottom: current.detail ? 10 : 20 }}>
            {current.description[lang]}
          </p>
        )}

        {current.detail && (
          <p style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 12,
            color: "var(--wine-accent)",
            lineHeight: 2,
            marginBottom: 20,
            whiteSpace: "pre-line",
            textAlign: "left",
            paddingLeft: 8,
          }}>
            {current.detail[lang]}
          </p>
        )}

        <button
          onClick={goNext}
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
            boxShadow: "var(--wine-shadow-strong)",
            transition: "all 0.25s",
            width: "100%",
          }}
        >
          {current.btnText[lang]}
        </button>

        {/* Step indicators */}
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
