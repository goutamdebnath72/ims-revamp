// File: components/ResolutionDialog.jsx
"use client";

import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { SettingsContext } from "@/context/SettingsContext";
import { DIALOG_CONTEXTS, RESOLUTION_ACTIONS } from "@/lib/constants";

const adminClosingReasons = [
  "Out of Scope",
  "User Unresponsive",
  "Referred to External Department",
  "Duplicate Incident",
  "Resolved by User",
];
const userClosingReasons = [
  "Problem solved on its own",
  "I was able to fix the issue myself",
  "This is no longer a priority",
  "The issue is related to Hardware/OS",
  "Other",
];

export default function ResolutionDialog({
  open,
  onClose,
  onConfirm,
  context,
  inline = false,
}) {
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const [action, setAction] = React.useState("resolve");
  const [closingReason, setClosingReason] = React.useState("");
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  React.useEffect(() => {
    if (open || inline) {
      setComment("");
      setRating(3);
      setClosingReason("");

      if (context === DIALOG_CONTEXTS.USER_CLOSE) {
        setAction(RESOLUTION_ACTIONS.CLOSE);
      } else {
        setAction(RESOLUTION_ACTIONS.RESOLVE);
      }
    }
  }, [open, inline, context]);

  const handleConfirm = (payload) => {
    onConfirm(payload);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  const renderTitle = () => {
    switch (context) {
      case DIALOG_CONTEXTS.USER_CONFIRM_RESOLUTION:
        return "Resolution Feedback";
      case DIALOG_CONTEXTS.USER_CLOSE:
        return "Close Incident";
      default:
        return "Finalize Incident";
    }
  };

  const isSubmitDisabled =
    !comment.trim() ||
    (action === RESOLUTION_ACTIONS.CLOSE && !closingReason) ||
    (context === "user_close" && !closingReason);

  const FormContent = (
    <>
      {/* --- FIX: Using Typography for consistent h5 title --- */}
      <Typography variant="h5" gutterBottom>
        {renderTitle()}
      </Typography>
      <DialogContent sx={{ pt: "8px !important", px: 0 }}>
        {context === DIALOG_CONTEXTS.ADMIN_RESOLVE_CLOSE && (
          <ToggleButtonGroup
            value={action}
            exclusive
            onChange={(e, newAction) => newAction && setAction(newAction)}
            aria-label="resolution action"
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="resolve">Resolve Incident</ToggleButton>
            <ToggleButton value="close">Close Incident</ToggleButton>
          </ToggleButtonGroup>
        )}
        {action === RESOLUTION_ACTIONS.CLOSE && (
          <FormControl fullWidth required sx={{ mb: 2, mt: 1 }} size="small">
            <InputLabel>Reason for Closing</InputLabel>
            <Select
              value={closingReason}
              label="Reason for Closing"
              onChange={(e) => setClosingReason(e.target.value)}
            >
              {(context === DIALOG_CONTEXTS.USER_CLOSE
                ? userClosingReasons
                : adminClosingReasons
              ).map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="resolution-comment"
          label={
            context === "user_confirm_resolution"
              ? "Provide Feedback (Comment)"
              : "Final Comment"
          }
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
        {(action === RESOLUTION_ACTIONS.RESOLVE ||
          context === DIALOG_CONTEXTS.USER_CONFIRM_RESOLUTION) && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <Typography component="legend" sx={{ mr: 2 }}>
              Satisfaction Rating
            </Typography>
            <Rating
              name="resolution-rating"
              value={rating}
              onChange={(event, newValue) => {
                if (newValue !== null) setRating(newValue);
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: "16px 0 0 0" }}>
        {!inline && <Button onClick={handleCancel}>Cancel</Button>}
        {context === DIALOG_CONTEXTS.USER_CONFIRM_RESOLUTION ? (
          <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
            {/* --- FIX: Added flex: 1 to both buttons --- */}
            <Button
              onClick={() =>
                handleConfirm({ action: RESOLUTION_ACTIONS.RE_OPEN, comment })
              }
              variant="outlined"
              color="error"
              disabled={!comment.trim()}
              sx={{ flex: 1 }}
            >
              This is Not Solved (Re-open)
            </Button>
            <Button
              onClick={() =>
                handleConfirm({
                  action: RESOLUTION_ACTIONS.ACCEPT_CLOSE,
                  comment,
                  rating,
                })
              }
              variant="contained"
              color="success"
              disabled={!comment.trim()}
              sx={{ flex: 1 }}
            >
              Accept & Close Incident
            </Button>
          </Stack>
        ) : (
          <Button
            onClick={() =>
              handleConfirm({
                action,
                comment,
                rating: action === RESOLUTION_ACTIONS.RESOLVE ? rating : null,
                closingReason:
                  action === RESOLUTION_ACTIONS.CLOSE ? closingReason : null,
              })
            }
            variant="contained"
            disabled={isSubmitDisabled}
          >
            {action === RESOLUTION_ACTIONS.RESOLVE
              ? "Confirm Resolution"
              : "Confirm Closure"}
          </Button>
        )}
      </DialogActions>
    </>
  );

  if (inline) {
    return FormContent;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Replaced DialogTitle with a consistent div wrapper */}
      <Box sx={{ p: 3 }}>{FormContent}</Box>
    </Dialog>
  );
}
