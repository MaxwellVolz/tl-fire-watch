import type { AggregatedAddress, ViabilityTier } from "./types";

export function computeViabilityScore(
  address: Omit<AggregatedAddress, "viabilityScore" | "viabilityTier">
): { score: number; tier: ViabilityTier } {
  let score = 0;

  // Property loss (0-30 pts): linear scale, caps at $50k
  const propLoss = Math.min(address.totalPropertyLoss, 50_000);
  score += Math.round((propLoss / 50_000) * 30);

  // Recency (0-25 pts)
  const latestDate = new Date(address.latestIncidentDate);
  const now = new Date();
  const monthsAgo =
    (now.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsAgo < 6) score += 25;
  else if (monthsAgo < 12) score += 20;
  else if (monthsAgo < 24) score += 10;
  else if (monthsAgo < 36) score += 5;

  // No repair permits (0-20 pts)
  if (!address.hasRepairPermits) score += 20;

  // Property use (0-15 pts)
  const use = (address.propertyUse || "").toLowerCase();
  if (
    use.includes("commercial") ||
    use.includes("mercantile") ||
    use.includes("business") ||
    use.includes("mixed") ||
    use.includes("office") ||
    use.includes("store") ||
    use.includes("hotel") ||
    use.includes("motel")
  ) {
    score += 15;
  } else if (
    use.includes("residential") ||
    use.includes("apartment") ||
    use.includes("dwelling")
  ) {
    score += 10;
  } else {
    score += 8;
  }

  // Contents loss (0-10 pts): linear scale, caps at $25k
  const contentsLoss = Math.min(address.totalContentsLoss, 25_000);
  score += Math.round((contentsLoss / 25_000) * 10);

  const tier: ViabilityTier =
    score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  return { score, tier };
}
