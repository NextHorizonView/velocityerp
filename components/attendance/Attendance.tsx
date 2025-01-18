import Link from 'next/link';
import { ChevronLeft, Filter, ChevronRight } from 'lucide-react';

interface ClassSession {
    id: string;
    subject: string;
    teacher: string;
    time: string;
    status: 'mark' | 'view';
    division: string;
}

export default function AttendanceView() {
    const classes: ClassSession[] = [
        {
            id: '1',
            subject: 'Physics',
            teacher: 'Sucitra Ma\'am',
            time: '8:00 AM',
            status: 'mark',
            division: 'VI A'
        },
        {
            id: '2',
            subject: 'Math',
            teacher: 'Vinita Ma\'am',
            time: '10:30 AM',
            status: 'view',
            division: 'VI B'
        },
        {
            id: '3',
            subject: 'Circuit Theory',
            teacher: 'Sucitra Ma\'am',
            time: '11:00 AM',
            status: 'mark',
            division: 'VI A'
        },
        {
            id: '4',
            subject: 'Discrete Math',
            teacher: 'Vinita Ma\'am',
            time: '11:45 AM',
            status: 'view',
            division: 'VI B'
        },
        {
            id: '5',
            subject: 'Circuit Theory',
            teacher: 'Sucitra Ma\'am',
            time: '12:30 PM',
            status: 'mark',
            division: 'VI A'
        },
        {
            id: '6',
            subject: 'Discrete Math',
            teacher: 'Vinita Ma\'am',
            time: '2:30 PM',
            status: 'view',
            division: 'VI B'
        }
    ];

    return (
        <div className="p-10 max-w-3xl mx-auto rounded-2xl bg-gray-50 min-h-screen">
            {/* Header with back button */}
            <div className="flex items-center mb-8 pt-2">
                <Link href="/" className="text-[#576086] mr-3 flex items-center">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-xl font-semibold text-[#576086]">Attendance</h1>
            </div>

            {/* Today's Classes header with filter */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[#0E2C75]">Today&apos;s Classes</h2>
                    <p className="text-[#798AA3] text-sm mt-1">Today</p>
                </div>
                <button className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 shadow-sm">
                    <Filter size={16} className="text-[#576086]" />
                    <span className="text-[#576086]">Filter</span>
                </button>
            </div>

            {/* Class cards */}
            <div className="space-y-4">
                {classes.map((session) => (
                    <Link 
                        href={`/attendance/attendancemark`}
                        key={session.id}
                        className="block hover:border border-[#0B235E] rounded-xl transition-shadow"
                    >
                        <div className="bg-[#DADEEB] p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        {session.division}
                                    </div>
                                    <div className="font-semibold text-gray-800 mb-1">
                                        {session.subject}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        {session.teacher}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-gray-800 mb-1">
                                        {session.time}
                                    </div>
                                    <div 
                                        className={`text-sm flex items-center justify-end gap-1
                                            ${session.status === 'mark' 
                                                ? 'text-red-500' 
                                                : 'text-green-500'
                                            }`}
                                    >
                                        {session.status === 'mark' ? 'Mark Attendance' : 'View Attendance'}
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}