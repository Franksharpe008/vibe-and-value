import type { Recipe, PlannedMeal, ShoppingList, WeeklyPlan } from "../types";
export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const mondayOf = (date: Date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dateKey(d);
};
export const money = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;
export const portionCost = (
  price: number,
  servings: number,
  batchServings: number,
) => money((price * servings) / batchServings);
export function recipeCost(recipe: Recipe, servings = 1, swaps: string[] = []) {
  return money(
    recipe.ingredients.reduce(
      (sum, i) =>
        sum +
        portionCost(
          swaps.includes(i.id) && i.swap_option ? i.swap_option.price : i.price,
          servings,
          recipe.servings,
        ),
      0,
    ),
  );
}
export function scaleAmount(amount: string, factor: number) {
  const m = amount.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.*)$/);
  if (!m)
    return factor === 1 ? amount : `${amount} × ${Number(factor.toFixed(2))}`;
  const [n, d] = m[1].split("/").map(Number),
    scaled = (n / (d || 1)) * factor;
  const count = Number(scaled.toFixed(2)),
    unit =
      count === 1
        ? m[2].replace(/^lbs$/, "lb").replace(/^sprigs$/, "sprig")
        : m[2];
  return `${count}${unit ? " " + unit : ""}`;
}
export function normalizePlan(plan: WeeklyPlan, recipes: Recipe[]): WeeklyPlan {
  const days = plan.daily_plans.map((day) => {
    const meals = day.meals.filter((m) =>
      recipes.some((r) => r.id === m.recipe_id),
    );
    return {
      ...day,
      meals,
      budget_used: money(
        meals.reduce(
          (s, m) =>
            s +
            recipeCost(
              recipes.find((r) => r.id === m.recipe_id)!,
              m.servings,
              m.swaps,
            ),
          0,
        ),
      ),
      calories: meals.reduce(
        (s, m) =>
          s + recipes.find((r) => r.id === m.recipe_id)!.calories * m.servings,
        0,
      ),
    };
  });
  return {
    ...plan,
    daily_plans: days,
    total_budget_used: money(days.reduce((s, d) => s + d.budget_used, 0)),
    total_calories: days.reduce((s, d) => s + d.calories, 0),
  };
}
export function makeShoppingList(
  plan: WeeklyPlan,
  recipes: Recipe[],
  previous?: ShoppingList,
): ShoppingList {
  const groups = new Map<
    string,
    {
      item: string;
      category: Recipe["ingredients"][number]["category"];
      price: number;
      amounts: string[];
    }
  >();
  for (const day of plan.daily_plans)
    for (const meal of day.meals) {
      const r = recipes.find((r) => r.id === meal.recipe_id);
      if (!r) continue;
      for (const i of r.ingredients) {
        const alt = meal.swaps?.includes(i.id) ? i.swap_option : undefined;
        if (alt?.amount === "0") continue;
        const item = alt?.item ?? i.item,
          k = item.toLowerCase(),
          factor = meal.servings / r.servings,
          g = groups.get(k) ?? {
            item,
            category: alt?.category ?? i.category,
            price: 0,
            amounts: [],
          };
        g.price += portionCost(
          alt?.price ?? i.price,
          meal.servings,
          r.servings,
        );
        g.amounts.push(scaleAmount(alt?.amount ?? i.amount, factor));
        groups.set(k, g);
      }
    }
  const items = [...groups.entries()].map(([key, g]) => {
    const id = `grocery-${plan.week_start}-${key}`;
    const units = g.amounts.map((a) => a.match(/^(\d+(?:\.\d+)?)\s*(.*)$/));
    let amount = g.amounts.join(" + ");
    if (units.every(Boolean) && new Set(units.map((m) => m![2])).size === 1)
      amount =
        `${Number(units.reduce((s, m) => s + Number(m![1]), 0).toFixed(2))} ${units[0]![2]}`.trim();
    return {
      ingredient_id: id,
      item: g.item,
      amount,
      estimated_price: money(g.price),
      category: g.category,
      aisle: {
        protein: "Protein",
        vegetables: "Produce",
        fruits: "Produce",
        grains: "Grains & Rice",
        dairy: "Dairy",
        pantry: "Pantry",
        herbs: "Produce",
      }[g.category],
      checked:
        previous?.items.some(
          (i) => i.ingredient_id === id && i.amount === amount && i.checked,
        ) ?? false,
    };
  });
  return {
    id: "weekly-groceries",
    name: "Groceries for your plan",
    items,
    total_estimated_cost: money(
      items.reduce((s, i) => s + i.estimated_price, 0),
    ),
    created_at: plan.week_start,
    is_completed: items.length > 0 && items.every((i) => i.checked),
  };
}
export function newPlan(weekStart: string): WeeklyPlan {
  return {
    week_start: weekStart,
    daily_plans: [],
    total_budget_used: 0,
    total_calories: 0,
  };
}
