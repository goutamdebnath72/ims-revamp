export const INCIDENT_STATUS = {
  NEW: "New",
  PROCESSED: "Processed",
  PENDING_TELECOM_ACTION: "Pending Telecom Action", // ADDED THIS
  PENDING_ETL: "Pending ETL Action",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const INCIDENT_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const USER_ROLES = {
  ADMIN: "admin",
  SYS_ADMIN: "sys_admin",
  NETWORK_AMC: "network_amc",
  BIOMETRIC_AMC: "biometric_amc",
  ETL: "etl",
  TELECOM_USER: "telecom_user",
  STANDARD: "standard",
};

export const AUDIT_ACTIONS = {
  PASSWORD_RESET: "Password Reset",
  ACTION_TAKEN: "Action Taken",
  EDIT_COMMENT: "editAuditComment",
};

export const INCIDENT_TYPES = {
  ESS_PASSWORD: "ESS PASSWORD",
  NETWORK: "NETWORK",
  PC_PERIPHERALS: "PC & PERIPHERALS",
};

export const DIALOG_CONTEXTS = {
  ADMIN_RESOLVE_CLOSE: "admin_resolve_close",
  USER_CLOSE: "user_close",
  USER_CONFIRM_RESOLUTION: "user_confirm_resolution",
};

export const RESOLUTION_ACTIONS = {
  RESOLVE: "resolve",
  CLOSE: "close",
  RE_OPEN: "re_open",
  ACCEPT_CLOSE: "accept_close",
};

// New object for team names
export const TEAMS = {
  CIT: "C&IT",
  ETL: "ETL",
  TELECOM: "Telecom", // ADDED THIS
};

// Controlling the number of incident will display per page in 'Search & Archive' page
export const DEFAULT_PAGE_SIZE = 10;

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
