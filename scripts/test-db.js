// This script will test the database connection directly.
const { getAllIncidents } = require('../lib/incident-repo');

async function runTest() {
  try {
    const incidents = await getAllIncidents();
    
    
    if (incidents.length > 0) {
      console.log(incidents[0]);
    } else {
      console.log("Data retrieval returned an empty array. The connection works, but no data was found.");
    }

  } catch (error) {
    console.error("An error occurred during the direct database test:", error);
  }
}

runTest();