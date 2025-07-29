// This script will test the database connection directly.
const { getAllIncidents } = require('../lib/incident-repo');

async function runTest() {
  console.log("--- Starting Direct Database Test ---");
  try {
    const incidents = await getAllIncidents();
    
    console.log(`Query finished. Found ${incidents.length} incidents.`);
    
    if (incidents.length > 0) {
      console.log("Data retrieval is successful. Here's the first incident found:");
      console.log(incidents[0]);
    } else {
      console.log("Data retrieval returned an empty array. The connection works, but no data was found.");
    }

  } catch (error) {
    console.error("An error occurred during the direct database test:", error);
  }
}

runTest();