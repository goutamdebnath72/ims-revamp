import * as localRepo from './incident-repo-local';
import * as kvRepo from './incident-repo-kv';

// ---  DATABASE TOGGLE ---
// Set this to 'true' to use the live Vercel KV database.
// Set this to 'false' to use the local 'incidents.json' file.
const useKV = true; 

const repo = useKV ? kvRepo : localRepo;

export const getAllIncidents = repo.getAllIncidents;
export const createIncident = repo.createIncident;
export const getIncidentById = repo.getIncidentById;
export const updateIncident = repo.updateIncident;