"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

// --- UPDATED: Added new email fields to each mock user ---
const MOCK_USER_DB = {
  "342461": { name: "GOUTAM DEBNATH", initials: "GD", ticketNo: "342461", departmentCode: 98540, emailSail: 'goutam.d@saildsp.co.in', emailNic: 'goutam@sail.in' },
  "111111": { name: "ANAMIKA SHARMA", initials: "AS", ticketNo: "111111", departmentCode: 88123, emailSail: 'anamika.s@saildsp.co.in', emailNic: 'anamika.sharma@sail.in' },
  "222222": { name: "RAKESH OJHA", initials: "RO", ticketNo: "222222", departmentCode: 98500, emailSail: 'rakesh.ojha@saildsp.co.in', emailNic: 'rakesh.o@sail.in' },
};

const EXECUTIVE_DEPT = 98500;
const ADMIN_DEPT = 98540;

export const UserContext = React.createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  const login = (userId, password) => {
    const userData = MOCK_USER_DB[userId];

    if (userData && password === "password") {
      let role = 'user';
      if (userData.departmentCode === EXECUTIVE_DEPT) role = 'sys_admin';
      else if (userData.departmentCode === ADMIN_DEPT) role = 'admin';

      setUser({ ...userData, role });
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