"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViabilityBadge } from "./viability-badge";
import {
  Flame,
  Calendar,
  DollarSign,
  FileCheck,
  AlertTriangle,
  Users,
  Building2,
  MapPin,
} from "lucide-react";
import { formatCurrencyFull, formatDate } from "@/lib/format";
import type { AggregatedAddress } from "@/lib/types";

export function IncidentDetail({
  address,
}: {
  address: AggregatedAddress;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{address.address}</h1>
          <ViabilityBadge
            tier={address.viabilityTier}
            score={address.viabilityScore}
            showScore
          />
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {address.propertyUse}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Tenderloin, San Francisco
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-fire-400" />
            <div>
              <div className="text-lg font-bold">
                {formatCurrencyFull(address.totalPropertyLoss)}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Property Loss
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-amber-500" />
            <div>
              <div className="text-lg font-bold">
                {formatCurrencyFull(address.totalContentsLoss)}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Contents Loss
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Flame className="h-8 w-8 text-fire-400" />
            <div>
              <div className="text-lg font-bold">{address.incidentCount}</div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Fire Incidents
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileCheck className="h-8 w-8 text-[var(--muted-foreground)]" />
            <div>
              <div className="text-lg font-bold">
                {address.hasRepairPermits ? "Yes" : "No"}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Repair Permits
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viability Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Viability Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ScoreRow
              label="Property Loss"
              max={30}
              value={Math.min(Math.round((Math.min(address.totalPropertyLoss, 50000) / 50000) * 30), 30)}
            />
            <ScoreRow
              label="Recency"
              max={25}
              value={getRecencyScore(address.latestIncidentDate)}
            />
            <ScoreRow
              label="No Repair Permits"
              max={20}
              value={address.hasRepairPermits ? 0 : 20}
            />
            <ScoreRow
              label="Property Use"
              max={15}
              value={getPropertyUseScore(address.propertyUse)}
            />
            <ScoreRow
              label="Contents Loss"
              max={10}
              value={Math.min(Math.round((Math.min(address.totalContentsLoss, 25000) / 25000) * 10), 10)}
            />
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 font-bold">
              <span>Total</span>
              <span>{address.viabilityScore} / 100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Incident Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {address.incidents
              .sort(
                (a, b) =>
                  new Date(b.incident_date).getTime() -
                  new Date(a.incident_date).getTime()
              )
              .map((incident, i) => (
                <div
                  key={incident.incident_number || i}
                  className="flex gap-4 rounded-lg border border-[var(--border)] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fire-100 dark:bg-fire-900/30">
                    <Flame className="h-5 w-5 text-fire-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {formatDate(incident.incident_date)}
                      </span>
                      {incident.primary_situation && (
                        <Badge variant="default">
                          {incident.primary_situation}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-[var(--muted-foreground)]">
                      {parseFloat(incident.estimated_property_loss) > 0 && (
                        <span>
                          Property: {formatCurrencyFull(parseFloat(incident.estimated_property_loss))}
                        </span>
                      )}
                      {parseFloat(incident.estimated_contents_loss) > 0 && (
                        <span>
                          Contents: {formatCurrencyFull(parseFloat(incident.estimated_contents_loss))}
                        </span>
                      )}
                      {incident.action_taken_primary && (
                        <span>Action: {incident.action_taken_primary}</span>
                      )}
                      {incident.area_of_fire_origin && (
                        <span>Origin: {incident.area_of_fire_origin}</span>
                      )}
                    </div>
                    {(parseInt(incident.fire_injuries) > 0 ||
                      parseInt(incident.civilian_injuries) > 0 ||
                      parseInt(incident.fire_fatalities) > 0 ||
                      parseInt(incident.civilian_fatalities) > 0) && (
                      <div className="flex items-center gap-1 text-sm text-red-500">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>
                          {parseInt(incident.fire_injuries || "0") +
                            parseInt(incident.civilian_injuries || "0")}{" "}
                          injuries,{" "}
                          {parseInt(incident.fire_fatalities || "0") +
                            parseInt(incident.civilian_fatalities || "0")}{" "}
                          fatalities
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScoreRow({
  label,
  max,
  value,
}: {
  label: string;
  max: number;
  value: number;
}) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">
          {value} / {max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--muted)]">
        <div
          className="h-2 rounded-full bg-primary-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function getRecencyScore(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const monthsAgo =
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsAgo < 6) return 25;
  if (monthsAgo < 12) return 20;
  if (monthsAgo < 24) return 10;
  if (monthsAgo < 36) return 5;
  return 0;
}

function getPropertyUseScore(use: string): number {
  const lower = (use || "").toLowerCase();
  if (
    lower.includes("commercial") ||
    lower.includes("mercantile") ||
    lower.includes("business") ||
    lower.includes("mixed") ||
    lower.includes("office") ||
    lower.includes("store") ||
    lower.includes("hotel") ||
    lower.includes("motel")
  ) {
    return 15;
  }
  if (
    lower.includes("residential") ||
    lower.includes("apartment") ||
    lower.includes("dwelling")
  ) {
    return 10;
  }
  return 8;
}
