import React from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import Image from 'next/image';

const NoticeBoard = () => {
  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <div className="mb-4">
        <h2 className="text-gray-800 text-lg font-semibold">Notice Board</h2>
        <p className="text-gray-500 text-sm">All your notices listed below</p>
      </div>

      {/* Notice Card */}
      <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Notice Image */}
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1725714834412-7d7154ac4e4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8" 
                alt="Competition notice" 
                width={48}
                height={48}
                className="object-cover"
              />
            </div>

            {/* Notice Content */}
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="text-gray-800 font-medium">Inter School Competition</h3>
                <p className="text-gray-500 text-sm">Year 2024-2025</p>
              </div>
              <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                11 Nov, 2024
              </span>
            </div>
          </div>

          {/* Views and Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500 space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">0.2K</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
