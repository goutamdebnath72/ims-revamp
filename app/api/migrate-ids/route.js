import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { format, parse } from "date-fns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Helper function to generate our new ID format
function generateNewIdFromDate(dateObject) {
  const timestamp = format(dateObject, "yyyyMMddHHmmss");
  const randomHex = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
  return `${timestamp}-${randomHex}`;
}

// Helper function to try parsing all known date formats in the database
// Helper function to try parsing all known date formats in the database
function parseFlexibleDate(dateString) {
  // First, clean the input string to remove extra whitespace
  const cleanedDateString = dateString.trim().replace(/\s+/g, " ");

  // ---- THIS IS THE NEW LINE TO ADD ----
  console.log("Attempting to parse cleaned date:", `"${cleanedDateString}"`);

  const formats = [
    "dd MMM yy, h:mm a", // Handles "14 Jul 25, 6:30 PM"
    "dd MMM yyyy, HH:mm", // Handles "14 Jul 2025, 18:30"
    "dd MMM yyyy HH:mm", // Handles "12 Jul 2025 10:11" (no comma)
  ];

  for (const fmt of formats) {
    const date = parse(cleanedDateString, fmt, new Date());
    if (!isNaN(date)) {
      return date; // Return the first valid date found
    }
  }

  return null; // Return null if no format works
}

// This is the main function that runs when you visit the API route
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "sys_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("--- Starting Incident ID Migration ---");

    const incidents = (await kv.get("incidents")) || [];
    if (incidents.length === 0) {
      return NextResponse.json({ message: "No incidents found to migrate." });
    }
    console.log(`Found ${incidents.length} total incidents.`);

    const backupKey = `incidents_backup_${format(
      new Date(),
      "yyyyMMddHHmmss"
    )}`;
    await kv.set(backupKey, incidents);
    console.log(`Successfully created backup at key: ${backupKey}`);

    let migratedCount = 0;
    const migratedIncidents = incidents.map((incident) => {
      // Check if the ID needs migration
      if (typeof incident.id === "number" || String(incident.id).length < 15) {
        const reportedOnDate = parseFlexibleDate(incident.reportedOn);

        if (!reportedOnDate) {
          console.warn(
            `FINAL SKIP: Could not parse date for incident ID ${incident.id}, Date: "${incident.reportedOn}"`
          );
          return incident;
        }

        const newId = generateNewIdFromDate(reportedOnDate);
        migratedCount++;
        return { ...incident, id: newId };
      }
      return incident;
    });
    console.log(`Migrated ${migratedCount} incident IDs.`);

    await kv.set("incidents", migratedIncidents);
    console.log("Successfully saved migrated data.");

    return NextResponse.json({
      status: "Success",
      message: `Migration complete. Backed up current state to '${backupKey}'. Migrated ${migratedCount} incidents.`,
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      { error: "Migration failed. Check server logs." },
      { status: 500 }
    );
  }
}
