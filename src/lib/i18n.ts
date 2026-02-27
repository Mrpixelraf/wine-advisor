export type Locale = "zh" | "en";

export const translations = {
  zh: {
    // Header
    brandName: "瑞莫品酒顾问",
    brandSub: "Raymo Wine Advisor · AI驱动的专业品酒体验",
    myCellar: "我的酒窖",
    newChat: "新对话",

    // Home
    tagline: "您的AI侍酒师，随时待命",
    scenePrompt: "您现在的场景是？",
    orAsk: "或直接提问",

    // Scenario cards
    scene1Title: "在餐厅",
    scene1Desc: "找搭配，快速推荐",
    scene1Msg: "我现在在餐厅，想找一款合适的酒搭配今天的菜，请问你需要了解什么信息来帮我推荐？",
    scene2Title: "选购葡萄酒",
    scene2Desc: "按场景、口味、预算选酒",
    scene2Msg: "我想选购一瓶葡萄酒，能帮我推荐吗？请先问我一些问题来了解我的需求。",
    scene3Title: "认识一瓶酒",
    scene3Desc: "拍照识酒，了解详情",
    scene4Title: "品酒记录",
    scene4Desc: "AI引导品鉴，边喝边记",
    scene4Msg: "我正在品酒，想让你引导我做一次专业的品鉴体验。请一步一步带我从外观、香气、口感到余味来品评。",

    // Quick questions
    quick1: "推荐入门红酒",
    quick2: "牛排配什么酒",
    quick3: "波尔多产区介绍",
    quick4: "今天喝什么",

    // Input
    placeholder: "请问您想了解哪方面的葡萄酒知识？",
    placeholderImg: "添加说明（可选）",
    photoBtn: "拍照/选择图片",

    // Cellar
    cellarTitle: "我的酒窖",
    cellarDrinking: "🍷 品过的酒",
    cellarWishlist: "🛒 想买的酒",
    cellarEmptyDrinking: "还没有品酒记录",
    cellarEmptyWishlist: "还没有心愿酒款",
    cellarEmptyHint: "拍一张酒标开始吧 📷",
    cellarDeleteConfirm: "确定要从酒窖中删除这款酒吗？",

    // Rating
    ratingTitle: "🍷 品酒评分",
    ratingLabel: "评分",
    ratingNotes: "记录你的品酒感受...",
    ratingSave: "存入酒窖 🍷",

    // Actions
    wantBuy: "想买这款酒",
    drinking: "正在喝这款酒",
    addWishlist: "加入心愿清单",
    rateWine: "记录品酒体验",

    // Image action sheet
    imgSourceTitle: "选择图片来源",
    imgCamera: "拍照",
    imgGallery: "从相册选择",
    cancel: "取消",
    confirm: "确认",

    // Misc
    clearConfirm: "确定要清除所有对话记录吗？此操作无法撤销。",
    errorGeneric: "连接出现问题。请检查网络后重试。",
    errorRate: "请求过于频繁，请稍后重试",
    errorServer: "服务器内部错误",
    errorService: "服务暂时不可用，请稍后重试",
    retry: "重试",
    analyzing: "品鉴中…",
    processingImg: "处理图片中…",
    savedCellar: "🍷 已存入酒窖！",
    savedWishlist: "📖 已加入心愿清单！",
    deletedCellar: "已从酒窖删除",
    footer: "瑞莫科技 · Raymo Tech © 2026",
    tasteLabel: "🎯 根据你的口味",
    analyzeImg: "请帮我分析这张图片",
    scrollToBottom: "回到最新",
  },
  en: {
    brandName: "Raymo Wine Advisor",
    brandSub: "AI-Powered Professional Wine Experience",
    myCellar: "My Cellar",
    newChat: "New Chat",

    tagline: "Your AI Sommelier, Always Ready",
    scenePrompt: "What's your situation?",
    orAsk: "or just ask",

    scene1Title: "At a Restaurant",
    scene1Desc: "Find the perfect pairing",
    scene1Msg: "I'm at a restaurant and looking for a wine to pair with my meal. What do you need to know to help me choose?",
    scene2Title: "Shopping for Wine",
    scene2Desc: "By occasion, taste & budget",
    scene2Msg: "I'd like to buy a bottle of wine. Can you help me choose? Please ask me some questions to understand my needs.",
    scene3Title: "Identify a Wine",
    scene3Desc: "Snap a photo, learn more",
    scene4Title: "Tasting Notes",
    scene4Desc: "AI-guided tasting journal",
    scene4Msg: "I'm tasting a wine right now. Please guide me through a professional tasting — step by step from appearance, aroma, palate to finish.",

    quick1: "Recommend a beginner wine",
    quick2: "Best wine for steak",
    quick3: "About Bordeaux region",
    quick4: "What should I drink today",

    placeholder: "Ask me anything about wine...",
    placeholderImg: "Add a note (optional)",
    photoBtn: "Take photo / Choose image",

    cellarTitle: "My Cellar",
    cellarDrinking: "🍷 Tasted",
    cellarWishlist: "🛒 Wishlist",
    cellarEmptyDrinking: "No tasting records yet",
    cellarEmptyWishlist: "No wines on your wishlist",
    cellarEmptyHint: "Snap a wine label to get started 📷",
    cellarDeleteConfirm: "Remove this wine from your cellar?",

    ratingTitle: "🍷 Rate This Wine",
    ratingLabel: "Rating",
    ratingNotes: "Share your tasting thoughts...",
    ratingSave: "Save to Cellar 🍷",

    wantBuy: "I want to buy this",
    drinking: "I'm drinking this",
    addWishlist: "Add to Wishlist",
    rateWine: "Record Tasting",

    imgSourceTitle: "Choose Image Source",
    imgCamera: "Take Photo",
    imgGallery: "Choose from Gallery",
    cancel: "Cancel",
    confirm: "Confirm",

    clearConfirm: "Clear all conversation history? This cannot be undone.",
    errorGeneric: "Connection issue. Please check your network and try again.",
    errorRate: "Too many requests. Please wait a moment.",
    errorServer: "Internal server error",
    errorService: "Service temporarily unavailable",
    retry: "Retry",
    analyzing: "Analyzing…",
    processingImg: "Processing image…",
    savedCellar: "🍷 Saved to cellar!",
    savedWishlist: "📖 Added to wishlist!",
    deletedCellar: "Removed from cellar",
    footer: "Raymo Tech © 2026",
    tasteLabel: "🎯 Based on your taste",
    analyzeImg: "Please analyze this image",
    scrollToBottom: "Back to latest",
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

const LOCALE_KEY = "wine-advisor-locale";

export function loadLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  return (localStorage.getItem(LOCALE_KEY) as Locale) || "zh";
}

export function saveLocale(locale: Locale) {
  localStorage.setItem(LOCALE_KEY, locale);
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations.zh[key] || key;
}
