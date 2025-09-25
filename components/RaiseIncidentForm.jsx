"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import InfoTooltip from "./InfoTooltip";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  FormLabel,
  Alert,
  useMediaQuery,
} from "@mui/material";

const priorities = ["Low", "Medium", "High"];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const contactTooltipText = (
  <Box>
    <Typography color="inherit" sx={{ fontWeight: "bold" }}>
      Input Instructions
    </Typography>
    <ul style={{ paddingLeft: "20px", margin: "8px 0 0 0" }}>
      <li>
        For <b>Non-Executives</b>, provide the 5-digit Department PAX No.
      </li>
      <li>
        For <b>Executives</b>, provide your 10-digit CUG mobile number.
      </li>
    </ul>
  </Box>
);
const jobTitleTooltipText = (
  <Typography color="inherit">
    Think of this as the <b>Subject Line</b> of an email. Provide a short, clear
    summary of the issue.
  </Typography>
);
const descriptionTooltipText = (
  <Typography color="inherit">
    Think of this as the <b>Body</b> of an email. Provide all the details, error
    messages, and steps you've already tried.
  </Typography>
);

export default function RaiseIncidentForm({ onSubmit, isSubmitting }) {
  // --- START: RESPONSIVE TWEAKS ---
  // Flag for the 600px-800px "sweet spot" range
  const isSweetSpotScreen = useMediaQuery(
    "(min-height: 600px) and (max-height: 800px)"
  );
  // Flag for very short screens (below 600px)
  const isVeryShortScreen = useMediaQuery("(max-height: 599px)");
  // A general flag for any screen shorter than the default
  const isShortScreen = isSweetSpotScreen || isVeryShortScreen;
  // --- END: RESPONSIVE TWEAKS ---
  const isMidWideScreen = useMediaQuery(
    "(min-width: 1500px) and (max-width: 1600px)"
  );
  const isVeryWideScreen = useMediaQuery("(min-width: 1850px)");

  const { data: session } = useSession();
  const user = session?.user;
  const isExecutive = user?.ticketNo?.startsWith("4");
  const isAdmin = user?.role === "admin" || user?.role === "sys_admin";

  const [raiseFor, setRaiseFor] = React.useState("self");
  const [affectedTicketNoInput, setAffectedTicketNoInput] = React.useState("");
  const [foundUser, setFoundUser] = React.useState(null);
  const [lookupError, setLookupError] = React.useState("");
  const [isLookingUp, setIsLookingUp] = React.useState(false);
  const [formData, setFormData] = React.useState({
    incidentType: "",
    affectedTicketNo: "",
    priority: "Medium",
    department: "",
    location: "",
    contactNumber: "",
    jobTitle: "",
    description: "",
  });
  const [errors, setErrors] = React.useState({});

  const { data: incidentTypesData, isLoading: isLoadingTypes } = useSWR(
    "/api/incident-types",
    fetcher
  );
  const { data: departmentsData, isLoading: isLoadingDepts } = useSWR(
    "/api/departments",
    fetcher
  );
  const isSapIncidentType = formData.incidentType
    ?.toLowerCase()
    .includes("sap password");

  // All your React.useEffect, validation, and handler functions remain unchanged...
  // ... (Skipping identical code for brevity)
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "contactNumber":
        if (!value) {
          error = "Required.";
        } else if (isExecutive) {
          if (!/^943479\d{4}$/.test(value)) {
            error =
              "Please enter a valid 10-digit CUG No. starting with 943479.";
          }
        } else {
          if (!/^\d{5}$/.test(value)) {
            error = "Please enter a valid 5-digit PAX No.";
          }
        }
        break;
      case "affectedTicketNo": // For ESS Password
        if (!value) {
          error = "Required.";
        } else if (value === user?.ticketNo) {
          error = "You cannot raise a password reset request for yourself.";
        } else if (!/^\d{6}$/.test(value)) {
          error = "Please enter a valid 6-digit Ticket No.";
        }
        break;
      case "affectedTicketNoInput": // For "Raise for Other"
        if (!value) {
          error = "Required.";
        } else if (!foundUser) {
          error = "A valid user must be found for this ticket number.";
        }
        break;
      case "jobTitle":
        if (!value) {
          error = "Required.";
        } else if (value.length > 25) {
          error = "Job Title cannot exceed 25 characters.";
        }
        break;
      case "incidentType":
        if (value.toLowerCase().includes("sap password") && !user?.sailPNo) {
          error = "You must have a SAIL P/No in your profile to raise this.";
        } else if (!value) {
          error = "Required.";
        }
        break;
      case "location":
      case "description":
      case "department":
        if (!value) error = "Required.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const isString = typeof value === "string";
    const processedValue =
      isString && name !== "description" && name !== "jobTitle"
        ? value.trimStart()
        : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let newErrors = {};
    const trimmedFormData = {};
    for (const key in formData) {
      const value = formData[key];
      trimmedFormData[key] = typeof value === "string" ? value.trim() : value;
    }
    Object.keys(trimmedFormData).forEach((key) => {
      if (
        key === "affectedTicketNo" &&
        trimmedFormData.incidentType?.toLowerCase() !== "ess password"
      ) {
        return;
      }
      const error = validateField(key, trimmedFormData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (isAdmin && raiseFor === "other") {
      const affectedUserError = validateField(
        "affectedTicketNoInput",
        affectedTicketNoInput
      );
      if (affectedUserError) {
        newErrors.affectedTicketNoInput = affectedUserError;
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const finalPayload = { ...trimmedFormData };
      if (isAdmin && raiseFor === "other" && foundUser) {
        finalPayload.affectedUserId = foundUser.id;
      }
      onSubmit(finalPayload);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      // MODIFIED: Added conditional vertical margin to shorten the form's height by 12px.
      sx={{ my: isSweetSpotScreen ? -1.5 : 0 }}
    >
      <Stack
        spacing={
          isVeryShortScreen
            ? 1.5
            : isSweetSpotScreen
              ? 1.8
              : isVeryWideScreen
                ? 2.5
                : isMidWideScreen
                  ? 2.7
                  : 3
        }
      >
        {isAdmin && (
          <FormControl>
            <FormLabel
              sx={{ mb: 1, fontSize: "0.9rem", color: "text.secondary" }}
            >
              For Whom?
            </FormLabel>
            <ToggleButtonGroup
              value={raiseFor}
              exclusive
              onChange={(e, newValue) => {
                if (newValue) setRaiseFor(newValue);
              }}
              aria-label="raise for self or other"
              size={isShortScreen ? "small" : "medium"}
            >
              <ToggleButton value="self" aria-label="for myself">
                For Myself
              </ToggleButton>
              <ToggleButton
                value="other"
                aria-label="for another user"
                disabled={isSapIncidentType}
              >
                For Another User
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        )}

        {isAdmin && raiseFor === "other" && (
          <TextField
            required
            fullWidth
            name="affectedTicketNoInput"
            label="Affected User's Ticket No."
            value={affectedTicketNoInput}
            onChange={(e) => setAffectedTicketNoInput(e.target.value.trim())}
            onBlur={handleBlur}
            error={!!errors.affectedTicketNoInput || !!lookupError}
            InputProps={{
              endAdornment: isLookingUp ? <CircularProgress size={20} /> : null,
            }}
            helperText={
              errors.affectedTicketNoInput ||
              lookupError ||
              (foundUser
                ? `Found User: ${foundUser.name}`
                : "Enter the 6-digit ticket number.")
            }
            slotProps={{ input: { maxLength: 6 } }}
            size={isShortScreen ? "small" : "medium"}
          />
        )}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <FormControl
            fullWidth
            required
            error={!!errors.incidentType}
            disabled={isLoadingTypes}
          >
            <InputLabel>Incident Type</InputLabel>
            <Select
              name="incidentType"
              value={formData.incidentType}
              label="Incident Type"
              onChange={handleChange}
              onBlur={handleBlur}
              size={isShortScreen ? "small" : "medium"}
            >
              {incidentTypesData?.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.incidentType && (
              <FormHelperText>{errors.incidentType}</FormHelperText>
            )}
          </FormControl>
          <FormControl
            fullWidth
            required
            size={isShortScreen ? "small" : "medium"}
          >
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              label="Priority"
              onChange={handleChange}
            >
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            required
            error={!!errors.department}
            disabled={isLoadingDepts}
          >
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              label="Department"
              onChange={handleChange}
              onBlur={handleBlur}
              size={isShortScreen ? "small" : "medium"}
            >
              {departmentsData?.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
            {errors.department && (
              <FormHelperText>{errors.department}</FormHelperText>
            )}
          </FormControl>
          <TextField
            required
            fullWidth
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.location}
            helperText={errors.location || " "}
            size={isShortScreen ? "small" : "medium"}
          />
        </Stack>

        {isSapIncidentType && (
          <Alert severity="info">
            For security, SAP password resets can only be processed for the
            person raising the incident ({user?.name}).
          </Alert>
        )}

        {formData.incidentType?.toLowerCase() === "ess password" && (
          <Stack>
            <TextField
              required
              fullWidth
              name="affectedTicketNo"
              label="Affected Employee's Ticket No"
              value={formData.affectedTicketNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.affectedTicketNo}
              helperText={
                errors.affectedTicketNo || "Enter the 6-digit ticket number."
              }
              slotProps={{ input: { maxLength: 6 } }}
              size={isShortScreen ? "small" : "medium"}
            />
          </Stack>
        )}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <InfoTooltip title={contactTooltipText} placement="top-start">
            <TextField
              required
              fullWidth
              name="contactNumber"
              label="Contact Number / PAX"
              value={formData.contactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber || " "}
              size={isShortScreen ? "small" : "medium"}
            />
          </InfoTooltip>
          <InfoTooltip title={jobTitleTooltipText} placement="top-start">
            <TextField
              required
              fullWidth
              name="jobTitle"
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.jobTitle}
              inputProps={{ maxLength: 25 }}
              helperText={errors.jobTitle || `${formData.jobTitle.length} / 25`}
              size={isShortScreen ? "small" : "medium"}
            />
          </InfoTooltip>
          <TextField
            fullWidth
            disabled
            label="Ticket No."
            value={user?.ticketNo || ""}
            size={isShortScreen ? "small" : "medium"}
          />
          <TextField
            fullWidth
            disabled
            label="Requestor Name"
            value={user?.name || ""}
            size={isShortScreen ? "small" : "medium"}
          />
        </Stack>

        <InfoTooltip title={descriptionTooltipText} placement="top-start">
          <TextField
            required
            fullWidth
            multiline
            // Tweakable rows.
            // MODIFIED: Increased rows back to 4 as requested for the sweet spot screen height.
            rows={isVeryShortScreen ? 2 : isSweetSpotScreen ? 4 : 5}
            name="description"
            label="Please provide a detailed description of the issue"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.description}
            helperText={errors.description || " "}
            size={isShortScreen ? "small" : "medium"}
          />
        </InfoTooltip>
        <Box sx={{ position: "relative" }}>
          <Button
            variant="contained"
            size={isShortScreen ? "medium" : "large"}
            type="submit"
            disabled={isSubmitting}
            fullWidth
            sx={{
              // Tweakable padding.
              // MODIFIED: Further reduced vertical padding to balance the taller text area.
              py: isVeryShortScreen ? 1 : isSweetSpotScreen ? 0.6 : 1.5,
              // Tweakable font size.
              fontSize: isVeryShortScreen
                ? "0.9rem"
                : isSweetSpotScreen
                  ? "1rem"
                  : "1.1rem",
              letterSpacing: "1.5px",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Incident"}
          </Button>
          {isSubmitting && (
            <CircularProgress
              size={24}
              sx={{
                color: "primary.contrastText",
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
