const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@vercel/kv");
const { DateTime } = require("luxon");

const prisma = new PrismaClient();
const kv = createClient({
  url: process.env._KV_REST_API_URL,
  token: process.env._KV_REST_API_TOKEN,
});

async function main() {
  console.log("Starting migration from Vercel KV to PostgreSQL...");

  const incidentsFromKV = await kv.get("incidents");

  if (!incidentsFromKV || incidentsFromKV.length === 0) {
    console.log("No incidents found in Vercel KV. Migration finished.");
    return;
  }

  let migratedCount = 0;
  for (const incident of incidentsFromKV) {
    const requestor = await prisma.user.findUnique({
      where: { ticketNo: incident.ticketNo },
    });
    const incidentType = await prisma.incidentType.findUnique({
      where: { name: incident.incidentType },
    });

    if (requestor && incidentType) {
      // Parse the 'reportedOn' string into a Luxon DateTime object
      const reportedOnDt = DateTime.fromISO(incident.reportedOn, {
        zone: "Asia/Kolkata",
      });

      let shiftDate = reportedOnDt;
      if (reportedOnDt.hour < 6) {
        shiftDate = reportedOnDt.minus({ days: 1 });
      }

      await prisma.incident.create({
        data: {
          id: incident.id,
          // CHANGED: Convert the Luxon object to a JS Date for Prisma
          reportedOn: reportedOnDt.toJSDate(),
          shiftDate: shiftDate.toJSDate(),
          jobTitle: incident.jobTitle,
          description: incident.description,
          priority: incident.priority,
          status: incident.status,
          location: incident.location,
          ipAddress: incident.ipAddress,
          jobFrom: incident.jobFrom,
          isTypeLocked: incident.isTypeLocked,
          isPriorityLocked: incident.isPriorityLocked,
          requestorId: requestor.id,
          incidentTypeId: incidentType.id,
          auditTrail: {
            create: incident.auditTrail.map((entry) => ({
              // CHANGED: Convert the timestamp string to a JS Date for Prisma
              // NOTE: Assumes the old audit timestamp format was 'ccc LLL d yyyy h:mm a'
              timestamp: DateTime.fromISO(entry.timestamp).toJSDate(),
              author: entry.author,
              action: entry.action,
              comment: entry.comment,
              rating: entry.rating,
              isEdited: entry.isEdited,
              // The new 'editedAt' field will be left null, which is correct
            })),
          },
        },
      });
      migratedCount++;
    } else {
      console.warn(
        `--> Skipping incident ${incident.id} due to missing requestor or type.`
      );
    }
  }

  console.log(
    `Migration finished. Successfully migrated ${migratedCount} incidents.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
