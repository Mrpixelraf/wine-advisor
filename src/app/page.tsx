"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const sendMessage = async (directMessage?: string) => {
    const text = directMessage || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error(`请求失败 (${response.status})`);

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
              } catch {
                // skip
              }
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullContent },
      ]);
      setStreamingContent("");
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "抱歉，连接出现问题。请检查网络后重试。如果问题持续，请刷新页面。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStreamingContent("");
    setInput("");
  };

  const MarkdownContent = ({ content }: { content: string }) => (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1
            className="text-lg font-bold mb-2 mt-3"
            style={{ color: "var(--wine-deep)" }}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            className="text-base font-bold mb-2 mt-3"
            style={{ color: "var(--wine-deep)" }}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            className="text-sm font-bold mb-1.5 mt-2.5"
            style={{ color: "var(--wine-deep)" }}
          >
            {children}
          </h3>
        ),
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold" style={{ color: "var(--wine-deep)" }}>
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic" style={{ color: "var(--wine-medium)" }}>
            {children}
          </em>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className="border-l-3 pl-3 my-2 italic opacity-80"
            style={{ borderColor: "var(--wine-gold)" }}
          >
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code
            className="px-1.5 py-0.5 rounded text-xs"
            style={{
              backgroundColor: "var(--wine-light)",
              color: "var(--wine-deep)",
            }}
          >
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-5 px-4 border-b border-[var(--wine-light)]/30">
        <div className="w-10" /> {/* spacer */}
        <div className="text-center">
          <h1
            className="text-2xl font-semibold tracking-wide"
            style={{
              fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif",
              color: "var(--wine-deep)",
            }}
          >
            🍷 瑞莫品酒顾问
          </h1>
          <p
            className="text-xs mt-1 opacity-50"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            Raymo Wine Advisor · AI驱动的专业品酒体验
          </p>
        </div>
        {messages.length > 0 ? (
          <button
            onClick={clearChat}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-[var(--wine-light)]/20"
            title="新对话"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--wine-deep)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
              />
            </svg>
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="text-6xl">🍷</div>
            <div>
              <h2
                className="text-xl font-medium mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif",
                  color: "var(--wine-deep)",
                }}
              >
                欢迎来到瑞莫品酒顾问
              </h2>
              <p
                className="text-sm opacity-50 max-w-sm"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                您的AI品酒顾问，提供葡萄酒推荐、品鉴笔记与餐酒搭配建议
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {[
                "推荐一款适合初学者的红酒",
                "牛排配什么酒最好？",
                "介绍一下波尔多产区",
                "帮我品鉴拉菲2015",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="text-left text-sm px-4 py-3 rounded-xl border transition-all hover:shadow-md"
                  style={{
                    borderColor: "var(--wine-light)",
                    color: "var(--wine-deep)",
                    fontFamily: "'Noto Serif SC', serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--wine-deep)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--wine-deep)";
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-enter flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-1"
                style={{
                  backgroundColor: "var(--wine-deep)",
                  color: "white",
                }}
              >
                🍷
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user" ? "text-white" : "border"
              }`}
              style={{
                fontFamily: "'Noto Serif SC', serif",
                ...(msg.role === "user"
                  ? {
                      background:
                        "linear-gradient(135deg, var(--wine-deep), var(--wine-medium))",
                    }
                  : {
                      backgroundColor: "white",
                      borderColor: "var(--wine-light)",
                      color: "var(--wine-text)",
                    }),
              }}
            >
              {msg.role === "assistant" ? (
                <MarkdownContent content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {isLoading && streamingContent && (
          <div className="message-enter flex gap-3 justify-start">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-1"
              style={{ backgroundColor: "var(--wine-deep)", color: "white" }}
            >
              🍷
            </div>
            <div
              className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed border cursor-blink"
              style={{
                fontFamily: "'Noto Serif SC', serif",
                backgroundColor: "white",
                borderColor: "var(--wine-light)",
                color: "var(--wine-text)",
              }}
            >
              <MarkdownContent content={streamingContent} />
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !streamingContent && (
          <div className="flex gap-3 justify-start">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: "var(--wine-deep)", color: "white" }}
            >
              🍷
            </div>
            <div
              className="px-4 py-3 rounded-2xl border"
              style={{
                backgroundColor: "white",
                borderColor: "var(--wine-light)",
              }}
            >
              <div className="flex space-x-1.5">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "var(--wine-deep)",
                    animationDelay: "0ms",
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "var(--wine-deep)",
                    animationDelay: "150ms",
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "var(--wine-deep)",
                    animationDelay: "300ms",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[var(--wine-light)]/30 px-4 py-4 pb-6">
        <div
          className="flex items-end gap-3 rounded-2xl border px-4 py-3 transition-all focus-within:shadow-lg"
          style={{
            backgroundColor: "white",
            borderColor: "var(--wine-light)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请问您想了解哪方面的葡萄酒知识？"
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent text-sm leading-relaxed"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "var(--wine-text)",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              backgroundColor: input.trim()
                ? "var(--wine-deep)"
                : "var(--wine-light)",
            }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <p
          className="text-xs text-center mt-2 opacity-30"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          瑞莫科技 · Raymo Tech © 2026
        </p>
      </div>
    </div>
  );
}
