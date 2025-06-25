// File: app/incidents/[id]/page.jsx
// UPDATED: Corrected mock data to have consistent lengths for testing.
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IncidentDetailsCard from '@/components/IncidentDetailsCard';
import IncidentAuditTrail from '@/components/IncidentAuditTrail';
import IncidentActionForm from '@/components/IncidentActionForm';

// --- Mock Data ---

const longOpenIncidentData = {
  id: '1000031588',
  status: 'Awaiting User Response',
  incidentType: 'Software Issue',
  jobTitle: 'Application crashing on launch',
  description: 'User reports that the main accounting software (TallyPrime) crashes immediately upon opening. No error message is shown.',
  priority: 'High',
  department: 'Accounts',
  location: 'Finance Wing',
  requestor: 'ANIRBAN ROY',
  ticketNo: '442205',
  contactNumber: '9123456789',
  reportedOn: '24 Jun 25, 02:00 PM',
  auditTrail: [
    { timestamp: 'Tue Jun 24, 2025 02:00 pm', author: 'ANIRBAN ROY', action: 'Incident Raised', comment: 'Software crashes on launch.' },
    { timestamp: 'Tue Jun 24, 2025 02:05 pm', author: 'AUTO-ASSIGN', action: 'Assigned to Application Support', comment: 'Rule-based assignment for category: Software.' },
    { timestamp: 'Tue Jun 24, 2025 02:30 pm', author: 'DEBASHISH GHOSH', action: 'Initial Diagnosis', comment: 'Unable to replicate on test machine. Asking user for more details about their OS and recent updates.' },
    { timestamp: 'Tue Jun 24, 2025 03:15 pm', author: 'ANIRBAN ROY', action: 'User provided details', comment: 'I am on macOS Sequoia 15.5. No recent updates were installed manually by me.' },
    { timestamp: 'Tue Jun 24, 2025 04:00 pm', author: 'DEBASHISH GHOSH', action: 'Action Taken', comment: 'Cleared application cache and preferences file from user\'s Library folder. Asked user to restart and try again.' },
    { timestamp: 'Tue Jun 24, 2025 04:10 pm', author: 'ANIRBAN ROY', action: 'User provided details', comment: 'Restarted the machine, the issue still persists. Same crash.' },
    { timestamp: 'Wed Jun 25, 2025 09:30 am', author: 'DEBASHISH GHOSH', action: 'Further Investigation', comment: 'Checking for known compatibility issues with TallyPrime and the latest security patch for Sequoia. This might take some time.' },
    { timestamp: 'Wed Jun 25, 2025 10:45 am', author: 'DEBASHISH GHOSH', action: 'Update', comment: 'Found a known issue on the vendor\'s forum. A specific system extension is causing the conflict. Preparing a workaround.' },
    { timestamp: 'Wed Jun 25, 2025 11:30 am', author: 'DEBASHISH GHOSH', action: 'Action Plan', comment: 'Will need to schedule a remote session with the user to disable the conflicting extension. Have sent a meeting invite.' },
  ]
};

// CORRECTED: This now contains all the entries from the open incident, plus a final closing one.
const longResolvedIncidentData = {
  ...longOpenIncidentData, // Copy all base data from the open incident
  status: 'Resolved',      // Change the status
  // Create a new audit trail by copying the open one and adding a final entry
  auditTrail: [
    ...longOpenIncidentData.auditTrail,
    {
      timestamp: 'Wed Jun 25, 2025 01:30 pm',
      author: 'DEBASHISH GHOSH',
      action: '(Closed By DEBASHISH GHOSH)',
      comment: 'Disabled conflicting extension via remote session. Application now launches correctly. User confirmed resolution.'
    }
  ]
};


export default function IncidentDetailsPage({ params }) {
  // --- Data Selection Logic ---
  // To test different views, comment and uncomment the lines below.
  
   const incident = longResolvedIncidentData; // Use this for the CLOSED view
  //  const incident = longOpenIncidentData;      // Use this for the OPEN view
  
  const isResolved = incident.status === 'Resolved';

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch' }}>

      {/* --- Left Column --- */}
      <Box sx={{ flex: 7, minWidth: 0 }}>
        <IncidentDetailsCard incident={incident} />
      </Box>

      {/* --- Right Column (Renders differently based on status) --- */}
      {isResolved ? (
        // Layout for RESOLVED incidents
        <Box sx={{ flex: 5, minWidth: 0, display: 'flex' }}>
          <IncidentAuditTrail
            auditTrail={incident.auditTrail}
            incident={incident}
            isResolved={isResolved}
          />
        </Box>
      ) : (
        // Layout for OPEN incidents
        <Stack spacing={3} sx={{ flex: 5, minWidth: 0 }}>
          <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', maxHeight: '50vh' }}>
             <IncidentAuditTrail
                auditTrail={incident.auditTrail}
                incident={incident}
                isResolved={isResolved}
             />
          </Box>
          <IncidentActionForm />
        </Stack>
      )}

    </Box>
  );
}