import { NextResponse } from "next/server";
import {
  getIncidentById,
  updateIncident,
  editAuditComment,
} from "@/lib/incident-repo";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { INCIDENT_STATUS, AUDIT_ACTIONS } from "@/lib/constants";

// GET a single incident by ID
export async function GET(request, { params }) {
  const { id } = params; // Define id outside the try block
  try {
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
  const { id } = params; // FIX #1: Define id outside and before the try block
  // FIX #2: Remove unnecessary 'await'
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.action === AUDIT_ACTIONS.EDIT_COMMENT) {
      const updatedEntry = await editAuditComment(
        body.entryId,
        body.newComment
      );
      return NextResponse.json(updatedEntry);
    }

    const user = session.user;
    const incidentToUpdate = await getIncidentById(id);
    if (!incidentToUpdate) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    if (incidentToUpdate.status === INCIDENT_STATUS.NEW) {
      body.status = INCIDENT_STATUS.PROCESSED;
    }

    const updatedIncident = await updateIncident(id, body, user);
    return NextResponse.json(updatedIncident);
  } catch (error) {
    // Now, 'id' is available here for correct error logging
    console.error(`Failed to update incident ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 }
    );
  }
}
