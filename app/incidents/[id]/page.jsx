// File: app/incidents/[id]/page.jsx
// STRATEGY: Replaced the entire <Grid> system with <Stack> to debug the layout issue.
// This uses a more direct flexbox implementation.
"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack"; // <-- Import Stack
import IncidentDetailsCard from "@/components/IncidentDetailsCard";
import IncidentAuditTrail from "@/components/IncidentAuditTrail";

// Mock data for a single incident.
// REPLACE the old mockIncidentData with this new version
const mockIncidentData = {
  id: '1000029878',
  incidentType: 'Password Reset',
  jobTitle: 'Reset ESS Email Password',
  description: 'Please reset ESS password of KALU BOURI Ticket No:223379 SAIL PNo:D110553 Department:CO & CC (COAL HANDLING) (11100).',
  status: 'Resolved',
  priority: 'High',
  department: 'CO & CC (COAL HANDLING)',
  location: 'CHP SHIFT OFFICE',
  requestor: 'ANANTA ANADI MUDI',
  ticketNo: '442144',
  contactNumber: '9434792892',
  reportedOn: '07 Jun 25, 03:05 PM',
  auditTrail: [
    {
      timestamp: 'Sat Jun 07, 2025 04:17 pm',
      author: 'PIJUSH KANTI DAS',
      action: 'Call accepted', // <-- Split from comment
      comment: 'Initial call acceptance.' // <-- Added for clarity
    },
    {
      timestamp: 'Sat Jun 07, 2025 04:18 pm',
      author: 'PIJUSH KANTI DAS',
      action: '(Incident Status Reset by Admin: Processed)', // <-- Split
      comment: 'User ID: 223379, Password: dsp123' // <-- Split
    },
    {
      timestamp: 'Sat Jun 07, 2025 04:40 pm',
      author: 'PIJUSH KANTI DAS',
      action: '(Closed By PIJUSH KANTI DAS)', // <-- Split
      comment: 'ESS problem resolved' // <-- Split
    }
  ]
};
export default function IncidentDetailsPage({ params }) {
  const incident = mockIncidentData;

  return (
    // REPLACED <Grid container> with <Stack>
    <Stack
      direction={{ xs: "column", lg: "row" }} // Stacks vertically on small screens, horizontally on large
      spacing={3} // The space between the two columns
      alignItems="stretch" // Ensures columns are equal height
      sx={{ width: "100%" }} // <-- ADD THIS LINE
    >
      {/* Left Column (takes ~7/12 of the width on large screens) */}
      <Box sx={{ width: { xs: "100%", lg: "58.33%" } }}>
        <IncidentDetailsCard incident={incident} />
      </Box>

      {/* Right Column (takes ~5/12 of the width on large screens) */}
      <Box sx={{ width: { xs: "100%", lg: "41.67%" } }}>
        <IncidentAuditTrail auditTrail={incident.auditTrail} />
      </Box>
    </Stack>
  );
}
