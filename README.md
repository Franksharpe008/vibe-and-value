# Vibe & Value

> A gamified, editorial-grade meal planning app that intersects high-nutrition, low-cost groceries, and real-time physical progress tracking.

## 🎯 Core Value Proposition

**Vibe & Value** transforms healthy eating into an engaging game where users can:
- Discover nutritious recipes with smart budget-swap options
- Plan weekly meals within a customizable budget
- Track progress with a dynamic 3D avatar that reflects their health journey
- Compete with friends on leaderboards
- Earn rewards and customize their avatar

## ✨ Features

### 📱 Five Core Tabs

| Tab | Description |
|-----|-------------|
| **Discover** | Hero feed of recipes with Budget Swap™ logic - replace expensive ingredients with nutritious alternatives |
| **Planner** | Weekly calendar view, smart grocery list (aisle-sorted), and Google Maps store finder |
| **Journey** | Animated dashboard with 3D avatar, nutrient rings, progress charts, and level system |
| **Shop** | Avatar Boutique, seasonal challenges, and social leaderboard |
| **Profile** | Digital pantry manager, total savings stats, goals, and badge collection |

### 🎮 Gamification System

- **Health Coins**: Earned by completing meals and saving money
- **XP System**: Level up by logging meals and maintaining streaks
- **Avatar States**: Healthy, Thriving, Struggling, or Exploded based on calorie goals
- **Seasonal Challenges**: Spring Renew, Summer Glow with exclusive rewards
- **Leaderboard**: Compete with friends based on Health Points (savings + nutrition + consistency)

### 💡 Budget Swap™ Logic

Each recipe includes smart swap options that replace high-cost ingredients with low-cost, high-nutrition alternatives:

```
Fresh Avocado ($2.00) → Frozen Edamame ($0.50) = Save $1.50
Quinoa ($1.50) → Brown Rice ($0.25) = Save $1.25
Wild Salmon ($8.00) → Canned Sardines ($2.50) = Save $5.50
```

**Health Coins Formula**: `(health_score / 10) + (total_savings * 2)`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A modern web browser

### Installation

```bash
# Navigate to the project directory
cd ~/.gemini/antigravity/scratch/vibe-and-value

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
vibe-and-value/
├── app/                      # Next.js App Router
│   ├── discover/            # Discover tab (recipes)
│   ├── planner/             # Planner tab (calendar, shopping)
│   ├── journey/             # Journey tab (avatar, progress)
│   ├── shop/                # Shop tab (boutique, challenges)
│   ├── profile/             # Profile tab (pantry, settings)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── navigation/          # Bottom navigation
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript definitions
│   ├── data/                # Mock data
│   └── utils/               # Utility functions (avatar engine)
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Earth Green | `#7a9664` | Primary actions, success states |
| Vibrant Orange | `#f5530d` | CTAs, warnings, energy |
| Soft Cream | `#faf9f5` | Background |
| Editorial Black | `#1a1a1a` | Primary text |

### Typography

- **Headers**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Numbers**: SF Pro / Inter

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for API keys:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Google Maps Integration

To enable store location features:
1. Get a Google Maps JavaScript API key
2. Enable Maps JavaScript API and Places API
3. Add to `.env.local`

## 📊 Data Schemas

### User Profile
```typescript
{
  id: string;
  name: string;
  preferences: {
    dietary_restrictions: string[];
    weekly_budget_limit: number;
    daily_calorie_goal: number;
  };
  gamification: {
    level: number;
    health_coins: number;
    streak_days: number;
    avatar_state: "healthy" | "exploded" | "thriving" | "struggling";
    current_gear: { hat?: string; outfit?: string; aura?: string; };
  };
  progress_stats: {
    total_saved_dollars: number;
    total_weight_lost: number;
    calories_consumed_today: number;
  };
}
```

### Recipe
```typescript
{
  id: string;
  title: string;
  base_cost_per_serving: number;
  swap_cost_per_serving: number;
  health_score: number;
  ingredients: Array<{
    item: string;
    price: number;
    swap_option?: {
      item: string;
      price: number;
      savings: number;
    };
  }>;
}
```

## 🎯 Key Algorithms

### Avatar Explosion Logic
```typescript
if (calories_consumed_today > daily_calorie_goal) {
  avatar_state = "exploded";
} else if (streak_days >= 7) {
  avatar_state = "thriving";
} else {
  avatar_state = "healthy";
}
```

### Health Points Calculation
```typescript
savingsPoints = totalSaved * 10
recipePoints = recipesCompleted * 50
streakMultiplier = 1 + streakDays * 0.1
superfoodBonus = superfoodCount * 15

healthPoints = (savingsPoints + recipePoints + superfoodBonus) * streakMultiplier
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| UI Components | Custom + [Heroicons](https://heroicons.com/) |
| 3D Graphics | [Three.js](https://threejs.org/) + React Three Fiber |
| Charts | [Recharts](https://recharts.org/) |
| Maps | Google Maps API |
| Date Utils | [date-fns](https://date-fns.org/) |

## 📱 Responsive Design

- Mobile-first approach (375px+)
- Tablet optimization (768px+)
- Desktop enhancements (1024px+)

## 🚧 Roadmap

- [ ] Authentication (Google/Apple OAuth)
- [ ] Real database integration (Supabase/Firebase)
- [ ] Real 3D avatar rendering with Three.js
- [ ] Push notifications for meal reminders
- [ ] Social features (friends, challenges)
- [ ] Recipe sharing and user-generated content
- [ ] Nutrition API integration
- [ ] Grocery store inventory API integration
- [ ] Progressive Web App (PWA) support
- [ ] iOS and Android native apps

## 📝 License

MIT

## 👥 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
