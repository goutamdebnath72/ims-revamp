import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getAllIncidents, updateIncident } from '@/lib/incident-repo';

// This is the PATCH function that will handle updates
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const updatePayload = await request.json(); // This is the data from the form
    
    // To check the current status, we must first get the full incident list
    const allIncidents = await getAllIncidents();
    const incidentToUpdate = allIncidents.find(inc => inc.id.toString() === id.toString());

    if (!incidentToUpdate) {
        return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Now, check the status of the incident we found
    if (incidentToUpdate.status === 'New') {
      // If it's 'New', add the 'Processed' status to our update payload
      updatePayload.status = 'Processed';
    }

    // Use our repository function to update the incident with the full payload
    const updatedIncident = await updateIncident(id, updatePayload);

    return NextResponse.json(updatedIncident);

  } catch (error) {
    console.error(`Failed to update incident ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}