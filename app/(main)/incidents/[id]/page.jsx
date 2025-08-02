"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { NotificationContext } from "@/context/NotificationContext";
import { Box, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import IncidentDetailsCard from "@/components/IncidentDetailsCard";
import IncidentAuditTrail from "@/components/IncidentAuditTrail";
import IncidentActionForm from "@/components/IncidentActionForm";
import ResolutionDialog from "@/components/ResolutionDialog";

const fetcher = (url) => fetch(url).then((res) => res.json());

const updateIncidentAPI = async (id, data) => {
  const response = await fetch(`/api/incidents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update incident");
  }
  return response.json();
};

const editCommentAPI = async (id, entryId, newComment) => {
  const response = await fetch(`/api/incidents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "editAuditComment", entryId, newComment }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to edit comment");
  }
  return response.json();
};

export default function IncidentDetailsPage() {
  const params = useParams();
  const { showNotification } = React.useContext(NotificationContext);
  const { data: session } = useSession();
  const user = session?.user;
  const {
    data: incidentData,
    error,
    isLoading,
    mutate,
  } = useSWR(params.id ? `/api/incidents/${params.id}` : null, fetcher, {
    refreshInterval:
      user?.role === "admin" || user?.role === "sys_admin" ? 15000 : 0,
    revalidateOnFocus: !(user?.role === "admin" || user?.role === "sys_admin"),
  });

  const incident = incidentData;

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

  const handleUpdate = async (updateData) => {
    if (!updateData.comment || !updateData.comment.trim()) return;
    const payload = { ...updateData };
    if (incident?.status === "New") {
      payload.status = "Processed";
    }
    try {
      await updateIncidentAPI(params.id, payload);
      mutate(); // Re-fetch data
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleConfirmResolve = async (resolutionData) => {
    setOptimisticallyResolved(true);
    try {
      await updateIncidentAPI(params.id, {
        ...resolutionData,
        status: resolutionData.action === "close" ? "Closed" : "Resolved",
      });
      showNotification(
        `Incident ${
          resolutionData.action === "close" ? "Closed" : "Resolved"
        } successfully.`,
        "success"
      );
      mutate(); // Re-fetch data
    } catch (err) {
      setOptimisticallyResolved(false); // Revert optimistic state on error
      showNotification(err.message, "error");
    }
  };

  const handleCommentEdit = async (entryId, newComment) => {
    if (!incident) return;
    try {
      await editCommentAPI(incident.id, entryId, newComment);
      mutate(); // Re-fetch data
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  if (!user) return null;
  if (isLoading) {
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 10 }} />
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load incident details.
      </Alert>
    );
  }

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
