import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "瑞莫品酒顾问 | Raymo Wine Advisor",
  description: "AI驱动的专业品酒顾问，为您提供葡萄酒推荐、品鉴笔记和餐酒搭配建议",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
