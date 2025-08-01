import prisma from "./prisma.js";
import { DateTime } from "luxon";
import { isSystemIncident } from "./incident-helpers.js";

// This function fetches all incidents and includes all related data
export async function getAllIncidents(filters = {}) {
  const {
    page = 1,
    limit = "20", // Default limit as a string
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
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  // Dynamically build the 'where' clause for the query
  if (incidentId) where.id = { contains: incidentId, mode: 'insensitive' };
  if (status && status !== 'Any' && status !== 'open') where.status = status;
  if (status === 'open') where.status = { in: ['New', 'Processed'] };
  if (priority && priority !== 'Any') where.priority = { equals: priority };
  if (incidentType && incidentType !== 'Any') where.incidentType = { name: { equals: incidentType } };
  if (startDate && endDate) where.reportedOn = { gte: new Date(startDate), lte: new Date(endDate) };
  
  // Handle complex nested filters for requestor and department
  const requestorConditions = [];
  if (department && department !== 'Any') {
    requestorConditions.push({ department: { name: { equals: department } } });
  }
  if (requestor) {
    requestorConditions.push({
      OR: [
        { name: { contains: requestor, mode: 'insensitive' } },
        { ticketNo: { contains: requestor, mode: 'insensitive' } },
        { sailPNo: { contains: requestor, mode: 'insensitive' } },
      ],
    });
  }
  if (requestorConditions.length > 0) {
    where.requestor = { AND: requestorConditions };
  }
  
  // Handle special category filtering
  if (category && category !== "Any") {
    const allTypes = await prisma.incidentType.findMany({ select: { name: true } });
    const systemTypeNames = allTypes.filter(t => isSystemIncident({ incidentType: t.name })).map(t => t.name);
    
    if (category === "System") {
      where.incidentType = { name: { in: systemTypeNames } };
    } else if (category === "General") {
      where.incidentType = { name: { notIn: systemTypeNames } };
    }
  }

  // Define 'take' for pagination. If limit is 0, it becomes 'undefined' to fetch all.
  const take = limitNum === 0 ? undefined : limitNum;

  // Run both queries in parallel for efficiency
  const [incidents, totalIncidents] = await prisma.$transaction([
    prisma.incident.findMany({
      where,
      skip: limitNum === 0 ? 0 : skip, // Skip should be 0 if fetching all
      take,
      orderBy: { reportedOn: "desc" },
      include: {
        requestor: { include: { department: true } },
        incidentType: true,
      },
    }),
    prisma.incident.count({ where }),
  ]);
  
  // FIX: Correctly calculate totalPages, avoiding division by zero
  const totalPages = limitNum > 0 ? Math.ceil(totalIncidents / limitNum) : 1;

  return {
    incidents,
    currentPage: pageNum,
    totalPages,
    totalIncidents,
  };
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

  // This block sets the correct action text for resolution/closure
  if (updatedData.status === "Resolved") {
    actionText = "Resolved";
  } else if (updatedData.status === "Closed") {
    actionText = "Closed";
  }

  const finalComment = [...auditActionDescription, updatedData.comment]
    .filter(Boolean)
    .join("\n---\n");

  const auditEntryData = {
    timestamp: DateTime.now().toJSDate(),
    author: user.name,
    action: actionText,
    comment: finalComment,
  };

  if (updatedData.rating) {
    auditEntryData.rating = updatedData.rating;
  }

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
      editedAt: DateTime.now().toJSDate(), // Set the edit time to now
    },
  });
  return updatedEntry;
}

// This function fetches all incident types from the database, sorted alphabetically.
export async function getAllIncidentTypes() {
  const incidentTypes = await prisma.incidentType.findMany({
    orderBy: {
      name: "asc", // Sort alphabetically
    },
  });
  return incidentTypes;
}

// This function fetches all departments from the database, sorted alphabetically.
export async function getAllDepartments() {
  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return departments;
}
