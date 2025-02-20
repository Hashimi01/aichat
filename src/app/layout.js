// /app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footr } from "./hh";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], // إزالة "arabic" واستخدام المجموعات المدعومة
  display: "swap",
  adjustFontFallback: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "مساعد هاشمي الآلي | Hashimi AI Assistant",
  description: "مساعد ذكي للمحادثة والمساعدة باللغة العربية",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SpeedInsights />
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <Header />
          <main className="pt-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
          {/* <Footr /> */}
        </div>
      </body>
    </html>
  );
}
