import { NextResponse } from "next/server";
import { fetchFireIncidents, fetchBuildingPermits, aggregateByAddress } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  try {
    const [incidents, permits] = await Promise.all([
      fetchFireIncidents(),
      fetchBuildingPermits([]),
    ]);

    const aggregated = aggregateByAddress(incidents, permits);

    // Sort by viability score descending by default
    aggregated.sort((a, b) => b.viabilityScore - a.viabilityScore);

    return NextResponse.json({
      addresses: aggregated,
      meta: {
        totalIncidents: incidents.length,
        totalAddresses: aggregated.length,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to fetch fire incidents:", error);
    return NextResponse.json(
      { error: "Failed to fetch fire incident data" },
      { status: 500 }
    );
  }
}
