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
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Chip } from "@mui/material";

// --- NEW: Component now accepts 'incidentStatus' prop ---
export default function EditableComment({ initialComment, author, onSave, isEdited, incidentStatus }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const separator = '\n---\n';
  const parts = initialComment.split(separator);
  const systemPart = parts[0]; 
  const userPart = parts.slice(1).join(separator) || (parts.length === 1 ? parts[0] : '');

  const [editText, setEditText] = React.useState(userPart);
  const { user: currentUser } = React.useContext(UserContext);
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  const canEdit = currentUser && currentUser.name === author;
  const hasBeenEdited = isEdited;
  // --- NEW: Logic to check if the incident is resolved or closed ---
  const isIncidentClosed = incidentStatus === 'Resolved' || incidentStatus === 'Closed';

  const handleSave = () => {
    const finalComment = parts.length > 1 && systemPart !== userPart
      ? systemPart + separator + editText
      : editText;
      
    onSave(finalComment);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(userPart);
    setIsEditing(false);
  };

  const renderDisplayMode = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ display: "block", whiteSpace: "pre-wrap", flexGrow: 1 }}>
        {systemPart}
      </Typography>
      {parts.length > 1 && userPart && <Divider variant="dashed" sx={{ my: 1 }} />}
      {userPart && systemPart !== userPart && (
        <Typography variant="body2" color="text.secondary" sx={{ display: "block", whiteSpace: "pre-wrap", flexGrow: 1 }}>
            {userPart}
        </Typography>
      )}
    </>
  );

  if (isEditing) {
    return (
      <Box sx={{ my: 0.5, py: 1 }}>
        {parts.length > 1 && systemPart !== userPart && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ display: "block", whiteSpace: "pre-wrap", flexGrow: 1, fontStyle: 'italic', opacity: 0.7 }}>
              {systemPart}
            </Typography>
             <Divider sx={{ my: 1 }} />
          </>
        )}
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          multiline
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          spellCheck={isSpellcheckEnabled}
          label="Edit your comment"
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={!editText.trim()}>
            Save
          </Button>
           <Button size="small" variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    );
  }

  const getTitle = () => {
      // --- NEW: Title shows reason for being disabled ---
      if (isIncidentClosed) return "Editing is disabled for resolved or closed incidents";
      if (hasBeenEdited) return "This comment has already been edited once";
      if (canEdit) return "Edit comment";
      return "You can only edit your own comments";
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:hover .edit-button": {
          // --- NEW: Opacity logic also respects closed status ---
          opacity: canEdit && !hasBeenEdited && !isIncidentClosed ? 1 : 0.2,
        },
        minHeight: '36px',
      }}
    >
      <Box sx={{ flexGrow: 1, mt: 0.5 }}>
        {renderDisplayMode()}
      </Box>
      
      {hasBeenEdited && <Chip label="Edited" size="small" sx={{ ml: 1, alignSelf: 'center' }} />}

      <IconButton
        className="edit-button"
        size="small"
        onClick={() => setIsEditing(true)}
        // --- NEW: Button is now also disabled if incident is closed ---
        disabled={!canEdit || hasBeenEdited || isIncidentClosed}
        sx={{ ml: 1, opacity: (hasBeenEdited || isIncidentClosed) ? 0.2 : 0, transition: 'opacity 0.2s' }}
        title={getTitle()}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}