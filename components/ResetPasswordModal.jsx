"use client";

import * as React from "react";
import useSWR from "swr";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Tooltip,
  Typography,
  Paper,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ResetPasswordModal({
  open,
  onClose,
  onSuccess,
  incident,
}) {
  const [adminPassword, setAdminPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [ticketNo, setTicketNo] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const isTicketNoPreFilled = !!incident?.affectedTicketNo;

  React.useEffect(() => {
    if (isTicketNoPreFilled) {
      setTicketNo(incident.affectedTicketNo);
    } else {
      setTicketNo("");
    }
  }, [incident, isTicketNoPreFilled]);

  const { data: affectedUser, error: userError } = useSWR(
    ticketNo && ticketNo.length === 6 ? `/api/users/${ticketNo}` : null,
    fetcher
  );

  const handleClose = () => {
    if (isLoading) return;
    setAdminPassword("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/change-ess-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword: adminPassword,
          targetTicketNo: ticketNo.trim(),
          incidentId: incident.id,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>ESS Password Reset Authorization</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText sx={{ mb: 2 }}>
          To perform this sensitive action, please enter your password for
          verification.
        </DialogContentText>

        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            required
            autoFocus={!isTicketNoPreFilled}
            id="target-ticket-no"
            label="Affected Employee's Ticket No"
            type="text"
            fullWidth
            variant="outlined"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value.trim())}
            disabled={isLoading || isTicketNoPreFilled}
            slotProps={{ input: { maxLength: 6 } }}
          />
          {/* This is the new block that displays the user's details */}
          {affectedUser && (
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "action.hover" }}>
              <Table
                size="small"
                sx={{
                  "& .MuiTableCell-root": {
                    border: "1px solid rgba(224, 224, 224, 1)",
                  },
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      ESS User ID
                    </TableCell>
                    <TableCell>{affectedUser.ticketNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell>
                      <Tooltip title={affectedUser.name} placement="top">
                        <Typography noWrap sx={{ maxWidth: "170px" }}>
                          {" "}
                          {/* We can adjust the maxWidth */}
                          {affectedUser.name}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Designation
                    </TableCell>
                    <TableCell>{affectedUser.designation || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Dept. Name
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={affectedUser.department?.name || ""}
                        placement="top"
                      >
                        <Typography noWrap sx={{ maxWidth: "170px" }}>
                          {" "}
                          {/* We can adjust the maxWidth */}
                          {affectedUser.department?.name}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Mobile No.
                    </TableCell>
                    <TableCell>{affectedUser.contactNo || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Last Security Update
                    </TableCell>
                    <TableCell>
                      {affectedUser.passwordLastChanged
                        ? new Date(
                            affectedUser.passwordLastChanged
                          ).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          )}
          {userError && ticketNo.length === 6 && (
            <Alert severity="warning">
              User with that Ticket No. not found.
            </Alert>
          )}
          <FormControl required fullWidth variant="outlined">
            <InputLabel htmlFor="admin-password">
              Enter Your Password to Confirm
            </InputLabel>
            <OutlinedInput
              id="admin-password"
              autoFocus={isTicketNoPreFilled}
              type={showPassword ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              disabled={isLoading}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Enter Your Password to Confirm"
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: "0 24px 20px 24px" }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !adminPassword ||
              !ticketNo ||
              ticketNo.length !== 6 ||
              isLoading ||
              !affectedUser
            }
          >
            Reset Password
          </Button>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
