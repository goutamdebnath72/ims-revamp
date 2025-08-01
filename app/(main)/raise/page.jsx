"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardFilterContext } from '@/context/DashboardFilterContext';
import { NotificationContext } from "@/context/NotificationContext";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import RaiseIncidentForm from "@/components/RaiseIncidentForm";

// --- ADD THESE IMPORTS ---
import useSound from "@/hooks/useSound";
import { isSystemIncident } from "@/lib/incident-helpers";

export default function RaiseIncidentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showNotification } = React.useContext(NotificationContext);
  const { refetchIncidents } = React.useContext(DashboardFilterContext); 

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = React.useState(null);
  
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
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const newIncident = await response.json();
      setSubmittedIncidentId(newIncident.id);

      if (refetchIncidents) {
        refetchIncidents();
      }
      
      showNotification(
        { title: "Success!", message: `Your incident #${newIncident.id} has been submitted.` }, "success"
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
        { title: "Error", message: "Failed to submit incident. Please try again." }, "error"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRaiseAnother = () => {
    setSubmittedIncidentId(null);
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Raise a New Incident</Typography>
      <Paper elevation={2} sx={{ p: 4 }}>
        {submittedIncidentId ? (
          <Stack spacing={3} alignItems="center">
            <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
              <AlertTitle>Submission Successful!</AlertTitle>
              Your incident has been submitted with ID:{" "}
              <strong>{submittedIncidentId}</strong>.
            </Alert>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() =>
                  router.push(`/incidents/${submittedIncidentId}`)
                }
              >
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