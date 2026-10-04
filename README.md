# Vibe & Value · Meal Planning & Budget Comparisons

An interactive meal-planning prototype that connects recipes, ingredient price tradeoffs, a weekly plan, and progress feedback.

**[Open the prototype](https://vibe-and-value.vercel.app/)** · [More work by Frank D. Sharpe](https://github.com/Franksharpe008/frank-sharpe-portfolio)

## Problem → implementation

A meal choice combines time, preference, nutrition, and budget. Vibe & Value brings those decisions into a single interface: discover a recipe, inspect its ingredient swaps, plan meals, and see progress feedback.

## Try the workflow

1. Open **Discover** and inspect the **High-Protein Budget Buddha Bowl** recipe.
2. Select **View Swaps** and compare the sample ingredient alternatives.
3. Explore **Planner** for the weekly plan and shopping list.
4. Inspect **Journey** and **Profile** for the connected progress state.

Recipe navigation and the swap control were checked on the deployed site on October 4, 2026. Prices, nutrition scores, savings, profiles, stores, and leaderboard entries use sample data; they are not live retailer quotes or verified health outcomes.

## Technical decisions

- **Next.js, React, and TypeScript** provide connected routes for discovery, planning, progress, shop, and profile.
- **Zustand** manages recipe, plan, shopping, and gamification state in the browser.
- **Tailwind CSS and Framer Motion** support responsive layout and interaction feedback.
- `lib/data/mockData.ts` separates sample data from interface and state logic.
- `lib/store/index.ts` exposes the state transitions for inspection.

State is in memory in the current prototype; changes are not backed by authentication or a server database and may reset after a reload. Maps configuration is optional and should use a restricted browser key.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` and `npm start` for a production build. Use a Node.js release compatible with the checked-in Next.js version.

## Scope and next steps

This project demonstrates a multi-step product experience and explicit state management. Live grocery data, authenticated accounts, durable persistence, real social competition, and production nutrition integrations are future work. A 3D avatar concept is not evidence of a completed production 3D system.

Created through AI-assisted development directed by Frank D. Sharpe, with an emphasis on practical tradeoffs, interface clarity, and connected workflows.
