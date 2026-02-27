import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sommé 颂美 | Your Personal Sommelier",
  description: "AI 驱动的私人侍酒师，好酒不必懂，懂你就够了。葡萄酒推荐、品鉴笔记、餐酒搭配。Your AI-powered personal sommelier for wine recommendations, tasting notes, and food pairing.",
  keywords: ["wine", "sommelier", "AI", "品酒", "侍酒师", "葡萄酒", "品鉴", "餐酒搭配", "wine recommendation", "tasting notes"],
  authors: [{ name: "Raymo Tech 瑞莫科技" }],
  creator: "Raymo Tech",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    title: "Sommé 颂美 — Your Personal AI Sommelier",
    description: "好酒不必懂，懂你就够了。AI 驱动的私人侍酒师，智能推荐、品鉴笔记、餐酒搭配。",
    siteName: "Sommé 颂美",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sommé 颂美 — Your Personal AI Sommelier",
    description: "好酒不必懂，懂你就够了。AI 驱动的私人侍酒师。",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sommé 颂美",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#722F37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var mode = localStorage.getItem('somme-theme');
              if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
