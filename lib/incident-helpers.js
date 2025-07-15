// This file centralizes the logic for categorizing incidents.

import {
  isWithinInterval,
  startOfDay,
  endOfDay,
  getHours,
  isValid,
} from "date-fns";

// These are the incident types exclusively handled by C&IT Executives.
const SYSTEM_INCIDENT_TYPES = [
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
  "JAGRITI", // Added as per your instruction
  "SBI PAYMENT GATEWAY", // Added as per your instruction
];

/**
 * Checks if an incident is a "System Incident" based on its type.
 * @param {object} incident - The incident object.
 * @returns {boolean} - True if it's a system incident, false otherwise.
 */
export const isSystemIncident = (incident) => {
  if (!incident || !incident.incidentType) {
    return false;
  }
  return SYSTEM_INCIDENT_TYPES.includes(incident.incidentType);
};

// This helper function gets a Date object from the new ID format.
const getDateFromId = (id) => {
  if (typeof id !== "string" || id.length < 14) return null;
  try {
    const y = id.substring(0, 4);
    const m = id.substring(4, 6);
    const d = id.substring(6, 8);
    const h = id.substring(8, 10);
    const min = id.substring(10, 12);
    const s = id.substring(12, 14);
    const date = new Date(y, m - 1, d, h, min, s);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

// --- THIS IS THE NEW MASTER FILTERING FUNCTION ---
export const filterIncidents = (incidents, criteria, user) => {
  // Helper function to get a valid Date object from our new ID format.
  const getDateFromId = (id) => {
    if (typeof id !== "string" || id.length < 14) return null;
    try {
      const y = id.substring(0, 4);
      const m = id.substring(4, 6);
      const d = id.substring(6, 8);
      const h = id.substring(8, 10);
      const min = id.substring(10, 12);
      const s = id.substring(12, 14);
      const date = new Date(y, m - 1, d, h, min, s);
      return isValid(date) ? date : null;
    } catch {
      return null;
    }
  };

  return incidents.filter((incident) => {
    // --- START OF DEBUGGING CODE ---
    if (incident.id.startsWith("202507151827")) {
      console.log("--- DEBUGGING INCIDENT 202507151827 ---");
      const reportedDate = getDateFromId(incident.id);
      console.log("Criteria Received:", JSON.parse(JSON.stringify(criteria)));
      console.log("Parsed Date:", reportedDate?.toString());
      if (reportedDate) {
        const hour = getHours(reportedDate);
        console.log("Extracted Hour:", hour);
        const shift = criteria.shift;
        console.log("Shift Criteria:", shift);
        if (shift === "B") {
          const isInBShift = hour >= 14 && hour < 22;
          console.log("Is in B Shift Range? ->", isInBShift);
        }
      }
      console.log("------------------------------------");
    }
    // --- END OF DEBUGGING CODE ---

    const reportedDate = getDateFromId(incident.id);
    if (!reportedDate) return false;

    if (
      criteria.dateRange &&
      criteria.dateRange.start &&
      criteria.dateRange.end
    ) {
      if (
        !isWithinInterval(reportedDate, {
          start: startOfDay(criteria.dateRange.start),
          end: endOfDay(criteria.dateRange.end),
        })
      ) {
        return false;
      }
    }

    if (
      criteria.shift &&
      criteria.shift !== "Any" &&
      criteria.shift !== "All"
    ) {
      const hour = getHours(reportedDate);
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
        const searchTerm = criteria.requestor.toLowerCase();
        const requestorName = incident.requestor || "";
        requestorMatch = requestorName.toLowerCase().includes(searchTerm);
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
