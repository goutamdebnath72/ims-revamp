'use client';

import * as React from 'react';
import { UserContext } from '@/context/UserContext';
import { NotificationContext } from '@/context/NotificationContext';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IncidentDetailsCard from '@/components/IncidentDetailsCard';
import IncidentAuditTrail from '@/components/IncidentAuditTrail';
import IncidentActionForm from '@/components/IncidentActionForm';
import ResolutionDialog from '@/components/ResolutionDialog';

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
    { timestamp: 'Tue Jun 24, 2025 02:30 pm', author: 'DEBASHISH GHOSH', action: 'Initial Diagnosis', comment: '1. Deleted the earlier installed SAP GUI.\n2. Freshly installed SAP GUI 750.\n3. User has checked by log-in.' },
    { timestamp: 'Wed Jun 25, 2025 11:30 am', author: 'GOUTAM DEBNATH', action: 'Action Plan', comment: 'Will need to schedule a remote session with the user to disable the conflicting extension. Have sent a meeting invite.' }
  ]
};

const longResolvedIncidentData = {
  ...longOpenIncidentData,
  status: 'Resolved',
  auditTrail: [
    ...longOpenIncidentData.auditTrail,
    {
      timestamp: 'Wed Jun 25, 2025 01:30 pm',
      author: 'GOUTAM DEBNATH',
      action: '(Closed By GOUTAM DEBNATH)',
      comment: 'Disabled conflicting extension via remote session. Application now launches correctly. User confirmed resolution.',
      rating: 5
    }
  ]
};

export default function IncidentDetailsPage({ params }) {
  const initialData = longOpenIncidentData;
  // const initialData = longResolvedIncidentData;

  const [incident, setIncident] = React.useState(initialData);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const { user } = React.useContext(UserContext);
  const { showNotification } = React.useContext(NotificationContext);

  const auditTrailRef = React.useRef(null);
  const isInitialPageLoad = React.useRef(true);

  React.useEffect(() => {
    if (isInitialPageLoad.current) {
      isInitialPageLoad.current = false;
      return;
    }
    
    setTimeout(() => {
      auditTrailRef.current?.scrollToBottom();
    }, 0);

  }, [incident.auditTrail]);

  const handleUpdate = (comment) => {
    if (!comment || !user) return; 

    const newAuditEntry = {
      timestamp: new Date().toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(/,/g, ''),
      author: user.name,
      action: 'Action Taken',
      comment: comment,
    };

    setIncident(prevIncident => ({
      ...prevIncident,
      auditTrail: [...prevIncident.auditTrail, newAuditEntry],
    }));
    
    showNotification('Incident updated successfully!', 'success');
  };

  const handleConfirmResolve = (comment, rating) => {
    if (!comment || !user) return;

    const finalAuditEntry = {
      timestamp: new Date().toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(/,/g, ''),
      author: user.name,
      action: `(Closed By ${user.name})`,
      comment: comment,
      rating: rating,
    };

    setIncident(prevIncident => ({
      ...prevIncident,
      status: 'Resolved',
      auditTrail: [...prevIncident.auditTrail, finalAuditEntry],
    }));

    showNotification('Incident resolved successfully!', 'success');
  };

  const handleCommentEdit = (entryIndex, newComment) => {
    setIncident(prevIncident => {
      const newAuditTrail = prevIncident.auditTrail.map((entry, index) => {
        if (index === entryIndex) {
          return { ...entry, comment: newComment };
        }
        return entry;
      });
      return { ...prevIncident, auditTrail: newAuditTrail };
    });
    showNotification("Comment updated successfully!", "info");
  };

  const isResolved = incident.status === 'Resolved';
  
  if (!user) {
    return null;
  }

  return (
    <> 
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch' }}>
        <Box sx={{ flex: 7, minWidth: 0 }}>
          <IncidentDetailsCard incident={incident} />
        </Box>
        {isResolved ? (
          <Box sx={{ flex: 5, minWidth: 0, display: 'flex' }}>
            <IncidentAuditTrail
              ref={auditTrailRef}
              auditTrail={incident.auditTrail}
              incident={incident}
              isResolved={isResolved}
              onCommentEdit={handleCommentEdit}
            />
          </Box>
        ) : (
          <Stack spacing={3} sx={{ flex: 5, minWidth: 0 }}>
            <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', maxHeight: '50vh' }}>
               <IncidentAuditTrail
                  ref={auditTrailRef}
                  auditTrail={incident.auditTrail}
                  incident={incident}
                  isResolved={isResolved}
                  onCommentEdit={handleCommentEdit}
               />
            </Box>
            <IncidentActionForm 
              onUpdate={handleUpdate} 
              onOpenResolveDialog={() => setDialogOpen(true)}
            />
          </Stack>
        )}
      </Box>
      <ResolutionDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmResolve}
      />
    </>
  );
}