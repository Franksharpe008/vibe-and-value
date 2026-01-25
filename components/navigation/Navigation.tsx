// ============================================
// VIBE & VALUE - Bottom Navigation Component
// ============================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/lib/store";
import {
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

const navItems = [
  { id: "discover", label: "Discover", icon: HomeIcon, iconSolid: HomeIconSolid, href: "/discover" },
  { id: "planner", label: "Planner", icon: CalendarIcon, iconSolid: CalendarIconSolid, href: "/planner" },
  { id: "journey", label: "Journey", icon: ChartBarIcon, iconSolid: ChartBarIconSolid, href: "/journey" },
  { id: "shop", label: "Shop", icon: ShoppingBagIcon, iconSolid: ShoppingBagIconSolid, href: "/shop" },
  { id: "profile", label: "Profile", icon: UserIcon, iconSolid: UserIconSolid, href: "/profile" },
];

export function Navigation() {
  const pathname = usePathname();
  const setCurrentTab = useNavigationStore((state) => state.setCurrentTab);

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-earth-green-100 safe-area-bottom">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16 md:h-20">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = active ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setCurrentTab(item.id)}
                className={`
                  flex flex-col items-center justify-center
                  px-3 py-2 rounded-2xl transition-all duration-300
                  ${active ? "text-vibrant-orange-500" : "text-editorial-gray"}
                  hover:bg-earth-green-50
                  relative
                `}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7" />
                <span className="text-xs font-medium mt-1 hidden md:block">
                  {item.label}
                </span>
                {active && (
                  <span className="tab-indicator md:hidden" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safe area for iOS */}
      <style jsx>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </nav>
  );
}
