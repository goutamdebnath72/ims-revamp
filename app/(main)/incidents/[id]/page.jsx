"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { NotificationContext } from "@/context/NotificationContext";
import IncidentDetailsCard from "@/components/IncidentDetailsCard";
import IncidentAuditTrail from "@/components/IncidentAuditTrail";
import IncidentActionForm from "@/components/IncidentActionForm";
import ResolutionDialog from "@/components/ResolutionDialog";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import DescriptionModal from "@/components/DescriptionModal";
import TelecomReferralModal from "@/components/TelecomReferralModal";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  INCIDENT_STATUS,
  USER_ROLES,
  AUDIT_ACTIONS,
  INCIDENT_TYPES,
  DIALOG_CONTEXTS,
  RESOLUTION_ACTIONS,
  TEAMS,
} from "@/lib/constants";

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
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [isOptimisticallyResolved, setOptimisticallyResolved] =
    React.useState(false);
  const [isDescriptionModalOpen, setDescriptionModalOpen] =
    React.useState(false);
  const [dialogContext, setDialogContext] = React.useState("");
  const [isReferralModalOpen, setReferralModalOpen] = React.useState(false);
  const [referralData, setReferralData] = React.useState(null); // <-- NEW STATE TO HOLD REFERRAL DATA

  const auditTrailRef = React.useRef(null);
  const [isAuditTrailExpanded, setIsAuditTrailExpanded] = React.useState(false);

  const handlePasswordResetSuccess = () => {
    setIsResetModalOpen(false);
    mutate();
    showNotification(
      {
        title: "Success",
        message: "ESS Password has been reset successfully.",
      },
      "success"
    );
  };

  React.useEffect(() => {
    setTimeout(() => {
      auditTrailRef.current?.scrollToBottom();
    }, 0);
  }, [incident?.auditTrail?.length]);

  const handleOpenDialog = (context) => {
    setDialogContext(context);
    setDialogOpen(true);
  };

  const handleUpdate = async (updateData) => {
    // This function now also handles the referral data if it exists
    if (!updateData.comment && !referralData) return;

    const payload = { ...updateData };
    if (incident?.status === INCIDENT_STATUS.NEW) {
      payload.status = INCIDENT_STATUS.PROCESSED;
    }

    // If referral data exists, combine it with the main update
    if (referralData) {
      payload.assignedTeam = referralData.assignedTeam;
      payload.telecomTasks = referralData.tasks;
      payload.status = INCIDENT_STATUS.PENDING_TELECOM;
      payload.action = "Referred to Telecom";
      // Combine comments
      payload.comment = `Referred to Telecom with the following tasks:\n- ${referralData.tasks.join(
        "\n- "
      )}\n\n---\n${updateData.comment || referralData.comment}`;
      setReferralData(null); // Clear referral data after use
    }

    const optimisticAuditEntry = {
      id: "optimistic-" + Math.random(),
      author: user.name,
      action: payload.action || AUDIT_ACTIONS.ACTION_TAKEN,
      comment: payload.comment,
      timestamp: new Date().toISOString(),
    };

    mutate(
      (currentData) => ({
        ...currentData,
        status: payload.status || currentData.status,
        auditTrail: [...currentData.auditTrail, optimisticAuditEntry],
      }),
      false
    );

    setTimeout(() => auditTrailRef.current?.scrollToBottom(), 0);

    try {
      const updatedIncident = await updateIncidentAPI(params.id, payload);
      showNotification(
        { title: "Success", message: "Incident updated successfully." },
        "success"
      );
      mutate(updatedIncident, false);
    } catch (err) {
      showNotification(
        { title: "Update Failed", message: err.message },
        "error"
      );
      mutate();
    }
  };

  // This function now just saves the data from the modal and closes it.
  // The main handleUpdate function will do the submission.
  const handleReferralSubmit = (dataFromModal) => {
    setReferralData(dataFromModal);
    setReferralModalOpen(false);
    // You might want to trigger the main form's submit button here if the user
    // expects the update to happen immediately after closing the modal.
    // For now, it requires them to click "Submit Update" on the main form.
  };

  const handleConfirmResolve = async (resolutionData) => {
    let payload = { ...resolutionData };
    switch (resolutionData.action) {
      case RESOLUTION_ACTIONS.ACCEPT_CLOSE:
        payload.status = INCIDENT_STATUS.CLOSED;
        break;
      case RESOLUTION_ACTIONS.RE_OPEN:
        payload.status = INCIDENT_STATUS.PROCESSED;
        payload.rating = null;
        break;
      case RESOLUTION_ACTIONS.CLOSE:
        payload.status = INCIDENT_STATUS.CLOSED;
        break;
      case RESOLUTION_ACTIONS.RESOLVE:
        payload.status = INCIDENT_STATUS.RESOLVED;
        break;
      default:
        return;
    }

    if (resolutionData.action !== RESOLUTION_ACTIONS.RE_OPEN) {
      setOptimisticallyResolved(true);
    }

    try {
      const updatedIncident = await updateIncidentAPI(params.id, payload);
      showNotification(
        { title: "Success", message: "Incident updated successfully." },
        "success"
      );
      mutate(updatedIncident, false);
    } catch (err) {
      showNotification(
        { title: "Update Failed", message: err.message },
        "error"
      );
      mutate();
    } finally {
      setOptimisticallyResolved(false);
    }
  };

  const handleCommentEdit = async (entryId, newComment) => {
    if (!incident) return;
    try {
      await editCommentAPI(incident.id, entryId, newComment);
      mutate();
    } catch (err) {
      showNotification({ title: "Edit Failed", message: err.message }, "error");
    }
  };

  if (!user) return null;
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 200px)",
        }}
      >
        <CircularProgress />
      </Box>
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
    incident.status === INCIDENT_STATUS.RESOLVED ||
    incident.status === INCIDENT_STATUS.CLOSED ||
    isOptimisticallyResolved;
  const canTakeAction =
    (user.role === USER_ROLES.ADMIN ||
      user.role === USER_ROLES.SYS_ADMIN ||
      user.role === USER_ROLES.NETWORK_VENDOR ||
      user.role === USER_ROLES.BIOMETRIC_VENDOR) &&
    !isResolved;
  const isPasswordReset = incident.auditTrail.some(
    (entry) => entry.action === AUDIT_ACTIONS.PASSWORD_RESET
  );
  const showResetButton =
    canTakeAction &&
    incident?.incidentType?.name.toLowerCase() ===
      INCIDENT_TYPES.ESS_PASSWORD.toLowerCase() &&
    incident?.status !== INCIDENT_STATUS.NEW &&
    !isPasswordReset;
  const isRequestor = user?.ticketNo === incident?.requestor?.ticketNo;
  const canUserClose =
    isRequestor && incident.status === INCIDENT_STATUS.PROCESSED;
  const canUserConfirm =
    isRequestor && incident.status === INCIDENT_STATUS.RESOLVED;
  const canReferToTelecom =
    (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SYS_ADMIN) &&
    incident.incidentType?.name === INCIDENT_TYPES.NETWORK &&
    incident.status === INCIDENT_STATUS.PROCESSED &&
    incident.assignedTeam !== "Telecom";

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
          <IncidentDetailsCard
            incident={incident}
            onOpenDescriptionModal={() => setDescriptionModalOpen(true)}
          />
        </Box>
        <Stack sx={{ flex: 5, minWidth: 0 }}>
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
              isExpanded={
                !(
                  (canTakeAction || isRequestor) &&
                  incident.status !== INCIDENT_STATUS.CLOSED
                ) || isAuditTrailExpanded
              }
              onToggleExpand={() => setIsAuditTrailExpanded((prev) => !prev)}
            />
          </Box>

          {(canTakeAction || isRequestor) &&
            incident.status !== INCIDENT_STATUS.CLOSED &&
            !isAuditTrailExpanded && (
              <>
                {canUserConfirm ? (
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Resolution Feedback
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      The support team has marked this incident as resolved.
                      Please provide your feedback to close the ticket or let us
                      know if the issue persists.
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleOpenDialog(
                          DIALOG_CONTEXTS.USER_CONFIRM_RESOLUTION
                        )
                      }
                      fullWidth
                      size="large"
                    >
                      Confirm Resolution
                    </Button>
                  </Paper>
                ) : (
                  <IncidentActionForm
                    incident={incident}
                    onUpdate={handleUpdate}
                    onOpenResolveDialog={() =>
                      handleOpenDialog(DIALOG_CONTEXTS.ADMIN_RESOLVE_CLOSE)
                    }
                    showResetButton={showResetButton}
                    onOpenResetDialog={() => setIsResetModalOpen(true)}
                    isRequestor={isRequestor}
                    canUserClose={canUserClose}
                    onUserClose={() =>
                      handleOpenDialog(DIALOG_CONTEXTS.USER_CLOSE)
                    }
                    canUserConfirm={canUserConfirm}
                    onUserConfirm={() =>
                      handleOpenDialog(DIALOG_CONTEXTS.USER_CONFIRM_RESOLUTION)
                    }
                    isDisabled={
                      incident.status === INCIDENT_STATUS.NEW && isRequestor
                    }
                    showReferToTelecomButton={canReferToTelecom}
                    onOpenTelecomReferralDialog={() =>
                      setReferralModalOpen(true)
                    }
                  />
                )}
              </>
            )}
        </Stack>
      </Box>
      <ResolutionDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmResolve}
        context={dialogContext}
      />
      <ResetPasswordModal
        open={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        incident={incident}
        onSuccess={handlePasswordResetSuccess}
      />
      <DescriptionModal
        open={isDescriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        description={incident?.description}
      />
      <TelecomReferralModal
        open={isReferralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        onSubmit={handleReferralSubmit}
      />
    </>
  );
}
