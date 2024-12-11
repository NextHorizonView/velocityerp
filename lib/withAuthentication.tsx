import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

interface AuthUser {
  uid: string;
  email: string;
  role: string;  // Ensure role is a string
  domain: string;
}

const withAuthentication = <P extends object>(Component: React.ComponentType<P>) => {
  // Add a displayName to the HOC for debugging purposes
  const WithAuthentication = (props: P) => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        if (user) {
          // Get domain name from the website (e.g., current domain)
          const domain = window.location.hostname; // e.g., "example.com"
          
          // Get the user's role from Firebase ID token, default to 'user' if not found
          const idTokenResult = await user.getIdTokenResult();
          const role = (idTokenResult.claims.role as string) || 'user'; // Ensure role is a string

          // Save user information including role and domain
          const userInfo: AuthUser = { uid: user.uid, email: user.email || '', role, domain };
          localStorage.setItem('authUser', JSON.stringify(userInfo));
          setAuthUser(userInfo);
        } else {
          localStorage.removeItem('authUser');
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
