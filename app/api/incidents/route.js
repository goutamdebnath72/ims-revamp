import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { headers } from 'next/headers';
import path from 'path';
import { promises as fs } from 'fs';

const dataFilePath = path.join(process.cwd(), 'lib/incidents.json');

async function getIncidents() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function GET() {
  try {
    const incidents = await getIncidents();
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Failed to read incidents data:', error);
    return NextResponse.json({ error: 'Failed to read incidents data' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const user = session.user;
    
    let ip = headers().get('x-forwarded-for') || '127.0.0.1';

    if (ip === '::1') {
      ip = '127.0.0.1';
    }

    let incidents = await getIncidents();

    const newIncident = {
      incidentType: formData.incidentType,
      priority: formData.priority,
      location: formData.location,
      jobTitle: formData.jobTitle,
      description: formData.description,
      contactNumber: formData.contactNumber,
      id: Date.now(),
      status: 'New',
      reportedOn: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).replace(/,/g, ''),
      requestor: user.name,
      ticketNo: user.id,
      department: user.department,
      emailSail: user.emailSail,
      emailNic: user.emailNic,
      // UPDATED to use 'sailpno' (all lowercase)
      sailpno: user.sailpno,
      jobFrom: user.name,
      ipAddress: ip,
      auditTrail: [],
    };

    incidents.unshift(newIncident);

    // await fs.writeFile(dataFilePath, JSON.stringify(incidents, null, 2));

    return NextResponse.json(newIncident, { status: 201 });
  } catch (error) {
    console.error('Failed to create incident:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}