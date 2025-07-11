'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import AdminDashboard from '@/components/AdminDashboard';
import StandardUserDashboard from '@/components/StandardUserDashboard';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  console.log("Session:", session);
  console.log("Status:", status);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const role = session?.user?.role;
  console.log("Session user:", session?.user);
console.log("Session role:", session?.user?.role);


  return role === 'admin' || role === 'sys_admin' ? <AdminDashboard /> : <StandardUserDashboard />;
}