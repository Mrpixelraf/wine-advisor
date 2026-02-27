"use client";

export function WineBottleSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0h8v20h-8zM14 20c-2 4-4 8-4 16v60c0 8 2 14 4 18h-2c0 4 4 6 8 6s8-2 8-6h-2c2-4 4-10 4-18V36c0-8-2-12-4-16H14z" />
    </svg>
  );
}

export function GrapeVineSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30 C20 5, 35 5, 50 25 C65 5, 80 5, 90 30" opacity="0.4" />
      <circle cx="30" cy="12" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="28" r="3" fill="currentColor" opacity="0.12" />
      <circle cx="70" cy="12" r="4" fill="currentColor" opacity="0.15" />
      <path d="M25 8 Q30 2 35 8" opacity="0.25" />
      <path d="M65 8 Q70 2 75 8" opacity="0.25" />
    </svg>
  );
}
