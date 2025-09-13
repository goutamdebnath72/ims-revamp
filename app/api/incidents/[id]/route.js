import { NextResponse } from "next/server";
import {
  getIncidentById,
  updateIncident,
  editAuditComment,
} from "@/lib/incident-repo";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { INCIDENT_STATUS, AUDIT_ACTIONS, TEAMS } from "@/lib/constants";

// GET a single incident by ID
export async function GET(_req, { params }) {
  const { id } = params;

  // --- FIX 1: ID VALIDATION ---
  // Add robust validation for the incoming ID.
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing Incident ID." },
      { status: 400 } // 400 Bad Request
    );
  }

  try {
    const incident = await getIncidentById(id);
    if (!incident) {
      return NextResponse.json(
        { message: "Incident not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(incident);
  } catch (error) {
    console.error(`Failed to fetch incident ${id}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch incident" },
      { status: 500 }
    );
  }
}

// PATCH: update an incident
export async function PATCH(request, { params }) {
  const { id } = params;

  // --- FIX 1: ID VALIDATION (Applied here as well) ---
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing Incident ID." },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const user = session.user;

    // --- FIX 2: CORRECTED LOGIC FOR EDITING A COMMENT ---
    if (body.action === AUDIT_ACTIONS.EDIT_COMMENT) {
      // First, perform the edit
      await editAuditComment(body.entryId, body.newComment);
      // Then, fetch the ENTIRE updated incident and return it
      const updatedIncident = await getIncidentById(id);
      return NextResponse.json(updatedIncident);
    }

    const existing = await getIncidentById(id);
    if (!existing) {
      return NextResponse.json(
        { message: "Incident not found" },
        { status: 404 }
      );
    }

    // Payload normalization logic remains the same
    const normalizedBody = { ...body };
    const isTelecomReferral =
      Array.isArray(normalizedBody.telecomTasks) &&
      normalizedBody.telecomTasks.length > 0;

    if (isTelecomReferral) {
      normalizedBody.assignedTeam = TEAMS.TELECOM;
      normalizedBody.status = INCIDENT_STATUS.PENDING_TELECOM_ACTION;
      if (!normalizedBody.comment)
        normalizedBody.comment = "Referred to Telecom.";
    } else if (existing.status === INCIDENT_STATUS.NEW) {
      normalizedBody.status = INCIDENT_STATUS.PROCESSED;
    }

    const updatedIncident = await updateIncident(id, normalizedBody, user);
    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Failed to update incident ${id}:`, error);
    return NextResponse.json(
      { message: "Failed to update incident" },
      { status: 500 }
    );
  }
}
