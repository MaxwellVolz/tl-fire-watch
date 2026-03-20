"use client";

import { useState, useMemo } from "react";
import { Check, Copy, CheckSquare, Square, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViabilityBadge } from "./viability-badge";
import { formatCurrency, formatDateRelative } from "@/lib/format";
import { toast } from "sonner";
import type { AggregatedAddress } from "@/lib/types";

export function AddressSelectList({
  addresses,
}: {
  addresses: AggregatedAddress[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected =
    addresses.length > 0 && selected.size === addresses.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleOne(id: string) {
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
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => toggleOne(addr.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--accent)] ${
                isSelected ? "bg-[var(--accent)]" : ""
              }`}
            >
              {/* Checkbox */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                  isSelected
                    ? "border-primary-400 bg-primary-400 text-white"
                    : "border-[var(--input)] bg-[var(--background)]"
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
            </button>
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
