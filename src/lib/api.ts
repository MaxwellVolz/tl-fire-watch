import {
  SODA_BASE,
  FIRE_INCIDENTS_DATASET,
  BUILDING_PERMITS_DATASET,
  TENDERLOIN_DISTRICT,
  DEFAULT_LOOKBACK_YEARS,
} from "./constants";
import { normalizeAddress } from "./format";
import { computeViabilityScore } from "./viability";
import type {
  FireIncident,
  AggregatedAddress,
  BuildingPermit,
} from "./types";

function getLookbackDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - DEFAULT_LOOKBACK_YEARS);
  return d.toISOString().split("T")[0] + "T00:00:00";
}

export async function fetchFireIncidents(): Promise<FireIncident[]> {
  const lookback = getLookbackDate();
  const where = `neighborhood_district='${TENDERLOIN_DISTRICT}' AND incident_date > '${lookback}'`;
  const url = `${SODA_BASE}/${FIRE_INCIDENTS_DATASET}.json?$where=${encodeURIComponent(where)}&$order=incident_date DESC&$limit=5000`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`SODA API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchBuildingPermits(
  addresses: string[]
): Promise<BuildingPermit[]> {
  if (addresses.length === 0) return [];

  // Build a WHERE clause matching any of the addresses
  // Permits use street_number + street_name, so we search by description containing "fire"
  const lookback = getLookbackDate();
  const where = `filed_date > '${lookback}' AND (description LIKE '%FIRE%' OR description LIKE '%fire%' OR permit_type='8')`;
  const url = `${SODA_BASE}/${BUILDING_PERMITS_DATASET}.json?$where=${encodeURIComponent(where)}&$limit=5000`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    // Non-critical: if permits fail, continue without permit data
    console.error(`Permits API error: ${res.status}`);
    return [];
  }
  return res.json();
}

function hashAddress(addr: string): string {
  // Simple hash for ID generation
  let hash = 0;
  const normalized = normalizeAddress(addr);
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function aggregateByAddress(
  incidents: FireIncident[],
  permits: BuildingPermit[]
): AggregatedAddress[] {
  const addressMap = new Map<
    string,
    Omit<AggregatedAddress, "viabilityScore" | "viabilityTier">
  >();

  // Build permit address set for cross-referencing
  const permitAddresses = new Set<string>();
  for (const permit of permits) {
    if (permit.street_number && permit.street_name) {
      permitAddresses.add(
        normalizeAddress(`${permit.street_number} ${permit.street_name}`)
      );
    }
  }

  for (const incident of incidents) {
    if (!incident.address) continue;

    const key = normalizeAddress(incident.address);
    const existing = addressMap.get(key);

    const propLoss = parseFloat(incident.estimated_property_loss) || 0;
    const contentsLoss = parseFloat(incident.estimated_contents_loss) || 0;
    const incidentDate = incident.incident_date || "";

    if (existing) {
      existing.incidents.push(incident);
      existing.totalPropertyLoss += propLoss;
      existing.totalContentsLoss += contentsLoss;
      existing.incidentCount += 1;

      if (incidentDate > existing.latestIncidentDate) {
        existing.latestIncidentDate = incidentDate;
      }
      if (incidentDate < existing.earliestIncidentDate) {
        existing.earliestIncidentDate = incidentDate;
      }
    } else {
      const point =
        incident.point?.latitude && incident.point?.longitude
          ? {
              lat: parseFloat(incident.point.latitude),
              lng: parseFloat(incident.point.longitude),
            }
          : undefined;

      addressMap.set(key, {
        id: hashAddress(incident.address),
        address: incident.address,
        incidents: [incident],
        totalPropertyLoss: propLoss,
        totalContentsLoss: contentsLoss,
        latestIncidentDate: incidentDate,
        earliestIncidentDate: incidentDate,
        incidentCount: 1,
        propertyUse: incident.property_use || "Unknown",
        hasRepairPermits: permitAddresses.has(key),
        point,
      });
    }
  }

  // Compute viability scores
  return Array.from(addressMap.values()).map((addr) => {
    const { score, tier } = computeViabilityScore(addr);
    return { ...addr, viabilityScore: score, viabilityTier: tier };
  });
}
