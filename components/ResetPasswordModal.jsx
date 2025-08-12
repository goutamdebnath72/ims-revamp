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
  Typography,
  Paper,
  DialogContentText,
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
            <Paper
              variant="outlined"
              sx={{ p: 1.5, bgcolor: "action.hover", lineHeight: 1.9 }}
            >
              <Typography variant="body2">
                <strong>ESS User Name:</strong> {affectedUser.ticketNo}
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {affectedUser.name}
              </Typography>
              <Typography variant="body2">
                <strong>Designation:</strong>{" "}
                {affectedUser.designation || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Dept. Name:</strong> {affectedUser.department?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Mobile No.:</strong> {affectedUser.contactNo || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Pass Lst Change:</strong>{" "}
                {affectedUser.passwordLastChanged
                  ? new Date(affectedUser.passwordLastChanged).toLocaleString(
                      "en-IN",
                      { dateStyle: "medium", timeStyle: "short" }
                    )
                  : "N/A"}
              </Typography>
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
