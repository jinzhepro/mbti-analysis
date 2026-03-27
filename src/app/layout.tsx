import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_SC } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MBTI 人格探索 | 星空下的自我认知",
  description: "在星光的指引下，探索你的 MBTI 人格类型，发现内心深处的自我",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${playfair.variable} ${notoSerifSC.variable}`}>
      <body className="min-h-screen antialiased">
        <div className="stars" aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#1a1a2e',
              color: '#fde68a',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
              fontFamily: 'var(--font-noto-serif-sc)',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#f59e0b',
                secondary: '#1a1a2e',
              },
            },
            error: {
              iconTheme: {
                primary: '#f43f5e',
                secondary: '#1a1a2e',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
