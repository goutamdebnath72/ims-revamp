import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllIncidents, createIncident } from "@/lib/incident-repo";
import { getShiftTimestamps } from "@/lib/date-helpers";

export const dynamic = "force-dynamic";

// The GET function that handles all filtering and pagination
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());
    const result = await getAllIncidents(filters, user);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed in GET /api/incidents:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 }
    );
  }
}

// The POST function for creating new incidents
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const user = session.user;

    // --- Server-Side Validation ---
    if (
      formData.incidentType?.toLowerCase() === "ess password" &&
      formData.affectedTicketNo === user.ticketNo
    ) {
      return NextResponse.json(
        {
          error:
            "Validation failed: You cannot raise a password reset incident for yourself.",
        },
        { status: 400 }
      );
    }

    const { idTimestamp, reportedOnObject, shiftDateObject } =
      getShiftTimestamps();
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
    let ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (ip.includes(",")) ip = ip.split(",")[0].trim();
    if (ip === "::1") ip = "127.0.0.1";

    // --- CORRECTED DATA STRUCTURE FOR PRISMA ---
    const newIncidentData = {
      id: `${idTimestamp}-${randomHex}`,
      reportedOn: reportedOnObject,
      shiftDate: shiftDateObject,
      ...formData, // Spreads jobTitle, description, incidentType, and the new affectedUserId
      requestorId: user.id, // Correctly links the incident to the user who is creating it
      ipAddress: ip,
    };

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
