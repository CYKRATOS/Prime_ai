
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, Calendar } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, in-progress, completed
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    };

    const addTask = async (taskData) => {
        // Optimistic Update
        const tempId = Date.now().toString();
        const tempTask = {
            _id: tempId,
            ...taskData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            isTemp: true
        };

        setTasks((prev) => [tempTask, ...prev]);

        try {
            const { data } = await api.post('/tasks', taskData);
            setTasks((prev) => prev.map(t => t._id === tempId ? data : t));
            toast.success('Task created');
        } catch (error) {
            setTasks((prev) => prev.filter(t => t._id !== tempId));
            toast.error('Failed to create task');
        }
    };

    const updateTask = async (id, updates) => {
        // Optimistic Update
        const originalTasks = [...tasks];
        setTasks((prev) => prev.map((task) => (task._id === id ? { ...task, ...updates } : task)));

        try {
            const { data } = await api.put(`/tasks/${id}`, updates);
            // Ensure we keep the exact server data on success
            setTasks((prev) => prev.map((task) => (task._id === id ? data : task)));
        } catch (error) {
            setTasks(originalTasks);
            toast.error('Failed to update task');
        }
    };

    const deleteTask = async (id) => {
        // Optimistic Update
        const originalTasks = [...tasks];
        setTasks((prev) => prev.filter((task) => task._id !== id));

        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task deleted');
        } catch (error) {
            setTasks(originalTasks);
            toast.error('Failed to delete task');
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks
            .filter(task => {
                const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
    }, [tasks, searchQuery, statusFilter, sortBy]);

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-amber-600 dark:text-amber-500 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-blue-600 dark:text-blue-500 text-sm font-medium">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-green-600 dark:text-green-500 text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completed}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-10 text-white">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="mt-2 text-indigo-100 opacity-90">Manage your tasks efficiently.</p>
                </div>

                <div className="p-8">
                    <TaskForm onAdd={addTask} />

                    {/* Filters & Search Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="space-y-3 min-h-[300px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <div key={task._id} className={task.isTemp ? 'opacity-50 pointer-events-none' : ''}>
                                    <TaskItem
                                        task={task}
                                        onDelete={deleteTask}
                                        onUpdate={updateTask}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                    <Filter className="text-gray-400" size={24} />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks found</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

