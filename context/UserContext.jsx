"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MOCK_USER_DB } from "@/lib/citusers"; // <-- UPDATED import path

export const UserContext = React.createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  const login = (userId, password) => {
    const userData = MOCK_USER_DB[userId];
    
    if (userData && userData.password && password === userData.password) {
      setUser(userData);
      router.push('/');
      return { success: true };
    } 
    
    return { success: false, message: "Invalid User ID or Password" };
  };

  const logout = () => {
    setUser(null);
    router.replace('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}