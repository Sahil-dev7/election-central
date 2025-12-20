import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "gold" | "success";
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const variants = {
    default: "bg-card border-border",
    primary: "bg-gradient-to-br from-election-navy to-election-blue text-white border-transparent",
    gold: "bg-gradient-to-br from-election-gold to-amber-500 text-foreground border-transparent",
    success: "bg-gradient-to-br from-success to-emerald-600 text-white border-transparent",
  };

  const iconVariants = {
    default: "bg-secondary text-election-blue",
    primary: "bg-white/20 text-white",
    gold: "bg-black/10 text-foreground",
    success: "bg-white/20 text-white",
  };

  const isLight = variant === "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 shadow-lg",
        variants[variant]
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
        <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
      </div>

      <div className="relative flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium mb-1",
            isLight ? "text-muted-foreground" : "text-white/80"
          )}>
            {title}
          </p>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold tracking-tight"
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </motion.p>
          {subtitle && (
            <p className={cn(
              "text-sm mt-1",
              isLight ? "text-muted-foreground" : "text-white/70"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className={cn(
                "text-xs",
                isLight ? "text-muted-foreground" : "text-white/60"
              )}>
                from last hour
              </span>
            </div>
          )}
        </div>

        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconVariants[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
