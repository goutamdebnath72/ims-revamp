import prisma from "./prisma";
import { DateTime } from "luxon";

// This function fetches all incidents and includes all related data
export async function getAllIncidents() {
  const incidents = await prisma.incident.findMany({
    include: {
      // Include the full requestor object, which now has the department nested
      requestor: {
        include: {
          department: true,
        },
      },
      // Also include the incident type object
      incidentType: true,
      auditTrail: {
        orderBy: {
          id: "asc", // Sort by creation order (assuming ID is a CUID/UUID)
        },
      },
    },
    orderBy: {
      reportedOn: "desc",
    },
  });
  return incidents;
}

// This function creates a new incident
export async function createIncident(incidentData, userFromSession) {
  // First, find the department's ID from the database
  const department = await prisma.department.findFirst({
    where: { name: userFromSession.department },
  });

  if (!department) {
    throw new Error(`Department "${userFromSession.department}" not found.`);
  }

  // Next, find the incident type's ID to ensure it's valid
  const incidentType = await prisma.incidentType.findUnique({
    where: { name: incidentData.incidentType },
  });

  if (!incidentType) {
    throw new Error(`Incident type "${incidentData.incidentType}" not found.`);
  }

  // Use the user data from the session to find or create a user record
  const user = await prisma.user.upsert({
    where: { ticketNo: userFromSession.id },
    update: {
      name: userFromSession.name,
      departmentId: department.id,
    },
    create: {
      ticketNo: userFromSession.id,
      name: userFromSession.name,
      role: userFromSession.role,
      password: userFromSession.password || "",
      sailPNo: userFromSession.sailpno,
      departmentId: department.id,
    },
  });

  // Create the incident and link it to the user and incident type
  const newIncident = await prisma.incident.create({
    data: {
      id: incidentData.id,
      reportedOn: incidentData.reportedOn,
      shiftDate: incidentData.shiftDate,
      jobTitle: incidentData.jobTitle,
      description: incidentData.description,
      priority: incidentData.priority,
      status: "New",
      location: incidentData.location,
      ipAddress: incidentData.ipAddress,
      jobFrom: incidentData.jobFrom,
      requestorId: user.id,
      incidentTypeId: incidentType.id, // Use the ID we safely found
    },
  });

  return newIncident;
}

// --- This function is correct ---
export async function getIncidentById(incidentId) {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      requestor: {
        include: {
          department: true,
        },
      },
      incidentType: true,
      auditTrail: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });
  return incident;
}

// --- This function is correct ---
export async function updateIncident(incidentId, updatedData, user) {
  console.log("Data received by updateIncident:", updatedData);

  const existingIncident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: { incidentType: true },
  });

  if (!existingIncident) {
    throw new Error("Incident not found to update.");
  }

  const dataToUpdate = {};
  const auditActionDescription = [];
  let actionText = "Action Taken"; // Default action

  if (updatedData.status && updatedData.status !== existingIncident.status) {
    dataToUpdate.status = updatedData.status;
  }

  const typeChanged =
    updatedData.newType &&
    updatedData.newType !== existingIncident.incidentType.name &&
    !existingIncident.isTypeLocked;
  if (typeChanged) {
    const incidentType = await prisma.incidentType.findUnique({
      where: { name: updatedData.newType },
    });
    if (incidentType) {
      dataToUpdate.incidentTypeId = incidentType.id;
      dataToUpdate.isTypeLocked = true;
      auditActionDescription.push(
        `Incident Type changed to "${updatedData.newType}".`
      );
      actionText = "Incident Type Changed";
    }
  }

  const priorityChanged =
    updatedData.newPriority &&
    updatedData.newPriority !== existingIncident.priority &&
    !existingIncident.isPriorityLocked;
  if (priorityChanged) {
    dataToUpdate.priority = updatedData.newPriority;
    dataToUpdate.isPriorityLocked = true;
    auditActionDescription.push(
      `Priority changed to "${updatedData.newPriority}".`
    );
    actionText = typeChanged ? "Details Updated" : "Priority Changed";
  }

  const finalComment = [...auditActionDescription, updatedData.comment]
    .filter(Boolean)
    .join("\n---\n");
  dataToUpdate.auditTrail = {
    create: {
      timestamp: DateTime.now()
        .setZone("Asia/Kolkata")
        .toFormat("ccc LLL d yyyy h:mm a"),
      author: user.name,
      action: actionText,
      comment: finalComment,
    },
  };

  const updatedIncident = await prisma.incident.update({
    where: { id: incidentId },
    data: dataToUpdate,
    include: {
      requestor: { include: { department: true } },
      incidentType: true,
      auditTrail: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  return updatedIncident;
}

export async function editAuditComment(entryId, newComment) {
  const updatedEntry = await prisma.auditEntry.update({
    where: { id: entryId },
    data: {
      comment: newComment,
      isEdited: true,
    },
  });
  return updatedEntry;
}
