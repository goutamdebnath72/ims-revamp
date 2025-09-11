"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardFilterContext } from "@/context/DashboardFilterContext";
import { NotificationContext } from "@/context/NotificationContext";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import RaiseIncidentForm from "@/components/RaiseIncidentForm";
import useSound from "@/hooks/useSound";
import { isSystemIncident } from "@/lib/incident-helpers";

export default function RaiseIncidentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showNotification } = React.useContext(NotificationContext);
  const { refetchIncidents } = React.useContext(DashboardFilterContext);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = React.useState(null);
  const [isNavigating, setIsNavigating] = React.useState(false);

  // --- ADD THIS HOOK TO PREPARE THE SOUND ---
  const playNotificationSound = useSound("/notification.mp3");

  const user = session?.user;

  if (status === "loading") return null;
  if (!user) {
    return (
      <Typography variant="h6" sx={{ m: 4 }}>
        Unauthorized
      </Typography>
    );
  }

  const handleFormSubmit = async (formData) => {
    //console.log("1. Data leaving the form:", formData);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const newIncident = await response.json();
      setSubmittedIncidentId(newIncident.id);

      if (refetchIncidents) {
        refetchIncidents();
      }

      // Determine the success message based on the incident type
      const successMessage =
        formData.incidentType?.toLowerCase() === "ess password"
          ? `Incident #${newIncident.id} raised. The user will be notified via email upon password reset.`
          : `Your incident #${newIncident.id} has been submitted.`;

      showNotification(
        { title: "Success!", message: successMessage },
        "success"
      );

      // --- ADD THIS LOGIC TO PLAY THE SOUND FOR ADMINS/SYS_ADMINS ---
      if (isSystemIncident(newIncident) && user?.role === "sys_admin") {
        playNotificationSound();
      }
      if (!isSystemIncident(newIncident) && user?.role === "admin") {
        playNotificationSound();
      }
      // --- END OF NEW LOGIC ---
    } catch (error) {
      showNotification(
        {
          title: "Error",
          message: "Failed to submit incident. Please try again.",
        },
        "error"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = () => {
    setIsNavigating(true);
    router.push(`/incidents/${submittedIncidentId}`);
  };

  const handleRaiseAnother = () => {
    setIsNavigating(true);
    // We use a small timeout to allow the spinner to appear for a smooth transition
    setTimeout(() => {
      setSubmittedIncidentId(null);
      setIsNavigating(false); // Reset for next submission
    }, 300);
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Raise a New Incident</Typography>
      <Paper elevation={2} sx={{ p: 4, position: "relative" }}>
        {submittedIncidentId ? (
          <Stack spacing={3} alignItems="center">
            <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
              <AlertTitle>Submission Successful!</AlertTitle>
              Your incident has been submitted with ID:{" "}
              <strong>{submittedIncidentId}</strong>.
            </Alert>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleViewDetails}>
                View Incident Details
              </Button>
              <Button variant="outlined" onClick={handleRaiseAnother}>
                Raise Another Incident
              </Button>
            </Stack>
          </Stack>
        ) : (
          <RaiseIncidentForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {isNavigating && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "inherit", // Match the Paper's border radius
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
