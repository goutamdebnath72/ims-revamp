// This file centralizes the logic for categorizing incidents.
import { DateTime } from "luxon";
import { SYSTEM_INCIDENT_TYPES } from "@/lib/constants";

export const isSystemIncident = (incident) => {
  if (!incident || !incident.incidentType) return false;

  const incidentTypeName =
    typeof incident.incidentType === "object"
      ? incident.incidentType.name
      : incident.incidentType;

  if (!incidentTypeName) return false;

  // ✅ FIX: The check is now case-insensitive.
  // It converts both the incoming type name and the values from your
  // constants to lowercase before comparing them.
  const lowerCaseTypeName = incidentTypeName.toLowerCase();
  return SYSTEM_INCIDENT_TYPES.some(
    (systemType) => systemType.toLowerCase() === lowerCaseTypeName
  );
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

    if (criteria.dateRange?.start && criteria.dateRange?.end) {
      const start = criteria.dateRange.start.startOf("day");
      const end = criteria.dateRange.end.endOf("day");

      if (reportedDate < start || reportedDate > end) {
        return false;
      }
    }

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

    if (criteria.status === "open") {
      if (incident.status !== "New" && incident.status !== "Processed")
        return false;
    } else if (criteria.status && criteria.status !== "Any") {
      if (incident.status !== criteria.status) return false;
    }

    if (user) {
      const isSys = isSystemIncident(incident);
      const idMatch = criteria.incidentId
        ? incident.id.toString().includes(criteria.incidentId)
        : true;
      const priorityMatch =
        criteria.priority && criteria.priority !== "Any"
          ? incident.priority === criteria.priority
          : true;
      const typeMatch =
        criteria.incidentType && criteria.incidentType !== "Any"
          ? incident.incidentType.name === criteria.incidentType
          : true;
      const departmentMatch =
        criteria.department && criteria.department !== "Any"
          ? incident.requestor.department.name === criteria.department
          : true;
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
