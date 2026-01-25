// ============================================
// VIBE & VALUE - Journey Tab (Animated Dashboard)
// 3D Avatar, Nutrient Rings, Progress Charts
// ============================================

"use client";

import { useUserStore } from "@/lib/store";
import { Card, StatCard, ProgressCard } from "@/components/ui/Card";
import {
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

// Circular Progress Component
function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 12,
  color = "#7a9664",
  label,
  sublabel,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e8ede4"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl md:text-3xl font-bold text-editorial-black">
            {value}
          </span>
          <span className="text-xs text-editorial-gray">/ {max}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-editorial-black">{label}</p>
      {sublabel && (
        <p className="text-xs text-editorial-gray">{sublabel}</p>
      )}
    </div>
  );
}

// Multi-ring Nutrient Display
function NutrientRings({ nutrition }: { nutrition: any }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <CircularProgress
        value={nutrition.protein_g}
        max={100}
        size={80}
        strokeWidth={8}
        color="#7a9664"
        label="Protein"
        sublabel="g"
      />
      <CircularProgress
        value={nutrition.carbs_g}
        max={150}
        size={80}
        strokeWidth={8}
        color="#f5530d"
        label="Carbs"
        sublabel="g"
      />
      <CircularProgress
        value={nutrition.fat_g}
        max={80}
        size={80}
        strokeWidth={8}
        color="#3b82f6"
        label="Fat"
        sublabel="g"
      />
      <CircularProgress
        value={nutrition.fiber_g}
        max={30}
        size={80}
        strokeWidth={8}
        color="#a855f7"
        label="Fiber"
        sublabel="g"
      />
    </div>
  );
}

// Avatar Display Component
function AvatarDisplay({ gamification, avatarState }: { gamification: any; avatarState: string }) {
  const avatarColors = {
    healthy: "#7a9664",
    thriving: "#9cb386",
    struggling: "#f5530d",
    exploded: "#d93800",
  };

  const color = avatarColors[avatarState as keyof typeof avatarColors] || avatarColors.healthy;

  return (
    <div className="relative">
      {/* Avatar Glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-50 animate-pulse-slow"
        style={{ backgroundColor: color }}
      />

      {/* Avatar Circle */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center">
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-6xl md:text-8xl"
          style={{ backgroundColor: color }}
        >
          {avatarState === "exploded" ? "💥" : avatarState === "thriving" ? "✨" : "😊"}
        </div>

        {/* Level Badge */}
        <div className="absolute -bottom-2 -right-2 bg-vibrant-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          LVL {gamification.level}
        </div>
      </div>

      {/* Gear Display */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
        {gamification.current_gear.hat && (
          <span className="text-2xl" title="Hat">👑</span>
        )}
        {gamification.current_gear.aura && (
          <span className="text-2xl" title="Aura">✨</span>
        )}
      </div>
    </div>
  );
}

export default function JourneyPage() {
  const profile = useUserStore((state) => state.profile);
  const [caloriesToday, setCaloriesToday] = useState(profile.progress_stats.calories_consumed_today);
  const avatarState = caloriesToday > profile.preferences.daily_calorie_goal ? "exploded" :
                      profile.gamification.streak_days >= 7 ? "thriving" : "healthy";

  const {
    total_saved_dollars,
    total_weight_lost,
    calories_consumed_today,
    meals_logged,
    superfood_count,
  } = profile.progress_stats;

  const {
    level,
    health_coins,
    xp,
    streak_days,
  } = profile.gamification;

  // Sample nutrition data for rings
  const todayNutrition = {
    protein_g: 85,
    carbs_g: 120,
    fat_g: 45,
    fiber_g: 24,
  };

  // Calculate XP progress
  const xpForCurrentLevel = level * 1000;
  const xpProgress = (xp / xpForCurrentLevel) * 100;

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <header className="pt-safe pt-6 pb-4 px-4 bg-white sticky top-0 z-10 border-b border-earth-green-100">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-editorial-black">
            Your Journey
          </h1>
          <p className="text-editorial-gray mt-1">
            Track your progress and achievements
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Avatar & Level Section */}
        <Card padding="lg" className="text-center">
          <h2 className="text-2xl font-display font-bold mb-6">Your Wellness Avatar</h2>

          <div className="flex flex-col items-center gap-6">
            <AvatarDisplay gamification={profile.gamification} avatarState={avatarState} />

            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              <div className="text-center">
                <p className="text-2xl font-bold text-vibrant-orange-500">{health_coins}</p>
                <p className="text-xs text-editorial-gray">Health Coins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-earth-green-600">{xp}</p>
                <p className="text-xs text-editorial-gray">XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{streak_days}</p>
                <p className="text-xs text-editorial-gray">Day Streak</p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-editorial-gray">Level Progress</span>
                <span className="font-medium">
                  {xp} / {xpForCurrentLevel} XP
                </span>
              </div>
              <div className="h-3 bg-earth-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-progress transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {avatarState === "exploded" && (
              <div className="w-full max-w-md p-4 bg-vibrant-orange-100 rounded-2xl border-2 border-vibrant-orange-300">
                <p className="text-vibrant-orange-700 font-medium text-sm">
                  ⚠️ You've exceeded your daily calorie goal! Your avatar is struggling.
                  Get back on track tomorrow to restore it.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Saved"
            value={`$${total_saved_dollars.toFixed(2)}`}
            icon={<ArrowTrendingDownIcon className="w-5 h-5" />}
            color="earth"
            trend={{ value: total_saved_dollars > 0 ? 12 : 0, positive: true }}
          />
          <StatCard
            label="Weight Lost"
            value={`${total_weight_lost.toFixed(1)}lbs`}
            icon={<FireIcon className="w-5 h-5" />}
            color="orange"
          />
          <StatCard
            label="Meals Logged"
            value={meals_logged}
            icon={<SparklesIcon className="w-5 h-5" />}
            color="earth"
          />
          <StatCard
            label="Superfoods"
            value={superfood_count}
            icon={<TrophyIcon className="w-5 h-5" />}
            color="purple"
          />
        </div>

        {/* Calorie Progress Ring */}
        <Card padding="lg">
          <h3 className="text-xl font-display font-semibold mb-6 text-center">
            Daily Calorie Goal
          </h3>
          <div className="flex justify-center">
            <CircularProgress
              value={calories_consumed_today}
              max={profile.preferences.daily_calorie_goal}
              size={200}
              strokeWidth={16}
              color={calories_consumed_today > profile.preferences.daily_calorie_goal ? "#d93800" : "#7a9664"}
              label="Calories"
              sublabel="kcal"
            />
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-editorial-gray">
              {calories_consumed_today > profile.preferences.daily_calorie_goal
                ? `Over by ${calories_consumed_today - profile.preferences.daily_calorie_goal} calories`
                : `${profile.preferences.daily_calorie_goal - calories_consumed_today} calories remaining`}
            </p>
          </div>
        </Card>

        {/* Nutrient Rings */}
        <Card padding="lg">
          <h3 className="text-xl font-display font-semibold mb-6 text-center">
            Today's Nutrition
          </h3>
          <NutrientRings nutrition={todayNutrition} />
        </Card>

        {/* Weekly Progress */}
        <Card padding="lg">
          <h3 className="text-xl font-display font-semibold mb-4">Weekly Progress</h3>
          <div className="space-y-4">
            <ProgressCard
              title="Weekly Budget"
              current={95.5}
              target={150}
              color="earth-green"
            />
            <ProgressCard
              title="Meals This Week"
              current={18}
              target={21}
              color="vibrant-orange"
            />
            <ProgressCard
              title="Workout Days"
              current={4}
              target={5}
              color="blue"
            />
          </div>
        </Card>

        {/* Recent Badges */}
        <Card padding="lg">
          <h3 className="text-xl font-display font-semibold mb-4">Recent Badges</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {profile.gamification.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex-shrink-0 text-center p-4 bg-earth-green-50 rounded-2xl min-w-[120px]"
              >
                <div className="text-4xl mb-2">{badge.icon_url}</div>
                <p className="text-sm font-medium text-editorial-black">{badge.name}</p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    badge.rarity === "legendary"
                      ? "text-yellow-600"
                      : badge.rarity === "epic"
                        ? "text-purple-600"
                        : badge.rarity === "rare"
                          ? "text-blue-600"
                          : "text-gray-600"
                  }`}
                >
                  {badge.rarity}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
