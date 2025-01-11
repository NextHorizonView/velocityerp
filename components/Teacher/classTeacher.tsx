'use client'
'use client'
import React, { useState } from 'react';
import {
  ChevronLeft,
  X,
  Search,
  FileText,
  Edit
} from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Student {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  email: string;
  phone: string;
  birthday: string;
  homeworkStats: {
    completed: number;
    awaitingEdits: number;
    unfinished: number;
  };
}

const attendanceData = [
  { name: 'Mon', value: 85 },
  { name: 'Tue', value: 90 },
  { name: 'Wed', value: 80 },
  { name: 'Thu', value: 95 },
  { name: 'Fri', value: 88 },
];

const StudentListItem: React.FC<{
  name: string;
  avatar: string;
  onSelect: () => void;
  isSelected?: boolean;
}> = ({ name, avatar, onSelect, isSelected }) => (
  <div
    onClick={onSelect}
    className={`flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-orange-50' : ''
      }`}
  >
    <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden flex-shrink-0">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>
    <span className="ml-4 flex-grow font-medium text-gray-900">{name}</span>
    <div className="flex items-center space-x-12">
      <span className="w-24 text-sm text-gray-600">Homework</span>
      <span className="w-24 text-sm text-gray-600">Attendance</span>
      <span className="w-16 text-sm text-gray-600">Marks</span>
      <div className="flex space-x-4">
        <button className="text-gray-400 hover:text-gray-600">
          <FileText className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <Edit className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const SearchBar: React.FC = () => (
  <div className="px-6 py-4 border-b border-gray-200">
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by student"
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
  </div>
);

const StudentDetails: React.FC<{
  student: Student;
  onClose: () => void;
}> = ({ student, onClose }) => {
  const COLORS = ['#4338ca', '#fb923c', '#7c3aed'];
  const pieData = [
    { name: 'Completed', value: student.homeworkStats.completed },
    { name: 'Awaiting Edits', value: student.homeworkStats.awaitingEdits },
    { name: 'Unfinished', value: student.homeworkStats.unfinished }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 overflow-hidden">
            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 w-20">Age:</span>
              <span className="text-sm text-gray-900">{student.age}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 w-20">Location:</span>
              <span className="text-sm text-gray-900">{student.location}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 w-20">Email:</span>
              <span className="text-sm text-gray-900">{student.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 w-20">Phone:</span>
              <span className="text-sm text-gray-900">{student.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 w-20">Birthday:</span>
              <span className="text-sm text-gray-900">{student.birthday}</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col items-center">
              <PieChart width={200} height={200}>
                <Pie
                  data={pieData}
                  cx={100}
                  cy={100}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="mt-4 space-y-2">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="ml-2 text-sm text-gray-600">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Attendance in March</h3>
            <LineChart width={300} height={150} data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis hide={true} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#fb923c"
                strokeWidth={2}
                dot={{ fill: '#fb923c', strokeWidth: 2 }}
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherClass: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const students: Student[] = [
    {
      id: '1',
      name: 'Emily Smith',
      avatar: 'https://images.unsplash.com/photo-1533636721434-0e2d61030955?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      age: 10,
      location: 'Mumbai',
      email: 'avamartin@gmail.com',
      phone: '+3375705457',
      birthday: '14.09.2013',
      homeworkStats: {
        completed: 86,
        awaitingEdits: 4,
        unfinished: 10
      }
    },
    {
      id: '2',
      name: 'Isaac Turner',
      avatar: '/api/placeholder/32/32',
      age: 10,
      location: 'Mumbai',
      email: 'isaac@example.com',
      phone: '+1234567890',
      birthday: '15.08.2013',
      homeworkStats: {
        completed: 82,
        awaitingEdits: 8,
        unfinished: 10
      }
    },
    {
      id: '3',
      name: 'Ava Martin',
      avatar: '/api/placeholder/32/32',
      age: 10,
      location: 'Mumbai',
      email: 'avamartin@gmail.com',
      phone: '+3375705457',
      birthday: '14.03.2003',
      homeworkStats: {
        completed: 86,
        awaitingEdits: 4,
        unfinished: 10
      }
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col bg-white shadow-sm">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <button className="flex items-center text-gray-600">
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-2">Back</span>
          </button>
          <button className="ml-auto px-4 py-2 bg-orange-50 text-orange-500 rounded-lg text-sm">
            Filters
          </button>
        </div>

        <SearchBar />

        <div className="flex-1 overflow-auto divide-y divide-gray-200">
          {students.map(student => (
            <StudentListItem
              key={student.id}
              name={student.name}
              avatar={student.avatar}
              onSelect={() => setSelectedStudent(student)}
              isSelected={selectedStudent?.id === student.id}
            />
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Showing page 1 to 24 of 88 entries</p>
          <div className="flex justify-center mt-4 gap-1">
            {[1, 2, 3, 4, '...', 40].map((page, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div className="w-96 border-l border-gray-200">
          <StudentDetails
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherClass;