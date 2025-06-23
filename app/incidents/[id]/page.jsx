'use client';

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IncidentDetailsCard from "@/components/IncidentDetailsCard";
import IncidentAuditTrail from "@/components/IncidentAuditTrail";

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
      action: 'Call accepted',
      comment: 'Initial call acceptance.'
    },
    {
      timestamp: 'Sat Jun 07, 2025 04:18 pm',
      author: 'PIJUSH KANTI DAS',
      action: '(Incident Status Reset by Admin: Processed)',
      comment: 'User ID: 223379, Password: dsp123'
    },
    {
      timestamp: 'Sat Jun 07, 2025 04:40 pm',
      author: 'PIJUSH KANTI DAS',
      action: '(Closed By PIJUSH KANTI DAS)',
      comment: 'ESS problem resolved'
    }
  ]
};

export default function IncidentDetailsPage({ params }) {
  const incident = mockIncidentData;

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={3}
      sx={{ width: "100%", alignItems: "stretch", flexWrap: "nowrap" }}
    >
      <Box
        sx={{
          width: { xs: "100%", lg: "58.33%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IncidentDetailsCard incident={incident} />
      </Box>

      <Box
        sx={{
          width: { xs: "100%", lg: "41.67%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IncidentAuditTrail auditTrail={incident.auditTrail} incident={incident} />
      </Box>
    </Stack>
  );
}