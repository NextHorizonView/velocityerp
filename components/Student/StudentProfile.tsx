import React from 'react';
import { Printer, MapPin, Mail } from 'lucide-react';

const StudentProfile: React.FC = () => {
  // Hardcoded student information
  const student = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    imageUrl: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", // Placeholder image
  };

  return (
    <div className="p-6 rounded-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section - Profile */}
        <div className="bg-[#FAFAF8] p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-[#576086] mb-6">Student Profile</h2>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={student.imageUrl}
                alt={`${student.name}'s profile`}
                className="w-24 h-24 rounded-full object-cover"
              />
              
            </div>
            <h3 className="text-lg pt-3  font-medium text-gray-900">{student.name}</h3>
            <p className="text-sm pt-3 text-gray-600 mb-2">{student.email}</p>
            <p className="text-sm text-gray-600 mb-4">{student.phone}</p>
            <div className="flex justify-center space-x-6 mt-3">
              <button className="p-2 hover:text-indigo-600">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 hover:text-indigo-600">
                <MapPin className="w-5 h-5" />
              </button>
              <button className="p-2 hover:text-indigo-600">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

     
        <div className="bg-white p-6 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Additional stats or subjects can go here.</span>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
