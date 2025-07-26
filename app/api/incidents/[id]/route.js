import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getIncidentById, updateIncident } from "@/lib/incident-repo";

// This is the PATCH function that will handle updates
export async function PATCH(request, context) {
  // <-- The only change is here
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatePayload = await request.json();
    const { id: incidentId } = await context.params;
    const user = session.user;

    // Your existing, correct logic is preserved below
    const incidentToUpdate = await getIncidentById(incidentId);

    if (!incidentToUpdate) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    if (incidentToUpdate.status === "New") {
      updatePayload.status = "Processed";
    }

    const updatedIncident = await updateIncident(
      incidentId,
      updatePayload,
      user
    );

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Failed to update incident:`, error);
    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 }
    );
  }
}
