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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Auto-login if credentials exist in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    const storedRole = localStorage.getItem('userRole');
    const storedDomain = localStorage.getItem('domain');

    if (storedEmail && storedPassword && storedRole && storedDomain) {
      handleAutoLogin(storedEmail, storedPassword, storedRole, storedDomain);
    }
  }, []);

  const handleAutoLogin = async (email: string, password: string, role: string, domain: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(`Auto-login successful for role: ${role} on domain: ${domain}`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Auto-login failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      if (role === 'admin' || role === 'schoolAdmin' || role === 'superAdmin' || role === 'student') {
        console.log('User logged in successfully');

        if (rememberMe) {
          // Save credentials in localStorage only if "Remember Me" is checked
          localStorage.setItem('email', username);
          localStorage.setItem('password', password);
          localStorage.setItem('userRole', role);
          localStorage.setItem('domain', window.location.hostname);
        }

        router.push('/dashboard');
      } else {
        console.error('User does not have admin role');
        alert('You do not have admin privileges');
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Error logging in:', authError.message);
      alert('Error logging in: ' + authError.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      if (role === 'admin' || role === 'schoolAdmin' || role === 'superAdmin' || role === 'student') {
        console.log('User signed in with Google');
        localStorage.setItem('userId', userCredential.user.uid);
        localStorage.setItem('userRole', role);
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
              <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors duration-200 text-base font-semibold">
                Login
              </Button>

              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-3 text-base"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-gray-900">Sign in with Google</span>
              </Button>
            </div>
          </form>

          {/* App Store Buttons Styled as in Image */}
          <div className="flex space-x-4 mt-8">
            <a
              href="#"
              className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
              style={{ width: '140px', height: '60px' }}
            >
              <FaGooglePlay className="mr-2 text-xl" />
              <span className="text-sm">GET IT ON<br />Google Play</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
              style={{ width: '140px', height: '60px' }}
            >
              <AiOutlineApple className='mr-2 text-5xl' />
              <span className="text-sm">Download on the<br />App Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
