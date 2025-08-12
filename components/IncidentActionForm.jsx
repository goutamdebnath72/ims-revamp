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

const priorities = ["Low", "Medium", "High"];
const C_AND_IT_DEPT_CODES = [98540, 98500];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function IncidentActionForm({
  incident,
  onUpdate,
  onOpenResolveDialog,
  showResetButton,
  onOpenResetDialog,
}) {
  const { data: session } = useSession();
  const user = session?.user;

  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

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
                    {incidentTypes?.map((type) => (
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

        {/* Your existing comment box (no changes here) */}
        <TextField
          id="incident-comment"
          label="Provide a detailed update"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          fullWidth
          spellCheck={isSpellcheckEnabled}
          required
        />

        {/* Your existing buttons (no changes here) */}
        {isVendor ? (
          <Button
            variant="contained"
            onClick={handleSubmitUpdate}
            sx={{ width: "100%", letterSpacing: "1px" }}
            disabled={!comment.trim()}
          >
            Submit Update
          </Button>
        ) : (
          <Stack direction="row" spacing={0.6} sx={{ width: "100%" }}>
            {showResetButton && (
              <Button
                variant="outlined"
                onClick={onOpenResetDialog}
                sx={{
                  flex: 1,
                  color: "#d32f2f",
                  borderColor: "#d32f2f",
                  borderRadius: 0,
                  lineHeight: 1.3,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div>Reset</div>
                  <div>ESS Password</div>
                </div>
              </Button>
            )}
            <Button
              variant="outlined"
              color="success"
              onClick={onOpenResolveDialog}
              sx={{
                flex: 1,
                borderRadius: showResetButton ? 0 : undefined,
              }}
            >
              Resolve Incident
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitUpdate}
              sx={{
                flex: 1,
                borderRadius: showResetButton ? 0 : undefined,
              }}
              disabled={!comment.trim()}
            >
              Submit Update
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
