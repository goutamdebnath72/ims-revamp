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
  useMediaQuery,
} from "@mui/material";
import RaiseIncidentForm from "@/components/RaiseIncidentForm";
import useSound from "@/hooks/useSound";
import { isSystemIncident } from "@/lib/incident-helpers";
import { useLoading } from "@/context/LoadingContext";

export default function RaiseIncidentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showNotification } = React.useContext(NotificationContext);
  const { refetchIncidents } = React.useContext(DashboardFilterContext);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = React.useState(null);
  const { setIsLoading } = useLoading();

  const isSweetSpotScreen = useMediaQuery(
    "(min-height: 600px) and (max-height: 800px)"
  );

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

      const successMessage =
        formData.incidentType?.toLowerCase() === "ess password"
          ? `Incident #${newIncident.id} raised. The user will be notified via email upon password reset.`
          : `Your incident #${newIncident.id} has been submitted.`;

      showNotification(
        { title: "Success!", message: successMessage },
        "success"
      );

      if (isSystemIncident(newIncident) && user?.role === "sys_admin") {
        playNotificationSound();
      }
      if (!isSystemIncident(newIncident) && user?.role === "admin") {
        playNotificationSound();
      }
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
    setIsLoading(true);
    router.push(`/incidents/${submittedIncidentId}`);
  };

  const handleRaiseAnother = () => {
    setSubmittedIncidentId(null);
  };

  return (
    <Stack
      spacing={isSweetSpotScreen ? 3 : 4}
      sx={{ mt: isSweetSpotScreen ? -1.2 : 0 }}
    >
      <Typography
        variant="h4"
        sx={{ fontSize: isSweetSpotScreen ? "1.75rem" : "2.125rem" }}
      >
        Raise a New Incident
      </Typography>
      <Paper
        elevation={2}
        sx={{
          px: 4,
          pt: 4,
          pb: isSweetSpotScreen ? 2.5 : 4,
          position: "relative",
        }}
      >
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
      </Paper>
    </Stack>
  );
}
