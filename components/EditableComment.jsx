"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { SettingsContext } from "@/context/SettingsContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Chip } from "@mui/material";

export default function EditableComment({
  comment,
  author,
  onSave,
  isEdited,
  incidentStatus,
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(comment);
  const { data: session } = useSession();
  const currentUser = session?.user;
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  // --- CORRECTED LOGIC FOR EDITING CONSTRAINTS ---
  // 1. User can only edit their own comment.
  const isAuthor = currentUser && currentUser.name === author;
  // 2. Editing can only be done once.
  const hasBeenEdited = isEdited;
  // 3. Editing is only active in the 'Processed' state.
  const isStatusCorrect = incidentStatus === "Processed";

  const canEdit = isAuthor && !hasBeenEdited && isStatusCorrect;

  const handleSave = () => {
    onSave(editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(comment);
    setIsEditing(false);
  };

  const renderDisplayMode = () => {
    const separator = "\n---\n";
    const parts = comment ? comment.split(separator) : [""];
    const systemPart = parts[0];
    const userPart = parts.slice(1).join(separator);

    return (
      <>
        {systemPart && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "block", whiteSpace: "pre-wrap" }}
          >
            {systemPart}
          </Typography>
        )}
        {userPart && (
          <>
            <Divider variant="dashed" sx={{ my: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "block", whiteSpace: "pre-wrap" }}
            >
              {userPart}
            </Typography>
          </>
        )}
      </>
    );
  };

  if (isEditing) {
    return (
      <Box sx={{ my: 0.5, py: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={4}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          spellCheck={isSpellcheckEnabled}
          label="Edit your comment"
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!editText.trim()}
          >
            Save
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:hover .edit-button": { opacity: canEdit ? 1 : 0.2 },
        minHeight: "36px",
      }}
    >
      <Box sx={{ flexGrow: 1, mt: 0.5 }}>{renderDisplayMode()}</Box>
      {hasBeenEdited && (
        <Chip label="Edited" size="small" sx={{ ml: 1, alignSelf: "center" }} />
      )}
      <IconButton
        className="edit-button"
        size="small"
        onClick={() => setIsEditing(true)}
        disabled={!canEdit}
        sx={{ ml: 1, opacity: canEdit ? 0 : 0.2, transition: "opacity 0.2s" }}
        title={
          isAuthor
            ? hasBeenEdited
              ? "Already edited once"
              : isStatusCorrect
              ? "Edit comment"
              : "Cannot edit unless status is Processed"
            : "Can only edit your own comments"
        }
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}