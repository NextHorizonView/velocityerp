import { cn } from '@/lib/utils';
import { useState } from 'react';
import { X } from 'lucide-react'; // Assuming you're using the `lucide-react` library

interface FilterOption {
    id: string;
    label: string;
}

export interface FilterState {
    subject: string;
    date: string;
    divisions: string[];
}

interface FilterProps {
    onFilterApply: (filters: FilterState) => void;
    subjects: FilterOption[];
    isOpen: boolean;
    onToggle: () => void;
}

const AttendanceFilter = ({
    onFilterApply,
    subjects,
    isOpen,
    onToggle
}: FilterProps) => {
    const [filterState, setFilterState] = useState<FilterState>({
        subject: '',
        date: '',
        divisions: []
    });

    const divisions = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K'];
    const [selectAll, setSelectAll] = useState(false);

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterState(prev => ({ ...prev, subject: e.target.value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterState(prev => ({ ...prev, date: e.target.value }));
    };

    const handleDivisionToggle = (division: string) => {
        setFilterState(prev => {
            const newDivisions = prev.divisions.includes(division)
                ? prev.divisions.filter(d => d !== division)
                : [...prev.divisions, division];
            return { ...prev, divisions: newDivisions };
        });
    };

    const handleSelectAllDivisions = () => {
        setSelectAll(!selectAll);
        setFilterState(prev => ({
            ...prev,
            divisions: !selectAll ? divisions : []
        }));
    };

    const handleApplyFilter = () => {
        onFilterApply(filterState);
    };

    // const handleReset = () => {
    //     setFilterState({
    //         subject: '',
    //         date: '',
    //         divisions: []
    //     });
    //     setSelectAll(false);
    // };

    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 rounded-l-xl",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-medium">Attendance Filter</h3>
                <button onClick={onToggle} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Subject</label>
                    <select
                        value={filterState.subject}
                        onChange={handleSubjectChange}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <select
                        value={filterState.date}
                        onChange={handleDateChange}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Select Date</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last7days">Last 7 Days</option>
                        <option value="last30days">Last 30 Days</option>
                    </select>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-600">Division</label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllDivisions}
                                className="rounded"
                            />
                            <span className="text-sm">Select All</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {divisions.map(division => (
                            <button
                                key={division}
                                onClick={() => handleDivisionToggle(division)}
                                className={`p-2 rounded-md text-center ${filterState.divisions.includes(division)
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-50'
                                    }`}
                            >
                                {division}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleApplyFilter}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Apply filter
                </button>
            </div>
        </div>
    );
};

export default AttendanceFilter;
