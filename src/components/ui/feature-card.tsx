import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  color?: "cyan" | "blue" | "purple";
  className?: string;
}

export function FeatureCard({ icon: Icon, label, color = "cyan", className }: FeatureCardProps) {
  const colorStyles = {
    cyan: "border-cyan-500/10 hover:border-cyan-500/30 text-cyan-400",
    blue: "border-blue-500/10 hover:border-blue-500/30 text-blue-400",
    purple: "border-purple-500/10 hover:border-purple-500/30 text-purple-400",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/40 backdrop-blur-sm border transition-all duration-300 group",
        colorStyles[color],
        className
      )}
    >
      <Icon className={cn("h-5 w-5 group-hover:scale-110 transition-transform")} />
      <span className="text-slate-300 text-sm font-medium">{label}</span>
    </div>
  );
}
