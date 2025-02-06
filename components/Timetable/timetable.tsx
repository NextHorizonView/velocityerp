'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface TimeSlot {
  id: string;
  subject: string;
  teacher: string;
  courseInfo: string;
  color: string;
  width: number;
  startTime: string;
  endTime: string;
}

interface GridCell {
  content: TimeSlot | null;
  width: number;
  isMerged: boolean;
}

const SCHEDULE_DATA = {
  days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  timeSlots: [
    { display: '8', end: '9', label: '8-9' },
    { display: '9', end: '10', label: '9-10' },
    { display: '10', end: '11', label: '10-11' },
    { display: '11', end: '12', label: '11-12' },
    { display: '12', end: '1', label: '12-1' },
    { display: '1', end: '2', label: '1-2' },
    { display: '2', end: '3', label: '2-3' },
    { display: '3', end: '4', label: '3-4' },
    { display: '4', end: '5', label: '4-5' }
  ],
  subjects: [
    { subject: 'Code', teacher: 'Course Name', color: 'bg-purple-500', type: 'B slot' },
    { subject: 'Code', teacher: 'Course Name', color: 'bg-blue-500', type: 'C slot' },
    { subject: 'Code', teacher: 'Course Name', color: 'bg-emerald-500', type: 'D slot' },
    { subject: 'Code', teacher: 'Course Name', color: 'bg-orange-500', type: 'E slot' },
    { subject: 'Code', teacher: 'Course Name', color: 'bg-rose-500', type: 'F slot' },
    { subject: 'Code', teacher: 'Course Name', color: 'bg-amber-500', type: 'G slot' }
  ]
};

const createInitialGrid = () => {
  const grid: { [key: string]: GridCell } = {};

  SCHEDULE_DATA.days.forEach((day, dayIndex) => {
    SCHEDULE_DATA.timeSlots.forEach((time, timeIndex) => {
      const cellId = `${day}-${timeIndex}`;
      if ((dayIndex + timeIndex) % 3 === 0) {
        const subjectIndex = (dayIndex + timeIndex) % SCHEDULE_DATA.subjects.length;
        const subject = SCHEDULE_DATA.subjects[subjectIndex];
        grid[cellId] = {
          content: {
            id: cellId,
            subject: subject.subject,
            teacher: subject.teacher,
            courseInfo: subject.type,
            color: subject.color,
            width: 1,
            startTime: time.display,
            endTime: time.end
          },
          width: 1,
          isMerged: false
        };
      } else {
        grid[cellId] = { content: null, width: 1, isMerged: false };
      }
    });
  });
  return grid;
};

const TimeTable = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [grid, setGrid] = useState<{ [key: string]: GridCell }>(createInitialGrid());

  const handleCellClick = (cellId: string) => {
    if (!isEditMode) return;

    const cell = grid[cellId];
    if (!cell || cell.width === 0) return;

    if (selectedCells.length > 0) {
      const [lastDay, lastIndex] = selectedCells[selectedCells.length - 1].split('-');
      const [currentDay, currentIndex] = cellId.split('-');

      if (lastDay !== currentDay || Math.abs(parseInt(currentIndex) - parseInt(lastIndex)) !== 1) {
        setSelectedCells([cellId]);
        return;
      }
    }

    setSelectedCells(prev =>
      prev.includes(cellId) ? prev.filter(id => id !== cellId) : [...prev, cellId].sort()
    );
  };

  const mergeCells = () => {
    if (selectedCells.length < 2) return;

    const sortedCells = selectedCells.sort((a, b) => {
      const [dayA, indexA] = a.split('-');
      const [dayB, indexB] = b.split('-');
      return dayA === dayB ? parseInt(indexA) - parseInt(indexB) : dayA.localeCompare(dayB);
    });

    const [firstId, ...otherIds] = sortedCells;
    const firstCell = grid[firstId];

    if (!firstCell.content) {
      setSelectedCells([]);
      return;
    }

    const [firstDay] = firstId.split('-');

    const isValidMerge = sortedCells.every((cellId, index) => {
      const [day, timeIndex] = cellId.split('-');
      if (day !== firstDay) return false;
      if (index === 0) return true;
      const [, prevTimeIndex] = sortedCells[index - 1].split('-');
      return parseInt(timeIndex) - parseInt(prevTimeIndex) === 1;
    });

    if (!isValidMerge) {
      setSelectedCells([]);
      return;
    }

    const [, firstTimeIndex] = firstId.split('-');
    const width = selectedCells.length;
    const endTimeIndex = parseInt(firstTimeIndex) + width - 1;
    const endTime = SCHEDULE_DATA.timeSlots[endTimeIndex].end;

    setGrid(prev => {
      const newGrid = { ...prev };

      newGrid[firstId] = {
        content: {
          ...firstCell.content!,
          width,
          endTime
        },
        width,
        isMerged: true
      };

      otherIds.forEach(id => {
        newGrid[id] = { content: null, width: 0, isMerged: true };
      });

      return newGrid;
    });

    setSelectedCells([]);
  };

  const renderTimeHeader = () => (
    <div className="relative mb-4">
      <div className="grid gap-4" style={{
        gridTemplateColumns: `100px repeat(${SCHEDULE_DATA.timeSlots.length}, minmax(120px, 1fr))`,
      }}>
        <div className="h-14 flex items-center justify-center font-medium text-gray-500">
          Time
        </div>
        {SCHEDULE_DATA.timeSlots.map((slot, index) => (
          <div
            key={index}
            className="h-14 flex items-center justify-center text-sm font-medium text-gray-600 px-2"
            style={{ minWidth: '120px' }}
          >
            {slot.label}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
    </div>
  );


  const renderCell = (day: string, timeIndex: number) => {
    const cellId = `${day}-${timeIndex}`;
    const cell = grid[cellId];

    if (!cell || cell.width === 0) return null;

    const content = cell.content;
    const width = cell.width || 1;

    return (
      <div
        key={cellId}
        className={`
          h-24 min-w-[120px]
          ${content
            ? `${content.color} border border-white/20`
            : 'border border-dashed border-gray-200 bg-white'
          }
          ${isEditMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer' : ''}
          ${selectedCells.includes(cellId) ? 'ring-2 ring-blue-500' : ''}
          rounded-lg
          transition-all duration-200
          overflow-hidden
        `}
        style={{
          gridColumn: `span ${width}`,
        }}
        onClick={() => handleCellClick(cellId)}
      >
        {content ? (
          <div className="h-full p-3 flex flex-col">
            <div className="text-white font-medium">{content.subject}</div>
            <div className="text-white/80 text-sm mt-1">{content.teacher}</div>
            <div className="text-white/60 text-sm mt-1">{content.courseInfo}</div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            Empty Slot
          </div>
        )}
      </div>
    );
  };

  const renderPlusButton = (day: string, timeIndex: number) => {
    const cellId = `${day}-${timeIndex}`;
    const nextCellId = `${day}-${timeIndex + 1}`;

    if (selectedCells.includes(cellId) && selectedCells.includes(nextCellId)) {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            onClick={mergeCells}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">Timetable/VII A</h2>
          </div>
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Edit Mode</span>
            <Switch
              checked={isEditMode}
              onCheckedChange={setIsEditMode}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <Button variant="default" className="bg-gray-700">Set Parameters</Button>
          <Button variant="default" className="bg-gray-700">Save</Button>
        </div>
      </div>

      <Card className="p-6 shadow-lg">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] space-y-6">
            {renderTimeHeader()}

            <div className="grid gap-4" style={{
              gridTemplateColumns: `100px repeat(${SCHEDULE_DATA.timeSlots.length}, minmax(120px, 1fr))`,
            }}>
              {SCHEDULE_DATA.days.map(day => (
                <React.Fragment key={day}>
                  <div className="font-medium text-gray-900 py-2 flex items-center justify-center">
                    {day}
                  </div>
                  {SCHEDULE_DATA.timeSlots.map((_, timeIndex) => (
                    <React.Fragment key={timeIndex}>
                      {renderCell(day, timeIndex)}
                      {isEditMode && timeIndex < SCHEDULE_DATA.timeSlots.length - 1 &&
                        renderPlusButton(day, timeIndex)}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TimeTable;