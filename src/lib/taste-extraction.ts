import type { TasteProfile } from "./types";
import type { Locale } from "./i18n";
import { t, displayLabel } from "./i18n";

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

export function extractTasteFromText(text: string, currentProfile: TasteProfile): TasteProfile {
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

export function hasTasteData(profile: TasteProfile): boolean {
  return (
    profile.regions.length > 0 ||
    profile.grapes.length > 0 ||
    profile.styles.length > 0 ||
    profile.occasions.length > 0
  );
}

export function generateRecommendations(profile: TasteProfile, locale: Locale): string[] {
  const recs: string[] = [];
  if (profile.regions.includes("波尔多")) recs.push(t(locale, "recBordeaux"));
  if (profile.regions.includes("勃艮第")) recs.push(t(locale, "recBurgundy"));
  if (profile.grapes.includes("赤霞珠") && !recs.some((r) => r.includes(locale === "zh" ? "赤霞珠" : "Cabernet")))
    recs.push(t(locale, "recCabernet"));
  if (profile.grapes.includes("霞多丽")) recs.push(t(locale, "recChardonnay"));
  if (profile.styles.includes("饱满型")) recs.push(t(locale, "recFullBodied"));
  if (profile.styles.includes("清爽型")) recs.push(t(locale, "recRefreshing"));
  if (profile.occasions.includes("约会")) recs.push(t(locale, "recDate"));
  if (profile.occasions.includes("商务")) recs.push(t(locale, "recBusiness"));
  if (profile.occasions.includes("餐酒搭配")) recs.push(t(locale, "recPairing"));
  if (profile.regions.includes("托斯卡纳")) recs.push(t(locale, "recTuscany"));
  if (profile.grapes.includes("雷司令")) recs.push(t(locale, "recRiesling"));
  if (profile.grapes.includes("西拉")) recs.push(t(locale, "recSyrah"));
  if (profile.styles.includes("甜型")) recs.push(t(locale, "recSweet"));
  if (profile.occasions.includes("送礼")) recs.push(t(locale, "recGift"));
  if (recs.length < 3) {
    if (profile.grapes.length > 0 && recs.length < 4)
      recs.push(t(locale, "recExploreGrape").replace("{0}", displayLabel(locale, profile.grapes[0])));
    if (profile.regions.length > 0 && recs.length < 4)
      recs.push(t(locale, "recExploreRegion").replace("{0}", displayLabel(locale, profile.regions[0])));
  }
  return recs.slice(0, 4);
}
