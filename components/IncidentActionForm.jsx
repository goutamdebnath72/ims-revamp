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
import {
  INCIDENT_STATUS,
  USER_ROLES,
  AUDIT_ACTIONS,
  INCIDENT_TYPES,
} from "@/lib/constants";

const priorities = ["Low", "Medium", "High"];
const C_AND_IT_DEPT_CODES = [98540, 98500];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function IncidentActionForm({
  incident,
  onUpdate,
  onOpenResolveDialog,
  showResetButton,
  onOpenResetDialog,
  // --- New props start here ---
  isRequestor,
  canUserClose,
  onUserClose,
  canUserConfirm,
  onUserConfirm,
  isDisabled,
}) {
  const { data: session } = useSession();
  const user = session?.user;

  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  // --- START: ADD THIS DEBUGGING BLOCK ---
  React.useEffect(() => {
    console.log("--- ACTION FORM PROPS CHECK ---");
    console.log("isTypeLocked:", incident.isTypeLocked);
    console.log("isPriorityLocked:", incident.isPriorityLocked);
  }, [incident]);
  // --- END: ADD THIS DEBUGGING BLOCK ---

  const [comment, setComment] = React.useState("");
  const [newType, setNewType] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("");
  const [affectedTicketNo, setAffectedTicketNo] = React.useState(
    incident.affectedTicketNo || ""
  );

  React.useEffect(() => {
    if (incident) {
      setNewType(incident.incidentType?.name || "");
      setNewPriority(incident.priority || "");
    }
  }, [incident]);

  const isCITEmployee =
    user && C_AND_IT_DEPT_CODES.includes(user.departmentCode);
  const isVendor =
    user?.role === "network_vendor" || user?.role === "biometric_vendor";

  const handleSubmitUpdate = () => {
    const payload = {
      comment,
      newType: newType === incident.incidentType?.name ? null : newType,
      newPriority: newPriority === incident.priority ? null : newPriority,
    };

    if (newType === "ESS Password") {
      payload.affectedTicketNo = affectedTicketNo;
    }

    onUpdate(payload);
    setComment("");
  };

  const { data: incidentTypes, isLoading: isLoadingTypes } = useSWR(
    "/api/incident-types",
    fetcher
  );

  const isPasswordReset = incident.auditTrail.some(
    (entry) => entry.action === "Password Reset"
  );

  const placeholderText = isDisabled
    ? "This form will be enabled once the support team processes your incident."
    : "";

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Take Action
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {isCITEmployee && (
          <>
            {/* This is the existing stack with the two dropdowns */}
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled={
                    isPasswordReset ||
                    isLoadingTypes ||
                    incident.status === "New" ||
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
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled={
                    isPasswordReset ||
                    incident.status === "New" ||
                    incident.isPriorityLocked
                  }
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
              </Box>
            </Stack>

            {/* --- THIS IS THE NEW TEXTFIELD TO ADD --- */}
            {/* It will appear only when "ESS Password" is selected */}
            {newType === "ESS Password" && (
              <TextField
                required
                fullWidth
                size="small"
                label="Affected Employee's Ticket No"
                value={affectedTicketNo}
                onChange={(e) => setAffectedTicketNo(e.target.value.trim())}
                slotProps={{ input: { maxLength: 6 } }}
              />
            )}
          </>
        )}

        {/* existing comment box (no changes here) */}
        <TextField
          id="incident-comment"
          // This now conditionally removes the label when disabled
          label={isDisabled ? "" : "Provide a detailed update"}
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          fullWidth
          spellCheck={isSpellcheckEnabled}
          required
          disabled={isDisabled}
          placeholder={placeholderText}
          // This new sx prop makes the disabled placeholder text clear
          sx={{
            "& .MuiInputBase-input.Mui-disabled::placeholder": {
              opacity: 1,
              color: "rgba(0, 0, 0, 0.6)",
              WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
            },
          }}
        />

        {/* --- ADDING THIS TEMPORARY DEBUGGING BLOCK --- */}
        {/*<pre>
          {JSON.stringify(
            {
              isDisabled,
              comment,
              isCommentEmpty: !comment.trim(),
              isButtonDisabled: isDisabled || !comment.trim(),
            },
            null,
            2
          )}
        </pre>*/}
        {/* --- END OF DEBUGGING BLOCK --- */}
        {/* --- START: NEW DYNAMIC BUTTON LOGIC --- */}
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
          {isRequestor ? (
            // --- Buttons for the Standard User (Requestor) ---
            <>
              {(incident.status === INCIDENT_STATUS.NEW ||
                incident.status === INCIDENT_STATUS.PROCESSED) && (
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                  <Button
                    variant="outlined"
                    onClick={handleSubmitUpdate}
                    disabled={isDisabled || !comment.trim()}
                    fullWidth
                  >
                    Submit Update
                  </Button>
                  <Button
                    variant="contained"
                    onClick={onUserClose}
                    disabled={isDisabled}
                    fullWidth
                  >
                    Close Incident
                  </Button>
                </Stack>
              )}
              {canUserConfirm && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={onUserConfirm}
                  disabled={isDisabled}
                  fullWidth
                >
                  Confirm Resolution
                </Button>
              )}
            </>
          ) : (
            // --- Buttons for Admins / Vendors (This part remains unchanged) ---
            <>
              {isVendor ? (
                <Button
                  variant="contained"
                  onClick={handleSubmitUpdate}
                  disabled={isDisabled || !comment.trim()}
                  fullWidth
                >
                  Submit Update
                </Button>
              ) : (
                <>
                  {showResetButton && (
                    <Button
                      variant="outlined"
                      onClick={onOpenResetDialog}
                      disabled={isDisabled}
                      sx={{
                        flex: 1,
                        color: "#d32f2f",
                        borderColor: "#d32f2f",
                        "&:hover": {
                          borderColor: "#d32f2f",
                          bgcolor: "rgba(211, 47, 47, 0.04)",
                        },
                        lineHeight: 1.3,
                        textAlign: "center",
                      }}
                    >
                      <div>
                        <div>Reset</div>
                        <div>ESS Password</div>
                      </div>
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={onOpenResolveDialog}
                    sx={{ flex: 1 }}
                    disabled={
                      isDisabled || incident.status === INCIDENT_STATUS.NEW
                    }
                  >
                    Resolve Incident
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmitUpdate}
                    sx={{ flex: 1 }}
                    disabled={isDisabled || !comment.trim()}
                  >
                    Submit Update
                  </Button>
                </>
              )}
            </>
          )}
        </Stack>
        {/* --- END: NEW DYNAMIC BUTTON LOGIC --- */}
      </Stack>
    </Paper>
  );
}
