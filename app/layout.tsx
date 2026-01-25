// ============================================
// VIBE & VALUE - Root Layout
// ============================================

import type { Metadata } from "next";
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
  title: "Vibe & Value - Gamified Meal Planning",
  description:
    "A gamified, editorial-grade meal planning app that intersects high-nutrition, low-cost groceries, and real-time physical progress tracking.",
  manifest: "/manifest.json",
  themeColor: "#7a9664",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vibe & Value",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-soft-cream overflow-x-hidden">
        <LocationProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Navigation />
          </div>
          <Toaster />
        </LocationProvider>
      </body>
    </html>
  );
}
