"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentDetail } from "@/components/incidents/incident-detail";
import { Skeleton } from "@/components/ui/skeleton";
import type { AggregatedAddress } from "@/lib/types";

export default function AddressDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [address, setAddress] = useState<AggregatedAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/fire-incidents");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        const found = data.addresses.find(
          (a: AggregatedAddress) => a.id === id
        );
        if (!found) {
          setError("Address not found");
        } else {
          setAddress(found);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to all addresses
        </Button>
      </Link>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-5 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      )}

      {error && (
        <div className="py-16 text-center">
          <div className="text-lg font-medium">{error}</div>
          <Link href="/">
            <Button variant="link" className="mt-2">
              Return to dashboard
            </Button>
          </Link>
        </div>
      )}

      {address && <IncidentDetail address={address} />}
    </div>
  );
}
