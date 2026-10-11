import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vibe & Value · Meal Planning & Grocery Budgets",
    short_name: "Vibe & Value",
    description: "Plan meals, adjust portions and build a grocery checklist with illustrative budgets.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f9f7f2",
    theme_color: "#294c35",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
