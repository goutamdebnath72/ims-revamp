'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;

  React.useEffect(() => {
  // If authenticated and on the login page, redirect away
  if (status === 'authenticated' && pathname === '/login') {
    router.replace('/');
  }
}, [status, pathname, router]);

  React.useEffect(() => {
    // If not authenticated and not already on /login, redirect
    if (status === 'unauthenticated' && pathname !== '/login') {
      router.push('/login');
    }
  }, [status, pathname, router]);

  // Allow rendering if:
  // - session is still loading
  // - user is logged in
  // - or we're on the login page
  if (status === 'loading' || user || pathname === '/login') {
    return <>{children}</>;
  }

  // Otherwise (unauthenticated and not on /login), block render
  return null;
}