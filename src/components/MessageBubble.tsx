"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Message, MessageAction } from "@/lib/types";

/* ─── Markdown sanitizer for streaming ─── */
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

/* ─── Markdown renderer ─── */
export function MarkdownContent({ content, isStreaming = false }: { content: string; isStreaming?: boolean }) {
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
        code: ({ children }) => <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--wine-subtle-bg)", color: "var(--wine-deep)" }}>{children}</code>,
        table: ({ children }) => (
          <div className="overflow-x-auto my-3 rounded-lg" style={{ border: "1px solid var(--wine-border)" }}>
            <table className="w-full text-sm border-collapse" style={{ fontFamily: "'Noto Serif SC', serif" }}>{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead style={{ backgroundColor: "var(--wine-deep)", color: "white" }}>{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children, ...props }) => {
          const node = (props as Record<string, unknown>).node as { position?: { start?: { line?: number } } } | undefined;
          const lineNum = node?.position?.start?.line ?? 0;
          const isEven = lineNum % 2 === 0;
          return (
            <tr style={{ backgroundColor: isEven ? "var(--wine-subtle-bg)" : "transparent", borderBottom: "1px solid var(--wine-border)" }}>
              {children}
            </tr>
          );
        },
        th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide" style={{ borderBottom: "2px solid var(--wine-gold-warm, #C4956A)" }}>{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 text-xs" style={{ color: "var(--wine-bubble-text)" }}>{children}</td>,
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}

/* ─── Message Action Buttons ─── */
function MessageActions({
  actions,
  onAction,
}: {
  actions: MessageAction[];
  onAction: (action: MessageAction) => void;
}) {
  return (
    <div className="msg-actions flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--wine-action-border)" }}>
      {actions.map((act) => (
        <button
          key={act.id}
          disabled={act.clicked}
          onClick={() => onAction(act)}
          className="msg-action-btn"
          style={{ opacity: act.clicked ? 0.5 : 1, cursor: act.clicked ? "default" : "pointer" }}
        >
          <span className="msg-action-icon">{act.icon}</span>
          <span className="msg-action-label">{act.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Message Bubble ─── */
export default function MessageBubble({
  msg,
  index,
  locale,
  onAction,
  onRetry,
  onImageClick,
}: {
  msg: Message;
  index: number;
  locale: Locale;
  onAction: (action: MessageAction, msgIndex: number) => void;
  onRetry: () => void;
  onImageClick: (src: string) => void;
}) {
  return (
    <div
      className={`message-enter flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
    >
      {msg.role === "assistant" && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-1"
          style={{ backgroundColor: "var(--wine-deep)", color: "white" }}
        >
          🍷
        </div>
      )}
      <div
        className={`msg-bubble max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "border"}`}
        style={{
          fontFamily: "'Noto Serif SC', serif",
          ...(msg.role === "user"
            ? {
                background: "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
                boxShadow: "var(--wine-shadow-md)",
              }
            : {
                backgroundColor: "var(--wine-card, #FFFFFF)",
                borderColor: msg.isError ? "var(--wine-error)" : "var(--wine-border)",
                color: "var(--wine-bubble-text)",
                boxShadow: "var(--wine-shadow)",
              }),
        }}
      >
        {msg.role === "assistant" ? (
          <>
            <MarkdownContent content={msg.content} />
            {msg.isError && (
              <button className="retry-btn" onClick={onRetry}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t(locale, "retry")}
              </button>
            )}
            {msg.actions && msg.actions.length > 0 && (
              <MessageActions actions={msg.actions} onAction={(act) => onAction(act, index)} />
            )}
          </>
        ) : (
          <>
            {msg.image && (
              <div className="mb-2">
                <img
                  src={msg.image}
                  alt={t(locale, "userUploadedImg")}
                  className="chat-image-thumb rounded-xl cursor-pointer"
                  style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover", borderRadius: "12px", boxShadow: "var(--wine-img-shadow)" }}
                  onClick={() => onImageClick(msg.image!)}
                />
              </div>
            )}
            {msg.content &&
              !(msg.image && (msg.content === t(locale, "analyzeImg") || msg.content === "请帮我分析这张图片" || msg.content === "Please analyze this image")) && (
                <span>{msg.content}</span>
              )}
            {msg.image &&
              (msg.content === t(locale, "analyzeImg") || msg.content === "请帮我分析这张图片" || msg.content === "Please analyze this image") && (
                <span className="text-xs opacity-80">{t(locale, "photoAnalyze")}</span>
              )}
          </>
        )}
      </div>
    </div>
  );
}
