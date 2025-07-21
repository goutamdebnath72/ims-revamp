'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { SettingsContext } from "@/context/SettingsContext";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { incidentTypes } from '@/lib/incident-types';

const priorities = ['Low', 'Medium', 'High'];
const C_AND_IT_DEPT_CODES = [98540, 98500];

export default function IncidentActionForm({ incident, onUpdate, onOpenResolveDialog }) {
  const { data: session } = useSession();
  const user = session?.user;
  
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  const [comment, setComment] = React.useState("");
  const [newType, setNewType] = React.useState(incident.incidentType);
  const [newPriority, setNewPriority] = React.useState(incident.priority);

  React.useEffect(() => {
    if (incident) {
      setNewType(incident.incidentType);
      setNewPriority(incident.priority);
    }
  }, [incident]);

  const isCITEmployee = user && C_AND_IT_DEPT_CODES.includes(user.departmentCode);
  // --- 1. ADD A CHECK FOR THE NEW VENDOR ROLE ---
const isVendor = user?.role === 'network_vendor' || user?.role === 'biometric_vendor';
  const handleSubmitUpdate = () => {
    onUpdate({ comment, newType, newPriority });
    setComment("");
  };
  
  const handleResolveClick = () => {
    onOpenResolveDialog();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Take Action
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        
        {/* This section is already correctly hidden for non-C&IT users, including the vendor */}
        {isCITEmployee && (
            <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth size="small" disabled={incident.status === 'New' || incident.isTypeLocked}>
                        <InputLabel>Change Incident Type</InputLabel>
                        <Select value={newType} label="Change Incident Type" onChange={(e) => setNewType(e.target.value)}>
                            {incidentTypes.map((type) => (<MenuItem key={type} value={type}>{type}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <FormControl fullWidth size="small" disabled={incident.status === 'New' || incident.isPriorityLocked}>
                        <InputLabel>Change Priority</InputLabel>
                        <Select value={newPriority} label="Change Priority" onChange={(e) => setNewPriority(e.target.value)}>
                            {priorities.map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
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
        
        {/* --- 2. ADD CONDITIONAL LOGIC FOR BUTTONS --- */}
        {isVendor ? (
          // For Network Vendor: Show only one full-width button
          <Button
            variant="contained"
            onClick={handleSubmitUpdate}
            sx={{ width: "100%", letterSpacing: "1px" }}
            disabled={!comment.trim()}
          >
            Submit Update
          </Button>
        ) : (
          // For all other users: Show the original two buttons
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
