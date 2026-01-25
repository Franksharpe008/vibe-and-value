// ============================================
// VIBE & VALUE - Recipe Detail Page with Budget Swap
// ============================================

"use client";

import { use, useEffect, useState } from "react";
import { useRecipeStore, useUserStore } from "@/lib/store";
import { mockRecipes } from "@/lib/data/mockData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeftIcon,
  ClockIcon,
  FireIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showSuccess, showAchievement } from "@/components/ui/Toaster";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const recipes = useRecipeStore((state) => state.recipes);
  const selectedRecipe = useRecipeStore((state) => state.selectedRecipe);
  const completeMeal = useUserStore((state) => state.completeMeal);

  const recipe = recipes.find((r) => r.id === id) || selectedRecipe || recipes[0];
  const [showSwaps, setShowSwaps] = useState(false);
  const [swappedIngredients, setSwappedIngredients] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Recipe not found</p>
      </div>
    );
  }

  // Calculate savings from swaps
  const totalSavings = recipe.ingredients.reduce((acc, ingredient) => {
    if (swappedIngredients.has(ingredient.id) && ingredient.swap_option) {
      return acc + ingredient.swap_option.savings;
    }
    return acc;
  }, 0);

  const finalCostPerServing = recipe.base_cost_per_serving - totalSavings;

  const toggleSwap = (ingredientId: string) => {
    setSwappedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  const handleCompleteMeal = () => {
    setIsCompleting(true);
    const usedSwaps = swappedIngredients.size > 0;

    setTimeout(() => {
      completeMeal(recipe, usedSwaps);
      const coinsEarned = Math.floor(recipe.health_score / 10) + totalSavings * 2;

      if (totalSavings > 0) {
        showAchievement(
          `Meal complete! +${coinsEarned} Health Coins & saved $${totalSavings.toFixed(2)}! 🎉`
        );
      } else {
        showSuccess(`Meal complete! +${coinsEarned} Health Coins!`);
      }

      setIsCompleting(false);
      router.push("/journey");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-soft-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-earth-green-100">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/discover"
            className="p-2 hover:bg-earth-green-50 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-editorial-black" />
          </Link>
          <h1 className="font-display font-semibold text-lg">Recipe Details</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative aspect-[4/3] md:aspect-[16/9]">
        <Image
          src={recipe.image_url}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {recipe.is_superfood_meal && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold mb-3">
              <SparklesIcon className="w-4 h-4" />
              SUPERFOOD MEAL
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            {recipe.title}
          </h2>
          <p className="text-white/90">{recipe.description}</p>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card padding="sm" className="text-center">
            <ClockIcon className="w-6 h-6 mx-auto text-vibrant-orange-500 mb-1" />
            <p className="text-2xl font-bold text-editorial-black">
              {recipe.prep_time_mins}
            </p>
            <p className="text-xs text-editorial-gray">Minutes</p>
          </Card>
          <Card padding="sm" className="text-center">
            <FireIcon className="w-6 h-6 mx-auto text-vibrant-orange-500 mb-1" />
            <p className="text-2xl font-bold text-editorial-black">
              {recipe.calories}
            </p>
            <p className="text-xs text-editorial-gray">Calories</p>
          </Card>
          <Card padding="sm" className="text-center">
            <SparklesIcon className="w-6 h-6 mx-auto text-vibrant-orange-500 mb-1" />
            <p className="text-2xl font-bold text-editorial-black">
              {recipe.health_score}
            </p>
            <p className="text-xs text-editorial-gray">Health Score</p>
          </Card>
          <Card padding="sm" className="text-center">
            <CurrencyDollarIcon className="w-6 h-6 mx-auto text-vibrant-orange-500 mb-1" />
            <p className="text-2xl font-bold text-editorial-black">
              ${finalCostPerServing.toFixed(2)}
            </p>
            <p className="text-xs text-editorial-gray">Per Serving</p>
          </Card>
        </div>

        {/* Budget Swap Banner */}
        {recipe.ingredients.some((i) => i.swap_option) && (
          <Card padding="md" className="gradient-seasonal-spring">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl flex-shrink-0">
                <CurrencyDollarIcon className="w-6 h-6 text-earth-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-editorial-black mb-1">
                  Smart Budget Swaps Available
                </h3>
                <p className="text-editorial-gray text-sm mb-3">
                  Save money while keeping the nutrition! Swap expensive ingredients for
                  budget-friendly alternatives.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowSwaps(!showSwaps)}
                >
                  {showSwaps ? "Hide Swaps" : "View Swaps"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Nutrition Info */}
        <Card padding="md">
          <h3 className="font-display font-semibold text-lg mb-4">Nutrition per Serving</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-editorial-gray">Protein</p>
              <p className="text-xl font-bold text-editorial-black">
                {recipe.nutrition_per_serving.protein_g}g
              </p>
            </div>
            <div>
              <p className="text-sm text-editorial-gray">Carbs</p>
              <p className="text-xl font-bold text-editorial-black">
                {recipe.nutrition_per_serving.carbs_g}g
              </p>
            </div>
            <div>
              <p className="text-sm text-editorial-gray">Fat</p>
              <p className="text-xl font-bold text-editorial-black">
                {recipe.nutrition_per_serving.fat_g}g
              </p>
            </div>
            <div>
              <p className="text-sm text-editorial-gray">Fiber</p>
              <p className="text-xl font-bold text-editorial-black">
                {recipe.nutrition_per_serving.fiber_g}g
              </p>
            </div>
          </div>
        </Card>

        {/* Ingredients with Budget Swaps */}
        <Card padding="md">
          <h3 className="font-display font-semibold text-lg mb-4">Ingredients</h3>
          <div className="space-y-3">
            {recipe.ingredients.map((ingredient) => {
              const isSwapped = swappedIngredients.has(ingredient.id);
              const activeItem = isSwapped && ingredient.swap_option
                ? ingredient.swap_option
                : ingredient;

              return (
                <div
                  key={ingredient.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isSwapped
                      ? "border-earth-green-400 bg-earth-green-50"
                      : "border-earth-green-100 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {ingredient.is_superfood && (
                          <SparklesIcon className="w-4 h-4 text-yellow-500" />
                        )}
                        <h4 className="font-semibold text-editorial-black">
                          {activeItem.item}
                        </h4>
                      </div>
                      <p className="text-sm text-editorial-gray">{ingredient.amount}</p>
                      {isSwapped && ingredient.swap_option && (
                        <div className="mt-2 text-sm text-earth-green-600">
                          ✓ {ingredient.swap_option.health_benefit}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-editorial-black">
                        ${activeItem.price.toFixed(2)}
                      </p>
                      {ingredient.swap_option && (
                        <button
                          onClick={() => toggleSwap(ingredient.id)}
                          className={`
                            mt-2 px-3 py-1 rounded-xl text-xs font-semibold
                            flex items-center gap-1 transition-all
                            ${
                              isSwapped
                                ? "bg-earth-green-500 text-white"
                                : "bg-earth-green-100 text-earth-green-700 hover:bg-earth-green-200"
                            }
                          `}
                        >
                          {isSwapped ? (
                            <>
                              <XMarkIcon className="w-3 h-3" />
                              Undo
                            </>
                          ) : (
                            <>
                              <CurrencyDollarIcon className="w-3 h-3" />
                              Save ${ingredient.swap_option.savings.toFixed(2)}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalSavings > 0 && (
            <div className="mt-4 p-4 bg-vibrant-orange-50 rounded-2xl border-2 border-vibrant-orange-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-vibrant-orange-700">
                  Total Savings with Swaps:
                </span>
                <span className="text-2xl font-bold text-vibrant-orange-600">
                  ${totalSavings.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card padding="md">
          <h3 className="font-display font-semibold text-lg mb-4">Instructions</h3>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-vibrant-orange-500 text-white rounded-full font-bold">
                  {index + 1}
                </span>
                <p className="text-editorial-black pt-1">{instruction}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Complete Meal CTA */}
        <Card padding="md" className="gradient-progress text-white text-center">
          <h3 className="font-display font-bold text-2xl mb-2">
            Ready to Cook?
          </h3>
          <p className="text-white/90 mb-4">
            Complete this meal to earn{" "}
            <span className="font-bold">
              {Math.floor(recipe.health_score / 10) + totalSavings * 2}
            </span>{" "}
            Health Coins!
            {totalSavings > 0 && ` Plus save $${totalSavings.toFixed(2)}!`}
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleCompleteMeal}
            loading={isCompleting}
          >
            <CheckIcon className="w-5 h-5 mr-2" />
            Complete Meal
          </Button>
        </Card>
      </div>
    </div>
  );
}
