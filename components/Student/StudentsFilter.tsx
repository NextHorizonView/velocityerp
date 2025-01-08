import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
    academics: string;
    gender: 'Male' | 'Female' | null;
    class: readonly [number, number];
    division: string[];
    phoneNumber: boolean;
    grNumber: boolean;
    email: boolean;
}

type FilterValue<K extends keyof FilterState> = FilterState[K];

interface FilterProps {
    onFilterChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
    initialFilters: FilterState | null;
}

const defaultFilters: FilterState = {
    academics: '',
    gender: null,
    class: [0, 12] as const,
    division: [],
    phoneNumber: false,
    grNumber: false,
    email: false
};

const FilterModal: React.FC<FilterProps> = ({ onFilterChange, isOpen, onClose, initialFilters }) => {
    const [filters, setFilters] = useState<FilterState>(initialFilters || defaultFilters);
    const divisions = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K'];

    useEffect(() => {
        if (initialFilters) {
            setFilters(initialFilters);
        }
    }, [initialFilters]);

    const handleInputChange = <K extends keyof FilterState>(
        key: K,
        value: FilterValue<K>
    ) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    // Function to handle "Select All" for unfilled data
    const handleSelectAllUnfilledData = () => {
        const allSelected = filters.phoneNumber && filters.grNumber && filters.email;
        const newValue = !allSelected;
        const newFilters = {
            ...filters,
            phoneNumber: newValue,
            grNumber: newValue,
            email: newValue
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Function to handle "Select All" for divisions
    const handleSelectAllDivisions = () => {
        const newDivisions = filters.division.length === divisions.length ? [] : [...divisions];
        const newFilters = {
            ...filters,
            division: newDivisions
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Check if all unfilled data options are selected
    const areAllUnfilledDataSelected = filters.phoneNumber && filters.grNumber && filters.email;

    // Check if all divisions are selected
    const areAllDivisionsSelected = filters.division.length === divisions.length;

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
                    {/* Academics Dropdown */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Academics</label>
                        <select
                            value={filters.academics}
                            onChange={(e) => handleInputChange('academics', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-sm"
                        >
                            <option value="">Select year</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                        </select>
                    </div>

                    {/* Gender Toggle */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Gender</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleInputChange('gender', 'Male')}
                                className={cn(
                                    "py-2 rounded-lg text-sm transition-colors",
                                    filters.gender === 'Male'
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
                                    filters.gender === 'Female'
                                        ? "bg-[#576086] text-white"
                                        : "bg-gray-50 text-gray-500"
                                )}
                            >
                                Female
                            </button>
                        </div>
                    </div>

                    {/* Class Dropdown */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Class</label>
                        <select
                            className="w-full p-2.5 border rounded-lg bg-white text-sm"
                            value={filters.class[0]}
                            onChange={(e) => handleInputChange('class', [parseInt(e.target.value), filters.class[1]] as const)}
                        >
                            <option value="">Select class</option>
                            {Array.from({ length: 13 }, (_, i) => (
                                <option key={i} value={i}>Class {i}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Sort By</label>
                        <select
                            className="w-full p-2.5 border rounded-lg bg-white text-sm"
                        >
                            <option value="">Sort</option>
                            <option value="name">Name</option>
                            <option value="class">Class</option>
                        </select>
                    </div>

                    {/* Unfilled Data */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-600">Unfilled Data</label>
                            <button
                                onClick={handleSelectAllUnfilledData}
                                className="text-sm text-blue-600"
                            >
                                {areAllUnfilledDataSelected ? 'Unselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Phone Number</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.grNumber}
                                    onChange={(e) => handleInputChange('grNumber', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">GR Number</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.email}
                                    onChange={(e) => handleInputChange('email', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Email</span>
                            </label>
                        </div>
                    </div>

                    {/* Division */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-600">Division</label>
                            <button
                                onClick={handleSelectAllDivisions}
                                className="text-sm text-blue-600"
                            >
                                {areAllDivisionsSelected ? 'Unselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {divisions.map((div) => (
                                <button
                                    key={div}
                                    onClick={() => {
                                        const updatedDivisions = filters.division.includes(div)
                                            ? filters.division.filter((d) => d !== div)
                                            : [...filters.division, div];
                                        handleInputChange('division', updatedDivisions);
                                    }}
                                    className={cn(
                                        "p-2 rounded-lg text-sm transition-colors",
                                        filters.division.includes(div)
                                            ? "bg-orange-200 text-orange-700"
                                            : "bg-gray-50 text-gray-500"
                                    )}
                                >
                                    {div}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Apply Filter Button */}
                    <button
                        className="w-full py-2.5 bg-[#576086] text-white rounded-lg text-sm font-medium"
                    >
                        Apply Filter
                    </button>
                </div>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                // Removed the onClick={onClose} handler
                />
            )}
        </>
    );
};

export default FilterModal;