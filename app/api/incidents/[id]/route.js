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
    // The 'id' is now directly accessed from params.id
    const updatePayload = await request.json();
    
    const allIncidents = await getAllIncidents();
    const incidentToUpdate = allIncidents.find(inc => inc.id.toString() === params.id.toString());

    if (!incidentToUpdate) {
        return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    if (incidentToUpdate.status === 'New') {
      updatePayload.status = 'Processed';
    }

    const updatedIncident = await updateIncident(params.id, updatePayload);

    return NextResponse.json(updatedIncident);

  } catch (error) {
    console.error(`Failed to update incident ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}