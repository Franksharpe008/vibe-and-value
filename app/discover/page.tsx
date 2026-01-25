// ============================================
// VIBE & VALUE - Discover Tab (Daily Plate)
// ============================================

"use client";

import { useState } from "react";
import { useRecipeStore, useUserStore } from "@/lib/store";
import { mockRecipes } from "@/lib/data/mockData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  HeartIcon,
  ClockIcon,
  FireIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const recipes = useRecipeStore((state) => state.recipes);
  const favorites = useRecipeStore((state) => state.favorites);
  const toggleFavorite = useRecipeStore((state) => state.toggleFavorite);
  const setSelectedRecipe = useRecipeStore((state) => state.setSelectedRecipe);

  const categories = [
    { id: "all", label: "All Recipes", icon: "🍽️" },
    { id: "superfood", label: "Superfoods", icon: "🌟" },
    { id: "budget", label: "Budget-Friendly", icon: "💰" },
    { id: "quick", label: "Quick Meals", icon: "⚡" },
    { id: "high-protein", label: "High Protein", icon: "💪" },
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "superfood") return recipe.is_superfood_meal;
    if (selectedCategory === "budget")
      return recipe.swap_cost_per_serving < recipe.base_cost_per_serving;
    if (selectedCategory === "quick") return recipe.prep_time_mins < 20;
    if (selectedCategory === "high-protein")
      return recipe.nutrition_per_serving.protein_g > 20;
    return true;
  });

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <header className="pt-safe pt-6 pb-4 px-4 bg-white sticky top-0 z-10 border-b border-earth-green-100">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-editorial-black">
            Discover
          </h1>
          <p className="text-editorial-gray mt-1">
            Find your perfect healthy meal
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium
                whitespace-nowrap transition-all duration-300
                ${
                  selectedCategory === category.id
                    ? "bg-vibrant-orange-500 text-white shadow-lg"
                    : "bg-white text-editorial-gray hover:bg-earth-green-50"
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Featured Hero Card */}
        <Card padding="none" className="overflow-hidden relative">
          <div className="aspect-[4/3] relative">
            <Image
              src={recipes[0]?.image_url || "/placeholder-food.jpg"}
              alt={recipes[0]?.title || "Featured Recipe"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Featured Recipe</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                {recipes[0]?.title}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {recipes[0]?.prep_time_mins} min
                </span>
                <span className="flex items-center gap-1">
                  <FireIcon className="w-4 h-4" />
                  {recipes[0]?.calories} cal
                </span>
                <span className="flex items-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  ${recipes[0]?.swap_cost_per_serving.toFixed(2)}/serving
                </span>
              </div>
              <Link
                href={`/discover/${recipes[0]?.id}`}
                onClick={() => setSelectedRecipe(recipes[0]!)}
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-vibrant-orange-500 rounded-2xl font-semibold hover:bg-vibrant-orange-600 transition-colors"
              >
                View Recipe
              </Link>
            </div>
          </div>
        </Card>

        {/* Recipe Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold text-editorial-black">
            {selectedCategory === "all" ? "All Recipes" : categories.find((c) => c.id === selectedCategory)?.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/discover/${recipe.id}`}
                onClick={() => setSelectedRecipe(recipe)}
                className="group"
              >
                <Card padding="none" className="overflow-hidden h-full">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={recipe.image_url}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {recipe.is_superfood_meal && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3" />
                        SUPERFOOD
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(recipe.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      {favorites.includes(recipe.id) ? (
                        <HeartSolid className="w-5 h-5 text-vibrant-orange-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-editorial-gray" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="font-display font-semibold text-lg text-editorial-black line-clamp-2">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-editorial-gray">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {recipe.prep_time_mins}m
                      </span>
                      <span className="flex items-center gap-1">
                        <FireIcon className="w-4 h-4" />
                        {recipe.calories}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-vibrant-orange-500">
                          ${recipe.swap_cost_per_serving.toFixed(2)}
                        </span>
                        {recipe.swap_cost_per_serving < recipe.base_cost_per_serving && (
                          <span className="text-sm text-editorial-gray line-through">
                            ${recipe.base_cost_per_serving.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {recipe.swap_cost_per_serving < recipe.base_cost_per_serving && (
                        <span className="px-2 py-1 bg-earth-green-100 text-earth-green-700 rounded-lg text-xs font-semibold">
                          Save ${(recipe.base_cost_per_serving - recipe.swap_cost_per_serving).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {/* Health Score Badge */}
                    <div className="flex items-center gap-2 pt-2 border-t border-earth-green-100">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-editorial-gray">Health Score:</span>
                        <span className={`font-bold ${
                          recipe.health_score >= 90 ? "text-earth-green-600" :
                          recipe.health_score >= 70 ? "text-yellow-600" :
                          "text-vibrant-orange-500"
                        }`}>
                          {recipe.health_score}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
