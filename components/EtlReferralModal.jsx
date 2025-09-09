// In components/EtlReferralModal.jsx

"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";
import { TEAMS } from "@/lib/constants";

// CHANGED: Task list updated for ETL
const etlTasksList = ["Hardware Issue", "OS Related Issue"];

// CHANGED: Component name updated
export default function EtlReferralModal({ open, onClose, onSubmit }) {
  const [selectedTasks, setSelectedTasks] = React.useState([]);
  const [comment, setComment] = React.useState("");

  const handleTaskChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedTasks((prev) => [...prev, name]);
    } else {
      setSelectedTasks((prev) => prev.filter((task) => task !== name));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      tasks: selectedTasks,
      comment,
      assignedTeam: TEAMS.ETL, // CHANGED: Team updated to ETL
    });
    onClose();
  };

  // Reset state when the dialog is closed
  React.useEffect(() => {
    if (!open) {
      setSelectedTasks([]);
      setComment("");
    }
  }, [open]);

  const isSubmitDisabled = selectedTasks.length === 0 || !comment.trim();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Refer Incident to ETL {/* CHANGED: Title updated */}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {/* CHANGED: Instructional text updated */}
          Select the tasks required from the ETL department and provide any
          additional instructions.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography component="legend" variant="subtitle1" sx={{ mb: 1 }}>
          Required Tasks (Check all that apply)
        </Typography>
        <FormGroup>
          {/* CHANGED: Loop now uses the new ETL task list */}
          {etlTasksList.map((task) => (
            <FormControlLabel
              key={task}
              control={
                <Checkbox
                  checked={selectedTasks.includes(task)}
                  onChange={handleTaskChange}
                  name={task}
                />
              }
              label={task}
            />
          ))}
        </FormGroup>
        <TextField
          autoFocus
          margin="dense"
          id="referral-comment"
          label="Additional Instructions / Comment"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: "0 24px 16px" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled}
        >
          Submit Referral
        </Button>
      </DialogActions>
    </Dialog>
  );
}
