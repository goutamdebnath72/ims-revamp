"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { fluidPx, fluidRem } from "@/utils/fluidScale";
import { INCIDENT_STATUS } from "@/lib/constants";

// --- Design Tokens Object (based on AdminActionForm) ---
const TOK = {
  cardPad: fluidPx(12, 24),
  headerFS: fluidRem(1.0, 1.5),
  headerMb: fluidPx(8, 40),
  formSpacing: fluidPx(5, 40),
  textAreaH: fluidPx(80, 180),
  buttonH: fluidPx(28, 42),
  buttonFS: fluidRem(0.55, 0.9),
};

export default function TelecomETLActionForm({
  incident,
  onUpdate,
  onOpenResolveDialog,
}) {
  const [comment, setComment] = React.useState("");
  const [hasUpdated, setHasUpdated] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Set the correct incident ID and check status
  const isResolved =
    incident.status === INCIDENT_STATUS.RESOLVED ||
    incident.status === INCIDENT_STATUS.CLOSED;

  // Handles the update comment action
  const handleUpdateComment = async () => {
    setIsSubmitting(true);
    try {
      // The onUpdate prop from the parent will handle the API call
      await onUpdate({ comment });
      setHasUpdated(true);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: TOK.cardPad,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexShrink: 0, mb: TOK.headerMb }}>
        <Typography variant="h5" gutterBottom sx={{ fontSize: TOK.headerFS }}>
          Take Action
        </Typography>
        <Divider />
      </Box>
      <Stack
        sx={{
          flexGrow: 1,
          justifyContent: "space-between",
          gap: TOK.formSpacing,
        }}
      >
        <TextField
          id="incident-comment"
          label="Provide a detailed update"
          multiline
          sx={{
            "& .MuiInputBase-multiline": {
              minHeight: TOK.textAreaH,
              fontSize: fluidRem(0.9, 1),
            },
            "& .MuiInputBase-root": {
              alignItems: "flex-start",
            },
          }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          fullWidth
          spellCheck={true}
          placeholder="Start typing to enable the Update button..."
          InputLabelProps={{ shrink: true }}
          required
          disabled={isResolved}
        />
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
          <Button
            variant="contained"
            onClick={handleUpdateComment}
            disabled={isSubmitting || !comment.trim() || isResolved}
            sx={{ flex: 1, height: TOK.buttonH, fontSize: TOK.buttonFS }}
          >
            {isSubmitting ? "Updating..." : "Update Comment"}
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onOpenResolveDialog}
            disabled={!hasUpdated || isResolved}
            sx={{ flex: 1, height: TOK.buttonH, fontSize: TOK.buttonFS }}
          >
            Resolve Incident
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
