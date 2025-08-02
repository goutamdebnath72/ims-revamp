import { NextResponse } from "next/server";
import {
  getIncidentById,
  updateIncident,
  editAuditComment,
} from "@/lib/incident-repo";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET a single incident by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const incident = await getIncidentById(id);
    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(incident);
  } catch (error) {
    console.error(`Failed to fetch incident ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch incident" },
      { status: 500 }
    );
  }
}

// PATCH/UPDATE an incident
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Logic to handle editing just an audit trail comment
    if (body.action === "editAuditComment") {
      const updatedEntry = await editAuditComment(
        body.entryId,
        body.newComment
      );
      return NextResponse.json(updatedEntry);
    }

    // This is the full incident update path
    const user = session.user;
    const incidentToUpdate = await getIncidentById(id);
    if (!incidentToUpdate) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    // --- YOUR CUSTOM BUSINESS LOGIC IS PRESERVED HERE ---
    if (incidentToUpdate.status === "New") {
      body.status = "Processed";
    }

    // Call the repo function with all the data
    const updatedIncident = await updateIncident(id, body, user);
    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Failed to update incident ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 }
    );
  }
}
