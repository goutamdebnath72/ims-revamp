"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const MOCK_USER = {
  name: "GOUTAM DEBNATH",
  initials: "GD",
  ticketNo: "342461",
  departmentCode: 98540,
  departmentName: "C & IT (TECH)",
  designation: "Asst. General Manager",
  sailPNo: "123456",
  mailId: "goutam.debnath@sail.in",
  contactNumber: "42046"
};

export const UserContext = React.createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  const login = (userId, password) => {
    if (userId === "342461" && password === "password") {
      setUser(MOCK_USER);
      router.push('/');
      return { success: true };
    } else {
      return { success: false, message: "Invalid User ID or Password" };
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}