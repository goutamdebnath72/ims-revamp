// In components/TelecomReferralModal.jsx

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

// TODO: Replace this placeholder list with your final list of tasks from the Telecom dept.
const telecomTasksList = [
  "OFC (Optical Fiber Cable) issue",
  "Media Converter (MC) issue",
  "UTP Cable replacement",
  "Network Switch port issue",
  "Wireless access point issue",
];

export default function TelecomReferralModal({ open, onClose, onSubmit }) {
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
        Refer Incident to Telecom
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Select the tasks required from the Telecom department and provide any
          additional instructions.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography component="legend" variant="subtitle1" sx={{ mb: 1 }}>
          Required Tasks (Check all that apply)
        </Typography>
        <FormGroup>
          {telecomTasksList.map((task) => (
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
