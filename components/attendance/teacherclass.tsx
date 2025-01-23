import Link from 'next/link';

export default function Class() {
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold mb-6">Class</h1>
            <div className="space-y-3">
                <Link href="/attendance"
                    className="p-4 bg-[#DADEEB] rounded-lg hover:bg-gray-200 transition-colors flex justify-between items-center border border-[#576086] text-[#576086]">
                    <span>Attendance</span>
                    <span>→</span>
                </Link>
                <Link href="/timetable"
                    className=" p-4 bg-[#DADEEB] rounded-lg hover:bg-gray-200 transition-colors flex justify-between items-center border border-[#576086] text-[#576086]">
                    <span>Timetable</span>
                    <span>→</span>
                </Link>
                <Link href="/lorem"
                    className="p-4 bg-[#DADEEB] rounded-lg hover:bg-gray-200 transition-colors flex justify-between items-center border border-[#576086] text-[#576086]">
                    <span>Marks</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}