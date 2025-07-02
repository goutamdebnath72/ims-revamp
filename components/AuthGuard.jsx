'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserContext } from '@/context/UserContext';

export default function AuthGuard({ children }) {
    const { user } = React.useContext(UserContext);
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        // If there is no user data and the user is not on the login page, redirect them.
        if (!user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, pathname, router]);
    
    // If there is a user, or if we are on the login page, show the content.
    if (user || pathname === '/login') {
        return <>{children}</>;
    }

    // Otherwise, show nothing while the redirect happens.
    return null;
}