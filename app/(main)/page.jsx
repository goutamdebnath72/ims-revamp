'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import AdminDashboard from '@/components/AdminDashboard';
import StandardUserDashboard from '@/components/StandardUserDashboard';
import NetworkVendorDashboard from '@/components/NetworkVendorDashboard'; // <-- 1. IMPORT THE NEW DASHBOARD
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Show a loading spinner while the session is being verified
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if the user is not authenticated
  if (status === 'unauthenticated') {
    // This check prevents errors during server-side rendering
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const role = session?.user?.role;

  // --- 2. ADD LOGIC TO RENDER THE CORRECT DASHBOARD BASED ON ROLE ---
  const renderDashboardByRole = () => {
    switch (role) {
      case 'admin':
      case 'sys_admin':
        return <AdminDashboard />;
      case 'network_vendor':
        return <NetworkVendorDashboard />;
      case 'standard':
      default:
        return <StandardUserDashboard />;
    }
  };

  return renderDashboardByRole();
}