import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import path from 'path';
import { promises as fs } from 'fs';

const dataFilePath = path.join(process.cwd(), 'lib/incidents.json');

async function getIncidents() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// This is the PATCH function that will handle updates
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const user = session.user;
    
    let incidents = await getIncidents();
    const incidentIndex = incidents.findIndex(inc => inc.id.toString() === id);

    if (incidentIndex === -1) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    let incidentToUpdate = incidents[incidentIndex];

    // Check if status should be changed from "New" to "Processed"
    if (incidentToUpdate.status === 'New') {
      body.status = 'Processed';
    }

    // Combine the old data with the new updated data
    const updatedIncident = { ...incidentToUpdate, ...body };

    // Replace the old incident with the updated one in the array
    incidents[incidentIndex] = updatedIncident;

    // Write the entire updated list back to the file
    await fs.writeFile(dataFilePath, JSON.stringify(incidents, null, 2));

    return NextResponse.json(updatedIncident);

  } catch (error) {
    console.error(`Failed to update incident ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}