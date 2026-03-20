"use client";

import { useState } from "react";
import { useFireIncidents } from "@/hooks/use-fire-incidents";
import { IncidentStatsBar } from "@/components/incidents/incident-stats";
import { IncidentFilters } from "@/components/incidents/incident-filters";
import { IncidentList } from "@/components/incidents/incident-list";
import { AddressSelectList } from "@/components/incidents/address-select-list";
import { AlertTriangle, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const {
    addresses,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    stats,
  } = useFireIncidents();

  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            Tenderloin Fire Damage
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Fire-damaged addresses in SF&apos;s Tenderloin with restoration viability scoring.
            Data sourced from SF OpenData.
          </p>
        </div>
        <div className="flex shrink-0 rounded-lg border border-[var(--border)] overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
              view === "list"
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            <List className="h-4 w-4" />
            Select
          </button>
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
              view === "grid"
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <div className="font-medium">Failed to load data</div>
            <div className="text-sm">{error}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      <IncidentStatsBar stats={stats} />

      <IncidentFilters
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />

      {view === "grid" ? (
        <IncidentList addresses={addresses} isLoading={isLoading} />
      ) : (
        isLoading ? (
          <IncidentList addresses={[]} isLoading={true} />
        ) : (
          <AddressSelectList addresses={addresses} />
        )
      )}
    </div>
  );
}
