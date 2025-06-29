"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { SettingsContext } from "@/context/SettingsContext";

export default function IncidentActionForm({ onUpdate, onOpenResolveDialog }) {
  const [comment, setComment] = React.useState("");
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  const handleSubmitUpdate = () => {
    onUpdate(comment);
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