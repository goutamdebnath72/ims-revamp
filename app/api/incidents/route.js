import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
//import { headers } from "next/headers";
import { getAllIncidents, createIncident } from "@/lib/incident-repo";

export async function GET() {
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
    if (ip === "::1") {
      ip = "127.0.0.1";
    }

    const newIncident = {
      id: Date.now(),
      status: "New",
      reportedOn: new Date()
        .toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
        .replace(/,/g, ""),
      auditTrail: [],
      // Data from the form
      incidentType: formData.incidentType,
      priority: formData.priority,
      location: formData.location,
      jobTitle: formData.jobTitle,
      description: formData.description,
      contactNumber: formData.contactNumber,
      // Data from the user's session
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
