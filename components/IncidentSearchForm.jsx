"use client";

import React, { memo } from "react";
import { useSession } from "next-auth/react";
import { isSystemIncident } from "@/lib/incident-helpers";
import {
  Box,
  Stack,
  TextField,
  Button,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// Arrays for user-facing display (Title Case)
const statuses = ["any", "New", "Processed", "Open", "Resolved", "Closed"];
const priorities = ["any", "Low", "Medium", "High"];
const categories = ["any", "System", "General"];

const AMCSearchForm = ({
  incidentType,
  criteria,
  handleChange,
  handleDateChange,
  isLoading,
  departments,
}) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          sx={{ flex: 1 }}
          label="Incident ID"
          name="incidentId"
          value={criteria.incidentId}
          onChange={handleChange}
          size="small"
        />
        <TextField
          sx={{ flex: 1 }}
          label="Requestor"
          name="requestor"
          value={criteria.requestor}
          onChange={handleChange}
          size="small"
        />
        <TextField
          select
          sx={{ flex: 1 }}
          label="Department"
          name="department"
          value={criteria.department}
          onChange={handleChange}
          size="small"
        >
          <MenuItem value="Any">Any</MenuItem>
          {Array.isArray(departments) &&
            departments.map((dept) => (
              <MenuItem key={dept.code} value={dept.name}>
                {dept.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          sx={{ flex: 1 }}
          label="Incident Type"
          name="incidentType"
          value={incidentType}
          size="small"
          disabled
        />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          select
          sx={{ flex: 1 }}
          label="Status"
          name="status"
          value={criteria.status}
          onChange={handleChange}
          size="small"
        >
          {statuses.map((option) => (
            <MenuItem key={option} value={option.toLowerCase()}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          sx={{ flex: 1 }}
          label="Start Date"
          value={criteria.dateRange.start}
          onChange={(val) => handleDateChange("start", val)}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
        />
        <DatePicker
          sx={{ flex: 1 }}
          label="End Date"
          value={criteria.dateRange.end}
          onChange={(val) => handleDateChange("end", val)}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
        />
        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip
            title="By default, search is limited to the last 30 days."
            placement="top"
            arrow
          >
            <IconButton size="small">
              <InfoOutlinedIcon color="action" fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            size="large"
            disabled={isLoading}
            sx={{ height: "40px" }}
          >
            Search
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

function IncidentSearchForm({
  criteria,
  onCriteriaChange,
  onSearch,
  isLoading,
  incidentTypes = [],
  departments = [],
  isSystemViewLocked = false,
}) {
  const { data: session } = useSession();
  const user = session?.user;

  const filteredIncidentTypes = React.useMemo(() => {
    if (!incidentTypes) return [{ name: "Any" }];

    let types = [...incidentTypes];

    if (user?.role === "admin") {
      types = types.filter(
        (type) => !isSystemIncident({ incidentType: type.name })
      );
    }

    if (isSystemViewLocked) {
      types = types.filter((type) =>
        isSystemIncident({ incidentType: type.name })
      );
    } else if (user?.role === "sys_admin") {
      if (criteria.category?.toLowerCase() === "system") {
        types = types.filter((type) =>
          isSystemIncident({ incidentType: type.name })
        );
      } else if (criteria.category?.toLowerCase() === "general") {
        types = types.filter(
          (type) => !isSystemIncident({ incidentType: type.name })
        );
      }
    }

    return [{ name: "any" }, ...types];
  }, [user, incidentTypes, criteria.category, isSystemViewLocked]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "category" && isSystemViewLocked) {
      return;
    }

    const newCriteria = { ...criteria, [name]: value };

    if (name === "category") {
      newCriteria.incidentType = "any";
    }

    if (name === "incidentType") {
      if (value.toLowerCase() === "any" || !value) {
        if (!isSystemViewLocked) {
          newCriteria.category = "any";
        }
      } else {
        const isSystem = isSystemIncident({ incidentType: value });
        newCriteria.category = isSystem ? "system" : "general";
      }
    }

    onCriteriaChange(newCriteria);
  };

  const handleDateChange = (field, newValue) => {
    onCriteriaChange({
      ...criteria,
      dateRange: { ...criteria.dateRange, [field]: newValue },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalCriteria = { ...criteria };
    if (
      user?.role === "network_amc" ||
      user?.role === "telecom" ||
      user?.role === "etl"
    ) {
      finalCriteria.incidentType = "NETWORK";
    } else if (user?.role === "biometric_amc") {
      finalCriteria.incidentType = "BIOMETRIC";
    }
    onSearch(finalCriteria);
  };

  const renderFormContent = () => {
    const commonProps = { criteria, handleChange, handleDateChange, isLoading };
    if (
      user?.role === "network_amc" ||
      user?.role === "telecom" ||
      user?.role === "etl"
    ) {
      return (
        <AMCSearchForm
          incidentType="NETWORK"
          {...commonProps}
          departments={departments}
        />
      );
    } else if (user?.role === "biometric_amc") {
      return (
        <AMCSearchForm
          incidentType="BIOMETRIC"
          {...commonProps}
          departments={departments}
        />
      );
    } else if (user?.role === "admin" || user?.role === "sys_admin") {
      return (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              sx={{ flex: 1 }}
              label="Incident ID"
              name="incidentId"
              value={criteria.incidentId}
              onChange={handleChange}
              size="small"
            />
            <Tooltip
              title="Search by Name, Ticket No, SAIL P.No, or CUG No."
              placement="top"
              arrow
            >
              <TextField
                sx={{ flex: 1 }}
                label="Requestor"
                name="requestor"
                value={criteria.requestor}
                onChange={handleChange}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InfoOutlinedIcon color="action" sx={{ fontSize: 16 }} />
                  ),
                }}
              />
            </Tooltip>
            <TextField
              select
              sx={{ flex: 1 }}
              label="Department"
              name="department"
              value={criteria.department}
              onChange={handleChange}
              size="small"
            >
              <MenuItem key="any-dept" value="Any">
                Any
              </MenuItem>
              {Array.isArray(departments) &&
                departments.map((dept) => (
                  <MenuItem key={dept.code} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              sx={{ flex: 1 }}
              label="Incident Type"
              name="incidentType"
              value={criteria.incidentType}
              onChange={handleChange}
              size="small"
            >
              {filteredIncidentTypes.map((option) => (
                <MenuItem key={option.name} value={option.name.toLowerCase()}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              sx={{ minWidth: 150 }}
              label="Status"
              name="status"
              value={criteria.status}
              onChange={handleChange}
              size="small"
            >
              {statuses.map((option) => (
                <MenuItem key={option} value={option.toLowerCase()}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              sx={{ minWidth: 150 }}
              label="Priority"
              name="priority"
              value={criteria.priority}
              onChange={handleChange}
              size="small"
            >
              {priorities.map((option) => (
                <MenuItem key={option} value={option.toLowerCase()}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            {user?.role === "sys_admin" && (
              <TextField
                select
                sx={{ minWidth: 150 }}
                label="Category"
                name="category"
                value={criteria.category}
                onChange={handleChange}
                size="small"
                disabled={
                  isSystemViewLocked ||
                  (criteria.incidentType &&
                    criteria.incidentType.toLowerCase() !== "any")
                }
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option.toLowerCase()}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <DatePicker
              label="Start Date"
              value={criteria.dateRange.start}
              onChange={(val) => handleDateChange("start", val)}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={criteria.dateRange.end}
              onChange={(val) => handleDateChange("end", val)}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
            <Tooltip
              title="By default, search is limited to the last 30 days."
              placement="top"
              arrow
            >
              <IconButton size="small">
                <InfoOutlinedIcon color="action" fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                size="large"
                disabled={isLoading}
                sx={{ height: "40px", width: "120px" }}
              >
                Search
              </Button>
            </Box>
          </Stack>
        </Stack>
      );
    } else {
      // Standard User Form
      return (
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            sx={{ flex: "2 1 200px" }}
            label="Incident ID"
            name="incidentId"
            value={criteria.incidentId}
            onChange={handleChange}
            size="small"
          />
          <TextField
            select
            sx={{ flex: "2 1 200px" }}
            label="Incident Type"
            name="incidentType"
            value={criteria.incidentType}
            onChange={handleChange}
            size="small"
          >
            {filteredIncidentTypes.map((option) => (
              <MenuItem key={option.name} value={option.name.toLowerCase()}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            sx={{ flex: "1 1 150px", minWidth: 120 }}
            label="Status"
            name="status"
            value={criteria.status}
            onChange={handleChange}
            size="small"
          >
            {statuses.map((option) => (
              <MenuItem key={option} value={option.toLowerCase()}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            sx={{ flex: "1 1 150px", minWidth: 120 }}
            label="Priority"
            name="priority"
            value={criteria.priority}
            onChange={handleChange}
            size="small"
          >
            {priorities.map((option) => (
              <MenuItem key={option} value={option.toLowerCase()}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            size="large"
            disabled={isLoading}
            sx={{ height: "40px" }}
          >
            Search
          </Button>
        </Stack>
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {renderFormContent()}
    </Box>
  );
}

export default memo(IncidentSearchForm);
