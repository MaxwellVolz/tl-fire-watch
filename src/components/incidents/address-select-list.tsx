"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  CheckSquare,
  Square,
  ClipboardList,
  ChevronDown,
  ExternalLink,
  Flame,
  DollarSign,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ViabilityBadge } from "./viability-badge";
import { formatCurrency, formatCurrencyFull, formatDate, formatDateRelative } from "@/lib/format";
import { toast } from "sonner";
import type { AggregatedAddress } from "@/lib/types";

export function AddressSelectList({
  addresses,
}: {
  addresses: AggregatedAddress[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  const allSelected =
    addresses.length > 0 && selected.size === addresses.length;

  function toggleOne(id: string, e: React.MouseEvent) {
    // Only toggle checkbox if clicking the checkbox area
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(addresses.map((a) => a.id)));
    }
  }

  function selectHighViability() {
    setSelected(
      new Set(addresses.filter((a) => a.viabilityTier === "high").map((a) => a.id))
    );
  }

  const selectedAddresses = useMemo(
    () => addresses.filter((a) => selected.has(a.id)),
    [addresses, selected]
  );

  function copyAddresses() {
    const text = selectedAddresses
      .map(
        (a) =>
          `${a.address} | ${a.viabilityTier.toUpperCase()} (${a.viabilityScore}) | ${formatCurrency(a.totalPropertyLoss)} loss | ${a.incidentCount} incident${a.incidentCount !== 1 ? "s" : ""}`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${selectedAddresses.length} addresses to clipboard`);
  }

  if (addresses.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAll}
          className="gap-1.5"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={selectHighViability}
          className="gap-1.5"
        >
          <ClipboardList className="h-4 w-4" />
          Select High Viability
        </Button>
        {selected.size > 0 && (
          <span className="text-sm text-[var(--muted-foreground)]">
            {selected.size} of {addresses.length} selected
          </span>
        )}
      </div>

      {/* Address rows */}
      <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
        {addresses.map((addr) => {
          const isSelected = selected.has(addr.id);
          const isExpanded = expanded === addr.id;
          return (
            <div key={addr.id}>
              {/* Row */}
              <div
                onClick={() => toggleExpand(addr.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer hover:bg-[var(--accent)] ${
                  isExpanded ? "bg-[var(--accent)]" : isSelected ? "bg-[var(--accent)]/50" : ""
                }`}
              >
                {/* Checkbox */}
                <div
                  onClick={(e) => toggleOne(addr.id, e)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary-400 bg-primary-400 text-white"
                      : "border-[var(--input)] bg-[var(--background)] hover:border-primary-300"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </div>

                {/* Address info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {addr.address}
                    </span>
                    <ViabilityBadge tier={addr.viabilityTier} score={addr.viabilityScore} showScore />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[var(--muted-foreground)] mt-0.5">
                    <span>{formatCurrency(addr.totalPropertyLoss)} loss</span>
                    <span>
                      {addr.incidentCount} incident{addr.incidentCount !== 1 ? "s" : ""}
                    </span>
                    <span>{formatDateRelative(addr.latestIncidentDate)}</span>
                    <span>{addr.propertyUse}</span>
                    {!addr.hasRepairPermits && addr.totalPropertyLoss > 0 && (
                      <Badge variant="fire" className="text-[10px] px-1.5 py-0">
                        Unremediated
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expand indicator */}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Expanded assessment */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <InlineAssessment address={addr} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom bar when items are selected */}
      {selected.size > 0 && (
        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg">
          <div className="text-sm">
            <span className="font-bold">{selected.size}</span> address
            {selected.size !== 1 ? "es" : ""} selected
            <span className="text-[var(--muted-foreground)] ml-2">
              {formatCurrency(
                selectedAddresses.reduce((s, a) => s + a.totalPropertyLoss, 0)
              )}{" "}
              total loss
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
            <Button size="sm" onClick={copyAddresses} className="gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Copy List
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function InlineAssessment({ address }: { address: AggregatedAddress }) {
  return (
    <div className="border-t border-[var(--border)] bg-[var(--muted)]/50 px-4 py-4 space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-2 p-3">
            <DollarSign className="h-5 w-5 text-fire-400 shrink-0" />
            <div>
              <div className="text-sm font-bold">
                {formatCurrencyFull(address.totalPropertyLoss)}
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)]">
                Property Loss
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2 p-3">
            <DollarSign className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-sm font-bold">
                {formatCurrencyFull(address.totalContentsLoss)}
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)]">
                Contents Loss
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2 p-3">
            <Flame className="h-5 w-5 text-fire-400 shrink-0" />
            <div>
              <div className="text-sm font-bold">{address.incidentCount}</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">
                Incidents
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2 p-3">
            <FileCheck className="h-5 w-5 text-[var(--muted-foreground)] shrink-0" />
            <div>
              <div className="text-sm font-bold">
                {address.hasRepairPermits ? "Yes" : "No"}
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)]">
                Repair Permits
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viability breakdown */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="text-sm font-semibold mb-3">Viability Score Breakdown</div>
        <div className="space-y-2">
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
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 text-sm font-bold">
            <span>Total</span>
            <span>{address.viabilityScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Incident timeline (compact) */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="text-sm font-semibold mb-3">Incidents</div>
        <div className="space-y-2">
          {[...address.incidents]
            .sort(
              (a, b) =>
                new Date(b.incident_date).getTime() -
                new Date(a.incident_date).getTime()
            )
            .map((incident, i) => (
              <div
                key={incident.incident_number || i}
                className="flex items-start gap-3 rounded-md border border-[var(--border)] p-3 text-sm"
              >
                <Flame className="h-4 w-4 text-fire-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {formatDate(incident.incident_date)}
                    </span>
                    {incident.primary_situation && (
                      <Badge variant="default" className="text-[10px]">
                        {incident.primary_situation}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 text-xs text-[var(--muted-foreground)] mt-0.5">
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
                  </div>
                  {(parseInt(incident.fire_injuries || "0") > 0 ||
                    parseInt(incident.civilian_injuries || "0") > 0 ||
                    parseInt(incident.fire_fatalities || "0") > 0 ||
                    parseInt(incident.civilian_fatalities || "0") > 0) && (
                    <div className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
                      <AlertTriangle className="h-3 w-3" />
                      {parseInt(incident.fire_injuries || "0") +
                        parseInt(incident.civilian_injuries || "0")}{" "}
                      injuries,{" "}
                      {parseInt(incident.fire_fatalities || "0") +
                        parseInt(incident.civilian_fatalities || "0")}{" "}
                      fatalities
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Link to full page */}
      <div className="flex justify-end">
        <Link href={`/address/${address.id}`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            Full Assessment Page
          </Button>
        </Link>
      </div>
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
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-medium">
          {value} / {max}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--muted)]">
        <div
          className="h-1.5 rounded-full bg-primary-400 transition-all duration-500"
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
