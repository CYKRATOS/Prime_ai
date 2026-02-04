import { useState } from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd({ title });
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent data-[autofocus]:ring-2 transition-all shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                    <Plus size={20} />
                    Add Task
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
