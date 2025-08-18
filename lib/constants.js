export const INCIDENT_STATUS = {
  NEW: "New",
  PROCESSED: "Processed",
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
  NETWORK_VENDOR: "network_vendor",
  BIOMETRIC_VENDOR: "biometric_vendor",
  TELECOM: "telecom",
  ETL: "etl",
};

export const AUDIT_ACTIONS = {
  PASSWORD_RESET: "Password Reset",
  ACTION_TAKEN: "Action Taken",
  EDIT_COMMENT: "editAuditComment",
  REFERRED_TO_TELECOM: 'Referred to Telecom',
};

export const INCIDENT_TYPES = {
  ESS_PASSWORD: "ESS Password",
  NETWORK: 'NETWORK',
};

export const DIALOG_CONTEXTS = {
  ADMIN_RESOLVE_CLOSE: 'admin_resolve_close',
  USER_CLOSE: 'user_close',
  USER_CONFIRM_RESOLUTION: 'user_confirm_resolution',
};

export const RESOLUTION_ACTIONS = {
  RESOLVE: 'resolve',
  CLOSE: 'close',
  RE_OPEN: 're_open',
  ACCEPT_CLOSE: 'accept_close',
};

// New object for team names
export const TEAMS = {
  CIT: 'C&IT',
  TELECOM: 'Telecom',
  ETL: 'ETL',
};
