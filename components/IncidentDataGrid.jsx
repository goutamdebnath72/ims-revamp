"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Tooltip } from "@mui/material";
import { DateTime } from "luxon";
import { useLoading } from "@/context/LoadingContext";

const columns = [
  { field: "id", headerName: "Incident No.", flex: 1.5, minWidth: 200 },
  {
    field: "incidentType",
    headerName: "Incident Type",
    flex: 1.5,
    minWidth: 200,
    valueGetter: (_value, row) => row.incidentType?.name || "",
  },
  { field: "location", headerName: "Location", flex: 1.5, minWidth: 200 },
  {
    field: "requestor",
    headerName: "Requestor",
    flex: 1.2,
    minWidth: 180,
    valueGetter: (_value, row) => row.requestor?.name || "",
  },
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
        <Tooltip
          title={status}
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
          <Chip
            label={status}
            color={color}
            size="small"
            variant={variant}
            sx={chipStyles}
          />
        </Tooltip>
      );
    },
  },
  {
    field: "reportedOn",
    headerName: "Reported On",
    width: 180,
    type: "dateTime",
    valueGetter: (value) => (value ? DateTime.fromISO(value).toJSDate() : null),
  },
];

// Note: The 'loading' prop has been removed from the function signature
function IncidentDataGrid({ rows }) {
  const router = useRouter();
  const { isLoading, setIsLoading } = useLoading();

  const handleRowClick = (params) => {
    setIsLoading(true); // This triggers the full-page global overlay
    const incidentId = params.row.id;
    router.push(`/incidents/${incidentId}`);
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows.filter((row) => row && row.id)}
        columns={columns}
        // === THE FIX IS HERE ===
        // The 'loading' prop is removed to disable the local spinner.
        // The opacity now correctly reads from the global isLoading state.
        onRowClick={handleRowClick}
        hideFooter={true}
        stickyHeader
        autoHeight
        sx={{
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
          opacity: isLoading ? 0.5 : 1,
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
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
