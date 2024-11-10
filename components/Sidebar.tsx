'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  RiDashboardLine, 
  RiUserLine, 
  RiTeamLine, 
  RiParentLine, 
  RiAccountCircleLine,
  RiFileListLine,
  RiNotificationLine,
  RiArrowLeftLine,
  RiArrowRightDoubleFill
} from 'react-icons/ri';
import castEducation from '@/public/castEducation.jpg'
import { MdClass } from "react-icons/md";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <RiDashboardLine size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <RiUserLine size={20} />, label: 'Students', path: '/students' },
    { icon: <RiTeamLine size={20} />, label: 'Teacher', path: '/teacher' },
    { icon: <RiParentLine size={20} />, label: 'Parents', path: '/parents' },
    { icon: <RiAccountCircleLine size={20} />, label: 'Account', path: '/account' },
    { icon: <MdClass size={20} />, label: 'Class', path: '/Class' },
    { icon: <RiFileListLine size={20} />, label: 'Exam', path: '/exam' },
    { icon: <RiNotificationLine size={20} />, label: 'Notice', path: '/notice' },
  ];

  if (isCollapsed) {
    return (
      <div 
        className="relative min-h-screen bg-white shadow-lg w-8 flex items-center justify-center cursor-pointer"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="flex items-center justify-center text-gray-400">
          <RiArrowRightDoubleFill size={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAF8] shadow-lg w-64 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center p-4">
        <div className="text-red-500 mr-2">
         <Image src={castEducation} alt="Logo" width={50} height={50} />
        </div>
        <span className="text-xl font-semibold">Velocity</span>
      </div>

      {/* Menu Items */}
      <nav className="mt-4">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={index}
              href={item.path}
              className={`
                flex items-center px-4 py-3 cursor-pointer transition-colors duration-200
                ${isActive ? 'bg-gray-100 border-r-4 border-red-500' : 'hover:bg-gray-50'}
              `}
            >
              <div className={`${isActive ? 'text-red-500' : 'text-gray-600'}`}>
                {item.icon}
              </div>
              <span className={`ml-4 ${isActive ? 'text-red-500 font-medium' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Hide Sidebar Text */}
      <div 
        onClick={() => setIsCollapsed(true)}
        className="flex items-center px-4 py-3 mt-4 cursor-pointer hover:bg-gray-50"
      >
        <RiArrowLeftLine size={20} className="text-gray-600" />
        <span className="ml-4 text-gray-700">Hide Sidebar</span>
      </div>
    </div>
  );
};

export default Sidebar;