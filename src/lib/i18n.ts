export type Locale = "zh" | "en";

export const translations = {
  zh: {
    // Header
    brandName: "Sommé 颂美",
    brandSub: "Your Personal Sommelier · 好酒不必懂，懂你就够了",
    myCellar: "我的酒窖",
    newChat: "新对话",
    backHome: "回到首页",
    backToChat: "返回对话",

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
    scene3Msg: "我手上有一瓶酒，想详细了解它。请帮我识别并介绍这款酒。",
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

    // Action messages (sent to AI when action buttons are clicked)
    wantBuyMsg: "我想买这款酒，请给我详细评价",
    drinkingMsg: "我正在喝这款酒，请给我 Tasting Notes",

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
    errorRequestFailed: "请求失败",
    errorNetworkFailed: "网络连接失败，请检查网络后重试",
    errorUnknown: "未知错误，请稍后重试",
    errorImgProcess: "图片处理失败，请尝试截图后重新上传",
    errorStorageFull: "存储空间不足，请清理部分酒窖记录",
    retry: "重试",
    analyzing: "品鉴中…",
    processingImg: "处理图片中…",
    savedCellar: "🍷 已存入酒窖！",
    savedWishlist: "📖 已加入心愿清单！",
    deletedCellar: "已从酒窖删除",
    footer: "Sommé 颂美 · Raymo Tech © 2026",
    tasteLabel: "🎯 根据你的口味",
    analyzeImg: "请帮我分析这张图片",
    scrollToBottom: "回到最新",
    imgOmitted: "[图片已省略]",
    unknownWine: "未知酒款",
    switchToEn: "Switch to English",
    switchToZh: "切换到中文",
    userUploadedImg: "用户上传的图片",
    preview: "预览",
    enlarge: "放大查看",
    photoAnalyze: "📷 请帮我分析这张图片",

    // Taste profile recommendations
    recBordeaux: "🏰 推荐一款波尔多左岸佳酿",
    recBurgundy: "🍇 推荐一款勃艮第黑皮诺",
    recCabernet: "🍷 推荐一款赤霞珠精选",
    recChardonnay: "🥂 推荐一款优质霞多丽白葡萄酒",
    recFullBodied: "💪 推荐一款酒体饱满的红酒",
    recRefreshing: "🌿 推荐一款清爽的夏日白葡萄酒",
    recDate: "💝 推荐一款适合约会的浪漫酒款",
    recBusiness: "🤝 推荐一款商务宴请的体面酒款",
    recPairing: "🍽️ 推荐一款万能的餐酒搭配",
    recTuscany: "🇮🇹 推荐一款托斯卡纳经典",
    recRiesling: "✨ 推荐一款德国雷司令",
    recSyrah: "🔥 推荐一款澳洲西拉",
    recSweet: "🍯 推荐一款优质甜酒",
    recGift: "🎁 推荐一款适合送礼的名庄酒",
    recExploreGrape: "🍇 探索更多{0}风格",
    recExploreRegion: "🌍 深入了解{0}产区",

    // Taste tag queries
    queryRegion: "介绍一下{0}产区的葡萄酒",
    queryGrape: "推荐一款{0}葡萄酒",
    queryStyle: "推荐一款{0}风格的酒",
    queryOccasion: "推荐适合{0}的葡萄酒",
    queryPrice: "推荐{0}价位的葡萄酒",
    queryDefault: "推荐{0}相关的葡萄酒",

    // Scene quick chips
    sceneRestChinese: "中餐",
    sceneRestWestern: "西餐",
    sceneRestJapanese: "日料",
    sceneRestBBQ: "烧烤",
    sceneShopSelf: "自饮放松",
    sceneShopFriends: "朋友聚餐",
    sceneShopBusiness: "商务宴请",
    sceneShopDate: "约会",
    sceneShopGift: "送礼",
    sceneTastePhoto: "拍照开始",
    sceneTasteCellar: "从酒窖选择",

    // Wine detail view
    wineDetailTitle: "酒款详情",
    tastingNotesLabel: "品鉴标签",
    myNotesLabel: "我的笔记",
    aiTastingNotesLabel: "AI品鉴笔记",

    // Onboarding
    onboardingSkip: "跳过",
    tourGuideTitle: "使用引导",

    // Identify mode
    identifyPhoto: "拍照识酒",

    // Price unit
    priceUnit: "元",

    // Guided Tasting v0.7
    guidedTastingTitle: "品鉴引导",
    stepAppearance: "外观",
    stepAroma: "闻香",
    stepPalate: "口感",
    stepFinish: "余味",
    levelBeginner: "🌱 入门",
    levelIntermediate: "📚 进阶",
    levelExpert: "🎓 专家",
    nextStep: "下一步",
    prevStep: "上一步",
    finishTasting: "完成品鉴",
    generateNotes: "生成品鉴笔记",
    startGuidedTasting: "开始品鉴引导",
    exitGuidedTasting: "退出品鉴",
    tastingSummaryTitle: "品鉴报告",
    saveToCellar: "存入酒窖",
    backToTasting: "返回修改",

    // Step guidance texts — Beginner
    guidanceAppearanceBeginner: "举起酒杯，倾斜45度对着白色背景。你看到了什么颜色？",
    guidanceAromaBeginner: "先不摇杯，把鼻子凑近，感受第一印象。然后轻轻摇杯再闻。",
    guidancePalateBeginner: "喝一小口，让酒液在口腔里停留3-5秒，感受它的质地。",
    guidanceFinishBeginner: "吞下后注意余味——它持续多久？留下了什么感觉？",
    teachAppearanceBeginner: "宝石红色通常说明这是一款年轻的红酒，深紫红色的酒往往更浓郁饱满",
    teachAromaBeginner: "先分辨大类就好：是果香多？花香多？还是有烘烤的味道？每种酒都有自己独特的「香水」",
    teachPalateBeginner: "酸度就像柠檬水——越酸越让你流口水；单宁就像喝浓茶的涩感",
    teachFinishBeginner: "好酒的余味通常持续得更久。如果吞下后还能感受到风味，那就是悠长的余味",

    // Step guidance texts — Intermediate
    guidanceAppearanceIntermediate: "观察酒的色调和边缘色，注意酒液的黏度和光泽。",
    guidanceAromaIntermediate: "区分一类香气（果实、花卉）和二类香气（发酵、陈酿）。",
    guidancePalateIntermediate: "评估酸度-单宁-酒体的平衡，注意口中的结构感。",
    guidanceFinishIntermediate: "注意余味中的风味变化，是否有新的味道出现。",
    teachAppearanceIntermediate: "观察酒腿（挂杯），缓慢的酒腿意味着高酒精度或高糖分",
    teachAromaIntermediate: "一类香气来自葡萄本身，二类来自发酵，三类来自陈酿。试着分辨它们的比例",
    teachPalateIntermediate: "优质酒的标志是平衡——酸度、单宁、酒精和果味相互协调，没有任何一个突兀",
    teachFinishIntermediate: "余味超过8秒通常意味着品质优秀。注意余味中是否有新的风味层次展开",

    // Step guidance texts — Expert
    guidanceAppearanceExpert: "分析色调梯度、粘稠度和碟缘宽度，推断酒龄和酿造工艺。",
    guidanceAromaExpert: "解析三类香气的层次与演变，评估复杂度和集中度。",
    guidancePalateExpert: "对结构、平衡、复杂度和集中度进行系统性评估。",
    guidanceFinishExpert: "综合评估余味的长度、复杂度和质量，给出整体评分。",
    teachAppearanceExpert: "通过色调的渐变可以判断酒龄：紫色→宝石红→石榴红→砖红→茶色",
    teachAromaExpert: "高品质的葡萄酒应展现多层次的香气复杂度，且各层香气之间有良好的融合与过渡",
    teachPalateExpert: "评估酒体架构时关注：酸度提供骨架，单宁提供质感，酒精提供温暖，果味提供血肉",
    teachFinishExpert: "WSET评分体系中，余味超过12秒被认定为Outstanding级别，注意质量而非仅仅是长度",

    // Labels
    colorLabel: "颜色",
    clarityLabel: "清澈度",
    aromaIntensity: "香气强度",
    aromaIntensityLight: "淡",
    aromaIntensityStrong: "浓",
    acidityLabel: "酸度",
    acidityLow: "低酸",
    acidityHigh: "高酸",
    tanninLabel: "单宁",
    tanninSoft: "细腻",
    tanninFirm: "强劲",
    bodyLabel: "酒体",
    bodyLight: "轻盈",
    bodyFull: "饱满",
    textureLabel: "口感",
    sweetnessLabel: "甜度",
    finishLengthLabel: "余味长度",
    finishDescriptorsLabel: "余味感受",
    overallScoreLabel: "整体评分",
    generatingNotes: "正在生成品鉴笔记…",
    tastingComplete: "品鉴完成！",
  },
  en: {
    brandName: "Sommé",
    brandSub: "Your Personal Sommelier · Great Wine, No Pretense",
    myCellar: "My Cellar",
    newChat: "New Chat",
    backHome: "Back to Home",
    backToChat: "Back to Chat",

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
    scene3Msg: "I have a bottle of wine and would like to learn more about it. Please help me identify and describe it.",
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

    wantBuyMsg: "I want to buy this wine, please give me a detailed review",
    drinkingMsg: "I'm drinking this wine, please give me Tasting Notes",

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
    errorRequestFailed: "Request failed",
    errorNetworkFailed: "Network connection failed. Please check and try again.",
    errorUnknown: "Unknown error. Please try again later.",
    errorImgProcess: "Image processing failed. Try taking a screenshot and uploading again.",
    errorStorageFull: "Storage full. Please remove some cellar entries.",
    retry: "Retry",
    analyzing: "Analyzing…",
    processingImg: "Processing image…",
    savedCellar: "🍷 Saved to cellar!",
    savedWishlist: "📖 Added to wishlist!",
    deletedCellar: "Removed from cellar",
    footer: "Sommé · Raymo Tech © 2026",
    tasteLabel: "🎯 Based on your taste",
    analyzeImg: "Please analyze this image",
    scrollToBottom: "Back to latest",
    imgOmitted: "[image omitted]",
    unknownWine: "Unknown Wine",
    switchToEn: "Switch to English",
    switchToZh: "切换到中文",
    userUploadedImg: "User uploaded image",
    preview: "Preview",
    enlarge: "View full size",
    photoAnalyze: "📷 Please analyze this image",

    recBordeaux: "🏰 Recommend a Bordeaux Left Bank gem",
    recBurgundy: "🍇 Recommend a Burgundy Pinot Noir",
    recCabernet: "🍷 Recommend a premium Cabernet Sauvignon",
    recChardonnay: "🥂 Recommend a fine Chardonnay",
    recFullBodied: "💪 Recommend a full-bodied red wine",
    recRefreshing: "🌿 Recommend a refreshing summer white",
    recDate: "💝 Recommend a romantic wine for a date",
    recBusiness: "🤝 Recommend a wine for a business dinner",
    recPairing: "🍽️ Recommend a versatile food pairing wine",
    recTuscany: "🇮🇹 Recommend a Tuscan classic",
    recRiesling: "✨ Recommend a German Riesling",
    recSyrah: "🔥 Recommend an Australian Shiraz",
    recSweet: "🍯 Recommend a fine dessert wine",
    recGift: "🎁 Recommend a prestigious wine for gifting",
    recExploreGrape: "🍇 Explore more {0} styles",
    recExploreRegion: "🌍 Discover more about {0}",

    queryRegion: "Tell me about wines from {0}",
    queryGrape: "Recommend a {0} wine",
    queryStyle: "Recommend a {0} style wine",
    queryOccasion: "Recommend a wine for {0}",
    queryPrice: "Recommend a wine in the {0} range",
    queryDefault: "Recommend wines related to {0}",

    // Wine detail view
    wineDetailTitle: "Wine Details",
    tastingNotesLabel: "Tasting Notes",
    myNotesLabel: "My Notes",
    aiTastingNotesLabel: "AI Tasting Notes",

    // Onboarding
    onboardingSkip: "Skip",
    tourGuideTitle: "Tour Guide",

    // Identify mode
    identifyPhoto: "Take Photo",

    // Guided Tasting v0.7
    guidedTastingTitle: "Guided Tasting",
    stepAppearance: "Appearance",
    stepAroma: "Aroma",
    stepPalate: "Palate",
    stepFinish: "Finish",
    levelBeginner: "🌱 Beginner",
    levelIntermediate: "📚 Intermediate",
    levelExpert: "🎓 Expert",
    nextStep: "Next Step",
    prevStep: "Previous",
    finishTasting: "Finish Tasting",
    generateNotes: "Generate Tasting Notes",
    startGuidedTasting: "Start Guided Tasting",
    exitGuidedTasting: "Exit Tasting",
    tastingSummaryTitle: "Tasting Report",
    saveToCellar: "Save to Cellar",
    backToTasting: "Go Back",

    // Step guidance — Beginner
    guidanceAppearanceBeginner: "Hold your glass at a 45° angle against a white background. What color do you see?",
    guidanceAromaBeginner: "Before swirling, bring your nose close and get a first impression. Then gently swirl and sniff again.",
    guidancePalateBeginner: "Take a small sip and let it sit in your mouth for 3-5 seconds. Feel its texture.",
    guidanceFinishBeginner: "After swallowing, pay attention to the aftertaste — how long does it last? What feeling does it leave?",
    teachAppearanceBeginner: "A ruby color usually means a young red wine, while deep purple wines tend to be richer and fuller",
    teachAromaBeginner: "Start with big categories: is it mostly fruity? Floral? Or toasty? Every wine has its own unique 'perfume'",
    teachPalateBeginner: "Acidity is like lemonade — the more acidic, the more it makes you salivate; tannin feels like strong tea's dryness",
    teachFinishBeginner: "Good wines usually have a longer finish. If you can still taste flavors after swallowing, that's a long finish",

    // Step guidance — Intermediate
    guidanceAppearanceIntermediate: "Observe the color hue and rim variation, noting the wine's viscosity and brilliance.",
    guidanceAromaIntermediate: "Distinguish primary aromas (fruit, floral) from secondary aromas (fermentation, aging).",
    guidancePalateIntermediate: "Assess the acidity-tannin-body balance and notice the structural framework in your mouth.",
    guidanceFinishIntermediate: "Notice how the flavors evolve in the finish — do new flavors emerge?",
    teachAppearanceIntermediate: "Observe the legs (tears) — slow-moving legs indicate high alcohol or residual sugar",
    teachAromaIntermediate: "Primary aromas come from the grape itself, secondary from fermentation, tertiary from aging. Try to identify their proportions",
    teachPalateIntermediate: "The hallmark of quality is balance — acidity, tannin, alcohol, and fruit should harmonize without any element dominating",
    teachFinishIntermediate: "A finish lasting over 8 seconds typically indicates excellent quality. Note whether new flavor layers unfold in the aftertaste",

    // Step guidance — Expert
    guidanceAppearanceExpert: "Analyze the color gradient, viscosity, and rim width to infer age and winemaking technique.",
    guidanceAromaExpert: "Parse the layers and evolution of tertiary aromatics, assessing complexity and concentration.",
    guidancePalateExpert: "Perform a systematic evaluation of structure, balance, complexity, and concentration.",
    guidanceFinishExpert: "Comprehensively assess the length, complexity, and quality of the finish. Give your overall score.",
    teachAppearanceExpert: "Color gradients reveal age: purple → ruby → garnet → brick → tawny",
    teachAromaExpert: "High-quality wines should exhibit multi-layered aromatic complexity with good integration and transitions between layers",
    teachPalateExpert: "When assessing structure: acidity provides the backbone, tannin the texture, alcohol the warmth, fruit the flesh",
    teachFinishExpert: "In the WSET framework, a finish exceeding 12 seconds qualifies as Outstanding — focus on quality, not just duration",

    // Labels
    colorLabel: "Color",
    clarityLabel: "Clarity",
    aromaIntensity: "Aroma Intensity",
    aromaIntensityLight: "Light",
    aromaIntensityStrong: "Intense",
    acidityLabel: "Acidity",
    acidityLow: "Low",
    acidityHigh: "High",
    tanninLabel: "Tannin",
    tanninSoft: "Soft",
    tanninFirm: "Firm",
    bodyLabel: "Body",
    bodyLight: "Light",
    bodyFull: "Full",
    textureLabel: "Texture",
    sweetnessLabel: "Sweetness",
    finishLengthLabel: "Finish Length",
    finishDescriptorsLabel: "Finish Character",
    overallScoreLabel: "Overall Score",
    generatingNotes: "Generating tasting notes…",
    tastingComplete: "Tasting Complete!",

    // Scene quick chips
    sceneRestChinese: "Chinese Cuisine",
    sceneRestWestern: "Western Cuisine",
    sceneRestJapanese: "Japanese",
    sceneRestBBQ: "BBQ",
    sceneShopSelf: "For Myself",
    sceneShopFriends: "Friends Gathering",
    sceneShopBusiness: "Business Dinner",
    sceneShopDate: "Date Night",
    sceneShopGift: "Gift",
    sceneTastePhoto: "Take Photo",
    sceneTasteCellar: "Choose from Cellar",

    priceUnit: "",
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

const LOCALE_KEY = "wine-advisor-locale";

export function loadLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  return (localStorage.getItem(LOCALE_KEY) as Locale) || "zh";
}

export function saveLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Locale string is tiny; quota issues here are extremely unlikely
  }
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations.zh[key] || key;
}

/* ─── Display label maps for taste profile tags ─── */
// Maps Chinese internal keys → localized display labels
const DISPLAY_LABELS_EN: Record<string, string> = {
  // Regions
  "波尔多": "Bordeaux",
  "勃艮第": "Burgundy",
  "香槟": "Champagne",
  "托斯卡纳": "Tuscany",
  "纳帕谷": "Napa Valley",
  "巴罗洛": "Barolo",
  "里奥哈": "Rioja",
  "罗纳河谷": "Rhône Valley",
  "阿尔萨斯": "Alsace",
  "摩泽尔": "Mosel",
  "新西兰": "New Zealand",
  "澳大利亚": "Australia",
  "智利": "Chile",
  "阿根廷": "Argentina",
  "南非": "South Africa",
  // Grapes
  "赤霞珠": "Cabernet Sauvignon",
  "梅洛": "Merlot",
  "黑皮诺": "Pinot Noir",
  "霞多丽": "Chardonnay",
  "长相思": "Sauvignon Blanc",
  "雷司令": "Riesling",
  "西拉": "Syrah / Shiraz",
  "桑娇维塞": "Sangiovese",
  "内比奥罗": "Nebbiolo",
  "丹魄": "Tempranillo",
  "马尔贝克": "Malbec",
  "仙粉黛": "Zinfandel",
  "琼瑶浆": "Gewürztraminer",
  // Styles
  "饱满型": "Full-bodied",
  "果味型": "Fruity",
  "优雅型": "Elegant",
  "清爽型": "Refreshing",
  "甜型": "Sweet",
  "干型": "Dry",
  "单宁突出": "Tannic",
  "起泡型": "Sparkling",
  "陈年型": "Aged",
  "橡木桶风格": "Oaky",
  // Occasions
  "商务": "Business",
  "约会": "Date Night",
  "日常饮用": "Everyday",
  "聚会": "Party",
  "送礼": "Gift",
  "餐酒搭配": "Food Pairing",
  "收藏投资": "Collecting",
  "庆祝": "Celebration",
};

/**
 * Get the display label for a Chinese internal key, based on locale.
 * Internal storage always uses Chinese keys (for AI matching).
 * This function returns the localized display text.
 */
export function displayLabel(locale: Locale, zhLabel: string): string {
  if (locale === "zh") return zhLabel;
  return DISPLAY_LABELS_EN[zhLabel] || zhLabel;
}
