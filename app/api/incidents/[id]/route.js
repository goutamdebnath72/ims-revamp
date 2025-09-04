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

// PATCH: update an incident (includes referral → Telecom)
export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json();
    console.log("DEBUG: 4. [API Route Received]", { body: rawBody });

    // Inline audit edit (keep your existing behavior if you use this)
    if (rawBody?.action === AUDIT_ACTIONS?.EDIT_COMMENT) {
      const updatedEntry = await editAuditComment(
        rawBody.entryId,
        rawBody.newComment
      );
      return NextResponse.json(updatedEntry);
    }

    const user = session.user;
    const existing = await getIncidentById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    // ---- Normalize payload ---------------------------------------------------
    const body = { ...rawBody };

    // IMPORTANT: never use a string fallback here; always use TEAMS.TELECOM
    // so downstream filters that compare against TEAMS.TELECOM will match.
    const isTelecomReferral =
      Array.isArray(body.telecomTasks) && body.telecomTasks.length > 0;

    if (isTelecomReferral) {
      body.assignedTeam = TEAMS.TELECOM; // exact constant, no fallback/casing drift
      body.status =
        INCIDENT_STATUS?.PENDING_TELECOM_ACTION || "Pending Telecom Action";
      if (!body.comment) body.comment = "Referred to Telecom.";
    } else if (existing.status === INCIDENT_STATUS.NEW) {
      // First touch without referral → move to Processed
      body.status = INCIDENT_STATUS.PROCESSED;
    }

    console.log("DEBUG: 4b. [API Normalized Body]", body);

    const updatedIncident = await updateIncident(id, body, user);
    console.log("DEBUG: 7. [API Route Responding]", {
      id,
      assignedTeam: updatedIncident.assignedTeam,
      status: updatedIncident.status,
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Failed to update incident ${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 }
    );
  }
}
