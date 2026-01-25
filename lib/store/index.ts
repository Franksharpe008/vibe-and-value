// ============================================
// VIBE & VALUE - Zustand State Management
// ============================================

import { create } from "zustand";
import type {
  UserProfile,
  Recipe,
  StoreLocation,
  ShoppingList,
  WeeklyPlan,
  AvatarItem,
  SeasonalChallenge,
  FeedPost,
  LeaderboardEntry,
  GamificationData,
  AvatarState,
} from "../types";
import {
  mockUserProfile,
  mockRecipes,
  mockStores,
  mockShoppingList,
  mockWeeklyPlan,
  mockAvatarItems,
  mockSeasonalChallenges,
  mockFeedPosts,
  mockLeaderboard,
} from "../data/mockData";

// ============================================
// User Store
// ============================================
interface UserState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setAvatarState: (state: AvatarState) => void;
  updateCalories: (calories: number) => void;
  checkAvatarExplosion: () => void;
  addHealthCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  completeMeal: (recipe: Recipe, usedSwaps: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: mockUserProfile,

  updateProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),

  setAvatarState: (avatarState) =>
    set((state) => ({
      profile: {
        ...state.profile,
        gamification: { ...state.profile.gamification, avatar_state: avatarState },
      },
    })),

  updateCalories: (calories) =>
    set((state) => {
      const newCalories = state.profile.progress_stats.calories_consumed_today + calories;
      const dailyGoal = state.profile.preferences.daily_calorie_goal;

      return {
        profile: {
          ...state.profile,
          progress_stats: {
            ...state.profile.progress_stats,
            calories_consumed_today: newCalories,
          },
        },
      };
    }),

  checkAvatarExplosion: () => {
    const { profile } = get();
    const hasExploded =
      profile.progress_stats.calories_consumed_today >
      profile.preferences.daily_calorie_goal;

    if (hasExploded && profile.gamification.avatar_state !== "exploded") {
      set((state) => ({
        profile: {
          ...state.profile,
          gamification: {
            ...state.profile.gamification,
            avatar_state: "exploded",
          },
        },
      }));
    } else if (!hasExploded && profile.gamification.avatar_state === "exploded") {
      set((state) => ({
        profile: {
          ...state.profile,
          gamification: {
            ...state.profile.gamification,
            avatar_state: "healthy",
          },
        },
      }));
    }
  },

  addHealthCoins: (amount) =>
    set((state) => ({
      profile: {
        ...state.profile,
        gamification: {
          ...state.profile.gamification,
          health_coins: state.profile.gamification.health_coins + amount,
        },
      },
    })),

  addXP: (amount) =>
    set((state) => {
      const newXP = state.profile.gamification.xp + amount;
      const currentLevel = state.profile.gamification.level;
      const xpForNextLevel = currentLevel * 1000;

      let newLevel = currentLevel;
      let remainingXP = newXP;

      while (remainingXP >= xpForNextLevel) {
        remainingXP -= xpForNextLevel;
        newLevel++;
      }

      return {
        profile: {
          ...state.profile,
          gamification: {
            ...state.profile.gamification,
            xp: remainingXP,
            level: newLevel,
          },
        },
      };
    }),

  completeMeal: (recipe, usedSwaps) => {
    const { profile } = get();

    // Calculate health coins: (health_score / 10) + (total_savings * 2)
    const totalSavings = usedSwaps
      ? recipe.base_cost_per_serving - recipe.swap_cost_per_serving
      : 0;
    const coinsEarned = Math.floor(recipe.health_score / 10) + totalSavings * 2;

    // Update progress stats
    const newTotalSaved =
      profile.progress_stats.total_saved_dollars + totalSavings;
    const newMealsLogged = profile.progress_stats.meals_logged + 1;
    const newRecipesCompleted = profile.progress_stats.recipes_completed + 1;

    set((state) => ({
      profile: {
        ...state.profile,
        gamification: {
          ...state.profile.gamification,
          health_coins: state.profile.gamification.health_coins + coinsEarned,
        },
        progress_stats: {
          ...state.profile.progress_stats,
          total_saved_dollars: newTotalSaved,
          meals_logged: newMealsLogged,
          recipes_completed: newRecipesCompleted,
        },
      },
    }));
  },
}));

// ============================================
// Recipe Store
// ============================================
interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  favorites: string[];
  searchQuery: string;
  dietaryFilter: string[];
  setRecipes: (recipes: Recipe[]) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  toggleFavorite: (recipeId: string) => void;
  setSearchQuery: (query: string) => void;
  setDietaryFilter: (filters: string[]) => void;
  getFilteredRecipes: () => Recipe[];
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: mockRecipes,
  selectedRecipe: null,
  favorites: [],
  searchQuery: "",
  dietaryFilter: [],

  setRecipes: (recipes) => set({ recipes }),

  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

  toggleFavorite: (recipeId) =>
    set((state) => ({
      favorites: state.favorites.includes(recipeId)
        ? state.favorites.filter((id) => id !== recipeId)
        : [...state.favorites, recipeId],
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setDietaryFilter: (filters) => set({ dietaryFilter: filters }),

  getFilteredRecipes: () => {
    const { recipes, searchQuery, dietaryFilter } = get();
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesDietary =
        dietaryFilter.length === 0 ||
        dietaryFilter.some((filter) => recipe.tags.includes(filter));

      return matchesSearch && matchesDietary;
    });
  },
}));

// ============================================
// Planner Store
// ============================================
interface PlannerState {
  weeklyPlan: WeeklyPlan;
  shoppingList: ShoppingList;
  nearbyStores: StoreLocation[];
  selectedStore: StoreLocation | null;
  setWeeklyPlan: (plan: WeeklyPlan) => void;
  setShoppingList: (list: ShoppingList) => void;
  setNearbyStores: (stores: StoreLocation[]) => void;
  setSelectedStore: (store: StoreLocation | null) => void;
  toggleShoppingItem: (itemId: string) => void;
  addMealToPlan: (recipeId: string, date: string, mealType: string) => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
  weeklyPlan: mockWeeklyPlan,
  shoppingList: mockShoppingList,
  nearbyStores: mockStores,
  selectedStore: null,

  setWeeklyPlan: (plan) => set({ weeklyPlan: plan }),

  setShoppingList: (list) => set({ shoppingList: list }),

  setNearbyStores: (stores) => set({ nearbyStores: stores }),

  setSelectedStore: (store) => set({ selectedStore: store }),

  toggleShoppingItem: (itemId) =>
    set((state) => ({
      shoppingList: {
        ...state.shoppingList,
        items: state.shoppingList.items.map((item) =>
          item.ingredient_id === itemId
            ? { ...item, checked: !item.checked }
            : item,
        ),
      },
    })),

  addMealToPlan: (recipeId, date, mealType) =>
    set((state) => {
      const dayPlan = state.weeklyPlan.daily_plans.find(
        (plan) => plan.date === date,
      );

      if (dayPlan) {
        return {
          weeklyPlan: {
            ...state.weeklyPlan,
            daily_plans: state.weeklyPlan.daily_plans.map((plan) =>
              plan.date === date
                ? {
                    ...plan,
                    meals: [
                      ...plan.meals,
                      {
                        recipe_id: recipeId,
                        meal_type: mealType as any,
                        servings: 1,
                        completed: false,
                      },
                    ],
                  }
                : plan,
            ),
          },
        };
      }

      return state;
    }),
}));

// ============================================
// Shop Store
// ============================================
interface ShopState {
  avatarItems: AvatarItem[];
  challenges: SeasonalChallenge[];
  ownedItems: string[];
  equippedItems: {
    hat?: string;
    outfit?: string;
    aura?: string;
    accessory?: string;
  };
  setAvatarItems: (items: AvatarItem[]) => void;
  setChallenges: (challenges: SeasonalChallenge[]) => void;
  purchaseItem: (itemId: string) => void;
  equipItem: (itemId: string, type: string) => void;
  joinChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, taskId: string) => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  avatarItems: mockAvatarItems,
  challenges: mockSeasonalChallenges,
  ownedItems: ["hat_001", "outfit_001", "aura_001", "acc_001"],
  equippedItems: {
    hat: "hat_001",
    outfit: "outfit_001",
    aura: "aura_001",
    accessory: "acc_001",
  },

  setAvatarItems: (items) => set({ avatarItems: items }),

  setChallenges: (challenges) => set({ challenges }),

  purchaseItem: (itemId) =>
    set((state) => {
      const item = state.avatarItems.find((i) => i.id === itemId);
      if (!item) return state;

      // Deduct health coins
      useUserStore.getState().addHealthCoins(-item.price);

      return {
        ownedItems: [...state.ownedItems, itemId],
        avatarItems: state.avatarItems.map((i) =>
          i.id === itemId ? { ...i, is_owned: true } : i,
        ),
      };
    }),

  equipItem: (itemId, type) =>
    set((state) => ({
      equippedItems: {
        ...state.equippedItems,
        [type]: itemId,
      },
      avatarItems: state.avatarItems.map((item) => ({
        ...item,
        is_equipped: item.type === type ? item.id === itemId : item.is_equipped,
      })),
    })),

  joinChallenge: (challengeId) =>
    set((state) => ({
      challenges: state.challenges.map((c) =>
        c.id === challengeId ? { ...c, is_joined: true } : c,
      ),
    })),

  updateChallengeProgress: (challengeId, taskId) =>
    set((state) => ({
      challenges: state.challenges.map((challenge) => {
        if (challenge.id !== challengeId) return challenge;

        return {
          ...challenge,
          tasks: challenge.tasks.map((task) =>
            task.id === taskId
              ? { ...task, current: task.current + 1, is_completed: task.current + 1 >= task.target }
              : task,
          ),
        };
      }),
    })),
}));

// ============================================
// Social Store
// ============================================
interface SocialState {
  feedPosts: FeedPost[];
  leaderboard: LeaderboardEntry[];
  friends: string[];
  setFeedPosts: (posts: FeedPost[]) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  addPost: (post: FeedPost) => void;
  likePost: (postId: string) => void;
  highFivePost: (postId: string) => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  feedPosts: mockFeedPosts,
  leaderboard: mockLeaderboard,
  friends: [],

  setFeedPosts: (posts) => set({ feedPosts: posts }),

  setLeaderboard: (leaderboard) => set({ leaderboard }),

  addPost: (post) =>
    set((state) => ({ feedPosts: [post, ...state.feedPosts] })),

  likePost: (postId) =>
    set((state) => ({
      feedPosts: state.feedPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post,
      ),
    })),

  highFivePost: (postId) =>
    set((state) => ({
      feedPosts: state.feedPosts.map((post) =>
        post.id === postId
          ? { ...post, high_fives: post.high_fives + 1 }
          : post,
      ),
    })),
}));

// ============================================
// Navigation Store
// ============================================
interface NavigationState {
  currentTab: string;
  previousTab: string | null;
  setCurrentTab: (tab: string) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentTab: "discover",
  previousTab: null,

  setCurrentTab: (tab) =>
    set((state) => ({
      previousTab: state.currentTab,
      currentTab: tab,
    })),

  goBack: () =>
    set((state) => ({
      currentTab: state.previousTab || "discover",
      previousTab: null,
    })),
}));
