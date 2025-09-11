"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function SapPasswordResetModal({
  open,
  onClose,
  onSuccess,
  incident,
}) {
  const [adminPassword, setAdminPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const requestor = incident?.requestor;

  const handleClose = () => {
    if (isLoading) return;
    setAdminPassword("");
    setError("");
    setShowPassword(false);
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/change-sap-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword: adminPassword,
          targetSailPNo: requestor?.sailPNo,
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

  // Reset state when the dialog is opened
  React.useEffect(() => {
    if (open) {
      setAdminPassword("");
      setError("");
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>SAP Password Reset Authorization</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText sx={{ mb: 2 }}>
          To perform this action, please enter your password for verification.
          The reset will be performed for the official incident requestor.
        </DialogContentText>

        <Stack spacing={2} sx={{ pt: 1 }}>
          {requestor && (
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "action.hover" }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell>{requestor.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>SAIL P/No</TableCell>
                    <TableCell>{requestor.sailPNo}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          )}

          <FormControl required fullWidth variant="outlined">
            <InputLabel htmlFor="admin-password-sap">
              Enter Your Password to Confirm
            </InputLabel>
            <OutlinedInput
              id="admin-password-sap"
              autoFocus
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
            disabled={!adminPassword || isLoading || !requestor?.sailPNo}
          >
            Reset SAP Password
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
