// File: components/ResolutionDialog.jsx
// UPDATED: The final confirmation button now has dynamic text.
"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SettingsContext } from "@/context/SettingsContext";

const closingReasons = [
    "Out of Scope",
    "User Unresponsive",
    "Referred to External Department",
    "Duplicate Incident",
    "Resolved by User",
];

export default function ResolutionDialog({ open, onClose, onConfirm }) {
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const [action, setAction] = React.useState('resolve');
  const [closingReason, setClosingReason] = React.useState('');
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  const handleActionChange = (event, newAction) => {
    if (newAction !== null) {
      setAction(newAction);
    }
  };

  const handleConfirm = () => {
    onConfirm({
        action,
        comment,
        rating: action === 'resolve' ? rating : null,
        closingReason: action === 'close' ? closingReason : null,
    });
    onClose();
    setComment("");
    setRating(3);
    setAction('resolve');
    setClosingReason('');
  };

  const handleCancel = () => {
    onClose();
    setComment("");
    setRating(3);
    setAction('resolve');
    setClosingReason('');
  };
  
  const isSubmitDisabled = !comment.trim() || (action === 'close' && !closingReason);

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>Finalize Incident</DialogTitle>
      <DialogContent sx={{ pt: '0 !important' }}>
        
        <ToggleButtonGroup
            value={action}
            exclusive
            onChange={handleActionChange}
            aria-label="resolution action"
            fullWidth
            sx={{ mb: 2 }}
        >
            <ToggleButton value="resolve" aria-label="resolve incident">
                Resolve Incident
            </ToggleButton>
            <ToggleButton value="close" aria-label="close incident">
                Close Incident
            </ToggleButton>
        </ToggleButtonGroup>

        {action === 'close' && (
            <FormControl fullWidth required sx={{ mb: 2 }} size="small">
                <InputLabel>Reason for Closing</InputLabel>
                <Select
                    value={closingReason}
                    label="Reason for Closing"
                    onChange={(e) => setClosingReason(e.target.value)}
                >
                    {closingReasons.map(reason => (
                        <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        )}
        
        <TextField
          autoFocus
          margin="dense"
          id="resolution-comment"
          label="Final Comment"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          spellCheck={isSpellcheckEnabled}
          required
        />

        {action === 'resolve' && (
            <Box
            sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
            }}
            >
            <Typography component="legend" sx={{ mr: 2 }}>
                Satisfaction Rating
            </Typography>
            <Rating
                name="resolution-rating"
                value={rating}
                onChange={(event, newValue) => {
                if (newValue !== null) {
                    setRating(newValue);
                }
                }}
            />
            </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isSubmitDisabled}
          color={action === 'resolve' ? 'success' : 'primary'}
        >
          {/* --- THIS IS THE FIX: The button text is now dynamic --- */}
          {action === 'resolve' ? 'Confirm Resolution' : 'Confirm Closure'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}