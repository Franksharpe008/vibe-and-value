// ============================================
// VIBE & VALUE - Profile Tab (Digital Pantry)
// Pantry Manager, Total Savings Stats, Settings
// ============================================

"use client";

import { useState } from "react";
import { useUserStore } from "@/lib/store";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ArrowArrowTrendingDownIcon,
  TrophyIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ProfilePage() {
  const profile = useUserStore((state) => state.profile);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [editingGoals, setEditingGoals] = useState(false);

  const {
    total_saved_dollars,
    total_weight_lost,
    meals_logged,
    superfood_count,
  } = profile.progress_stats;

  const { level, health_coins, streak_days, badges } = profile.gamification;

  const handleGoalUpdate = (field: string, value: string | number) => {
    updateProfile({
      preferences: {
        ...profile.preferences,
        [field]: value,
      },
    });
  };

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <header className="pt-safe pt-6 pb-4 px-4 bg-white sticky top-0 z-10 border-b border-earth-green-100">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-editorial-black">
            Profile
          </h1>
          <p className="text-editorial-gray mt-1">
            Your digital pantry & achievements
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-earth-green-100 flex items-center justify-center text-4xl md:text-5xl overflow-hidden">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                profile.name.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold text-editorial-black">
                {profile.name}
              </h2>
              <p className="text-editorial-gray">{profile.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-vibrant-orange-100 text-vibrant-orange-600 rounded-full text-sm font-semibold">
                  Level {level}
                </span>
                <span className="px-3 py-1 bg-earth-green-100 text-earth-green-600 rounded-full text-sm font-semibold">
                  🔥 {streak_days} day streak
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-earth-green-50 rounded-2xl">
              <p className="text-2xl font-bold text-vibrant-orange-500">{health_coins}</p>
              <p className="text-xs text-editorial-gray">Health Coins</p>
            </div>
            <div className="text-center p-4 bg-earth-green-50 rounded-2xl">
              <p className="text-2xl font-bold text-earth-green-600">{meals_logged}</p>
              <p className="text-xs text-editorial-gray">Meals Logged</p>
            </div>
            <div className="text-center p-4 bg-earth-green-50 rounded-2xl">
              <p className="text-2xl font-bold text-blue-500">{superfood_count}</p>
              <p className="text-xs text-editorial-gray">Superfoods</p>
            </div>
            <div className="text-center p-4 bg-earth-green-50 rounded-2xl">
              <p className="text-2xl font-bold text-purple-500">{badges.length}</p>
              <p className="text-xs text-editorial-gray">Badges</p>
            </div>
          </div>
        </Card>

        {/* Savings Stats */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-vibrant-orange-100 rounded-2xl">
              <ArrowTrendingDownIcon className="w-6 h-6 text-vibrant-orange-500" />
            </div>
            <h2 className="text-xl font-display font-semibold">Total Savings</h2>
          </div>

          <div className="text-center mb-6">
            <p className="text-5xl md:text-6xl font-display font-bold text-vibrant-orange-500">
              ${total_saved_dollars.toFixed(2)}
            </p>
            <p className="text-editorial-gray mt-2">Saved on groceries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              label="Weight Lost"
              value={`${total_weight_lost.toFixed(1)} lbs`}
              icon={<HeartIcon className="w-5 h-5" />}
              color="earth"
            />
            <StatCard
              label="Budget Used This Week"
              value={`$95.50`}
              icon={<ArrowTrendingDownIcon className="w-5 h-5" />}
              color="orange"
            />
          </div>
        </Card>

        {/* Goals & Preferences */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrophyIcon className="w-6 h-6 text-vibrant-orange-500" />
              <h2 className="text-xl font-display font-semibold">My Goals</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingGoals(!editingGoals)}
            >
              {editingGoals ? "Done" : "Edit"}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-editorial-gray block mb-2">
                Weekly Budget Limit
              </label>
              {editingGoals ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-editorial-black">$</span>
                  <input
                    type="number"
                    value={profile.preferences.weekly_budget_limit}
                    onChange={(e) => handleGoalUpdate("weekly_budget_limit", parseFloat(e.target.value))}
                    className="flex-1 px-4 py-3 bg-white border-2 border-earth-green-200 rounded-2xl text-2xl font-bold focus:outline-none focus:border-vibrant-orange-500"
                  />
                </div>
              ) : (
                <p className="text-3xl font-bold text-editorial-black">
                  ${profile.preferences.weekly_budget_limit.toFixed(2)}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-editorial-gray block mb-2">
                Daily Calorie Goal
              </label>
              {editingGoals ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={profile.preferences.daily_calorie_goal}
                    onChange={(e) => handleGoalUpdate("daily_calorie_goal", parseInt(e.target.value))}
                    className="flex-1 px-4 py-3 bg-white border-2 border-earth-green-200 rounded-2xl text-2xl font-bold focus:outline-none focus:border-vibrant-orange-500"
                  />
                  <span className="text-2xl font-bold text-editorial-gray">calories</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-editorial-black">
                  {profile.preferences.daily_calorie_goal.toLocaleString()} calories
                </p>
              )}
            </div>

            {/* Target Weight */}
            {profile.preferences.target_weight && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-earth-green-100">
                <div>
                  <p className="text-sm text-editorial-gray">Starting Weight</p>
                  <p className="text-xl font-bold text-editorial-black">
                    {profile.preferences.current_weight || profile.preferences.target_weight + total_weight_lost} lbs
                  </p>
                </div>
                <div>
                  <p className="text-sm text-editorial-gray">Target Weight</p>
                  <p className="text-xl font-bold text-vibrant-orange-500">
                    {profile.preferences.target_weight} lbs
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Dietary Restrictions */}
        <Card padding="lg">
          <h2 className="text-xl font-display font-semibold mb-4">Dietary Preferences</h2>
          <div className="flex flex-wrap gap-2">
            {profile.preferences.dietary_restrictions.length > 0 ? (
              profile.preferences.dietary_restrictions.map((restriction) => (
                <span
                  key={restriction}
                  className="px-4 py-2 bg-earth-green-100 text-earth-green-700 rounded-full text-sm font-semibold capitalize"
                >
                  {restriction}
                </span>
              ))
            ) : (
              <p className="text-editorial-gray text-sm">No dietary restrictions set</p>
            )}
          </div>
        </Card>

        {/* Badge Collection */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <TrophyIcon className="w-6 h-6 text-vibrant-orange-500" />
            <h2 className="text-xl font-display font-semibold">Badge Collection</h2>
            <span className="px-2 py-1 bg-vibrant-orange-100 text-vibrant-orange-600 rounded-full text-xs font-semibold">
              {badges.length} earned
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`
                  text-center p-4 rounded-2xl
                  ${badge.rarity === "legendary"
                    ? "bg-yellow-50 ring-2 ring-yellow-400"
                    : badge.rarity === "epic"
                      ? "bg-purple-50 ring-2 ring-purple-400"
                      : badge.rarity === "rare"
                        ? "bg-blue-50 ring-2 ring-blue-400"
                        : "bg-earth-green-50"
                  }
                `}
              >
                <div className="text-4xl mb-2">{badge.icon_url}</div>
                <p className="text-xs font-medium text-editorial-black">{badge.name}</p>
                <p className="text-xs text-editorial-gray mt-1">{badge.earned_at}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Settings */}
        <Card padding="lg">
          <h2 className="text-xl font-display font-semibold mb-4">Settings</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 p-4 bg-white hover:bg-earth-green-50 rounded-2xl transition-colors">
              <div className="p-3 bg-vibrant-orange-100 rounded-xl">
                <BellIcon className="w-5 h-5 text-vibrant-orange-500" />
              </div>
              <span className="flex-1 text-left font-medium">Notifications</span>
              <span className="text-editorial-gray">
                {profile.preferences.notifications_enabled ? "On" : "Off"}
              </span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 bg-white hover:bg-earth-green-50 rounded-2xl transition-colors">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
              </div>
              <span className="flex-1 text-left font-medium">Privacy & Security</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 bg-white hover:bg-earth-green-50 rounded-2xl transition-colors">
              <div className="p-3 bg-earth-green-100 rounded-xl">
                <CogIcon className="w-5 h-5 text-earth-green-600" />
              </div>
              <span className="flex-1 text-left font-medium">App Settings</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 bg-white hover:bg-earth-green-50 rounded-2xl transition-colors">
              <div className="p-3 bg-purple-100 rounded-xl">
                <QuestionMarkCircleIcon className="w-5 h-5 text-purple-500" />
              </div>
              <span className="flex-1 text-left font-medium">Help & Support</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
