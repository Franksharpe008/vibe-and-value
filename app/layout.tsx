// ============================================
// VIBE & VALUE - Root Layout
// ============================================

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation/Navigation";
import { Toaster } from "@/components/ui/Toaster";
import { LocationProvider } from "@/components/providers/LocationProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vibe & Value · Meal Planning & Grocery Budgets",
  description:
    "Plan meals, adjust portions, compare ingredient estimates and build a grocery list. A working consumer prototype by Frank D. Sharpe.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vibe & Value",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#294c35",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-soft-cream overflow-x-hidden">
        <LocationProvider>
          <div className="flex flex-col min-h-screen">
            <div className="meal-notice">
              Interactive prototype <span>·</span> Illustrative costs &
              nutrition <span>·</span> Plans save in this browser
            </div>
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Navigation />
          </div>
          <Toaster />
        </LocationProvider>
      </body>
    </html>
  );
}
