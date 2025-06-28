"use client";

import * as React from "react";
import { UserContext } from "@/context/UserContext";
import { SettingsContext } from "@/context/SettingsContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function EditableComment({ initialComment, author, onSave }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(initialComment);
  const { user: currentUser } = React.useContext(UserContext);
  
  // CORRECTED THIS LINE:
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  const canEdit = currentUser && currentUser.name === author;

  const handleSave = () => {
    onSave(editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(initialComment);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Box sx={{ my: 0.5, py: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          multiline
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          spellCheck={isSpellcheckEnabled}
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
        alignItems: "flex-start",
        justifyContent: "space-between",
        "&:hover .edit-button": {
          opacity: canEdit ? 1 : 0.2,
        },
        minHeight: '36px',
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: "block",
          mt: 0.5,
          whiteSpace: "pre-wrap",
          flexGrow: 1,
        }}
      >
        {initialComment}
      </Typography>
      <IconButton
        className="edit-button"
        size="small"
        onClick={() => setIsEditing(true)}
        disabled={!canEdit}
        sx={{ ml: 1, opacity: 0, transition: 'opacity 0.2s' }}
        title={canEdit ? "Edit comment" : "You can only edit your own comments"}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}