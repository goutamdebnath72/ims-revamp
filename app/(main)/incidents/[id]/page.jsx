"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { NotificationContext } from "@/context/NotificationContext";
import IncidentHeader from "@/components/IncidentHeader";
import IncidentDetailsCard from "@/components/IncidentDetailsCard";
import IncidentAuditTrail from "@/components/IncidentAuditTrail";
import IncidentActionForm from "@/components/IncidentActionForm";
import ResolutionDialog from "@/components/ResolutionDialog";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import SapPasswordResetModal from "@/components/SapPasswordResetModal";
import DescriptionModal from "@/components/DescriptionModal";
import TelecomReferralModal from "@/components/TelecomReferralModal";
import EtlReferralModal from "@/components/EtlReferralModal";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Button,
  Tabs,
  Tab,
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

// A custom component to render the content of a tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`incident-tabpanel-${index}`}
      aria-labelledby={`incident-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function IncidentDetailsPage() {
  const params = useParams();
  const { showNotification } = React.useContext(NotificationContext);
  const { data: session } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = React.useState(0);

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
  const [isSapResetModalOpen, setIsSapResetModalOpen] = React.useState(false);
  const [isOptimisticallyResolved, setOptimisticallyResolved] =
    React.useState(false);
  const [isDescriptionModalOpen, setDescriptionModalOpen] =
    React.useState(false);
  const [dialogContext, setDialogContext] = React.useState("");
  const [isTelecomReferralModalOpen, setTelecomReferralModalOpen] =
    React.useState(false);
  const auditTrailRef = React.useRef(null);
  const [isEtlReferralModalOpen, setEtlReferralModalOpen] =
    React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      auditTrailRef.current?.scrollToBottom();
    }, 0);
  }, [incidentData?.auditTrail?.length]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
  const isNetworkVendor =
    user?.role === USER_ROLES.NETWORK_VENDOR &&
    incident.incidentType?.name?.toLowerCase() ===
      INCIDENT_TYPES.NETWORK?.toLowerCase();
  const isBiometricVendor =
    user?.role === USER_ROLES.BIOMETRIC_VENDOR &&
    incident.incidentType?.name?.toLowerCase() === "BIOMETRIC".toLowerCase();
  const isAssignedVendor =
    (isNetworkVendor || isBiometricVendor) &&
    incident.status?.toLowerCase() !== INCIDENT_STATUS.NEW?.toLowerCase();
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
  const hasBeenReset = incident.auditTrail.some(
    (entry) =>
      entry.action === AUDIT_ACTIONS.PASSWORD_RESET ||
      entry.action === "SAP Password Reset"
  );
  const showResetButton =
    isAdmin &&
    !isResolved &&
    incident?.incidentType?.name.toLowerCase() ===
      INCIDENT_TYPES.ESS_PASSWORD.toLowerCase() &&
    incident?.status !== INCIDENT_STATUS.NEW &&
    !hasBeenReset;
  const showSapResetButton =
    isAdmin &&
    !isResolved &&
    incident?.incidentType?.name.toLowerCase().includes("sap password") &&
    incident?.status !== INCIDENT_STATUS.NEW &&
    !hasBeenReset;
  const canUserClose =
    isRequestor && incident.status === INCIDENT_STATUS.PROCESSED;
  const canUserConfirm =
    isRequestor && incident.status === INCIDENT_STATUS.RESOLVED && !isAdmin;

  const handlePasswordResetSuccess = () => {
    setIsResetModalOpen(false);
    setIsSapResetModalOpen(false);
    mutate();
    showNotification(
      {
        title: "Success",
        message: "Password has been reset successfully.",
      },
      "success"
    );
  };

  const handleOpenDialog = (context) => {
    setDialogContext(context);
    setDialogOpen(true);
  };

  const handleUpdate = async (updateData) => {
    if (
      !updateData.comment &&
      !updateData.telecomTasks &&
      !updateData.etlTasks &&
      updateData.action !== "UNLOCK_TYPE" &&
      !updateData.newType
    ) {
      return;
    }

    const payload = { ...updateData };
    if (incident?.status === INCIDENT_STATUS.NEW && !payload.status) {
      payload.status = INCIDENT_STATUS.PROCESSED;
    }

    if (updateData.telecomTasks) {
      payload.assignedTeam = TEAMS.TELECOM;
      payload.status = INCIDENT_STATUS.PENDING_TELECOM_ACTION;
      payload.comment = `Referred to Telecom with tasks:\n- ${updateData.telecomTasks.join(
        "\n- "
      )}\n\n---\n${updateData.comment}`;
    } else if (updateData.etlTasks) {
      payload.assignedTeam = TEAMS.ETL;
      payload.status = INCIDENT_STATUS.PENDING_ETL;
      payload.comment = `Referred to ETL with tasks:\n- ${updateData.etlTasks.join(
        "\n- "
      )}\n\n---\n${updateData.comment}`;
    }

    const optimisticType = payload.newType
      ? { ...incident.incidentType, name: payload.newType }
      : incident.incidentType;
    const optimisticAuditEntry = {
      id: "optimistic-" + Math.random(),
      author: user.name,
      action: payload.action || AUDIT_ACTIONS.ACTION_TAKEN,
      comment:
        payload.comment || `Incident Type changed to "${payload.newType}".`,
      timestamp: new Date().toISOString(),
    };
    mutate(
      (currentData) => ({
        ...currentData,
        status: payload.status || currentData.status,
        incidentType: optimisticType,
        isTypeLocked: payload.newType ? true : currentData.isTypeLocked,
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
  const handleTelecomReferralSubmit = (dataFromModal) => {
    handleUpdate({
      telecomTasks: dataFromModal.tasks,
      comment: dataFromModal.comment,
    });
    setTelecomReferralModalOpen(false);
  };

  const handleEtlReferralSubmit = (dataFromModal) => {
    handleUpdate({
      etlTasks: dataFromModal.tasks,
      comment: dataFromModal.comment,
    });
    setEtlReferralModalOpen(false);
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

  return (
    <>
      <Stack sx={{ height: "calc(100vh - 112px)" }}>
        {/* NON-SCROLLABLE PART */}
        <Box sx={{ flexShrink: 0, px: 3, pt: 2, bgcolor: "background.paper" }}>
          <IncidentHeader incident={incident} />
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="incident detail tabs"
            >
              <Tab label="Audit Trail & Actions" id="incident-tab-0" />
              <Tab label="Full Details" id="incident-tab-1" />
            </Tabs>
          </Box>
        </Box>

        {/* SCROLLABLE PART */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 3, py: 2 }}>
          <TabPanel value={activeTab} index={0}>
            <Stack spacing={3}>
              <Box>
                <IncidentAuditTrail
                  ref={auditTrailRef}
                  auditTrail={incident.auditTrail || []}
                  incident={incident}
                  onCommentEdit={handleCommentEdit}
                />
              </Box>
              {showActionArea && incident.status !== INCIDENT_STATUS.CLOSED && (
                <Box>
                  {canUserConfirm ? (
                    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                      <Typography variant="h5" gutterBottom>
                        Resolution Feedback
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        The support team has marked this incident as resolved.
                        Please provide your feedback to close the ticket or let
                        us know if the issue persists.
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
                      showSapResetButton={showSapResetButton}
                      onOpenSapResetDialog={() => setIsSapResetModalOpen(true)}
                      isRequestor={isRequestor}
                      canUserClose={canUserClose}
                      onUserClose={() =>
                        handleOpenDialog(DIALOG_CONTEXTS.USER_CLOSE)
                      }
                      canUserConfirm={canUserConfirm}
                      onUserConfirm={() =>
                        handleOpenDialog(
                          DIALOG_CONTEXTS.USER_CONFIRM_RESOLUTION
                        )
                      }
                      isDisabled={
                        incident.status === INCIDENT_STATUS.NEW &&
                        isRequestor &&
                        !isAdmin
                      }
                      onOpenTelecomReferralDialog={() =>
                        setTelecomReferralModalOpen(true)
                      }
                      onOpenEtlReferralDialog={() => {
                        setEtlReferralModalOpen(true);
                      }}
                      isAdmin={isAdmin}
                      isAssignedVendor={isAssignedVendor}
                      isTelecomUser={isTelecomUser}
                      isEtlUser={isEtlUser}
                    />
                  )}
                </Box>
              )}
            </Stack>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <IncidentDetailsCard
              incident={incident}
              onOpenDescriptionModal={() => setDescriptionModalOpen(true)}
            />
          </TabPanel>
        </Box>
      </Stack>

      {/* MODALS AND DIALOGS (unchanged) */}
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
      <SapPasswordResetModal
        open={isSapResetModalOpen}
        onClose={() => setIsSapResetModalOpen(false)}
        incident={incident}
        onSuccess={handlePasswordResetSuccess}
      />
      <DescriptionModal
        open={isDescriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        description={incident?.description}
      />
      <TelecomReferralModal
        open={isTelecomReferralModalOpen}
        onClose={() => setTelecomReferralModalOpen(false)}
        onSubmit={handleTelecomReferralSubmit}
      />
      <EtlReferralModal
        open={isEtlReferralModalOpen}
        onClose={() => setEtlReferralModalOpen(false)}
        onSubmit={handleEtlReferralSubmit}
      />
    </>
  );
}
