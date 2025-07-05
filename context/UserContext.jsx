"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

// --- MOCK USER DATABASE ---
// This simulates fetching user data. The role is not stored here.
const MOCK_USER_DB = {
  "342461": {
    name: "GOUTAM DEBNATH",
    initials: "GD",
    ticketNo: "342461",
    departmentCode: 98540, // C & IT Department
    departmentName: "C & IT (TECH)",
  },
  "111111": {
    name: "ANAMIKA SHARMA",
    initials: "AS",
    ticketNo: "111111",
    departmentCode: 88123, // A different department
    departmentName: "OPERATIONS",
  },
};

const C_AND_IT_DEPTS = [98500, 98540];

export const UserContext = React.createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  const login = (userId, password) => {
    const userData = MOCK_USER_DB[userId];

    // Check if user exists and password is correct
    if (userData && password === "password") {
      // Determine role based on department code
      const role = C_AND_IT_DEPTS.includes(userData.departmentCode) 
        ? "admin" 
        : "user";

      // Set the user state with the dynamically assigned role
      setUser({ ...userData, role });
      
      router.push('/');
      return { success: true };
    } 
    
    return { success: false, message: "Invalid User ID or Password" };
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