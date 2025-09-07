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
import TelecomETLActionForm from "@/components/TelecomETLActionForm";
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
    body: JSON.stringify({
      action: AUDIT_ACTIONS.EDIT_COMMENT,
      entryId,
      newComment,
    }),
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

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [isOptimisticallyResolved, setOptimisticallyResolved] =
    React.useState(false);
  const [isDescriptionModalOpen, setDescriptionModalOpen] =
    React.useState(false);
  const [dialogContext, setDialogContext] = React.useState("");
  const [isReferralModalOpen, setReferralModalOpen] = React.useState(false);
  const [referralData, setReferralData] = React.useState(null);
  const auditTrailRef = React.useRef(null);
  const [isAuditTrailExpanded, setIsAuditTrailExpanded] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      auditTrailRef.current?.scrollToBottom();
    }, 0);
  }, [incidentData?.auditTrail?.length]);

    // --- ADD THIS NEW USEEFFECT HOOK HERE ---
  React.useEffect(() => {
    // This effect runs only when referralData changes
    if (referralData) {
      // It automatically calls handleUpdate with the referral data.
      handleUpdate({ comment: referralData.comment || "" });
      
      // It then closes the modal
      setReferralModalOpen(false);
    }
  }, [referralData]); // Dependency: This hook runs only when referralData is updated
  // --- END OF NEW HOOK ---

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
  if (!incidentData) {
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

  const incident = incidentData;
  const isAdmin =
    user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SYS_ADMIN;
  const isRequestor = user?.ticketNo === incident?.requestor?.ticketNo;
  const isTelecomUser = user?.role === USER_ROLES.TELECOM_USER;
  const isEtlUser = user?.role === USER_ROLES.ETL;
  const isAssignedTelecomUser =
    user?.department === TEAMS.TELECOM &&
    incident?.assignedTeam === TEAMS.TELECOM;

  // --- NEW VENDOR LOGIC ---
  const isNetworkVendor =
    user?.role === USER_ROLES.NETWORK_VENDOR &&
    incident.incidentType?.name?.toLowerCase() ===
      INCIDENT_TYPES.NETWORK?.toLowerCase();
  const isBiometricVendor =
    user?.role === USER_ROLES.BIOMETRIC_VENDOR &&
    incident.incidentType?.name?.toLowerCase() === "BIOMETRIC".toLowerCase();
  const isAssignedVendor =
    (isNetworkVendor || isBiometricVendor) &&
    incident.status === INCIDENT_STATUS.PROCESSED;

  const showActionArea =
    isAdmin ||
    isRequestor ||
    isAssignedTelecomUser ||
    isAssignedVendor ||
    isTelecomUser ||
    isEtlUser;

  const isResolved =
    incident.status === INCIDENT_STATUS.RESOLVED ||
    incident.status === INCIDENT_STATUS.CLOSED ||
    isOptimisticallyResolved;
  const isPasswordReset = incident.auditTrail.some(
    (entry) => entry.action === AUDIT_ACTIONS.PASSWORD_RESET
  );
  const showResetButton =
    isAdmin &&
    !isResolved &&
    incident?.incidentType?.name.toLowerCase() ===
      INCIDENT_TYPES.ESS_PASSWORD.toLowerCase() &&
    incident?.status !== INCIDENT_STATUS.NEW &&
    !isPasswordReset;
  const canUserClose =
    isRequestor && incident.status === INCIDENT_STATUS.PROCESSED;
  const canUserConfirm =
    isRequestor && incident.status === INCIDENT_STATUS.RESOLVED && !isAdmin;

  // --- START: DEBUGGING BLOCK ---
  console.log("--- Debugging 'Refer to Telecom' Button ---");
  console.log("1. isAdmin:", isAdmin);
  console.log("2. Incident Type:", incident.incidentType?.name);
  console.log("3. Expected Type:", INCIDENT_TYPES.NETWORK);
  console.log("4. Incident Status:", incident.status);
  console.log("5. Expected Status:", INCIDENT_STATUS.PROCESSED);
  // --- END: DEBUGGING BLOCK ---

  const canReferToTelecom =
    isAdmin &&
    incident.incidentType?.name?.toLowerCase() ===
      INCIDENT_TYPES.NETWORK?.toLowerCase() &&
    incident.status === INCIDENT_STATUS.PROCESSED;

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
  const handleOpenDialog = (context) => {
    setDialogContext(context);
    setDialogOpen(true);
  };
  const handleUpdate = async (updateData) => {
    if (!updateData.comment && !referralData) return;
    const payload = { ...updateData };
    if (incident?.status === INCIDENT_STATUS.NEW) {
      payload.status = INCIDENT_STATUS.PROCESSED;
    }
    if (referralData) {
      payload.assignedTeam = referralData.assignedTeam;
      payload.telecomTasks = referralData.tasks;
      payload.status = INCIDENT_STATUS.PENDING_TELECOM;
      payload.action = AUDIT_ACTIONS.REFERRED_TO_TELECOM;
      payload.comment = `Referred to Telecom with the following tasks:\n- ${referralData.tasks.join(
        "\n- "
      )}\n\n---\n${updateData.comment || referralData.comment}`;
      setReferralData(null);
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
  const handleReferralSubmit = (dataFromModal) => {
    setReferralData(dataFromModal);    
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

  // --- ADD THIS NEW FUNCTION HERE ---
  const handleToggleExpand = () => {
    // Don't allow another animation if one is already in progress
    if (isAnimating) return;

    setIsAnimating(true);
    setIsAuditTrailExpanded((prev) => !prev);

    // After the CSS transition is finished (300ms), turn off the animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // This duration must match your CSS transition duration
  };
  // --- END OF NEW FUNCTION ---

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
        <Stack sx={{ flex: 5, minWidth: 0, height: "100%" }} spacing={1}>
          <Box
            sx={{
              flex: isAuditTrailExpanded ? "1 1 100%" : "1 1 calc(50% - 4px)",
              minHeight: 0,
              display: "flex",
              position: "relative",
              transition: "flex 0.3s ease-in-out",
            }}
          >
            <IncidentAuditTrail
              ref={auditTrailRef}
              auditTrail={incident.auditTrail || []}
              incident={incident}
              onCommentEdit={handleCommentEdit}
              isExpanded={isAuditTrailExpanded}
              onToggleExpand={
                showActionArea && incident.status !== INCIDENT_STATUS.CLOSED
                  ? handleToggleExpand
                  : null
              }
            />
          </Box>
          {showActionArea && incident.status !== INCIDENT_STATUS.CLOSED && (
            <Box
              sx={{
                display: isAuditTrailExpanded ? "none" : "block",
                flex: isAuditTrailExpanded ? "1 1 0%" : "1 1 calc(50% - 4px)",
                minHeight: 0,
                transition: "flex 0.3s ease-in-out",
                zIndex: 2,
              }}
            >
              {canUserConfirm ? (
                <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
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
                      handleOpenDialog(DIALOG_CONTEXTS.USER_CONFIRM_RESOLUTION)
                    }
                    fullWidth
                    size="large"
                  >
                    Confirm Resolution
                  </Button>
                </Paper>
              ) : isTelecomUser || isEtlUser ? (
                <TelecomETLActionForm
                  incident={incident}
                  onUpdate={handleUpdate}
                  onOpenResolveDialog={() =>
                    handleOpenDialog(DIALOG_CONTEXTS.ADMIN_RESOLVE_CLOSE)
                  }
                  isAnimating={isAnimating}
                />
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
                    incident.status === INCIDENT_STATUS.NEW &&
                    isRequestor &&
                    !isAdmin
                  } // Corrected isDisabled logic
                  showReferToTelecomButton={canReferToTelecom}
                  onOpenTelecomReferralDialog={() => setReferralModalOpen(true)}
                  isAdmin={isAdmin} // Pass isAdmin prop
                  isAssignedVendor={isAssignedVendor} // Pass isAssignedVendor prop
                  isAnimating={isAnimating}
                />
              )}
            </Box>
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
