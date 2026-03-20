"use client";

import { Badge } from "@/components/ui/badge";
import type { ViabilityTier } from "@/lib/types";

const tierLabels: Record<ViabilityTier, string> = {
  high: "High Viability",
  medium: "Medium Viability",
  low: "Low Viability",
};

export function ViabilityBadge({
  tier,
  score,
  showScore = false,
}: {
  tier: ViabilityTier;
  score: number;
  showScore?: boolean;
}) {
  return (
    <Badge variant={tier}>
      {tierLabels[tier]}
      {showScore && ` (${score})`}
    </Badge>
  );
}
