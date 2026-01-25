// ============================================
// VIBE & VALUE - Home Page (Onboarding or Discover)
// ============================================

import { redirect } from "next/navigation";

export default function Home() {
  // For now, redirect to discover
  // In production, check if user has completed onboarding
  redirect("/discover");
}
