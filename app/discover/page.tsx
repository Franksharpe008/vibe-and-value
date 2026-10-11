"use client";
import { useEffect, useState } from "react";
import { useRecipeStore, usePlannerStore } from "@/lib/store";
import { recipeCost } from "@/lib/utils/mealPlanner";
import Image from "next/image";
import Link from "next/link";
export default function DiscoverPage() {
  const recipes = useRecipeStore((s) => s.recipes),
    favorites = useRecipeStore((s) => s.favorites),
    toggleFavorite = useRecipeStore((s) => s.toggleFavorite),
    plan = usePlannerStore((s) => s.weeklyPlan);
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All meals"),
    [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const filters = [
    "All meals",
    "Quick prep",
    "Vegetarian",
    "Family favorites",
    "Saved",
  ];
  const list = recipes.filter(
    (r) =>
      (r.title + " " + r.tags.join(" "))
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "All meals" ||
        (filter === "Quick prep" && r.prep_time_mins <= 15) ||
        (filter === "Vegetarian" && r.tags.includes("vegetarian")) ||
        (filter === "Family favorites" && r.tags.includes("family-friendly")) ||
        (filter === "Saved" && favorites.includes(r.id))),
  );
  const meals = ready
    ? plan.daily_plans.reduce((s, d) => s + d.meals.length, 0)
    : 0;
  return (
    <div className="meal-shell">
      <header className="meal-brand">
        <Link href="/discover">
          vibe<span>&</span>value<span className="brand-dot">●</span>
        </Link>
        <span>Good food. Thoughtfully planned.</span>
        <Link href="/planner" className="meal-button secondary">
          Your week {ready && meals > 0 ? `(${meals})` : "↗"}
        </Link>
      </header>
      <section className="meal-hero">
        <div>
          <p className="meal-eyebrow">A LITTLE PREP GOES A LONG WAY</p>
          <h1>
            Eat well.
            <br />
            Spend thoughtfully.
            <br />
            <em>Make it your week.</em>
          </h1>
          <p>
            Find something you’ll love to cook. Plan the portions, compare
            ingredient swaps and take one organized list to the store.
          </p>
          <Link href="/planner" className="meal-button">
            Build your weekly plan ↗
          </Link>
          <div className="meal-hero-steps">
            <span>01 Choose</span>
            <span>02 Plan</span>
            <span>03 Shop</span>
          </div>
        </div>
        <Link href="/discover/r001" className="hero-food">
          <Image
            src={recipes[0].image_url}
            alt="Colorful vegetables and grains in a meal bowl"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <div className="hero-food-label">
            <small>ON THE MENU</small>
            <strong>
              Make lunch
              <br />
              worth looking forward to.
            </strong>
            <span>Buddha bowl · 4 servings · View recipe ↗</span>
          </div>
        </Link>
      </section>
      <section aria-label="Recipe collection">
        <div className="meal-section-top recipe-search">
          <div>
            <p className="meal-eyebrow">COOK SOMETHING GOOD</p>
            <h2>Recipes for real life.</h2>
          </div>
          <label>
            <span className="sr-only">Search recipes</span>
            <input
              type="search"
              placeholder="Search meals or ingredients…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="meal-filters">
          {filters.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="recipe-grid">
          {list.map((r) => (
            <article className="recipe-tile" key={r.id}>
              <div className="recipe-photo">
                <Link href={`/discover/${r.id}`}>
                  <Image
                    src={r.image_url}
                    alt={r.title}
                    fill
                    sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 28vw"
                  />
                </Link>
                <button
                  aria-label={`${favorites.includes(r.id) ? "Unsave" : "Save"} ${r.title}`}
                  aria-pressed={favorites.includes(r.id)}
                  onClick={() => toggleFavorite(r.id)}
                >
                  {favorites.includes(r.id) ? "♥" : "♡"}
                </button>
                <span>{r.prep_time_mins} min prep</span>
              </div>
              <div className="recipe-tile-copy">
                <p className="meal-eyebrow">{r.tags.slice(0, 2).join(" / ")}</p>
                <Link href={`/discover/${r.id}`}>
                  <h3>{r.title}</h3>
                </Link>
                <p>{r.description}</p>
                <div className="recipe-tile-bottom">
                  <span>
                    <strong>${recipeCost(r).toFixed(2)}</strong> / serving
                    estimate
                  </span>
                  <Link
                    href={`/discover/${r.id}`}
                    aria-label={`View ${r.title}`}
                  >
                    ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!list.length && (
          <div className="meal-empty">
            <h3>
              {filter === "Saved"
                ? "Your favorites will live here."
                : "No meals found."}
            </h3>
            <p>
              {filter === "Saved"
                ? "Tap the heart on a recipe to keep it."
                : "Try another search or choose All meals."}
            </p>
          </div>
        )}
      </section>
      <footer className="meal-page-footer">
        <span>Built by Frank D. Sharpe</span>
        <a href="https://frank-sharpe-flagship-systems.vercel.app/">
          Explore my working systems ↗
        </a>
      </footer>
    </div>
  );
}
