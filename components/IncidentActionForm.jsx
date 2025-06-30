// File: components/IncidentActionForm.jsx
// UPDATED: Dropdowns are now disabled if the incident status is "New".
'use client';

import * as React from 'react';
import { UserContext } from '@/context/UserContext';
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
const C_AND_IT_DEPT_CODES = [98540, 98541];

export default function IncidentActionForm({ incident, onUpdate, onOpenResolveDialog }) {
  const { user } = React.useContext(UserContext);
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
        
        {isCITEmployee && (
            <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* THIS IS THE FIX: Added 'incident.status === "New"' to the disabled condition */}
                    <FormControl fullWidth size="small" disabled={incident.status === 'New' || incident.isTypeLocked}>
                        <InputLabel>Change Incident Type</InputLabel>
                        <Select value={newType} label="Change Incident Type" onChange={(e) => setNewType(e.target.value)}>
                            {incidentTypes.map((type) => (<MenuItem key={type} value={type}>{type}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* THIS IS THE FIX: Added 'incident.status === "New"' to the disabled condition */}
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
      </Stack>
    </Paper>
  );
}