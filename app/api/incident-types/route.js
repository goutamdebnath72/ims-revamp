import { NextResponse } from "next/server";
import { getAllIncidentTypes } from "@/lib/incident-repo-prisma.js";

export async function GET() {
  try {
    const incidentTypes = await getAllIncidentTypes();
    return NextResponse.json(incidentTypes);
  } catch (error) {
    console.error("Failed to fetch incident types:", error);
    return NextResponse.json(
      { error: "Failed to fetch incident types" },
      { status: 500 }
    );
  }
}
