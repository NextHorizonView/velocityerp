import React, { useState } from 'react';

interface Task {
    id: number;
    description: string;
    completed: boolean;
}

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, description: 'Distribute the books in all class', completed: false },
    ]);
    const [newTask, setNewTask] = useState<string>('');

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                { id: tasks.length + 1, description: newTask, completed: false },
            ]);
            setNewTask('');
        }
    };

    const toggleTaskCompletion = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    return (
        <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-[#576086] font-semibold mb-4">Today&apos;s Tasks</h2>
            <div className="space-y-4">
                {/* Add Task Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task for today"
                        className="w-full px-4 py-3 pr-12 rounded-lg bg-white shadow-sm text-[#576086] placeholder-[#A8B1C0] focus:ring-2 focus:ring-[#F7B696]"
                    />
                    <button
                        onClick={addTask}
                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-[#576086] rounded-full flex items-center justify-center text-white"
                    >
                        +
                    </button>
                </div>

                {/* Task List */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm break-words ${task.completed ? 'line-through text-gray-400' : ''}`}
                        >
                            <span className="text-[#576086] flex-1">{task.description}</span>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task.id)}
                                className="w-6 h-6 border-2 border-[#576086] rounded-full focus:ring-2 focus:ring-[#F7B696] appearance-none cursor-pointer checked:bg-[#576086]"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
