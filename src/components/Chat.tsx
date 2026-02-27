"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Message, MessageAction } from "@/lib/types";
import MessageBubble, { MarkdownContent } from "./MessageBubble";
import WineGlassLoader from "./WineGlassLoader";
import ScrollToBottomButton from "./ScrollToBottom";

interface ChatProps {
  messages: Message[];
  streamingContent: string;
  isLoading: boolean;
  locale: Locale;
  showScrollBtn: boolean;
  onAction: (action: MessageAction, msgIndex: number) => void;
  onRetry: () => void;
  onImageClick: (src: string) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onScrollChange: (isNearBottom: boolean) => void;
  onScrollToBottom: () => void;
}

export default function Chat({
  messages,
  streamingContent,
  isLoading,
  locale,
  showScrollBtn,
  onAction,
  onRetry,
  onImageClick,
  scrollContainerRef,
  messagesEndRef,
  onScrollChange,
  onScrollToBottom,
}: ChatProps) {
  const visibleMessages = messages.filter((m) => !m.hidden);

  // Scroll tracking
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
      onScrollChange(isNearBottom);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef, onScrollChange]);

  return (
    <>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {visibleMessages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            index={i}
            locale={locale}
            onAction={onAction}
            onRetry={onRetry}
            onImageClick={onImageClick}
          />
        ))}

        {/* Streaming message */}
        {isLoading && streamingContent && (
          <div className="message-enter flex gap-3 justify-start">
            <div
              className="ai-avatar-pulse flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-1"
              style={{ backgroundColor: "var(--wine-deep)", color: "white" }}
            >
              🍷
            </div>
            <div
              className="msg-bubble max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed border cursor-blink"
              style={{
                fontFamily: "'Noto Serif SC', serif",
                backgroundColor: "var(--wine-card, #FFFFFF)",
                borderColor: "var(--wine-border)",
                color: "var(--wine-bubble-text)",
                boxShadow: "0 1px 4px rgba(30, 26, 43, 0.06)",
              }}
            >
              <MarkdownContent content={streamingContent} isStreaming={true} />
            </div>
          </div>
        )}

        {/* Wine glass loader */}
        {isLoading && !streamingContent && (
          <div className="message-enter flex gap-3 justify-start">
            <div
              className="ai-avatar-pulse flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: "var(--wine-deep)", color: "white" }}
            >
              🍷
            </div>
            <div
              className="px-5 py-4 rounded-2xl border"
              style={{
                backgroundColor: "var(--wine-card, #FFFFFF)",
                borderColor: "var(--wine-border)",
                boxShadow: "0 1px 4px rgba(139, 34, 82, 0.06)",
              }}
            >
              <WineGlassLoader locale={locale} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollBtn && messages.length > 0 && (
        <ScrollToBottomButton onClick={onScrollToBottom} title={t(locale, "scrollToBottom")} />
      )}
    </>
  );
}
