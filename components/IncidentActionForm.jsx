"use client";

import * as React from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { SettingsContext } from "@/context/SettingsContext";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { INCIDENT_STATUS, AUDIT_ACTIONS, USER_ROLES } from "@/lib/constants";

const priorities = ["Low", "Medium", "High"];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// --- VENDOR-SPECIFIC FORM COMPONENT ---
const VendorActionForm = ({
  onUpdate,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
}) => {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
      <TextField
        id="incident-comment"
        label="Provide a detailed update"
        multiline
        rows={8}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        spellCheck={isSpellcheckEnabled}
        required
      />
      <Button
        variant="contained"
        onClick={() => onUpdate({ comment })}
        disabled={isSubmitting || !comment.trim()}
        fullWidth
        size="large"
      >
        {isSubmitting ? "Submitting..." : "Submit Update"}
      </Button>
    </Stack>
  );
};

// --- ADMIN-SPECIFIC FORM COMPONENT ---
const AdminActionForm = ({
  incident,
  onUpdate,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
  showResetButton,
  onOpenResetDialog,
  showReferToTelecomButton,
  onOpenTelecomReferralDialog,
  onOpenResolveDialog,
  incidentTypes,
  isLoadingTypes,
  newType,
  setNewType,
  newPriority,
  setNewPriority,
}) => {
  const isNew = incident.status === INCIDENT_STATUS.NEW;
  const isPasswordReset = incident.auditTrail.some(
    (entry) => entry.action === "Password Reset"
  );

  return (
    <Stack spacing={3} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControl
            fullWidth
            size="small"
            disabled={
              isNew ||
              isPasswordReset ||
              isLoadingTypes ||
              incident.isTypeLocked
            }
          >
            <InputLabel>Change Incident Type</InputLabel>
            <Select
              value={newType}
              label="Change Incident Type"
              onChange={(e) => setNewType(e.target.value)}
            >
              {incidentTypes &&
                incidentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            disabled={isNew || isPasswordReset || incident.isPriorityLocked}
          >
            <InputLabel>Change Priority</InputLabel>
            <Select
              value={newPriority}
              label="Change Priority"
              onChange={(e) => setNewPriority(e.target.value)}
            >
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <TextField
          id="incident-comment"
          label="Provide a detailed update"
          multiline
          rows={6}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          fullWidth
          spellCheck={isSpellcheckEnabled}
          required
        />
      </Box>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        {showReferToTelecomButton && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onOpenTelecomReferralDialog}
            sx={{ flex: 1 }}
          >
            Refer to Telecom
          </Button>
        )}
        {showResetButton && (
          <Button
            variant="outlined"
            onClick={onOpenResetDialog}
            sx={{
              flex: 1,
              color: "#d32f2f",
              borderColor: "#d32f2f",
              "&:hover": {
                borderColor: "#d32f2f",
                bgcolor: "rgba(211, 47, 47, 0.04)",
              },
            }}
          >
            Reset ESS Password
          </Button>
        )}
        <Button
          variant="outlined"
          color="success"
          onClick={onOpenResolveDialog}
          sx={{ flex: 1 }}
          disabled={isNew}
        >
          Resolve Incident
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            onUpdate({
              comment,
              newType: newType === incident.incidentType?.name ? null : newType,
              newPriority:
                newPriority === incident.priority ? null : newPriority,
            })
          }
          sx={{ flex: 1 }}
          disabled={isSubmitting || !comment.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit Update"}
        </Button>
      </Stack>
    </Stack>
  );
};

// --- STANDARD USER-SPECIFIC FORM COMPONENT ---
const StandardUserActionForm = ({
  incident,
  onUpdate,
  onUserClose,
  onUserConfirm,
  canUserConfirm,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
  isDisabled,
}) => {
  const placeholderText =
    "This form will be enabled once the support team processes your incident.";

  return (
    <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
      <TextField
        id="incident-comment"
        label={isDisabled ? "" : "Provide a detailed update"}
        multiline
        rows={8}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        spellCheck={isSpellcheckEnabled}
        required
        disabled={isDisabled}
        placeholder={placeholderText}
      />
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        {(incident.status === INCIDENT_STATUS.NEW ||
          incident.status === INCIDENT_STATUS.PROCESSED) && (
          <>
            <Button
              variant="outlined"
              onClick={() => onUpdate({ comment })}
              disabled={isDisabled || isSubmitting || !comment.trim()}
              fullWidth
            >
              Submit Update
            </Button>
            <Button
              variant="contained"
              onClick={onUserClose}
              disabled={isDisabled || isSubmitting}
              fullWidth
            >
              Close Incident
            </Button>
          </>
        )}
        {canUserConfirm && (
          <Button
            variant="contained"
            color="success"
            onClick={onUserConfirm}
            disabled={isDisabled || isSubmitting}
            fullWidth
          >
            Confirm Resolution
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

// --- MAIN FORM COMPONENT ---
export default function IncidentActionForm({
  incident,
  onUpdate,
  onOpenResolveDialog,
  showResetButton,
  onOpenResetDialog,
  isRequestor,
  canUserClose,
  onUserClose,
  canUserConfirm,
  onUserConfirm,
  isDisabled,
  showReferToTelecomButton,
  onOpenTelecomReferralDialog,
  isAdmin,
  isAssignedVendor,
}) {
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);
  const [comment, setComment] = React.useState("");
  const [newType, setNewType] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("");

  const { data: incidentTypes, isLoading: isLoadingTypes } = useSWR(
    "/api/incident-types",
    fetcher
  );

  React.useEffect(() => {
    if (incident) {
      setNewType(incident.incidentType?.name || "");
      setNewPriority(incident.priority || "");
    }
  }, [incident]);

  const { data: session } = useSession();
  const user = session?.user;
  const isSubmitting = onUpdate.isSubmitting; // Assuming onUpdate is a mutate function from SWR or similar

  const renderForm = () => {
    if (isAdmin) {
      return (
        <AdminActionForm
          {...{
            incident,
            onUpdate,
            isSubmitting,
            comment,
            setComment,
            isSpellcheckEnabled,
            showResetButton,
            onOpenResetDialog,
            showReferToTelecomButton,
            onOpenTelecomReferralDialog,
            onOpenResolveDialog,
            incidentTypes,
            isLoadingTypes,
            newType,
            setNewType,
            newPriority,
            setNewPriority,
          }}
        />
      );
    }
    if (isAssignedVendor) {
      return (
        <VendorActionForm
          {...{
            onUpdate,
            isSubmitting,
            comment,
            setComment,
            isSpellcheckEnabled,
          }}
        />
      );
    }
    if (isRequestor) {
      return (
        <StandardUserActionForm
          {...{
            incident,
            onUpdate,
            onUserClose,
            onUserConfirm,
            canUserConfirm,
            isSubmitting,
            comment,
            setComment,
            isSpellcheckEnabled,
            isDisabled,
          }}
        />
      );
    }
    return null; // Should not happen if showActionArea is calculated correctly
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Take Action
        </Typography>
        <Divider />
      </Box>
      {renderForm()}
    </Paper>
  );
}
