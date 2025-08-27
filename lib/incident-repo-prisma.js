import prisma from "./prisma.js";
import { DateTime } from "luxon";
import { isSystemIncident } from "./incident-helpers.js";
import { INCIDENT_STATUS, USER_ROLES } from "@/lib/constants";

// This function fetches all incidents and includes all related data
export async function getAllIncidents(filters = {}, user) {
  // --- START: DETAILED DEBUGGING LOG ---
  //console.log("\n--- DEBUG: getAllIncidents ---");
  //console.log(`Timestamp: ${new Date().toISOString()}`);
  //console.log("Logged-in User:", { name: user?.name, role: user?.role });
  //console.log("Received Filters:", filters);
  // --- END: DETAILED DEBUGGING LOG ---

  const {
    page = 1,
    limit = "20",
    status,
    priority,
    category,
    incidentType,
    department,
    requestor,
    incidentId,
    startDate,
    endDate,
    shift,
  } = filters;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10) ?? 20;

  const where = {};

  if (user?.role === "standard") {
    where.requestor = {
      ticketNo: user.ticketNo,
    };
  } else if (
    user?.role === USER_ROLES.TELECOM ||
    user?.role === USER_ROLES.ETL
  ) {
    where.assignedTeam = {
      equals: user.role,
      mode: "insensitive",
    };
  } else {
    const requestorConditions = [];
    if (department && department !== "Any") {
      requestorConditions.push({
        department: { name: { equals: department } },
      });
    }
    if (requestor) {
      requestorConditions.push({
        OR: [
          { name: { contains: requestor, mode: "insensitive" } },
          { ticketNo: { contains: requestor, mode: "insensitive" } },
          { sailPNo: { contains: requestor, mode: "insensitive" } },
        ],
      });
    }
    if (requestorConditions.length > 0) {
      where.requestor = { AND: requestorConditions };
    }
  }

  if (incidentId) where.id = { contains: incidentId, mode: "insensitive" };

  const isVendor =
    user?.role === "network_vendor" || user?.role === "biometric_vendor";

  if (status && status !== "Any") {
    if (status === "open") {
      where.status = { in: isVendor ? ["Processed"] : ["New", "Processed"] };
    } else {
      where.status = status;
    }
  } else {
    if (isVendor) {
      where.status = { not: "New" };
    }
  }
  if (priority && priority !== "Any") where.priority = { equals: priority };
  if (incidentType && incidentType !== "Any")
    where.incidentType = { name: { equals: incidentType } };
  if (startDate && endDate)
    where.reportedOn = { gte: new Date(startDate), lte: new Date(endDate) };
  if (category && category !== "Any") {
    const allTypes = await prisma.incidentType.findMany({
      select: { name: true },
    });
    const systemTypeNames = allTypes
      .filter((t) => isSystemIncident({ incidentType: t.name }))
      .map((t) => t.name);
    if (category.toLowerCase() === "system") {
      where.incidentType = { name: { in: systemTypeNames } };
    } else if (category.toLowerCase() === "general") {
      where.incidentType = { name: { notIn: systemTypeNames } };
    }
  }

  // --- LOG THE FINAL PRISMA QUERY ---
  console.log(
    "Final 'where' clause sent to Prisma:",
    JSON.stringify(where, null, 2)
  );
  console.log("---------------------------------");

  const allIncidentsForRange = await prisma.incident.findMany({
    where,
    select: {
      id: true,
      shiftDate: true,
    },
    orderBy: { reportedOn: "desc" },
  });

  const incidentsFilteredByShift =
    shift && shift !== "Any"
      ? allIncidentsForRange.filter((incident) => {
          const incidentHour = DateTime.fromJSDate(incident.shiftDate).setZone(
            "Asia/Kolkata"
          ).hour;
          if (shift === "A") return incidentHour >= 6 && incidentHour < 14;
          if (shift === "B") return incidentHour >= 14 && incidentHour < 22;
          if (shift === "C") return incidentHour >= 22 || incidentHour < 6;
          return true;
        })
      : allIncidentsForRange;

  const totalIncidents = incidentsFilteredByShift.length;
  const totalPages = limitNum > 0 ? Math.ceil(totalIncidents / limitNum) : 1;
  const skip = (pageNum - 1) * limitNum;

  const paginatedIds = incidentsFilteredByShift
    .slice(skip, skip + limitNum)
    .map((incident) => incident.id);

  const paginatedIncidents =
    paginatedIds.length > 0
      ? await prisma.incident.findMany({
          where: {
            id: { in: paginatedIds },
          },
          orderBy: { reportedOn: "desc" },
          include: {
            requestor: { include: { department: true } },
            incidentType: true,
          },
        })
      : [];

  return {
    incidents: paginatedIncidents,
    currentPage: pageNum,
    totalPages,
    totalIncidents,
  };
}

// This function creates a new incident
export async function createIncident(incidentData, userFromSession) {
  const incidentType = await prisma.incidentType.findUnique({
    where: { name: incidentData.incidentType },
  });
  if (!incidentType) {
    throw new Error(`Incident type "${incidentData.incidentType}" not found.`);
  }
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
      affectedTicketNo: incidentData.affectedTicketNo,
      requestorId: userFromSession.id,
      incidentTypeId: incidentType.id,
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
          timestamp: "asc",
        },
      },
    },
  });
  return incident;
}

export async function updateIncident(incidentId, updatedData, user) {
  const existingIncident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: { incidentType: true },
  });
  if (!existingIncident) {
    throw new Error("Incident not found to update.");
  }
  const dataToUpdate = {};
  const auditActionDescription = [];
  let actionText = "Action Taken";
  if (updatedData.status && updatedData.status !== existingIncident.status) {
    dataToUpdate.status = updatedData.status;
  }
  if (updatedData.assignedTeam) {
    dataToUpdate.assignedTeam = updatedData.assignedTeam;
  }
  if (updatedData.telecomTasks) {
    dataToUpdate.telecomTasks = updatedData.telecomTasks;
  }
  if (
    updatedData.status === INCIDENT_STATUS.PROCESSED &&
    existingIncident.status === INCIDENT_STATUS.RESOLVED
  ) {
    dataToUpdate.isTypeLocked = false;
    dataToUpdate.isPriorityLocked = false;
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
  if (updatedData.status === "Resolved") {
    actionText = "Resolved";
  } else if (updatedData.status === "Closed") {
    actionText = "Closed";
  }
  const finalComment = [...auditActionDescription, updatedData.comment]
    .filter(Boolean)
    .join("\n---\n");
  if (updatedData.rating !== undefined && updatedData.rating !== null) {
    const ratingAsInt = parseInt(updatedData.rating, 10);
    if (!isNaN(ratingAsInt)) {
      dataToUpdate.rating = ratingAsInt;
    }
  } else if (updatedData.rating === null) {
    dataToUpdate.rating = null;
  }
  const auditEntryData = {
    timestamp: DateTime.now().toJSDate(),
    author: user.name,
    action: actionText,
    comment: finalComment,
    rating: dataToUpdate.rating,
  };
  dataToUpdate.auditTrail = {
    create: auditEntryData,
  };
  const updatedIncident = await prisma.incident.update({
    where: { id: incidentId },
    data: dataToUpdate,
    include: {
      requestor: { include: { department: true } },
      incidentType: true,
      auditTrail: {
        orderBy: {
          timestamp: "asc",
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
      editedAt: DateTime.now().toJSDate(),
    },
  });
  return updatedEntry;
}

export async function getAllIncidentTypes() {
  const incidentTypes = await prisma.incidentType.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return incidentTypes;
}

export async function getAllDepartments() {
  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return departments;
}
