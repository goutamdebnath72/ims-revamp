// File: context/IncidentContext.jsx
// UPDATED: Exported the C_AND_IT_DEPT_CODES constant.
"use client";

import * as React from "react";
import { mockIncidents } from "@/lib/mock-data";
import { UserContext } from "./UserContext";
import { NotificationContext } from "./NotificationContext";
import useSound from "@/hooks/useSound";

export const IncidentContext = React.createContext(null);

// This constant is now exported
export const C_AND_IT_DEPT_CODES = [98540, 98541];

export default function IncidentProvider({ children }) {
  const [incidents, setIncidents] = React.useState(mockIncidents);
  const { user } = React.useContext(UserContext);
  const { showNotification } = React.useContext(NotificationContext);
  const playNotificationSound = useSound('/notification.mp3');

  const addIncident = (newIncidentData) => {
    const newId = Math.max(...incidents.map(i => i.id)) + 1;
    const newIncident = {
      ...newIncidentData,
      id: newId,
      reportedOn: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'New',
      requestor: user.name,
      isTypeLocked: false,
      isPriorityLocked: false,
      auditTrail: [] 
    };

    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);

    if (user && C_AND_IT_DEPT_CODES.includes(user.departmentCode)) {
      playNotificationSound();
      showNotification({
        title: `New Incident Raised: #${newIncident.id}`,
        message: `${newIncident.requestor} reported an issue: "${newIncident.jobTitle}"`
      }, 'info');
    }

    return newIncident;
  };

  const updateIncident = (incidentId, updatedData) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => 
        incident.id.toString() === incidentId.toString()
          ? { ...incident, ...updatedData }
          : incident
      )
    );
  };

  const value = { incidents, addIncident, updateIncident };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}