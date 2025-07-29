import fs from 'fs/promises';
import path from 'path';

// Define the path to our local JSON database file
const dbPath = path.join(process.cwd(), 'lib', 'incidents.json');

// Helper function to read all incidents from the JSON file
async function readDb() {
  try {
    const fileData = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write all incidents to the JSON file
async function writeDb(data) {
  // The `null, 2` argument makes the JSON file human-readable
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

// --- Exported Functions ---

export async function getAllIncidents() {
  return await readDb();
}

export async function createIncident(newIncident) {
  const incidents = await getAllIncidents();
  incidents.unshift(newIncident); // Add the new incident to the top of the list
  await writeDb(incidents);
  return newIncident;
}

export async function getIncidentById(id) {
  const incidents = await getAllIncidents();
  return incidents.find(inc => inc.id === id) || null;
}

export async function updateIncident(id, updatePayload) {
  const incidents = await getAllIncidents();
  const incidentIndex = incidents.findIndex(inc => inc.id === id);

  if (incidentIndex === -1) {
    throw new Error('Incident not found');
  }

  // Merge the existing incident with the new data
  const updatedIncident = {
    ...incidents[incidentIndex],
    ...updatePayload,
  };

  incidents[incidentIndex] = updatedIncident;
  await writeDb(incidents);
  return updatedIncident;
}

// Add this dummy function to satisfy the interface
export async function getAllIncidentTypes() {
  // KV store doesn't have a separate table for this. Return empty.
  return [];
}

export async function getAllDepartments() {
  return [];
}