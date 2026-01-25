// ============================================
// VIBE & VALUE - Card Components
// ============================================

import { HTMLAttributes } from "react";

interface BaseCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: BaseCardProps) {
  const variants = {
    default: "editorial-card",
    hover: "editorial-card-hover",
    glass: "glass rounded-3xl",
    gradient: "bg-gradient-progress text-white rounded-3xl",
  };

  return (
    <div
      className={`${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "earth",
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: "earth" | "orange" | "blue" | "purple";
}) {
  const colors = {
    earth: "bg-earth-green-50 text-earth-green-600",
    orange: "bg-vibrant-orange-50 text-vibrant-orange-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card variant="hover" padding="md" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-editorial-gray">{label}</span>
        {icon && <span className={`p-2 rounded-xl ${colors[color]}`}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-display font-bold text-editorial-black">
          {value}
        </span>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.positive ? "text-earth-green-600" : "text-vibrant-orange-500"
            }`}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
}

export function ProgressCard({
  title,
  current,
  target,
  color = "earth-green",
  size = "md",
}: {
  title: string;
  current: number;
  target: number;
  color?: "earth-green" | "vibrant-orange" | "blue";
  size?: "sm" | "md" | "lg";
}) {
  const percentage = Math.min((current / target) * 100, 100);
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const colors = {
    "earth-green": "bg-earth-green-500",
    "vibrant-orange": "bg-vibrant-orange-500",
    blue: "bg-blue-500",
  };

  return (
    <Card padding="sm" className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-editorial-black">{title}</span>
        <span className="text-sm text-editorial-gray">
          {current} / {target}
        </span>
      </div>
      <div className={`w-full bg-earth-green-100 rounded-full ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
}
