// ============================================
// VIBE & VALUE - Shop Tab (Avatar Boutique & Social)
// Avatar Shop, Seasonal Challenges, Trophy Room, Leaderboard
// ============================================

"use client";

import { useState } from "react";
import { useShopStore, useSocialStore, useUserStore } from "@/lib/store";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  TrendingUpIcon,
  CheckIcon,
  LockIcon,
} from "@heroicons/react/24/outline";

export default function ShopPage() {
  const { avatarItems, challenges, ownedItems, equippedItems, purchaseItem, equipItem, joinChallenge } = useShopStore();
  const { leaderboard, feedPosts, likePost, highFivePost } = useSocialStore();
  const { profile } = useUserStore();
  const [activeTab, setActiveTab] = useState<"shop" | "challenges" | "social">("shop");

  const healthCoins = profile.gamification.health_coins;

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <header className="pt-safe pt-6 pb-4 px-4 bg-white sticky top-0 z-10 border-b border-earth-green-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-editorial-black">
                Shop & Social
              </h1>
              <p className="text-editorial-gray mt-1">
                Customize your avatar & compete with friends
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-vibrant-orange-100 rounded-2xl">
              <SparklesIcon className="w-5 h-5 text-vibrant-orange-500" />
              <span className="font-bold text-vibrant-orange-600">{healthCoins}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-[73px] z-10 bg-white/90 backdrop-blur-lg border-b border-earth-green-100">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex gap-2">
            {[
              { id: "shop" as const, label: "Avatar Shop", icon: <SparklesIcon className="w-4 h-4" /> },
              { id: "challenges" as const, label: "Challenges", icon: <TrophyIcon className="w-4 h-4" /> },
              { id: "social" as const, label: "Leaderboard", icon: <UsersIcon className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium transition-all
                  ${activeTab === tab.id
                    ? "text-vibrant-orange-500 border-b-2 border-vibrant-orange-500"
                    : "text-editorial-gray hover:text-editorial-black"
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Avatar Shop Tab */}
        {activeTab === "shop" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Avatar Boutique</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-vibrant-orange-500 text-white rounded-2xl">
                <SparklesIcon className="w-5 h-5" />
                <span className="font-bold">{healthCoins} Coins</span>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["all", "hat", "outfit", "aura", "accessory"].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white rounded-full font-medium capitalize hover:bg-earth-green-50 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {avatarItems.map((item) => {
                const isOwned = ownedItems.includes(item.id);
                const isEquipped = equippedItems[item.type as keyof typeof equippedItems] === item.id;
                const canAfford = healthCoins >= item.price;

                return (
                  <Card
                    key={item.id}
                    padding="md"
                    className={`text-center ${isEquipped ? "ring-2 ring-vibrant-orange-500" : ""}`}
                  >
                    <div className="aspect-square bg-earth-green-50 rounded-2xl mb-3 flex items-center justify-center text-6xl">
                      👑
                    </div>
                    <h3 className="font-semibold text-editorial-black mb-1">{item.name}</h3>
                    <p className="text-xs text-editorial-gray mb-3 capitalize">{item.type}</p>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          item.rarity === "legendary"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.rarity === "epic"
                              ? "bg-purple-100 text-purple-700"
                              : item.rarity === "rare"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.rarity}
                      </span>
                    </div>
                    {isEquipped ? (
                      <div className="flex items-center justify-center gap-1 text-earth-green-600 font-medium">
                        <CheckIcon className="w-4 h-4" />
                        Equipped
                      </div>
                    ) : isOwned ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => equipItem(item.id, item.type)}
                      >
                        Equip
                      </Button>
                    ) : (
                      <Button
                        variant={canAfford ? "primary" : "ghost"}
                        size="sm"
                        className="w-full"
                        disabled={!canAfford}
                        onClick={() => purchaseItem(item.id)}
                      >
                        {canAfford ? (
                          <>
                            <SparklesIcon className="w-4 h-4 mr-1" />
                            {item.price}
                          </>
                        ) : (
                          <>
                            <LockIcon className="w-4 h-4 mr-1" />
                            {item.price}
                          </>
                        )}
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Seasonal Challenges</h2>

            {challenges.map((challenge) => (
              <Card key={challenge.id} padding="lg">
                <div className={`p-6 rounded-2xl mb-4 gradient-seasonal-${challenge.season}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-editorial-black mb-2">
                        {challenge.name}
                      </h3>
                      <p className="text-editorial-gray">{challenge.description}</p>
                    </div>
                    <div className="text-6xl">{challenge.season === "spring" ? "🌸" : "☀️"}</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-editorial-gray">
                      {challenge.progress} / {challenge.tasks.reduce((acc, t) => acc + t.target, 0)}
                    </span>
                  </div>
                  <div className="h-3 bg-earth-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-vibrant-orange-500 transition-all"
                      style={{
                        width: `${(challenge.progress / challenge.tasks.reduce((acc, t) => acc + t.target, 0)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3 mb-6">
                  {challenge.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border-2 ${
                        task.is_completed
                          ? "bg-earth-green-50 border-earth-green-400"
                          : "bg-white border-earth-green-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold ${task.is_completed ? "line-through text-editorial-gray" : "text-editorial-black"}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-editorial-gray">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-vibrant-orange-500">
                            +{task.points} XP
                          </span>
                          <div className="text-xs text-editorial-gray mt-1">
                            {task.current} / {task.target}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rewards */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Rewards</h4>
                  <div className="flex gap-3">
                    {challenge.rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="flex-1 p-3 bg-earth-green-50 rounded-2xl text-center"
                      >
                        <div className="text-2xl mb-1">
                          {reward.type === "health_coins" && "💰"}
                          {reward.type === "avatar_item" && "👑"}
                          {reward.type === "badge" && "🏅"}
                        </div>
                        <p className="text-sm font-medium text-editorial-black">
                          {reward.type === "health_coins" && `${reward.amount} Coins`}
                          {reward.type === "avatar_item" && "Avatar Item"}
                          {reward.type === "badge" && "Badge"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join/Participate Button */}
                {challenge.is_joined ? (
                  <div className="p-4 bg-vibrant-orange-50 rounded-2xl border-2 border-vibrant-orange-200 text-center">
                    <p className="text-vibrant-orange-700 font-medium">
                      ✓ You're participating in this challenge!
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="primary-green"
                    size="lg"
                    className="w-full"
                    onClick={() => joinChallenge(challenge.id)}
                  >
                    Join Challenge
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Vibe & Value Leaderboard</h2>

            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <Card
                  key={entry.user_id}
                  padding="md"
                  className={`
                    text-center ${index === 0
                      ? "md:col-start-2 bg-gradient-to-b from-yellow-50 to-white ring-2 ring-yellow-400"
                      : ""}
                  `}
                >
                  {index === 0 && <div className="text-3xl mb-2">👑</div>}
                  {index === 1 && <div className="text-3xl mb-2">🥈</div>}
                  {index === 2 && <div className="text-3xl mb-2">🥉</div>}
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-earth-green-100 flex items-center justify-center text-3xl">
                    {entry.username.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-editorial-black">{entry.username}</h3>
                  <p className="text-2xl font-bold text-vibrant-orange-500 mt-1">
                    {entry.health_points.toLocaleString()}
                  </p>
                  <p className="text-xs text-editorial-gray">Health Points</p>
                </Card>
              ))}
            </div>

            {/* Full Leaderboard */}
            <Card padding="lg">
              <h3 className="font-display font-semibold mb-4">Full Rankings</h3>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.user_id}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl
                      ${entry.user_id === profile.id ? "bg-vibrant-orange-50 ring-2 ring-vibrant-orange-400" : "bg-white"}
                    `}
                  >
                    <span className="text-lg font-bold text-editorial-gray w-8">
                      #{entry.rank}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-earth-green-100 flex items-center justify-center text-xl">
                      {entry.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-editorial-black">{entry.username}</h4>
                      <p className="text-sm text-editorial-gray">Level {entry.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-vibrant-orange-500">
                        {entry.health_points.toLocaleString()}
                      </p>
                      <p className="text-xs text-editorial-gray">HP</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Feed Preview */}
            <Card padding="lg">
              <h3 className="font-display font-semibold mb-4">Community Activity</h3>
              <div className="space-y-4">
                {feedPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-4 bg-white rounded-2xl border border-earth-green-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-earth-green-100 flex items-center justify-center">
                        {post.username.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-editorial-black">{post.username}</span>
                          <span className="text-xs text-editorial-gray">{post.created_at}</span>
                        </div>
                        <p className="text-sm text-editorial-gray">{post.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button
                            onClick={() => likePost(post.id)}
                            className="text-sm text-editorial-gray hover:text-vibrant-orange-500 flex items-center gap-1"
                          >
                            ❤️ {post.likes}
                          </button>
                          <button
                            onClick={() => highFivePost(post.id)}
                            className="text-sm text-editorial-gray hover:text-vibrant-orange-500 flex items-center gap-1"
                          >
                            🙌 {post.high_fives}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
