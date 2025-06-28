"use client";

import * as React from "react";

export const UserContext = React.createContext(null);

// Add ticketNo and departmentCode for our new logic
const loggedInUser = {
  name: "GOUTAM DEBNATH",
  initials: "GD",
  ticketNo: "342461", // Non-executive (doesn't start with '4')
  departmentCode: 98540, // C & IT (TECH) department code
};

export default function UserProvider({ children }) {
  return (
    <UserContext.Provider value={{ user: loggedInUser }}>
      {children}
    </UserContext.Provider>
  );
}