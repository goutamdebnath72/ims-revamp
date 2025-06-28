"use client";

import * as React from "react";
import { mockIncidents } from "@/lib/mock-data";
import { UserContext } from "./UserContext";
import { NotificationContext } from "./NotificationContext";
import useSound from "@/hooks/useSound"; // <-- Import our new sound hook

export const IncidentContext = React.createContext(null);

const C_AND_IT_DEPT_CODES = [98540, 98541]; // C & IT department codes

export default function IncidentProvider({ children }) {
  const [incidents, setIncidents] = React.useState(mockIncidents);
  const { user } = React.useContext(UserContext);
  const { showNotification } = React.useContext(NotificationContext);
  const playNotificationSound = useSound('/notification.mp3'); // <-- Initialize the sound

  const addIncident = (newIncidentData) => {
    const newId = Math.max(...incidents.map(i => i.id)) + 1;
    const newIncident = {
      ...newIncidentData,
      id: newId,
      reportedOn: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'New',
      requestor: user.name,
    };

    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);

    // --- Conditional Notification Logic ---
    // Check if the logged-in user is part of the C & IT department
    if (user && C_AND_IT_DEPT_CODES.includes(user.departmentCode)) {
      // Play the sound
      playNotificationSound();
      // Show the rich visual notification
      showNotification({
        title: `New Incident Raised: #${newIncident.id}`,
        message: `${newIncident.requestor} reported an issue: "${newIncident.jobTitle}"`
      }, 'info');
    }
    // --- End of Logic ---

    return newIncident;
  };

  const value = { incidents, addIncident };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}