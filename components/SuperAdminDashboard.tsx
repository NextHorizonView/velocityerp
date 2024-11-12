'use client'
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [tasks, setTasks] = useState([
    'Distribute the books in all class',
  ]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTask('');
    }
  };

  return (
    <div className="p-6 bg-white">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Student Card */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[#576086] text-sm">Student</p>
            <p className="text-[#576086] text-2xl font-bold">790</p>
          </div>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Search className="w-4 h-4 text-[#576086]" />
          </button>
        </div>

        {/* Teachers Card */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[#576086] text-sm">Teachers</p>
            <p className="text-[#576086] text-2xl font-bold">28</p>
          </div>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Search className="w-4 h-4 text-[#576086]" />
          </button>
        </div>

        {/* Clerks Card */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[#576086] text-sm">Clerks</p>
            <p className="text-[#576086] text-2xl font-bold">2</p>
          </div>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Search className="w-4 h-4 text-[#576086]" />
          </button>
        </div>

        {/* Non Teaching Card */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[#576086] text-sm">Non Teaching</p>
            <p className="text-[#576086] text-2xl font-bold">4</p>
          </div>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Search className="w-4 h-4 text-[#576086]" />
          </button>
        </div>
      </div>

      {/* Tasks and Attendance Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="md:col-span-2">
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-[#576086] font-semibold mb-4">Today's Tasks</h2>
            <div className="space-y-4">
              {/* Input for Adding New Task */}
              <div className="flex bg-white items-center p-2 rounded-lg justify-between">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a new task"
                  className="flex-1 border-none outline-none text-[#576086] px-2"
                />
                <button
                  onClick={handleAddTask}
                  className="w-8 h-8 bg-[#576086] rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xl">+</span>
                </button>
              </div>

              {/* Display Task List */}
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-white flex items-center p-2 rounded-lg justify-between"
                >
                  <p className="text-[#576086] text-sm">{task}</p>
                  <div className="w-5 h-5 border-2 border-[#576086] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div>
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-[#576086] font-semibold mb-4">Today's Attendance</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#576086] text-sm">BOYS:</span>
                <span className="text-[#576086]">550 / 600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#576086] text-sm">GIRLS:</span>
                <span className="text-[#576086]">850 / 1260</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#576086] text-sm">Total:</span>
                <span className="text-[#576086]">1400 / 1860</span>
              </div>
              <div className="flex justify-between items-center text-[#576086]">
                <span className="text-sm">ABSENT:</span>
                <span>460</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
