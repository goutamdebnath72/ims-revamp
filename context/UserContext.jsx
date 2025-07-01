// File: context/UserContext.jsx
// UPDATED: Added new user details for the redesigned incident card.
"use client";

import * as React from "react";

export const UserContext = React.createContext(null);

// Add all new user details here
const loggedInUser = {
  name: "GOUTAM DEBNATH",
  initials: "GD",
  ticketNo: "342461",
  departmentCode: 98540,
  departmentName: "C & IT (TECH)", // Added for display
  designation: "Asst. General Manager",
  sailPNo: "123456",
  mailId: "goutam.debnath@sail.in",
  contactNumber: "42046"
};

export default function UserProvider({ children }) {
  return (
    <UserContext.Provider value={{ user: loggedInUser }}>
      {children}
    </UserContext.Provider>
  );
}