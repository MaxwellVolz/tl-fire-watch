"use client";

import { Building2, Flame, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { IncidentStats } from "@/lib/types";

export function IncidentStatsBar({ stats }: { stats: IncidentStats }) {
  const items = [
    {
      icon: Building2,
      label: "Addresses",
      value: stats.totalAddresses.toString(),
    },
    {
      icon: Flame,
      label: "Incidents",
      value: stats.totalIncidents.toString(),
    },
    {
      icon: DollarSign,
      label: "Total Losses",
      value: formatCurrency(stats.totalPropertyLoss + stats.totalContentsLoss),
    },
    {
      icon: TrendingUp,
      label: "High Viability",
      value: stats.highViabilityCount.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]">
            <item.icon className="h-5 w-5 text-[var(--accent-foreground)]" />
          </div>
          <div>
            <div className="text-lg font-bold">{item.value}</div>
            <div className="text-xs text-[var(--muted-foreground)]">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
