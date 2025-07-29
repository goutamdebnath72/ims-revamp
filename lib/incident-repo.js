import * as localRepo from './incident-repo-local.js';
import * as kvRepo from './incident-repo-kv.js';
import * as prismaRepo from './incident-repo-prisma.js'; // 1. Import the new repo


// ---  DATABASE TOGGLE ---
// Change this value to switch between data sources: 'prisma', 'kv', or 'local'
const dbSource = 'prisma'; // 2. Set this to 'prisma' to use your new database

let repo;
switch (dbSource) {
  case 'prisma':
    repo = prismaRepo;
    break;
  case 'kv':
    repo = kvRepo;
    break;
  default:
    repo = localRepo;
    break;
}

export const getAllIncidents = repo.getAllIncidents;
export const createIncident = repo.createIncident;
export const getIncidentById = repo.getIncidentById;
export const updateIncident = repo.updateIncident;
export const getAllIncidentTypes = repo.getAllIncidentTypes;
export const getAllDepartments = repo.getAllDepartments;

export const editAuditComment = repo.editAuditComment;
