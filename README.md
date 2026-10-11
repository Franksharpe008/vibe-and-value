# Vibe & Value · Meals, Portions & Grocery Budgets

A working meal-planning prototype by **Frank D. Sharpe**. Choose a recipe, adjust portions and ingredient swaps, build a weekly menu, and take one organized list shopping.

**[Open Vibe & Value](https://vibe-and-value.vercel.app/)** · [Explore Frank's business systems](https://frank-sharpe-flagship-systems.vercel.app/) · [More selected work](https://github.com/Franksharpe008/frank-sharpe-portfolio)

## Try the connected workflow

1. **Discover** a recipe or save it with the heart. Search by name or tag and filter the collection.
2. Open a recipe, choose the date, meal and servings, and compare its ingredient alternatives.
3. Select **Add to my plan**. The planner opens the selected day, and the grocery list reflects your choices.
4. Change portions, choose swaps, add another meal or mark one cooked. Ingredient estimates and quantities update together.
5. Check items off, download the shopping list, and reload. Plans, favorites and grocery checks stay in this browser; each week has its own saved plan.

The four recipes, ingredient prices and original nutrition values are illustrative. Costs represent estimated ingredients used, not store package prices or live retailer quotes. Ingredient substitutions can change nutrition and preparation. Journey, Shop and Profile are labeled concept previews with sample statistics and rewards.

## What changed in this revision

The previous planner used fixed 2024 sample dates and an unrelated grocery list. The October 11 revision connects actual recipe choices to editable weeks, serving-aware estimates, grouped ingredient quantities, swaps and export. It also replaces in-memory-only favorites/plans with device-local persistence, handles meal removal, preserves cooked status, and keeps unrelated weeks separate.

## Implementation

- **Next.js / React / TypeScript**: connected discovery, recipe and planner routes.
- **Zustand persistence**: saved weeks, grocery lists, budget and favorites in this browser's local storage. No sign-in required.
- **Derived records**: one cost calculation across recipe, menu and shopping list; same-unit ingredient quantities combine, while different units remain explicit.
- **Accessible controls**: labeled date/serving fields, native checkboxes, keyboard focus, responsive layout and reduced-motion support.
- **Consumer interface**: compact food photography, a clear choose → plan → shop sequence and visible empty states.

`lib/utils/mealPlanner.ts` contains the calculation and grocery-building rules. `lib/store/index.ts` owns saved transitions. `lib/data/mockData.ts` keeps illustrative recipe content separate from interface behavior.

Local storage is specific to this device/browser and can be cleared by the browser. There is no account sync, live grocery integration or production health tracking. Original nutrition values do not recalculate for swaps. Optional map concepts are separate from the working planner.

## Run and verify

```bash
npm ci
npm run dev
npm test
npm run build
npm start
```

The planner calculation tests cover portions, swaps, omitted ingredients, combined grocery quantities, week boundaries, recalculated totals and checked-item invalidation when quantities change. Browser verification covers recipe-to-plan entry, editing, saved reload, week navigation and an actual shopping-list download. Verification receipts and screenshots stay outside the public source under local `outputs/`.

Created through AI-assisted development directed by Frank D. Sharpe: product requirements, workflow decisions, integration, testing and iterative improvement.
