// This file centralizes the logic for categorizing incidents.
import { DateTime } from "luxon";

export const SYSTEM_INCIDENT_TYPES = [
  "SAP FUNCTIONAL",
  "SAP FUNCTIONAL - BI",
  "SAP FUNCTIONAL - CO",
  "SAP FUNCTIONAL - FI",
  "SAP FUNCTIONAL - MM/SRM",
  "SAP FUNCTIONAL - PM",
  "SAP FUNCTIONAL - PP",
  "SAP FUNCTIONAL - QM",
  "SAP FUNCTIONAL - RE",
  "SAP FUNCTIONAL - SD",
  "SAP-CHANGE MGMT(TR)",
  "SAP-ROLE MGMT",
  "SAP-USER ACCESS MGMT",
  "JAGRITI",
  "SBI PAYMENT GATEWAY",
];

export const isSystemIncident = (incident) => {
  if (!incident || !incident.incidentType?.name) return false;
  return SYSTEM_INCIDENT_TYPES.includes(incident.incidentType.name);
};

const getDateFromReportedOn = (reportedOnString) => {
  if (typeof reportedOnString !== "string") return null;
  try {
    const date = DateTime.fromISO(reportedOnString, { zone: "Asia/Kolkata" });

    return date.isValid ? date : null;
  } catch {
    return null;
  }
};

export const filterIncidents = (incidents, criteria, user) => {
  return incidents.filter((incident) => {
    if (user?.role === "network_amc" && incident.status === "New") {
      return false;
    }

    const reportedDate = getDateFromReportedOn(incident.reportedOn);
    if (!reportedDate) return false;

    // Date Range Check
    // This now correctly skips the filter if start or end date is missing.
    if (criteria.dateRange?.start && criteria.dateRange?.end) {
      const start = criteria.dateRange.start.startOf("day");
      const end = criteria.dateRange.end.endOf("day");

      if (reportedDate < start || reportedDate > end) {
        return false;
      }
    }

    // Shift Check
    if (
      criteria.shift &&
      criteria.shift !== "Any" &&
      criteria.shift !== "All"
    ) {
      const hour = reportedDate.hour;
      const shift = criteria.shift;
      if (shift === "A" && !(hour >= 6 && hour < 14)) return false;
      if (shift === "B" && !(hour >= 14 && hour < 22)) return false;
      if (shift === "C" && !(hour >= 22 || hour < 6)) return false;
    }

    // Status Check
    if (criteria.status === "open") {
      if (incident.status !== "New" && incident.status !== "Processed")
        return false;
    } else if (criteria.status && criteria.status !== "Any") {
      if (incident.status !== criteria.status) return false;
    }

    // Advanced Search & Role Logic
    if (user) {
      const isSys = isSystemIncident(incident);

      const idMatch = criteria.incidentId
        ? incident.id.toString().includes(criteria.incidentId)
        : true;

      const priorityMatch =
        criteria.priority && criteria.priority !== "Any"
          ? incident.priority === criteria.priority
          : true;

      // FIX: Check the 'name' property of the nested incidentType object
      const typeMatch =
        criteria.incidentType && criteria.incidentType !== "Any"
          ? incident.incidentType.name === criteria.incidentType
          : true;

      // FIX: Check the 'name' property of the nested department object from the requestor
      const departmentMatch =
        criteria.department && criteria.department !== "Any"
          ? incident.requestor.department.name === criteria.department
          : true;

      // FIX: Check the 'name' property of the nested requestor object
      let requestorMatch = true;
      if (
        (user.role === "admin" || user.role === "sys_admin") &&
        criteria.requestor
      ) {
        requestorMatch = incident.requestor?.name
          ?.toLowerCase()
          .includes(criteria.requestor.toLowerCase());
      }

      if (
        !(
          idMatch &&
          requestorMatch &&
          priorityMatch &&
          typeMatch &&
          departmentMatch
        )
      )
        return false;
    }

    return true;
  });
};
