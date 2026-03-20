export const SODA_BASE = "https://data.sfgov.org/resource";
export const FIRE_INCIDENTS_DATASET = "wr8u-xric";
export const BUILDING_PERMITS_DATASET = "i98e-djp9";
export const TENDERLOIN_DISTRICT = "Tenderloin";
export const DEFAULT_LOOKBACK_YEARS = 3;
export const CACHE_REVALIDATE_SECONDS = 3600;

export const DATE_RANGE_OPTIONS = [
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "2y", label: "Last 2 years" },
  { value: "3y", label: "Last 3 years" },
  { value: "all", label: "All time" },
] as const;

export const SORT_OPTIONS = [
  { value: "viabilityScore", label: "Viability Score" },
  { value: "totalPropertyLoss", label: "Property Loss" },
  { value: "latestIncidentDate", label: "Most Recent" },
  { value: "incidentCount", label: "Incident Count" },
] as const;

export const VIABILITY_OPTIONS = [
  { value: "all", label: "All Viability" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;
