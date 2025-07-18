import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getAllIncidents, updateIncident } from "@/lib/incident-repo";

// This is the PATCH function that will handle updates
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const incidentId = params.id; // Access params BEFORE awaiting the request body
    const updatePayload = await request.json(); // Now, read the body
    const allIncidents = await getAllIncidents();
    const incidentToUpdate = allIncidents.find(
      (inc) => inc.id.toString() === incidentId.toString()
    );

    if (!incidentToUpdate) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    if (incidentToUpdate.status === "New") {
      updatePayload.status = "Processed";
    }

    const updatedIncident = await updateIncident(incidentId, updatePayload);

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Failed to update incident ${incidentId}:`, error);
    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 }
    );
  }
}
