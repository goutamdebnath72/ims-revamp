"use client";

import * as React from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { SettingsContext } from "@/context/SettingsContext";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { INCIDENT_STATUS, AUDIT_ACTIONS, USER_ROLES } from "@/lib/constants";
import { fluidPx, fluidRem } from "@/utils/fluidScale";

// --- Design Tokens Object ---
const TOK = {
  cardPad: fluidPx(12, 24), // Card padding
  headerFS: fluidRem(1.0, 1.5), // "Take Action" font size
  headerMb: fluidPx(8, 20), // Margin below header
  formSpacing: fluidPx(5, 20), // Gap between form sections
  dropdownsPt: fluidPx(8, 12), // Padding top for dropdowns (for label fix)
  dropdownsMb: fluidPx(5, 20), // Margin below dropdowns
  dropdownH: fluidPx(28, 42), // Dropdown height
  dropdownFS: fluidRem(0.65, 1), // Dropdown font size
  dropdownLabelFS: fluidRem(0.6, 0.9), // Dropdown label font size
  dropdownLabelX: fluidPx(10, 14), // Left/Right position
  dropdownLabelY: fluidPx(-5, -9), // Up/Down position
  textAreaH: fluidPx(80, 150), // Fluid height for the text area (replaces rows={6})
  buttonH: fluidPx(28, 42), // Button height
  buttonFS: fluidRem(0.55, 0.9), // Button font size
};
// --- NEW VENDOR-SPECIFIC CONSTANTS ---
const VENDOR_TOK = {
  formSpacing: fluidPx(10, 20),
  textAreaH: fluidPx(120, 190), // Define a taller height just for vendors
  buttonH: fluidPx(30, 45),
  buttonFS: fluidRem(0.6, 1.0),
  buttonLetterSpacing: fluidPx(0.5, 1.2),
};

const priorities = ["Low", "Medium", "High"];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// --- VENDOR-SPECIFIC FORM COMPONENT ---
const VendorActionForm = ({
  onUpdate,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
}) => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
        gap: VENDOR_TOK.formSpacing, // Use vendor-specific gap
        pt: 3, // Buffer to prevent label clipping
      }}
    >
      <TextField
        id="incident-comment-vendor"
        label="Provide a detailed update"
        multiline
        //InputLabelProps={{ shrink: true }} // Permanently shrink label
        placeholder="Provide your update here..."
        sx={{
          "& .MuiInputBase-multiline": {
            minHeight: VENDOR_TOK.textAreaH, // Use vendor-specific height
            fontSize: fluidRem(0.9, 1),
          },
          "& .MuiInputBase-root": {
            alignItems: "flex-start", // Align cursor to the top
          },
        }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        spellCheck={isSpellcheckEnabled}
        required
      />
      <Button
        variant="contained"
        onClick={() => onUpdate({ comment })}
        disabled={isSubmitting || !comment.trim()}
        fullWidth
        sx={{
          height: VENDOR_TOK.buttonH, // Use vendor-specific height
          fontSize: VENDOR_TOK.buttonFS, // Use vendor-specific font size
          letterSpacing: VENDOR_TOK.buttonLetterSpacing,
        }}
      >
        {isSubmitting ? "Submitting..." : "Submit Update"}
      </Button>
    </Stack>
  );
};

// --- ADMIN-SPECIFIC FORM COMPONENT ---
const AdminActionForm = ({
  incident,
  onUpdate,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
  showResetButton,
  onOpenResetDialog,
  showReferToTelecomButton,
  onOpenTelecomReferralDialog,
  onOpenResolveDialog,
  incidentTypes,
  isLoadingTypes,
  newType,
  setNewType,
  newPriority,
  setNewPriority,
}) => {
  const referredToTelecom = incident?.status === "Pending Telecom Action";

  const canReferToTelecom = showReferToTelecomButton && !referredToTelecom;
  const isNew = incident.status === INCIDENT_STATUS.NEW;
  const isPasswordReset = incident.auditTrail.some(
    (entry) => entry.action === "Password Reset"
  );
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
        gap: TOK.formSpacing,
      }}
    >
      <Box>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: TOK.dropdownsMb, pt: TOK.dropdownsPt }}
        >
          <FormControl
            fullWidth
            size="small"
            disabled={
              isNew ||
              isPasswordReset ||
              isLoadingTypes ||
              incident.isTypeLocked
            }
            // --- 💡 STYLES MOVED HERE TO CONTROL THE SHRUNK LABEL ---
            sx={{
              "& .MuiInputLabel-shrink": {
                fontSize: TOK.dropdownLabelFS,
                transform: `translate(${TOK.dropdownLabelX}, ${TOK.dropdownLabelY}) scale(0.75)`,
              },
            }}
          >
            <InputLabel>Change Incident Type</InputLabel>
            <Select
              value={newType}
              label="Change Incident Type"
              onChange={(e) => setNewType(e.target.value)}
              sx={{
                height: TOK.dropdownH,
                fontSize: TOK.dropdownFS,
              }}
            >
              {incidentTypes &&
                incidentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            disabled={isNew || isPasswordReset || incident.isPriorityLocked}
            // --- 💡 STYLES MOVED HERE TO CONTROL THE SHRUNK LABEL ---
            sx={{
              "& .MuiInputLabel-shrink": {
                fontSize: TOK.dropdownLabelFS,
                transform: `translate(${TOK.dropdownLabelX}, ${TOK.dropdownLabelY}) scale(0.75)`,
              },
            }}
          >
            <InputLabel>Change Priority</InputLabel>
            <Select
              value={newPriority}
              label="Change Priority"
              onChange={(e) => setNewPriority(e.target.value)}
              sx={{
                height: TOK.dropdownH,
                fontSize: TOK.dropdownFS,
              }}
            >
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
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
          spellCheck={isSpellcheckEnabled}
          required
        />
      </Box>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        {canReferToTelecom && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onOpenTelecomReferralDialog}
            sx={{ flex: 1, height: TOK.buttonH, fontSize: TOK.buttonFS }}
          >
            Refer to Telecom
          </Button>
        )}
        {showResetButton && (
          <Button
            variant="outlined"
            onClick={onOpenResetDialog}
            sx={{
              flex: 1,
              height: TOK.buttonH,
              fontSize: TOK.buttonFS,
              color: "#d32f2f",
              borderColor: "#d32f2f",
              "&:hover": {
                borderColor: "#d32f2f",
                bgcolor: "rgba(211, 47, 47, 0.04)",
              },
            }}
          >
            Reset ESS Password
          </Button>
        )}
        <Button
          variant="outlined"
          color="success"
          onClick={onOpenResolveDialog}
          sx={{ flex: 1, height: TOK.buttonH, fontSize: TOK.buttonFS }}
          disabled={isNew}
        >
          Resolve Incident
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            onUpdate({
              comment,
              newType: newType === incident.incidentType?.name ? null : newType,
              newPriority:
                newPriority === incident.priority ? null : newPriority,
            })
          }
          sx={{ flex: 1, height: TOK.buttonH, fontSize: TOK.buttonFS }}
          disabled={isSubmitting || !comment.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit Update"}
        </Button>
      </Stack>
    </Stack>
  );
};

// --- STANDARD USER-SPECIFIC FORM COMPONENT ---
const StandardUserActionForm = ({
  incident,
  onUpdate,
  onUserClose,
  onUserConfirm,
  canUserConfirm,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
  isDisabled,
}) => {
  const placeholderText =
    "This form will be enabled once the support team processes your incident.";
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
        gap: TOK.formSpacing,
        pt: 3, // <-- Add this line to create the blank space at the top
      }}
    >
      <TextField
        id="incident-comment"
        label={isDisabled ? "" : "Provide a detailed update"}
        InputLabelProps={{ shrink: true }}
        multiline
        sx={{
          "& .MuiInputBase-multiline": {
            minHeight: fluidPx(120, 200),
            fontSize: fluidRem(0.9, 1),
          },
          // Add this block to align the cursor to the top
          "& .MuiInputBase-root": {
            alignItems: "flex-start",
          },
          // This block to enhance the clarity of placeholder
          "& .Mui-disabled::placeholder": {
            opacity: 1,
          },
        }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        spellCheck={isSpellcheckEnabled}
        required
        disabled={isDisabled}
        placeholder={placeholderText}
      />
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        {(incident.status === INCIDENT_STATUS.NEW ||
          incident.status === INCIDENT_STATUS.PROCESSED) && (
          <>
            <Button
              variant="outlined"
              onClick={() => onUpdate({ comment })}
              disabled={isDisabled || isSubmitting || !comment.trim()}
              fullWidth
              sx={{ height: TOK.buttonH, fontSize: TOK.buttonFS }}
            >
              Submit Update
            </Button>
            <Button
              variant="contained"
              onClick={onUserClose}
              disabled={isDisabled || isSubmitting}
              fullWidth
              sx={{ height: TOK.buttonH, fontSize: TOK.buttonFS }}
            >
              Close Incident
            </Button>
          </>
        )}
        {canUserConfirm && (
          <Button
            variant="contained"
            color="success"
            onClick={onUserConfirm}
            disabled={isDisabled || isSubmitting}
            fullWidth
            sx={{ height: TOK.buttonH, fontSize: TOK.buttonFS }}
          >
            Confirm Resolution
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

// --- MAIN FORM COMPONENT ---
export default function IncidentActionForm({
  incident,
  onUpdate,
  onOpenResolveDialog,
  showResetButton,
  onOpenResetDialog,
  isRequestor,
  canUserClose,
  onUserClose,
  canUserConfirm,
  onUserConfirm,
  isDisabled,
  showReferToTelecomButton,
  onOpenTelecomReferralDialog,
  isAdmin,
  isAssignedVendor,
  isTelecomUser,
  isAnimating,
}) {
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);
  const [comment, setComment] = React.useState("");
  const [newType, setNewType] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("");
  const { data: incidentTypes, isLoading: isLoadingTypes } = useSWR(
    "/api/incident-types",
    fetcher
  );

  React.useEffect(() => {
    if (incident) {
      setNewType(incident.incidentType?.name || "");
      setNewPriority(incident.priority || "");
    }
  }, [incident]);

  const { data: session } = useSession();
  const user = session?.user;
  const isSubmitting = onUpdate.isSubmitting;

  const handleUpdateAndClear = async (data) => {
    try {
      await onUpdate(data);
      setComment("");
    } catch (error) {
      console.error("Update failed, not clearing comment field.", error);
    }
  };

  const renderForm = () => {
    if (isAdmin) {
      return (
        <AdminActionForm
          {...{
            incident,
            onUpdate: handleUpdateAndClear,
            isSubmitting,
            comment,
            setComment,
            isSpellcheckEnabled,
            showResetButton,
            onOpenResetDialog,
            showReferToTelecomButton,
            onOpenTelecomReferralDialog,
            onOpenResolveDialog,
            incidentTypes,
            isLoadingTypes,
            newType,
            setNewType,
            newPriority,
            setNewPriority,
          }}
        />
      );
    }
    if (isAssignedVendor) {
      return (
        <VendorActionForm
          {...{
            onUpdate: handleUpdateAndClear,
            isSubmitting,
            comment,
            setComment,
            isSpellcheckEnabled,
          }}
        />
      );
    }
    if (isRequestor) {
      return (
        <StandardUserActionForm
          {...{
            incident,
            onUpdate: handleUpdateAndClear,
            onUserClose,
            onUserConfirm,
            canUserConfirm,
            isSubmitting,
            comment,
            setComment,
            isSpellcheckEnabled,
            isDisabled,
          }}
        />
      );
    }
    return null;
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
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
          // Conditionally hide scrollbar during animation
          "&::-webkit-scrollbar": {
            display: isAnimating ? "none" : "initial",
          },
          scrollbarWidth: isAnimating ? "none" : "auto", // For Firefox
        }}
      >
        {renderForm()}
      </Box>{" "}
    </Paper>
  );
}
