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
}) {
  const { data: session } = useSession();
  const user = session?.user;

  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  const [comment, setComment] = React.useState("");

  // FIX: Manage dropdown state correctly
  const [newType, setNewType] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("");

  React.useEffect(() => {
    // Sync state with the incident prop when it loads or changes
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
    onUpdate({
      comment,
      newType: newType === incident.incidentType?.name ? null : newType,
      newPriority: newPriority === incident.priority ? null : newPriority,
    });
    setComment("");
  };

  const handleResolveClick = () => {
    onOpenResolveDialog();
  };

  const {
    data: incidentTypes,
    error,
    isLoading: isLoadingTypes,
  } = useSWR("/api/incident-types", fetcher);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Take Action
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {isCITEmployee && (
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <FormControl
                fullWidth
                size="small"
                disabled={
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
                  {/* Map over the incidentTypes array from the API, handling the loading state */}
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
                  incident.status === "New" || incident.isPriorityLocked
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
        )}

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
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Button
              variant="outlined"
              color="success"
              onClick={handleResolveClick}
              sx={{ flex: 1, letterSpacing: "1px" }}
            >
              Resolve Incident
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitUpdate}
              sx={{ flex: 1, letterSpacing: "1px" }}
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
