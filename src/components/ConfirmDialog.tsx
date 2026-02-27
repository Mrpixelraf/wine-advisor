"use client";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelText?: string;
  confirmText?: string;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  cancelText,
  confirmText,
}: ConfirmDialogProps) {
  return (
    <div
      className="confirm-overlay fixed inset-0 z-50"
      style={{ backgroundColor: "rgba(26,10,14,0.4)" }}
      onClick={onCancel}
    >
      <div
        className="confirm-dialog fixed top-1/2 left-1/2 w-[min(320px,85vw)] rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: "var(--wine-cream)", transform: "translate(-50%, -50%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="text-sm mb-5 text-center"
          style={{ fontFamily: "'Noto Serif SC', serif", color: "var(--wine-text)" }}
        >
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-sm border transition-all"
            style={{ fontFamily: "'Noto Serif SC', serif", borderColor: "var(--wine-border)", color: "var(--wine-text)" }}
          >
            {cancelText || "取消"}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-sm text-white transition-all"
            style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-deep)" }}
          >
            {confirmText || "确认"}
          </button>
        </div>
      </div>
    </div>
  );
}
