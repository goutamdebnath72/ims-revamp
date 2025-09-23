import { execute } from "./oracle-db.js";
import { DateTime } from "luxon";
import oracledb from "oracledb";
import {
  INCIDENT_STATUS,
  USER_ROLES,
  TEAMS,
  INCIDENT_TYPES,
  SYSTEM_INCIDENT_TYPES,
} from "@/lib/constants.js";

// --- HELPER FUNCTIONS ---

/**
 * Converts Oracle's UPPER_CASE column names to camelCase for the application.
 */
function toCamelCase(obj) {
  if (!obj) return null;
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key
        .toLowerCase()
        .replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
}

/**
 * Formats the raw database row into the nested object structure the app expects.
 */
function formatIncidentOutput(row) {
  if (!row) return null;
  const camelRow = toCamelCase(row);
  return {
    ...camelRow,
    requestor: {
      name: row.REQUESTOR_NAME,
      ticketNo: row.REQUESTOR_TICKET_NO,
      department: { name: row.DEPARTMENT_NAME },
    },
    incidentType: { name: row.INCIDENT_TYPE_NAME },
  };
}

/**
 * Returns the shared list of system incident types.
 */
async function getSystemIncidentTypeNames() {
  return SYSTEM_INCIDENT_TYPES;
}

/**
 * Dynamically adds WHERE clauses for category filtering.
 */
async function applyCategoryFilter(baseWhere, binds, user, categoryFromFilter) {
  const systemTypeNames = await getSystemIncidentTypeNames();
  let effectiveCategory = categoryFromFilter;

  if (user.role === USER_ROLES.ADMIN) {
    effectiveCategory = "general";
  }

  if (systemTypeNames.length > 0) {
    if (effectiveCategory?.toLowerCase() === "general") {
      const placeholders = systemTypeNames
        .map((_, i) => `:cat_type${i}`)
        .join(",");
      baseWhere.push(`it.NAME NOT IN (${placeholders})`);
      systemTypeNames.forEach((name, i) => (binds[`cat_type${i}`] = name));
    } else if (effectiveCategory?.toLowerCase() === "system") {
      const placeholders = systemTypeNames
        .map((_, i) => `:cat_type${i}`)
        .join(",");
      baseWhere.push(`it.NAME IN (${placeholders})`);
      systemTypeNames.forEach((name, i) => (binds[`cat_type${i}`] = name));
    }
  }
}

// --- CORE REPOSITORY FUNCTIONS ---

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
  const offset = (pageNum - 1) * limitNum;

  let whereClauses = [];
  let binds = {};

  await applyCategoryFilter(whereClauses, binds, user, category);

  // Role-based filtering
  if (user?.role === USER_ROLES.STANDARD) {
    whereClauses.push("req.TICKET_NO = :userTicketNo");
    binds.userTicketNo = user.ticketNo;
  }
  // Add other role-based SQL filters from your Prisma file here if needed

  // General Filters from UI
  if (incidentId) {
    whereClauses.push("UPPER(i.ID) LIKE :incidentId");
    binds.incidentId = `%${incidentId.toUpperCase()}%`;
  }

  if (status && status !== "Any") {
    if (status === "open") {
      const openStatuses = [
        INCIDENT_STATUS.NEW,
        INCIDENT_STATUS.PROCESSED,
        INCIDENT_STATUS.PENDING_TELECOM_ACTION,
        INCIDENT_STATUS.PENDING_ETL,
      ];
      const placeholders = openStatuses
        .map((_, i) => `:open_status${i}`)
        .join(",");
      whereClauses.push(`i.STATUS IN (${placeholders})`);
      openStatuses.forEach((s, i) => (binds[`open_status${i}`] = s));
    } else {
      whereClauses.push("i.STATUS = :status");
      binds.status = status;
    }
  }

  if (priority && priority !== "Any") {
    whereClauses.push("i.PRIORITY = :priority");
    binds.priority = priority;
  }

  if (incidentType && incidentType !== "Any") {
    whereClauses.push("it.NAME = :incidentType");
    binds.incidentType = incidentType;
  }

  if (department && department !== "Any") {
    whereClauses.push("d.NAME = :department");
    binds.department = department;
  }

  if (requestor) {
    whereClauses.push(
      "(UPPER(req.NAME) LIKE :requestor OR req.TICKET_NO LIKE :requestor OR req.SAIL_P_NO LIKE :requestor)"
    );
    binds.requestor = `%${requestor.toUpperCase()}%`;
  }

  if (startDate && endDate) {
    whereClauses.push("i.REPORTED_ON BETWEEN :startDate AND :endDate");
    binds.startDate = new Date(startDate);
    binds.endDate = new Date(endDate);
  }

  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // First, get the total count for pagination
  const countSql = `SELECT COUNT(*) as TOTAL FROM INCIDENTS i JOIN USERS req ON i.REQUESTOR_ID = req.ID JOIN DEPARTMENTS d ON req.DEPARTMENT_ID = d.ID JOIN INCIDENT_TYPES it ON i.INCIDENT_TYPE_ID = it.ID ${whereSql}`;
  const { result: countResult } = await execute(countSql, binds);
  const totalIncidents = countResult.rows[0].TOTAL;

  // Then, fetch the paginated data
  const dataSql = `
    SELECT i.*, req.NAME as requestor_name, req.TICKET_NO as requestor_ticket_no, d.NAME as department_name, it.NAME as incident_type_name
    FROM INCIDENTS i
    JOIN USERS req ON i.REQUESTOR_ID = req.ID
    JOIN DEPARTMENTS d ON req.DEPARTMENT_ID = d.ID
    JOIN INCIDENT_TYPES it ON i.INCIDENT_TYPE_ID = it.ID
    ${whereSql}
    ORDER BY i.REPORTED_ON DESC
    OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
  `;
  binds.offset = offset;
  binds.limit = limitNum;

  const { result: dataResult } = await execute(dataSql, binds);

  // Note: Shift filtering is done in JS after the query, matching the original Prisma logic
  const incidents = dataResult.rows;
  const filteredByShift =
    shift && shift !== "Any"
      ? incidents.filter((incident) => {
          const incidentHour = DateTime.fromJSDate(incident.SHIFT_DATE).setZone(
            "Asia/Kolkata"
          ).hour;
          if (shift === "A") return incidentHour >= 6 && incidentHour < 14;
          if (shift === "B") return incidentHour >= 14 && incidentHour < 22;
          if (shift === "C") return incidentHour >= 22 || incidentHour < 6;
          return true;
        })
      : incidents;

  return {
    incidents: filteredByShift.map(formatIncidentOutput),
    currentPage: pageNum,
    totalPages: Math.ceil(totalIncidents / limitNum),
    totalIncidents,
  };
}

export async function createIncident(incidentData, userFromSession) {
  const { result: typeResult } = await execute(
    `SELECT ID FROM INCIDENT_TYPES WHERE NAME = :name`,
    { name: incidentData.incidentType }
  );
  const incidentTypeId = typeResult.rows[0]?.ID;
  if (!incidentTypeId) {
    throw new Error(`Incident type "${incidentData.incidentType}" not found.`);
  }

  const sql = `
    INSERT INTO INCIDENTS (ID, REPORTED_ON, SHIFT_DATE, JOB_TITLE, DESCRIPTION, PRIORITY, STATUS, LOCATION, IP_ADDRESS, JOB_FROM, AFFECTED_TICKET_NO, REQUESTOR_ID, INCIDENT_TYPE_ID)
    VALUES (:id, :reportedOn, :shiftDate, :jobTitle, :description, :priority, 'New', :location, :ipAddress, :jobFrom, :affectedTicketNo, :requestorId, :incidentTypeId)
  `;
  const binds = {
    ...incidentData,
    reportedOn: new Date(incidentData.reportedOn),
    shiftDate: new Date(incidentData.shiftDate),
    requestorId: userFromSession.id,
    incidentTypeId: incidentTypeId,
  };

  await execute(sql, binds, { autoCommit: true });
  return toCamelCase({ ...incidentData, REQUESTOR_ID: userFromSession.id });
}

export async function getIncidentById(incidentId) {
  const incidentSql = `
        SELECT i.*, req.NAME as requestor_name, req.TICKET_NO as requestor_ticket_no, d.NAME as department_name, it.NAME as incident_type_name
        FROM INCIDENTS i
        JOIN USERS req ON i.REQUESTOR_ID = req.ID
        JOIN DEPARTMENTS d ON req.DEPARTMENT_ID = d.ID
        JOIN INCIDENT_TYPES it ON i.INCIDENT_TYPE_ID = it.ID
        WHERE i.ID = :id
    `;
  const { result: incidentResult } = await execute(incidentSql, {
    id: incidentId,
  });
  if (incidentResult.rows.length === 0) return null;

  const auditSql = `SELECT * FROM AUDIT_ENTRIES WHERE INCIDENT_ID = :id ORDER BY TIMESTAMP ASC`;
  const { result: auditResult } = await execute(auditSql, { id: incidentId });

  const incident = formatIncidentOutput(incidentResult.rows[0]);
  incident.auditTrail = auditResult.rows.map(toCamelCase);

  return incident;
}

export async function updateIncident(incidentId, updatedData, user) {
  const { connection } = await execute("", {}, { transaction: true });
  try {
    let updateClauses = [];
    let binds = { id: incidentId };

    if (updatedData.status) {
      updateClauses.push("STATUS = :status");
      binds.status = updatedData.status;
    }
    if (updatedData.assignedTeam) {
      updateClauses.push("ASSIGNED_TEAM = :assignedTeam");
      binds.assignedTeam = updatedData.assignedTeam;
    }
    // Add other potential fields from your Prisma logic here...

    if (updateClauses.length > 0) {
      const updateSql = `UPDATE INCIDENTS SET ${updateClauses.join(
        ", "
      )} WHERE ID = :id`;
      await connection.execute(updateSql, binds);
    }

    const finalComment = updatedData.comment || "No comment provided.";
    const auditSql = `
            INSERT INTO AUDIT_ENTRIES (ID, INCIDENT_ID, TIMESTAMP, AUTHOR, ACTION, COMMENT)
            VALUES (SYS_GUID(), :incidentId, SYSTIMESTAMP, :author, :action, :comment)
        `;
    await connection.execute(auditSql, {
      incidentId: incidentId,
      author: user.name,
      action: updatedData.action || "Action Taken",
      comment: finalComment,
    });

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.error("Transaction rolled back:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
  return getIncidentById(incidentId);
}

export async function editAuditComment(entryId, newComment) {
  const sql = `UPDATE AUDIT_ENTRIES SET COMMENT = :newComment, IS_EDITED = 1, EDITED_AT = SYSTIMESTAMP WHERE ID = :entryId`;
  await execute(sql, { newComment, entryId }, { autoCommit: true });

  const { result } = await execute(
    `SELECT * FROM AUDIT_ENTRIES WHERE ID = :entryId`,
    { entryId }
  );
  return toCamelCase(result.rows[0]);
}

export async function getAllIncidentTypes() {
  const { result } = await execute(
    `SELECT * FROM INCIDENT_TYPES ORDER BY NAME ASC`
  );
  return result.rows.map(toCamelCase);
}

export async function getAllDepartments() {
  const { result } = await execute(
    `SELECT * FROM DEPARTMENTS ORDER BY NAME ASC`
  );
  return result.rows.map(toCamelCase);
}

// --- DASHBOARD FUNCTIONS ---

async function getFilteredIncidentsSQL(baseWhereClauses, baseBinds, filters) {
  const { startDate, endDate, shift } = filters;
  let whereClauses = [...baseWhereClauses];
  let binds = { ...baseBinds };

  if (startDate && endDate) {
    whereClauses.push("i.REPORTED_ON BETWEEN :startDate AND :endDate");
    binds.startDate = new Date(startDate);
    binds.endDate = new Date(endDate);
  }

  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const sql = `
    SELECT i.*, req.NAME as requestor_name, req.TICKET_NO as requestor_ticket_no, d.NAME as department_name, it.NAME as incident_type_name
    FROM INCIDENTS i
    JOIN USERS req ON i.REQUESTOR_ID = req.ID
    JOIN DEPARTMENTS d ON req.DEPARTMENT_ID = d.ID
    JOIN INCIDENT_TYPES it ON i.INCIDENT_TYPE_ID = it.ID
    ${whereSql}
    ORDER BY i.REPORTED_ON DESC
  `;

  const { result } = await execute(sql, binds);
  const allIncidents = result.rows;

  if (shift && shift !== "All") {
    return allIncidents
      .filter((incident) => {
        const incidentHour = DateTime.fromJSDate(incident.SHIFT_DATE).setZone(
          "Asia/Kolkata"
        ).hour;
        if (shift === "A") return incidentHour >= 6 && incidentHour < 14;
        if (shift === "B") return incidentHour >= 14 && incidentHour < 22;
        if (shift === "C") return incidentHour >= 22 || incidentHour < 6;
        return true;
      })
      .map(formatIncidentOutput);
  }
  return allIncidents.map(formatIncidentOutput);
}

export async function getTelecomIncidents(filters) {
  const baseWhere = [
    `it.NAME = :incidentType`,
    `i.ASSIGNED_TEAM = :assignedTeam`,
    `i.STATUS IN (:status1, :status2, :status3)`,
  ];
  const baseBinds = {
    incidentType: INCIDENT_TYPES.NETWORK,
    assignedTeam: TEAMS.TELECOM,
    status1: INCIDENT_STATUS.PENDING_TELECOM_ACTION,
    status2: INCIDENT_STATUS.RESOLVED,
    status3: INCIDENT_STATUS.CLOSED,
  };
  return getFilteredIncidentsSQL(baseWhere, baseBinds, filters);
}

export async function getEtlIncidents(filters) {
  const baseWhere = [
    `it.NAME = :incidentType`,
    `i.STATUS IN (:status1, :status2, :status3)`,
  ];
  const baseBinds = {
    incidentType: INCIDENT_TYPES.PC_PERIPHERALS,
    status1: INCIDENT_STATUS.PENDING_ETL,
    status2: INCIDENT_STATUS.RESOLVED,
    status3: INCIDENT_STATUS.CLOSED,
  };
  return getFilteredIncidentsSQL(baseWhere, baseBinds, filters);
}

export async function getNetworkAMCIncidents(filters) {
  const baseWhere = [
    `it.NAME = :incidentType`,
    `i.STATUS IN (:status1, :status2, :status3, :status4)`,
  ];
  const baseBinds = {
    incidentType: INCIDENT_TYPES.NETWORK,
    status1: INCIDENT_STATUS.PROCESSED,
    status2: INCIDENT_STATUS.PENDING_TELECOM_ACTION,
    status3: INCIDENT_STATUS.RESOLVED,
    status4: INCIDENT_STATUS.CLOSED,
  };
  return getFilteredIncidentsSQL(baseWhere, baseBinds, filters);
}

export async function getAdminDashboardIncidents(filters, user) {
  let baseWhere = [];
  let baseBinds = {};
  await applyCategoryFilter(baseWhere, baseBinds, user, filters.category);
  return getFilteredIncidentsSQL(baseWhere, baseBinds, filters);
}
