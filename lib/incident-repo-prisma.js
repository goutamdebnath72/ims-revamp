import prisma from "./prisma.js";
import { DateTime } from "luxon";
import { isSystemIncident } from "./incident-helpers.js";
import {
  INCIDENT_STATUS,
  USER_ROLES,
  TEAMS,
  INCIDENT_TYPES,
} from "@/lib/constants";

// Add this new helper function to the file
async function applyCategoryFilter(baseWhere, user, categoryFromFilter) {
  const allTypes = await prisma.incidentType.findMany({
    select: { name: true },
  });
  const systemTypeNames = allTypes
    .filter((t) => isSystemIncident({ incidentType: { name: t.name } }))
    .map((t) => t.name);

  let effectiveCategory = categoryFromFilter;

  // Business Rule: Admins are ALWAYS locked to the "general" category.
  if (user.role === USER_ROLES.ADMIN) {
    effectiveCategory = "general";
  }

  // --- THIS IS THE FIX ---
  // We now use .toLowerCase() to make the check case-insensitive.
  // Optional chaining (?.) is used for safety in case the category is not defined.
  if (effectiveCategory?.toLowerCase() === "general") {
    baseWhere.incidentType = { name: { notIn: systemTypeNames } };
  } else if (effectiveCategory?.toLowerCase() === "system") {
    baseWhere.incidentType = { name: { in: systemTypeNames } };
  }
}

// This function is for general queries (Admin, Standard User)
export async function getAllIncidents(filters = {}, user) {
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

  // --- THIS IS THE CRUCIAL ADDITION ---
  // Applying the baseline category filter before any other logic
  await applyCategoryFilter(where, user, category);
  // ------------------------------------

  // Role-based pre-filtering
  if (user?.role === USER_ROLES.STANDARD) {
    where.requestor = { ticketNo: user.ticketNo };
  } else if (user?.role === USER_ROLES.TELECOM_USER) {
    where.incidentType = {
      name: {
        equals: INCIDENT_TYPES.NETWORK,
        mode: "insensitive",
      },
    };
    where.assignedTeam = { equals: TEAMS.TELECOM };
    where.status = {
      in: [
        INCIDENT_STATUS.PENDING_TELECOM_ACTION,
        INCIDENT_STATUS.RESOLVED,
        INCIDENT_STATUS.CLOSED,
      ],
    };
  } else if (user?.role === USER_ROLES.ETL) {
    where.incidentType = {
      name: {
        equals: INCIDENT_TYPES.PC_PERIPHERALS,
        mode: "insensitive",
      },
    };
    where.status = {
      in: [
        INCIDENT_STATUS.PENDING_ETL,
        INCIDENT_STATUS.RESOLVED,
        INCIDENT_STATUS.CLOSED,
      ],
    };
  } else if (user?.role === USER_ROLES.NETWORK_AMC) {
    where.incidentType = {
      name: {
        equals: INCIDENT_TYPES.NETWORK,
        mode: "insensitive",
      },
    };
    where.status = {
      in: [
        INCIDENT_STATUS.PROCESSED,
        INCIDENT_STATUS.PENDING_TELECOM_ACTION,
        INCIDENT_STATUS.RESOLVED,
        INCIDENT_STATUS.CLOSED,
      ],
    };
  } else if (user?.role === USER_ROLES.BIOMETRIC_AMC) {
    where.incidentType = {
      name: {
        equals: "Biometric",
        mode: "insensitive",
      },
    };
    where.status = {
      in: [
        INCIDENT_STATUS.PROCESSED,
        INCIDENT_STATUS.RESOLVED,
        INCIDENT_STATUS.CLOSED,
      ],
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

  // General Filters
  if (incidentId) where.id = { contains: incidentId, mode: "insensitive" };
  const isAMC =
    user?.role === USER_ROLES.NETWORK_AMC ||
    user?.role === USER_ROLES.BIOMETRIC_AMC;

  if (status && status !== "Any") {
    if (status.includes(",")) {
      const statusArray = status.split(",").map((s) => s.trim());
      where.status = { in: statusArray, mode: "insensitive" };
    } else if (status === "open") {
      where.status = {
        in: isAMC
          ? [INCIDENT_STATUS.PROCESSED, INCIDENT_STATUS.PENDING_TELECOM_ACTION]
          : [
              INCIDENT_STATUS.NEW,
              INCIDENT_STATUS.PROCESSED,
              INCIDENT_STATUS.PENDING_TELECOM_ACTION,
              INCIDENT_STATUS.PENDING_ETL,
            ],
      };
    } else {
      where.status = { equals: status, mode: "insensitive" };
    }
  } else {
    if (isAMC) {
      if (user?.role !== USER_ROLES.TELECOM_USER) {
        where.status = {
          in: [
            INCIDENT_STATUS.PROCESSED,
            INCIDENT_STATUS.PENDING_TELECOM_ACTION,
          ],
        };
      }
    }
  }

  if (priority && priority !== "Any") {
    where.priority = { equals: priority, mode: "insensitive" };
  }

  if (incidentType && incidentType !== "Any" && !where.incidentType) {
    where.incidentType = {
      name: { equals: incidentType, mode: "insensitive" },
    };
  }

  if (startDate && endDate)
    where.reportedOn = { gte: new Date(startDate), lte: new Date(endDate) };

  const allIncidentsForRange = await prisma.incident.findMany({
    where,
    select: { id: true, shiftDate: true },
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
          where: { id: { in: paginatedIds } },
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

  const updatedIncident = await prisma.$transaction(async (tx) => {
    if (updatedData.action === "UNLOCK_TYPE") {
      await tx.incident.update({
        where: { id: incidentId },
        data: { isTypeLocked: false },
      });
      await tx.auditEntry.create({
        data: {
          incidentId: incidentId,
          timestamp: DateTime.now().toJSDate(),
          author: user.name,
          action: "Type Unlocked",
          comment: "Incident type unlocked for re-assessment.",
        },
      });
      return tx.incident.findUnique({
        where: { id: incidentId },
        include: {
          requestor: { include: { department: true } },
          incidentType: true,
          auditTrail: { orderBy: { timestamp: "asc" } },
        },
      });
    }

    const dataToUpdate = {};
    const auditActionDescription = [];
    let actionText = updatedData.action || "Action Taken";

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
      const incidentType = await tx.incidentType.findUnique({
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

    if (updatedData.rating !== undefined && updatedData.rating !== null) {
      dataToUpdate.rating = parseInt(updatedData.rating, 10);
    } else if (updatedData.rating === null) {
      dataToUpdate.rating = null;
    }

    if (Object.keys(dataToUpdate).length > 0) {
      await tx.incident.update({
        where: { id: incidentId },
        data: dataToUpdate,
      });
    }

    const finalComment = [...auditActionDescription, updatedData.comment]
      .filter(Boolean)
      .join("\n---\n");
    await tx.auditEntry.create({
      data: {
        incidentId: incidentId,
        timestamp: DateTime.now().toJSDate(),
        author: user.name,
        action: actionText,
        comment: finalComment,
        rating: "rating" in dataToUpdate ? dataToUpdate.rating : undefined,
      },
    });

    return tx.incident.findUnique({
      where: { id: incidentId },
      include: {
        requestor: { include: { department: true } },
        incidentType: true,
        auditTrail: { orderBy: { timestamp: "asc" } },
      },
    });
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

// --- NEW DEDICATED FUNCTIONS FOR DASHBOARDS ---

async function getFilteredIncidents(baseWhere, filters) {
  const { startDate, endDate, shift } = filters;
  let where = { ...baseWhere };

  if (startDate && endDate) {
    where.reportedOn = { gte: new Date(startDate), lte: new Date(endDate) };
  }

  const incidents = await prisma.incident.findMany({
    where,
    orderBy: { reportedOn: "desc" },
    include: {
      requestor: { include: { department: true } },
      incidentType: true,
    },
  });

  if (shift && shift !== "All") {
    return incidents.filter((incident) => {
      const incidentHour = DateTime.fromJSDate(incident.shiftDate).setZone(
        "Asia/Kolkata"
      ).hour;
      if (shift === "A") return incidentHour >= 6 && incidentHour < 14;
      if (shift === "B") return incidentHour >= 14 && incidentHour < 22;
      if (shift === "C") return incidentHour >= 22 || incidentHour < 6;
      return true;
    });
  }

  return incidents;
}

export async function getTelecomIncidents(filters) {
  const baseWhere = {
    incidentType: {
      name: {
        equals: INCIDENT_TYPES.NETWORK,
        mode: "insensitive",
      },
    },
    assignedTeam: { equals: TEAMS.TELECOM },
    status: {
      in: [
        INCIDENT_STATUS.PENDING_TELECOM_ACTION,
        INCIDENT_STATUS.RESOLVED,
        INCIDENT_STATUS.CLOSED,
      ],
    },
  };
  return getFilteredIncidents(baseWhere, filters);
}

export async function getEtlIncidents(filters) {
  const baseWhere = {
    incidentType: {
      name: {
        equals: INCIDENT_TYPES.PC_PERIPHERALS,
        mode: "insensitive",
      },
    },
    status: {
      in: [
        INCIDENT_STATUS.PENDING_ETL,
        INCIDENT_STATUS.RESOLVED,
        INCIDENT_STATUS.CLOSED,
      ],
    },
  };
  return getFilteredIncidents(baseWhere, filters);
}

export async function getNetworkAMCIncidents(filters) {
  const baseWhere = {
    incidentType: {
      name: {
        equals: INCIDENT_TYPES.NETWORK,
        mode: "insensitive",
      },
    },
    status: {
      in: [
        INCIDENT_STATUS.PROCESSED,
        INCIDENT_STATUS.PENDING_TELECOM_ACTION,
        INCIDENT_STATUS.RESOLVED,
        INCIDENT_STATUS.CLOSED,
      ],
    },
  };
  return getFilteredIncidents(baseWhere, filters);
}

export async function getAdminDashboardIncidents(filters, user) {
  const baseWhere = {};

  // The helper function now handles all the complex logic
  await applyCategoryFilter(baseWhere, user, filters.category);

  return getFilteredIncidents(baseWhere, filters);
}
