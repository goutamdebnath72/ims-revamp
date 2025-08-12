import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllIncidents, createIncident } from "@/lib/incident-repo";
import { getShiftTimestamps } from "@/lib/date-helpers";

export const dynamic = "force-dynamic";

// The new GET function that handles all filtering and pagination
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user; // Get the entire user object

    //console.log("--- API: /api/incidents GET ---");
    //console.log("Session found by getServerSession:", session);

    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());

    // Pass the entire user object to the data fetching function
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

// Your complete POST function for creating new incidents
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    //console.log("API received this formData:", formData);
    const user = session.user;

    const { idTimestamp, reportedOnObject, shiftDateObject } =
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
      reportedOn: reportedOnObject, // This is now the CORRECT, actual timestamp
      shiftDate: shiftDateObject, // This remains the LOGICAL timestamp for the shift
      ...formData,
      requestor: user.name,
      ticketNo: user.id,
      department: user.department,
      sailpno: user.sailpno,
      jobFrom: user.name,
      ipAddress: ip,
    };

    const createdIncident = await createIncident(newIncidentData, user);
    //console.log("Data saved to the database:", createdIncident);
    // --- ADD THIS LOGGING BLOCK ---
    //console.log("--- INCIDENT CREATION CHECK ---");
    /*if (createdIncident) {
      console.log(
        "SUCCESS: Incident was saved to the database with ID:",
        createdIncident.id
      );
    } else {
      console.log(
        "FAILURE: createIncident function did not return a saved incident."
      );
    }*/
    //console.log("-----------------------------");
    // --- END OF LOGGING BLOCK ---
    return NextResponse.json(createdIncident, { status: 201 });
  } catch (error) {
    console.error("Failed to create incident:", error);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}
