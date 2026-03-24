import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  wine: "#722F37",
  cream: "#FDF8F0",
  gold: "#C9A96E",
  darkWine: "#1A0A0C",
  midWine: "#4A1A1F",
  glassWhite: "rgba(253,248,240,0.07)",
  glassBorder: "rgba(201,169,110,0.25)",
};

// ── Animation helpers ─────────────────────────────────────────────────────────
const fi = (f: number, start: number, dur = 18): number =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const up = (f: number, start: number, dist = 40, dur = 20): number =>
  interpolate(f, [start, start + dur], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const sc = (f: number, start: number, from = 0.85, dur = 22): number =>
  interpolate(f, [start, start + dur], [from, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

// ── Reusable primitives ───────────────────────────────────────────────────────
const BG: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(160deg, ${C.darkWine} 0%, ${C.wine} 65%, #8B3540 100%)`,
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,169,110,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />
    {children}
  </AbsoluteFill>
);

const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: C.glassWhite,
      border: `1px solid ${C.glassBorder}`,
      borderRadius: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

const PillTag: React.FC<{ label: string; active?: boolean }> = ({
  label,
  active,
}) => (
  <div
    style={{
      padding: "8px 20px",
      borderRadius: 40,
      background: active ? C.wine : C.glassWhite,
      border: `1px solid ${active ? C.wine : C.glassBorder}`,
      fontSize: 20,
      color: active ? C.cream : C.gold,
      fontFamily: "Georgia, serif",
      flexShrink: 0,
    }}
  >
    {label}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Scene 1 — Welcome  (frames 0-149, 5s)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BG style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
      {/* Decorative rings */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "1px solid rgba(201,169,110,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: "1px solid rgba(201,169,110,0.08)",
        }}
      />

      {/* Logo block */}
      <div
        style={{
          opacity: fi(f, 8),
          transform: `scale(${sc(f, 8, 0.8, 28)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ fontSize: 108, lineHeight: 1 }}>🍷</div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: C.cream,
            letterSpacing: "0.14em",
            fontFamily: "Georgia, serif",
          }}
        >
          Sommé
        </div>
        <div
          style={{
            fontSize: 36,
            color: C.gold,
            letterSpacing: "0.28em",
            fontFamily: "Georgia, serif",
          }}
        >
          颂 美
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          opacity: fi(f, 32),
          width: 120,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          opacity: fi(f, 48),
          transform: `translateY(${up(f, 48)})`,
          textAlign: "center",
          padding: "0 70px",
        }}
      >
        <div
          style={{
            fontSize: 40,
            color: C.cream,
            fontFamily: "Georgia, serif",
            lineHeight: 1.6,
            letterSpacing: "0.04em",
          }}
        >
          好酒不必懂
        </div>
        <div
          style={{
            fontSize: 40,
            color: C.gold,
            fontFamily: "Georgia, serif",
            lineHeight: 1.6,
            letterSpacing: "0.04em",
          }}
        >
          懂你就够了
        </div>
      </div>
    </BG>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scene 2 — Four Features  (frames 150-599, 15s)
// ═══════════════════════════════════════════════════════════════════════════════
const FEATURES = [
  { emoji: "🍽️", title: "在餐厅", desc: "拍菜单/酒单，AI 秒出搭配推荐" },
  { emoji: "🛒", title: "选购葡萄酒", desc: "按场景、口味、预算智能选酒" },
  { emoji: "🔍", title: "认识一瓶酒", desc: "拍照识别酒标，了解酒款故事" },
  { emoji: "✍️", title: "品酒记录", desc: "AI 引导，外观→香气→口感→余味" },
];

const QUICK_TAGS = ["今晚吃什么？", "200块以内推荐", "帮我记录这瓶酒"];

const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BG style={{ padding: "70px 52px", gap: 28 }}>
      <div
        style={{
          opacity: fi(f, 5),
          transform: `translateY(${up(f, 5)})`,
        }}
      >
        <div
          style={{
            fontSize: 30,
            color: C.gold,
            fontFamily: "Georgia, serif",
            letterSpacing: "0.12em",
            marginBottom: 4,
          }}
        >
          四大核心场景
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(253,248,240,0.5)",
            fontFamily: "Georgia, serif",
          }}
        >
          一键开启，AI 量身推荐
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {FEATURES.map((item, i) => {
          const delay = i * 18 + 15;
          return (
            <GlassCard
              key={i}
              style={{
                opacity: fi(f, delay),
                transform: `translateX(${interpolate(
                  f,
                  [delay, delay + 20],
                  [-60, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  }
                )}px) scale(${sc(f, delay, 0.92, 20)})`,
                padding: "26px 28px",
                display: "flex",
                alignItems: "center",
                gap: 22,
              }}
            >
              <div style={{ fontSize: 52, flexShrink: 0 }}>{item.emoji}</div>
              <div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: C.cream,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: C.gold,
                    marginTop: 5,
                    fontFamily: "Georgia, serif",
                    lineHeight: 1.4,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Quick tags */}
      <div
        style={{
          opacity: fi(f, 100),
          transform: `translateY(${up(f, 100)})`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: "rgba(253,248,240,0.4)",
            marginBottom: 12,
            fontFamily: "Georgia, serif",
          }}
        >
          或直接提问
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {QUICK_TAGS.map((t, i) => (
            <PillTag key={i} label={t} />
          ))}
        </div>
      </div>
    </BG>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scene 3 — Photo Scan + Smart Routing  (frames 600-899, 10s)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const scanLineX = interpolate(f, [40, 90], [-540, 540], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BG style={{ flexDirection: "column", padding: "0 0 50px" }}>
      {/* Header */}
      <div
        style={{ opacity: fi(f, 5), padding: "60px 52px 28px" }}
      >
        <div
          style={{
            fontSize: 34,
            color: C.cream,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
          }}
        >
          拍一张酒标
        </div>
        <div style={{ fontSize: 24, color: C.gold, marginTop: 6 }}>
          AI 秒速识别，智能分流
        </div>
      </div>

      {/* Viewfinder */}
      <div
        style={{
          opacity: fi(f, 5),
          margin: "0 52px",
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          height: 300,
          background: "rgba(0,0,0,0.45)",
          border: `1px solid ${C.glassBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 80, zIndex: 1 }}>🍾</div>

        {/* Corner brackets */}
        {[
          { top: 14, left: 14, borderTop: `2px solid ${C.gold}`, borderLeft: `2px solid ${C.gold}` },
          { top: 14, right: 14, borderTop: `2px solid ${C.gold}`, borderRight: `2px solid ${C.gold}` },
          { bottom: 14, left: 14, borderBottom: `2px solid ${C.gold}`, borderLeft: `2px solid ${C.gold}` },
          { bottom: 14, right: 14, borderBottom: `2px solid ${C.gold}`, borderRight: `2px solid ${C.gold}` },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 28,
              height: 28,
              ...s,
            } as React.CSSProperties}
          />
        ))}

        {/* Scan line */}
        <div
          style={{
            opacity: fi(f, 35),
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 2,
            background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
            left: scanLineX,
          }}
        />

        {/* "Scanning..." label */}
        <div
          style={{
            opacity: fi(f, 35, 10),
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 20,
            color: C.gold,
            fontFamily: "Georgia, serif",
          }}
        >
          识别中…
        </div>
      </div>

      {/* Recognition result */}
      <GlassCard
        style={{
          opacity: fi(f, 75),
          margin: "22px 52px 0",
          padding: "18px 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 36 }}>🍷</div>
          <div>
            <div
              style={{
                fontSize: 24,
                color: C.cream,
                fontFamily: "Georgia, serif",
                fontWeight: 700,
              }}
            >
              Opus One 2020
            </div>
            <div style={{ fontSize: 18, color: C.gold }}>
              纳帕谷 · 97分 · 赤霞珠
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 22,
              color: C.gold,
              flexShrink: 0,
            }}
          >
            ✓ 已识别
          </div>
        </div>
      </GlassCard>

      {/* Smart routing */}
      <div
        style={{
          opacity: fi(f, 115),
          transform: `translateY(${up(f, 115)})`,
          margin: "22px 52px 0",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "rgba(253,248,240,0.6)",
            marginBottom: 14,
            fontFamily: "Georgia, serif",
          }}
        >
          这瓶酒，你想要……
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {/* 想买 */}
          <GlassCard style={{ flex: 1, padding: "22px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>🛒</div>
            <div
              style={{
                fontSize: 22,
                color: C.cream,
                fontFamily: "Georgia, serif",
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              想买
            </div>
            <div
              style={{
                fontSize: 17,
                color: C.gold,
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              评分 + 推荐{"\n"}参考价格
            </div>
          </GlassCard>
          {/* 在喝 */}
          <div
            style={{
              flex: 1,
              background: "rgba(114,47,55,0.45)",
              border: `2px solid ${C.wine}`,
              borderRadius: 20,
              padding: "22px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36 }}>🍷</div>
            <div
              style={{
                fontSize: 22,
                color: C.cream,
                fontFamily: "Georgia, serif",
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              在喝
            </div>
            <div
              style={{
                fontSize: 17,
                color: C.gold,
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              专业品鉴笔记{"\n"}AI 引导记录
            </div>
          </div>
        </div>
      </div>
    </BG>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scene 4 — AI Tasting Flow  (frames 900-1139, 8s)
// ═══════════════════════════════════════════════════════════════════════════════
const TASTING_STEPS = [
  { emoji: "👁️", label: "外观", sub: "颜色/清澈" },
  { emoji: "👃", label: "香气", sub: "果香/花香" },
  { emoji: "👅", label: "口感", sub: "酸度/单宁" },
  { emoji: "🌬️", label: "余味", sub: "长度/描述" },
];
const LEVELS = ["入门", "进阶", "专家"];
const FLAVOR_TAGS = ["果味", "花香", "辛香", "泥土", "橡木", "矿物"];

const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const activeStep = Math.min(3, Math.floor(f / 58));
  const sliderScore = Math.round(
    interpolate(f, [20, 200], [60, 88], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <BG style={{ padding: "60px 52px", gap: 24 }}>
      <div style={{ opacity: fi(f, 5), transform: `translateY(${up(f, 5)})` }}>
        <div
          style={{
            fontSize: 30,
            color: C.gold,
            fontFamily: "Georgia, serif",
            letterSpacing: "0.1em",
          }}
        >
          AI 引导品鉴
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(253,248,240,0.5)",
            marginTop: 4,
          }}
        >
          跟着走，一步成达人
        </div>
      </div>

      {/* Level selector */}
      <div style={{ opacity: fi(f, 12), display: "flex", gap: 12 }}>
        {LEVELS.map((l, i) => (
          <PillTag key={i} label={l} active={i === 1} />
        ))}
      </div>

      {/* Step indicators */}
      <div
        style={{ opacity: fi(f, 18), display: "flex", gap: 14 }}
      >
        {TASTING_STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: isActive
                  ? "rgba(114,47,55,0.5)"
                  : isDone
                  ? "rgba(201,169,110,0.12)"
                  : C.glassWhite,
                border: `1px solid ${
                  isActive ? C.wine : isDone ? C.gold : C.glassBorder
                }`,
                borderRadius: 14,
                padding: "16px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28 }}>
                {isDone ? "✅" : step.emoji}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: isActive
                    ? C.cream
                    : isDone
                    ? C.gold
                    : "rgba(253,248,240,0.5)",
                  fontWeight: 700,
                  marginTop: 6,
                  fontFamily: "Georgia, serif",
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(201,169,110,0.6)",
                  marginTop: 4,
                }}
              >
                {step.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Score slider */}
      <GlassCard style={{ opacity: fi(f, 30), padding: "22px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: C.cream,
              fontFamily: "Georgia, serif",
            }}
          >
            综合评分
          </div>
          <div
            style={{
              fontSize: 34,
              color: C.gold,
              fontFamily: "Georgia, serif",
              fontWeight: 700,
            }}
          >
            {sliderScore}
          </div>
        </div>
        <div
          style={{
            height: 8,
            background: "rgba(253,248,240,0.1)",
            borderRadius: 4,
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${sliderScore}%`,
              background: `linear-gradient(90deg, ${C.wine}, ${C.gold})`,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -6,
              left: `${sliderScore}%`,
              transform: "translateX(-50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: C.gold,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 16,
            color: "rgba(201,169,110,0.5)",
          }}
        >
          <span>0</span>
          <span>100</span>
        </div>
      </GlassCard>

      {/* Flavor tags */}
      <div style={{ opacity: fi(f, 48) }}>
        <div
          style={{
            fontSize: 20,
            color: "rgba(253,248,240,0.5)",
            marginBottom: 12,
            fontFamily: "Georgia, serif",
          }}
        >
          风味标签
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {FLAVOR_TAGS.map((t, i) => (
            <PillTag key={i} label={t} active={[0, 2, 4].includes(i)} />
          ))}
        </div>
      </div>

      {/* Save button */}
      <div
        style={{
          opacity: fi(f, 68),
          background: C.wine,
          borderRadius: 50,
          padding: "18px",
          textAlign: "center",
          fontSize: 24,
          color: C.cream,
          fontFamily: "Georgia, serif",
          letterSpacing: "0.06em",
          marginTop: 4,
        }}
      >
        存入我的酒窖 →
      </div>
    </BG>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scene 5 — My Cellar  (frames 1140-1319, 6s)
// ═══════════════════════════════════════════════════════════════════════════════
const CELLAR_TABS = ["品过的酒", "我的藏酒", "想买清单"];
const WINES = [
  { emoji: "🍷", name: "Château Margaux 2019", region: "波尔多 · 梅多克", score: 94, tags: ["果味", "橡木"] },
  { emoji: "🍾", name: "Opus One 2020", region: "纳帕谷 · 加利福尼亚", score: 97, tags: ["黑莓", "雪松"] },
  { emoji: "🫙", name: "Barolo 2018", region: "皮埃蒙特 · 意大利", score: 91, tags: ["泥土", "玫瑰"] },
];

const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const activeTab = Math.floor(f / 55) % 3;

  return (
    <BG style={{ flexDirection: "column" }}>
      <div style={{ opacity: fi(f, 5), padding: "60px 52px 22px" }}>
        <div
          style={{
            fontSize: 48,
            color: C.cream,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
          }}
        >
          我的酒窖
        </div>
        <div
          style={{ fontSize: 22, color: C.gold, marginTop: 6 }}
        >
          收藏 · 品鉴 · 分享
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          opacity: fi(f, 10),
          display: "flex",
          padding: "0 52px 20px",
          gap: 12,
        }}
      >
        {CELLAR_TABS.map((t, i) => (
          <PillTag key={i} label={t} active={i === activeTab} />
        ))}
      </div>

      {/* Wine cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "0 52px" }}>
        {WINES.map((w, i) => {
          const delay = i * 14 + 12;
          return (
            <GlassCard
              key={i}
              style={{
                opacity: fi(f, delay),
                transform: `translateY(${up(f, delay)})`,
                padding: "20px 22px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ fontSize: 40 }}>{w.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 22,
                      color: C.cream,
                      fontFamily: "Georgia, serif",
                      fontWeight: 700,
                    }}
                  >
                    {w.name}
                  </div>
                  <div
                    style={{ fontSize: 17, color: C.gold, marginTop: 4 }}
                  >
                    {w.region}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {w.tags.map((t, j) => (
                      <div
                        key={j}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          background: "rgba(201,169,110,0.15)",
                          border: "1px solid rgba(201,169,110,0.3)",
                          fontSize: 15,
                          color: C.gold,
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: C.wine,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      color: C.cream,
                      fontWeight: 700,
                    }}
                  >
                    {w.score}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Action row */}
      <div
        style={{ opacity: fi(f, 60), padding: "18px 52px 0" }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          {["导出报告 📄", "分享给好友 🔗"].map((label, i) => (
            <GlassCard
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "14px",
                fontSize: 19,
                color: C.cream,
                fontFamily: "Georgia, serif",
              }}
            >
              {label}
            </GlassCard>
          ))}
        </div>
      </div>
    </BG>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scene 6 — Language Toggle  (frames 1320-1439, 4s)
// ═══════════════════════════════════════════════════════════════════════════════
const ZH_BULLETS = ["在餐厅找最佳搭配", "扫描标签识酒", "建立你的私人酒单"];
const EN_BULLETS = ["Perfect wine pairings", "Scan & identify any bottle", "Build your personal cellar"];

const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const showEN = f >= 62;
  const contentOp = showEN
    ? interpolate(f, [62, 78], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : fi(f, 5);
  const bullets = showEN ? EN_BULLETS : ZH_BULLETS;

  return (
    <BG style={{ padding: "70px 52px", gap: 30 }}>
      {/* Toggle */}
      <div
        style={{
          opacity: fi(f, 3),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "rgba(253,248,240,0.08)",
            borderRadius: 36,
            padding: 4,
            border: `2px solid ${C.gold}`,
            boxShadow: `0 0 20px rgba(201,169,110,0.3)`,
          }}
        >
          {["中", "EN"].map((l, i) => {
            const active = (l === "EN") === showEN;
            return (
              <div
                key={i}
                style={{
                  padding: "12px 32px",
                  borderRadius: 32,
                  background: active ? C.wine : "transparent",
                  color: active ? C.cream : C.gold,
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                }}
              >
                {l}
              </div>
            );
          })}
        </div>
        <div
          style={{
            fontSize: 21,
            color: C.gold,
            fontFamily: "Georgia, serif",
          }}
        >
          智能双语切换
        </div>
      </div>

      {/* Content */}
      <div style={{ opacity: contentOp }}>
        <div
          style={{
            fontSize: 46,
            color: C.cream,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {showEN ? "Your AI Sommelier" : "你的AI侍酒师"}
        </div>
        <div
          style={{
            fontSize: 26,
            color: C.gold,
            fontFamily: "Georgia, serif",
            marginBottom: 26,
            lineHeight: 1.5,
          }}
        >
          {showEN
            ? "Restaurant · Shop · Discover · Journal"
            : "在餐厅 · 选购 · 认识 · 品鉴"}
        </div>
        {bullets.map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.gold,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 26,
                color: C.cream,
                fontFamily: "Georgia, serif",
              }}
            >
              {b}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          opacity: fi(f, showEN ? 78 : 5),
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 21,
            color: "rgba(201,169,110,0.7)",
            fontFamily: "Georgia, serif",
          }}
        >
          {showEN ? "AI replies in your language too" : "AI 回复也会跟着切换"}
        </div>
      </div>
    </BG>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scene 7 — CTA  (frames 1440-1649, 7s)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene7: React.FC = () => {
  const f = useCurrentFrame();
  const totalF = 210;
  const fadeOut = interpolate(f, [totalF - 35, totalF - 5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BG
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 34,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,169,110,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: fi(f, 12),
          transform: `scale(${sc(f, 12, 0.8, 28)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ fontSize: 96, lineHeight: 1 }}>🍷</div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: C.cream,
            letterSpacing: "0.14em",
            fontFamily: "Georgia, serif",
          }}
        >
          Sommé
        </div>
        <div
          style={{
            fontSize: 32,
            color: C.gold,
            letterSpacing: "0.28em",
            fontFamily: "Georgia, serif",
          }}
        >
          颂 美
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          opacity: fi(f, 38),
          width: 120,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        }}
      />

      {/* CTA */}
      <div
        style={{
          opacity: fi(f, 50),
          transform: `translateY(${up(f, 50)})`,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontSize: 44,
            color: C.cream,
            fontFamily: "Georgia, serif",
            lineHeight: 1.5,
          }}
        >
          开始你的品酒之旅
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: fi(f, 68),
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: C.gold,
            fontFamily: "Georgia, serif",
            lineHeight: 1.6,
          }}
        >
          好酒不必懂，懂你就够了
        </div>
      </div>

      {/* URL */}
      <div style={{ opacity: fi(f, 85) }}>
        <div
          style={{
            fontSize: 26,
            color: "rgba(253,248,240,0.6)",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.1em",
          }}
        >
          somme.app
        </div>
      </div>
    </BG>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Root composition
// 55s × 30fps = 1650 frames
//   Scene 1:  0    → 149   (5s)   Welcome
//   Scene 2:  150  → 599   (15s)  Four features
//   Scene 3:  600  → 899   (10s)  Photo scan + routing
//   Scene 4:  900  → 1139  (8s)   AI tasting flow
//   Scene 5:  1140 → 1319  (6s)   My cellar
//   Scene 6:  1320 → 1439  (4s)   Language toggle
//   Scene 7:  1440 → 1649  (7s)   CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const OnboardingVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.darkWine }}>
    <Sequence from={0}    durationInFrames={150}><Scene1 /></Sequence>
    <Sequence from={150}  durationInFrames={450}><Scene2 /></Sequence>
    <Sequence from={600}  durationInFrames={300}><Scene3 /></Sequence>
    <Sequence from={900}  durationInFrames={240}><Scene4 /></Sequence>
    <Sequence from={1140} durationInFrames={180}><Scene5 /></Sequence>
    <Sequence from={1320} durationInFrames={120}><Scene6 /></Sequence>
    <Sequence from={1440} durationInFrames={210}><Scene7 /></Sequence>
  </AbsoluteFill>
);
