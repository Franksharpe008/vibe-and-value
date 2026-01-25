// ============================================
// VIBE & VALUE - Planner Tab (Weekly Budget)
// Calendar, Smart Grocery List, Google Maps Store Finder
// ============================================

"use client";

import { useState } from "react";
import { usePlannerStore, useUserStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  CalendarIcon,
  MapPinIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

export default function PlannerPage() {
  const { weeklyPlan, shoppingList, nearbyStores, selectedStore, setSelectedStore, toggleShoppingItem } = usePlannerStore();
  const { profile } = useUserStore();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    return date;
  });

  // Get plan for specific date
  const getPlanForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return weeklyPlan.daily_plans.find((plan) => plan.date === dateStr);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const daysToAdd = direction === "next" ? 7 : -7;
    setCurrentWeekStart(addDays(currentWeekStart, daysToAdd));
  };

  const totalEstimatedCost = shoppingList.items.reduce((acc, item) => acc + item.estimated_price, 0);
  const checkedItems = shoppingList.items.filter((item) => item.checked).length;

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <header className="pt-safe pt-6 pb-4 px-4 bg-white sticky top-0 z-10 border-b border-earth-green-100">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-editorial-black">
            Weekly Planner
          </h1>
          <p className="text-editorial-gray mt-1">
            Plan your meals and budget
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="md" className="text-center">
            <p className="text-sm text-editorial-gray mb-1">Weekly Budget</p>
            <p className="text-3xl font-bold text-editorial-black">
              ${profile.preferences.weekly_budget_limit.toFixed(2)}
            </p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-sm text-editorial-gray mb-1">Spent This Week</p>
            <p className="text-3xl font-bold text-vibrant-orange-500">
              ${weeklyPlan.total_budget_used.toFixed(2)}
            </p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-sm text-editorial-gray mb-1">Remaining</p>
            <p className="text-3xl font-bold text-earth-green-600">
              ${(profile.preferences.weekly_budget_limit - weeklyPlan.total_budget_used).toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Calendar View */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Meal Calendar</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek("prev")}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
              <span className="px-4 py-2 font-medium">
                {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek("next")}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date) => {
              const plan = getPlanForDate(date);
              const isToday = isSameDay(date, new Date());
              const hasMeals = plan && plan.meals.length > 0;

              return (
                <div
                  key={date.toISOString()}
                  className={`
                    p-3 rounded-2xl text-center transition-all
                    ${isToday ? "bg-vibrant-orange-500 text-white" : "bg-earth-green-50"}
                    ${hasMeals ? "ring-2 ring-earth-green-400" : ""}
                  `}
                >
                  <p className={`text-xs font-medium ${isToday ? "text-white" : "text-editorial-gray"}`}>
                    {format(date, "EEE")}
                  </p>
                  <p className={`text-lg font-bold ${isToday ? "text-white" : "text-editorial-black"}`}>
                    {format(date, "d")}
                  </p>
                  {hasMeals && (
                    <div className="mt-2 flex justify-center gap-1">
                      {plan.meals.slice(0, 3).map((meal, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            meal.completed ? "bg-earth-green-500" : "bg-vibrant-orange-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Shopping List */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShoppingCartIcon className="w-6 h-6 text-vibrant-orange-500" />
              <h2 className="text-xl font-display font-semibold">Smart Shopping List</h2>
            </div>
            <div className="text-sm text-editorial-gray">
              {checkedItems} / {shoppingList.items.length} items
            </div>
          </div>

          {/* Aisle-organized list */}
          <div className="space-y-4">
            {["Produce", "Protein", "Grains & Rice", "Canned Goods", "Dairy", "Pantry"].map((aisle) => {
              const aisleItems = shoppingList.items.filter((item) => item.aisle === aisle);
              if (aisleItems.length === 0) return null;

              return (
                <div key={aisle}>
                  <h3 className="text-sm font-semibold text-editorial-gray uppercase tracking-wide mb-2">
                    {aisle}
                  </h3>
                  <div className="space-y-2">
                    {aisleItems.map((item) => (
                      <div
                        key={item.ingredient_id}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                          ${item.checked ? "bg-earth-green-100 opacity-60" : "bg-white hover:bg-earth-green-50"}
                        `}
                        onClick={() => toggleShoppingItem(item.ingredient_id)}
                      >
                        <div className={`
                          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${item.checked ? "bg-earth-green-500 border-earth-green-500" : "border-earth-green-300"}
                        `}>
                          {item.checked && <CheckIcon className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${item.checked ? "line-through text-editorial-gray" : "text-editorial-black"}`}>
                            {item.item}
                          </p>
                          <p className="text-sm text-editorial-gray">{item.amount}</p>
                        </div>
                        <p className={`font-semibold ${item.checked ? "text-editorial-gray" : "text-vibrant-orange-500"}`}>
                          ${item.estimated_price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total & Store Selection */}
          <div className="mt-6 p-4 bg-earth-green-50 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-editorial-gray">Estimated Total:</span>
              <span className="text-2xl font-bold text-editorial-black">
                ${totalEstimatedCost.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Store Finder */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <MapPinIcon className="w-6 h-6 text-vibrant-orange-500" />
            <h2 className="text-xl font-display font-semibold">Nearby Stores</h2>
          </div>

          <div className="space-y-3">
            {nearbyStores.map((store) => (
              <div
                key={store.store_id}
                className={`
                  p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${selectedStore?.store_id === store.store_id
                    ? "border-vibrant-orange-500 bg-vibrant-orange-50"
                    : "border-earth-green-100 bg-white hover:border-earth-green-300"
                  }
                `}
                onClick={() => setSelectedStore(store)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-editorial-black">{store.name}</h3>
                    <p className="text-sm text-editorial-gray">{store.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {store.distance_miles} mi
                      </span>
                      <span className="text-earth-green-600">
                        {store.inventory_match_percentage}% match
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-vibrant-orange-500">
                      ${store.estimated_cart_total.toFixed(2)}
                    </p>
                    <p className="text-xs text-editorial-gray">estimated</p>
                  </div>
                </div>

                {selectedStore?.store_id === store.store_id && (
                  <div className="mt-4 pt-4 border-t border-earth-green-100">
                    <a
                      href={store.navigation_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-vibrant-orange-500 font-medium hover:underline"
                    >
                      <MapPinIcon className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
