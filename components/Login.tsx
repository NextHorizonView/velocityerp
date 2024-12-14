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
import { auth } from '@/lib/firebaseConfig';
import withAuthentication from '@/lib/withAuthentication';

interface LoginProps {
  authUser: { uid: string; email: string; role: string; domain: string } | null;
}

const Login: React.FC<LoginProps> = ({ authUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  

  // Auto-login if credentials exist in localStorage
  useEffect(() => {
    console.log("AuthUser:", authUser);
    if (
      authUser &&
      authUser.uid &&
      authUser.email &&
      authUser.role &&
      authUser.domain 
    ) {
      router.push('/dashboard');
    }
  }, [authUser, router]);

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
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role;
      const domain = window.location.hostname;
  
      if (role === 'admin' || role === 'schoolAdmin' || role === 'superAdmin' || role === 'student') {
        console.log('User logged in successfully');
        const userId = userCredential.user.uid;
        localStorage.setItem('userId', userId);
  
        if (rememberMe) {
          localStorage.setItem('email', username);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userDomain', domain);
          localStorage.removeItem('userExpiry'); // Ensure expiry is cleared if Remember Me is active
        } else {
          const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 60 seconds for testing
          localStorage.setItem('userExpiry', expiryTime.toString());
        }
  
        router.push('/dashboard');
      } else {
        console.error('User does not have the required role');
        alert('You do not have admin privileges.');
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Error logging in:', authError.message);
      alert('Error logging in: ' + authError.message);
    }
  };
  
  // Auto-clear expired session on app load or refresh
  useEffect(() => {
    const storedExpiryTime = localStorage.getItem('userExpiry');
    if (storedExpiryTime && Date.now() > parseInt(storedExpiryTime)) {
      localStorage.removeItem('userId');
      localStorage.removeItem('authId');
      localStorage.removeItem('userExpiry');
      console.log('userId cleared after expiry time');
    }
  }, []);
  

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role;
            // Get the domain (website name) dynamically
      const domain = window.location.hostname; // e.g., "example.com"

      if (role === 'admin' || role === 'schoolAdmin' || role === 'superAdmin' || role === 'student') {
        console.log('User signed in with Google');
        localStorage.setItem('userId', userCredential.user.uid);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userDomain', domain); // Store domain
        router.push('/dashboard');
      } else {
        console.error('User does not have admin role');
        alert('You do not have admin privileges');
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Error signing in with Google:', authError.message);
      alert('Error signing in with Google: ' + authError.message);
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
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
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
              <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white">
                Sign In
              </Button>
              <Button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full bg-white border border-gray-300 text-gray-800 flex items-center justify-center space-x-2"
              >
                <FcGoogle />
                <span>Sign in with Google</span>
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
