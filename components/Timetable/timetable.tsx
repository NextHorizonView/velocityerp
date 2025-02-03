'use client'
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Edit2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface TimeSlot {
  id: string;
  subject: string;
  teacher: string;
  courseInfo: string;
  color: string;
  width?: number;
}

interface GridCell {
  content: TimeSlot | null;
  width?: number;
  isMerged?: boolean;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const TIME_SLOTS = [
  '8:00', '9:00', '10:00', '11:00', '12:00',
  '1:00', '2:00', '3:00', '4:00', '5:00'
];

const SAMPLE_SUBJECTS = [
  { subject: 'Mathematics', teacher: 'Mr. Anderson', color: 'bg-indigo-600' },
  { subject: 'Physics', teacher: 'Mrs. Johnson', color: 'bg-blue-600' },
  { subject: 'Chemistry', teacher: 'Dr. Smith', color: 'bg-emerald-600' },
  { subject: 'English', teacher: 'Ms. Davis', color: 'bg-rose-600' },
  { subject: 'History', teacher: 'Mr. Wilson', color: 'bg-amber-600' },
  { subject: 'Computer Science', teacher: 'Mr. Turner', color: 'bg-cyan-600' }
];

const createInitialGrid = () => {
  const grid: { [key: string]: GridCell } = {};
  DAYS.forEach((day, dayIndex) => {
    TIME_SLOTS.forEach((time, timeIndex) => {
      const cellId = `${day}-${timeIndex}`;
      if ((dayIndex + timeIndex) % 3 === 0) {
        const subjectIndex = (dayIndex + timeIndex) % SAMPLE_SUBJECTS.length;
        grid[cellId] = {
          content: {
            id: cellId,
            ...SAMPLE_SUBJECTS[subjectIndex],
            courseInfo: 'Room 101',
            width: 1
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
  const [grid, setGrid] = useState<{ [key: string]: GridCell }>({});
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    setGrid(createInitialGrid());
  }, []);

  const handleDragStart = (cellId: string) => {
    if (!isEditMode) return;
    setDraggedId(cellId);
  };

  const calculateAvailableSpace = (targetId: string, requiredWidth: number) => {
    const [targetDay, targetTimeIndex] = targetId.split('-');
    const timeIndex = parseInt(targetTimeIndex);

    // Check if there's enough space to the right
    for (let i = 0; i < requiredWidth; i++) {
      const checkId = `${targetDay}-${timeIndex + i}`;
      const cell = grid[checkId];

      // If cell doesn't exist or is part of another merged cell (except target area)
      if (!cell || (cell.width === 0 && !isPartOfTargetArea(checkId, targetId))) {
        return false;
      }
    }
    return true;
  };

  const isPartOfTargetArea = (checkId: string, targetId: string) => {
    const [targetDay, targetTimeIndex] = targetId.split('-');
    const [checkDay, checkTimeIndex] = checkId.split('-');

    if (targetDay !== checkDay) return false;

    const targetCell = grid[targetId];
    if (!targetCell || !targetCell.isMerged) return false;

    // Find the start of the merged area
    let startId = targetId;
    for (let i = parseInt(targetTimeIndex) - 1; i >= 0; i--) {
      const prevId = `${targetDay}-${i}`;
      if (grid[prevId]?.isMerged && grid[prevId].width !== 0) {
        startId = prevId;
        break;
      }
    }

    const startIndex = parseInt(startId.split('-')[1]);
    const checkIndex = parseInt(checkTimeIndex);
    const width = grid[startId].width || 1;

    return checkIndex >= startIndex && checkIndex < startIndex + width;
  };

  // const getAvailableSlots = (targetId: string, requiredWidth: number) => {
  //   const [targetDay, targetTimeIndex] = targetId.split('-');
  //   const timeIndex = parseInt(targetTimeIndex);

  //   for (let i = 0; i < requiredWidth; i++) {
  //     const checkId = `${targetDay}-${timeIndex + i}`;
  //     if (!grid[checkId] || (grid[checkId].content && grid[checkId].width !== 0)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const handleDrop = (targetId: string) => {
    if (!draggedId || !isEditMode) return;

    const draggedCell = grid[draggedId];
    const targetCell = grid[targetId];
    const width = draggedCell.content?.width || draggedCell.width || 1;

    // Find the actual target (start of merged cell if dropping on merged cell)
    let actualTargetId = targetId;
    if (targetCell.isMerged && targetCell.width === 0) {
      const [targetDay, targetTimeIndex] = targetId.split('-');
      for (let i = parseInt(targetTimeIndex) - 1; i >= 0; i--) {
        const prevId = `${targetDay}-${i}`;
        if (grid[prevId]?.isMerged && grid[prevId].width !== 0) {
          actualTargetId = prevId;
          break;
        }
      }
    }

    if (!calculateAvailableSpace(actualTargetId, width)) {
      return;
    }

    setGrid(prev => {
      const newGrid = { ...prev };
      const [targetDay, targetTimeIndex] = actualTargetId.split('-');
      const timeIndex = parseInt(targetTimeIndex);

      // Clear the source position
      if (draggedCell.width && draggedCell.width > 1) {
        const [draggedDay, draggedTimeIndex] = draggedId.split('-');
        const startIndex = parseInt(draggedTimeIndex);
        for (let i = 0; i < draggedCell.width; i++) {
          const oldId = `${draggedDay}-${startIndex + i}`;
          newGrid[oldId] = { content: null, width: 1, isMerged: false };
        }
      } else {
        newGrid[draggedId] = { content: null, width: 1, isMerged: false };
      }

      // Clear the target area if it's merged
      if (targetCell.isMerged) {
        const targetWidth = newGrid[actualTargetId].width || 1;
        for (let i = 0; i < targetWidth; i++) {
          const clearId = `${targetDay}-${timeIndex + i}`;
          newGrid[clearId] = { content: null, width: 1, isMerged: false };
        }
      }

      // Set the new position
      newGrid[actualTargetId] = {
        content: draggedCell.content,
        width,
        isMerged: width > 1
      };

      // Set the spanning cells
      if (width > 1) {
        for (let i = 1; i < width; i++) {
          const newId = `${targetDay}-${timeIndex + i}`;
          newGrid[newId] = { content: null, width: 0, isMerged: true };
        }
      }

      return newGrid;
    });

    setDraggedId(null);
  };
  const handleCellClick = (cellId: string) => {
    if (!isEditMode) return;

    const cell = grid[cellId];
    if (!cell || cell.width === 0) return;

    // Check if clicking on a merged cell
    if (cell.width && cell.width > 1) {
      const [day, timeIndex] = cellId.split('-');
      const startIndex = parseInt(timeIndex);
      setSelectedCells(prev =>
        prev.filter(id => {
          const [selectedDay, selectedIndex] = id.split('-');
          return selectedDay !== day ||
            parseInt(selectedIndex) < startIndex ||
            parseInt(selectedIndex) >= startIndex + cell.width!;
        })
      );
      return;
    }

    // Only allow selecting adjacent cells in the same row
    if (selectedCells.length > 0) {
      const [lastDay, lastIndex] = selectedCells[selectedCells.length - 1].split('-');
      const [currentDay, currentIndex] = cellId.split('-');

      if (lastDay !== currentDay ||
        Math.abs(parseInt(currentIndex) - parseInt(lastIndex)) !== 1) {
        setSelectedCells([cellId]);
        return;
      }
    }

    setSelectedCells(prev =>
      prev.includes(cellId)
        ? prev.filter(id => id !== cellId)
        : [...prev, cellId]
    );
  };

  const mergeCells = () => {
    if (selectedCells.length < 2) return;

    // Sort cells by time index
    const sortedCells = selectedCells.sort((a, b) => {
      const aIndex = parseInt(a.split('-')[1]);
      const bIndex = parseInt(b.split('-')[1]);
      return aIndex - bIndex;
    });

    const [firstDay] = sortedCells[0].split('-');

    // Verify all cells are in the same day and consecutive
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

    const [firstId, ...otherIds] = sortedCells;
    const firstCell = grid[firstId];
    // const allEmpty = sortedCells.every(cellId => !grid[cellId].content);

    setGrid(prev => {
      const newGrid = { ...prev };

      // Create the merged cell
      newGrid[firstId] = {
        content: firstCell.content,
        width: sortedCells.length,
        isMerged: true
      };

      // Set other cells to width 0 and remove content
      otherIds.forEach(id => {
        newGrid[id] = { content: null, width: 0, isMerged: true };
      });

      return newGrid;
    });

    setSelectedCells([]);
  };

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
          h-28
          ${content
            ? `${content.color} border-2 border-transparent`
            : cell.isMerged
              ? 'border-2 border-gray-300 bg-gray-50'
              : 'border-2 border-dashed border-gray-200 bg-white'
          }
          ${isEditMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer' : ''}
          ${selectedCells.includes(cellId) ? 'ring-2 ring-blue-500' : ''}
          rounded-lg
          transition-all duration-200 ease-in-out
          overflow-hidden
        `}
        style={{
          gridColumn: `span ${width}`,
        }}
        draggable={isEditMode}
        onDragStart={() => handleDragStart(cellId)}
        onDragOver={e => e.preventDefault()}
        onDrop={() => handleDrop(cellId)}
        onClick={() => handleCellClick(cellId)}
      >
        {content ? (
          <div className="h-full p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="text-white font-semibold truncate">{content.subject}</div>
                {isEditMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 -mt-1 -mr-2 flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="text-white/90 text-sm mt-1 truncate">{content.teacher}</div>
            </div>
            <div className="text-white/80 text-xs font-medium truncate">
              {content.courseInfo}
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            {cell.isMerged ? 'Merged Empty Slot' : 'Empty Slot'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Class VII A TimeTable</h2>
          <Button variant="outline" size="sm" className="ml-4">
            <Copy className="w-4 h-4 mr-2" />
            Copy Schedule
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Edit Mode</span>
          <Switch
            checked={isEditMode}
            onCheckedChange={setIsEditMode}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>

      <Card className="p-6 shadow-lg">
        <div className="grid gap-3 min-w-[1000px] overflow-x-auto"
          style={{
            gridTemplateColumns: `120px repeat(${TIME_SLOTS.length}, minmax(120px, 1fr))`,
          }}>
          {/* Time header */}
          <div className="h-12 flex items-end justify-center font-medium text-gray-500">
            Time
          </div>
          {TIME_SLOTS.map(time => (
            <div key={time} className="h-12 flex items-end justify-center font-medium text-gray-600 border-b border-gray-200">
              {time}
            </div>
          ))}

          {/* Days and slots */}
          {DAYS.map(day => (
            <React.Fragment key={day}>
              <div className="font-medium text-gray-900 py-2 flex items-center justify-center border-r border-gray-200">
                {day}
              </div>
              {TIME_SLOTS.map((_, timeIndex) => renderCell(day, timeIndex))}
            </React.Fragment>
          ))}
        </div>

        {isEditMode && selectedCells.length > 1 && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={mergeCells}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Merge Selected Cells ({selectedCells.length})
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TimeTable;