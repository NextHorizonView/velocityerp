"use client";
import React, { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiUserLine,
  RiTeamLine,
  RiParentLine,
  RiAccountCircleLine,
  RiFileListLine,
  RiNotificationLine,
  RiArrowLeftLine,
  RiLoginCircleLine,
} from "react-icons/ri";
import { MdClass } from "react-icons/md";
import Image from "next/image";
import castEducation from "@/public/castEducation.jpg";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { RiUserAddLine } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <RiLoginCircleLine size={20} />, label: "login", path: "/login" },
    {
      icon: <RiDashboardLine size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <RiUserLine size={20} />, label: "Students", path: "/students" },
    { icon: <RiTeamLine size={20} />, label: "Teacher", path: "/teacher" },
    { icon: <RiParentLine size={20} />, label: "Parents", path: "/parents" },
    {
      icon: <RiAccountCircleLine size={20} />,
      label: "Account",
      path: "/account",
    },
    { icon: <MdClass size={20} />, label: "Class", path: "/class" },
    { icon: <RiFileListLine size={20} />, label: "Exam", path: "/exam" },

    {
      icon: <RiNotificationLine size={20} />,
      label: "Notice",
      path: "/notice",
    },
  ];

  if (isCollapsed) {
    return (
      <div
        className="fixed left-0 top-0 bottom-0 w-8 bg-white shadow-lg flex items-center justify-center cursor-pointer z-20"
        onClick={() => setIsCollapsed(false)}
      >
        <RiArrowRightDoubleFill size={20} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#FAFAF8] shadow-lg transition-all duration-300 z-20">
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
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200
                ${
                  isActive
                    ? "bg-gray-100 border-r-4 border-red-500"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <div className={`${isActive ? "text-red-500" : "text-gray-600"}`}>
                {item.icon}
              </div>
              <span
                className={`ml-4 ${
                  isActive ? "text-red-500 font-medium" : "text-gray-700"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <Menubar className="border-none shadow-none w-full">
          <MenubarMenu>
            <MenubarTrigger
              className={`flex items-center w-full cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                pathname === "/enquiry/admission" ||
                pathname === "/enquiry/business"
                  ? "bg-gray-100 border-r-4 border-red-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <AiOutlineQuestionCircle size={24} className=" text-gray-700" />
              <span className="ml-4 text-gray-700">Enquiry</span>
            </MenubarTrigger>
            <MenubarContent
              align="start"
              alignOffset={-8}
              className="w-[calc(100%-1rem)] ml-2"
            >
              <MenubarItem>
                <Link
                  href="/enquiry/admission"
                  className="flex items-center w-full py-2 px-4 text-sm"
                >
                  <RiUserAddLine size={24} />
                  <span className="ml-4 text-gray-700">Admission</span>
                </Link>
              </MenubarItem>
              <MenubarItem>
                <Link
                  href="/enquiry/business"
                  className="flex items-center w-full py-2 px-4 text-sm text-gray-400"
                >
                  <FaUserGraduate size={24} />
                  <span className="ml-4 text-gray-700">Business</span>
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>

      {/* Hide Sidebar Button */}
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
