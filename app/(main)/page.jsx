"use client";

import * as React from 'react';
import { UserContext } from '@/context/UserContext';
import AdminDashboard from '@/components/AdminDashboard';
import StandardUserDashboard from '@/components/StandardUserDashboard';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
    const { user } = React.useContext(UserContext);

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return user.role === 'admin' ? <AdminDashboard /> : <StandardUserDashboard />;
}