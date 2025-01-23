import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Export all the interfaces and types that might be needed elsewhere
export interface BaseFilterState {
    academicYear: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface StudentFilterState extends BaseFilterState {
    gender: 'Male' | 'Female' | null;
    class: readonly [number, number];
    disability: boolean;
    specialStudent: boolean;
}

export interface TeacherFilterState extends BaseFilterState {
    gender: 'Male' | 'Female' | null;
    position: string;
}

export interface ClassFilterState extends BaseFilterState {
    subject: string;
}

export type FilterState = StudentFilterState | TeacherFilterState | ClassFilterState;

export interface FilterProps {
    route: '/students' | '/teacher' | '/class';
    onFilterChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
    initialFilters: FilterState | null;
}
const defaultStudentFilters: StudentFilterState = {
    academicYear: '',
    gender: null,
    class: [0, 12] as const,
    disability: false,
    specialStudent: false,
    sortBy: 'name',
    sortOrder: 'asc'
};

const defaultTeacherFilters: TeacherFilterState = {
    academicYear: '',
    gender: null,
    position: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

const defaultClassFilters: ClassFilterState = {
    academicYear: '',
    subject: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

const FilterModal: React.FC<FilterProps> = ({ route, onFilterChange, isOpen, onClose, initialFilters }) => {
    const [filters, setFilters] = useState<FilterState>(getDefaultFilters(route));

    // useEffect(() => {
    //     if (initialFilters) {
    //         setFilters(initialFilters);
    //     } else {
    //         setFilters(getDefaultFilters(route));
    //     }
    // }, [initialFilters, route]);

    useEffect(() => {
        const defaultFilters = getDefaultFilters(route);
        if (initialFilters && route) {
            setFilters({ ...defaultFilters, ...initialFilters }); // Merge with defaults
        } else {
            setFilters(defaultFilters);
        }
    }, [initialFilters, route]);

    function getDefaultFilters(route: string): FilterState {
        switch (route) {
            case '/students':
                return defaultStudentFilters;
            case '/teacher':
                return defaultTeacherFilters;
            case '/class':
                return defaultClassFilters;
            default:
                return defaultStudentFilters;
        }
    }

    const handleInputChange = <
        K extends keyof StudentFilterState | keyof TeacherFilterState | keyof ClassFilterState
    >(
        key: K,
        value: K extends keyof StudentFilterState
            ? StudentFilterState[K]
            : K extends keyof TeacherFilterState
            ? TeacherFilterState[K]
            : K extends keyof ClassFilterState
            ? ClassFilterState[K]
            : never
    ) => {
        let updatedFilters: FilterState;

        if (route === '/students') {
            updatedFilters = { ...filters, [key]: value } as StudentFilterState;
        } else if (route === '/teacher') {
            updatedFilters = { ...filters, [key]: value } as TeacherFilterState;
        } else if (route === '/class') {
            updatedFilters = { ...filters, [key]: value } as ClassFilterState;
        } else {
            throw new Error('Invalid route');
        }

        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };



    const resetFilters = () => {
        const defaultFilters = getDefaultFilters(route);
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const renderAcademicYearFilter = () => (
        <div className="space-y-1">
            <label className="text-sm text-gray-600">Academic Year</label>
            <select
                value={(filters as BaseFilterState).academicYear}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white text-sm"
            >
                <option value="">Select year</option>
                <option value="2019-20">2019-20</option>
                <option value="2024-25">2024-25</option>
            </select>
        </div>
    );

    const renderSortingControls = () => (
        <div className="space-y-2">
            <div className="space-y-1">
                <label className="text-sm text-gray-600">Sort By</label>
                <select
                    value={(filters as BaseFilterState).sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                >
                    <option value="First Name">Name</option>
                    <option value="class">Class</option>
                    <option value="date">Date</option>
                </select>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => handleInputChange('sortOrder', 'asc')}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm",
                        (filters as BaseFilterState).sortOrder === 'asc'
                            ? "bg-[#576086] text-white"
                            : "bg-gray-50 text-gray-500"
                    )}
                >
                    Ascending
                </button>
                <button
                    onClick={() => handleInputChange('sortOrder', 'desc')}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm",
                        (filters as BaseFilterState).sortOrder === 'desc'
                            ? "bg-[#576086] text-white"
                            : "bg-gray-50 text-gray-500"
                    )}
                >
                    Descending
                </button>
            </div>
        </div>
    );

    const renderRouteSpecificFilters = () => {
        switch (route) {
            case '/students':
                return (
                    <>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-600">Gender</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleInputChange('gender', 'Male')}
                                    className={cn(
                                        "py-2 rounded-lg text-sm transition-colors",
                                        (filters as StudentFilterState).gender === 'Male'
                                            ? "bg-[#576086] text-white"
                                            : "bg-gray-50 text-gray-500"
                                    )}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => handleInputChange('gender', 'Female')}
                                    className={cn(
                                        "py-2 rounded-lg text-sm transition-colors",
                                        (filters as StudentFilterState).gender === 'Female'
                                            ? "bg-[#576086] text-white"
                                            : "bg-gray-50 text-gray-500"
                                    )}
                                >
                                    Female
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-600">Class</label>
                            <select
                                value={(filters as StudentFilterState).class[0]}
                                onChange={(e) => handleInputChange('class', [parseInt(e.target.value), (filters as StudentFilterState).class[1]] as const)}
                                className="w-full p-2.5 border rounded-lg bg-white text-sm"
                            >
                                {Array.from({ length: 13 }, (_, i) => (
                                    <option key={i} value={i}>Class {i}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={(filters as StudentFilterState).disability}
                                    onChange={(e) => handleInputChange('disability', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Disability</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={(filters as StudentFilterState).specialStudent}
                                    onChange={(e) => handleInputChange('specialStudent', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Special Student</span>
                            </label>
                        </div>
                    </>
                );

            case '/teacher':
                return (
                    <>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-600">Gender</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleInputChange('gender', 'Male')}
                                    className={cn(
                                        "py-2 rounded-lg text-sm transition-colors",
                                        (filters as TeacherFilterState).gender === 'Male'
                                            ? "bg-[#576086] text-white"
                                            : "bg-gray-50 text-gray-500"
                                    )}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => handleInputChange('gender', 'Female')}
                                    className={cn(
                                        "py-2 rounded-lg text-sm transition-colors",
                                        (filters as TeacherFilterState).gender === 'Female'
                                            ? "bg-[#576086] text-white"
                                            : "bg-gray-50 text-gray-500"
                                    )}
                                >
                                    Female
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-600">Position</label>
                            <select
                                value={(filters as TeacherFilterState).position}
                                onChange={(e) => handleInputChange('position', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-sm"
                            >
                                <option value="">Select position</option>
                                <option value="principal">Principal</option>
                                <option value="vice-principal">Vice Principal</option>
                                <option value="senior-teacher">Senior Teacher</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                    </>
                );

            case '/class':
                return (
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Subject</label>
                        <select
                            value={(filters as ClassFilterState).subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-sm"
                        >
                            <option value="">Select subject</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="english">English</option>
                            <option value="history">History</option>
                            <option value="aaa">aaa</option>

                        </select>
                    </div>
                );

     
                default:
            return <div>No filters available</div>;
        }
    };

    return (
        <>
            <div className={cn(
                "fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 rounded-l-xl",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-medium">Filter</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={resetFilters}
                            className="text-sm text-blue-600"
                        >
                            Reset all
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {renderAcademicYearFilter()}
                    {renderRouteSpecificFilters()}
                    {route === '/students' && renderSortingControls()}

                    <button
                        className="w-full py-2.5 bg-[#576086] text-white rounded-lg text-sm font-medium"
                        onClick={() =>{ onFilterChange(filters)

                            onClose();
                        }
                        }
                    >
                        Apply Filter
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            )}
        </>
    );
};

export default FilterModal;