"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import InfoTooltip from "./InfoTooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
  const { data: session } = useSession();
  const user = session?.user;
  const loggedInUserTicketNo = session?.user?.ticketNo;
  const isExecutive = user?.id?.startsWith("4");

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

  React.useEffect(() => {
    // This sets the user's default department only after the department list has loaded
    if (user?.departmentCode && departmentsData?.length > 0) {
      // First, find the full department object that matches the user's code
      const userDepartment = departmentsData.find(
        (dept) => dept.code === user.departmentCode
      );
      // If we found it, set the form's state to use the department's unique ID
      if (userDepartment) {
        setFormData((prev) => ({ ...prev, department: userDepartment.id }));
      }
    }
  }, [user, departmentsData]);

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
      case "affectedTicketNo":
        if (!value) {
          error = "Required.";
        } else if (value === loggedInUserTicketNo) {
          // <-- ADDED THIS CHECK
          error = "You cannot raise a password reset request for yourself.";
        } else if (!/^\d{6}$/.test(value)) {
          error = "Please enter a valid 6-digit Ticket No.";
        }
        break;
      case "incidentType":
      case "location":
      case "description":
      case "jobTitle":
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

    // First, check if the value is a string before trying to trim it
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
    const newErrors = {};
    const trimmedFormData = {};

    // Trim all string values before validation and submission
    for (const key in formData) {
      const value = formData[key];
      trimmedFormData[key] = typeof value === "string" ? value.trim() : value;
    }

    Object.keys(trimmedFormData).forEach((key) => {
      // Skip validating affectedTicketNo if it's not an ESS Password incident
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

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(trimmedFormData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {/* ROW 1 */}
        <Stack direction="row" spacing={2}>
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

          <FormControl fullWidth required>
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
          />
        </Stack>
        {/* --- REVISED CODE BLOCK FOR THE CONDITIONAL FIELD --- */}
        {/* This will now appear on its own line */}
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
            />
          </Stack>
        )}
        {/* --- END OF REVISED CODE BLOCK --- */}

        {/* ROW 2 */}
        <Stack direction="row" spacing={2}>
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
              helperText={errors.jobTitle || " "}
            />
          </InfoTooltip>

          <TextField
            fullWidth
            disabled
            label="Ticket No."
            value={user?.ticketNo || ""}
          />
          <TextField
            fullWidth
            disabled
            label="Requestor Name"
            value={user?.name || ""}
          />
        </Stack>

        {/* ROW 3 */}
        <InfoTooltip title={descriptionTooltipText} placement="top-start">
          <TextField
            required
            fullWidth
            multiline
            rows={5}
            name="description"
            label="Please provide a detailed description of the issue"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.description}
            helperText={errors.description || " "}
          />
        </InfoTooltip>

        {/* ROW 4 */}
        <Box sx={{ position: "relative" }}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={isSubmitting}
            fullWidth
            sx={{ py: 1.5, fontSize: "1.1rem", letterSpacing: "1.5px" }}
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
