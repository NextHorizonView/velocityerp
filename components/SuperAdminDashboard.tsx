'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, UserCog, ClipboardList, UserMinus } from 'lucide-react';
import NoticeBoard from '@/components/Notice';
import UpcomingEvents from '@/components/Events';

const SuperAdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>(['Distribute the books in all class']);
  const [newTask, setNewTask] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'All Events' | 'Exams'>('All Events');
  const [currentDate] = useState<Date>(new Date(2024, 2));

  const stats = [
    { label: 'Student', value: '790', icon: <Users className="w-5 h-5" /> },
    { label: 'Teachers', value: '28', icon: <UserCog className="w-5 h-5" /> },
    { label: 'Clerks', value: '2', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Non Teaching', value: '4', icon: <UserMinus className="w-5 h-5" /> },
  ];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[#576086] text-sm">{stat.label}</p>
                  <div className="text-[#576086]">{stat.icon}</div>
                </div>
                <p className="text-[#576086] text-2xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tasks and Attendance Section */}
          <div className="grid grid-cols-[70%,30%] gap-6">
            {/* Tasks Section */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-[#576086] font-semibold mb-4">Today&apos;s Tasks</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task for today"
                    className="flex-1 px-4 py-2 rounded-lg bg-white"
                  />
                  <button
                    onClick={() => {
                      if (newTask.trim()) {
                        setTasks([...tasks, newTask]);
                        setNewTask('');
                      }
                    }}
                    className="w-8 h-8 bg-[#576086] rounded-full flex items-center justify-center text-white"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded-lg p-4 break-words"
                    >
                      <span className="text-[#576086] flex-1">{task}</span>
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-2 border-[#576086] rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attendance Info */}
            <div className="bg-gray-100 rounded-lg p-6 mr-6">
              <h2 className="text-[#576086] font-semibold mb-4">Today&apos;s Attendance</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#576086]">BOYS:</span>
                  <span className="text-[#576086]">550 / 600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#576086]">GIRLS:</span>
                  <span className="text-[#576086]">850 / 1260</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#576086]">Total:</span>
                  <span className="text-[#576086]">1400 / 1860</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#576086]">ABSENT:</span>
                  <span className="text-[#576086]">460</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notice Board */}
          <NoticeBoard />
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className="bg-[#576086] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 bg-white rounded-full p-1">
                <button
                  className={`px-4 py-1 rounded-full text-sm ${
                    selectedTab === 'All Events'
                      ? 'bg-[#F7B696] text-white'
                      : 'text-[#576086]'
                  }`}
                  onClick={() => setSelectedTab('All Events')}
                >
                  All Events
                </button>
                <button
                  className={`px-4 py-1 rounded-full text-sm ${
                    selectedTab === 'Exams'
                      ? 'bg-[#F7B696] text-white'
                      : 'text-[#576086]'
                  }`}
                  onClick={() => setSelectedTab('Exams')}
                >
                  Exams
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">March 2024</h3>
              <div className="flex gap-2">
                <button className="text-white hover:bg-[#6b749e] p-1 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="text-white hover:bg-[#6b749e] p-1 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-white text-xs py-2">
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`text-center py-2 text-sm rounded-lg ${
                    day === 13
                      ? 'bg-[#F7B696] text-white font-medium'
                      : day
                      ? 'text-white hover:bg-[#6b749e] cursor-pointer'
                      : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-6">
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
