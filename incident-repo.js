import { kv } from '@vercel/kv';
import path from 'path';
import { promises as fs } from 'fs';

// This function is special. It will automatically upload your initial data
// from incidents.json the very first time it's called.
async function seedInitialData() {
  try {
    const dataFilePath = path.join(process.cwd(), 'lib/incidents.json');
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const initialIncidents = JSON.parse(fileContents);
    
    await kv.set('incidents', initialIncidents);
    
    return initialIncidents;
  } catch (error) {
    console.error('Error seeding initial data:', error);
    return [];
  }
}

/**
 * Fetches all incidents from the KV store.
 * If the store is empty, it seeds it with data from incidents.json.
 * @returns {Promise<Array>} A promise that resolves to the array of incidents.
 */
export async function getAllIncidents() {
  let incidents = await kv.get('incidents');
  if (incidents === null) {
    // If database is empty, seed it from the local JSON file.
    incidents = await seedInitialData();
  }
  return incidents || [];
}

/**
 * Creates a new incident by adding it to the list in the KV store.
 * @param {object} fullIncidentObject - The complete new incident object to save.
 * @returns {Promise<object>} A promise that resolves to the newly created incident.
 */
export async function createIncident(fullIncidentObject) {
  const allIncidents = await getAllIncidents();
  allIncidents.unshift(fullIncidentObject);
  await kv.set('incidents', allIncidents);
  return fullIncidentObject;
}

/**
 * Updates an existing incident in the KV store.
 * @param {string} incidentId - The ID of the incident to update.
 * @param {object} updateData - An object containing the fields to update.
 * @returns {Promise<object|null>} A promise that resolves to the updated incident, or null if not found.
 */
export async function updateIncident(incidentId, updateData) {
  const allIncidents = await getAllIncidents();
  const incidentIndex = allIncidents.findIndex(inc => inc.id.toString() === incidentId.toString());

  if (incidentIndex === -1) {
    return null; // Incident not found
  }

  // Combine the old incident with the new data
  const updatedIncident = { ...allIncidents[incidentIndex], ...updateData };
  allIncidents[incidentIndex] = updatedIncident;

  await kv.set('incidents', allIncidents);
  return updatedIncident;
}