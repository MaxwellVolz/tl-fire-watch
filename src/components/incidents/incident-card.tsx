"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ViabilityBadge } from "./viability-badge";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, DollarSign, FileCheck } from "lucide-react";
import { formatCurrency, formatDate, formatDateRelative } from "@/lib/format";
import type { AggregatedAddress } from "@/lib/types";

export function IncidentCard({ address }: { address: AggregatedAddress }) {
  return (
    <Link href={`/address/${address.id}`}>
      <Card className="h-full hover:shadow-md hover:border-[var(--ring)]/30 cursor-pointer transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">
              {address.address}
            </CardTitle>
            <ViabilityBadge
              tier={address.viabilityTier}
              score={address.viabilityScore}
              showScore
            />
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            {address.propertyUse}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <Flame className="h-3.5 w-3.5 text-fire-400" />
              <span>
                {address.incidentCount} incident
                {address.incidentCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{formatCurrency(address.totalPropertyLoss)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDateRelative(address.latestIncidentDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <FileCheck className="h-3.5 w-3.5" />
              <span>
                {address.hasRepairPermits ? "Permits filed" : "No permits"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex gap-1.5 flex-wrap">
            {!address.hasRepairPermits && address.totalPropertyLoss > 0 && (
              <Badge variant="fire">Unremediated</Badge>
            )}
            {address.incidentCount > 1 && (
              <Badge variant="default">Repeat location</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
