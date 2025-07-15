import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { headers } from 'next/headers';
import { getAllIncidents, createIncident } from '@/lib/incident-repo';
import { format } from 'date-fns';

// --- NEW FUNCTION to determine the logical date for a shift ---
/**
 * For C-Shift (22:00 - 05:59), incidents after midnight still belong to the previous day's shift.
 * This function returns the correct "logical" date for an incident.
 */
function getLogicalDate() {
  const now = new Date();
  const currentHour = now.getHours(); // Assumes server time is IST or equivalent

  // If the time is between midnight and 5:59 AM, it belongs to the previous day's C-shift.
  if (currentHour < 6) {
    const logicalDate = new Date(now);
    logicalDate.setDate(now.getDate() - 1); // Set date to the previous day
    return logicalDate;
  }

  // Otherwise, it's the correct day.
  return now;
}

// --- MODIFIED to accept the logicalDate ---
/**
 * Generates a unique incident ID in the format: yyyymmddhhmmss-XXXX
 * @param {Date} logicalDate - The date to use for the timestamp portion of the ID.
 */
function generateIncidentId(logicalDate) {
  const timestamp = format(logicalDate, 'yyyyMMddHHmmss');
  const randomHex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `${timestamp}-${randomHex}`;
}

export async function GET() {
  try {
    const incidents = await getAllIncidents();
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Failed in GET /api/incidents:', error);
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
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

    const headersList = headers();
    let ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    if (ip === '::1') {
      ip = '127.0.0.1';
    }

    // --- UPDATED to use the new logical date logic ---
    const logicalDate = getLogicalDate();
    const reportedOnIST = logicalDate.toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
    }).replace(/,/g, '');

    const newIncident = {
      id: generateIncidentId(logicalDate), // Pass logicalDate to the generator
      status: 'New',
      reportedOn: reportedOnIST,
      auditTrail: [],
      incidentType: formData.incidentType,
      priority: formData.priority,
      location: formData.location,
      jobTitle: formData.jobTitle,
      description: formData.description,
      contactNumber: formData.contactNumber,
      requestor: user.name,
      ticketNo: user.id,
      department: user.department,
      emailSail: user.emailSail,
      emailNic: user.emailNic,
      sailpno: user.sailpno,
      jobFrom: user.name,
      ipAddress: ip,
    };

    const createdIncident = await createIncident(newIncident);
    return NextResponse.json(createdIncident, { status: 201 });
  } catch (error) {
    console.error('Failed to create incident:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}