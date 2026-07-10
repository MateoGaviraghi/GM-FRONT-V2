/**
 * Skeleton — Soft SaaS (4R3). Bloque rounded-lg gray-100 con animate-pulse.
 * Reduced-motion: la regla global en globals.css ya fuerza animation-duration:0.01ms.
 */

import { cn } from "@/lib/utils";

export type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-gray-100", className)} />;
}
