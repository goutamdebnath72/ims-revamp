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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// --- HELPER FUNCTIONS to manage the comment string ---
const separator = "\n---\n";

// Gets the system-generated (non-editable) part of a comment
const getSystemPart = (fullComment) => {
  if (!fullComment || !fullComment.includes(separator)) {
    return null;
  }
  return fullComment.split(separator)[0];
};

// Gets the user-written (editable) part of a comment
const getUserPart = (fullComment) => {
  if (!fullComment) return "";
  if (!fullComment.includes(separator)) {
    return fullComment; // If no separator, the whole comment is editable
  }
  return fullComment.split(separator).slice(1).join(separator);
};
// --- END OF HELPER FUNCTIONS ---

export default function EditableComment({
  action,
  comment,
  author,
  onSave,
  isEdited,
  incidentStatus,
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(""); // Initial state is empty
  const { data: session } = useSession();
  const currentUser = session?.user;
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);

  // --- LOGIC FOR EDITING CONSTRAINTS ---
  const isAuthor = currentUser && currentUser.name === author;
  const hasBeenEdited = isEdited;
  const isStatusCorrect = incidentStatus === "Processed";
  const isPasswordReset = action === "Password Reset";
  const canEdit =
    isAuthor && !hasBeenEdited && isStatusCorrect && !isPasswordReset;

  // --- UPDATED HANDLERS ---
  const handleEditClick = () => {
    // When editing starts, only load the user's part of the comment
    setEditText(getUserPart(comment));
    setIsEditing(true);
  };

  const handleSave = () => {
    const systemPart = getSystemPart(comment);
    // Rebuild the full comment string before saving
    const finalComment = systemPart
      ? `${systemPart}${separator}${editText}`
      : editText;

    onSave(finalComment);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // No need to reset editText, as it's set fresh on each edit click
    setIsEditing(false);
  };

  const renderDisplayMode = () => {
    const renderTextWithLineBreaks = (text) => {
      const lines = text.split("\n");
      return lines.map((line, index) => (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {line}
        </ReactMarkdown>
      ));
    };

    const systemPart = getSystemPart(comment);
    const userPart = getUserPart(comment);

    return (
      <Box
        sx={{
          "& p": {
            margin: 0,
            color: "text.secondary",
            fontSize: "0.875rem",
            whiteSpace: "pre-wrap",
          },
        }}
      >
        {systemPart && renderTextWithLineBreaks(systemPart)}
        {userPart && systemPart && <Divider variant="dashed" sx={{ my: 1 }} />}
        {userPart && renderTextWithLineBreaks(userPart)}
      </Box>
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
        onClick={handleEditClick} // <-- Use the new handler
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
