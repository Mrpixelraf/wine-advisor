import type { ReactNode } from "react";
import type { Locale } from "./i18n";

/* ─── Message Types ─── */
export interface MessageAction {
  id: string;
  label: string;
  icon: string;
  message?: string;
  action?: string;
  data?: Record<string, unknown>;
  clicked?: boolean;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  image?: string;
  imageMimeType?: string;
  actions?: MessageAction[];
  hidden?: boolean;
}

/* ─── Taste Profile ─── */
export interface TasteProfile {
  regions: string[];
  grapes: string[];
  styles: string[];
  priceRange: string;
  occasions: string[];
}

/* ─── Wine Cellar ─── */
export interface WineTags {
  appearance?: string[];
  aroma?: string[];
  palate?: string[];
  finish?: string[];
}

export interface WineEntry {
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
  tags?: WineTags;
}

/* ─── Tasting Tag Definitions ─── */
export const TASTING_TAG_CATEGORIES: {
  key: keyof WineTags;
  emoji: string;
  label: { zh: string; en: string };
  tags: { zh: string; en: string }[];
}[] = [
  {
    key: "appearance",
    emoji: "🔍",
    label: { zh: "外观", en: "Appearance" },
    tags: [
      { zh: "浅金色", en: "Light Gold" },
      { zh: "金黄", en: "Golden" },
      { zh: "琥珀", en: "Amber" },
      { zh: "浅红", en: "Light Red" },
      { zh: "宝石红", en: "Ruby" },
      { zh: "深紫红", en: "Deep Purple" },
      { zh: "棕红", en: "Tawny" },
    ],
  },
  {
    key: "aroma",
    emoji: "👃",
    label: { zh: "闻香", en: "Aroma" },
    tags: [
      { zh: "果香", en: "Fruity" },
      { zh: "花香", en: "Floral" },
      { zh: "香料", en: "Spice" },
      { zh: "橡木", en: "Oak" },
      { zh: "矿物", en: "Mineral" },
      { zh: "草本", en: "Herbal" },
      { zh: "蜂蜜", en: "Honey" },
      { zh: "坚果", en: "Nutty" },
      { zh: "黄油", en: "Buttery" },
      { zh: "烟熏", en: "Smoky" },
    ],
  },
  {
    key: "palate",
    emoji: "👅",
    label: { zh: "口感", en: "Palate" },
    tags: [
      { zh: "轻盈", en: "Light" },
      { zh: "中等", en: "Medium" },
      { zh: "饱满", en: "Full" },
      { zh: "高酸", en: "High Acid" },
      { zh: "中酸", en: "Med Acid" },
      { zh: "低酸", en: "Low Acid" },
      { zh: "细腻单宁", en: "Soft Tannin" },
      { zh: "强劲单宁", en: "Firm Tannin" },
      { zh: "甜润", en: "Sweet" },
      { zh: "干爽", en: "Dry" },
    ],
  },
  {
    key: "finish",
    emoji: "✨",
    label: { zh: "余味", en: "Finish" },
    tags: [
      { zh: "短促", en: "Short" },
      { zh: "中等", en: "Medium" },
      { zh: "悠长", en: "Long" },
      { zh: "回甘", en: "Sweet Aftertaste" },
      { zh: "果味余韵", en: "Fruity Finish" },
      { zh: "香料余韵", en: "Spicy Finish" },
    ],
  },
];

/* ─── Scene Types ─── */
export type SceneType = "restaurant" | "shopping" | "identify" | "tasting" | null;

export interface SceneConfig {
  type: Exclude<SceneType, null>;
  emoji: string;
  titleKey: string;
  descKey: string;
  msgKey?: string;
  quickKeys?: string[];
}

export const SCENE_CONFIGS: SceneConfig[] = [
  {
    type: "restaurant",
    emoji: "🍽️",
    titleKey: "scene1Title",
    descKey: "scene1Desc",
    msgKey: "scene1Msg",
    quickKeys: ["sceneRestChinese", "sceneRestWestern", "sceneRestJapanese", "sceneRestBBQ"],
  },
  {
    type: "shopping",
    emoji: "🛒",
    titleKey: "scene2Title",
    descKey: "scene2Desc",
    msgKey: "scene2Msg",
    quickKeys: ["sceneShopSelf", "sceneShopFriends", "sceneShopBusiness", "sceneShopDate", "sceneShopGift"],
  },
  {
    type: "identify",
    emoji: "📸",
    titleKey: "scene3Title",
    descKey: "scene3Desc",
  },
  {
    type: "tasting",
    emoji: "🍷",
    titleKey: "scene4Title",
    descKey: "scene4Desc",
    msgKey: "scene4Msg",
    quickKeys: ["sceneTastePhoto", "sceneTasteCellar"],
  },
];

/* ─── Onboarding ─── */
export interface OnboardingStep {
  title: { zh: string; en: string };
  subtitle?: { zh: string; en: string };
  slogan?: { zh: string; en: string };
  description: { zh: string; en: string };
  detail?: { zh: string; en: string };
  icon: ReactNode;
  targetId?: string;
  btnText: { zh: string; en: string };
}

/* ─── Storage Keys ─── */
export const STORAGE_KEY = "wine-advisor-messages";
export const TASTE_PROFILE_KEY = "wine-advisor-taste-profile";
export const CELLAR_KEY = "wineCellar";
export const ONBOARDING_KEY = "wine-advisor-onboarded";
