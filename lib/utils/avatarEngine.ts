// ============================================
// VIBE & VALUE - Avatar Engine
// Handles avatar state, level scaling, and animations
// ============================================

import type { AvatarState, GamificationData } from "../types";

export interface AvatarConfig {
  state: AvatarState;
  level: number;
  scale: number;
  animation: string;
  color: string;
  gear: {
    hat?: string;
    outfit?: string;
    aura?: string;
    accessory?: string;
  };
}

/**
 * Calculate avatar scale based on level and health
 * Higher levels = slightly larger avatar
 * Health state affects color and animation
 */
export function calculateAvatarConfig(
  gamification: GamificationData,
  caloriesToday: number,
  calorieGoal: number,
): AvatarConfig {
  const { level, avatar_state, current_gear, streak_days } = gamification;

  // Base scale increases slightly with level (0.8 to 1.2)
  const baseScale = 0.8 + Math.min(level / 100, 0.4);

  // Check if avatar should explode
  const shouldExplode = caloriesToday > calorieGoal;
  const state: AvatarState = shouldExplode ? "exploded" : avatar_state;

  // Determine color based on state
  let color = "#7a9664"; // Default earthy green
  let animation = "idle";

  switch (state) {
    case "healthy":
      color = "#7a9664"; // Earthy green
      animation = streak_days >= 7 ? "thriving" : "idle";
      break;
    case "thriving":
      color = "#9cb386"; // Lighter green
      animation = "thriving";
      break;
    case "struggling":
      color = "#f5530d"; // Vibrant orange warning
      animation = "struggling";
      break;
    case "exploded":
      color = "#d93800"; // Dark orange/red
      animation = "explode";
      break;
  }

  return {
    state,
    level,
    scale: shouldExplode ? 2.0 : baseScale,
    animation,
    color,
    gear: current_gear,
  };
}

/**
 * Calculate health points for leaderboard
 * Combines money saved, nutritional density, and consistency
 */
export function calculateHealthPoints(
  totalSaved: number,
  recipesCompleted: number,
  streakDays: number,
  superfoodCount: number,
): number {
  const savingsPoints = totalSaved * 10;
  const recipePoints = recipesCompleted * 50;
  const streakMultiplier = 1 + streakDays * 0.1;
  const superfoodBonus = superfoodCount * 15;

  return Math.floor((savingsPoints + recipePoints + superfoodBonus) * streakMultiplier);
}

/**
 * Calculate XP required for next level
 */
export function xpForLevel(level: number): number {
  return Math.floor(1000 * Math.pow(1.2, level - 1));
}

/**
 * Calculate health coins earned from completing a recipe
 * Formula: (health_score / 10) + (total_savings * 2)
 */
export function calculateCoinsEarned(
  healthScore: number,
  totalSavings: number,
): number {
  return Math.floor(healthScore / 10) + totalSavings * 2;
}

/**
 * Get avatar animation state based on user performance
 */
export function getAvatarAnimation(
  caloriesToday: number,
  calorieGoal: number,
  streakDays: number,
): string {
  const calorieRatio = caloriesToday / calorieGoal;

  if (calorieRatio > 1.2) {
    return "explode";
  } else if (calorieRatio > 1.0) {
    return "struggling";
  } else if (streakDays >= 7) {
    return "thriving";
  } else {
    return "idle";
  }
}

/**
 * Avatar gear configuration
 * Maps gear IDs to Three.js models or visual representations
 */
export const GEAR_REGISTRY = {
  hats: {
    chef_hat_gold: {
      name: "Chef Hat Gold",
      model: "chef_hat_gold.glb",
      scale: 1.0,
      position: { x: 0, y: 0.5, z: 0 },
    },
    spring_crown: {
      name: "Spring Crown",
      model: "spring_crown.glb",
      scale: 0.9,
      position: { x: 0, y: 0.45, z: 0 },
    },
  },
  outfits: {
    spring_renew_tracksuit: {
      name: "Spring Renew Tracksuit",
      model: "tracksuit.glb",
      scale: 1.0,
      position: { x: 0, y: 0, z: 0 },
    },
    summer_glow_fit: {
      name: "Summer Glow Fit",
      model: "summer_fit.glb",
      scale: 1.0,
      position: { x: 0, y: 0, z: 0 },
    },
  },
  auras: {
    green_sparkle: {
      name: "Green Sparkle",
      color: 0x7a9664,
      intensity: 0.5,
      particleCount: 50,
    },
    golden_glow: {
      name: "Golden Glow",
      color: 0xffd700,
      intensity: 0.7,
      particleCount: 75,
    },
  },
  accessories: {
    golden_spatula: {
      name: "Golden Spatula",
      model: "spatula.glb",
      scale: 0.3,
      position: { x: 0.3, y: 0.2, z: 0.2 },
    },
  },
};

/**
 * Get gear configuration by type and ID
 */
export function getGearConfig(type: string, gearId: string) {
  const typeKey = `${type}s` as keyof typeof GEAR_REGISTRY;
  return GEAR_REGISTRY[typeKey]?.[gearId as keyof typeof GEAR_REGISTRY[typeof typeKey]] || null;
}
