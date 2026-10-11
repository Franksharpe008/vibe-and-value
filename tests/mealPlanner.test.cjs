const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  dateKey,
  mondayOf,
  newPlan,
  recipeCost,
  makeShoppingList,
  normalizePlan,
  scaleAmount,
} = require("../.test-build/utils/mealPlanner.js");
const recipe = {
  id: "bowl",
  servings: 4,
  calories: 400,
  ingredients: [
    { id: "rice", item: "Rice", amount: "1 cup", price: 4, category: "grains" },
    {
      id: "cheese",
      item: "Feta",
      amount: "1/2 cup",
      price: 2,
      category: "dairy",
      swap_option: {
        item: "Omit feta",
        amount: "0",
        price: 0,
        category: "pantry",
      },
    },
  ],
};
const plan = {
  ...newPlan("2026-10-05"),
  daily_plans: [
    {
      date: "2026-10-11",
      meals: [
        { recipe_id: "bowl", servings: 2, swaps: [] },
        { recipe_id: "bowl", servings: 4, swaps: [] },
      ],
    },
  ],
};
test("Sunday belongs to preceding Monday and dates use local calendar", () => {
  assert.equal(mondayOf(new Date(2026, 9, 11, 12)), "2026-10-05");
  assert.equal(mondayOf(new Date(2026, 9, 12, 12)), "2026-10-12");
  assert.equal(dateKey(new Date(2026, 0, 2, 12)), "2026-01-02");
});
test("batch ingredient costs scale to servings and swaps", () => {
  assert.equal(recipeCost(recipe, 2), 3);
  assert.equal(recipeCost(recipe, 2, ["cheese"]), 2);
  assert.equal(scaleAmount("1/2 cup", 2), "1 cup");
  assert.equal(scaleAmount("2 lbs", 0.5), "1 lb");
});
test("repeated ingredients combine quantities and the six-serving cost is nine", () => {
  const list = makeShoppingList(plan, [recipe]);
  assert.equal(list.items.length, 2);
  assert.equal(list.items[0].amount, "1.5 cup");
  assert.equal(list.items[1].amount, "0.75 cup");
  assert.equal(list.total_estimated_cost, 9);
});
test("omitted ingredients leave no zero-quantity grocery item", () => {
  const p = {
    ...plan,
    daily_plans: [
      {
        ...plan.daily_plans[0],
        meals: [{ recipe_id: "bowl", servings: 4, swaps: ["cheese"] }],
      },
    ],
  };
  const list = makeShoppingList(p, [recipe]);
  assert.equal(list.items.length, 1);
  assert.equal(list.total_estimated_cost, 4);
});
test("checked groceries survive unchanged quantity but reset when portions change", () => {
  const first = makeShoppingList(plan, [recipe]);
  first.items[0].checked = true;
  assert.equal(makeShoppingList(plan, [recipe], first).items[0].checked, true);
  const next = {
    ...plan,
    daily_plans: [
      { ...plan.daily_plans[0], meals: [{ recipe_id: "bowl", servings: 1 }] },
    ],
  };
  assert.equal(makeShoppingList(next, [recipe], first).items[0].checked, false);
});
test("another week never inherits checks from this week", () => {
  const first = makeShoppingList(plan, [recipe]);
  first.items[0].checked = true;
  assert.equal(
    makeShoppingList({ ...plan, week_start: "2026-10-12" }, [recipe], first)
      .items[0].checked,
    false,
  );
});
test("totals derive from planned portions and unknown recipes are removed", () => {
  const p = normalizePlan(
    {
      ...plan,
      daily_plans: [
        {
          ...plan.daily_plans[0],
          meals: [
            ...plan.daily_plans[0].meals,
            { recipe_id: "missing", servings: 5 },
          ],
        },
      ],
    },
    [recipe],
  );
  assert.equal(p.total_budget_used, 9);
  assert.equal(p.total_calories, 2400);
  assert.equal(p.daily_plans[0].meals.length, 2);
});

test("odd portions and repeated meals keep recipe, week and groceries equal to the cent", () => {
  const r = {
    ...recipe,
    ingredients: [
      {
        id: "a",
        item: "Avocado",
        amount: "1 large",
        price: 2,
        category: "fruits",
      },
      {
        id: "q",
        item: "Quinoa",
        amount: "1 cup",
        price: 1.5,
        category: "grains",
      },
      {
        id: "c",
        item: "Chickpeas",
        amount: "1 can",
        price: 0.89,
        category: "protein",
      },
      {
        id: "s",
        item: "Sweet Potato",
        amount: "2 medium",
        price: 1.2,
        category: "vegetables",
      },
    ],
  };
  assert.equal(recipeCost(r, 3), 4.2);
  for (let first = 1; first <= 12; first++)
    for (let second = 1; second <= 12; second++) {
      const p = {
        ...plan,
        daily_plans: [
          {
            date: "2026-10-11",
            meals: [
              { recipe_id: "bowl", servings: first },
              { recipe_id: "bowl", servings: second },
            ],
          },
        ],
      };
      assert.equal(
        normalizePlan(p, [r]).total_budget_used,
        makeShoppingList(p, [r]).total_estimated_cost,
      );
    }
});
