import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LoginImage from '@/public/LoginImage.jpg';
import CastEducation from '@/public/castEducation.jpg';
import { FcGoogle } from 'react-icons/fc'; 
import { FaGooglePlay} from 'react-icons/fa'; 
import { AiOutlineApple } from "react-icons/ai";

const Page = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Section with Illustration */}
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

      {/* Right Section with Login Form */}
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
          <form className="mt-8 space-y-6">
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
              <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors duration-200 text-base font-semibold">
                Login
              </Button>

              <Button
                variant="outline"
                className="w-full py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-3 text-base"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-gray-900">Sign in with Google</span>
              </Button>
            </div>

            {/* Terms and Policy Checkbox */}

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

export default Page;
