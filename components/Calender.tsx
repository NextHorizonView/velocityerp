// components/Calendar.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedTab: "All Events" | "Exams";
  setSelectedTab: React.Dispatch<React.SetStateAction<"All Events" | "Exams">>;
  days: (number | null)[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedTab, setSelectedTab, days }) => (
  <div className="bg-[#576086] rounded-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2 bg-white rounded-full p-1">
        <button
          className={`px-4 py-1 rounded-full text-sm ${selectedTab === 'All Events' ? 'bg-[#F7B696] text-white' : 'text-[#576086]'}`}
          onClick={() => setSelectedTab('All Events')}
        >
          All Events
        </button>
        <button
          className={`px-4 py-1 rounded-full text-sm ${selectedTab === 'Exams' ? 'bg-[#F7B696] text-white' : 'text-[#576086]'}`}
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
      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
        <div key={day} className="text-center text-white text-xs py-2">
          {day}
        </div>
      ))}
      {days.map((day, index) => (
        <div
          key={index}
          className={`text-center py-2 text-sm rounded-lg ${day === 13 ? 'bg-[#F7B696] text-white font-medium' : day ? 'text-white hover:bg-[#6b749e] cursor-pointer' : ''}`}
        >
          {day}
        </div>
      ))}
    </div>
  </div>
);

export default Calendar;
