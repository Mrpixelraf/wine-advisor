import type { Message, MessageAction } from "./types";
import type { Locale } from "./i18n";
import { t } from "./i18n";

/** Detect wine recognition actions from AI response */
export function detectWineActions(
  aiContent: string,
  hasImageContext: boolean,
  locale: Locale
): MessageAction[] | undefined {
  if (!hasImageContext) return undefined;

  const wineIdentifiers = [
    "识别", "识别出", "这款酒", "这瓶酒", "这是一款", "这瓶", "酒标", "酒款", "年份", "产区", "葡萄品种", "请问你现在是",
    "identified", "recognized", "appears to be", "this wine", "this bottle", "this is a", "wine label", "vintage", "region", "grape variet", "Are you looking to",
  ];
  const looksLikeWineId = wineIdentifiers.some((k) => aiContent.toLowerCase().includes(k.toLowerCase()));
  if (!looksLikeWineId) return undefined;

  return [
    {
      id: "buy-" + Date.now(),
      label: t(locale, "wantBuy"),
      icon: "🛒",
      message: t(locale, "wantBuyMsg"),
    },
    {
      id: "drink-" + Date.now(),
      label: t(locale, "drinking"),
      icon: "🍷",
      message: t(locale, "drinkingMsg"),
    },
  ];
}

/** Detect buy-mode actions */
export function detectBuyModeActions(
  aiContent: string,
  userMessage: string,
  locale: Locale
): MessageAction[] | undefined {
  if (!userMessage.includes("我想买这款酒") && !userMessage.toLowerCase().includes("i want to buy this wine"))
    return undefined;
  const buyKeywords = ["评分", "推荐", "评价", "/100", "分", "rating", "recommend", "score", "review"];
  if (!buyKeywords.some((k) => aiContent.toLowerCase().includes(k.toLowerCase()))) return undefined;

  return [
    {
      id: "wishlist-" + Date.now(),
      label: t(locale, "addWishlist"),
      icon: "📖",
      action: "save-to-cellar",
      data: { type: "wishlist", aiNotes: aiContent },
    },
  ];
}

/** Detect drink-mode actions */
export function detectDrinkModeActions(
  aiContent: string,
  userMessage: string,
  locale: Locale
): MessageAction[] | undefined {
  if (!userMessage.includes("我正在喝这款酒") && !userMessage.toLowerCase().includes("i'm drinking this wine"))
    return undefined;
  const drinkKeywords = ["Tasting", "品鉴", "香气", "口感", "余味", "酒体", "Appearance", "Nose", "Palate", "Finish", "Aroma"];
  if (!drinkKeywords.some((k) => aiContent.includes(k))) return undefined;

  return [
    {
      id: "rate-" + Date.now(),
      label: t(locale, "rateWine"),
      icon: "⭐",
      action: "rate-wine",
      data: { type: "drinking", aiNotes: aiContent },
    },
  ];
}

/** Extract wine name from conversation context */
export function extractWineNameFromMessages(messages: Message[], locale: Locale = "zh"): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant") {
      const zhPatterns = [
        /这是一[款瓶](.+?)[，。！]/,
        /这款酒是(.+?)[，。！]/,
        /识别[到为](.+?)[，。！]/,
        /《(.+?)》/,
        /「(.+?)」/,
        /[「""](.+?)[」""]/,
      ];
      for (const p of zhPatterns) {
        const m = msg.content.match(p);
        if (m) return m[1].trim();
      }
      const nameMatch = msg.content.match(/酒名[：:]\s*(.+)/);
      if (nameMatch) return nameMatch[1].trim().split(/[，。\n]/)[0];
      const enPatterns = [
        /[Tt]his is (?:a |an )?(.+?)[.,!]/,
        /[Tt]his wine is (?:a |an )?(.+?)[.,!]/,
        /[Ii]dentified as (.+?)[.,!]/,
        /"(.+?)"/,
        /\*\*(.+?)\*\*/,
      ];
      for (const p of enPatterns) {
        const m = msg.content.match(p);
        if (m) return m[1].trim();
      }
    }
  }
  return t(locale, "unknownWine");
}

/** Extract wine image from conversation */
export function extractWineImageFromMessages(messages: Message[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user" && messages[i].image) {
      return messages[i].image;
    }
  }
  return undefined;
}
