"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ─── Types ─── */
interface MessageAction {
  id: string;
  label: string;
  icon: string;
  message?: string;   // 点击后发送的消息
  action?: string;     // 特殊操作标识
  data?: Record<string, unknown>;
  clicked?: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  image?: string;
  imageMimeType?: string;
  actions?: MessageAction[];
}

interface TasteProfile {
  regions: string[];
  grapes: string[];
  styles: string[];
  priceRange: string;
  occasions: string[];
}

interface WineEntry {
  id: string;
  name: string;
  image?: string;
  type: "drinking" | "wishlist";
  rating?: number;
  userNotes?: string;
  aiNotes?: string;
  date: string;
  region?: string;
  grape?: string;
  price?: string;
}

const STORAGE_KEY = "wine-advisor-messages";
const TASTE_PROFILE_KEY = "wine-advisor-taste-profile";
const CELLAR_KEY = "wineCellar";

/* ─── Taste Profile Keywords ─── */
const REGION_KEYWORDS: Record<string, string> = {
  "波尔多": "波尔多", "bordeaux": "波尔多",
  "勃艮第": "勃艮第", "burgundy": "勃艮第", "布根地": "勃艮第",
  "香槟": "香槟", "champagne": "香槟",
  "托斯卡纳": "托斯卡纳", "tuscany": "托斯卡纳",
  "纳帕": "纳帕谷", "napa": "纳帕谷",
  "巴罗洛": "巴罗洛", "barolo": "巴罗洛",
  "里奥哈": "里奥哈", "rioja": "里奥哈",
  "罗纳河谷": "罗纳河谷", "rhone": "罗纳河谷", "rhône": "罗纳河谷",
  "阿尔萨斯": "阿尔萨斯", "alsace": "阿尔萨斯",
  "摩泽尔": "摩泽尔", "mosel": "摩泽尔",
  "新西兰": "新西兰", "澳洲": "澳大利亚", "澳大利亚": "澳大利亚",
  "智利": "智利", "阿根廷": "阿根廷", "南非": "南非",
};

const GRAPE_KEYWORDS: Record<string, string> = {
  "赤霞珠": "赤霞珠", "cabernet": "赤霞珠",
  "梅洛": "梅洛", "merlot": "梅洛",
  "黑皮诺": "黑皮诺", "pinot noir": "黑皮诺",
  "霞多丽": "霞多丽", "chardonnay": "霞多丽",
  "长相思": "长相思", "sauvignon blanc": "长相思",
  "雷司令": "雷司令", "riesling": "雷司令",
  "西拉": "西拉", "syrah": "西拉", "shiraz": "西拉",
  "桑娇维塞": "桑娇维塞", "sangiovese": "桑娇维塞",
  "内比奥罗": "内比奥罗", "nebbiolo": "内比奥罗",
  "丹魄": "丹魄", "tempranillo": "丹魄",
  "马尔贝克": "马尔贝克", "malbec": "马尔贝克",
  "仙粉黛": "仙粉黛", "zinfandel": "仙粉黛",
  "琼瑶浆": "琼瑶浆", "gewurztraminer": "琼瑶浆",
};

const STYLE_KEYWORDS: Record<string, string> = {
  "饱满": "饱满型", "浓郁": "饱满型", "厚重": "饱满型", "full-bodied": "饱满型",
  "果味": "果味型", "果香": "果味型", "水果": "果味型",
  "优雅": "优雅型", "细腻": "优雅型", "精致": "优雅型",
  "清爽": "清爽型", "清新": "清爽型", "爽口": "清爽型",
  "甜": "甜型", "甜酒": "甜型", "贵腐": "甜型",
  "干型": "干型", "单宁": "单宁突出",
  "起泡": "起泡型", "气泡": "起泡型",
  "陈年": "陈年型", "橡木桶": "橡木桶风格",
};

const OCCASION_KEYWORDS: Record<string, string> = {
  "商务": "商务", "宴请": "商务",
  "约会": "约会", "浪漫": "约会",
  "日常": "日常饮用", "家常": "日常饮用",
  "聚会": "聚会", "派对": "聚会",
  "送礼": "送礼", "礼物": "送礼",
  "搭配": "餐酒搭配", "配餐": "餐酒搭配",
  "收藏": "收藏投资", "投资": "收藏投资",
  "庆祝": "庆祝", "节日": "庆祝",
};

const PRICE_PATTERNS = [
  { pattern: /(\d{2,5})\s*[-–~到至]\s*(\d{2,5})\s*元?/g, extract: (m: RegExpMatchArray) => `${m[1]}-${m[2]}` },
  { pattern: /(\d{2,5})\s*元\s*以[内下]/g, extract: (m: RegExpMatchArray) => `0-${m[1]}` },
  { pattern: /(\d{2,5})\s*元\s*以[上]/g, extract: (m: RegExpMatchArray) => `${m[1]}+` },
  { pattern: /(\d{2,5})\s*[-–~到至]\s*(\d{2,5})/g, extract: (m: RegExpMatchArray) => `${m[1]}-${m[2]}` },
];

/* ─── Helpers ─── */
function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    try {
      const lightweight = msgs.map((m) => ({
        ...m,
        image: m.image ? "[图片已省略]" : undefined,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch {
      // silently ignore
    }
  }
}

function loadTasteProfile(): TasteProfile {
  if (typeof window === "undefined") return { regions: [], grapes: [], styles: [], priceRange: "", occasions: [] };
  try {
    const raw = localStorage.getItem(TASTE_PROFILE_KEY);
    if (!raw) return { regions: [], grapes: [], styles: [], priceRange: "", occasions: [] };
    return JSON.parse(raw);
  } catch {
    return { regions: [], grapes: [], styles: [], priceRange: "", occasions: [] };
  }
}

function saveTasteProfile(profile: TasteProfile) {
  try {
    localStorage.setItem(TASTE_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // silently ignore
  }
}

function loadCellar(): WineEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CELLAR_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCellar(entries: WineEntry[]) {
  try {
    localStorage.setItem(CELLAR_KEY, JSON.stringify(entries));
  } catch {
    // silently ignore
  }
}

function extractTasteFromText(text: string, currentProfile: TasteProfile): TasteProfile {
  const lower = text.toLowerCase();
  const updated = { ...currentProfile };

  for (const [keyword, region] of Object.entries(REGION_KEYWORDS)) {
    if (lower.includes(keyword.toLowerCase()) && !updated.regions.includes(region)) {
      updated.regions = [...updated.regions, region].slice(-8);
    }
  }
  for (const [keyword, grape] of Object.entries(GRAPE_KEYWORDS)) {
    if (lower.includes(keyword.toLowerCase()) && !updated.grapes.includes(grape)) {
      updated.grapes = [...updated.grapes, grape].slice(-8);
    }
  }
  for (const [keyword, style] of Object.entries(STYLE_KEYWORDS)) {
    if (lower.includes(keyword) && !updated.styles.includes(style)) {
      updated.styles = [...updated.styles, style].slice(-6);
    }
  }
  for (const [keyword, occasion] of Object.entries(OCCASION_KEYWORDS)) {
    if (lower.includes(keyword) && !updated.occasions.includes(occasion)) {
      updated.occasions = [...updated.occasions, occasion].slice(-5);
    }
  }
  for (const { pattern, extract } of PRICE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    const match = regex.exec(text);
    if (match) {
      updated.priceRange = extract(match);
      break;
    }
  }
  return updated;
}

function hasTasteData(profile: TasteProfile): boolean {
  return profile.regions.length > 0 || profile.grapes.length > 0 || profile.styles.length > 0 || profile.occasions.length > 0;
}

function generateRecommendations(profile: TasteProfile): string[] {
  const recs: string[] = [];
  if (profile.regions.includes("波尔多")) recs.push("🏰 推荐一款波尔多左岸佳酿");
  if (profile.regions.includes("勃艮第")) recs.push("🍇 推荐一款勃艮第黑皮诺");
  if (profile.grapes.includes("赤霞珠") && !recs.some(r => r.includes("赤霞珠"))) recs.push("🍷 推荐一款赤霞珠精选");
  if (profile.grapes.includes("霞多丽")) recs.push("🥂 推荐一款优质霞多丽白葡萄酒");
  if (profile.styles.includes("饱满型")) recs.push("💪 推荐一款酒体饱满的红酒");
  if (profile.styles.includes("清爽型")) recs.push("🌿 推荐一款清爽的夏日白葡萄酒");
  if (profile.occasions.includes("约会")) recs.push("💝 推荐一款适合约会的浪漫酒款");
  if (profile.occasions.includes("商务")) recs.push("🤝 推荐一款商务宴请的体面酒款");
  if (profile.occasions.includes("餐酒搭配")) recs.push("🍽️ 推荐一款万能的餐酒搭配");
  if (profile.regions.includes("托斯卡纳")) recs.push("🇮🇹 推荐一款托斯卡纳经典");
  if (profile.grapes.includes("雷司令")) recs.push("✨ 推荐一款德国雷司令");
  if (profile.grapes.includes("西拉")) recs.push("🔥 推荐一款澳洲西拉");
  if (profile.styles.includes("甜型")) recs.push("🍯 推荐一款优质甜酒");
  if (profile.occasions.includes("送礼")) recs.push("🎁 推荐一款适合送礼的名庄酒");
  if (recs.length < 3) {
    if (profile.grapes.length > 0 && recs.length < 4) recs.push(`🍇 探索更多${profile.grapes[0]}风格`);
    if (profile.regions.length > 0 && recs.length < 4) recs.push(`🌍 深入了解${profile.regions[0]}产区`);
  }
  return recs.slice(0, 4);
}

/* Helper: detect wine recognition actions from AI response */
function detectWineActions(aiContent: string, hasImageContext: boolean): MessageAction[] | undefined {
  // Only add smart routing buttons if AI just identified a wine from an image
  if (!hasImageContext) return undefined;

  // Check if the AI response looks like a wine identification
  const wineIdentifiers = ["识别", "这款酒", "这是一款", "这瓶", "酒标", "酒款", "年份", "产区", "葡萄品种", "请问你现在是"];
  const looksLikeWineId = wineIdentifiers.some(k => aiContent.includes(k));
  if (!looksLikeWineId) return undefined;

  return [
    {
      id: "buy-" + Date.now(),
      label: "想买这款酒",
      icon: "🛒",
      message: "我想买这款酒，请给我详细评价",
    },
    {
      id: "drink-" + Date.now(),
      label: "正在喝这款酒",
      icon: "🍷",
      message: "我正在喝这款酒，请给我 Tasting Notes",
    },
  ];
}

/* Helper: detect buy-mode actions (评价回复 → 加入心愿清单) */
function detectBuyModeActions(aiContent: string, userMessage: string): MessageAction[] | undefined {
  if (!userMessage.includes("我想买这款酒")) return undefined;
  const buyKeywords = ["评分", "推荐", "评价", "/100", "分"];
  if (!buyKeywords.some(k => aiContent.includes(k))) return undefined;

  return [
    {
      id: "wishlist-" + Date.now(),
      label: "加入心愿清单",
      icon: "📖",
      action: "save-to-cellar",
      data: { type: "wishlist", aiNotes: aiContent },
    },
  ];
}

/* Helper: detect drink-mode actions (Tasting Notes → 记录品酒体验) */
function detectDrinkModeActions(aiContent: string, userMessage: string): MessageAction[] | undefined {
  if (!userMessage.includes("我正在喝这款酒")) return undefined;
  const drinkKeywords = ["Tasting", "品鉴", "香气", "口感", "余味", "酒体"];
  if (!drinkKeywords.some(k => aiContent.includes(k))) return undefined;

  return [
    {
      id: "rate-" + Date.now(),
      label: "记录品酒体验",
      icon: "⭐",
      action: "rate-wine",
      data: { type: "drinking", aiNotes: aiContent },
    },
  ];
}

/* Extract wine name from conversation context */
function extractWineNameFromMessages(messages: Message[]): string {
  // Look backward through messages for wine identification content
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant") {
      // Try to find wine name patterns
      const patterns = [
        /这是一[款瓶](.+?)[，。！]/,
        /这款酒是(.+?)[，。！]/,
        /识别[到为](.+?)[，。！]/,
        /《(.+?)》/,
        /「(.+?)」/,
        /[「""](.+?)[」""]/,
      ];
      for (const p of patterns) {
        const m = msg.content.match(p);
        if (m) return m[1].trim();
      }
      // Try to find "酒名：XXX" pattern
      const nameMatch = msg.content.match(/酒名[：:]\s*(.+)/);
      if (nameMatch) return nameMatch[1].trim().split(/[，。\n]/)[0];
    }
  }
  return "未知酒款";
}

/* Extract wine image from conversation */
function extractWineImageFromMessages(messages: Message[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user" && messages[i].image) {
      return messages[i].image;
    }
  }
  return undefined;
}

const QUICK_ICONS: Record<string, string> = {
  "推荐一款适合初学者的红酒": "🌱",
  "牛排配什么酒最好？": "🥩",
  "介绍一下波尔多产区": "🏰",
  "帮我品鉴拉菲2015": "🔍",
};

/* ─── Components ─── */

function WineGlassLoader() {
  return (
    <div className="wine-glass-loader">
      <div className="glass-bowl">
        <div className="wine-fill" />
      </div>
      <div className="glass-stem" />
      <div className="glass-base" />
      <span className="shimmer-text">品鉴中…</span>
    </div>
  );
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="confirm-overlay fixed inset-0 z-50"
      style={{ backgroundColor: "rgba(26,10,14,0.4)" }}
      onClick={onCancel}
    >
      <div
        className="confirm-dialog fixed top-1/2 left-1/2 w-[min(320px,85vw)] rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: "var(--wine-cream)", transform: "translate(-50%, -50%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm mb-5 text-center" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-text)" }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-sm border transition-all" style={{ fontFamily: "'Noto Serif SC', serif", borderColor: "var(--wine-light)", color: "var(--wine-text)" }}>取消</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl text-sm text-white transition-all" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-deep)" }}>确认</button>
        </div>
      </div>
    </div>
  );
}

function ScrollToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="scroll-to-bottom-btn fixed z-40 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
      style={{
        backgroundColor: "var(--wine-deep)",
        bottom: "calc(100px + var(--safe-bottom, 0px))",
        right: "max(16px, calc(50% - 384px + 16px))",
      }}
      title="回到最新"
    >
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
}

function sanitizeStreamingMarkdown(text: string): string {
  const codeBlockCount = (text.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) text += "\n```";
  const inlineCodeCount = (text.match(/(?<!`)`(?!`)/g) || []).length;
  if (inlineCodeCount % 2 !== 0) text += "`";
  const boldCount = (text.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) text += "**";
  const singleStarCount = (text.match(/(?<!\*)\*(?!\*)/g) || []).length;
  if (singleStarCount % 2 !== 0) text += "*";
  const strikeCount = (text.match(/~~/g) || []).length;
  if (strikeCount % 2 !== 0) text += "~~";
  return text;
}

function MarkdownContent({ content, isStreaming = false }: { content: string; isStreaming?: boolean }) {
  const processedContent = isStreaming ? sanitizeStreamingMarkdown(content) : content;
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3" style={{ color: "var(--wine-deep)" }}>{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3" style={{ color: "var(--wine-deep)" }}>{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mb-1.5 mt-2.5" style={{ color: "var(--wine-deep)" }}>{children}</h3>,
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold" style={{ color: "var(--wine-deep)" }}>{children}</strong>,
        em: ({ children }) => <em className="italic" style={{ color: "var(--wine-medium)" }}>{children}</em>,
        blockquote: ({ children }) => <blockquote className="border-l-3 pl-3 my-2 italic opacity-80" style={{ borderColor: "var(--wine-gold)" }}>{children}</blockquote>,
        code: ({ children }) => <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--wine-light)", color: "var(--wine-deep)" }}>{children}</code>,
        table: ({ children }) => (
          <div className="overflow-x-auto my-3 rounded-lg" style={{ border: "1px solid var(--wine-light)" }}>
            <table className="w-full text-sm border-collapse" style={{ fontFamily: "'Noto Serif SC', serif" }}>{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead style={{ backgroundColor: "var(--wine-deep)", color: "white" }}>{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children, ...props }) => {
          const node = (props as Record<string, unknown>).node as { position?: { start?: { line?: number } } } | undefined;
          const lineNum = node?.position?.start?.line ?? 0;
          const isEven = lineNum % 2 === 0;
          return <tr style={{ backgroundColor: isEven ? "rgba(114, 47, 55, 0.04)" : "transparent", borderBottom: "1px solid var(--wine-light)" }}>{children}</tr>;
        },
        th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide" style={{ borderBottom: "2px solid var(--wine-gold-warm, #C4956A)" }}>{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 text-xs" style={{ color: "var(--wine-text)" }}>{children}</td>,
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}

function WineBottleSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0h8v20h-8zM14 20c-2 4-4 8-4 16v60c0 8 2 14 4 18h-2c0 4 4 6 8 6s8-2 8-6h-2c2-4 4-10 4-18V36c0-8-2-12-4-16H14z" />
    </svg>
  );
}

function GrapeVineSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30 C20 5, 35 5, 50 25 C65 5, 80 5, 90 30" opacity="0.4" />
      <circle cx="30" cy="12" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="28" r="3" fill="currentColor" opacity="0.12" />
      <circle cx="70" cy="12" r="4" fill="currentColor" opacity="0.15" />
      <path d="M25 8 Q30 2 35 8" opacity="0.25" />
      <path d="M65 8 Q70 2 75 8" opacity="0.25" />
    </svg>
  );
}

function TasteProfileSection({
  profile,
  onSendMessage,
}: {
  profile: TasteProfile;
  onSendMessage: (msg: string) => void;
}) {
  const recommendations = useMemo(() => generateRecommendations(profile), [profile]);
  const allTags = useMemo(() => {
    const tags: { label: string; type: string }[] = [];
    profile.regions.forEach(r => tags.push({ label: r, type: "region" }));
    profile.grapes.forEach(g => tags.push({ label: g, type: "grape" }));
    profile.styles.forEach(s => tags.push({ label: s, type: "style" }));
    profile.occasions.forEach(o => tags.push({ label: o, type: "occasion" }));
    if (profile.priceRange) tags.push({ label: `${profile.priceRange}元`, type: "price" });
    return tags;
  }, [profile]);

  if (!hasTasteData(profile)) return null;

  const typeEmoji: Record<string, string> = { region: "📍", grape: "🍇", style: "✨", occasion: "🎯", price: "💰" };

  return (
    <div className="taste-section w-full max-w-md px-2 mt-6">
      <div className="wine-divider">
        <span className="text-xs px-3 whitespace-nowrap" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>🎯 根据你的口味</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-3 mb-4">
        {allTags.map((tag, i) => {
          const queryMap: Record<string, (label: string) => string> = {
            region: (l) => `介绍一下${l}产区的葡萄酒`,
            grape: (l) => `推荐一款${l}葡萄酒`,
            style: (l) => `推荐一款${l}风格的酒`,
            occasion: (l) => `推荐适合${l}的葡萄酒`,
            price: (l) => `推荐${l}价位的葡萄酒`,
          };
          const getQuery = queryMap[tag.type] || ((l: string) => `推荐${l}相关的葡萄酒`);
          return (
            <button
              key={`${tag.type}-${tag.label}`}
              className="taste-tag taste-tag-clickable"
              style={{ animationDelay: `${i * 0.05}s`, cursor: "pointer" }}
              onClick={() => onSendMessage(getQuery(tag.label))}
            >
              {typeEmoji[tag.type]} {tag.label}
            </button>
          );
        })}
      </div>
      {recommendations.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {recommendations.map((rec) => (
            <button key={rec} onClick={() => onSendMessage(rec.replace(/^[^\s]+\s/, ""))} className="taste-recommend-btn text-left text-sm">
              <span className="taste-recommend-text">{rec}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

/* Compress image to small thumbnail for cellar storage */
function compressToThumbnail(base64: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxW = 200;
      let w = img.width;
      let h = img.height;
      if (w > maxW) { h = Math.round((h * maxW) / w); w = maxW; }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(""); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.5));
    };
    img.onerror = () => resolve("");
    img.src = base64;
  });
}

function ImageActionSheet({
  onClose,
  onCamera,
  onGallery,
}: {
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}) {
  return (
    <div className="action-sheet-overlay fixed inset-0 z-50" onClick={onClose}>
      <div
        className="action-sheet-content fixed bottom-0 left-0 right-0 z-50 px-4"
        style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="action-sheet-card rounded-2xl overflow-hidden mb-2" style={{ backgroundColor: "var(--wine-cream)" }}>
          <div className="text-center py-3 border-b" style={{ borderColor: "var(--wine-light)" }}>
            <p className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>选择图片来源</p>
          </div>
          <button onClick={onCamera} className="action-sheet-btn w-full py-4 flex items-center justify-center gap-3 border-b transition-colors" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)", borderColor: "var(--wine-light)", fontSize: "15px" }}>
            <span className="text-xl">📷</span><span>拍照</span>
          </button>
          <button onClick={onGallery} className="action-sheet-btn w-full py-4 flex items-center justify-center gap-3 transition-colors" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)", fontSize: "15px" }}>
            <span className="text-xl">🖼️</span><span>从相册选择</span>
          </button>
        </div>
        <button onClick={onClose} className="action-sheet-card w-full py-4 rounded-2xl text-center transition-colors" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-cream)", color: "var(--wine-medium)", fontSize: "15px", fontWeight: 500 }}>取消</button>
      </div>
    </div>
  );
}

function ImagePreviewBar({ imageSrc, onRemove }: { imageSrc: string; onRemove: () => void }) {
  return (
    <div className="image-preview-bar px-4 pb-2">
      <div className="image-preview-container inline-block relative">
        <img src={imageSrc} alt="预览" className="image-preview-thumb rounded-xl" style={{ width: 72, height: 72, objectFit: "cover", border: "2px solid var(--wine-light)", boxShadow: "0 2px 12px rgba(114, 47, 55, 0.12)" }} />
        <button onClick={onRemove} className="image-preview-remove absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: "var(--wine-deep)", boxShadow: "0 2px 6px rgba(114, 47, 55, 0.3)" }}>✕</button>
      </div>
    </div>
  );
}

function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg z-10" style={{ backgroundColor: "rgba(0,0,0,0.5)", top: "calc(16px + var(--safe-top))" }} onClick={onClose}>✕</button>
      <img src={src} alt="放大查看" className="lightbox-image max-w-[92vw] max-h-[85vh] rounded-xl object-contain" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

/* ─── Action Buttons inside message bubbles ─── */
function MessageActions({
  actions,
  onAction,
}: {
  actions: MessageAction[];
  onAction: (action: MessageAction) => void;
}) {
  return (
    <div className="msg-actions flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(114, 47, 55, 0.1)" }}>
      {actions.map((act) => (
        <button
          key={act.id}
          disabled={act.clicked}
          onClick={() => onAction(act)}
          className="msg-action-btn"
          style={{
            opacity: act.clicked ? 0.5 : 1,
            cursor: act.clicked ? "default" : "pointer",
          }}
        >
          <span className="msg-action-icon">{act.icon}</span>
          <span className="msg-action-label">{act.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Rating Modal ─── */
function RatingModal({
  wineName,
  onSubmit,
  onClose,
}: {
  wineName: string;
  onSubmit: (rating: number, notes: string) => void;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(75);
  const [notes, setNotes] = useState("");

  const getRatingColor = (val: number) => {
    if (val < 40) return "#999";
    if (val < 70) return "#C9A96E";
    return "#722F37";
  };

  return (
    <div className="rating-overlay fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="rating-modal w-full max-w-md mx-4 rounded-t-3xl p-6"
        style={{ backgroundColor: "var(--wine-cream)", marginBottom: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
            🍷 品酒评分
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(114,47,55,0.08)", color: "var(--wine-deep)" }}>✕</button>
        </div>

        <p className="text-sm mb-4" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
          {wineName}
        </p>

        {/* Rating slider */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>评分</span>
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
            style={{
              accentColor: getRatingColor(rating),
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: "#999" }}>1</span>
            <span className="text-xs" style={{ color: "#999" }}>100</span>
          </div>
        </div>

        {/* Notes input */}
        <div className="mb-6">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="记录你的品酒感受..."
            rows={3}
            className="w-full p-3 rounded-xl text-sm resize-none outline-none border transition-all"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              borderColor: "var(--wine-light)",
              color: "var(--wine-text)",
              backgroundColor: "white",
            }}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={() => onSubmit(rating, notes)}
          className="w-full py-3.5 rounded-2xl text-white text-sm font-medium transition-all active:scale-[0.97]"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            background: "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
            boxShadow: "0 4px 16px rgba(114, 47, 55, 0.3)",
          }}
        >
          存入酒窖 🍷
        </button>
      </div>
    </div>
  );
}

/* ─── Toast notification ─── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="toast-container fixed top-20 left-1/2 z-50" style={{ transform: "translateX(-50%)" }}>
      <div className="toast-card px-6 py-3 rounded-2xl text-sm shadow-xl" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-deep)", color: "white" }}>
        {message}
      </div>
    </div>
  );
}

/* ─── Wine Cellar Page ─── */
function CellarPage({
  visible,
  onClose,
  cellar,
  onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  cellar: WineEntry[];
  onDelete: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"drinking" | "wishlist">("drinking");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = cellar.filter(w => w.type === activeTab).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!visible) return null;

  return (
    <div className={`cellar-page fixed inset-0 z-40 ${visible ? "cellar-visible" : ""}`} style={{ backgroundColor: "var(--wine-cream)" }}>
      {/* Header */}
      <div className="cellar-header flex items-center justify-between px-4 pt-4 pb-3" style={{ paddingTop: "calc(16px + var(--safe-top))" }}>
        <div className="w-10" />
        <h2 className="text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
          <span style={{ color: "var(--wine-gold-warm)" }}>✦</span> 我的酒窖 <span style={{ color: "var(--wine-gold-warm)" }}>✦</span>
        </h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-[rgba(114,47,55,0.08)] active:scale-95" style={{ color: "var(--wine-deep)" }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="cellar-tabs flex relative mx-4 mb-4 rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(114,47,55,0.06)" }}>
        <div
          className="cellar-tab-indicator absolute top-1 bottom-1 rounded-lg transition-all duration-300"
          style={{
            width: "calc(50% - 4px)",
            left: activeTab === "drinking" ? "4px" : "calc(50% + 0px)",
            backgroundColor: "white",
            boxShadow: "0 1px 4px rgba(114,47,55,0.12)",
          }}
        />
        <button
          onClick={() => setActiveTab("drinking")}
          className="cellar-tab-btn flex-1 py-3 text-sm text-center relative z-10 transition-colors"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: activeTab === "drinking" ? "var(--wine-deep)" : "var(--wine-accent)",
            fontWeight: activeTab === "drinking" ? 600 : 400,
          }}
        >
          🍷 品过的酒
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className="cellar-tab-btn flex-1 py-3 text-sm text-center relative z-10 transition-colors"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: activeTab === "wishlist" ? "var(--wine-deep)" : "var(--wine-accent)",
            fontWeight: activeTab === "wishlist" ? 600 : 400,
          }}
        >
          🛒 想买的酒
        </button>
      </div>

      {/* Wine list */}
      <div className="flex-1 overflow-y-auto px-4 pb-8" style={{ height: "calc(100vh - 160px)" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center" style={{ minHeight: 300 }}>
            <div className="text-6xl mb-4 opacity-30">🍷</div>
            <p className="text-sm mb-1" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>
              {activeTab === "drinking" ? "还没有品酒记录" : "还没有心愿酒款"}
            </p>
            <p className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.6 }}>
              拍一张酒标开始吧 📷
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((wine) => (
              <div
                key={wine.id}
                className="cellar-card flex gap-3 p-3 rounded-2xl transition-all"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 2px 12px rgba(114, 47, 55, 0.06)",
                  border: "1px solid rgba(114,47,55,0.06)",
                }}
                onContextMenu={(e) => { e.preventDefault(); setDeleteConfirmId(wine.id); }}
              >
                {/* Thumbnail */}
                {wine.image ? (
                  <img src={wine.image} alt={wine.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid var(--wine-light)" }} />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl" style={{ backgroundColor: "rgba(114,47,55,0.06)" }}>
                    🍷
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold truncate" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>
                      {wine.name}
                    </h4>
                    {wine.rating && (
                      <span className="cellar-rating-badge flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: wine.rating >= 70 ? "var(--wine-deep)" : wine.rating >= 40 ? "var(--wine-gold-warm)" : "#999" }}>
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

                {/* Delete button */}
                <button
                  onClick={() => setDeleteConfirmId(wine.id)}
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

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <ConfirmDialog
          message="确定要从酒窖中删除这款酒吗？"
          onConfirm={() => { onDelete(deleteConfirmId); setDeleteConfirmId(null); }}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════
   Main page component
   ═══════════════════════════════════════════ */
export default function Home() {
  /* ── State ── */
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>({ regions: [], grapes: [], styles: [], priceRange: "", occasions: [] });
  const [transitioning, setTransitioning] = useState(false);
  const [sendBtnAnimate, setSendBtnAnimate] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // v0.5 states
  const [showCellar, setShowCellar] = useState(false);
  const [cellar, setCellar] = useState<WineEntry[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState<{ aiNotes: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ── Refs ── */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const lastUserMsgRef = useRef<string>("");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  /* ── Load from localStorage on mount ── */
  useEffect(() => {
    setMessages(loadMessages());
    setTasteProfile(loadTasteProfile());
    setCellar(loadCellar());
    setHydrated(true);
  }, []);

  /* ── Persist to localStorage on change ── */
  useEffect(() => { if (hydrated) saveMessages(messages); }, [messages, hydrated]);
  useEffect(() => { if (hydrated) saveTasteProfile(tasteProfile); }, [tasteProfile, hydrated]);
  useEffect(() => { if (hydrated) saveCellar(cellar); }, [cellar, hydrated]);

  /* ── Smart auto-scroll ── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    userScrolledRef.current = false;
    setShowScrollBtn(false);
  }, []);

  useEffect(() => {
    if (!userScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowScrollBtn(true);
    }
  }, [messages, streamingContent]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
      if (isNearBottom) { userScrolledRef.current = false; setShowScrollBtn(false); }
      else { userScrolledRef.current = true; setShowScrollBtn(true); }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Textarea auto-resize ── */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  /* ── Image handling ── */
  const handleImageFile = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageLoading(true);
    try {
      const compressed = await compressImage(file);
      setPendingImage(compressed);
    } catch (err) {
      console.error("Image compression failed:", err);
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

  /* ── Check if the latest user message had an image ── */
  const lastUserHadImage = useCallback((msgs: Message[]) => {
    // Walk backwards to find the last user message with an image
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        return !!msgs[i].image;
      }
    }
    return false;
  }, []);

  /* ── Get the triggering user message for action detection ── */
  const getLastUserMessage = useCallback((msgs: Message[]) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") return msgs[i].content;
    }
    return "";
  }, []);

  /* ── Send message ── */
  const sendMessage = async (directMessage?: string) => {
    const text = directMessage || input.trim();
    const hasImage = !!pendingImage;
    if ((!text && !hasImage) || isLoading) return;

    if (!directMessage) {
      setSendBtnAnimate(true);
      setTimeout(() => setSendBtnAnimate(false), 400);
    }

    if (messages.length === 0) {
      setTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 280));
      setTransitioning(false);
    }

    const messageText = text || (hasImage ? "请帮我分析这张图片" : "");
    lastUserMsgRef.current = messageText;
    const userMessage: Message = {
      role: "user",
      content: messageText,
      ...(hasImage ? { image: pendingImage!.base64, imageMimeType: pendingImage!.mimeType } : {}),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setPendingImage(null);
    setIsLoading(true);
    setStreamingContent("");
    userScrolledRef.current = false;

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.image ? { image: m.image, imageMimeType: m.imageMimeType } : {}),
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const statusText =
          response.status === 429 ? "请求过于频繁，请稍后重试" :
          response.status === 503 ? "服务暂时不可用，请稍后重试" :
          response.status >= 500 ? "服务器内部错误" :
          `请求失败 (${response.status})`;
        throw new Error(statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) { fullContent += parsed.content; setStreamingContent(fullContent); }
              } catch { /* skip */ }
            }
          }
        }
      }

      // Detect actions to attach to the assistant message
      const hadImage = lastUserHadImage(newMessages);
      const lastUMsg = getLastUserMessage(newMessages);
      let detectedActions: MessageAction[] | undefined;

      // Priority 1: Wine identification → smart routing buttons
      detectedActions = detectWineActions(fullContent, hadImage);
      // Priority 2: Buy mode → wishlist button
      if (!detectedActions) detectedActions = detectBuyModeActions(fullContent, lastUMsg);
      // Priority 3: Drink mode → rate button
      if (!detectedActions) detectedActions = detectDrinkModeActions(fullContent, lastUMsg);

      const assistantMsg: Message = {
        role: "assistant",
        content: fullContent,
        ...(detectedActions ? { actions: detectedActions } : {}),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingContent("");

      if (fullContent) {
        setTasteProfile((prev) => extractTasteFromText(fullContent, prev));
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "未知错误，请稍后重试";
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${errMsg}`, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Handle action button click ── */
  const handleAction = async (action: MessageAction, msgIndex: number) => {
    // Mark as clicked
    setMessages((prev) => {
      const updated = [...prev];
      const msg = { ...updated[msgIndex] };
      if (msg.actions) {
        msg.actions = msg.actions.map(a => a.id === action.id ? { ...a, clicked: true } : a);
      }
      updated[msgIndex] = msg;
      return updated;
    });

    if (action.message) {
      // Send a message (smart routing: buy or drink)
      await sendMessage(action.message);
    } else if (action.action === "save-to-cellar") {
      // Save to wishlist
      const wineName = extractWineNameFromMessages(messages);
      const wineImage = extractWineImageFromMessages(messages);
      let thumbnail: string | undefined;
      if (wineImage) {
        try { thumbnail = await compressToThumbnail(wineImage); } catch { /* skip */ }
      }
      const entry: WineEntry = {
        id: Date.now().toString(),
        name: wineName,
        image: thumbnail,
        type: "wishlist",
        aiNotes: (action.data as Record<string, string>)?.aiNotes || "",
        date: new Date().toISOString().split("T")[0],
      };
      setCellar(prev => [...prev, entry]);
      setToast("📖 已加入心愿清单！");
    } else if (action.action === "rate-wine") {
      // Open rating modal
      setRatingData({ aiNotes: (action.data as Record<string, string>)?.aiNotes || "" });
      setShowRatingModal(true);
    }
  };

  /* ── Handle rating submit ── */
  const handleRatingSubmit = async (rating: number, notes: string) => {
    const wineName = extractWineNameFromMessages(messages);
    const wineImage = extractWineImageFromMessages(messages);
    let thumbnail: string | undefined;
    if (wineImage) {
      try { thumbnail = await compressToThumbnail(wineImage); } catch { /* skip */ }
    }
    const entry: WineEntry = {
      id: Date.now().toString(),
      name: wineName,
      image: thumbnail,
      type: "drinking",
      rating,
      userNotes: notes,
      aiNotes: ratingData?.aiNotes || "",
      date: new Date().toISOString().split("T")[0],
    };
    setCellar(prev => [...prev, entry]);
    setShowRatingModal(false);
    setRatingData(null);
    setToast("🍷 已存入酒窖！");
  };

  /* ── Delete from cellar ── */
  const handleDeleteWine = (id: string) => {
    setCellar(prev => prev.filter(w => w.id !== id));
    setToast("已从酒窖删除");
  };

  /* ── Retry ── */
  const retryLastMessage = () => {
    if (!lastUserMsgRef.current || isLoading) return;
    setMessages((prev) => {
      const cleaned = [...prev];
      if (cleaned.length > 0 && cleaned[cleaned.length - 1].isError) cleaned.pop();
      if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === "user") cleaned.pop();
      return cleaned;
    });
    setTimeout(() => sendMessage(lastUserMsgRef.current), 50);
  };

  /* ── Keyboard handler ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* ── Clear with confirmation ── */
  const confirmClear = () => setShowConfirm(true);
  const doClear = () => {
    setTransitioning(true);
    setTimeout(() => {
      setMessages([]);
      setStreamingContent("");
      setInput("");
      localStorage.removeItem(STORAGE_KEY);
      setShowConfirm(false);
      setTransitioning(false);
    }, 280);
  };

  const showEmptyState = messages.length === 0 && !isLoading;

  /* ═══ Render ═══ */
  return (
    <div
      className="flex flex-col h-screen max-w-3xl mx-auto"
      style={{
        paddingTop: "var(--safe-top)",
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      {/* Confirm dialog */}
      {showConfirm && (
        <ConfirmDialog
          message="确定要清除所有对话记录吗？此操作无法撤销。"
          onConfirm={doClear}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          wineName={extractWineNameFromMessages(messages)}
          onSubmit={handleRatingSubmit}
          onClose={() => { setShowRatingModal(false); setRatingData(null); }}
        />
      )}

      {/* Wine Cellar Page */}
      <CellarPage
        visible={showCellar}
        onClose={() => setShowCellar(false)}
        cellar={cellar}
        onDelete={handleDeleteWine}
      />

      {/* Header */}
      <header className="header-animate header-decorated flex items-center justify-between py-5 px-4">
        <div className="w-10" />
        <button
          onClick={() => { if (messages.length > 0) confirmClear(); }}
          className="text-center group"
          style={{ cursor: messages.length > 0 ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
          title={messages.length > 0 ? "回到主页" : undefined}
        >
          <h1
            className="text-2xl font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-opacity group-hover:opacity-80"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif", color: "var(--wine-deep)" }}
          >
            {messages.length > 0 && (
              <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ color: "var(--wine-deep)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            )}
            <span style={{ color: "var(--wine-gold-warm)" }}>✦</span>
            {" "}瑞莫品酒顾问{" "}
            <span style={{ color: "var(--wine-gold-warm)" }}>✦</span>
          </h1>
          <p className="text-xs mt-1.5 tracking-wider" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.7 }}>
            Raymo Wine Advisor · AI驱动的专业品酒体验
          </p>
        </button>
        <div className="flex items-center gap-1">
          {/* Cellar button */}
          <button
            onClick={() => setShowCellar(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-[rgba(114,47,55,0.08)] active:scale-95"
            title="我的酒窖"
          >
            <svg className="w-5 h-5" fill="none" stroke="var(--wine-deep)" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </button>
          {messages.length > 0 && (
            <button
              onClick={confirmClear}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-[rgba(114,47,55,0.08)] active:scale-95"
              title="新对话"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: "var(--wine-deep)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {showEmptyState && (
          <div className={`flex flex-col items-center min-h-full empty-state-bg py-4 ${transitioning ? "fade-out-up" : "welcome-animate"}`}>
            <WineBottleSVG className="wine-bottle-decor" style={{ width: 30, height: 90, top: "8%", left: "8%", color: "var(--wine-deep)", opacity: 0.04, position: "absolute", transform: "rotate(-12deg)" }} />
            <WineBottleSVG className="wine-bottle-decor" style={{ width: 25, height: 75, top: "12%", right: "10%", color: "var(--wine-accent)", opacity: 0.04, position: "absolute", transform: "rotate(8deg)" }} />

            {/* Brand Header */}
            <div className="wine-icon-float text-5xl mt-6 mb-3">🍷</div>
            <div className="wine-decoration text-center mb-1">
              <h2 className="text-lg font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif", color: "var(--wine-deep)" }}>您的AI侍酒师，随时待命</h2>
            </div>

            {/* Scenario Cards */}
            <div className="w-full max-w-md px-4 mt-5 space-y-3">
              <p className="text-xs text-center mb-3" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.7 }}>您现在的场景是？</p>

              <div className="grid grid-cols-2 gap-3">
                {/* 在餐厅 */}
                <button
                  onClick={() => sendMessage("我现在在餐厅，想找一款合适的酒搭配今天的菜，请问你需要了解什么信息来帮我推荐？")}
                  className="scenario-card quick-btn-animate stagger-1 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
                  style={{ borderColor: "var(--wine-light)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-2xl mb-2">🍽️</span>
                  <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>在餐厅</span>
                  <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>找搭配，快速推荐</span>
                </button>

                {/* 选购葡萄酒 */}
                <button
                  onClick={() => sendMessage("我想选购一瓶葡萄酒，能帮我推荐吗？请先问我一些问题来了解我的需求。")}
                  className="scenario-card quick-btn-animate stagger-2 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
                  style={{ borderColor: "var(--wine-light)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-2xl mb-2">🛒</span>
                  <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>选购葡萄酒</span>
                  <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>按场景、口味、预算选酒</span>
                </button>

                {/* 认识一瓶酒 */}
                <button
                  onClick={() => {
                    setShowActionSheet(true);
                  }}
                  className="scenario-card quick-btn-animate stagger-3 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
                  style={{ borderColor: "var(--wine-light)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-2xl mb-2">📸</span>
                  <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>认识一瓶酒</span>
                  <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>拍照识酒，了解详情</span>
                </button>

                {/* 品酒记录 */}
                <button
                  onClick={() => sendMessage("我正在品酒，想让你引导我做一次专业的品鉴体验。请一步一步带我从外观、香气、口感到余味来品评。")}
                  className="scenario-card quick-btn-animate stagger-4 flex flex-col items-start p-4 rounded-2xl border text-left transition-all"
                  style={{ borderColor: "var(--wine-light)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-2xl mb-2">🍷</span>
                  <span className="text-sm font-semibold mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-deep)" }}>品酒记录</span>
                  <span className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>AI引导品鉴，边喝边记</span>
                </button>
              </div>

              {/* Divider */}
              <div className="wine-divider mt-4">
                <span className="text-xs px-3 whitespace-nowrap" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.6 }}>或直接提问</span>
              </div>

              {/* Quick questions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {["推荐入门红酒", "牛排配什么酒", "波尔多产区介绍", "今天喝什么"].map((q, idx) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="quick-chip px-3 py-1.5 rounded-full text-xs transition-all"
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      color: "var(--wine-deep)",
                      border: "1px solid var(--wine-light)",
                      background: "rgba(255,255,255,0.5)",
                      animationDelay: `${0.3 + idx * 0.05}s`,
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {hydrated && <TasteProfileSection profile={tasteProfile} onSendMessage={sendMessage} />}
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-enter flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-1" style={{ backgroundColor: "var(--wine-deep)", color: "white" }}>🍷</div>
            )}
            <div
              className={`msg-bubble max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "border"}`}
              style={{
                fontFamily: "'Noto Serif SC', serif",
                ...(msg.role === "user"
                  ? { background: "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))", boxShadow: "0 2px 8px rgba(114, 47, 55, 0.2)" }
                  : { backgroundColor: "white", borderColor: msg.isError ? "var(--wine-medium)" : "var(--wine-light)", color: "var(--wine-text)", boxShadow: "0 1px 4px rgba(114, 47, 55, 0.06)" }),
              }}
            >
              {msg.role === "assistant" ? (
                <>
                  <MarkdownContent content={msg.content} />
                  {msg.isError && (
                    <button className="retry-btn" onClick={retryLastMessage}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      重试
                    </button>
                  )}
                  {msg.actions && msg.actions.length > 0 && (
                    <MessageActions actions={msg.actions} onAction={(act) => handleAction(act, i)} />
                  )}
                </>
              ) : (
                <>
                  {msg.image && (
                    <div className="mb-2">
                      <img src={msg.image} alt="用户上传的图片" className="chat-image-thumb rounded-xl cursor-pointer" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} onClick={() => setLightboxImage(msg.image!)} />
                    </div>
                  )}
                  {msg.content && !(msg.image && msg.content === "请帮我分析这张图片") && <span>{msg.content}</span>}
                  {msg.image && msg.content === "请帮我分析这张图片" && <span className="text-xs opacity-80">📷 请帮我分析这张图片</span>}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {isLoading && streamingContent && (
          <div className="message-enter flex gap-3 justify-start">
            <div className="ai-avatar-pulse flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-1" style={{ backgroundColor: "var(--wine-deep)", color: "white" }}>🍷</div>
            <div className="msg-bubble max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed border cursor-blink" style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "white", borderColor: "var(--wine-light)", color: "var(--wine-text)", boxShadow: "0 1px 4px rgba(114, 47, 55, 0.06)" }}>
              <MarkdownContent content={streamingContent} isStreaming={true} />
            </div>
          </div>
        )}

        {/* Wine glass loader */}
        {isLoading && !streamingContent && (
          <div className="message-enter flex gap-3 justify-start">
            <div className="ai-avatar-pulse flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: "var(--wine-deep)", color: "white" }}>🍷</div>
            <div className="px-5 py-4 rounded-2xl border" style={{ backgroundColor: "white", borderColor: "var(--wine-light)", boxShadow: "0 1px 4px rgba(114, 47, 55, 0.06)" }}>
              <WineGlassLoader />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollBtn && messages.length > 0 && <ScrollToBottomButton onClick={scrollToBottom} />}

      {/* Action Sheet */}
      {showActionSheet && (
        <ImageActionSheet
          onClose={() => setShowActionSheet(false)}
          onCamera={() => { setShowActionSheet(false); setTimeout(() => cameraInputRef.current?.click(), 100); }}
          onGallery={() => { setShowActionSheet(false); setTimeout(() => galleryInputRef.current?.click(), 100); }}
        />
      )}

      {/* Image Lightbox */}
      {lightboxImage && <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />}

      {/* Hidden file inputs */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInputChange} className="hidden" />
      <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

      {/* Input Area */}
      <div className="footer-decorated px-4 py-4" style={{ paddingBottom: "calc(1.5rem + var(--safe-bottom))" }}>
        {(pendingImage || imageLoading) && (
          <div className="image-preview-bar pb-2">
            {imageLoading ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(114, 47, 55, 0.06)", border: "1px solid var(--wine-light)" }}>
                <div className="image-loading-spinner" />
                <span className="text-xs" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)" }}>处理图片中…</span>
              </div>
            ) : pendingImage ? (
              <ImagePreviewBar imageSrc={pendingImage.base64} onRemove={() => setPendingImage(null)} />
            ) : null}
          </div>
        )}

        <div className="input-container flex items-end gap-2 rounded-2xl px-3 py-3" style={{ backgroundColor: "white" }}>
          <button onClick={() => setShowActionSheet(true)} disabled={isLoading} className="camera-btn flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30" style={{ backgroundColor: pendingImage ? "var(--wine-deep)" : "transparent", border: pendingImage ? "none" : "1.5px solid var(--wine-light)" }} title="拍照/选择图片">
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
            placeholder={pendingImage ? "添加说明（可选）" : "请问您想了解哪方面的葡萄酒知识？"}
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent text-sm leading-relaxed sm:text-sm text-base"
            style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-text)", fontSize: "16px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={(!input.trim() && !pendingImage) || isLoading}
            className={`send-btn flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30 ${sendBtnAnimate ? "send-btn-fly" : ""}`}
            style={{ backgroundColor: (input.trim() || pendingImage) ? "var(--wine-deep)" : "var(--wine-light)", boxShadow: (input.trim() || pendingImage) ? "0 2px 8px rgba(114, 47, 55, 0.3)" : "none" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, var(--wine-accent))" }} />
          <p className="text-xs text-center" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.45 }}>瑞莫科技 · Raymo Tech © 2026</p>
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, var(--wine-accent), transparent)" }} />
        </div>
      </div>
    </div>
  );
}
