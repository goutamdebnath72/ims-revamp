"use client";

import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from '@mui/material/AlertTitle';

export const NotificationContext = React.createContext(null);

export default function NotificationProvider({ children }) {
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
    title: "", 
    severity: "success",
  });

  // This function accepts an object with a title and message
  const showNotification = ({ title, message }, severity = "success") => {
    setNotification({ open: true, title, message, severity });
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
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}