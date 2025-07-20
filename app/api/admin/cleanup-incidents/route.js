import { NextResponse } from "next/server";
import { kv } from '@vercel/kv';
import { DateTime } from 'luxon';

// This is a special, one-time-use API route to clean up your incident data.
// It will delete all incidents that have an incorrect 12-hour time format
// and keep only those with the correct 24-hour format.

export async function GET() {
  try {
    // 1. Fetch all incidents currently in the database
    const allIncidents = await kv.get('incidents');

    if (!allIncidents || allIncidents.length === 0) {
      return NextResponse.json({
        message: "Database is empty. No cleanup needed.",
        count: 0,
      });
    }

    // 2. Filter the incidents to keep only those with the correct 24-hour format.
    const cleanedIncidents = allIncidents.filter(incident => {
      if (!incident.reportedOn || typeof incident.reportedOn !== 'string') {
        return false; // Remove incidents with missing or invalid reportedOn field
      }
      // The correct format is "dd MMM yyyy HH:mm" (e.g., "20 Jul 2025 14:30")
      const dt = DateTime.fromFormat(incident.reportedOn, "dd MMM yyyy HH:mm", { zone: 'Asia/Kolkata' });
      // Keep the incident only if the date is valid according to the 24-hour format
      return dt.isValid;
    });

    // 3. Check if any changes were actually made
    if (cleanedIncidents.length === allIncidents.length) {
      return NextResponse.json({
        message: "Cleanup not needed. All incidents already have the correct 24-hour format.",
        count: allIncidents.length,
      });
    }

    // 4. Save the cleaned array back to the Vercel KV store.
    // This will overwrite the old, larger list.
    await kv.set('incidents', cleanedIncidents);

    // 5. Return a success message.
    return NextResponse.json({
      message: "Cleanup successful! Removed incidents with incorrect 12-hour time format.",
      originalCount: allIncidents.length,
      newCount: cleanedIncidents.length,
      deletedCount: allIncidents.length - cleanedIncidents.length,
    });

  } catch (error) {
    console.error("Error during cleanup:", error);
    return NextResponse.json(
      { error: "An error occurred during the cleanup process." },
      { status: 500 }
    );
  }
}