"use client";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  title?: string;
}

export default function ScrollToBottomButton({ onClick, title }: ScrollToBottomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="scroll-to-bottom-btn fixed z-40 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
      style={{
        backgroundColor: "var(--wine-deep)",
        bottom: "calc(100px + var(--safe-bottom, 0px))",
        right: "max(16px, calc(50% - 384px + 16px))",
      }}
      title={title || "Scroll to bottom"}
    >
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
}
