"use client";

import * as React from "react";

export const UserContext = React.createContext(null);

const loggedInUser = {
  name: "GOUTAM DEBNATH",
  initials: "GD",
};

export default function UserProvider({ children }) {
  return (
    <UserContext.Provider value={{ user: loggedInUser }}>
      {children}
    </UserContext.Provider>
  );
}