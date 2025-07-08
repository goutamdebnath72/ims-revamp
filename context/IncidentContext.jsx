// File: context/IncidentContext.jsx
"use client";

import * as React from "react";
import { mockIncidents } from "@/lib/mock-data";
import { isSystemIncident } from "@/lib/incident-helpers";
import { UserContext } from "./UserContext";
import { NotificationContext } from "./NotificationContext";
import useSound from "@/hooks/useSound";

export const IncidentContext = React.createContext(null);

export default function IncidentProvider({ children }) {
  const [incidents, setIncidents] = React.useState(mockIncidents);
  const { user } = React.useContext(UserContext);
  const { showNotification } = React.useContext(NotificationContext);
  const playNotificationSound = useSound('/notification.mp3');

  const addIncident = (newIncidentData) => {
    if (!user) return; 

    const newId = Math.max(...incidents.map(i => i.id)) + 1;
    
    const newIncident = {
      ...newIncidentData,
      id: newId,
      status: 'New',
      reportedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' ') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      requestor: user.name,
      ticketNo: user.ticketNo,
      department: user.department,
      contactNumber: user.contactNumber,
      sailPNo: user.sailPNo,
      emailSail: user.emailSail,
      emailNic: user.emailNic,
      ipAddress: '10.141.27.53', 
      jobFrom: user.name, 
      isTypeLocked: false,
      isPriorityLocked: false,
      auditTrail: [] 
    };

    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);

    if (isSystemIncident(newIncident) && user?.role === 'sys_admin') {
      playNotificationSound();
      showNotification({
        title: `New System Incident Raised: #${newIncident.id}`,
        message: `${newIncident.requestor} reported a system issue: "${newIncident.incidentType}"`
      }, 'info');
    }

    if (!isSystemIncident(newIncident) && user?.role === 'admin') {
      playNotificationSound();
      showNotification({
        title: `New General Incident Raised: #${newIncident.id}`,
        message: `${newIncident.requestor} reported a new issue: "${newIncident.incidentType}"`
      }, 'success');
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