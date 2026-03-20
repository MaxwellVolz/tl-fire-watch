"use client";

import { IncidentCard } from "./incident-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AggregatedAddress } from "@/lib/types";

export function IncidentList({
  addresses,
  isLoading,
}: {
  addresses: AggregatedAddress[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-[var(--border)] p-6">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-3 w-28" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-lg font-medium">No addresses found</div>
        <div className="text-sm text-[var(--muted-foreground)]">
          Try adjusting your filters or search query.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {addresses.map((address) => (
        <IncidentCard key={address.id} address={address} />
      ))}
    </div>
  );
}
