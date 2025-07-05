'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { NotificationContext } from '@/context/NotificationContext';
import { IncidentContext } from '@/context/IncidentContext';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IncidentDetailsCard from '@/components/IncidentDetailsCard';
import IncidentAuditTrail from '@/components/IncidentAuditTrail';
import IncidentActionForm from '@/components/IncidentActionForm';
import ResolutionDialog from '@/components/ResolutionDialog';

// --- BUG FIX ---
// Corrected the department codes to include the executive department (98500).
const C_AND_IT_DEPT_CODES = [98500, 98540];

export default function IncidentDetailsPage() {
  const params = useParams();
  const { incidents, updateIncident } = React.useContext(IncidentContext);
  const { user } = React.useContext(UserContext);
  const { showNotification } = React.useContext(NotificationContext);
  
  const incident = incidents.find(inc => inc.id.toString() === params.id);
  
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const auditTrailRef = React.useRef(null);
  
  React.useEffect(() => {
    setTimeout(() => {
      auditTrailRef.current?.scrollToBottom();
    }, 0);
  }, [incident?.auditTrail?.length]);


  const handleUpdate = ({ comment, newType, newPriority }) => {
    if (!comment.trim() || !user || !incident) return;

    const updatedFields = {};
    let actionDescription = [];

    const newStatus = 
      incident.status === 'New' && user && C_AND_IT_DEPT_CODES.includes(user.departmentCode)
      ? 'Processed'
      : incident.status;
    if (newStatus !== incident.status) {
        updatedFields.status = newStatus;
    }
    
    if (newType && newType !== incident.incidentType && !incident.isTypeLocked) {
        updatedFields.incidentType = newType;
        updatedFields.isTypeLocked = true;
        actionDescription.push(`Incident Type changed to "${newType}".`);
    }

    if (newPriority && newPriority !== incident.priority && !incident.isPriorityLocked) {
        updatedFields.priority = newPriority;
        updatedFields.isPriorityLocked = true;
        actionDescription.push(`Priority changed to "${newPriority}".`);
    }

    const finalComment = actionDescription.length > 0 
      ? actionDescription.join('\n') + '\n---\n' + comment 
      : comment;
      
    const newAuditEntry = {
      timestamp: new Date().toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(/,/g, ''),
      author: user.name,
      action: actionDescription.length > 0 ? 'Details Updated' : 'Action Taken',
      comment: finalComment,
      isEdited: false, 
    };
    
    updateIncident(params.id, {
        ...updatedFields,
        auditTrail: [...(incident.auditTrail || []), newAuditEntry]
    });
    
    showNotification({ title: 'Update Submitted', message: 'Your update has been added to the audit trail.' }, 'success');
  };
  
  const handleConfirmResolve = ({ action, comment, rating, closingReason }) => {
    if (!comment || !user || !incident) return;
    
    const isClosing = action === 'close';
    const newStatus = isClosing ? 'Closed' : 'Resolved';
    
    const finalComment = isClosing 
      ? `Reason for closing: ${closingReason}.\n---\n${comment}`
      : comment;

    const finalAuditEntry = {
      timestamp: new Date().toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(/,/g, ''),
      author: user.name,
      action: `(${newStatus} By ${user.name})`,
      comment: finalComment,
      rating: rating,
    };

    updateIncident(params.id, {
        status: newStatus,
        auditTrail: [...(incident.auditTrail || []), finalAuditEntry]
    });

    showNotification({ title: `Incident ${newStatus}`, message: `The incident has been successfully ${newStatus.toLowerCase()}.` }, 'success');
  };
  
  const handleCommentEdit = (entryIndex, newComment) => {
    if (!incident) return;
    
    const newAuditTrail = [...incident.auditTrail];
    
    newAuditTrail[entryIndex] = {
      ...newAuditTrail[entryIndex],
      comment: newComment,
      isEdited: true,
    };

    updateIncident(params.id, { auditTrail: newAuditTrail });
    showNotification({ title: "Comment Updated", message: "Your comment has been saved." }, "info");
  };

  if (!user) { return null; }

  if (!incident) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h4" color="error">Incident Not Found</Typography>
        <Typography>The incident with ID "{params.id}" could not be found in the system.</Typography>
      </Box>
    );
  }

  const isResolved = incident.status === 'Resolved' || incident.status === 'Closed';

  return (
    <> 
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch', height: 'calc(100vh - 112px)'}}>
        <Box sx={{ flex: 7, minWidth: 0 }}>
          <IncidentDetailsCard incident={incident} />
        </Box>
        {isResolved ? (
          <Box sx={{ flex: 5, minWidth: 0, display: 'flex' }}>
            <IncidentAuditTrail
              ref={auditTrailRef}
              auditTrail={incident.auditTrail || []}
              incident={incident}
              isResolved={isResolved}
              onCommentEdit={handleCommentEdit}
            />
          </Box>
        ) : (
          <Stack 
            spacing={3} 
            sx={{ flex: 5, minWidth: 0 }}
          >
            <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex' }}>
               <IncidentAuditTrail
                  ref={auditTrailRef}
                  auditTrail={incident.auditTrail || []}
                  incident={incident}
                  isResolved={isResolved}
                  onCommentEdit={handleCommentEdit}
               />
            </Box>
            <IncidentActionForm 
              incident={incident}
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