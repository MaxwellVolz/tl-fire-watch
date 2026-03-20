"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
  AggregatedAddress,
  FilterState,
  IncidentStats,
  SortField,
  SortDirection,
  ViabilityFilter,
  DateRange,
} from "@/lib/types";

const DEFAULT_FILTERS: FilterState = {
  viability: "all",
  minPropertyLoss: 0,
  dateRange: "3y",
  search: "",
  sortField: "viabilityScore",
  sortDirection: "desc",
};

export function useFireIncidents() {
  const [allAddresses, setAllAddresses] = useState<AggregatedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/fire-incidents");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setAllAddresses(data.addresses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredAddresses = useMemo(() => {
    let result = [...allAddresses];

    // Filter by viability
    if (filters.viability !== "all") {
      result = result.filter((a) => a.viabilityTier === filters.viability);
    }

    // Filter by min property loss
    if (filters.minPropertyLoss > 0) {
      result = result.filter(
        (a) => a.totalPropertyLoss >= filters.minPropertyLoss
      );
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();
      switch (filters.dateRange) {
        case "6m":
          cutoff.setMonth(now.getMonth() - 6);
          break;
        case "1y":
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
        case "2y":
          cutoff.setFullYear(now.getFullYear() - 2);
          break;
        case "3y":
          cutoff.setFullYear(now.getFullYear() - 3);
          break;
      }
      result = result.filter(
        (a) => new Date(a.latestIncidentDate) >= cutoff
      );
    }

    // Filter by search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.address.toLowerCase().includes(q) ||
          a.propertyUse.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortField) {
        case "viabilityScore":
          cmp = a.viabilityScore - b.viabilityScore;
          break;
        case "totalPropertyLoss":
          cmp = a.totalPropertyLoss - b.totalPropertyLoss;
          break;
        case "latestIncidentDate":
          cmp =
            new Date(a.latestIncidentDate).getTime() -
            new Date(b.latestIncidentDate).getTime();
          break;
        case "incidentCount":
          cmp = a.incidentCount - b.incidentCount;
          break;
      }
      return filters.sortDirection === "desc" ? -cmp : cmp;
    });

    return result;
  }, [allAddresses, filters]);

  const stats: IncidentStats = useMemo(() => {
    return {
      totalAddresses: filteredAddresses.length,
      totalIncidents: filteredAddresses.reduce(
        (sum, a) => sum + a.incidentCount,
        0
      ),
      totalPropertyLoss: filteredAddresses.reduce(
        (sum, a) => sum + a.totalPropertyLoss,
        0
      ),
      totalContentsLoss: filteredAddresses.reduce(
        (sum, a) => sum + a.totalContentsLoss,
        0
      ),
      highViabilityCount: filteredAddresses.filter(
        (a) => a.viabilityTier === "high"
      ).length,
      mediumViabilityCount: filteredAddresses.filter(
        (a) => a.viabilityTier === "medium"
      ).length,
      lowViabilityCount: filteredAddresses.filter(
        (a) => a.viabilityTier === "low"
      ).length,
    };
  }, [filteredAddresses]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    addresses: filteredAddresses,
    allAddresses,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    stats,
  };
}
