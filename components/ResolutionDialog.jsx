"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SettingsContext } from "@/context/SettingsContext";

export default function ResolutionDialog({ open, onClose, onConfirm }) {
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  const handleConfirm = () => {
    onConfirm(comment, rating);
    onClose();
    setComment("");
    setRating(3);
  };

  const handleCancel = () => {
    onClose();
    setComment("");
    setRating(3);
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Confirm Incident Resolution</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Please provide a final closing comment and rate the user's experience
          or the overall resolution process.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="resolution-comment"
          label="Final Resolution Comment"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          spellCheck={isSpellcheckEnabled}
        />
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
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          disabled={!comment.trim()}
        >
          Confirm Resolution
        </Button>
      </DialogActions>
    </Dialog>
  );
}