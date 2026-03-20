"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DATE_RANGE_OPTIONS,
  SORT_OPTIONS,
  VIABILITY_OPTIONS,
} from "@/lib/constants";
import type { FilterState, SortField, ViabilityFilter, DateRange } from "@/lib/types";

interface IncidentFiltersProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
}

export function IncidentFilters({
  filters,
  updateFilter,
  resetFilters,
}: IncidentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input
          placeholder="Search addresses..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <select
        value={filters.viability}
        onChange={(e) =>
          updateFilter("viability", e.target.value as ViabilityFilter)
        }
        className="h-11 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {VIABILITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) =>
          updateFilter("dateRange", e.target.value as DateRange)
        }
        className="h-11 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {DATE_RANGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sortField}
        onChange={(e) =>
          updateFilter("sortField", e.target.value as SortField)
        }
        className="h-11 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          updateFilter(
            "sortDirection",
            filters.sortDirection === "desc" ? "asc" : "desc"
          )
        }
        className="shrink-0"
      >
        {filters.sortDirection === "desc" ? "Desc" : "Asc"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFilters}
        className="shrink-0"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
}
