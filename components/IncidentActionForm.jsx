"use client";

import * as React from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { SettingsContext } from "@/context/SettingsContext";
import { useLoading } from "@/context/LoadingContext"; // Import the global loading hook
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  AUDIT_ACTIONS,
  INCIDENT_STATUS,
  INCIDENT_TYPES,
  USER_ROLES,
} from "@/lib/constants";
import { fluidPx, fluidRem } from "@/utils/fluidScale";

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
  buttonLetterSpacing: fluidPx(0.3, 0.8),
};
const TELECOM_ETL_TOK = {
  cardPad: fluidPx(12, 24),
  headerFS: fluidRem(1.0, 1.5),
  headerMb: fluidPx(8, 40),
  formSpacing: fluidPx(14, 40),
  textAreaH: fluidPx(90, 180),
  buttonH: fluidPx(28, 42),
  buttonFS: fluidRem(0.55, 0.9),
  buttonLetterSpacing: fluidPx(0.5, 0.8),
};
const VENDOR_TOK = {
  formSpacing: fluidPx(10, 20),
  textAreaH: fluidPx(120, 190),
  buttonH: fluidPx(30, 45),
  buttonFS: fluidRem(0.6, 1.0),
  buttonLetterSpacing: fluidPx(0.5, 1.2),
};
const priorities = ["Low", "Medium", "High"];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const getFormDisabledState = ({
  incident,
  isAdmin,
  isRequestor,
  isAssignedVendor,
  isTelecomUser,
  isEtlUser,
}) => {
  if (
    isAdmin &&
    (incident.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION ||
      incident.status === INCIDENT_STATUS.RESOLVED ||
      incident.status === INCIDENT_STATUS.CLOSED)
  ) {
    return true;
  }
  if (isRequestor && !isAdmin && incident.status === INCIDENT_STATUS.NEW) {
    return true;
  }
  if (
    isAssignedVendor &&
    incident.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
  ) {
    return true;
  }
  if (
    isTelecomUser &&
    (incident.status === INCIDENT_STATUS.RESOLVED ||
      incident.status === INCIDENT_STATUS.CLOSED)
  ) {
    return true;
  }
  if (
    isEtlUser &&
    (incident.status === INCIDENT_STATUS.RESOLVED ||
      incident.status === INCIDENT_STATUS.CLOSED)
  ) {
    return true;
  }
  return false;
};

const VendorActionForm = ({
  onUpdate,
  comment,
  setComment,
  isSpellcheckEnabled,
  isDisabled,
}) => {
  const { isLoading } = useLoading();
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
        gap: VENDOR_TOK.formSpacing,
        pt: 3,
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
        disabled={isDisabled}
      />
      <Button
        variant="contained"
        onClick={() => onUpdate({ comment })}
        disabled={isDisabled || isLoading || !comment.trim()}
        fullWidth
        sx={{
          height: VENDOR_TOK.buttonH,
          fontSize: VENDOR_TOK.buttonFS,
          letterSpacing: VENDOR_TOK.buttonLetterSpacing,
        }}
      >
        {isLoading ? "Submitting..." : "Submit Update"}
      </Button>
    </Stack>
  );
};

const AdminActionForm = ({
  incident,
  onUpdate,
  onUnlockType,
  comment,
  setComment,
  isSpellcheckEnabled,
  showResetButton,
  onOpenResetDialog,
  showSapResetButton,
  onOpenSapResetDialog,
  onOpenTelecomReferralDialog,
  onOpenEtlReferralDialog,
  onOpenResolveDialog,
  incidentTypes,
  isLoadingTypes,
  newType,
  setNewType,
  newPriority,
  setNewPriority,
  isDisabled,
}) => {
  const { isLoading } = useLoading();
  const isNew = incident.status === INCIDENT_STATUS.NEW;
  const isPermanentlyLocked = incident.auditTrail.some(
    (entry) =>
      entry.action === "Password Reset" || entry.action === "SAP Password Reset"
  );
  const showTelecomButton =
    newType.toLowerCase() === INCIDENT_TYPES.NETWORK.toLowerCase() &&
    incident.status === INCIDENT_STATUS.PROCESSED;
  const showEtlButton =
    newType.toLowerCase() === INCIDENT_TYPES.PC_PERIPHERALS.toLowerCase() &&
    incident.status === INCIDENT_STATUS.PROCESSED;
  const isAlreadyReferred =
    incident?.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION ||
    incident?.status === INCIDENT_STATUS.PENDING_ETL;
  const displayReferralButton =
    (showTelecomButton || showEtlButton) && !isAlreadyReferred;

  const hasUnsavedTypeChange =
    newType.toLowerCase() !== incident.incidentType?.name.toLowerCase();

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
          alignItems="center"
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ flex: 1 }}
          >
            <FormControl
              fullWidth
              size="small"
              disabled={
                isNew ||
                isLoadingTypes ||
                isPermanentlyLocked ||
                incident.isTypeLocked ||
                isDisabled
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
                {incidentTypes?.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip
              title={
                isPermanentlyLocked
                  ? "Type is permanently locked after a password reset."
                  : incident.isTypeLocked
                  ? "Click to unlock type"
                  : "Type is unlocked"
              }
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#333",
                    fontSize: "0.8rem",
                    letterSpacing: "0.5px",
                  },
                },
              }}
            >
              <span>
                <IconButton
                  onClick={onUnlockType}
                  disabled={
                    isPermanentlyLocked ||
                    !incident.isTypeLocked ||
                    isLoading ||
                    isDisabled
                  }
                  size="small"
                >
                  {isNew ||
                  isPermanentlyLocked ||
                  incident.isTypeLocked ||
                  isDisabled ? (
                    <LockIcon fontSize="small" />
                  ) : (
                    <LockOpenIcon fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <FormControl
            fullWidth
            size="small"
            disabled={
              isNew ||
              isPermanentlyLocked ||
              incident.isPriorityLocked ||
              isDisabled
            }
            sx={{
              flex: 1,
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
        {displayReferralButton && (
          <Button
            variant="outlined"
            color={showEtlButton ? "primary" : "secondary"}
            disabled={hasUnsavedTypeChange || isLoading}
            onClick={
              showEtlButton
                ? onOpenEtlReferralDialog
                : onOpenTelecomReferralDialog
            }
            sx={{
              flex: 1,
              height: TOK.buttonH,
              fontSize: TOK.buttonFS,
              letterSpacing: TOK.buttonLetterSpacing,
            }}
          >
            {showEtlButton ? "Refer to ETL" : "Refer to Telecom"}
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
              letterSpacing: TOK.buttonLetterSpacing,
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
        {showSapResetButton && (
          <Button
            variant="outlined"
            onClick={onOpenSapResetDialog}
            color="error"
            sx={{
              flex: 1,
              height: TOK.buttonH,
              fontSize: TOK.buttonFS,
              letterSpacing: TOK.buttonLetterSpacing,
            }}
          >
            Reset SAP Password
          </Button>
        )}
        <Button
          variant="outlined"
          color="success"
          onClick={onOpenResolveDialog}
          sx={{
            flex: 1,
            height: TOK.buttonH,
            fontSize: TOK.buttonFS,
            letterSpacing: TOK.buttonLetterSpacing,
          }}
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
          sx={{
            flex: 1,
            height: TOK.buttonH,
            fontSize: TOK.buttonFS,
            letterSpacing: TOK.buttonLetterSpacing,
          }}
          disabled={isLoading || !comment.trim()}
        >
          {isLoading ? "Submitting..." : "Submit Update"}
        </Button>
      </Stack>
    </Stack>
  );
};

const StandardUserActionForm = ({
  incident,
  onUpdate,
  onUserClose,
  onUserConfirm,
  canUserConfirm,
  comment,
  setComment,
  isSpellcheckEnabled,
  isDisabled,
}) => {
  const { isLoading } = useLoading();
  const placeholderText =
    "This form will be enabled once the support team processes your incident.";
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
        gap: TOK.formSpacing,
        pt: 3,
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
              disabled={isDisabled || isLoading || !comment.trim()}
              fullWidth
              sx={{
                height: TOK.buttonH,
                fontSize: TOK.buttonFS,
                letterSpacing: TOK.buttonLetterSpacing,
              }}
            >
              Submit Update
            </Button>
            <Button
              variant="contained"
              onClick={onUserClose}
              disabled={isDisabled || isLoading}
              fullWidth
              sx={{
                height: TOK.buttonH,
                fontSize: TOK.buttonFS,
                letterSpacing: TOK.buttonLetterSpacing,
              }}
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
            disabled={isDisabled || isLoading}
            fullWidth
            sx={{
              height: TOK.buttonH,
              fontSize: TOK.buttonFS,
              letterSpacing: TOK.buttonLetterSpacing,
            }}
          >
            Confirm Resolution
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

const TelecomActionForm = ({
  onUpdate,
  comment,
  setComment,
  isSpellcheckEnabled,
  onOpenResolveDialog,
  hasUpdated,
  isDisabled,
}) => {
  const { isLoading } = useLoading();
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
        disabled={isDisabled}
      />
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <Button
          variant="contained"
          color="success"
          onClick={onOpenResolveDialog}
          disabled={isDisabled || !hasUpdated}
          sx={{
            flex: 1,
            height: TELECOM_ETL_TOK.buttonH,
            fontSize: TELECOM_ETL_TOK.buttonFS,
            letterSpacing: TELECOM_ETL_TOK.buttonLetterSpacing,
          }}
        >
          Resolve Incident
        </Button>
        <Button
          variant="contained"
          onClick={() => onUpdate({ comment })}
          disabled={isDisabled || isLoading || !comment.trim()}
          sx={{
            flex: 1,
            height: TELECOM_ETL_TOK.buttonH,
            fontSize: TELECOM_ETL_TOK.buttonFS,
            letterSpacing: TELECOM_ETL_TOK.buttonLetterSpacing,
          }}
        >
          {isLoading ? "Updating..." : "Update Comment"}
        </Button>
      </Stack>
    </Stack>
  );
};

const EtlActionForm = ({
  onUpdate,
  comment,
  setComment,
  isSpellcheckEnabled,
  onOpenResolveDialog,
  hasUpdated,
  isDisabled,
}) => {
  const { isLoading } = useLoading();
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
        id="incident-comment-etl"
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
        disabled={isDisabled}
      />
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <Button
          variant="contained"
          color="success"
          onClick={onOpenResolveDialog}
          disabled={isDisabled || !hasUpdated}
          sx={{
            flex: 1,
            height: TELECOM_ETL_TOK.buttonH,
            fontSize: TELECOM_ETL_TOK.buttonFS,
            letterSpacing: TELECOM_ETL_TOK.buttonLetterSpacing,
          }}
        >
          Resolve Incident
        </Button>
        <Button
          variant="contained"
          onClick={() => onUpdate({ comment })}
          disabled={isDisabled || isLoading || !comment.trim()}
          sx={{
            flex: 1,
            height: TELECOM_ETL_TOK.buttonH,
            fontSize: TELECOM_ETL_TOK.buttonFS,
            letterSpacing: TELECOM_ETL_TOK.buttonLetterSpacing,
          }}
        >
          {isLoading ? "Updating..." : "Update Comment"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default function IncidentActionForm({
  incident,
  onUpdate,
  onOpenResolveDialog,
  showResetButton,
  onOpenResetDialog,
  showSapResetButton,
  onOpenSapResetDialog,
  isRequestor,
  canUserClose,
  onUserClose,
  canUserConfirm,
  onUserConfirm,
  onOpenTelecomReferralDialog,
  onOpenEtlReferralDialog,
  isAdmin,
  isAssignedVendor,
  isTelecomUser,
  isAnimating,
  isEtlUser,
}) {
  const { isSpellcheckEnabled } = React.useContext(SettingsContext);
  const [comment, setComment] = React.useState("");
  const [newType, setNewType] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("");
  const [hasUpdated, setHasUpdated] = React.useState(false);
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

  const handleUpdateAndClear = async (data) => {
    setComment("");
    try {
      await onUpdate(data);
      setHasUpdated(true);
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  const handleUnlockType = async () => {
    try {
      await onUpdate({ action: "UNLOCK_TYPE" });
    } catch (error) {
      console.error("Unlock failed", error);
    }
  };

  const isFormDeactivated = getFormDisabledState({
    incident,
    isAdmin,
    isRequestor,
    isAssignedVendor,
    isTelecomUser,
    isEtlUser,
  });

  const renderForm = () => {
    if (isAdmin) {
      return (
        <AdminActionForm
          {...{
            incident,
            onUpdate: handleUpdateAndClear,
            onUnlockType: handleUnlockType,
            comment,
            setComment,
            isSpellcheckEnabled,
            showResetButton,
            onOpenResetDialog,
            showSapResetButton,
            onOpenSapResetDialog,
            onOpenTelecomReferralDialog,
            onOpenEtlReferralDialog,
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
    if (isEtlUser) {
      return (
        <EtlActionForm
          {...{
            onUpdate: handleUpdateAndClear,
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
        mx: "auto",
        width: "99%",
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
          overflowY: isAnimating ? "hidden" : "auto",
          pr: 1,
        }}
      >
        {renderForm()}
      </Box>
    </Paper>
  );
}
