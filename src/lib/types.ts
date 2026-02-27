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

/* ─── Guided Tasting Types ─── */
export type TastingLevel = "beginner" | "intermediate" | "expert";

export interface TastingStep {
  key: "appearance" | "aroma" | "palate" | "finish";
  emoji: string;
  labelKey: string;
}

export const TASTING_STEPS: TastingStep[] = [
  { key: "appearance", emoji: "👁️", labelKey: "stepAppearance" },
  { key: "aroma", emoji: "👃", labelKey: "stepAroma" },
  { key: "palate", emoji: "👅", labelKey: "stepPalate" },
  { key: "finish", emoji: "✨", labelKey: "stepFinish" },
];

export interface GuidedTastingData {
  wineName: string;
  wineImage?: string;
  level: TastingLevel;
  appearance: {
    color: string[];
    clarity: string[];
  };
  aroma: {
    primary: string[];
    secondary: string[];
    intensity: number; // 1-5
  };
  palate: {
    acidity: number; // 1-5
    tannin: number; // 1-5
    body: number; // 1-5
    texture: string[];
    sweetness: string;
  };
  finish: {
    length: string;
    descriptors: string[];
    overallScore: number; // 1-100
  };
}

/* ─── Guided Tasting Tag Definitions ─── */
export const APPEARANCE_COLORS = [
  { zh: "浅金色", en: "Light Gold" },
  { zh: "金黄", en: "Golden" },
  { zh: "琥珀", en: "Amber" },
  { zh: "浅红", en: "Light Red" },
  { zh: "宝石红", en: "Ruby" },
  { zh: "深紫红", en: "Deep Purple" },
  { zh: "棕红", en: "Tawny" },
];

export const APPEARANCE_CLARITY = [
  { zh: "清澈", en: "Clear" },
  { zh: "微浑", en: "Slightly Hazy" },
  { zh: "明亮", en: "Brilliant" },
];

export interface AromaCategoryDef {
  key: string;
  emoji: string;
  label: { zh: string; en: string };
  secondary: { zh: string; en: string }[];
}

export const AROMA_CATEGORIES: AromaCategoryDef[] = [
  {
    key: "fruit", emoji: "🍎",
    label: { zh: "果香", en: "Fruity" },
    secondary: [
      { zh: "樱桃", en: "Cherry" }, { zh: "黑莓", en: "Blackberry" },
      { zh: "李子", en: "Plum" }, { zh: "柑橘", en: "Citrus" },
      { zh: "蓝莓", en: "Blueberry" }, { zh: "苹果", en: "Apple" },
      { zh: "桃子", en: "Peach" },
    ],
  },
  {
    key: "floral", emoji: "🌸",
    label: { zh: "花香", en: "Floral" },
    secondary: [
      { zh: "玫瑰", en: "Rose" }, { zh: "紫罗兰", en: "Violet" },
      { zh: "茉莉", en: "Jasmine" }, { zh: "橙花", en: "Orange Blossom" },
    ],
  },
  {
    key: "herbal", emoji: "🌿",
    label: { zh: "草本", en: "Herbal" },
    secondary: [
      { zh: "薄荷", en: "Mint" }, { zh: "百里香", en: "Thyme" },
      { zh: "青椒", en: "Green Pepper" }, { zh: "烟草", en: "Tobacco" },
    ],
  },
  {
    key: "toast", emoji: "🍞",
    label: { zh: "烘烤", en: "Toasty" },
    secondary: [
      { zh: "橡木", en: "Oak" }, { zh: "香草", en: "Vanilla" },
      { zh: "咖啡", en: "Coffee" }, { zh: "巧克力", en: "Chocolate" },
      { zh: "烤面包", en: "Toast" },
    ],
  },
  {
    key: "mineral", emoji: "💎",
    label: { zh: "矿物", en: "Mineral" },
    secondary: [
      { zh: "石灰", en: "Limestone" }, { zh: "燧石", en: "Flint" },
      { zh: "潮湿泥土", en: "Wet Earth" },
    ],
  },
  {
    key: "honey", emoji: "🍯",
    label: { zh: "蜂蜜", en: "Honey" },
    secondary: [
      { zh: "蜂蜜", en: "Honey" }, { zh: "焦糖", en: "Caramel" },
      { zh: "杏仁", en: "Almond" },
    ],
  },
];

export const PALATE_TEXTURES = [
  { zh: "丝滑", en: "Silky" },
  { zh: "紧实", en: "Firm" },
  { zh: "多汁", en: "Juicy" },
  { zh: "圆润", en: "Round" },
  { zh: "粗糙", en: "Coarse" },
  { zh: "清爽", en: "Crisp" },
  { zh: "油润", en: "Oily" },
];

export const PALATE_SWEETNESS = [
  { zh: "干型", en: "Dry" },
  { zh: "微甜", en: "Off-dry" },
  { zh: "甜", en: "Sweet" },
];

export const FINISH_LENGTHS = [
  { zh: "短(<3秒)", en: "Short (<3s)" },
  { zh: "中(3-8秒)", en: "Medium (3-8s)" },
  { zh: "长(>8秒)", en: "Long (>8s)" },
];

export const FINISH_DESCRIPTORS = [
  { zh: "愉悦", en: "Pleasant" },
  { zh: "复杂", en: "Complex" },
  { zh: "简单", en: "Simple" },
  { zh: "回甘", en: "Sweet Return" },
  { zh: "苦涩", en: "Bitter" },
  { zh: "温暖", en: "Warm" },
];

/* ─── Storage Keys ─── */
export const STORAGE_KEY = "wine-advisor-messages";
export const TASTE_PROFILE_KEY = "wine-advisor-taste-profile";
export const CELLAR_KEY = "wineCellar";
export const ONBOARDING_KEY = "wine-advisor-onboarded";
export const TASTING_LEVEL_KEY = "somme-tasting-level";
