"use client";

import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { type Locale, loadLocale, saveLocale, t } from "@/lib/i18n";
import type { Message, MessageAction, WineEntry, TasteProfile, WineTags, SceneType } from "@/lib/types";
import { STORAGE_KEY, ONBOARDING_KEY } from "@/lib/types";
import { loadMessages, saveMessages, loadTasteProfile, saveTasteProfile, loadCellar, saveCellar } from "@/lib/storage";
import { extractTasteFromText } from "@/lib/taste-extraction";
import { detectWineActions, detectBuyModeActions, detectDrinkModeActions, detectTastingSceneActions, extractWineNameFromMessages, extractWineImageFromMessages } from "@/lib/wine-detection";

import SceneSelector from "@/components/SceneSelector";
import Chat from "@/components/Chat";
import ChatInput, { type PendingImage } from "@/components/ChatInput";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";

/* ─── Lazy-loaded components (not needed on initial render) ─── */
const CellarPage = lazy(() => import("@/components/WineCellar"));
const RatingModal = lazy(() => import("@/components/RatingModal"));
const OnboardingTour = lazy(() => import("@/components/OnboardingTour"));
const ImageLightbox = lazy(() => import("@/components/ImageWidgets").then(m => ({ default: m.ImageLightbox })));
const GuidedTasting = lazy(() => import("@/components/GuidedTasting"));

/* ─── Compress image to small thumbnail for cellar storage ─── */
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

/* ─── Retry fetch with exponential backoff ─── */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 2,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      // Only retry on 503 (service unavailable) or 429 (rate limit)
      if (response.ok || (response.status !== 503 && response.status !== 429)) {
        return response;
      }
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
        continue;
      }
      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
        continue;
      }
    }
  }
  throw lastError || new Error("Fetch failed");
}

/* ═══════════════════════════════════════════
   Main page component
   ═══════════════════════════════════════════ */
export default function Home() {
  /* ── State ── */
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>({ regions: [], grapes: [], styles: [], priceRange: "", occasions: [] });
  const [transitioning, setTransitioning] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // v0.5 states
  const [showCellar, setShowCellar] = useState(false);
  const [cellar, setCellar] = useState<WineEntry[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState<{ aiNotes: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("zh");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // v0.6: scene state
  const [activeScene, setActiveScene] = useState<SceneType>(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [browsingHome, setBrowsingHome] = useState(false);

  // v0.7: guided tasting state
  const [guidedTasting, setGuidedTasting] = useState(false);
  const [tastingWineName, setTastingWineName] = useState("");
  const [tastingWineImage, setTastingWineImage] = useState<string | undefined>(undefined);

  /* ── Refs ── */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const lastUserMsgRef = useRef<string>("");

  /* ── Load from localStorage on mount ── */
  useEffect(() => {
    setMessages(loadMessages());
    setTasteProfile(loadTasteProfile());
    setCellar(loadCellar());
    setLocale(loadLocale());
    setHydrated(true);
    try {
      if (!localStorage.getItem(ONBOARDING_KEY)) {
        setShowOnboarding(true);
      }
    } catch {}
  }, []);

  /* ── Persist to localStorage on change ── */
  useEffect(() => { if (hydrated) saveMessages(messages); }, [messages, hydrated]);
  useEffect(() => { if (hydrated) saveTasteProfile(tasteProfile); }, [tasteProfile, hydrated]);
  useEffect(() => {
    if (hydrated) {
      const ok = saveCellar(cellar);
      if (!ok) setToast(t(locale, "errorStorageFull"));
    }
  }, [cellar, hydrated, locale]);

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

  const handleScrollChange = useCallback((isNearBottom: boolean) => {
    if (isNearBottom) {
      userScrolledRef.current = false;
      setShowScrollBtn(false);
    } else {
      userScrolledRef.current = true;
      setShowScrollBtn(true);
    }
  }, []);

  /* ── Helper functions ── */
  const lastUserHadImage = useCallback((msgs: Message[]) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") return !!msgs[i].image;
    }
    return false;
  }, []);

  const getLastUserMessage = useCallback((msgs: Message[]) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") return msgs[i].content;
    }
    return "";
  }, []);

  /* ── Start scenario (hidden prompt → AI response) ── */
  const startScenario = async (hiddenPrompt: string) => {
    if (isLoading) return;

    if (messages.length === 0) {
      setTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 280));
      setTransitioning(false);
    }

    setIsLoading(true);
    setStreamingContent("");
    userScrolledRef.current = false;

    try {
      const apiMessages = [{ role: "user" as const, content: hiddenPrompt }];

      const response = await fetchWithRetry("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, locale }),
      });

      if (!response.ok) {
        const statusText =
          response.status === 429 ? t(locale, "errorRate")
          : response.status === 503 ? t(locale, "errorService")
          : t(locale, "errorRequestFailed");
        setMessages([{ role: "assistant", content: `⚠️ ${statusText}`, isError: true }]);
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              fullContent += parsed.content || "";
              setStreamingContent(fullContent);
            } catch {}
          }
        }
      }

      if (fullContent) {
        // Detect actions for scenario responses too
        let detectedActions: MessageAction[] | undefined;
        detectedActions = detectTastingSceneActions(fullContent, hiddenPrompt, locale);

        const scenarioMessages: Message[] = [
          { role: "user", content: hiddenPrompt, hidden: true },
          { role: "assistant", content: fullContent, ...(detectedActions ? { actions: detectedActions } : {}) },
        ];
        setMessages(scenarioMessages);
      }
    } catch {
      setMessages([{ role: "assistant", content: `⚠️ ${t(locale, "errorNetworkFailed")}`, isError: true }]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  /* ── Send message ── */
  const sendMessage = async (text: string, image?: PendingImage) => {
    const hasImage = !!image;
    if ((!text && !hasImage) || isLoading) return;
    setBrowsingHome(false);

    if (messages.length === 0) {
      setTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 280));
      setTransitioning(false);
    }

    const messageText = text || (hasImage ? t(locale, "analyzeImg") : "");
    lastUserMsgRef.current = messageText;
    const userMessage: Message = {
      role: "user",
      content: messageText,
      ...(hasImage ? { image: image!.base64, imageMimeType: image!.mimeType } : {}),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setStreamingContent("");
    userScrolledRef.current = false;

    try {
      const apiMessages = newMessages
        .filter((m) => !m.hidden || m.role === "user")
        .map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.image ? { image: m.image, imageMimeType: m.imageMimeType } : {}),
        }));

      const response = await fetchWithRetry("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, locale }),
      });

      if (!response.ok) {
        const statusText =
          response.status === 429
            ? t(locale, "errorRate")
            : response.status === 503
              ? t(locale, "errorService")
              : response.status >= 500
                ? t(locale, "errorServer")
                : `${t(locale, "errorRequestFailed")} (${response.status})`;
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
                if (parsed.content) {
                  fullContent += parsed.content;
                  setStreamingContent(fullContent);
                }
              } catch {}
            }
          }
        }
      }

      const hadImage = lastUserHadImage(newMessages);
      const lastUMsg = getLastUserMessage(newMessages);
      let detectedActions: MessageAction[] | undefined;
      detectedActions = detectWineActions(fullContent, hadImage, locale);
      if (!detectedActions) detectedActions = detectBuyModeActions(fullContent, lastUMsg, locale);
      if (!detectedActions) detectedActions = detectDrinkModeActions(fullContent, lastUMsg, locale);
      if (!detectedActions) detectedActions = detectTastingSceneActions(fullContent, lastUMsg, locale);

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
      const errMsg = error instanceof Error ? error.message : t(locale, "errorUnknown");
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${errMsg}`, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Handle action button click ── */
  const handleAction = async (action: MessageAction, msgIndex: number) => {
    setMessages((prev) => {
      const updated = [...prev];
      const msg = { ...updated[msgIndex] };
      if (msg.actions) {
        msg.actions = msg.actions.map((a) => (a.id === action.id ? { ...a, clicked: true } : a));
      }
      updated[msgIndex] = msg;
      return updated;
    });

    if (action.action === "start-guided-tasting") {
      const wineName = extractWineNameFromMessages(messages, locale);
      const wineImage = extractWineImageFromMessages(messages);
      setTastingWineName(wineName);
      setTastingWineImage(wineImage);
      setGuidedTasting(true);
      return;
    }

    if (action.message) {
      await sendMessage(action.message);
    } else if (action.action === "save-to-cellar") {
      const wineName = extractWineNameFromMessages(messages, locale);
      const wineImage = extractWineImageFromMessages(messages);
      let thumbnail: string | undefined;
      if (wineImage) {
        try { thumbnail = await compressToThumbnail(wineImage); } catch {}
      }
      const entry: WineEntry = {
        id: Date.now().toString(),
        name: wineName,
        image: thumbnail,
        type: "wishlist",
        aiNotes: (action.data as Record<string, string>)?.aiNotes || "",
        date: new Date().toISOString().split("T")[0],
      };
      setCellar((prev) => [...prev, entry]);
      setToast(t(locale, "savedWishlist"));
    } else if (action.action === "rate-wine") {
      setRatingData({ aiNotes: (action.data as Record<string, string>)?.aiNotes || "" });
      setShowRatingModal(true);
    }
  };

  /* ── Handle rating submit ── */
  const handleRatingSubmit = async (rating: number, notes: string, tags: WineTags) => {
    const wineName = extractWineNameFromMessages(messages, locale);
    const wineImage = extractWineImageFromMessages(messages);
    let thumbnail: string | undefined;
    if (wineImage) {
      try { thumbnail = await compressToThumbnail(wineImage); } catch {}
    }
    const cleanTags: WineTags = {};
    for (const [key, val] of Object.entries(tags)) {
      if (val && val.length > 0) {
        cleanTags[key as keyof WineTags] = val;
      }
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
      ...(Object.keys(cleanTags).length > 0 ? { tags: cleanTags } : {}),
    };
    setCellar((prev) => [...prev, entry]);
    setShowRatingModal(false);
    setRatingData(null);
    setToast(t(locale, "savedCellar"));
  };

  /* ── Delete from cellar ── */
  const handleDeleteWine = (id: string) => {
    setCellar((prev) => prev.filter((w) => w.id !== id));
    setToast(t(locale, "deletedCellar"));
  };

  /* ── Language toggle ── */
  const toggleLocale = () => {
    const next = locale === "zh" ? "en" : "zh";
    setLocale(next);
    saveLocale(next);
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

  /* ── Clear with confirmation ── */
  const confirmClear = () => setShowConfirm(true);
  const doClear = () => {
    setTransitioning(true);
    setTimeout(() => {
      setMessages([]);
      setStreamingContent("");
      localStorage.removeItem(STORAGE_KEY);
      setShowConfirm(false);
      setTransitioning(false);
      setActiveScene(null);
    }, 280);
  };

  /* ── Scene selection ── */
  const handleSelectScene = (scene: SceneType) => {
    setBrowsingHome(false);
    setActiveScene(scene);
    if (scene === "identify") {
      // Enter conversation with AI guidance, then open camera
      const identifyMsg = t(locale, "scene3Msg");
      if (identifyMsg) {
        startScenario(identifyMsg);
      }
      // Open camera after a short delay so user sees the guidance first
      setTimeout(() => setActionSheetOpen(true), 500);
    } else if (scene) {
      // Start scenario with hidden prompt
      const msgKeyMap: Record<string, string> = {
        restaurant: "scene1Msg",
        shopping: "scene2Msg",
        tasting: "scene4Msg",
      };
      const key = msgKeyMap[scene];
      if (key) {
        startScenario(t(locale, key as Parameters<typeof t>[1]));
      }
    }
  };

  const showEmptyState = (messages.length === 0 && !isLoading) || browsingHome;

  /* ── Scene label info ── */
  const sceneLabels: Record<string, string> = {
    restaurant: `🍽️ ${t(locale, "scene1Title")}`,
    shopping: `🛒 ${t(locale, "scene2Title")}`,
    identify: `📸 ${t(locale, "scene3Title")}`,
    tasting: `🍷 ${t(locale, "scene4Title")}`,
  };

  /* ═══ Render ═══ */
  return (
    <div
      className="flex flex-col max-w-3xl mx-auto"
      style={{
        height: "var(--app-height, 100vh)",
        paddingTop: "var(--safe-top)",
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      {/* Confirm dialog */}
      {showConfirm && (
        <ConfirmDialog
          message={t(locale, "clearConfirm")}
          onConfirm={doClear}
          onCancel={() => setShowConfirm(false)}
          cancelText={t(locale, "cancel")}
          confirmText={t(locale, "confirm")}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Onboarding Tour (lazy) */}
      {showOnboarding && (
        <Suspense fallback={null}>
          <OnboardingTour locale={locale} onComplete={() => setShowOnboarding(false)} />
        </Suspense>
      )}

      {/* Rating Modal (lazy) */}
      {showRatingModal && (
        <Suspense fallback={null}>
        <RatingModal
          wineName={extractWineNameFromMessages(messages, locale)}
          onSubmit={handleRatingSubmit}
          onClose={() => { setShowRatingModal(false); setRatingData(null); }}
          locale={locale}
        />
        </Suspense>
      )}

      {/* Guided Tasting (lazy, v0.7) */}
      {guidedTasting && (
        <Suspense fallback={null}>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "var(--wine-cream)" }}>
            <div className="flex flex-col max-w-3xl mx-auto h-full" style={{ paddingTop: "var(--safe-top)", paddingLeft: "var(--safe-left)", paddingRight: "var(--safe-right)" }}>
              <GuidedTasting
                locale={locale}
                wineName={tastingWineName}
                wineImage={tastingWineImage}
                onComplete={(entry) => {
                  setCellar((prev) => [...prev, entry]);
                  setGuidedTasting(false);
                  setToast(t(locale, "savedCellar"));
                }}
                onExit={() => setGuidedTasting(false)}
              />
            </div>
          </div>
        </Suspense>
      )}

      {/* Wine Cellar Page (lazy) */}
      {showCellar && (
        <Suspense fallback={null}>
          <CellarPage visible={showCellar} onClose={() => setShowCellar(false)} cellar={cellar} onDelete={handleDeleteWine} locale={locale} />
        </Suspense>
      )}

      {/* Header */}
      <header className="header-animate header-decorated flex items-center justify-between py-5 px-4">
        <div className="flex items-center gap-1">
          <button
            onClick={toggleLocale}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all wine-hover-bg active:scale-95 text-xs font-semibold"
            style={{ color: "var(--wine-deep)", fontFamily: "'Noto Serif SC', serif" }}
            title={locale === "zh" ? t(locale, "switchToEn") : t(locale, "switchToZh")}
          >
            {locale === "zh" ? "EN" : "中"}
          </button>
          <button
            onClick={() => setShowOnboarding(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all wine-hover-bg active:scale-95 text-xs font-semibold"
            style={{ color: "var(--wine-accent)", fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}
            title={t(locale, "tourGuideTitle")}
          >
            ?
          </button>
        </div>
        <button
          onClick={() => {
            // Bug fix #2: Logo navigates home without clearing conversation
            // Use the dedicated + button for new chat (clear)
            if (messages.length > 0) {
              setBrowsingHome(true);
              setActiveScene(null);
            }
          }}
          className="text-center group"
          style={{ cursor: messages.length > 0 ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
          title={messages.length > 0 ? t(locale, "backHome") : undefined}
        >
          <h1
            className="text-2xl font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-opacity group-hover:opacity-80"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif", color: "var(--wine-deep)" }}
          >
            {messages.length > 0 && !browsingHome && (
              <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ color: "var(--wine-deep)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            )}
            <span style={{ color: "var(--wine-gold-warm)" }}>✦</span>
            {" "}{t(locale, "brandName")}{" "}
            <span style={{ color: "var(--wine-gold-warm)" }}>✦</span>
          </h1>
          <p className="text-xs mt-1.5 tracking-wider" style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-accent)", opacity: 0.7 }}>
            {t(locale, "brandSub")}
          </p>
        </button>
        <div className="flex items-center gap-1">
          <button
            id="cellar-btn"
            onClick={() => setShowCellar(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all wine-hover-bg active:scale-95"
            title={t(locale, "myCellar")}
          >
            <svg className="w-5 h-5" fill="none" stroke="var(--wine-deep)" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M7 3 C4.5 6, 4 10, 4 12 C4 14, 4.5 18, 7 21 L17 21 C19.5 18, 20 14, 20 12 C20 10, 19.5 6, 17 3 Z" />
              <ellipse cx="12" cy="3" rx="5" ry="1.8" />
              <path strokeLinecap="round" d="M5.2 8 C7 8.8, 10 9.2, 12 9.2 C14 9.2, 17 8.8, 18.8 8" />
              <path strokeLinecap="round" d="M5.2 16 C7 16.8, 10 17.2, 12 17.2 C14 17.2, 17 16.8, 18.8 16" />
            </svg>
          </button>
          {messages.length > 0 && (
            <button
              onClick={confirmClear}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all wine-hover-bg active:scale-95"
              title={t(locale, "newChat")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: "var(--wine-deep)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Scene label bar (when in a scene with active conversation) */}
      {activeScene && messages.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-1.5 px-4">
          <button
            onClick={() => {
              // Bug fix #1: ✕ only exits scene, preserves conversation
              setActiveScene(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all hover:opacity-80 active:scale-95"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              backgroundColor: "var(--wine-subtle-bg)",
              color: "var(--wine-deep)",
              border: "1px solid var(--wine-border)",
            }}
          >
            {sceneLabels[activeScene]}
            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Back to Chat floating button (when browsing home with existing conversation) */}
      {browsingHome && messages.length > 0 && (
        <div className="flex items-center justify-center py-1.5 px-4">
          <button
            onClick={() => setBrowsingHome(false)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all hover:opacity-80 active:scale-95"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              background: "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
              color: "white",
              boxShadow: "var(--wine-shadow-strong)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            {t(locale, "backToChat")}
          </button>
        </div>
      )}

      {/* Messages Area / Empty State */}
      {showEmptyState ? (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <SceneSelector
            locale={locale}
            tasteProfile={tasteProfile}
            hydrated={hydrated}
            transitioning={transitioning}
            onSelectScene={handleSelectScene}
            onSendMessage={(msg) => sendMessage(msg)}
            onOpenCamera={() => setActionSheetOpen(true)}
          />
        </div>
      ) : (
        <Chat
          messages={messages}
          streamingContent={streamingContent}
          isLoading={isLoading}
          locale={locale}
          showScrollBtn={showScrollBtn}
          onAction={handleAction}
          onRetry={retryLastMessage}
          onImageClick={(src) => setLightboxImage(src)}
          scrollContainerRef={scrollContainerRef}
          messagesEndRef={messagesEndRef}
          onScrollChange={handleScrollChange}
          onScrollToBottom={scrollToBottom}
        />
      )}

      {/* Image Lightbox (lazy) */}
      {lightboxImage && (
        <Suspense fallback={null}>
          <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} altText={t(locale, "enlarge")} />
        </Suspense>
      )}

      {/* Input Area */}
      <ChatInput
        locale={locale}
        isLoading={isLoading}
        onSend={sendMessage}
        externalActionSheetOpen={actionSheetOpen}
        onExternalActionSheetClosed={() => setActionSheetOpen(false)}
      />
    </div>
  );
}
