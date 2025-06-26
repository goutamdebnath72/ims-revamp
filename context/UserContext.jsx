// File: context/UserContext.jsx
// NEW: Creates a global context to provide user data throughout the app.
"use client";

import * as React from "react";

// 1. Create the context
export const UserContext = React.createContext(null);

// 2. Define the user data we'll provide
// In a real app, this would come from a login API call.
const loggedInUser = {
  name: "GOUTAM DEBNATH",
  initials: "GD",
  // We can add more user details here later if needed
};

// 3. Create the Provider component
export default function UserProvider({ children }) {
  return (
    <UserContext.Provider value={{ user: loggedInUser }}>
      {children}
    </UserContext.Provider>
  );
}