// File: components/IncidentDataGrid.jsx
"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { DateTime } from "luxon"; // <-- 1. IMPORT LUXON

const columns = [
  { field: "id", headerName: "Incident No.", flex: 1.5, minWidth: 200 },
  {
    field: "incidentType",
    headerName: "Incident Type",
    flex: 1.5,
    minWidth: 200,
  },
  { field: "location", headerName: "Location", flex: 1.5, minWidth: 200 },
  { field: "requestor", headerName: "Requestor", flex: 1.2, minWidth: 180 },
  {
    field: "priority",
    headerName: "Priority",
    width: 120,
    renderCell: (params) => {
      const priority = params.value;
      let color = "default";
      if (priority === "High") color = "error";
      if (priority === "Medium") color = "warning";
      return <Chip label={priority} color={color} size="small" />;
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => {
      const status = params.value;
      let color = "default";
      if (status === "New") color = "success";
      if (status === "Processed") color = "info";
      if (status === "Resolved") color = "success";
      if (status === "Closed") color = "default";
      const variant = status === "New" ? "outlined" : "filled";
      const chipStyles =
        status === "Resolved" || status === "Processed"
          ? { color: "#fff" }
          : {};
      return (
        <Chip
          label={status}
          color={color}
          size="small"
          variant={variant}
          sx={chipStyles}
        />
      );
    },
  },
  // --- 2. UPDATE THE 'reportedOn' COLUMN DEFINITION ---
  { 
    field: "reportedOn", 
    headerName: "Reported On", 
    width: 180,
    type: 'dateTime', // Tell the grid this is a date/time column
    // Convert the string to a real Date object for correct sorting
    valueGetter: (value) => value ? DateTime.fromFormat(value, "dd MMM yyyy HH:mm").toJSDate() : null,
  },
];

function IncidentDataGrid({ rows, loading }) {
  const router = useRouter();

  const handleRowClick = (params) => {
    const incidentId = params.row.id;
    router.push(`/incidents/${incidentId}`);
  };

  return (
    <Box sx={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        sx={{
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
          // --- 3. SET THE DEFAULT SORT TO THE CORRECT COLUMN ---
          sorting: {
            sortModel: [{ field: "reportedOn", sort: "desc" }],
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default memo(IncidentDataGrid);