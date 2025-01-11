'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getIdTokenResult } from 'firebase/auth';
import { getFirebaseServices } from '@/lib/firebaseConfig';
<<<<<<< HEAD

const { auth } = getFirebaseServices();
=======
>>>>>>> b36b764e60d1702314fdeb821a075ae88b2dd979
import { ComponentType } from 'react';

const { auth } = getFirebaseServices();

const withAdminAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAdminAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
      const checkRole = async () => {
        if (loading) return;

        // If user is logged in, check role
        if (user) {
          try {
            const idTokenResult = await getIdTokenResult(user);
            const role = idTokenResult.claims.role;

            if (role !== 'admin' && role !== 'schoolAdmin' && role !== 'superAdmin' && role !== 'student') {
<<<<<<< HEAD
              console.error('User does not have admin role');
              router.push('/'); // Redirect to login page if not admin
=======
              console.error('User does not have the required role');
              const savedDomain = localStorage.getItem('savedDomain');
              if (savedDomain) {
                router.push(`${savedDomain}`);
              } else {
                router.push('/');
              }
            } else {
              setIsCheckingRole(false); // Valid role
>>>>>>> b36b764e60d1702314fdeb821a075ae88b2dd979
            }
          } catch (error: unknown) {
            const err = error as Error;
            console.error('Error checking role:', err.message);
<<<<<<< HEAD
            router.push('/'); // Redirect to login page on error
          }
        } else if (!loading) {
          router.push('/'); // Redirect to login page if no user
=======
            const savedDomain = localStorage.getItem('savedDomain');
            if (savedDomain) {
              router.push(`${savedDomain}`);
            } else {
              router.push('/');
            }
          }
        } else {
          const savedDomain = localStorage.getItem('savedDomain');
          if (savedDomain) {
            router.push(`${savedDomain}`);
          } else {
            router.push('/');
          }
          console.log('No user');
>>>>>>> b36b764e60d1702314fdeb821a075ae88b2dd979
        }
      };

      checkRole();
    }, [user, loading, router]);

    if (loading || isCheckingRole) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  WithAdminAuth.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAdminAuth;
};

export default withAdminAuth;
