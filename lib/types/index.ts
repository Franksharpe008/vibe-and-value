// ============================================
// VIBE & VALUE - Complete Type Definitions
// ============================================

// User & Avatar Schema
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  preferences: UserPreferences;
  gamification: GamificationData;
  progress_stats: ProgressStats;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  dietary_restrictions: DietaryRestriction[];
  weekly_budget_limit: number;
  daily_calorie_goal: number;
  target_weight?: number;
  current_weight?: number;
  notifications_enabled: boolean;
}

export type DietaryRestriction =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "paleo"
  | "low-sodium"
  | "nut-free";

export interface GamificationData {
  level: number;
  health_coins: number;
  xp: number;
  streak_days: number;
  avatar_state: AvatarState;
  current_gear: AvatarGear;
  badges: Badge[];
  challenges: ActiveChallenge[];
}

export type AvatarState = "healthy" | "exploded" | "thriving" | "struggling";

export interface AvatarGear {
  hat?: string;
  outfit?: string;
  aura?: string;
  accessory?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  earned_at: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface ActiveChallenge {
  challenge_id: string;
  progress: number;
  target: number;
  started_at: string;
  ends_at: string;
}

export interface ProgressStats {
  total_saved_dollars: number;
  total_weight_lost: number;
  calories_consumed_today: number;
  meals_logged: number;
  recipes_completed: number;
  superfood_count: number;
}

// Recipe & Budget-Swap Schema
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  base_cost_per_serving: number;
  swap_cost_per_serving: number;
  prep_time_mins: number;
  cook_time_mins?: number;
  calories: number;
  health_score: number;
  difficulty: "easy" | "medium" | "hard";
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  nutrition_per_serving: NutritionInfo;
  is_superfood_meal: boolean;
  created_at: string;
}

export interface Ingredient {
  id: string;
  item: string;
  amount: string;
  price: number;
  is_superfood: boolean;
  category: IngredientCategory;
  swap_option?: SwapOption;
}

export type IngredientCategory =
  | "protein"
  | "vegetables"
  | "grains"
  | "fruits"
  | "dairy"
  | "pantry"
  | "herbs";

export interface SwapOption {
  item: string;
  price: number;
  savings: number;
  health_benefit: string;
  is_budget_friendly: boolean;
}

export interface NutritionInfo {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  vitamins: string[];
}

// Store & Location Schema
export interface StoreLocation {
  store_id: string;
  name: string;
  address: string;
  distance_miles: number;
  inventory_match_percentage: number;
  estimated_cart_total: number;
  coordinates: Coordinates;
  navigation_link: string;
  phone?: string;
  hours?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Social & Leaderboard Schema
export interface SocialFeed {
  posts: FeedPost[];
  leaderboard: LeaderboardEntry[];
  friends: FriendProfile[];
}

export interface FeedPost {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  content: string;
  image_url?: string;
  recipe_id?: string;
  likes: number;
  comments: number;
  high_fives: number;
  created_at: string;
  is_achievement: boolean;
  achievement_type?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url: string;
  health_points: number;
  level: number;
  weekly_savings: number;
  streak_days: number;
}

export interface FriendProfile {
  user_id: string;
  username: string;
  avatar_url: string;
  level: number;
  is_online: boolean;
  last_active: string;
  mutual_friends: number;
}

// Weekly Planner Schema
export interface WeeklyPlan {
  week_start: string;
  daily_plans: DailyPlan[];
  total_budget_used: number;
  total_calories: number;
}

export interface DailyPlan {
  date: string;
  meals: PlannedMeal[];
  budget_used: number;
  calories: number;
  water_intake_oz: number;
  exercises_completed: number;
}

export interface PlannedMeal {
  recipe_id: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  completed: boolean;
  logged_at?: string;
}

// Shopping List Schema
export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  total_estimated_cost: number;
  store_id?: string;
  created_at: string;
  is_completed: boolean;
}

export interface ShoppingItem {
  ingredient_id: string;
  item: string;
  amount: string;
  estimated_price: number;
  category: IngredientCategory;
  aisle?: string;
  checked: boolean;
  notes?: string;
}

// Avatar Shop Schema
export interface AvatarItem {
  id: string;
  name: string;
  type: "hat" | "outfit" | "aura" | "accessory";
  price: number;
  currency: "health_coins" | "premium";
  rarity: "common" | "rare" | "epic" | "legendary";
  preview_url: string;
  description: string;
  is_equipped: boolean;
  is_owned: boolean;
  level_requirement: number;
}

export interface SeasonalChallenge {
  id: string;
  name: string;
  description: string;
  season: "spring" | "summer" | "fall" | "winter";
  start_date: string;
  end_date: string;
  tasks: ChallengeTask[];
  rewards: ChallengeReward[];
  participants: number;
  is_joined: boolean;
  progress: number;
}

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  points: number;
  is_completed: boolean;
}

export interface ChallengeReward {
  id: string;
  type: "health_coins" | "xp" | "avatar_item" | "badge";
  amount?: number;
  item_id?: string;
  badge_id?: string;
  claimed: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// Navigation Types
export type TabRoute =
  | "discover"
  | "planner"
  | "journey"
  | "shop"
  | "profile"
  | "onboarding";

export interface NavigationState {
  currentTab: TabRoute;
  previousTab?: TabRoute;
  params?: Record<string, unknown>;
}
