"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePlannerStore, useRecipeStore } from "@/lib/store";
import { dateKey, mondayOf, recipeCost } from "@/lib/utils/mealPlanner";
import { format, addDays } from "date-fns";

export default function PlannerPage() {
  const p = usePlannerStore(),
    recipes = useRecipeStore((s) => s.recipes);
  const [ready, setReady] = useState(false),
    [selected, setSelected] = useState(""),
    [adding, setAdding] = useState(false),
    [recipeId, setRecipeId] = useState("r001"),
    [servings, setServings] = useState(2),
    [type, setType] = useState("dinner"),
    [message, setMessage] = useState("");
  useEffect(() => {
    setReady(true);
    const day = new URLSearchParams(window.location.search).get("day");
    const today = dateKey(new Date());
    setSelected(
      day && /^\d{4}-\d{2}-\d{2}$/.test(day)
        ? day
        : mondayOf(new Date()) === p.weeklyPlan.week_start
          ? today
          : (p.weeklyPlan.daily_plans.find((d) => d.meals.length)?.date ??
            p.weeklyPlan.week_start),
    );
  }, []);
  if (!ready)
    return (
      <main className="meal-shell">
        <p>Opening your meal plan…</p>
      </main>
    );
  const start = new Date(p.weeklyPlan.week_start + "T12:00:00"),
    days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const active = selected.startsWith(p.weeklyPlan.week_start)
    ? selected
    : days.some((d) => dateKey(d) === selected)
      ? selected
      : p.weeklyPlan.week_start;
  const meals =
      p.weeklyPlan.daily_plans.find((d) => d.date === active)?.meals ?? [],
    count = p.weeklyPlan.daily_plans.reduce((s, d) => s + d.meals.length, 0),
    checked = p.shoppingList.items.filter((i) => i.checked).length;
  const changeWeek = (offset: number) => {
    const next = dateKey(addDays(start, offset));
    p.setWeek(next);
    setSelected(next);
    setAdding(false);
  };
  const shoppingText =
    `Vibe & Value · ${format(start, "MMM d, yyyy")}\nIngredient estimates, not live store prices.\n\n` +
    p.shoppingList.items
      .map(
        (i) =>
          `${i.checked ? "[x]" : "[ ]"} ${i.item} — ${i.amount} — $${i.estimated_price.toFixed(2)}`,
      )
      .join("\n") +
    `\n\nEstimated ingredients: $${p.shoppingList.total_estimated_cost.toFixed(2)}\n`;
  return (
    <div className="meal-shell">
      <header className="meal-heading">
        <div>
          <p className="meal-eyebrow">VIBE & VALUE / YOUR WEEK</p>
          <h1>
            A little planning.
            <br />
            <em>A better week.</em>
          </h1>
          <p className="meal-sub">
            Meals, portions and groceries—connected. Your changes stay in this
            browser.
          </p>
        </div>
        <Link href="/discover" className="meal-button secondary">
          Find a recipe ↗
        </Link>
      </header>
      <section className="meal-budget" aria-label="Weekly budget">
        <label>
          Ingredient budget{" "}
          <div className="budget-input">
            $
            <input
              aria-label="Weekly ingredient budget"
              type="number"
              min="1"
              max="10000"
              value={p.budget}
              onChange={(e) => p.setBudget(Number(e.target.value))}
            />
          </div>
        </label>
        <div>
          <span>Planned ingredient estimate</span>
          <strong>${p.weeklyPlan.total_budget_used.toFixed(2)}</strong>
        </div>
        <div>
          <span>
            {p.budget - p.weeklyPlan.total_budget_used < 0
              ? "Over budget"
              : "Room in your budget"}
          </span>
          <strong
            className={
              p.budget - p.weeklyPlan.total_budget_used < 0 ? "over-budget" : ""
            }
          >
            ${Math.abs(p.budget - p.weeklyPlan.total_budget_used).toFixed(2)}
          </strong>
        </div>
        <div className="budget-meter">
          <span
            style={{
              width: `${Math.min(100, (p.weeklyPlan.total_budget_used / p.budget) * 100)}%`,
            }}
          />
        </div>
      </section>
      <div className="meal-planner-layout">
        <section className="meal-panel">
          <div className="meal-section-top">
            <div>
              <p className="meal-eyebrow">01 / PLAN</p>
              <h2>
                {format(start, "MMMM d")} –{" "}
                {format(addDays(start, 6), "d, yyyy")}
              </h2>
            </div>
            <div className="week-controls">
              <button aria-label="Previous week" onClick={() => changeWeek(-7)}>
                ←
              </button>
              <button
                onClick={() => {
                  const week = mondayOf(new Date());
                  p.setWeek(week);
                  setSelected(week);
                }}
              >
                This week
              </button>
              <button aria-label="Next week" onClick={() => changeWeek(7)}>
                →
              </button>
            </div>
          </div>
          <div className="week-grid">
            {days.map((d) => {
              const key = dateKey(d),
                n =
                  p.weeklyPlan.daily_plans.find((day) => day.date === key)
                    ?.meals.length ?? 0;
              return (
                <button
                  key={key}
                  className={active === key ? "selected" : ""}
                  aria-pressed={active === key}
                  aria-label={`${format(d, "EEEE, MMMM d")}, ${n} meals`}
                  onClick={() => {
                    setSelected(key);
                    setAdding(false);
                  }}
                >
                  <span>{format(d, "EEE")}</span>
                  <strong>{format(d, "d")}</strong>
                  <small>{n ? `${n} meal${n === 1 ? "" : "s"}` : "—"}</small>
                </button>
              );
            })}
          </div>
          <div className="meal-section-top day-heading">
            <h3>{format(new Date(active + "T12:00:00"), "EEEE")}’s menu</h3>
            <button className="meal-button" onClick={() => setAdding(!adding)}>
              {adding ? "Close" : "＋ Add a meal"}
            </button>
          </div>
          {adding && (
            <form
              className="add-meal-form"
              onSubmit={(e) => {
                e.preventDefault();
                p.addMealToPlan(recipeId, active, type, servings);
                setAdding(false);
                setMessage("Meal added. Your groceries updated automatically.");
              }}
            >
              <label>
                Recipe
                <select
                  value={recipeId}
                  onChange={(e) => setRecipeId(e.target.value)}
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-pair">
                <label>
                  Meal
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {["breakfast", "lunch", "dinner", "snack"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Servings
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                  />
                </label>
              </div>
              <button className="meal-button" type="submit">
                Add to {format(new Date(active + "T12:00:00"), "EEEE")}
              </button>
            </form>
          )}
          {!meals.length && !adding && (
            <div className="meal-empty">
              <span>🍽</span>
              <h3>Make room for something good.</h3>
              <p>
                Add a meal here. We’ll work out the ingredients and portions for
                you.
              </p>
              <button
                onClick={() => setAdding(true)}
                className="meal-button secondary"
              >
                Plan this day
              </button>
            </div>
          )}
          <div className="planned-meals">
            {meals.map((m) => {
              const r = recipes.find((r) => r.id === m.recipe_id);
              if (!r) return null;
              return (
                <article key={m.id} className="planned-meal">
                  <Image src={r.image_url} width={84} height={84} alt="" />
                  <div className="planned-meal-info">
                    <small>
                      {m.meal_type} {m.completed ? "· Cooked ✓" : ""}
                    </small>
                    <Link href={`/discover/${r.id}`}>
                      <h3>{r.title}</h3>
                    </Link>
                    <p>
                      ${recipeCost(r, m.servings, m.swaps).toFixed(2)}{" "}
                      ingredient estimate
                    </p>
                    <div className="meal-edit">
                      <label>
                        Servings{" "}
                        <input
                          aria-label={`Servings for ${r.title}`}
                          type="number"
                          min="1"
                          max="12"
                          value={m.servings}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= 1 && v <= 12)
                              p.updateMeal(active, m.id!, { servings: v });
                          }}
                        />
                      </label>
                      <button
                        onClick={() =>
                          p.updateMeal(active, m.id!, {
                            completed: !m.completed,
                          })
                        }
                      >
                        {m.completed ? "Mark uncooked" : "Mark cooked"}
                      </button>
                      <button
                        className="remove-meal"
                        aria-label={`Remove ${r.title}`}
                        onClick={() => p.removeMeal(active, m.id!)}
                      >
                        Remove
                      </button>
                    </div>
                    {r.ingredients.some((i) => i.swap_option) && (
                      <details>
                        <summary>
                          Budget swaps{" "}
                          {m.swaps?.length
                            ? `(${m.swaps.length} selected)`
                            : ""}
                        </summary>
                        {r.ingredients
                          .filter((i) => i.swap_option)
                          .map((i) => (
                            <label className="swap-choice" key={i.id}>
                              <input
                                type="checkbox"
                                checked={m.swaps?.includes(i.id) ?? false}
                                onChange={() =>
                                  p.updateMeal(active, m.id!, {
                                    swaps: m.swaps?.includes(i.id)
                                      ? m.swaps.filter((id) => id !== i.id)
                                      : [...(m.swaps ?? []), i.id],
                                  })
                                }
                              />
                              <span>
                                {i.item} → {i.swap_option!.item}
                              </span>
                            </label>
                          ))}
                      </details>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <p className="meal-footnote">
            {count} meals this week · Each week is saved separately.
          </p>
        </section>
        <aside className="meal-panel grocery-panel">
          <div className="meal-section-top">
            <div>
              <p className="meal-eyebrow">02 / SHOP</p>
              <h2>Your grocery list</h2>
            </div>
            <span className="meal-pill">
              {checked}/{p.shoppingList.items.length}
            </span>
          </div>
          <p className="meal-sub small">
            Built from this week’s meals. Repeated ingredients are combined.
          </p>
          {!p.shoppingList.items.length ? (
            <div className="grocery-empty">
              Your first meal starts the list.
            </div>
          ) : (
            <>
              {[...new Set(p.shoppingList.items.map((i) => i.aisle))].map(
                (aisle) => (
                  <div key={aisle} className="grocery-aisle">
                    <h3>{aisle}</h3>
                    {p.shoppingList.items
                      .filter((i) => i.aisle === aisle)
                      .map((i) => (
                        <label
                          className={`grocery-row ${i.checked ? "checked" : ""}`}
                          key={i.ingredient_id}
                        >
                          <input
                            type="checkbox"
                            checked={i.checked}
                            onChange={() =>
                              p.toggleShoppingItem(i.ingredient_id)
                            }
                          />
                          <span>
                            <strong>{i.item}</strong>
                            <small>{i.amount}</small>
                          </span>
                          <b>${i.estimated_price.toFixed(2)}</b>
                        </label>
                      ))}
                  </div>
                ),
              )}
              <div className="grocery-total">
                <span>Ingredient estimate</span>
                <strong>
                  ${p.shoppingList.total_estimated_cost.toFixed(2)}
                </strong>
              </div>
              <a
                className="meal-button full"
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(shoppingText)}`}
                download={`groceries-${p.weeklyPlan.week_start}.txt`}
                onClick={() =>
                  setMessage("Shopping list prepared for download.")
                }
              >
                ↓ Download shopping list
              </a>
            </>
          )}
          <p className="meal-footnote">
            Illustrative ingredient costs, not live retailer prices. Package
            sizes and pantry staples can change your checkout total.
          </p>
        </aside>
      </div>
      <p className="sr-only" role="status">
        {message}
      </p>
    </div>
  );
}
