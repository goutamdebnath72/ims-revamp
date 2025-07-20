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
  if (!incident || !incident.incidentType) return false;
  return SYSTEM_INCIDENT_TYPES.includes(incident.incidentType);
};

const getDateFromReportedOn = (reportedOnString) => {
  if (typeof reportedOnString !== "string") return null;
  try {
    const date = DateTime.fromFormat(reportedOnString, "dd MMM yyyy HH:mm", {
      zone: "Asia/Kolkata",
    });
    return date.isValid ? date : null;
  } catch {
    return null;
  }
};

export const filterIncidents = (incidents, criteria, user) => {
  return incidents.filter((incident) => {
    // *** FIX: ADDED A NEW ROLE-BASED PRE-FILTER ***
    // For network vendors, immediately exclude any incident that is still "New".
    if (user?.role === "network_vendor" && incident.status === "New") {
      return false;
    }

    const reportedDate = getDateFromReportedOn(incident.reportedOn);
    if (!reportedDate) return false;

    // 1. Date Range Check
    if (
      criteria.dateRange &&
      criteria.dateRange.start &&
      criteria.dateRange.end
    ) {
      const start = DateTime.fromJSDate(criteria.dateRange.start).startOf(
        "day"
      );
      const end = DateTime.fromJSDate(criteria.dateRange.end).endOf("day");
      if (reportedDate < start || reportedDate > end) return false;
    }

    // 2. Shift Check
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

    // 3. Status Check
    if (criteria.status === "open") {
      if (incident.status !== "New" && incident.status !== "Processed")
        return false;
    } else if (criteria.status && criteria.status !== "Any") {
      if (incident.status !== criteria.status) return false;
    }

    // 4. Advanced Search & Role Logic
    if (user) {
      const isSys = isSystemIncident(incident);
      if (user.role === "user" && incident.requestor !== user.name)
        return false;
      if (user.role === "admin" && isSys) return false;

      const category =
        user.role === "sys_admin" ? criteria.category : "general";
      if (category?.toLowerCase() === "system" && !isSys) return false;
      if (category?.toLowerCase() === "general" && isSys) return false;

      const idMatch = criteria.incidentId
        ? incident.id.toString().includes(criteria.incidentId)
        : true;
      const priorityMatch =
        criteria.priority && criteria.priority !== "Any"
          ? incident.priority === criteria.priority
          : true;
      const typeMatch =
        criteria.incidentType && criteria.incidentType !== "Any"
          ? incident.incidentType === criteria.incidentType
          : true;
      const departmentMatch =
        criteria.department && criteria.department !== "Any"
          ? incident.department === criteria.department
          : true;
      let requestorMatch = true;
      if (
        (user.role === "admin" || user.role === "sys_admin") &&
        criteria.requestor
      ) {
        requestorMatch = incident.requestor
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
