import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { auth } = getFirebaseServices();

interface AuthUser {
  uid: string;
  email: string;
  role: string;  // Ensure role is a string

}

const withAuthentication = <P extends object>(Component: React.ComponentType<P>) => {
  // Add a displayName to the HOC for debugging purposes
  const WithAuthentication = (props: P) => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        if (user) {

          
          // Get the user's role from Firebase ID token, default to 'user' if not found
          const idTokenResult = await user.getIdTokenResult();
          const role = (idTokenResult.claims.role as string) || 'user'; // Ensure role is a string

          // Save user information including role
          const userInfo: AuthUser = { uid: user.uid, email: user.email || '', role};
          localStorage.setItem('authId', JSON.stringify(userInfo));
          setAuthUser(userInfo);
        } else {
          localStorage.removeItem('authId');
          setAuthUser(null);
        }
      });
      return () => {
        unsubscribe();
      };
    }, []);

    return <Component {...props} authUser={authUser} />;
  };

  // Set the display name of the component for debugging purposes
  WithAuthentication.displayName = `WithAuthentication(${Component.displayName || Component.name || 'Component'})`;

  return WithAuthentication;
};

export default withAuthentication;
