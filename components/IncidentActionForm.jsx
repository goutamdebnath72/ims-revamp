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
  cardPad: fluidPx(12, 24),
  headerFS: fluidRem(1.0, 1.5),
  headerMb: fluidPx(8, 20),
  formSpacing: fluidPx(5, 20),
  dropdownsPt: fluidPx(8, 12),
  dropdownsMb: fluidPx(5, 20),
  dropdownH: fluidPx(28, 42),
  dropdownFS: fluidRem(0.65, 1),
  dropdownLabelFS: fluidRem(0.6, 0.9),
  dropdownLabelX: fluidPx(10, 14),
  dropdownLabelY: fluidPx(-5, -9),
  textAreaH: fluidPx(80, 150),
  buttonH: fluidPx(28, 42),
  buttonFS: fluidRem(0.55, 0.9),
};

// --- TELECOM and ETL -SPECIFIC CONSTANTS ---
const TELECOM_ETL_TOK = {
  cardPad: fluidPx(12, 24),
  headerFS: fluidRem(1.0, 1.5),
  headerMb: fluidPx(8, 40),
  formSpacing: fluidPx(5, 40),
  textAreaH: fluidPx(80, 180),
  buttonH: fluidPx(28, 42),
  buttonFS: fluidRem(0.55, 0.9),
};

// --- VENDOR-SPECIFIC CONSTANTS ---
const VENDOR_TOK = {
  formSpacing: fluidPx(10, 20),
  textAreaH: fluidPx(120, 190),
  buttonH: fluidPx(30, 45),
  buttonFS: fluidRem(0.6, 1.0),
  buttonLetterSpacing: fluidPx(0.5, 1.2),
};

const priorities = ["Low", "Medium", "High"];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// --- CENTRALIZED SWITCHBOARD FOR DISABLING FORMS ---
const getFormDisabledState = ({
  incident,
  isAdmin,
  isRequestor,
  isAssignedVendor,
  isTelecomUser, // <-- 1. ADDED MISSING PARAMETER
}) => {
  // Rule for Admins
  if (
    isAdmin &&
    (incident.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION ||
      incident.status === INCIDENT_STATUS.RESOLVED ||
      incident.status === INCIDENT_STATUS.CLOSED)
  ) {
    return true;
  }
  // Rule for Standard Users
  if (isRequestor && incident.status === INCIDENT_STATUS.NEW) {
    return true;
  }
  // Rule for Vendors
  if (
    isAssignedVendor &&
    incident.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
  ) {
    return true;
  }
  // Rule for Telecom Users (NEW)
  if (
    isTelecomUser &&
    (incident.status === INCIDENT_STATUS.RESOLVED ||
      incident.status === INCIDENT_STATUS.CLOSED)
  ) {
    return true;
  }
  // Default case: The form is enabled.
  return false;
};

// --- VENDOR-SPECIFIC FORM COMPONENT ---
const VendorActionForm = ({
  onUpdate,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
  isDisabled, // Receives the 'switch' from the parent
}) => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
        gap: VENDOR_TOK.formSpacing,
        pt: 3,
        // This block handles the visual "greyed out" style
        ...(isDisabled && {
          opacity: 0.6,
          pointerEvents: "none",
          filter: "grayscale(1)",
        }),
      }}
    >
      <TextField
        id="incident-comment-vendor"
        label="Provide a detailed update"
        multiline
        placeholder="Provide your update here..."
        sx={{
          "& .MuiInputBase-multiline": {
            minHeight: VENDOR_TOK.textAreaH,
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
        disabled={isDisabled} // <-- This is the crucial line for the text box
      />
      <Button
        variant="contained"
        onClick={() => onUpdate({ comment })}
        // This correctly combines the master switch with its own logic
        disabled={isDisabled || isSubmitting || !comment.trim()}
        fullWidth
        sx={{
          height: VENDOR_TOK.buttonH,
          fontSize: VENDOR_TOK.buttonFS,
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
  isDisabled,
}) => {
  const referredToTelecom =
    incident?.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION;
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
        ...(isDisabled && {
          opacity: 0.6,
          pointerEvents: "none",
          filter: "grayscale(1)",
        }),
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
              sx={{ height: TOK.dropdownH, fontSize: TOK.dropdownFS }}
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
              sx={{ height: TOK.dropdownH, fontSize: TOK.dropdownFS }}
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
            "& .MuiInputBase-root": { alignItems: "flex-start" },
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
        pt: 3,
        // Add this block for the consistent deactivation style
        ...(isDisabled && {
          opacity: 0.6,
          pointerEvents: "none",
          filter: "grayscale(1)",
        }),
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
          "& .MuiInputBase-root": {
            alignItems: "flex-start",
          },
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

// --- TELECOM-SPECIFIC FORM COMPONENT (NEW) ---
const TelecomActionForm = ({
  onUpdate,
  isSubmitting,
  comment,
  setComment,
  isSpellcheckEnabled,
  onOpenResolveDialog,
  hasUpdated,
  isDisabled,
}) => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
        gap: TELECOM_ETL_TOK.formSpacing,
        pt: 3,
        ...(isDisabled && {
          opacity: 0.6,
          pointerEvents: "none",
          filter: "grayscale(1)",
        }),
      }}
    >
      <TextField
        id="incident-comment-telecom"
        label="Provide a detailed update"
        multiline
        InputLabelProps={{ shrink: true }}
        placeholder="Start typing to enable the Update button..."
        sx={{
          "& .MuiInputBase-multiline": { minHeight: TELECOM_ETL_TOK.textAreaH },
          "& .MuiInputBase-root": { alignItems: "flex-start" },
        }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        spellCheck={isSpellcheckEnabled}
        required
        disabled={isDisabled} // <-- FIX 1: Added disabled prop
      />
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <Button
          variant="contained"
          color="success"
          onClick={onOpenResolveDialog}
          disabled={isDisabled || !hasUpdated} // <-- FIX 2: Added isDisabled check
          sx={{
            flex: 1,
            height: TELECOM_ETL_TOK.buttonH,
            fontSize: TELECOM_ETL_TOK.buttonFS,
          }}
        >
          Resolve Incident
        </Button>
        <Button
          variant="contained"
          onClick={() => onUpdate({ comment })}
          disabled={isDisabled || isSubmitting || !comment.trim()} // <-- FIX 3: Added isDisabled check
          sx={{
            flex: 1,
            height: TELECOM_ETL_TOK.buttonH,
            fontSize: TELECOM_ETL_TOK.buttonFS,
          }}
        >
          {isSubmitting ? "Updating..." : "Update Comment"}
        </Button>
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
  showReferToTelecomButton,
  onOpenTelecomReferralDialog,
  isAdmin,
  isAssignedVendor,
  isTelecomUser,
  isAnimating,
  isEtlUser, // Removed isDisabled from here
}) {
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);
  const [comment, setComment] = React.useState("");
  const [newType, setNewType] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("");
  const [hasUpdated, setHasUpdated] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { data: incidentTypes, isLoading: isLoadingTypes } = useSWR(
    "/api/incident-types",
    fetcher
  );

  React.useEffect(() => {
    if (incident) {
      setNewType(incident.incidentType?.name || "");
      setNewPriority(incident.priority || "");
      const hasAction = incident.auditTrail.some(
        (entry) =>
          entry.authorRole === USER_ROLES.TELECOM_USER ||
          entry.authorRole === USER_ROLES.ETL
      );
      setHasUpdated(hasAction);
    }
  }, [incident]);

  const { data: session } = useSession();
  const user = session?.user;

  const handleUpdateAndClear = async (data) => {
    setIsSubmitting(true); // 1. Immediately disable the submit button
    setComment(""); // 2. Immediately clear the text box

    try {
      await onUpdate(data); // 3. Now, wait for the API call to finish
      setHasUpdated(true);
    } catch (error) {
      console.error("Update failed", error);
      // If the update fails, you might want to restore the user's comment
      // setComment(data.comment);
    } finally {
      setIsSubmitting(false); // 4. Re-enable the button when done (success or fail)
    }
  };

  const isFormDeactivated = getFormDisabledState({
    incident,
    isAdmin,
    isRequestor,
    isAssignedVendor,
    isTelecomUser,
  });

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
            isDisabled: isFormDeactivated,
          }}
        />
      );
    }
    if (isTelecomUser) {
      return (
        <TelecomActionForm
          {...{
            onUpdate: handleUpdateAndClear,
            isSubmitting,
            comment,
            setComment,
            isSpellcheckEnabled,
            onOpenResolveDialog,
            hasUpdated,
            isDisabled: isFormDeactivated,
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
            isDisabled: isFormDeactivated,
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
            isDisabled: isFormDeactivated,
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
          "&::-webkit-scrollbar": { display: isAnimating ? "none" : "initial" },
          scrollbarWidth: isAnimating ? "none" : "auto",
        }}
      >
        {renderForm()}
      </Box>
    </Paper>
  );
}
