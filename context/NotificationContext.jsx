// File: context/NotificationContext.jsx
// NEW: A global provider for showing Snackbar notifications.
"use client";

import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// 1. Create the context
export const NotificationContext = React.createContext(null);

// 2. Create the Provider component
export default function NotificationProvider({ children }) {
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
    severity: "success", // can be 'error', 'warning', 'info', or 'success'
  });

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000} // Hide after 4 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}