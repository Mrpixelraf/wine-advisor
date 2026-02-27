"use client";

import { useEffect } from "react";

export default function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="toast-container fixed top-20 left-1/2 z-50" style={{ transform: "translateX(-50%)" }}>
      <div
        className="toast-card px-6 py-3 rounded-2xl text-sm shadow-xl"
        style={{ fontFamily: "'Noto Serif SC', serif", backgroundColor: "var(--wine-deep)", color: "white" }}
      >
        {message}
      </div>
    </div>
  );
}
