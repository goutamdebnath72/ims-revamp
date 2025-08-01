"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { NotificationContext } from "@/context/NotificationContext";
import { IncidentContext } from "@/context/IncidentContext";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IncidentDetailsCard from "@/components/IncidentDetailsCard";
import IncidentAuditTrail from "@/components/IncidentAuditTrail";
import IncidentActionForm from "@/components/IncidentActionForm";
import ResolutionDialog from "@/components/ResolutionDialog";

export default function IncidentDetailsPage() {
  const params = useParams();
  const { incidents, updateIncident, editComment } =
    React.useContext(IncidentContext);
  const { showNotification } = React.useContext(NotificationContext);
  const { data: session } = useSession();
  const user = session?.user;

  const incident = incidents.find((inc) => inc.id.toString() === params.id);

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [isOptimisticallyResolved, setOptimisticallyResolved] =
    React.useState(false); // <-- ADD THIS LINE

  const auditTrailRef = React.useRef(null);
  const [isAuditTrailExpanded, setIsAuditTrailExpanded] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      auditTrailRef.current?.scrollToBottom();
    }, 0);
  }, [incident?.auditTrail?.length]);

  const handleUpdate = (updateData) => {
    if (!updateData.comment || !updateData.comment.trim()) return;

    // Create a new payload from the form data
    const payload = { ...updateData };

    // If the incident is currently "New", we know this update will change
    // its status to "Processed". We add this to the payload so the
    // optimistic update can work instantly.
    if (incident?.status === "New") {
      payload.status = "Processed";
    }

    updateIncident(params.id, payload, user);
  };

  const handleConfirmResolve = (resolutionData) => {
    setOptimisticallyResolved(true);
    updateIncident(
      params.id,
      {
        ...resolutionData,
        status: resolutionData.action === "close" ? "Closed" : "Resolved",
      },
      user
    );
    showNotification(
      {
        title: `Incident ${
          resolutionData.action === "close" ? "Closed" : "Resolved"
        }`,
        message: `The incident has been successfully updated.`,
      },
      "success"
    );
  };

  const handleCommentEdit = (entryId, newComment) => {
    if (!incident) return;
    editComment(incident.id, entryId, newComment);
  };

  if (!user) return null;
  if (!incident) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h4" color="error">
          Incident Not Found
        </Typography>
        <Typography>
          The incident with ID "{params.id}" could not be found.
        </Typography>
      </Box>
    );
  }

  const isResolved =
    incident.status === "Resolved" ||
    incident.status === "Closed" ||
    isOptimisticallyResolved;

  const canTakeAction =
    (user.role === "admin" ||
      user.role === "sys_admin" ||
      user.role === "network_vendor" ||
      user.role === "biometric_vendor") &&
    !isResolved;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "stretch",
          height: "calc(100vh - 112px)",
        }}
      >
        <Box sx={{ flex: 7, minWidth: 0 }}>
          <IncidentDetailsCard incident={incident} />
        </Box>
        {canTakeAction ? (
          <Stack
            spacing={0}
            sx={{ flex: 5, minWidth: 0, position: "relative" }}
          >
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 0,
                display: "flex",
                position: "relative",
                zIndex: 2,
              }}
            >
              <IncidentAuditTrail
                ref={auditTrailRef}
                auditTrail={incident.auditTrail || []}
                incident={incident}
                isResolved={isResolved}
                onCommentEdit={handleCommentEdit}
                isExpanded={isAuditTrailExpanded}
                onToggleExpand={() => setIsAuditTrailExpanded((prev) => !prev)}
              />
            </Box>
            {!isAuditTrailExpanded && (
              <IncidentActionForm
                incident={incident}
                onUpdate={handleUpdate}
                onOpenResolveDialog={() => setDialogOpen(true)}
              />
            )}
          </Stack>
        ) : (
          <Box sx={{ flex: 5, minWidth: 0, display: "flex" }}>
            <IncidentAuditTrail
              ref={auditTrailRef}
              auditTrail={incident.auditTrail || []}
              incident={incident}
              isResolved={isResolved}
              onCommentEdit={handleCommentEdit}
              isExpanded={false}
              onToggleExpand={() => {}}
            />
          </Box>
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
