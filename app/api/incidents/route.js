import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getAllIncidents, createIncident } from "@/lib/incident-repo";
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
    const user = session.user;
    let ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }
    if (ip === "::1") {
      ip = "127.0.0.1";
    }
    // --- NEW LUXON-BASED TIMESTAMP LOGIC ---
    const timeZone = "Asia/Kolkata";

    // 1. Get the current time directly in the IST timezone.
    const nowInIST = DateTime.now().setZone(timeZone);

    // 2. Determine the logical date for the ID (for C-Shift).
    let logicalDate = nowInIST;
    if (nowInIST.hour < 6) {
      logicalDate = nowInIST.minus({ days: 1 });
    }

    // 3. Format the timestamps using Luxon's reliable formatting.
    const idTimestamp = logicalDate.toFormat("yyyyMMddHHmmss");
    const reportedOnString = nowInIST.toFormat("dd MMM yyyy HH:mm");
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");

    const newIncident = {
      id: `${idTimestamp}-${randomHex}`,
      reportedOn: reportedOnString,
      status: "New",
      auditTrail: [],
      incidentType: formData.incidentType,
      priority: formData.priority,
      location: formData.location,
      jobTitle: formData.jobTitle,
      description: formData.description,
      contactNumber: formData.contactNumber,
      requestor: user.name,
      ticketNo: user.id,
      department: user.department,
      emailSail: user.emailSail,
      emailNic: user.emailNic,
      sailpno: user.sailpno,
      jobFrom: user.name,
      ipAddress: ip,
    };
    const createdIncident = await createIncident(newIncident);
    return NextResponse.json(createdIncident, { status: 201 });
  } catch (error) {
    console.error("Failed to create incident:", error);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}
