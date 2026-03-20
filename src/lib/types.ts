export interface FireIncident {
  incident_number: string;
  address: string;
  incident_date: string;
  primary_situation: string;
  property_use: string;
  estimated_property_loss: string;
  estimated_contents_loss: string;
  fire_fatalities: string;
  fire_injuries: string;
  civilian_fatalities: string;
  civilian_injuries: string;
  point?: { latitude: string; longitude: string };
  neighborhood_district: string;
  battalion: string;
  station_area: string;
  suppression_units: string;
  suppression_personnel: string;
  first_unit_on_scene: string;
  number_of_alarms: string;
  action_taken_primary: string;
  detector_alerted_occupants: string;
  area_of_fire_origin: string;
}

export interface AggregatedAddress {
  id: string;
  address: string;
  incidents: FireIncident[];
  totalPropertyLoss: number;
  totalContentsLoss: number;
  latestIncidentDate: string;
  earliestIncidentDate: string;
  incidentCount: number;
  propertyUse: string;
  hasRepairPermits: boolean;
  viabilityScore: number;
  viabilityTier: ViabilityTier;
  point?: { lat: number; lng: number };
}

export type ViabilityTier = "high" | "medium" | "low";

export type SortField =
  | "viabilityScore"
  | "totalPropertyLoss"
  | "latestIncidentDate"
  | "incidentCount";

export type SortDirection = "asc" | "desc";

export type ViabilityFilter = "all" | "high" | "medium" | "low";

export type DateRange = "6m" | "1y" | "2y" | "3y" | "all";

export interface FilterState {
  viability: ViabilityFilter;
  minPropertyLoss: number;
  dateRange: DateRange;
  search: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface IncidentStats {
  totalAddresses: number;
  totalIncidents: number;
  totalPropertyLoss: number;
  totalContentsLoss: number;
  highViabilityCount: number;
  mediumViabilityCount: number;
  lowViabilityCount: number;
}

export interface BuildingPermit {
  permit_number: string;
  permit_type: string;
  status: string;
  filed_date: string;
  description: string;
  street_number: string;
  street_name: string;
}
