// /components/Login.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import LoginImage from '@/public/LoginImage.jpg';
import CastEducation from '@/public/castEducation.jpg';
import { FcGoogle } from 'react-icons/fc';
import { FaGooglePlay } from 'react-icons/fa';
import { AiOutlineApple } from "react-icons/ai";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, AuthError } from 'firebase/auth';
import { getFirebaseServices } from '@/lib/firebaseConfig';
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore';
const { auth, db } = getFirebaseServices();
import withAuthentication from '@/lib/withAuthentication';
import { Eye, EyeOff } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFirebaseMessaging } from "@/hooks/useFirebaseMessaging";

interface LoginProps {
  authUser: { uid: string; email: string; role: string; domain: string } | null;
}

const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false);

  const { fcmToken } = useFirebaseMessaging();

  // Auto-login if credentials exist in localStorage
  // useEffect(() => {
  //   console.log("AuthUser:", authUser);
  //   if (authUser && authUser.uid && authUser.email && authUser.role) {
  //     router.push('/dashboard');
  //   }
  // }, [authUser, router]);

  useEffect(() => {
    // Check and clear expired user data on page load
    const storedExpiryTime = localStorage.getItem('userExpiry');
    if (storedExpiryTime && Date.now() > parseInt(storedExpiryTime)) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userExpiry');
      localStorage.removeItem('authId');
      console.log('userId cleared from localStorage after expiry time.');
    }
  }, []);

  

  // Retry fetching FCM token if null
  const fetchFCMToken = async (retries = 3): Promise<string | null> => {
    if (fcmToken) {
      return fcmToken; // Return the token if it's available
    }

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // If it's not available, request a new token
        const token = fcmToken;  // Use fcmToken directly

        if (token) return token;
      } catch (error) {
        console.error(`FCM token fetch failed (attempt ${attempt + 1}):`, error);
      }
      await new Promise((res) => setTimeout(res, 2000)); // Wait before retrying
    }
    console.error("Failed to fetch FCM token after multiple attempts.");
    return null;
  };
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role;
      console.log('Role:', role);
      const domain = window.location.href;
      sessionStorage.setItem("savedDomain", domain);

      if (role === 'admin' || role === 'teacher' || role === 'superAdmin' || role === 'student') {
        console.log('User logged in successfully');
        const userId = userCredential.user.uid;
        
        // Fetch FCM Token
        const fcmToken = await fetchFCMToken();
        if (!fcmToken) throw new Error("Unable to retrieve FCM token.");


        // Add user to Firestore LoggedInUsers collection
        const loggedInDoc = doc(db, 'LoggedInUsers', userId);
        await setDoc(loggedInDoc, {
          LoggedInId: userId,
          LoggedInUserId: userId,
          LoggedInFCMToken: fcmToken,
          LoggedInUserType: role,
          LoggedInCreatedAt: serverTimestamp(),
          IsLoggedIn: true,
        });

        // Fetch role permissions from Firestore
        const roleQuery = query(collection(db, "Role"), where("RoleName", "==", role));
        const querySnapshot = await getDocs(roleQuery);

        if (!querySnapshot.empty) {
          const roleDoc = querySnapshot.docs[0];
          const rolePermissions = roleDoc.data().RolePermissions || {};
          localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions)); // Store permissions
        }

        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
        document.cookie = `userRole=${role}; path=/; SameSite=Strict; Secure`;

        if (rememberMe) {
          localStorage.setItem('email', username);
          localStorage.removeItem('userExpiry'); // Ensure expiry is cleared if Remember Me is active
        } else {
          const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiry
          localStorage.setItem('userExpiry', expiryTime.toString());
        }
        if (role === 'teacher') {
          console.log("Redirecting to /teacherdashboard"); // Debug log
        router.push('/teacher/teacherdashboard');
        } else {
          console.log("Redirecting to /dashboard"); // Debug log
        router.push('/dashboard');
        }
      } else {
        console.error('User does not have the required role');
        alert('You do not have admin privileges.');
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Error logging in:', authError.message);
      alert('Error logging in: ' + authError.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); // Start loading
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role;
      const domain = window.location.href;
      localStorage.setItem('savedDomain', domain);
      sessionStorage.setItem("savedDomain", domain);

      if (role === 'admin' || role === 'teacher' || role === 'superAdmin' || role === 'student') {
        console.log('User signed in with Google');
        const userId = userCredential.user.uid;

        // Fetch role permissions from Firestore
        const roleQuery = query(collection(db, "Role"), where("RoleName", "==", role));
        const querySnapshot = await getDocs(roleQuery);

        if (!querySnapshot.empty) {
          const roleDoc = querySnapshot.docs[0];
          const rolePermissions = roleDoc.data().RolePermissions || {};
          localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions)); // Store permissions
        }

        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
        document.cookie = `userRole=${role}; path=/; SameSite=Strict; Secure`;
        router.push('/dashboard');
      } else {
        console.error('User does not have admin role');
        alert('You do not have admin privileges');
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Error signing in with Google:', authError.message);
      alert('Error signing in with Google: ' + authError.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/3 relative">
        <div className="absolute inset-0">
          <Image
            src={LoginImage}
            alt="Education Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="max-w-md space-y-8">
          {/* Logo */}
          <div>
            <Image
              src={CastEducation}
              alt="CastEducation Logo"
              width={100}
              height={100}
              className="w-24 h-24 object-contain"
            />
          </div>
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Login account</h2>
            <p className="mt-2 text-sm text-gray-600">for Admin, Teacher or Student</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-600">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                I agree to the terms and privacy policy
              </label>
            </div>

            {/* Login and Google Sign-In Buttons */}
            <div className="space-y-4">
              <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
              <Button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full bg-white border border-gray-300 text-gray-800 flex items-center justify-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <>
                    <FcGoogle />
                    <span>Sign in with Google</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Download Links */}
          <div className="flex justify-between mt-8">
            <Button type="button" className="flex items-center space-x-2 text-sm text-gray-500">
              <FaGooglePlay />
              <span>Google Play</span>
            </Button>
            <Button type="button" className="flex items-center space-x-2 text-sm text-gray-500">
              <AiOutlineApple />
              <span>App Store</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthentication(Login);