'use client'
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPlus, FaChevronDown, FaChevronUp, FaFileAlt, FaClipboard, FaEye, FaCalendarAlt, FaClock, FaEdit } from "react-icons/fa"
import { BsGrid } from "react-icons/bs"
import Link from "next/link";

interface Task {
    title: string;
    admin?: string;
    timeLeft?: string;
    date?: string;
    icons?: string[];
    isActive?: boolean;
    isGray?: boolean;
    startDate?: string
    endDate?: string
}

interface Subject {
    name: string;
    tasks: Task[];
}

const TeacherDashboard: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mainTasks, setMainTasks] = useState<Task[]>([
        {
            title: "Collect Forms",
            admin: "Admin Name He.",
            timeLeft: "6D Left",
            icons: ["icon-clipboard"],
            isActive: true,
        },
        {
            title: "Check Notebooks",
            admin: "Admin Name He.",
            icons: ["icon-file", "icon-clipboard"],
            date: "12th Dec 2025",
            isActive: false,
        },
        {
            title: "Collect Forms",
            admin: "Admin Name He.",
            isGray: true,
        },
    ]);

    const expandedTasks: Task[] = [
        {
            title: "Check Notebooks",
            admin: "Admin Name He.",
            icons: ["icon-file", "icon-clipboard"],
            date: "12th Dec 2025",
        },
        {
            title: "Check Notebooks",
            admin: "Admin Name He.",
            timeLeft: "6D Left",
            icons: ["icon-file", "icon-clipboard"],
        },
    ];

    const subjects: Subject[] = [
        {
            name: "English (8th B)",
            tasks: Array(3).fill({
                title: "Collect Forms XYZ",
                startDate: "27/12/24",
                endDate: "30/12/24",
                timeLeft: "6D Left",
            }),
        },
        {
            name: "Maths (7th B)",
            tasks: Array(3).fill({
                title: "Collect Forms XYZ",
                startDate: "27/12/24",
                endDate: "30/12/24",
                timeLeft: "6D Left",
            }),
        },
    ];

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case "icon-file":
                return <FaFileAlt className="text-gray-500" />;
            case "icon-clipboard":
                return <FaClipboard className="text-blue-500" />;
            case "icon-eye":
                return <FaEye className="text-gray-500 hover:text-red-500 transition-colors" />;
            case "icon-calendar":
                return <FaCalendarAlt className="text-orange-400" />;
            case "icon-clock":
                return <FaClock className="text-orange-400" />;
            default:
                return null;
        }
    };

    const handleCardClick = (task: Task) => {
        console.log("Card clicked:", task);
    };

    const handleAddTask = () => {
        const newTask: Task = {
            title: "New Task",
            admin: "New Admin",
            timeLeft: "3D Left",
            icons: ["icon-clipboard"],
            isActive: true,
        };
        setMainTasks((prevTasks) => [...prevTasks, newTask]);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Main Class Section */}
            <div className="space-y-4 border-2 bg-[#FBFBFB] p-8 border-slate-950 rounded-3xl shadow-md">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#434C78]">My Class 7th A</h2>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-[#434C78] hover:text-[#434C78] text-lg underline">
                            View Class
                        </Button>
                    </Link>
                </div>

                <div className="space-y-3">
                    {mainTasks.map((task, index) => (
                        <Card
                            key={index}
                            onClick={() => handleCardClick(task)}
                            className={`border ${task.isActive
                                    ? "border-[#FFDCD1]"
                                    : task.isGray
                                        ? "border-gray-300 bg-gray-100"
                                        : "border-gray-200"
                                } rounded-lg hover:border-[#DB2424] transition-colors cursor-pointer`}
                        >
                            <CardContent className="flex justify-between items-center py-4 px-5">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{task.title}</span>
                                    {task.admin && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">{task.admin}</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    {task.icons?.map((icon, i) => (
                                        <span key={i}>{renderIcon(icon)}</span>
                                    ))}
                                    {task.timeLeft && (
                                        <span className="text-sm text-[#F97316]">{task.timeLeft}</span>
                                    )}
                                    {task.date && (
                                        <span className="text-sm text-gray-500">{task.date}</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {isExpanded && (
                        <div className="space-y-3">
                            {expandedTasks.map((task, index) => (
                                <Card
                                    key={`expanded-${index}`}
                                    onClick={() => handleCardClick(task)}
                                    className="border border-gray-200 rounded-lg hover:border-[#DB2424] transition-colors cursor-pointer"
                                >
                                    <CardContent className="flex justify-between items-center py-4 px-5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{task.title}</span>
                                            {task.admin && (
                                                <>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-sm text-gray-500">{task.admin}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {task.icons?.map((icon, i) => (
                                                <span key={i}>{renderIcon(icon)}</span>
                                            ))}
                                            {task.timeLeft && (
                                                <span className="text-sm text-[#F97316] flex items-center gap-1">
                                                    <FaClock /> {task.timeLeft}
                                                </span>
                                            )}
                                            {task.date && (
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FaCalendarAlt /> {task.date}
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>

                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-600 hover:text-[#DB2424]"
                        >
                            {isExpanded ? (
                                <>
                                    <FaChevronUp className="w-3 h-3 mr-2" />
                                    Show less
                                </>
                            ) : (
                                <>
                                    <FaChevronDown className="w-3 h-3 mr-2" />
                                    View all
                                </>
                            )}
                        </Button>
                        <Button
                            size="sm"
                            className="bg-[#4B5768] hover:bg-[#DB2424] text-white"
                            onClick={handleAddTask}
                        >
                            <FaPlus className="w-4 h-4 mr-2" />
                            Create a task
                        </Button>
                    </div>
                </div>
            </div>

            {/* Subjects Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {subjects.map((subject, index) => (
                    <div key={index} className="space-y-4 bg-[#FBFBFB] p-10 rounded-3xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium">{subject.name}</h2>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#434C78] hover:text-[#434C78] text-lg underline"
                            >
                                View Class
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {subject.tasks.map((task, taskIndex) => (
                                <Card
                                    key={taskIndex}
                                    className="border border-[#FFDCD1] rounded-lg hover:border-[#DB2424] transition-colors cursor-pointer"
                                    onClick={() => handleCardClick(task)}
                                >
                                    <CardContent className="flex justify-between items-center py-4 px-5">
                                        <div>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {task.startDate} - {task.endDate}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-[#F97316]">{task.timeLeft}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:text-[#DB2424]"
                                            >
                                                <span className="custom-icon-eye" />
                                                <BsGrid className="w-4 h-4 text-gray-500 hover:text-[#DB2424]" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[#4B5768] hover:text-[#DB2424] border-[#E5E7EB]"
                            >
                            <FaEdit/>
                                Edit schedule
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[#4B5768] hover:bg-[#DB2424] text-white"
                            >
                                <FaPlus/>
                                Create a task
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;
