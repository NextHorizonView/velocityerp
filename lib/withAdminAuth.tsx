// lib/withAdminAuth.tsx
'use client'; // Ensure this is a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState from react-firebase-hooks/auth
import { getIdTokenResult } from 'firebase/auth';
import { getFirebaseServices } from '@/lib/firebaseConfig'; // Import Firebase auth
import { ComponentType } from 'react';

const { auth } = getFirebaseServices();

const withAdminAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAdminAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
      const checkRole = async () => {
        if (user) {
          try {
            const idTokenResult = await getIdTokenResult(user);
            const role = idTokenResult.claims.role;

            if (role !== 'admin' && role !== 'schoolAdmin' && role !== 'superAdmin' && role !== 'student') {
              console.error('User does not have admin role');
              router.push('/login'); // Redirect to login page if not admin
            }
          } catch (error: unknown) {
            const err = error as Error;
            console.error('Error checking role:', err.message);
            router.push('/login'); // Redirect to login page on error
          }
        } else if (!loading) {
          router.push('/login'); // Redirect to login page if no user
        }
      };

      checkRole();
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>; // Show loading state while checking
    }

    return <WrappedComponent {...props} />;
  };

  WithAdminAuth.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAdminAuth;
};

export default withAdminAuth;