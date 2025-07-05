// This file centralizes the logic for categorizing incidents.

// These are the incident types exclusively handled by C&IT Executives.
const SYSTEM_INCIDENT_TYPES = [
  'SAP FUNCTIONAL',
  'SAP FUNCTIONAL - BI',
  'SAP FUNCTIONAL - CO',
  'SAP FUNCTIONAL - FI',
  'SAP FUNCTIONAL - MM/SRM',
  'SAP FUNCTIONAL - PM',
  'SAP FUNCTIONAL - PP',
  'SAP FUNCTIONAL - QM',
  'SAP FUNCTIONAL - RE',
  'SAP FUNCTIONAL - SD',
  'SAP-CHANGE MGMT(TR)',
  'SAP-ROLE MGMT',
  'SAP-USER ACCESS MGMT',
  'JAGRITI', // Added as per your instruction
  'SBI PAYMENT GATEWAY', // Added as per your instruction
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