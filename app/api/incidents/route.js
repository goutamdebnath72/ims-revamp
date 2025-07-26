import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getAllIncidents, createIncident } from "@/lib/incident-repo";
import { getShiftTimestamps } from "@/lib/date-helpers";
import { DateTime } from "luxon";

export async function GET() {
  // This function is for fetching incidents
  try {
    const incidents = await getAllIncidents();
    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Failed in GET /api/incidents:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const user = session.user; // Get the full user object from the session

    const { idTimestamp, reportedOnString, shiftDateObject } =
      getShiftTimestamps();
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
    let ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (ip.includes(",")) ip = ip.split(",")[0].trim();
    if (ip === "::1") ip = "127.0.0.1";

    const newIncidentData = {
      id: `${idTimestamp}-${randomHex}`,
      reportedOn: reportedOnString,
      shiftDate: shiftDateObject,
      ...formData, // Spread the form data
      requestor: user.name,
      ticketNo: user.id,
      department: user.department,
      sailpno: user.sailpno,
      jobFrom: user.name,
      ipAddress: ip,
    };

    // Pass both the incident data and the user session to the repository function
    const createdIncident = await createIncident(newIncidentData, user);

    return NextResponse.json(createdIncident, { status: 201 });
  } catch (error) {
    console.error("Failed to create incident:", error);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}
