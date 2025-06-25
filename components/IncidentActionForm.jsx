// File: components/IncidentActionForm.jsx
// UPDATED: Corrected title variant and button layout.
"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export default function IncidentActionForm() {
  const [comment, setComment] = React.useState("");

  const handleSubmitUpdate = () => {
    console.log("Submitting Update:", comment);
    setComment("");
  };

  const handleResolve = () => {
    console.log("Resolving Incident with comment:", comment);
    setComment("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {" "}
        {/* CORRECTED: Changed to h5 */}
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
        />
        {/* CORRECTED: Button layout is now full-width */}
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
          <Button
            variant="outlined"
            color="success"
            onClick={handleResolve}
            sx={{ flex: 1, letterSpacing: "1px" }}
          >
            Resolve Incident
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitUpdate}
            sx={{ flex: 1, letterSpacing: "1px" }}
          >
            Submit Update
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
