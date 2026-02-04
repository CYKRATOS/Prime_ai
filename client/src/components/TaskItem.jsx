import { useState } from 'react';
import { Trash2, Edit2, ChevronDown } from 'lucide-react';

const TaskItem = ({ task, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);

    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdate(task._id, { title: newTitle });
        setIsEditing(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            default:
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between group hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative group/status">
                    <select
                        value={task.status}
                        onChange={(e) => onUpdate(task._id, { status: e.target.value })}
                        className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${getStatusColor(task.status)}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <ChevronDown size={14} className={`absolute right-2 top-1.5 pointer-events-none ${task.status === 'completed' ? 'text-green-800 dark:text-green-400' : task.status === 'in-progress' ? 'text-blue-800 dark:text-blue-400' : 'text-amber-800 dark:text-amber-400'}`} />
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="flex-1 mr-4">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:border-indigo-500 transition-colors"
                            autoFocus
                            onBlur={() => setIsEditing(false)}
                        />
                    </form>
                ) : (
                    <span className={`text-gray-700 dark:text-gray-200 font-medium ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                        {task.title}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={() => onDelete(task._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
