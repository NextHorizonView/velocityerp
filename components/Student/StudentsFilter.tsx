import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export interface FilterState {
    academics: string;
    gender: 'Male' | 'Female' | null;
    age: readonly [number, number];  // Using readonly tuple
    class: readonly [number, number]; // Using readonly tuple
    division: string[];
}

interface FilterProps {
    onFilterChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
}

const FilterModal: React.FC<FilterProps> = ({ onFilterChange, isOpen, onClose }) => {
    const [filters, setFilters] = useState<FilterState>({
        academics: '',
        gender: null,
        age: [4, 17] as const,     // Using const assertion
        class: [0, 12] as const,   // Using const assertion
        division: []
    });

    const divisions = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K'];

    const handleInputChange = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const resetState: FilterState = {
            academics: '',
            gender: null,
            age: [4, 17] as const,
            class: [0, 12] as const,
            division: []
        };
        setFilters(resetState);
        onFilterChange(resetState);
    };

    // Handle age range changes
    const handleAgeChange = (value: number[]) => {
        const newAge: [number, number] = [value[0], value[1]];
        handleInputChange('age', newAge);
    };

    // Handle class range changes
    const handleClassChange = (value: number[]) => {
        const newClass: [number, number] = [value[0], value[1]];
        handleInputChange('class', newClass);
    };

    return (
        <div className={cn(
            "fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium">Student Filter</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={resetFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        Reset all
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Academics Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500">Academics</label>
                    <select
                        value={filters.academics}
                        onChange={(e) => handleInputChange('academics', e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white"
                    >
                        <option value="">Lorem ipsum</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                    </select>
                </div>

                {/* Gender Toggle */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleInputChange('gender', 'Male')}
                            className={cn(
                                "py-2 rounded-full text-sm transition-colors",
                                filters.gender === 'Male'
                                    ? "bg-[#576086] text-white"
                                    : "bg-gray-100 text-gray-600"
                            )}
                        >
                            Male
                        </button>
                        <button
                            onClick={() => handleInputChange('gender', 'Female')}
                            className={cn(
                                "py-2 rounded-full text-sm transition-colors",
                                filters.gender === 'Female'
                                    ? "bg-[#576086] text-white"
                                    : "bg-gray-100 text-gray-600"
                            )}
                        >
                            Female
                        </button>
                    </div>
                </div>

                {/* Age Range */}
                <div className="space-y-4">
                    <label className="text-sm text-gray-500">Age</label>
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <input
                                type="number"
                                value={filters.age[0]}
                                onChange={(e) => handleAgeChange([parseInt(e.target.value), filters.age[1]])}
                                className="w-24 p-2 border rounded-lg"
                                placeholder="Min"
                            />
                            <input
                                type="number"
                                value={filters.age[1]}
                                onChange={(e) => handleAgeChange([filters.age[0], parseInt(e.target.value)])}
                                className="w-24 p-2 border rounded-lg"
                                placeholder="Max"
                            />
                        </div>
                        <Slider
                            min={4}
                            max={17}
                            step={1}
                            value={[filters.age[0], filters.age[1]]}
                            onValueChange={handleAgeChange}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Class Range */}
                <div className="space-y-4">
                    <label className="text-sm text-gray-500">Class</label>
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <input
                                type="number"
                                value={filters.class[0]}
                                onChange={(e) => handleClassChange([parseInt(e.target.value), filters.class[1]])}
                                className="w-24 p-2 border rounded-lg"
                                placeholder="Min"
                            />
                            <input
                                type="number"
                                value={filters.class[1]}
                                onChange={(e) => handleClassChange([filters.class[0], parseInt(e.target.value)])}
                                className="w-24 p-2 border rounded-lg"
                                placeholder="Max"
                            />
                        </div>
                        <Slider
                            min={0}
                            max={12}
                            step={1}
                            value={[filters.class[0], filters.class[1]]}
                            onValueChange={handleClassChange}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Division */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500">Division</label>
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
                                        : "bg-gray-100 text-gray-600"
                                )}
                            >
                                {div}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;